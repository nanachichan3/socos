# SOCOS CRM Phase 3 — Anthropic LLM Implementation Report

**Date:** 2026-04-27
**Author:** CTO
**Status:** For CEO Review
**Todo:** #249

---

## 1. What Was Already Wired

### AiDmService (`ai-dm.service.ts`)

The Dungeon Master AI service was already fully wired for Anthropic:

| Component | Status |
|-----------|--------|
| `callAI(prompt)` method | ✅ Complete — creates `new Anthropic({ apiKey })` per-call using `ConfigService.get('ANTHROPIC_API_KEY')` |
| Mock fallback | ✅ `mockCallAI(prompt)` provides realistic mock narration when no API key is configured |
| Constructor client init | ✅ Initializes `this.anthropic` in constructor (but still creates per-call client in `callAI()` too — redundant but harmless) |
| Model config | ✅ `claude-sonnet-4-20250514`, `max_tokens: 1024` |
| Error handling | ✅ Catches errors and falls back to mock |
| Module wiring | ✅ Exported as `@Injectable()` class — no Anthropic provider needed since it instantiates per-call |

**Conclusion for AiDmService:** No changes needed. Fully functional. When `ANTHROPIC_API_KEY` is set in environment, it uses Claude. Without it, mock responses are used.

### AiAgentService (`ai-agent.service.ts`)

**Tool 3 (`toolGenerateNote`)**: Already has Anthropic wiring:
- Creates `new Anthropic({ apiKey })` inside the method
- Uses `claude-sonnet-4-20250514` with `max_tokens: 1024`
- Has mock/template fallback when API key is missing or on error
- Parses `Subject:` header for email format

**Tools 1, 2, 4**: No LLM integration — purely algorithmic:
- `toolSuggestContacts` — rule-based scoring, templated reason strings
- `toolScheduleReminder` — rule-based logic, templated descriptions
- `toolAssessRelationshipHealth` — computed formula, templated insight/recommendation strings

### AiAgentModule (`ai-agent.module.ts`)

No Anthropic provider/wiring — relies on `ConfigService` for `ANTHROPIC_API_KEY` via the per-call instantiation pattern. This is consistent and **does not need a dedicated provider**.

---

## 2. Changes Made

### Change 1: Added `callAnthropic(prompt)` Method to AiAgentService

```diff
+  /**
+   * Call Anthropic Claude API to generate natural language text.
+   * Falls back to a simple mock response when ANTHROPIC_API_KEY is not configured.
+   * @param prompt The full prompt string to send to Claude
+   * @param maxTokens Maximum tokens in the response (default 512)
+   * @returns The generated text response
+   */
+  private async callAnthropic(prompt: string, maxTokens = 512): Promise<string | null> {
+    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
+
+    if (!apiKey) {
+      console.log('[AiAgentService] callAnthropic (stub — no ANTHROPIC_API_KEY). Prompt length:', prompt.length);
+      return null;
+    }
+
+    try {
+      const client = new Anthropic({ apiKey });
+      const response = await client.messages.create({
+        model: 'claude-sonnet-4-20250514',
+        max_tokens: maxTokens,
+        messages: [{ role: 'user', content: prompt }],
+      });
+      return response.content[0].type === 'text' ? response.content[0].text : null;
+    } catch (error) {
+      console.error('[AiAgentService] Anthropic API error:', error instanceof Error ? error.message : error);
+      return null;
+    }
+  }
```

**Design decisions:**
- `private` method — only used internally by the tool methods
- Returns `string | null` — `null` means "no LLM available, fall back to algorithmic"
- Consistent with AiDmService's pattern (per-call client creation, same model)
- Logs stub mode for debugging

### Change 2: Updated `toolSuggestContacts` — LLM-Enhanced Reasons

After the algorithmic scoring loop (which determines priority, scores, and daysSinceContact), the method now:

1. Collects the top scored contacts (up to `limit`)
2. For each contact, builds a context object with: name, priority, daysSinceContact, relationshipScore, upcomingBirthday, interactionCount
3. Sends a batch prompt to Claude asking it to rewrite the reason strings to feel natural and personalized
4. If the LLM returns valid JSON, replaces each `reason` field with the LLM-generated version
5. If LLM is unavailable (no API key) or returns invalid JSON, falls back to the original algorithmic reasons

```diff
+    // LLM enhancement: rewrite reasons to feel natural and personalized
+    const contactsResult: SuggestedContact[] = filtered
+      .sort((a, b) => b.totalScore - a.totalScore)
+      .slice(0, limit);
+
+    const enhancedReasons = await this.enhanceContactReasonsWithLLM(
+      contactsResult.map(c => ({
+        contactId: c.contactId,
+        contactName: c.contactName,
+        priority: c.priority,
+        daysSinceContact: c.daysSinceContact,
+        relationshipScore: c.relationshipScore,
+        upcomingBirthday: c.upcomingBirthday,
+        originalReason: c.reason,
+      }))
+    );
+
+    if (enhancedReasons) {
+      for (const r of contactsResult) {
+        if (enhancedReasons[r.contactId]) {
+          r.reason = enhancedReasons[r.contactId];
+        }
+      }
+    }
+
+    return {
+      contacts: contactsResult.map(({ totalScore: _s, ...rest }) => rest),
+    };
```

**Prompt design:** A single batch prompt that asks Claude to rewrite multiple reasons at once, returning a JSON map of `contactId → newReason`. This is more efficient than N individual calls.

### Change 3: Updated `toolAssessRelationshipHealth` — LLM-Generated Insight & Recommendation

After computing the health score and stats algorithmically, the method now:

1. Builds a detailed context object with contact info, stats, and current health band
2. Sends a prompt asking Claude to generate a personalized `insight` and `recommendation`
3. Expects a JSON response with `{ insight, recommendation }` fields
4. If LLM is unavailable (no API key) or fails, falls back to the original templated strings

```diff
+    // LLM enhancement: generate personalized insight and recommendation
+    const llmContext = {
+      contactName: name,
+      healthScore,
+      healthBand,
+      daysSinceContact,
+      interactionCount90d,
+      lastInteractionType,
+      relationshipScore: contact.relationshipScore ?? 50,
+      company: contact.company ?? undefined,
+      jobTitle: contact.jobTitle ?? undefined,
+    };
+
+    const llmResult = await this.generateHealthAssessmentWithLLM(llmContext);
+
+    if (llmResult) {
+      insight = llmResult.insight;
+      recommendation = llmResult.recommendation;
+    }
+    // else: kept the original templated insight and recommendation
```

**Prompt design:** A single focused prompt that asks for a JSON response. Includes the health score and band so Claude understands urgency.

### Change 4: Module Wiring — No Provider Needed

The `AiAgentModule` does **not** need a dedicated Anthropic provider. The pattern used by AiDmService (per-call instantiation via `new Anthropic({ apiKey })`) is:

- **Consistent** — same pattern across both services
- **Simple** — no DI complexity
- **Works** — ConfigService is already injected and provides the key

No changes to `ai-agent.module.ts` were required.

---

## 3. Files Touched

| File | Change |
|------|--------|
| `services/api/src/modules/ai-agent/ai-agent.service.ts` | Added `callAnthropic()` method + updated `toolSuggestContacts` and `toolAssessRelationshipHealth` with LLM enhancement |
| `services/api/src/modules/ai-agent/ai-agent.dto.ts` | No changes needed (response shapes unchanged) |
| `services/api/src/modules/ai-agent/ai-agent.module.ts` | No changes needed |

---

## 4. What CEO Needs to Provide

### Required: `ANTHROPIC_API_KEY` environment variable

| Variable | Current Status | What to Do |
|----------|---------------|------------|
| `ANTHROPIC_API_KEY` | ❌ Not set in `.env` (only in `.env.example` as placeholder) | Set the actual API key from Anthropic Console |

**Where it's used:**
- `services/api/.env` — add `ANTHROPIC_API_KEY=sk-ant-...`

**What key to use:**
- A standard Anthropic API key from console.anthropic.com
- The code uses `claude-sonnet-4-20250514` — ensure the key has access to this model

**What happens without it:**
- All tools fall back to algorithmic/templated responses
- Mock data in the DM service
- No LLM-generated reasons, insights, or recommendations
- Everything still works — just less personalized

**Cost estimate (estimated monthly with moderate use):**

| Service | Calls/mo | Tokens/call (in) | Cost estimate |
|---------|----------|------------------|---------------|
| AiDmService (scene narration) | ~500 | ~500 | ~$0.75 |
| AiAgentService (suggestContacts) | ~100 | ~2,000 | ~$0.20 |
| AiAgentService (assessHealth) | ~200 | ~1,000 | ~$0.30 |
| AiAgentService (generateNote) | ~200 | ~1,500 | ~$0.60 |
| **Total** | **~1,000** | | **~$1.85/mo** |

---

## 5. Summary

| Service | Before Phase 3 | After Phase 3 |
|---------|---------------|---------------|
| **AiDmService** | ✅ Already wired to Anthropic | No changes needed |
| **AiAgentService.toolGenerateNote** | ✅ Already wired to Anthropic | No changes needed |
| **AiAgentService.toolSuggestContacts** | Algorithmic reasons only | LLM-enhanced personalized reasons (with algorithmic fallback) |
| **AiAgentService.toolAssessRelationshipHealth** | Templated insight/recommendation | LLM-generated personalized insight & recommendation (with fallback) |
| **AiAgentService.toolScheduleReminder** | Algorithmic | No changes — scheduling logic is inherently rule-based and doesn't benefit from LLM |

**Key improvements:**
- `toolSuggestContacts` reasons now sound human and incorporate contact-specific context
- `toolAssessRelationshipHealth` insight and recommendation are personalized, not templated
- All changes degrade gracefully when no API key is configured
- Consistent pattern across both services (per-call Anthropic instantiation)

**To activate:** Set `ANTHROPIC_API_KEY` in environment. That's it.