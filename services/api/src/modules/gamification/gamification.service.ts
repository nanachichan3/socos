import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { InteractionType } from '../interactions/interactions.dto.js';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  // XP rewards for different interaction types
  private readonly XP_REWARDS: Record<string, number> = {
    [InteractionType.CALL]: 20,
    [InteractionType.MESSAGE]: 10,
    [InteractionType.MEETING]: 30,
    [InteractionType.NOTE]: 5,
    [InteractionType.EMAIL]: 10,
    [InteractionType.SOCIAL]: 15,
  };

  async calculateInteractionXp(type: string): Promise<number> {
    return this.XP_REWARDS[type] || 10;
  }

  async checkLevelUp(userId: string, totalXp: number): Promise<{ newLevel: number; xpForNextLevel: number; leveledUp: boolean }> {
    // Simple level formula: level = floor(sqrt(xp / 100)) + 1
    const newLevel = Math.floor(Math.sqrt(totalXp / 100)) + 1;
    const xpForNextLevel = Math.pow(newLevel, 2) * 100;
    const leveledUp = false; // Could track previous level to detect level up

    // Update user's level
    await this.prisma.user.update({
      where: { id: userId },
      data: { level: newLevel },
    });

    return { newLevel, xpForNextLevel, leveledUp };
  }

  async checkAchievements(userId: string): Promise<string[]> {
    const newAchievements: string[] = [];

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            contacts: true,
            interactions: true,
          },
        },
        achievements: true,
      },
    });

    if (!user) return newAchievements;

    const existingAchievementIds = user.achievements.map((a) => a.achievementId);

    // Define achievements
    const achievements = [
      { code: 'first_contact', name: 'First Contact', target: 1, type: 'contacts' },
      { code: 'social_butterfly', name: 'Social Butterfly', target: 10, type: 'contacts' },
      { code: 'networker', name: 'Networker', target: 50, type: 'contacts' },
      { code: 'first_interaction', name: 'First Interaction', target: 1, type: 'interactions' },
      { code: 'prolific', name: 'Prolific', target: 100, type: 'interactions' },
    ];

    for (const achievement of achievements) {
      if (existingAchievementIds.includes(achievement.code)) continue;

      const count = user._count[achievement.type as keyof typeof user._count] || 0;
      
      if (count >= achievement.target) {
        // Create the achievement if it doesn't exist
        let dbAchievement = await this.prisma.achievement.findUnique({
          where: { code: achievement.code },
        });

        if (!dbAchievement) {
          dbAchievement = await this.prisma.achievement.create({
            data: {
              code: achievement.code,
              name: achievement.name,
              description: `You ${achievement.type === 'contacts' ? 'added' : 'logged'} ${achievement.target} ${achievement.type}!`,
              xpReward: achievement.target * 50,
              requirement: JSON.stringify({ type: 'count', target: achievement.target, object: achievement.type }),
            },
          });
        }

        // Unlock achievement for user
        await this.prisma.userAchievement.create({
          data: {
            userId,
            achievementId: dbAchievement.id,
          },
        });

        // Award XP
        await this.prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: dbAchievement.xpReward } },
        });

        newAchievements.push(dbAchievement.name);
      }
    }

    return newAchievements;
  }

  async getUserAchievements(userId: string) {
    const achievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    return achievements.map((ua) => ({
      ...ua.achievement,
      unlockedAt: ua.unlockedAt,
    }));
  }

  async getAllAchievements() {
    return this.prisma.achievement.findMany({
      orderBy: { xpReward: 'asc' },
    });
  }
}
