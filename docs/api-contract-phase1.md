# SOCOS Phase 1 API Contract

**Version:** 1.0  
**Date:** 2026-04-26  
**Author:** CTO  
**Status:** Draft — for CEO Review  
**Stage:** Phase 1 MVP

> Defines REST API endpoints for SOCOS Phase 1 MVP: CRUD for contacts, reminders, and gamification.

---

## Conventions

### Base URL
```
/api/v1/{resource}
```

### Authentication
NextAuth.js session cookie. All endpoints except `/api/v1/auth/*` require authentication.

### Response Shape
```typescript
// Success
{ "data": T }

// Error
{ "error": string, "code": string }
```

### Pagination
```
?page=1&limit=20
```
Response includes `{ data: T[], meta: { page, limit, total, totalPages } }`.

### Filtering
```
?label=friend&sort=lastContactedAt&order=desc
```

---

## Auth

### `POST /api/v1/auth/register`
Create an account.

**Request:**
```json
{ "email": "string", "password": "string", "name": "string" }
```

**Response `201`:**
```json
{ "data": { "id": "cuid", "email": "...", "name": "..." } }
```

---

### `POST /api/v1/auth/[...nextauth]`
NextAuth.js handler (GET/POST). Handles sign-in/sign-out.

---

## Contacts

### `GET /api/v1/contacts`
List all contacts for authenticated user.

**Query params:** `page`, `limit`, `label`, `tags`, `sort`, `order`, `search`

**Response `200`:**
```json
{
  "data": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "company": "string",
      "jobTitle": "string",
      "photo": "string?",
      "labels": ["string"],
      "tags": ["string"],
      "relationshipScore": 50,
      "lastContactedAt": "ISO8601?",
      "nextReminderAt": "ISO8601?",
      "birthday": "ISO8601?",
      "anniversary": "ISO8601?"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

---

### `POST /api/v1/contacts`
Create a contact.

**Request:**
```json
{
  "firstName": "string",
  "lastName": "string?",
  "middleName": "string?",
  "nickname": "string?",
  "photo": "string?",
  "bio": "string?",
  "company": "string?",
  "jobTitle": "string?",
  "birthday": "ISO8601?",
  "anniversary": "ISO8601?",
  "labels": ["string?"],
  "tags": ["string?"],
  "socialLinks": { "linkedin": "string?", "twitter": "string?" },
  "firstMetDate": "ISO8601?",
  "firstMetContext": "string?"
}
```

**Response `201`:**
```json
{ "data": { /* Contact object */ } }
```

---

### `GET /api/v1/contacts/:id`
Get a single contact with full details.

**Response `200`:**
```json
{
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string?",
    "company": "string?",
    "jobTitle": "string?",
    "photo": "string?",
    "bio": "string?",
    "labels": ["string"],
    "tags": ["string"],
    "socialLinks": {},
    "birthday": "ISO8601?",
    "anniversary": "ISO8601?",
    "relationshipScore": 50,
    "lastContactedAt": "ISO8601?",
    "nextReminderAt": "ISO8601?",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "fields": [{ "id": "string", "type": "email", "value": "...", "label": "work", "isPrimary": true }],
    "interactions": [{ "id": "string", "type": "call", "title": "...", "occurredAt": "ISO8601", "xpEarned": 10 }],
    "reminders": [{ "id": "string", "type": "followup", "title": "...", "scheduledAt": "ISO8601", "status": "pending" }]
  }
}
```

---

### `PUT /api/v1/contacts/:id`
Update a contact (partial update).

**Request:** Same shape as POST, all fields optional.

**Response `200`:**
```json
{ "data": { /* Updated Contact object */ } }
```

---

### `DELETE /api/v1/contacts/:id`
Soft-delete a contact.

**Response `204`:** No content.

---

### `POST /api/v1/contacts/:id/fields`
Add a contact field (email, phone, address, etc.).

**Request:**
```json
{ "type": "email|phone|address|website|social|other", "value": "string", "label": "string?", "isPrimary": false }
```

**Response `201`:**
```json
{ "data": { "id": "string", "type": "email", "value": "...", "label": "work", "isPrimary": true } }
```

---

### `DELETE /api/v1/contacts/:id/fields/:fieldId`
Remove a contact field.

**Response `204`:**

---

## Interactions

### `GET /api/v1/contacts/:id/interactions`
List interactions for a contact.

**Query:** `page`, `limit`, `type`

**Response `200`:**
```json
{
  "data": [
    {
      "id": "string",
      "type": "call|message|meeting|note|email|social",
      "title": "string?",
      "content": "string?",
      "summary": "string?",
      "occurredAt": "ISO8601",
      "duration": 30,
      "location": "string?",
      "xpEarned": 10,
      "createdAt": "ISO8601"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 }
}
```

---

### `POST /api/v1/contacts/:id/interactions`
Log a new interaction.

**Request:**
```json
{
  "type": "call|message|meeting|note|email|social",
  "title": "string?",
  "content": "string?",
  "occurredAt": "ISO8601?",
  "duration": 30,
  "location": "string?"
}
```

**Response `201`:**
```json
{
  "data": {
    "id": "string",
    "type": "call",
    "title": "...",
    "xpEarned": 10,
    "occurredAt": "ISO8601"
  }
}
```

> **Side effect:** Updates `Contact.lastContactedAt`. Awards XP to user.

---

## Reminders

### `GET /api/v1/reminders`
List reminders for authenticated user.

**Query:** `page`, `limit`, `status` (pending/completed/skipped), `type`, `contactId`

**Response `200`:**
```json
{
  "data": [
    {
      "id": "string",
      "contactId": "string",
      "contact": { "id": "string", "firstName": "Aria", "lastName": "Chen", "photo": "string?" },
      "type": "birthday|followup|custom|anniversary",
      "title": "string",
      "description": "string?",
      "scheduledAt": "ISO8601",
      "repeatInterval": "yearly?",
      "isRecurring": false,
      "status": "pending|completed|skipped",
      "completedAt": "ISO8601?"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 12, "totalPages": 1 }
}
```

---

### `POST /api/v1/reminders`
Create a reminder for a contact.

**Request:**
```json
{
  "contactId": "string",
  "type": "birthday|followup|custom|anniversary",
  "title": "string",
  "description": "string?",
  "scheduledAt": "ISO8601",
  "repeatInterval": "daily|weekly|monthly|yearly?",
  "isRecurring": false
}
```

**Response `201`:**
```json
{ "data": { /* Reminder object */ } }
```

---

### `PUT /api/v1/reminders/:id`
Update a reminder.

**Response `200`:**
```json
{ "data": { /* Updated Reminder */ } }
```

---

### `PUT /api/v1/reminders/:id/complete`
Mark a reminder as completed. Awards XP.

**Response `200`:**
```json
{ "data": { "id": "string", "status": "completed", "completedAt": "ISO8601" } }
```

---

### `DELETE /api/v1/reminders/:id`
Delete a reminder.

**Response `204`:**

---

## Gamification

### `GET /api/v1/user/stats`
Get authenticated user's gamification stats.

**Response `200`:**
```json
{
  "data": {
    "xp": 340,
    "level": 3,
    "streakDays": 5,
    "lastActiveAt": "ISO8601",
    "achievements": [
      { "id": "string", "type": "first_contact", "name": "First Contact", "description": "Add your first contact", "unlockedAt": "ISO8601", "xpReward": 50 }
    ]
  }
}
```

---

### `GET /api/v1/achievements`
List all available achievements (locked + unlocked).

**Response `200`:**
```json
{
  "data": [
    {
      "id": "string",
      "type": "first_contact",
      "name": "First Contact",
      "description": "Add your first contact",
      "xpReward": 50,
      "unlocked": true,
      "unlockedAt": "ISO8601?"
    }
  ]
}
```

---

### `POST /api/v1/achievements/:id/claim`
Claim a newly unlocked achievement.

**Response `200`:**
```json
{ "data": { "id": "string", "claimedAt": "ISO8601", "xpAwarded": 50 } }
```

---

## Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | No access to this resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid request body |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Implementation Notes

- All timestamps in ISO 8601 format (UTC preferred)
- Use Prisma transactions for XP-gaining operations (interaction + achievement checks)
- Row-level authorization: `contact.vault.ownerId === session.user.id`
- XP table: Interaction = +10, Reminder complete = +20, Achievement = +100
- Level thresholds: 1→100XP, 2→300XP total, 3→600XP, 4→1000XP, 5→1500XP...

---

*API contract v1.0 | CTO | 2026-04-26*
