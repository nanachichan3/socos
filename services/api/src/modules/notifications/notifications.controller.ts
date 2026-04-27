/**
 * Notifications Controller
 *
 * Provides REST endpoints for sending notifications.
 * Note: For MVP, we keep this simple. In production, add:
 * - Rate limiting
 * - User preferences
 * - Notification history logging
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service.js';

@ApiTags('Notifications')
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ========== Email ==========

  @Post('email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send an email' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async sendEmail(
    @Body()
    body: {
      to: string;
      subject: string;
      html?: string;
      text?: string;
    },
  ) {
    if (!this.notificationsService.isEmailConfigured()) {
      return {
        success: false,
        error: 'Email provider not configured',
        provider: 'resend',
        sentAt: new Date(),
      };
    }
    return this.notificationsService.sendEmail(body);
  }

  @Post('email/contact/:contactId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send an email to a contact' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async sendEmailToContact(
    @Headers('x-user-id') userId: string,
    @Param('contactId') contactId: string,
    @Body()
    body: {
      subject: string;
      html?: string;
      text?: string;
    },
  ) {
    if (!this.notificationsService.isEmailConfigured()) {
      return {
        success: false,
        error: 'Email provider not configured',
        provider: 'resend',
        sentAt: new Date(),
      };
    }
    return this.notificationsService.sendEmailToContact(userId, contactId, body);
  }

  // ========== SMS ==========

  @Post('sms')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send an SMS' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async sendSms(
    @Body()
    body: {
      to: string;
      body: string;
    },
  ) {
    if (!this.notificationsService.isSmsConfigured()) {
      return {
        success: false,
        error: 'SMS provider not configured',
        provider: 'twilio',
        sentAt: new Date(),
      };
    }
    return this.notificationsService.sendSms(body);
  }

  @Post('sms/contact/:contactId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send an SMS to a contact' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async sendSmsToContact(
    @Headers('x-user-id') userId: string,
    @Param('contactId') contactId: string,
    @Body() body: { message: string },
  ) {
    if (!this.notificationsService.isSmsConfigured()) {
      return {
        success: false,
        error: 'SMS provider not configured',
        provider: 'twilio',
        sentAt: new Date(),
      };
    }
    return this.notificationsService.sendSmsToContact(userId, contactId, body.message);
  }

  // ========== Reminder Notifications ==========

  @Post('reminders/:contactId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send reminder notification for a contact' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async sendReminderNotification(
    @Headers('x-user-id') userId: string,
    @Param('contactId') contactId: string,
    @Body()
    body: {
      type: 'birthday' | 'anniversary' | 'followup' | 'stale';
      date?: string;
      message?: string;
    },
  ) {
    const contact = await this.notificationsService['prisma'].contact.findFirst({
      where: { id: contactId },
      select: { firstName: true, lastName: true },
    });

    if (!contact) {
      return { results: [{ success: false, error: 'Contact not found', provider: 'system', sentAt: new Date() }] };
    }

    return this.notificationsService.sendReminderNotification(userId, {
      contactName: `${contact.firstName}${contact.lastName ? ` ${contact.lastName}` : ''}`,
      type: body.type,
      date: body.date,
      message: body.message,
    });
  }

  // ========== Status ==========

  @Get('status')
  @ApiOperation({ summary: 'Check notification provider status' })
  async getStatus() {
    return {
      email: this.notificationsService.isEmailConfigured()
        ? { configured: true, provider: 'resend' }
        : { configured: false, provider: 'resend', message: 'Set RESEND_API_KEY to enable' },
      sms: this.notificationsService.isSmsConfigured()
        ? { configured: true, provider: 'twilio' }
        : { configured: false, provider: 'twilio', message: 'Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to enable' },
    };
  }

  // ========== Cron: Check Due Reminders ==========

  @Get('check-due')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check for due reminders and send notifications (cron job endpoint)' })
  async checkDueReminders() {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // Find pending reminders that are due (scheduledAt within last 5 minutes)
    const dueReminders = await this.notificationsService['prisma'].reminder.findMany({
      where: {
        status: 'pending',
        scheduledAt: {
          gte: fiveMinutesAgo,
          lte: now,
        },
      },
      include: {
        contact: {
          select: { id: true, firstName: true, lastName: true },
        },
        owner: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    const results: Array<{ reminderId: string; contactName: string; sent: boolean; error?: string }> = [];

    for (const reminder of dueReminders) {
      if (!['birthday', 'anniversary', 'followup'].includes(reminder.type)) {
        continue;
      }

      const contactName = `${reminder.contact.firstName}${reminder.contact.lastName ? ` ${reminder.contact.lastName}` : ''}`;

      try {
        await this.notificationsService.sendReminderNotification(reminder.ownerId, {
          contactName,
          type: reminder.type as 'birthday' | 'anniversary' | 'followup',
          date: reminder.scheduledAt.toLocaleDateString(),
          message: reminder.description || undefined,
        });
        results.push({ reminderId: reminder.id, contactName, sent: true });
      } catch (error) {
        results.push({ reminderId: reminder.id, contactName, sent: false, error: String(error) });
      }
    }

    return {
      checkedAt: now.toISOString(),
      count: dueReminders.length,
      results,
    };
  }
}
