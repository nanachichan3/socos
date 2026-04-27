# AI Agent Module — Test Notes

## Manual Test Checklist

### Auth
```
POST /ai-agent/action
Authorization: Bearer <valid_jwt>
```
Should return `401` if no token, `401` if expired.

### Tool: suggestContacts
```
POST /ai-agent/action
{ "action": "suggestContacts" }
```
Expect: `{ success: true, data: { contacts: [...] } }` with 1–3 contacts.

With vault filter:
```
{ "action": "suggestContacts", "vaultId": "<vault_id>" }
```

With limit:
```
{ "action": "suggestContacts", "suggestContactsOptions": { "limit": 5 } }
```

### Tool: scheduleReminder
```
POST /ai-agent/action
{ "action": "scheduleReminder", "contactId": "<contact_id>" }
```
Expect: `{ success: true, data: { suggestedReminder: { title, scheduledAt, type, isRecurring, recurrenceRule, description } } }`.

### Tool: generateNote
```
POST /ai-agent/action
{ "action": "generateNote", "contactId": "<contact_id>" }
```
Expect: `{ success: true, data: { note: { format, content, tone } } }`.

With email format:
```
{ "action": "generateNote", "contactId": "<contact_id>", "generateNoteOptions": { "format": "email", "tone": "warm" } }
```
Expect: `note.subject` and `note.content` in the response.

With meeting format:
```
{ "action": "generateNote", "contactId": "<contact_id>", "generateNoteOptions": { "format": "meeting" } }
```
Expect: `note.talkingPoints` array in the response.

### Tool: assessRelationshipHealth
```
POST /ai-agent/action
{ "action": "assessRelationshipHealth", "contactId": "<contact_id>" }
```
Expect: `{ success: true, data: { assessment: { contactId, contactName, healthScore, healthBand, insight, recommendation, stats } } }`.
`healthScore` should be 0–100. `healthBand` one of: `excellent | healthy | needs-attention | at-risk`.

## LLM Integration Note

All template-based text generation in `toolGenerateNote` is rule-based (placeholder). Look for `// TODO: LLM` comments in `ai-agent.service.ts` for where to slot in OpenAI/Anthropic API calls.

## Coverage

Tool methods are pure service methods — testable in isolation:
- `AiAgentService.toolSuggestContacts(ctx, opts)` — unit test via mocking `PrismaService`
- `AiAgentService.toolScheduleReminder(ctx, opts)` — same
- `AiAgentService.toolGenerateNote(ctx, opts)` — same
- `AiAgentService.toolAssessRelationshipHealth(ctx, opts)` — same
