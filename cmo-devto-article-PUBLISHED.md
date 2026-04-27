**⚠️ MANUAL POSTING REQUIRED — No Dev.to API key found in environment.**
Publish manually at: https://dev.to/new/article
Tags: opensource, typescript, nextjs, nestjs, AI, productivity, CRM
Canonical: https://socos.rachkovan.com

---

# I Built an AI-Powered Personal CRM That Actually Keeps You in Touch

*The story behind SOCOS — and why losing touch isn't a willpower problem, it's a systems problem.*

---

Every few months, I'd text someone out of the blue: *"Sorry I've been MIA, life got crazy."* And every time, I'd mean it. Life *had* gotten crazy. I wasn't lying.

But I also wasn't lying to myself when I thought: *This keeps happening. Why does this keep happening?*

I didn't lack the desire to stay close to people. I lacked the **system** to actually do it. And I think most people are in the same boat — except they blame themselves for being "bad at keeping in touch" when the real issue is structural.

Your brain is not a CRM. Stop expecting it to function like one.

---

## The Systems Problem

Willpower is finite. Your intention to "text people more" lives in the same budget as your intention to work out more, eat better, sleep earlier. Intentions compete. Systems win.

When I looked at the tools available, I saw the same pattern everywhere:

- **Contacts app** — stores names and numbers. Doesn't track when you last talked. Doesn't nudge you to reconnect.
- **Notion** — flexible, but you have to build and maintain everything yourself. It's a database with extra steps.
- **Monica CRM** — genuinely beautiful UI. But it still puts all the work on you. No AI, no proactive reminders, no agents.
- **Twenty** — solid B2B CRM, but built for sales pipelines, not your college roommate or your mentor from 2019.

Every tool treats *you* as the agent. You have to open the app. You have to remember to log interactions. You have to notice when someone's birthday is approaching.

What I wanted was a tool that **worked for me**, not one I had to work *at*.

---

## Meet SOCOS — The Personal CRM That Acts

SOCOS is an open-source personal CRM with a core philosophy: **the AI does the tedious work so you can do the human work.**

Here's what that means in practice:

### AI Agents That Actually Proactively Manage Relationships

- **Relationship Agent** — notices when you've gone quiet with someone and surfaces them before you've even registered the drift
- **Reminder Agent** — handles birthdays, anniversaries, and "it's been a while" nudges automatically
- **Enrichment Agent** — pulls missing contact info from public sources so your contacts stay fresh without manual entry
- **Summary Agent** — converts rough meeting notes into structured interaction logs

### Gamification That Makes Consistency Rewarding

Relationship maintenance is a skill. Skills improve with practice. Practice is easier when it feels good.

SOCOS gives you XP for every logged interaction, every completed reminder, every streak maintained. You level up from Social Novice to Connection Virtuoso (level 100). Achievements unlock at meaningful milestones. Streaks track your consistency week over week.

The goal isn't a high score. The goal is a *longer streak* — meaning you're showing up more consistently for the people who matter.

### Self-Hosted and Privacy-First

Your relationship data is some of the most personal data you have. It should not live in someone else's SaaS product.

SOCOS is MIT-licensed. Run it on your own infrastructure — your laptop, your VPS, a Raspberry Pi. Your contacts, your notes, your history. No vendor lock-in, no data harvesting.

---

## Technical Architecture

SOCOS is a TypeScript monorepo built with pnpm workspaces:

```
Frontend    Next.js 14 (React, TypeScript)
Backend     NestJS (Node.js, TypeScript)
Database    PostgreSQL + Prisma ORM
Auth        NextAuth.js
AI/Agents   LangChain + OpenAI / Anthropic
API         REST + GraphQL
Infra       Docker, pnpm workspaces
```

The agent system is designed to be extended. The Relationship Agent, Reminder Agent, Enrichment Agent, and Summary Agent each expose structured APIs — and since everything is open source, you can build your own agents on top of the framework.

**Quick start:**

```bash
git clone https://github.com/rachkovan/socos.git
cd socos
docker-compose up -d
open http://localhost:3000
```

One command. No external services. No API keys required for local dev.

---

## Why Open Source?

Three reasons open source makes sense for a personal CRM:

**1. Privacy is non-negotiable.** Your relationship network is sensitive. It should not be a SaaS product's data asset. Self-hosting means your data never leaves your infrastructure.

**2. Extensibility matters.** You might want to build custom agents, integrate with your own calendar system, or extend the data model for your specific use case. With a proprietary CRM, you're stuck with their roadmap.

**3. Trust through transparency.** MIT license means the code is auditable. No hidden data practices. No surprise monetization.

---

## What I'd Love From the Community

SOCOS is live. It's at the point where the core loop works — agents track relationships, gamification drives consistency, everything self-hosts in one Docker command.

What I want next is **you**:

- Star the repo if you think this is worth building
- Open issues for features you want (or bugs you find)
- PRs welcome — the CONTRIBUTING.md has everything you need to get started
- If you want early access to hosted infrastructure when it comes, join the waitlist at [socos.rachkovan.com](https://socos.rachkovan.com)

The problem of keeping in touch with people you genuinely care about is solvable. It just needed the right system.

SOCOS is that system.

---

**Links:**
- 🌐 [socos.rachkovan.com](https://socos.rachkovan.com)
- 🐙 [github.com/rachkovan/socos](https://github.com/rachkovan/socos)
