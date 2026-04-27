# SOCOS CRM Phase 3 — LLM Implementation & OpenRouter Migration Report

**Date:** 2026-04-27  
**Author:** CTO  
**Status:** ✅ Complete — Waiting for `OPENROUTER_API_KEY` in `.env`  
**Todo:** #249  

---

## Migration Summary

All three services that used `@anthropic-ai/sdk` directly (calling Anthropic Claude API) now use a shared `LlmService` that routes through **OpenRouter** (OpenAI-compatible `/v1/chat/completions` endpoint).

### Why OpenRouter instead of direct Anthropic?

- ✅ No direct Anthropic API key needed
- ✅ Uses existing OpenAI-compatible infrastructure
- ✅ Easier to swap models (Claude, GPT, Mistral, etc.)
- ✅ Unified logging, error handling, and fallback in one place

---

## What Was Migrated

| Service | File | Change |
|---------|------|--------|
| **AiAgentService** | `ai-agent.service.ts` | `callAnthropic()` → `callLlm()`, removed `@anthropic-ai/sdk` import |
| **AiDmService** | `ai-dm.service.ts` | Constructor `new Anthropic({apiKey})` → `new LlmService(configService)`, `callAI()` now uses `llm.complete()` |
| **SummaryAgent** | `summary-agent.ts` | Both `llmSummarizeInteraction()` and `llmSummarizeContact()` now use `LlmService` |

### Removed Dependencies

- `@anthropic-ai/sdk` (no longer imported by any source file)
- `anthropic` (was a phantom dependency)

---

## New Files

| File | Purpose |
|------|---------|
| `src/modules/llm/llm.service.ts` | Shared LLM service — calls OpenRouter OpenAI-compatible API |
| `src/modules/llm/llm.module.ts` | NestJS module (Global, for future DI use) |

---

## Architecture

```
AiAgentService ─┐
AiDmService ────┤──→ LlmService.complete() ──→ OpenRouter API (Claude/GPT/etc.)
SummaryAgent ───┘
                     │
                     └ Fallback: Templated / Algorithmic / Mock responses
```

### LlmService (llm.service.ts)

- **Provider:** OpenRouter (OpenAI-compatible chat completions)
- **Default model:** `anthropic/claude-sonnet-4`
- **Max tokens:** Configurable per call (default 512)
- **Temperature:** Configurable per call (default 0.7)
- **Error handling:** Catches HTTP errors, JSON parse errors, network failures
- **Fallback:** Returns `null` on any failure → caller uses template/algorithmic fallback

Key design: `isConfigured` getter checks if `OPENROUTER_API_KEY` is set, allowing callers to skip LLM calls entirely when the key is missing.

---

## How Each Tool Uses the LLM

### AiAgentService (ai-agent.service.ts)

| Tool | LLM Usage | Fallback |
|------|-----------|----------|
| `toolSuggestContacts` | Rewrites contact reason strings to sound human and personalized | Templated algorithmic reasons |
| `toolGenerateNote` | Generates full message/email/meeting content with contact context | Templated message templates |
| `toolAssessRelationshipHealth` | Generates personalized insight and recommendation | Templated insight/recommendation |
| `toolScheduleReminder` | No LLM needed (scheduling is rule-based) | — |

### AiDmService (ai-dm.service.ts)

| Method | LLM Usage | Fallback |
|--------|-----------|----------|
| `callAI(prompt)` | Generates scene narration using system prompt + archetype persona | `mockCallAI()` returns realistic mock narration |
| `buildDebriefPrompt` → `callAI` | Generates full session debrief with narrative arc, connection highlights, XP | Mock JSON debrief |

### SummaryAgent (summary-agent.ts)

| Method | LLM Usage | Fallback |
|--------|-----------|----------|
| `summarizeInteraction` | Summarizes single interaction in 2-3 sentences | `generateSimpleSummary()` truncates content |
| `summarizeContactHistory` | Generates 2-3 paragraph relationship summary | `generateContactSummary()` returns counts/types |
| `summarizeActivityPeriod` | No LLM needed (statistics-based) | — |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENROUTER_API_KEY` | *(none)* | **Required** to activate AI features. Get from https://openrouter.ai/keys |
| `OPENROUTER_MODEL` | `anthropic/claude-sonnet-4` | OpenRouter model identifier (supports all OpenRouter models) |
| `OPENROUTER_BASE_URL` | `https://openrouter.ai/api/v1` | API base URL override |

### Fallback Behavior

When `OPENROUTER_API_KEY` is **not** set, everything degrades gracefully:
- **AiAgentService**: Uses templated/algorithmic responses for all tools
- **AiDmService**: Uses realistic mock narration
- **SummaryAgent**: Uses rule-based summaries (content truncation, keyword extraction)

---

## How to Activate AI Features

### Step 1: Get an OpenRouter API Key

1. Go to https://openrouter.ai/keys
2. Sign in (or create an account)
3. Click "Create Key"
4. Copy the key (starts with `sk-or-v1-`)

### Step 2: Set the Key in `.env`

```bash
# In services/api/.env:
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

That's it. No code changes needed — the LLM integration is fully wired.

---

## How to Test

### Quick test via curl:

```bash
# Set your key
export OPENROUTER_API_KEY="sk-or-v1-..."

# Start the API server
cd services/api && npm run start:dev
```

### Test endpoint 1: Generate a contact note
```bash
curl -X POST http://localhost:3001/api/ai-agent/action \
  -H "Authorization: Bearer $(your-jwt-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "GENERATE_NOTE",
    "contactId": "<contact-uuid>",
    "generateNoteOptions": {
      "format": "message",
      "tone": "warm"
    }
  }'
```

### Test endpoint 2: Assess relationship health
```bash
curl -X POST http://localhost:3001/api/ai-agent/action \
  -H "Authorization: Bearer $(your-jwt-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "ASSESS_RELATIONSHIP_HEALTH",
    "contactId": "<contact-uuid>"
  }'
```

### Test endpoint 3: Suggest contacts
```bash
curl -X POST http://localhost:3001/api/ai-agent/action \
  -H "Authorization: Bearer $(your-jwt-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "SUGGEST_CONTACTS",
    "vaultId": "<vault-uuid>",
    "suggestContactsOptions": {
      "limit": 3,
      "reason": "all"
    }
  }'
```

### Test endpoint 4: Dungeon Master narration
```bash
# Login first to get a JWT token (or use X-User-Id for agents)
curl http://localhost:3001/api/agents/summary/activity \
  -H "X-User-Id: <user-uuid>"
```

### Expected behavior:
- **With API key set:** Responses contain LLM-generated natural language
- **Without API key:** Responses still work but use templated/algorithmic content

---

## Cost Estimate (moderate monthly use)

| Service | Calls/mo | Tokens/call (approx) | Estimated Cost |
|---------|----------|----------------------|----------------|
| AiDmService (scene narration) | ~500 | ~500 in | ~$0.75 |
| AiAgentService (suggestContacts) | ~100 | ~2,000 in | ~$0.20 |
| AiAgentService (assessHealth) | ~200 | ~1,000 in | ~$0.30 |
| AiAgentService (generateNote) | ~200 | ~1,500 in | ~$0.60 |
| SummaryAgent (summaries) | ~300 | ~1,000 in | ~$0.40 |
| **Total** | **~1,300** | | **~$2.25/mo** |

Actual costs depend on model chosen. Claude Sonnet 4 is ~$3/MTok input, ~$15/MTok output on OpenRouter.

---

## Future Considerations

1. **Streaming**: `toolGenerateNote` could stream the response for real-time UX (needs SSE or WebSocket)
2. **Model selection**: `OPENROUTER_MODEL` env var allows switching models without code changes
3. **Rate limiting**: Consider adding rate limiting for AI endpoint when usage grows
4. **Caching**: Some summaries (e.g., contact history) could be cached and refreshed on new interactions
5. **DI integration**: `LlmModule` is marked `@Global()` for future DI-based injection instead of `new LlmService()` pattern