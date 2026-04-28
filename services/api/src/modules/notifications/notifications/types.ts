/**
 * SOCOS Notification System - Type Definitions
 *
 * Providers:
 * - Email: Resend (simpler API, good for transactional)
 * - SMS: Twilio (reliable, global coverage)
 */

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export interface SmsOptions {
  to: string;
  body: string;
  from?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
  sentAt: Date;
}

// Template variables
export interface NotificationTemplateData {
  contactName?: string;
  userName?: string;
  reminderTitle?: string;
  reminderDate?: string;
  message?: string;
  ctaUrl?: string;
  ctaText?: string;
  // Achievement fields
  achievementName?: string;
  achievementDescription?: string;
  xpEarned?: string | number;
  // Level up fields
  level?: string;
  levelName?: string;
}

// Predefined templates
export const NOTIFICATION_TEMPLATES = {
  // Reminder notifications
  birthday: {
    subject: "🎂 {{contactName}}'s birthday is coming up!",
    emailTemplate: `
      <h2>Birthday Reminder</h2>
      <p>Hi {{userName}},</p>
      <p><strong>{{contactName}}</strong>'s birthday is on {{reminderDate}}!</p>
      <p>Consider sending them a message or planning a celebration.</p>
      {{#if ctaUrl}}
        <a href="{{ctaUrl}}">{{ctaText}}</a>
      {{/if}}
    `,
    smsTemplate: "🎂 {{contactName}}'s birthday is coming up on {{reminderDate}}!",
  },
  anniversary: {
    subject: "💕 {{contactName}}'s anniversary is coming up!",
    emailTemplate: `
      <h2>Anniversary Reminder</h2>
      <p>Hi {{userName}},</p>
      <p><strong>{{contactName}}</strong>'s anniversary is on {{reminderDate}}!</p>
      {{#if ctaUrl}}
        <a href="{{ctaUrl}}">{{ctaText}}</a>
      {{/if}}
    `,
    smsTemplate: "💕 {{contactName}}'s anniversary is coming up on {{reminderDate}}!",
  },
  followup: {
    subject: '📝 Follow up with {{contactName}}',
    emailTemplate: `
      <h2>Follow-up Reminder</h2>
      <p>Hi {{userName}},</p>
      <p>Time to check in with <strong>{{contactName}}</strong>!</p>
      {{#if message}}
        <p>{{message}}</p>
      {{/if}}
      {{#if ctaUrl}}
        <a href="{{ctaUrl}}">{{ctaText}}</a>
      {{/if}}
    `,
    smsTemplate: '📝 Time to check in with {{contactName}}!',
  },
  stale: {
    subject: "👋 It's been a while since you connected with {{contactName}}",
    emailTemplate: `
      <h2>Relationship Check-in</h2>
      <p>Hi {{userName}},</p>
      <p>It's been a while since you connected with <strong>{{contactName}}</strong>.</p>
      <p>A quick message could help maintain your relationship!</p>
      {{#if ctaUrl}}
        <a href="{{ctaUrl}}">{{ctaText}}</a>
      {{/if}}
    `,
    smsTemplate: "👋 It's been a while! Time for a check-in with {{contactName}}.",
  },
  celebration: {
    subject: "🎉 {{contactName}}'s celebration is coming up!",
    emailTemplate: `
      <h2>Celebration Reminder</h2>
      <p>Hi {{userName}},</p>
      <p><strong>{{contactName}}</strong> has a special celebration coming up on {{reminderDate}}!</p>
      <p>Consider sending your best wishes!</p>
      {{#if ctaUrl}}
        <a href="{{ctaUrl}}">{{ctaText}}</a>
      {{/if}}
    `,
    smsTemplate: "🎉 {{contactName}}'s celebration is coming up on {{reminderDate}}!",
  },

  // Achievement notifications
  achievement: {
    subject: '🏆 Achievement Unlocked: {{achievementName}}!',
    emailTemplate: `
      <h2>🏆 Achievement Unlocked!</h2>
      <p>Congratulations {{userName}}!</p>
      <p>You've earned: <strong>{{achievementName}}</strong></p>
      <p>{{achievementDescription}}</p>
      <p>+{{xpEarned}} XP earned!</p>
    `,
    smsTemplate: '🏆 Achievement unlocked: {{achievementName}}! +{{xpEarned}} XP',
  },

  // Level up notifications
  levelUp: {
    subject: "🎉 You've reached Level {{level}}!",
    emailTemplate: `
      <h2>🎉 Level Up!</h2>
      <p>Congratulations {{userName}}!</p>
      <p>You've reached <strong>Level {{level}}</strong> - {{levelName}}!</p>
      <p>Keep up the great work building your relationships!</p>
    `,
    smsTemplate: "🎉 Level up! You're now Level {{level}} - {{levelName}}!",
  },
} as const;
