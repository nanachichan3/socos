/**
 * Reminders Module
 */

import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller.js';
import { RemindersService } from './reminders.service.js';
import { AgentRemindersService } from './agent-reminders.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Module({
  controllers: [RemindersController],
  providers: [RemindersService, AgentRemindersService, PrismaService, NotificationsService],
  exports: [RemindersService, AgentRemindersService],
})
export class RemindersModule {}
