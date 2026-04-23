import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AiDmService } from './ai-dm.service.js';
import {
  CreateSessionDto,
  SubmitResponseDto,
  ScenePromptContext,
  DMScenarioDto,
  DMSessionDto,
  DebriefDto,
} from './dungeon-master.dto.js';
import { SCENARIOS, DMScenario } from './dm-scenarios.data.js';
import {
  dmSessionMachine,
  stateValueToStatus,
  statusToStateValue,
  getNextState,
  isSessionExpired,
} from './dm-state-machine.js';
import { Interpreter } from 'xstate';
import { assign } from 'xstate';

// How long each scene window lasts (48 hours)
const SCENE_DEADLINE_HOURS = 48;

@Injectable()
export class DungeonMasterService {
  private actor: Interpreter<any>;

  constructor(
    private prisma: PrismaService,
    private aiDm: AiDmService,
  ) {
    // Initialize XState actor
    this.actor = new Interpreter(dmSessionMachine);
    this.actor.start();
  }

  // ===================== SCENARIOS =====================

  /**
   * List all available scenario archetypes.
   * Seeds DB on first call if empty.
   */
  async listScenarios(): Promise<DMScenarioDto[]> {
    await this.seedScenarios();

    const scenarios = await this.prisma.dungeonMasterScenario.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return scenarios.map(this.mapScenarioToDto);
  }

  // ===================== SESSIONS =====================

  /**
   * Create a new DM session between two matched users.
   * One user initiates; both participants stored.
   */
  async createSession(dto: CreateSessionDto): Promise<DMSessionDto> {
    if (dto.participants.length !== 2) {
      throw new BadRequestException('Exactly 2 participants required for a DM session.');
    }

    const scenario = await this.prisma.dungeonMasterScenario.findUnique({
      where: { id: dto.scenarioId },
    });

    if (!scenario) {
      throw new NotFoundException(`Scenario ${dto.scenarioId} not found.`);
    }

    const session = await this.prisma.dMsession.create({
      data: {
        scenarioId: dto.scenarioId,
        participants: dto.participants,
        currentScene: 0,
        status: 'waiting',
        deadline: new Date(Date.now() + SCENE_DEADLINE_HOURS * 60 * 60 * 1000),
      },
      include: {
        scenario: true,
        responses: true,
      },
    });

    // Advance state machine to active
    this.actor.send({ type: 'START' });

    return this.mapSessionToDto(session);
  }

  /**
   * Get session by ID. Checks for expiration.
   */
  async getSession(sessionId: string): Promise<DMSessionDto> {
    const session = await this.prisma.dMsession.findUnique({
      where: { id: sessionId },
      include: {
        scenario: true,
        responses: {
          orderBy: { submittedAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found.`);
    }

    // Check deadline-based expiration
    if (isSessionExpired(session.deadline) && session.status !== 'completed' && session.status !== 'expired') {
      await this.prisma.dMsession.update({
        where: { id: sessionId },
        data: { status: 'expired' },
      });
      session.status = 'expired';
    }

    return this.mapSessionToDto(session);
  }

  /**
   * Begin the next scene (advance from active → scene_submission).
   * This generates the AI narration for the new scene.
   */
  async beginScene(sessionId: string, userId: string): Promise<DMSessionDto> {
    const session = await this.getSession(sessionId);

    if (!session.participants.includes(userId)) {
      throw new BadRequestException('You are not a participant in this session.');
    }

    if (session.status !== 'active') {
      throw new BadRequestException(`Session must be active to begin a scene. Current: ${session.status}`);
    }

    // Generate AI narration for this scene
    const narrative = await this.generateSceneNarrative(session, session.currentScene);

    const updated = await this.prisma.dMsession.update({
      where: { id: sessionId },
      data: {
        status: 'scene_submission',
        currentNarrative: narrative,
        deadline: new Date(Date.now() + SCENE_DEADLINE_HOURS * 60 * 60 * 1000),
      },
      include: {
        scenario: true,
        responses: { orderBy: { submittedAt: 'asc' } },
      },
    });

    this.actor.send({ type: 'BEGIN_SCENE' });

    return this.mapSessionToDto(updated);
  }

  /**
   * Submit a user's response for the current scene.
   */
  async submitResponse(
    sessionId: string,
    userId: string,
    dto: SubmitResponseDto,
  ): Promise<DMSessionDto> {
    const session = await this.getSession(sessionId);

    if (!session.participants.includes(userId)) {
      throw new BadRequestException('You are not a participant in this session.');
    }

    if (session.status !== 'scene_submission') {
      throw new BadRequestException(`Session must be in scene_submission to respond. Current: ${session.status}`);
    }

    // Check if already responded for this scene
    const existing = await this.prisma.dMSceneResponse.findFirst({
      where: { sessionId, userId, sceneIndex: session.currentScene },
    });

    if (existing) {
      throw new BadRequestException('You have already responded to this scene.');
    }

    // Save the response
    await this.prisma.dMSceneResponse.create({
      data: {
        sessionId,
        userId,
        sceneIndex: session.currentScene,
        content: dto.content,
      },
    });

    this.actor.send({ type: 'SUBMIT_RESPONSE', userId });

    // Reload responses
    const updated = await this.prisma.dMsession.findUnique({
      where: { id: sessionId },
      include: {
        scenario: true,
        responses: { orderBy: { submittedAt: 'asc' } },
      },
    });

    // If both responded, advance to scene_review
    const allResponses = updated!.responses.filter((r) => r.sceneIndex === updated!.currentScene);
    if (allResponses.length >= 2) {
      await this.prisma.dMsession.update({
        where: { id: sessionId },
        data: { status: 'scene_review' },
      });
      this.actor.send({ type: 'REVIEW_SCENE' });
    }

    const final = await this.prisma.dMsession.findUnique({
      where: { id: sessionId },
      include: {
        scenario: true,
        responses: { orderBy: { submittedAt: 'asc' } },
      },
    });

    return this.mapSessionToDto(final!);
  }

  /**
   * Advance to the next scene (called after AI synthesizes).
   */
  async advanceScene(sessionId: string): Promise<DMSessionDto> {
    const session = await this.getSession(sessionId);

    if (session.status !== 'scene_review') {
      throw new BadRequestException(`Must be in scene_review to advance. Current: ${session.status}`);
    }

    const nextState = getNextState(session.currentScene, session.scenario.totalScenes);

    if (nextState === 'debrief') {
      await this.prisma.dMsession.update({
        where: { id: sessionId },
        data: { status: 'debrief', currentScene: session.currentScene + 1 },
      });
      this.actor.send({ type: 'BEGIN_DEBRIEF' });
    } else {
      await this.prisma.dMsession.update({
        where: { id: sessionId },
        data: {
          status: 'active',
          currentScene: session.currentScene + 1,
          currentNarrative: null,
        },
      });
      this.actor.send({ type: 'ADVANCE_SCENE' });
    }

    const updated = await this.prisma.dMsession.findUnique({
      where: { id: sessionId },
      include: {
        scenario: true,
        responses: { orderBy: { submittedAt: 'asc' } },
      },
    });

    return this.mapSessionToDto(updated!);
  }

  /**
   * Get AI debrief after session reaches debrief state.
   */
  async getDebrief(sessionId: string, userId: string): Promise<DebriefDto> {
    const session = await this.getSession(sessionId);

    if (!session.participants.includes(userId)) {
      throw new BadRequestException('You are not a participant in this session.');
    }

    if (session.status !== 'debrief' && session.status !== 'completed') {
      throw new BadRequestException(`Debrief not available until session is in debrief/completed. Current: ${session.status}`);
    }

    // Collect all responses
    const responses = await this.prisma.dMSceneResponse.findMany({
      where: { sessionId },
      orderBy: { submittedAt: 'asc' },
    });

    // Get user profiles
    const [userAId, userBId] = session.participants;
    const [userA, userB] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userAId }, select: { id: true, name: true, bio: true } }),
      this.prisma.user.findUnique({ where: { id: userBId }, select: { id: true, name: true, bio: true } }),
    ]);

    if (!userA || !userB) {
      throw new NotFoundException('One or both user profiles not found.');
    }

    const ctx: ScenePromptContext = {
      scenarioName: session.scenario.name,
      scenarioArchetype: session.scenario.archetype,
      setting: 'Debrief',
      userA,
      userB,
      sceneIndex: session.currentScene,
      totalScenes: session.scenario.totalScenes,
      sceneDescription: 'Final debrief',
      userAResponse: null,
      userBResponse: null,
    };

    const prompt = this.aiDm.buildDebriefPrompt(
      ctx,
      responses.map((r) => ({ userId: r.userId, content: r.content })),
    );

    const rawDebrief = await this.aiDm.callAI(prompt);

    let debrief: DebriefDto;
    try {
      debrief = JSON.parse(rawDebrief);
    } catch {
      throw new BadRequestException('Failed to parse AI debrief response.');
    }

    // Award XP
    for (const participantId of session.participants) {
      await this.prisma.user.update({
        where: { id: participantId },
        data: { xp: { increment: debrief.xpAwarded } },
      });
    }

    // Mark session completed
    await this.prisma.dMsession.update({
      where: { id: sessionId },
      data: { status: 'completed' },
    });
    this.actor.send({ type: 'COMPLETE' });

    return debrief;
  }

  // ===================== PRIVATE HELPERS =====================

  /**
   * Generate AI narration for a specific scene.
   */
  private async generateSceneNarrative(session: DMSessionDto, sceneIndex: number): Promise<string> {
    const scenario = session.scenario;
    const scenes = scenario.scenes as Array<{ description: string; setting: string }>;
    const sceneConfig = scenes[sceneIndex] ?? scenes[0];

    const [userAId, userBId] = session.participants;
    const [userA, userB] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userAId }, select: { id: true, name: true, bio: true } }),
      this.prisma.user.findUnique({ where: { id: userBId }, select: { id: true, name: true, bio: true } }),
    ]);

    if (!userA || !userB) {
      throw new NotFoundException('One or both user profiles not found.');
    }

    // Check for prior responses for this scene
    const responses = await this.prisma.dMSceneResponse.findMany({
      where: { sessionId: session.id, sceneIndex },
    });

    const userAResponse = responses.find((r) => r.userId === userAId);
    const userBResponse = responses.find((r) => r.userId === userBId);

    const ctx: ScenePromptContext = {
      scenarioName: scenario.name,
      scenarioArchetype: scenario.archetype as 'mystery' | 'adventure' | 'intimate',
      setting: sceneConfig.setting,
      userA,
      userB,
      sceneIndex,
      totalScenes: scenario.totalScenes,
      sceneDescription: sceneConfig.description,
      userAResponse: userAResponse?.content ?? null,
      userBResponse: userBResponse?.content ?? null,
    };

    const prompt = this.aiDm.buildScenePrompt(ctx);
    return this.aiDm.callAI(prompt);
  }

  /**
   * Seed scenario DB if empty.
   */
  private async seedScenarios(): Promise<void> {
    const count = await this.prisma.dungeonMasterScenario.count();
    if (count > 0) return;

    for (const scenario of SCENARIOS) {
      await this.prisma.dungeonMasterScenario.create({
        data: {
          id: scenario.id,
          name: scenario.name,
          archetype: scenario.archetype,
          description: scenario.description,
          openingText: scenario.openingText,
          scenes: scenario.scenes,
          xpReward: scenario.xpReward,
          totalScenes: scenario.totalScenes,
        },
      });
    }
  }

  // ===================== MAPPERS =====================

  private mapScenarioToDto(s: any): DMScenarioDto {
    return {
      id: s.id,
      name: s.name,
      archetype: s.archetype,
      description: s.description,
      openingText: s.openingText,
      scenes: s.scenes,
      xpReward: s.xpReward,
      totalScenes: s.totalScenes,
    };
  }

  private mapSessionToDto(s: any): DMSessionDto {
    return {
      id: s.id,
      scenarioId: s.scenarioId,
      scenario: this.mapScenarioToDto(s.scenario),
      participants: s.participants,
      currentScene: s.currentScene,
      status: s.status,
      currentNarrative: s.currentNarrative ?? null,
      startedAt: s.startedAt ?? null,
      deadline: s.deadline ?? null,
      createdAt: s.createdAt,
      responses: (s.responses ?? []).map((r: any) => ({
        id: r.id,
        sessionId: r.sessionId,
        userId: r.userId,
        sceneIndex: r.sceneIndex,
        content: r.content,
        submittedAt: r.submittedAt,
      })),
    };
  }
}
