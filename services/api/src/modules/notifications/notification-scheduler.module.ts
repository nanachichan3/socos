/**
 * Notification Scheduler Module
 *
 * Provides cron-based automatic notification delivery for:
 * - Due reminders (every 5 minutes)
 * - Upcoming celebrations (every hour)
 * - Overdue reminder status updates (every 30 minutes)
 */

import { Module } from '@nestjs/common';
import { NotificationSchedulerService } from './notification-scheduler.service.js';
import { NotificationsModule } from './notifications.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  imports: [NotificationsModule],
  providers: [NotificationSchedulerService, PrismaService],
  exports: [NotificationSchedulerService],
})
export class NotificationSchedulerModule {}
