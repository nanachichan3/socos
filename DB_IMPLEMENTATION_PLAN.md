# SOCOS CRM — Database Implementation Plan

**Date:** 2026-04-25  
**Author:** CTO  
**Status:** Ready for implementation

---

## 1. Existing Schema

The Prisma schema is already implemented at:
```
services/api/prisma/schema.prisma
```

All entities are defined. The schema covers: User, Vault, VaultMember, Contact, ContactField, Interaction, Reminder, Task, Gift, Achievement, UserAchievement, Activity, CelebrationPack, Celebration, ContactCelebration, Session, DungeonMasterScenario, DMSession, DMSceneResponse.

---

## 2. Migration Strategy

### Phase 1: Core Schema (MVP)
```bash
# 1. Initialize Prisma in the API service
cd services/api
npx prisma init

# 2. Place schema at services/api/prisma/schema.prisma (already done)

# 3. Run initial migration
npx prisma migrate dev --name init_core

# 4. Generate Prisma Client
npx prisma generate
```

### Phase 2: Seed Data
```bash
# Seed system celebration packs (default holidays, birthdays)
npx prisma db seed
```

### Phase 3: Subsequent Changes
```bash
# After schema changes
npx prisma migrate dev --name add_<feature>
npx prisma generate
```

---

## 3. Index Recommendations

### High-Frequency Query Indexes (already in schema)

| Table | Index | Query Pattern |
|-------|-------|---------------|
| `Contact` | `@@index([lastContactedAt])` | "Contacts I haven't touched in 30 days" |
| `Contact` | `@@index([nextReminderAt])` | "Upcoming reminders" |
| `Contact` | `@@index([ownerId])` | Dashboard queries |
| `Interaction` | `@@index([contactId, occurredAt])` | Timeline of interactions |
| `Reminder` | `@@index([ownerId, scheduledAt])` | Pending reminders today |
| `DMSession` | `@@index([status, deadline])` | Active sessions needing processing |

### Additional Indexes to Add

```prisma
// On Contact - for "contacts needing attention" sorted by relationship score
@@index([ownerId, relationshipScore])

// On Contact - for label filtering
@@index([ownerId])

// On Interaction - for XP leaderboard queries
@@index([ownerId, xpEarned])

// On DMSession - for finding a user's active session
@@index([participants])
```

---

## 4. Seed Data Required

### System Celebration Packs (run once on deploy)

**Pack 1: Global Holidays**
- New Year's Day (Jan 1)
- Valentine's Day (Feb 14)
- Mother's Day (May, second Sunday)
- Father's Day (June, third Sunday)
- Halloween (Oct 31)
- Thanksgiving (US - fourth Thu Nov)
- Christmas (Dec 25)
- New Year's Eve (Dec 31)

**Pack 2: birthdays (generic)**
- Add as placeholder in onboarding

### Achievement Definitions

| Code | Name | XP | Requirement |
|------|------|----|------------|
| `first_contact` | First Contact | 50 | `{count: 1, object: "contacts"}` |
| `social_butterfly` | Social Butterfly | 200 | `{count: 100, object: "contacts"}` |
| `streak_7` | Week Warrior | 100 | `{count: 7, object: "streak_days"}` |
| `streak_30` | Streak Master | 250 | `{count: 30, object: "streak_days"}` |
| `quality_time_10` | Quality Time | 100 | `{count: 10, object: "interactions"}` |
| `quality_time_50` | Deep History | 300 | `{count: 50, object: "interactions"}` |
| `birthday_pro` | Birthday Pro | 100 | `{count: 10, object: "birthdays_logged"}` |
| `first_dm` | First Story | 50 | `{count: 1, object: "dm_sessions"}` |

---

## 5. API → Entity Mapping

### User
- `GET /api/users/me` → `prisma.user.findUnique(where: { id }})`
- `PATCH /api/users/me` → `prisma.user.update(where: { id }})`

### Contacts
- `GET /api/contacts` → `prisma.contact.findMany({ where: { ownerId }})`
- `POST /api/contacts` → `prisma.contact.create({ data })`
- `GET /api/contacts/:id` → `prisma.contact.findUnique({ where: { id, ownerId }})`
- `PATCH /api/contacts/:id` → `prisma.contact.update({ where: { id, ownerId }})`
- `DELETE /api/contacts/:id` → `prisma.contact.delete({ where: { id, ownerId }})`
- `GET /api/contacts/due` → `prisma.contact.findMany({ where: { nextReminderAt: { lte: now() } } })`

### Interactions
- `GET /api/contacts/:id/interactions` → `prisma.interaction.findMany({ where: { contactId } })`
- `POST /api/contacts/:id/interactions` → `prisma.interaction.create({ data })`

### Reminders
- `GET /api/reminders` → `prisma.reminder.findMany({ where: { ownerId } })`
- `POST /api/reminders` → `prisma.reminder.create({ data })`
- `PATCH /api/reminders/:id/complete` → `prisma.reminder.update({ data: { status: 'completed', completedAt: now() } })`

### Gamification
- `GET /api/user/stats` → `prisma.user.findUnique(include: { achievements: { include: { achievement: true } } })`
- `GET /api/achievements` → `prisma.achievement.findMany()`
- `POST /api/achievements/:id/claim` → `prisma.userAchievement.create({ data })`

### Celebrations
- `GET /api/celebrations/packs` → `prisma.celebrationPack.findMany({ where: { OR: [{ ownerId: null }, { ownerId }] } })`
- `GET /api/celebrations/upcoming` → `prisma.contactCelebration.findMany({ where: { status: 'active' }, include: { contact: true, celebration: true } })`

---

## 6. Phased Rollout Plan

### Phase 1: Core MVP (Week 1-2)
1. Set up Prisma + migrations in API service
2. User auth (magic link / OAuth via NextAuth)
3. Contact CRUD + ContactField
4. Interaction logging + XP system
5. Basic reminders

### Phase 2: Gamification (Week 2-3)
1. Achievement definitions + seed data
2. XP calculation triggers on interactions
3. Level-up logic
4. Achievement unlock notifications

### Phase 3: Celebrations (Week 3-4)
1. CelebrationPack + Celebration seed
2. Contact → Celebration attachment
3. Lunar date computation utilities
4. Upcoming celebrations view
5. Reminder generation

### Phase 4: Advanced (Later)
1. Vault sharing + multi-user
2. Dungeon Master scenarios
3. Gift tracking
4. Activity logging
5. Calendar integration

---

## 7. Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/socos?schema=public"
```

---

## 8. Immediate Next Steps

1. [ ] Run `npx prisma migrate dev --name init` in `services/api/`
2. [ ] Seed system achievement data
3. [ ] Seed celebration packs
4. [ ] Create database migrations GitHub Actions workflow
5. [ ] Document DATABASE_URL in deployment docs

---

*CTO | SOCOS CRM | 2026-04-25*
