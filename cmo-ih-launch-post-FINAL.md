# SOCOS — The First Personal CRM Built for AI Agents

**If you've ever lost touch with someone you genuinely meant to stay close to — that's not a willpower problem. It's a systems problem.**

---

## The Story

I kept a list. A list of people I genuinely wanted to stay in touch with — friends I'd drifted from, mentors who shaped me, colleagues worth keeping close. I reviewed it often. I did nothing with it.

Every few months I'd feel guilty. Text someone out of the blue. Apologize for disappearing. Resolve to do better next time.

Then I'd forget again.

The problem was never motivation. It was **memory infrastructure**. Your brain is not designed to track 200+ relationships, remember when you last messaged each person, and surface the right nudge at the right moment. Existing tools — your contacts app, a Notion page, even Monica CRM — they're all databases. They store. They don't act.

SOCOS is the system that does the work for you.

---

## What SOCOS Does Differently

Most personal CRMs treat you as the agent. You have to remember to open the app. You have to remember to log interactions. You have to remember to follow up.

SOCOS runs **AI agents** that handle this proactively:

- **Relationship Agent** — tracks who you've drifted from and surfaces them before you notice
- **Reminder Agent** — handles birthdays, anniversaries, and check-ins automatically
- **Enrichment Agent** — auto-fills missing contact info from public sources so you don't have to
- **Summary Agent** — turns messy meeting notes into structured interaction logs

And because consistency should feel rewarding, not tedious — there's a **gamification layer**:

- Earn XP for every logged interaction, every completed reminder, every streak maintained
- Level up your "social skill" from Social Novice (1) all the way to Connection Virtuoso (100)
- Unlock achievements for milestones that actually matter

---

## Why Not Monica or Twenty?

Monica is beautiful. It's also doing the same thing a spreadsheet does — just prettier. No AI, no agents. You do all the work.

Twenty is solid for B2B. It's built for sales teams, not individuals. Great if you're tracking leads. Not built for the human stuff — friends, family, the people who aren't your clients.

SOCOS is built for **you**, not your pipeline. The gamification exists because relationship maintenance is a skill — and skills improve with practice, not just intention.

| Feature | Monica | Twenty | **SOCOS** |
|---------|--------|--------|-----------|
| AI Agents (proactive reminders) | ❌ | ⚠️ Basic | ✅ Full automation |
| Gamification (XP/levels/streaks) | ❌ | ❌ | ✅ |
| Built for individuals | ✅ | ❌ | ✅ |
| API-first architecture | ❌ | ⚠️ | ✅ |
| Self-hosted | ✅ | ✅ | ✅ |
| Lunar calendar celebration support | ❌ | ❌ | ✅ |

---

## Tech Details

SOCOS is a full-stack TypeScript monorepo built to be extended — by you, by your agents, by the community.

```
Frontend    Next.js 14 (React, TypeScript)
Backend     NestJS (Node.js, TypeScript)
Database    PostgreSQL + Prisma ORM
Auth        NextAuth.js
AI/Agents   LangChain + OpenAI / Anthropic
API         REST + GraphQL
Infra       Docker, pnpm workspaces
```

Everything runs in Docker. One command to spin up the full stack locally:

```bash
git clone https://github.com/rachkovan/socos.git
cd socos
docker-compose up -d
open http://localhost:3000
```

No external services, no API keys required for local development.

---

## Open Source Matters Here

Your relationship data is personal. Your network is sensitive. It should not live in someone else's SaaS database, becoming part of their product roadmap and ad targeting.

SOCOS is MIT-licensed. Your contacts, your server, your rules. Host it on your VPS, your laptop, a Raspberry Pi if you want. The code is auditable, extensible, and community-driven. If you want a feature, build it. If you find a bug, fix it.

---

## Get Started

🚀 **Live site:** [socos.rachkovan.com](https://socos.rachkovan.com)  
🐙 **GitHub:** [github.com/rachkovan/socos](https://github.com/rachkovan/socos) (star it if you like it)  
📋 **Early access waitlist:** [socos.rachkovan.com/waitlist](https://socos.rachkovan.com)  

Deploy in 5 minutes. Your relationships deserve a system that works as hard as you do.
