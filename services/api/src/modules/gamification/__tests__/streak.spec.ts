import { GamificationService } from '../gamification.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service.js';

// Mock PrismaService
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  achievement: {
    findUnique: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((args: any) =>
      Promise.resolve({ id: `ach-${args.data.code}`, ...args.data }),
    ),
  },
  userAchievement: {
    create: jest.fn(),
  },
} as unknown as PrismaService;

// Mock NotificationsService
const mockNotifications = {
  sendGamificationAchievement: jest.fn().mockResolvedValue({ results: [] }),
  sendGamificationLevelUp: jest.fn().mockResolvedValue({ results: [] }),
} as unknown as NotificationsService;

describe('GamificationService — Streak Tracking', () => {
  let service: GamificationService;

  beforeEach(() => {
    service = new GamificationService(mockPrisma, mockNotifications);
    jest.clearAllMocks();
  });

  describe('checkIn', () => {
    it('should start streak at 1 for first-time check-in', async () => {
      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        streakDays: 0,
        lastActiveAt: null,
        achievements: [],
      });
      mockPrisma.user.update = jest.fn().mockResolvedValue({});

      const result = await service.checkIn('user-1');

      expect(result.streakDays).toBe(1);
      expect(result.checkedInToday).toBe(true);
      expect(result.streakBroken).toBe(false);
      expect(result.xpAwarded).toBe(5);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({ streakDays: 1 }),
        }),
      );
    });

    it('should increment streak when checked in yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(10, 0, 0, 0);

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        streakDays: 3,
        lastActiveAt: yesterday,
        achievements: [],
      });
      mockPrisma.user.update = jest.fn().mockResolvedValue({});

      const result = await service.checkIn('user-1');

      expect(result.streakDays).toBe(4);
      expect(result.checkedInToday).toBe(true);
      expect(result.streakBroken).toBe(false);
    });

    it('should reset streak when missed a day', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      twoDaysAgo.setHours(10, 0, 0, 0);

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        streakDays: 5,
        lastActiveAt: twoDaysAgo,
        achievements: [],
      });
      mockPrisma.user.update = jest.fn().mockResolvedValue({});

      const result = await service.checkIn('user-1');

      expect(result.streakDays).toBe(1);
      expect(result.streakBroken).toBe(true);
    });

    it('should not change streak when already checked in today', async () => {
      const today = new Date();
      today.setHours(10, 0, 0, 0);

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        streakDays: 7,
        lastActiveAt: today,
        achievements: [],
      });

      const result = await service.checkIn('user-1');

      expect(result.streakDays).toBe(7);
      expect(result.checkedInToday).toBe(true);
      expect(result.xpAwarded).toBe(0);
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('should award bonus XP for 7-day streak', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(10, 0, 0, 0);

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        streakDays: 6,
        lastActiveAt: yesterday,
        achievements: [],
      });
      mockPrisma.user.update = jest.fn().mockResolvedValue({});

      const result = await service.checkIn('user-1');

      expect(result.streakDays).toBe(7);
      expect(result.xpAwarded).toBe(25); // base 5 + 20 bonus
    });

    it('should award bonus XP for 30-day streak', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(10, 0, 0, 0);

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        streakDays: 29,
        lastActiveAt: yesterday,
        achievements: [],
      });
      mockPrisma.user.update = jest.fn().mockResolvedValue({});

      const result = await service.checkIn('user-1');

      expect(result.streakDays).toBe(30);
      expect(result.xpAwarded).toBe(55); // base 5 + 50 bonus
    });
  });

  describe('getStreak', () => {
    it('should return streak info for active user', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(10, 0, 0, 0);

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        streakDays: 5,
        lastActiveAt: yesterday,
        achievements: [],
      });

      const result = await service.getStreak('user-1');

      expect(result.streakDays).toBe(5);
      expect(result.checkedInToday).toBe(false);
      expect(result.checkedInYesterday).toBe(true);
      expect(result.streakAtRisk).toBe(false);
    });

    it('should flag streak at risk when missed a day', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      twoDaysAgo.setHours(10, 0, 0, 0);

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        streakDays: 10,
        lastActiveAt: twoDaysAgo,
        achievements: [],
      });

      const result = await service.getStreak('user-1');

      expect(result.checkedInToday).toBe(false);
      expect(result.checkedInYesterday).toBe(false);
      expect(result.streakAtRisk).toBe(true);
    });

    it('should show checked in today', async () => {
      const today = new Date();
      today.setHours(10, 0, 0, 0);

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        streakDays: 3,
        lastActiveAt: today,
        achievements: [],
      });

      const result = await service.getStreak('user-1');

      expect(result.checkedInToday).toBe(true);
      expect(result.streakAtRisk).toBe(false);
    });
  });
});
