# AI Agent Module — SPEC

## Overview

The `ai-agent` module is a thin NestJS module that exposes a single REST endpoint `POST /ai-agent/action` acting as an action dispatcher. Each action maps to a pure service method (a "tool") that reasons over SOCOS CRM data to produce a structured recommendation.

The module is intentionally **stateless** per request and **orchestrates** existing agents/strategies rather than reimplementing DB access patterns. JWT authentication is applied via the `Authorization` Bearer token header.

---

## Tech Stack

- NestJS 11, TypeScript, Prisma
- Reuses `PrismaService`, `JwtService`, and existing strategy agents from `../agents/`
- All file extensions use `.js` (NestJS default, even in TS files)

---

## Endpoint

```
POST /ai-agent/action
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "action": "suggestContacts" | "scheduleReminder" | "generateNote" | "assessRelationshipHealth",
  "contactId"?: string,      // required for scheduleReminder, generateNote, assessRelationshipHealth
  "vaultId"?: string,        // optional; filters contacts to a specific vault
  "options"?: object         // action-specific parameters (see below)
}
```

### Responses

All tools return a consistent envelope:

```ts
{
  success: boolean;
  action: string;
  data: T;         // tool-specific payload
  error?: string;
  executedAt: string; // ISO-8601
}
```

---

## Tool 1 — `suggestContacts`

**Purpose:** Recommend 1–3 contacts the user should reconnect with.

**Inputs:**
- `vaultId` (optional) — scope to a specific vault
- `options.limit` (default 3) — max contacts to return
- `options.reason` (optional) — `'stale' | 'birthday' | 'score' | 'all'` (default `'all'`)

**Algorithm:**
1. Fetch contacts belonging to `ownerId = ctx.userId` (optionally filtered by `vaultId`).
2. Score each contact:
   - **Stale score** (0–40 pts): `daysSinceLastContact / 14 * 40`, capped at 40. Dormant = 14+ days.
   - **Birthday proximity score** (0–30 pts): 30 if birthday within next 14 days, scales down linearly.
   - **Relationship score** (0–30 pts): `relationshipScore * 0.3`.
3. Sort by total score descending; return top N.
4. Attach a human-readable `reason` per contact.

**Output shape:**
```ts
{
  contacts: Array<{
    contactId: string;
    contactName: string;
    reason: string;           // e.g. "You haven't contacted Alex in 45 days"
    priority: 'high' | 'medium' | 'low';
    daysSinceContact: number;
    relationshipScore: number;
    upcomingBirthday: boolean;
  }>;
}
```

---

## Tool 2 — `scheduleReminder`

**Purpose:** Given a contact, generate a structured reminder object ready to be inserted into the DB.

**Inputs:**
- `contactId` (required)
- `options.type` (optional) — `'birthday' | 'followup' | 'stale'` (default inferred from contact state)

**Algorithm:**
1. Load the contact by `id` + `ownerId`.
2. Compute `daysSinceContact`.
3. Determine reminder type and parameters:

| Situation | Type | Title | When |
|-----------|------|-------|------|
| Birthday within 30 days | `birthday` | `{name}'s birthday` | On the birthday date |
| Last contact > 14 days ago | `stale` | `Check in with {name}` | +3 days from now |
| Last contact > 30 days ago | `followup` | `Follow up with {name}` | +7 days from now |
| Has upcoming celebration | `celebration` | `{celebration} for {name}` | On celebration date |

4. Set `recurrence`:
   - Birthday → `'yearly'`
   - Celebration (full date) → `'yearly'`
   - Otherwise → `'none'`

**Output shape:**
```ts
{
  suggestedReminder: {
    contactId: string;
    title: string;
    type: 'birthday' | 'followup' | 'stale' | 'celebration';
    scheduledAt: string;      // ISO-8601 datetime
    isRecurring: boolean;
    recurrenceRule: 'none' | 'yearly' | 'monthly' | 'weekly';
    description: string;     // context paragraph
  }
}
```

---

## Tool 3 — `generateNote`

**Purpose:** Generate a "re-connection note" — a short text message draft, email subject/body, or meeting talking points for an upcoming interaction.

**Inputs:**
- `contactId` (required)
- `options.format` (optional) — `'message' | 'email' | 'meeting'` (default `'message'`)
- `options.tone` (optional) — `'casual' | 'professional' | 'warm'` (default `'casual'`)

**Algorithm:**
1. Load contact and their last N interactions (default 5, last 90 days).
2. Extract `lastContactedAt`, `relationshipScore`, `company`, `jobTitle`, recent `tags`.
3. Build a context string from interaction summaries.
4. Use rule-based templating to produce the note (placeholder for LLM integration; see `// TODO: LLM` comments).
5. Vary output by `format` and `tone`.

**Output shape:**
```ts
{
  note: {
    format: 'message' | 'email' | 'meeting';
    content: string;          // the generated note text
    subject?: string;         // email subject (only when format='email')
    talkingPoints?: string[]; // only when format='meeting'
    tone: string;
  }
}
```

---

## Tool 4 — `assessRelationshipHealth`

**Purpose:** Score a contact's relationship health and return an actionable insight.

**Inputs:**
- `contactId` (required)

**Algorithm:**
1. Load contact and their interactions (last 90 days, unlimited count).
2. Compute:
   - `daysSinceContact` — days since last interaction (null = never contacted)
   - `interactionCount90d` — number of interactions in last 90 days
   - `avgInteractionFrequency` — average days between interactions (if count > 1)
   - `lastInteractionType` — type of most recent interaction
3. Health score formula (0–100):
   ```
   base = 50
   if never contacted: base -= 30
   if daysSinceContact > 60: base -= 20
   else if daysSinceContact > 30: base -= 10
   else if daysSinceContact <= 7: base += 20
   else if daysSinceContact <= 14: base += 10
   interactionBoost = min(20, interactionCount90d * 3)
   frequencyBoost = avgInteractionFrequency <= 14 ? 10 : 0
   healthScore = clamp(base + interactionBoost + frequencyBoost, 0, 100)
   ```
4. Determine health band: `excellent` (80–100), `healthy` (60–79), `needs-attention` (40–59), `at-risk` (0–39).
5. Generate one actionable `recommendation` string.

**Output shape:**
```ts
{
  assessment: {
    contactId: string;
    contactName: string;
    healthScore: number;       // 0–100
    healthBand: 'excellent' | 'healthy' | 'needs-attention' | 'at-risk';
    insight: string;           // human-readable insight
    recommendation: string;    // one concrete action
    stats: {
      daysSinceContact: number | null;
      interactionCount90d: number;
      lastInteractionType: string | null;
    };
  }
}
```

---

## Module Structure

```
services/api/src/modules/ai-agent/
├── ai-agent.module.ts       — NestJS module wiring
├── ai-agent.controller.ts   — POST /ai-agent/action dispatcher
├── ai-agent.service.ts      — 4 tool methods + JWT context extraction
├── ai-agent.dto.ts          — Request DTO + Response types
└── SPEC.md                  — This file
```

---

## Design Decisions

1. **Dispatcher pattern, not one route per action.** Single `POST /ai-agent/action` keeps the API surface minimal and makes client logic simpler.
2. **Delegates to existing agents.** Rather than duplicating Prisma queries, the `AiAgentService` calls into `SuggestionAgent`, `ReminderAgent`, `RelationshipAgent`, and `SummaryAgent` from the sibling `agents/` module.
3. **Rule-based placeholders for LLM calls.** All `generateNote` and summary logic uses template rules with `// TODO: LLM` markers marking where an OpenAI/Anthropic call would slot in.
4. **JWT via Bearer token.** Uses the existing `JwtService` to verify the `Authorization: Bearer <token>` header and extract `userId` into `AgentContext`.
5. **No new Prisma dependencies.** All DB access routes through `PrismaService` which is already imported by the parent `AgentsModule`.

---

## Wiring

1. Add `AiAgentModule` to `app.module.ts` imports.
2. Add `AiAgentController` to `app.module.ts` controllers array.
3. Add `AiAgentService` to `app.module.ts` providers array.
4. No changes to `AgentsModule` or existing agent files required.
