# SOCOS - Social Operating System

> Gamified, Agent-First Personal CRM

## Vision

An open-source, AI-powered personal CRM that helps you build meaningful relationships through gamification and intelligent automation. Think: "Notion for relationships meets a personal AI assistant."

---

## Core Philosophy

1. **Agent-First** - AI agents proactively manage your relationships
2. **Gamified** - Level up your social skills, earn achievements
3. **Privacy-First** - Your data, your server, your rules
4. **Open Source** - Built by the community, for the community

---

## Key Differentiators (vs Monica/Twenty)

| Feature | Monica | Twenty | **Socos** |
|---------|--------|--------|-----------|
| AI Agents | ❌ | ⚠️ Basic | ✅ Full agent automation |
| Gamification | ❌ | ❌ | ✅ XP, levels, achievements |
| Personal focus | ✅ | Business | ✅ Built for individuals |
| API-first | ❌ | ✅ | ✅ Built for agents |
| Self-hosted | ✅ | ✅ | ✅ |

---

## Core Modules

### 1. Contact Management
- **Profiles**: Name, photo, bio, social links, company, job title
- **Contact info**: Phone, email, addresses, social handles
- **Tags & Labels**: Custom categories (Networking, Dating, Friends, etc.)
- **Relationship mapping**: How you know them, context
- **Interaction history**: Calls, messages, meetings, notes
- **Life events**: Birthdays, anniversaries, milestones

### 2. Interaction Tracking
- **Activity log**: Every interaction with timestamp
- **Notes**: Rich text notes about conversations
- **Documents**: Files, photos shared
- **Tasks**: Follow-ups, promises made
- **Reminders**: Birthdays, check-ins, important dates

### 3. AI Agent System
- **Relationship Agent**: Tracks who to reach out to
- **Reminder Agent**: Notifies about birthdays, stale contacts
- **Enrichment Agent**: Auto-fills contact info from web
- **Summary Agent**: Generates interaction summaries
- **Suggestion Agent**: Recommends people to meet based on interests

### 4. Gamification Engine
- **XP System**: Earn points for interactions
- **Levels**: Social skill levels (1-100)
- **Achievements**: Badges for milestones
- **Streaks**: Daily/weekly engagement streaks
- **Leaderboards**: (Optional) Compare with friends

### 5. Calendar & Scheduling
- **Event integration**: Sync with Google Calendar, Cal.com
- **Meeting scheduler**: Share booking links
- **Recurring check-ins**: Automated reminders to touch base
- **Important dates**: Birthdays, anniversaries auto-detected

### 6. Communication Hub
- **Email integration**: Send emails from app
- **SMS/WhatsApp**: Message templates
- **Call logging**: One-click call logging
- **Template library**: Canned responses for common interactions

### 7. Analytics & Insights
- **Relationship health**: Score based on interaction frequency
- **Time analytics**: Who you spend most time with
- **Network visualization**: Graph of connections
- **Dormant alerts**: Contacts you haven't touched in a while

### 8. Vaults & Sharing (Multi-user)
- **Personal vault**: Your private contacts
- **Shared vaults**: Couples, families, teams
- **Access control**: Fine-grained permissions

### 9. Celebrations
- **Celebration Packs**: Bundle celebrations into themed packs (e.g., "Buddhism Celebrations", "Global Holidays")
- **System Packs**: Default packs available to all users (ownerId=null)
- **User Packs**: Custom packs created by individual users
- **Recurring Dates**: MM-DD format for annual events
- **One-time Events**: Full date (YYYY-MM-DD) for non-recurring
- **Per-Contact Attachment**: Attach celebrations to contacts with optional date override
- **Global Status Toggle**: Mark celebrations as "active" or "ignored" globally (bulk update across all contacts)
- **Upcoming View**: See celebrations coming up in the next 30 days

---

## Technical Architecture

### Tech Stack (from ts-monorepo-boilerplate)
- **Frontend**: React, TypeScript, Next.js
- **Backend**: Node.js, NestJS
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js
- **API**: REST + GraphQL
- **AI**: LangChain, OpenAI, Anthropic

### Key Modules Structure

```
socos/
├── apps/
│   ├── web/           # Main web app
│   ├── mobile/        # React Native app
│   └── agent/         # AI agent service
├── packages/
│   ├── database/      # Prisma schema
│   ├── api/           # API client
│   ├── ui/            # Shared UI components
│   ├── shared/        # Shared utilities
│   └── agent-core/    # AI agent framework
└── libs/
    └── integrations/  # Third-party integrations
```

---

## Database Schema (Core Entities)

### User
- id, email, name, avatar
- xp, level, achievements
- settings, preferences

### Contact
- id, userId
- firstName, lastName, middleName
- photo, bio
- company, jobTitle
- birthday, anniversary
- labels[], tags[]
- relationshipScore
- lastContactedAt
- nextReminderAt

### Interaction
- id, contactId
- type (call, message, meeting, note)
- content, summary
- occurredAt
- xpEarned

### Reminder
- id, contactId
- type (birthday, followup, custom)
- scheduledAt
- repeatInterval
- status

### Achievement
- id, userId
- type, name, description
- unlockedAt
- xpReward

### Vault
- id, ownerId
- name, description
- isShared, members[]

### CelebrationPack
- id, ownerId (null = system pack)
- name, description
- isDefault

### Celebration
- id, packId, ownerId (null = system)
- name, description
- date (MM-DD), fullDate (YYYY-MM-DD optional)
- icon, category (religious, secular, cultural, personal)

### ContactCelebration (junction)
- id, contactId, celebrationId, ownerId
- customDate (optional override)
- status (active/ignored)

---

## API Endpoints (Agent-First Design)

### Contacts
- `GET /api/contacts` - List with filters
- `POST /api/contacts` - Create
- `GET /api/contacts/:id` - Get details
- `PUT /api/contacts/:id` - Update
- `DELETE /api/contacts/:id` - Delete
- `GET /api/contacts/:id/interactions` - History
- `POST /api/contacts/:id/interaction` - Log interaction
- `GET /api/contacts/due` - Contacts needing attention

### Reminders
- `GET /api/reminders` - Upcoming
- `POST /api/reminders` - Create
- `PUT /api/reminders/:id/complete` - Mark done
- `GET /api/reminders/calendar` - Calendar view

### Gamification
- `GET /api/user/stats` - XP, level, achievements
- `GET /api/achievements` - Available achievements
- `POST /api/achievements/:id/claim` - Claim achievement

### Celebrations
- `GET /api/celebrations/packs` - List all available packs
- `GET /api/celebrations/packs/:packId` - Get pack with celebrations
- `POST /api/celebrations/packs` - Create custom pack
- `PUT /api/celebrations/packs/:packId` - Update pack
- `DELETE /api/celebrations/packs/:packId` - Delete pack
- `GET /api/celebrations/packs/:packId/celebrations` - List celebrations in pack
- `POST /api/celebrations/packs/:packId/celebrations` - Add celebration to pack
- `PUT /api/celebrations/packs/:packId/celebrations/:id` - Update celebration
- `DELETE /api/celebrations/packs/:packId/celebrations/:id` - Delete celebration
- `GET /api/celebrations/:id` - Get celebration details
- `PUT /api/celebrations/:id/global-status` - Set global status (active/ignored)
- `GET /api/celebrations/upcoming/list` - Upcoming celebrations (30 days)
- `GET /api/celebrations/contacts/:contactId` - Celebrations for a contact
- `POST /api/celebrations/contacts/:contactId` - Attach celebration to contact
- `PUT /api/celebrations/contacts/:contactId/:celebrationId` - Update contact celebration
- `DELETE /api/celebrations/contacts/:contactId/:celebrationId` - Detach celebration

### AI Agents
- `POST /api/agents/remind` - Get reminders
- `POST /api/agents/enrich` - Enrich contact
- `POST /api/agents/summarize` - Summarize interactions
- `POST /api/agents/suggest` - Get suggestions

---

## Gamification Details

### XP Sources
| Action | XP |
|--------|-----|
| Log interaction | +10 |
| Complete reminder | +20 |
| Meet new person | +50 |
| Keep streak alive | +15 |
| Unlock achievement | +100 |

### Levels
- Level 1-10: Social Novice
- Level 11-25: Network Builder
- Level 26-50: Relationship Master
- Level 51-75: Social Champion
- Level 76-100: Connection Virtuoso

### Achievements Examples
- 🌱 **First Contact**: Add your first contact
- 📅 **On Time**: Complete 10 reminders on time
- 🔥 **Streak Master**: Maintain 30-day streak
- 🌟 **Social Butterfly**: Add 100 contacts
- 💎 **Quality Time**: Have 50 interactions
- 🎂 **Birthday Pro**: Log 10 birthdays

---

## UI/UX Goals

1. **Clean & Minimal**: Notion-like simplicity
2. **Dark Mode**: Built-in dark theme
3. **Mobile-First**: Works great on phone
4. **Fast**: Instant interactions
5. **Fun**: Gamification feels rewarding, not gimmicky

---

## Phase Roadmap

### Phase 1: MVP
- Contact CRUD
- Basic interaction logging
- Labels/tags
- Simple reminders

### Phase 2: AI Agents
- Reminder agent
- Contact enrichment
- Interaction summaries

### Phase 3: Gamification
- XP system
- Levels
- Achievements
- Streaks

### Phase 4: Scale
- Multi-vault support
- Calendar integration
- Communication hub
- Analytics

---

## Success Metrics

- Time to add a contact: < 30 seconds
- Agent automation: 80% of reminders auto-managed
- User engagement: Daily active users with streaks
- Community: Open-source contributions

---

*Last Updated: 2026-03-16*
*Version: 0.1.0 (Planning)*
