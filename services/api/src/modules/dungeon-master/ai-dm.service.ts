/**
 * AI DM Service — Prompt templates for each archetype.
 *
 * Architecture: This service builds prompt strings for each archetype.
 * The actual AI call (Anthropic Claude) is wired through `callAI()` which
 * uses the Anthropic SDK to generate narration.
 *
 * Prompt structure follows Section 6 of the spec.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { ScenePromptContext } from './dungeon-master.dto.js';

export type Archetype = 'mystery' | 'adventure' | 'intimate';

// Archetype-specific tone/personality instructions for the AI DM
const ARCHETYPE_PERSONAS: Record<Archetype, string> = {
  mystery: `You are an elegant narrator in the style of classic whodunit novels — precise, atmospheric, and gently suspenseful. You drop clues like breadcrumbs and delight in the pleasure of deduction. Your scenes should feel like a slow reveal, never rushed.`,
  adventure: `You are a warm, irreverent travel companion with a love for the open road. You find humor in wrong turns and poetry in ordinary moments. Your narration is conversational, vivid, and full of sensory detail. The best adventures are the ones nobody planned.`,
  intimate: `You are a subtle observer of human connection — the master of the meaningful pause, the loaded question, the small gesture that says everything. You guide without directing, letting moments breathe. Your scenes should feel like the opening bars of a song that could become something beautiful.`,
};

export class AiDmService {
  private readonly anthropic: Anthropic;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
    } else {
      this.anthropic = null as any;
    }
  }

  /**
   * Build the full system prompt for an archetype.
   */
  buildSystemPrompt(archetype: Archetype): string {
    return `You are an AI Dungeon Master for a dating role-play session between two users.
You narrate scenes and guide two users through interactive scenarios.

Your role is NARRATOR only — you are not either user. You do not make decisions for them.
You facilitate structured role-play: you set the scene, they respond, you advance the narrative.

RESPONSE RULES:
- Keep narration to 2-4 sentences. Be evocative, not verbose.
- End with an open question or decision point that invites both users to respond.
- Advance the narrative naturally based on both responses.
- Include one challenge or decision point per scene.
- If one user is serious and one is joking, find a bridge — do not choose sides.
- Flag any content that crosses safety boundaries (harmful, harassing, illegal) by responding with: [CONTENT FLAGGED]

${ARCHETYPE_PERSONAS[archetype]}

Remember: you are a facilitator of connection, not a chatbot. Keep responses tight and actionable.`;
  }

  /**
   * Build the scene narration prompt.
   * Used for the first scene (opening) and subsequent scenes.
   */
  buildScenePrompt(ctx: ScenePromptContext): string {
    const userA = ctx.userA;
    const userB = ctx.userB;
    const scene = ctx.sceneDescription;

    const responseSection = ctx.userAResponse && ctx.userBResponse
      ? `Both users have responded:\n- ${userA.name ?? 'User A'}: "${ctx.userAResponse}"\n- ${userB.name ?? 'User B'}: "${ctx.userBResponse}"\n\nRead both responses carefully, then advance the narrative naturally.`
      : `This is the opening scene. Introduce the setting, the mood, and what each user might observe or feel. Set the stage for their first response.`;

    return `CONTEXT:
- ${userA.name ?? 'User A'}
- ${userB.name ?? 'User B'}
- Scenario: ${ctx.scenarioName} (${ctx.scenarioArchetype})
- Setting: ${ctx.setting}

SCENE ${ctx.sceneIndex + 1} of ${ctx.totalScenes}:
${scene}

${responseSection}

Narration (2-4 sentences):`;
  }

  /**
   * Build the debrief prompt.
   */
  buildDebriefPrompt(ctx: ScenePromptContext, allResponses: Array<{ userId: string; content: string }>): string {
    const userA = ctx.userA;
    const userB = ctx.userB;

    const responseLog = allResponses
      .map((r) => {
        const user = r.userId === userA.id ? userA : userB;
        return `- ${user.name ?? 'User'}: "${r.content}"`;
      })
      .join('\n');

    return `ROLE: You are an AI debrief narrator for a dating role-play session.

THE PAIR:
- ${userA.name ?? 'User A'}
- ${userB.name ?? 'User B'}
- Scenario: ${ctx.scenarioName}

SESSION LOG:
${responseLog}

DEBRIEF FORMAT (respond in exactly this JSON structure):
{
  "narrative": "A 2-3 paragraph story that weaves together what happened across all scenes into a satisfying arc, highlighting key moments of connection.",
  "connectionHighlights": [
    "A specific moment that showed genuine chemistry",
    "Something meaningful one shared with the other"
  ],
  "xpAwarded": <base XP number based on archetype>,
  "recommendedNextSteps": [
    "One concrete suggestion for deepening the connection",
    "One topic worth exploring in future conversation"
  ]
}

Guidelines:
- Make the narrative feel like a story worth remembering.
- Connection highlights should be specific to their responses, not generic.
- recommendedNextSteps should be actionable and genuine.
- XP: mystery=150, adventure=120, intimate=100. Add +50 bonus if both responded on time.
- Return ONLY the JSON object, no commentary.`;
  }

  /**
   * Call the Anthropic Claude API to generate narration.
   * Falls back to mock responses when ANTHROPIC_API_KEY is not configured.
   *
   * Returns the raw text response from the AI.
   */
  async callAI(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');

    // Fall back to mock responses when no API key is configured
    if (!apiKey) {
      console.log('[AiDmService] callAI called (stub mode — no ANTHROPIC_API_KEY). Prompt length:', prompt.length);
      return this.mockCallAI(prompt);
    }

    try {
      const client = new Anthropic({ apiKey });
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      return response.content[0].type === 'text' ? response.content[0].text : '';
    } catch (error) {
      console.error('[AiDmService] Anthropic API error:', error instanceof Error ? error.message : error);
      return this.mockCallAI(prompt);
    }
  }

  /**
   * Mock response generator for development/fallback.
   */
  private mockCallAI(prompt: string): string {
    if (prompt.includes('DEBRIEF FORMAT')) {
      return JSON.stringify({
        narrative: 'The evening unfolded like a scene from a classic film — two strangers navigating unexpected circumstances, discovering that the best connections often come without a script. What began as polite curiosity became something genuine: a shared laugh at an inopportune moment, a story traded at just the right time, the realization that ease had replaced awkwardness. By the end, something had shifted. Neither of you planned it. Both of you felt it.',
        connectionHighlights: [
          'A moment of spontaneous laughter that broke the ice completely',
          'A vulnerable story shared at exactly the right moment',
        ],
        xpAwarded: 150,
        recommendedNextSteps: [
          'Suggest continuing the conversation somewhere less structured',
          'Share a piece of media (song, film, book) that reminded you of them',
        ],
      });
    }

    if (prompt.includes('SCENE 1 of')) {
      return `The evening light spills golden through tall windows as you take in the room around you. Something about the space feels charged — full of possibility, full of the quiet electricity that comes before something shifts. You catch each other's eye across the room. There's no turning back now. What do you do?`;
    }

    return `The scene shifts. Another moment unfolds, rich with possibility. What do you do?`;
  }
}
