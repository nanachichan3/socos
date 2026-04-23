# SOCOS — Architecture Document

**Status:** CTO Architecture Audit Complete  
**Project:** SOCOS — Gamified Personal CRM  
**Audit Date:** 2026-04-23  
**Auditor:** Builder (CTO subagent)

---

## 1. Tech Stack

### Build & Monorepo

| Layer | Technology |
|-------|------------|
| Package manager | pnpm 10.10.0 |
| Build orchestrator | Turborepo 2 |
| Language | TypeScript 5.9 |
| Monorepo structure | pnpm workspaces |

### Frontend

| App | Framework | Port | Notes |
|-----|-----------|------|-------|
| `@socos/web` | Next.js 15 (Turbopack) | 3000 | Main web app; Tailwind CSS 4 via `@tailwindcss/postcss` |
| `@socos/platform` | React 19 + Vite 8 | 5173 (proxied via `/platform/*` on 3000) | Secondary React app; Tailwind CSS 4 via `@tailwindcss/vite` |

### Backend

| Service | Framework | Port | Notes |
|---------|-----------|------|-------|
| `@socos/api` | NestJS 11 | 3001 | REST API; Prisma ORM |

### Data

| Component | Technology |
|-----------|------------|
| Database | PostgreSQL 15 |
| ORM | Prisma 6.9 |
| Lunar calendar | `lunar` npm package |

### Shared

| Package | Purpose |
|---------|---------|
| `@socos/shared` | Shared TypeScript utilities |
| `@socos/eslint-config` | Shared ESLint (legacy `.eslintrc.cjs`, ESLint 9+) |
| `@socos/typescript-config` | Shared TypeScript base configs |

### Auth & Security

| Component | Implementation |
|-----------|---------------|
| Auth | JWT tokens (manual generation via `JwtService`); AuthController is a **stub** |
| Password hashing | bcryptjs (cost factor 12) |
| Sessions table | Prisma `Session` model with token + expiry |

### Testing & Quality

| Tool | Usage |
|------|-------|
| Vitest | Web and platform apps |
| Jest | API service (`--passWithNoTests`; no test files exist yet) |
| ESLint 9 | Legacy `ESLINT_USE_FLAT_CONFIG=false` required |

---

## 2. Core Modules & Their Responsibilities

### Backend (`services/api/src/modules/`)

| Module | Responsibility |
|--------|----------------|
| **auth** | User registration, login, logout, JWT issuance (stub controller) |
| **contacts** | Full CRUD for contacts; search/filter by label/tag; vault scoping |
| **interactions** | Logging of calls, messages, meetings, notes; XP attribution |
| **reminders** | Create, complete, skip reminders; recurring schedule support |
| **gamification** | XP/level management; achievements; streak tracking |
| **celebrations** | Celebration packs (system + user); contact-celebration junction with date overrides; lunar calendar support |
| **dungeon-master** | RPG-style social scenarios (DMSession, DMSceneResponse); archetype-based narratives |
| **debug** | Debug/health endpoints |
| **jwt** | JWT token creation and verification service |
| **prisma** | Prisma service module (exposes `PrismaService`) |

### Frontend (`apps/web` / `apps/platform`)

| App | Responsibility |
|-----|----------------|
| `web` (Next.js) | Main SPA — dashboard, contact list, contact detail, interaction timeline, reminder sidebar, stats card, celebrations UI |
| `platform` (React + Vite) | Secondary app (proxied at `/platform/*`); separate route or feature area |

### Shared Packages

| Package | Responsibility |
|---------|----------------|
| `@socos/shared` | Shared utilities consumed by all three runnable services |
| `@socos/eslint-config` | ESLint ruleset applied across all packages |
| `@socos/typescript-config` | TypeScript base configs (base, nextjs, service, library) |

---

## 3. Database Schema (Prisma)

### Core Entities

| Model | Purpose |
|-------|---------|
| **User** | Auth identity; XP, level, streak tracking |
| **Vault** | Multi-tenant container (personal/shared); supports couples, families, teams |
| **VaultMember** | Junction for vault access control |
| **Contact** | Core contact record; belongs to a vault + user; has labels, tags, relationship score |
| **ContactField** | Flexible contact fields (email, phone, address, website) |
| **Interaction** | Timestamped log entries (call, message, meeting, note, email, social) with XP |
| **Reminder** | Scheduled notifications linked to contacts; supports recurrence |
| **Task** | Generic task linked optionally to a contact |
| **Gift** | Gift tracking (idea, purchased, given) linked to contact occasions |
| **Achievement** | Master achievement definitions (code, name, xpReward, requirement) |
| **UserAchievement** | Junction linking user to unlocked achievements |
| **Activity** | Life events (birth, death, wedding, graduation, etc.) |
| **CelebrationPack** | Named collection of celebrations; `ownerId=null` = system pack |
| **Celebration** | Individual celebration (recurring MM-DD or one-time YYYY-MM-DD); supports lunar/chinese calendar types |
| **ContactCelebration** | Junction with per-contact date override, status (active/ignored), shouldRemind flag |
| **Session** | User session tokens with expiry |
| **DungeonMasterScenario** | RPG scenario templates (archetype, opening text, scene configs) |
| **DMSession** | Active RPG session between 2 participants; scene index, status, AI narrative |
| **DMSceneResponse** | User response to a scene (unique per session/user/sceneIndex) |

### Key Design Patterns

- **Cascade deletes**: Contact → all related (interactions, reminders, tasks, gifts, activities, contactFields, contactCelebrations); Vault → contacts/members; User → all user-owned resources
- **Vault-based isolation**: All contacts scoped to a vault; multi-user vaults via VaultMember
- **Soft relationship scoring**: `relationshipScore` (0–100) on Contact; `lastContactedAt`, `nextReminderAt` for AI agent decisions
- **Calendar type enum**: `gregorian`, `lunar`, `chinese` on Celebration for lunar date handling
- **Gamification**: XP per action type (10 for interactions, 20 for reminder completion, 50 for new contact, 100 for achievements); level thresholds scale by bracket

---

## 4. Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Monorepo (pnpm workspaces + Turborepo)** | Single repo for web, platform, and API; shared configs and packages; optimized incremental builds |
| **Next.js 15 (Turbopack) for main web app** | Fast dev server, file-based routing, React 19 support |
| **React + Vite for secondary platform app** | Vite's fast HMR for experimental/secondary UI; proxied behind Next.js |
| **NestJS 11 for API** | Modular backend, dependency injection, Swagger/OpenAPI built-in |
| **Prisma ORM over raw SQL** | Type-safe queries, migrations, schema-first design; `pg` driver for PostgreSQL |
| **JWT auth with stub AuthController** | Auth is not wired end-to-end; generation is manual via `JwtService` |
| **Tailwind CSS 4 (CSS-first config)** | No `tailwind.config.ts`; uses `@import "tailwindcss"` + `@theme` CSS blocks |
| **Vault model for multi-user** | Enables personal + shared vaults (couples, families, teams) without separate user flows |
| **Celebrations with lunar calendar support** | `lunar` package + `calendarType` field handles Buddhist, Chinese lunar dates |
| **Dungeon Master (RPG) module** | Social gamification layer; archetype-based narrative scenarios between 2 users |
| **XState 5 in API dependencies** | Available for complex state machine flows (e.g., Dungeon Master session state) |

---

## 5. MVP Stage Assessment

### ✅ Implemented (MVP Complete)

| Feature | Status |
|---------|--------|
| Contact CRUD (create, read, update, delete) | ✅ |
| Basic interaction logging (call, message, meeting, note) | ✅ |
| Labels/tags filtering and search | ✅ |
| Quick action buttons (Call, Message, Reminder) | ✅ |
| Basic reminder creation and completion | ✅ |
| Gamification: XP display, level display, stats card | ✅ |
| Celebrations: packs, attach to contacts, date override, reminder toggle | ✅ |
| Vault + VaultMember + multi-user isolation | ✅ |
| Dungeon Master (RPG scenarios) | ✅ |
| Prisma schema with full relational model | ✅ |
| NestJS modular architecture | ✅ |
| Docker Compose setup (local + prod) | ✅ |

### ⚠️ Stubbed / Incomplete

| Feature | Status |
|---------|--------|
| Auth endpoints (AuthController is a stub) | ⚠️ Stub |
| No real JWT middleware on protected routes | ⚠️ Manual via JwtService |
| No test files anywhere (`--passWithNoTests`) | ⚠️ No coverage |
| Platform app (React + Vite) has no clear distinct feature set | ⚠️ Ambiguous role |
| AI Agent system | ❌ Not implemented |
| Calendar integration (Google Calendar, Cal.com) | ❌ Not implemented |
| Email/SMS sending from app | ❌ Not implemented |
| Gift tracking | ❌ Not fully connected |
| Activity logging (life events) | ❌ In schema, not wired to UI |
| Analytics & insights dashboard | ❌ Not implemented |
| WebSocket/real-time updates | ❌ Not in scope |

### MVP Verdict

**Stage: Late MVP (≈85% complete by SPEC.md scope)**

SOCOS has a solid architectural foundation: a proper monorepo with three services, a well-designed relational schema covering all MVP features, and functional implementations for contacts, interactions, reminders, gamification, and celebrations. The main gap is the AI agent system (Phase 2) and end-to-end auth wiring. The Dungeon Master module is a bonus beyond the MVP spec.

---

## 6. Project Structure Summary

```
socos/
├── apps/
│   ├── web/                  # Next.js 15 main app (port 3000)
│   └── platform/             # React + Vite secondary app (port 5173)
├── services/
│   └── api/                  # NestJS 11 backend (port 3001)
│       ├── src/modules/      # auth, contacts, interactions, reminders,
│       │                    # gamification, celebrations, dungeon-master, jwt, prisma
│       └── prisma/          # schema.prisma, migrations, seed.sql
├── packages/
│   ├── shared/               # Shared utilities
│   ├── eslint-config/       # ESLint rulesets
│   └── typescript-config/    # TypeScript base configs
├── configs/                 # ESLint/TypeScript/Prettier templates
├── docker/                  # Dockerfiles (backend, web, frontend)
├── docs/                    # PRD.md, MVP-SPEC.md
├── memory/                   # Project memory
├── pnpm-workspace.yaml
├── turbo.json
└── docker-compose.{local,prod}.yml
```

---

*Document Version: 1.0.0*  
*Generated by: Builder (CTO subagent)*  
*Source: README.md, SPEC.md, MVP-SPEC.md, AGENTS.md, prisma/schema.prisma, package.json files*
