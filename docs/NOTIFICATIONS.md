# SOCOS Notification System

**Status:** Implemented  
**Date:** 2026-04-26  
**CTO:** Implemented as part of CTO work session

---

## Overview

SOCOS uses a unified notification system supporting **email** and **SMS** channels. The system is provider-agnostic, allowing easy swapping between providers.

## Providers

| Channel | Provider | Status | Signup |
|---------|----------|--------|--------|
| **Email** | Resend | ✅ Implemented | [resend.com](https://resend.com) |
| **SMS** | Twilio | ✅ Implemented | [twilio.com](https://twilio.com) |

### Why Resend for Email?

- Simple, modern API
- Good deliverability
- Free tier available (100 emails/day)
- Great for transactional emails (reminders, achievements)

### Why Twilio for SMS?

- Global coverage
- Reliable delivery
- Supports MMS (future enhancement)
- Well-documented API

## Environment Variables

```env
# Resend (Email)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="SOCOS <noreply@socos.app>"

# Twilio (SMS)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1XXXXXXXXXX"
```

## API Endpoints

All endpoints require `X-User-Id` header.

### Email

```
POST /api/notifications/email                      # Send email to arbitrary address
POST /api/notifications/email/contact/:contactId  # Send email to contact
```

### SMS

```
POST /api/notifications/sms                       # Send SMS to arbitrary number
POST /api/notifications/sms/contact/:contactId    # Send SMS to contact
```

### Reminder Notifications

```
POST /api/notifications/reminders/:contactId     # Send reminder notification
```

### Status

```
GET  /api/notifications/status                     # Check provider configuration
```

## Notification Templates

### Birthday Reminder

**Email Subject:** `🎂 {contactName}'s birthday is coming up!`

**SMS:** `🎂 {contactName}'s birthday is coming up on {reminderDate}!`

### Anniversary Reminder

**Email Subject:** `💕 {contactName}'s anniversary is coming up!`

**SMS:** `💕 {contactName}'s anniversary is coming up on {reminderDate}!`

### Follow-up Reminder

**Email Subject:** `📝 Follow up with {contactName}`

**SMS:** `📝 Time to check in with {contactName}!`

### Stale Contact Reminder

**Email Subject:** `👋 It's been a while since you connected with {contactName}`

**SMS:** `👋 It's been a while! Time for a check-in with {contactName}.`

### Achievement Unlocked

**Email Subject:** `🏆 Achievement Unlocked: {achievementName}!`

**SMS:** `🏆 Achievement unlocked: {achievementName}! +{xpEarned} XP`

### Level Up

**Email Subject:** `🎉 You've reached Level {level}!`

**SMS:** `🎉 Level up! You're now Level {level} - {levelName}!`

## Architecture

```
NotificationsController (HTTP API)
    ↓
NotificationsService (Core logic + template rendering)
    ├── ResendEmailProvider (Email provider)
    └── TwilioSmsProvider (SMS provider)
    ↓
PrismaService (Contact lookups)
```

## Future Enhancements

1. **Push Notifications**: Add FCM/APNs for mobile push
2. **Notification Preferences**: Per-user opt-in/out for each notification type
3. **Notification History**: Log all sent notifications in DB
4. **Rate Limiting**: Prevent spam/abuse
5. **Scheduled Delivery**: Send notifications at optimal times
6. **Multi-channel Routing**: Try email first, fallback to SMS

## Files

```
services/api/src/modules/notifications/
├── notifications.module.ts           # NestJS module
├── notifications.controller.ts       # HTTP API layer
├── notifications.service.ts         # Core logic + templates
├── notifications/types.ts          # Types + templates
└── providers/
    ├── resend.provider.ts           # Resend email integration
    └── twilio.provider.ts           # Twilio SMS integration
```

## Testing

```bash
# Check if providers are configured
curl http://localhost:3001/api/notifications/status

# Send test email
curl -X POST http://localhost:3001/api/notifications/email \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <user-id>" \
  -d '{"to": "test@example.com", "subject": "Test", "text": "Hello!"}'

# Send test SMS
curl -X POST http://localhost:3001/api/notifications/sms \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <user-id>" \
  -d '{"to": "+1234567890", "body": "Hello from SOCOS!"}'
```
