# SOCOS CRM Launch Announcement

**Project:** SOCOS CRM (Project #16)
**Date:** 2026-04-25
**Status:** Draft — Ready for review
**Purpose:** Launch day content for Product Hunt, Twitter/X, and Reddit r/selfhosted

---

## Lead Angle

> **"Personal CRM built for agents, not just humans."**

SOCOS isn't just another contact manager. It's the first personal CRM where AI agents actively manage your relationships — reminding you, enriching contacts, and keeping streaks alive. Built for people who want to grow their circle, not their pipeline.

---

## 1. Product Hunt Submission Copy

### Tagline
> AI-powered personal CRM with gamification — your relationships, leveled up.

### Pitch (250 chars)
SOCOS is the personal CRM that thinks for itself. AI agents track your relationships, XP gamifies every check-in, and self-hosting keeps your data yours. Built for indie hackers, builders, and anyone tired of letting friendships go dormant.

### Description (full)
**Your relationships deserve better than a spreadsheet.**

You've tried Apple Contacts. You've tried Notion templates. You've tried your memory. And still — you forget to follow up. You forget how you met someone. You forget their birthday.

SOCOS is the personal CRM that fixes that.

### What it does
- **AI Agents** that proactively remind you who's gone quiet, enrich contacts with public info, and suggest people you should reconnect with
- **Gamification** that turns relationship maintenance into a rewarding game — XP for interactions, levels for consistency, streaks for daily engagement
- **Self-hosted, open-source** — your contacts run on your server, your rules
- **Privacy-first** — no ads, no data harvesting, no subscription fatigue

### Who it's for
- Indie hackers building real relationships (not just LinkedIn connections)
- Salespeople who want a personal CRM, not a sales tool
- People who've moved to a new city and want to be intentional about building their social circle
- Anyone who's ever said "I should reach out to them more" and then didn't

### Why it's different
Most CRMs treat you like a sales rep. SOCOS treats you like a person who wants to be better at relationships.

Monica is a database. Twenty is for pipelines. SOCOS is for the people you actually care about.

### Screenshots/Creative
> _[Dashboard showing XP progress, streak counter, and "contacts needing attention" feed]_

### Gallery Blurb
- Contact timeline with interaction history
- Gamification dashboard (levels, achievements, streaks)
- AI agent suggestion panel
- Mobile-first dark mode UI

### Promo Video
> _[Demo of AI agent auto-reminding user to check in with a dormant contact]_

### Install/Run Instructions
```bash
git clone https://github.com/socos/socos.git
cd socos && docker-compose up
```
Open `http://localhost:3000` and start building your circle.

---

## 2. Twitter/X Thread (5 Tweets)

**Tweet 1 (Hook)**
> Most CRMs are built for sales teams. We built one for people who want to actually keep in touch with their friends.

SOCOS is now live. 🧵

---

**Tweet 2 (The Problem)**
> You know that feeling — you meant to text someone back, and then two months passed.

Apple Contacts won't help you there. Notion templates are too manual. And Monica CRM feels like a sales tool.

We needed something different.

---

**Tweet 3 (The Solution — Agent Angle)**
> SOCOS has AI agents that:
> - Track who's gone quiet in your contacts
> - Auto-enrich profiles from public data
> - Remind you when it's time to check in
> - Suggest people you should reconnect with

It's like having a chief of staff for your personal life.

---

**Tweet 4 (Gamification Angle)**
> But here's what makes it actually stick: gamification.

Every check-in earns XP. Every streak keeps you honest. Every 10 interactions unlocks an achievement.

It's a fitness tracker for your social life — and it actually works.

---

**Tweet 5 (CTA)**
> Open-source, self-hosted, privacy-first.

No subscription. No data harvesting. No corporate surveillance.

Your relationships, your server, your rules.

GitHub: github.com/socos/socos
Live: socos.io

(If you've ever let a friendship fade because you forgot to reach out — you need this.)

---

## 3. Reddit r/selfhosted Launch Post

**Title:**
> **[Launch] SOCOS — AI-powered personal CRM with gamification (XP, levels, streaks) — built for agents, not just humans**

**Body:**

Hey r/selfhosted — we just shipped SOCOS, and we think it's a different kind of CRM.

### What is SOCOS?

SOCOS is an open-source, self-hosted personal CRM that gamifies relationship building. It's designed for people who want to maintain their social circle — not manage a sales pipeline.

### The agent-first angle

This is where we think we're different from Monica and Twenty. SOCOS isn't just a database you manually update. It has **AI agents** that:

- **Relationship Agent** — tracks who's gone dormant, suggests outreach
- **Reminder Agent** — auto-generates birthday/check-in reminders
- **Enrichment Agent** — pulls public profile data to fill in contact fields
- **Summary Agent** — generates conversation summaries so you pick up where you left off

You set it up once. The agents keep your relationships alive.

### Gamification that actually helps

Most people don't need another app to check. But they do need a reason to check *consistently*.

SOCOS adds:
- **XP** for every interaction logged (+10 for a check-in, +50 for adding a new contact)
- **Levels** (1-100) that represent your "relationship maintenance skill"
- **Streaks** for daily engagement
- **Achievements** for milestones (First Contact, Streak Master, Quality Time)

It sounds gimmicky, but the feedback so far is: it actually works. People open the app because they want to keep their streak alive.

### Self-hosted, open-source

```bash
git clone https://github.com/socos/socos.git
cd socos && docker-compose up
```

That's it. Postgres, your own server, your data. No subscription, no data harvesting.

### Tech stack
- Frontend: Next.js + React
- Backend: NestJS
- Database: PostgreSQL + Prisma
- AI: LangChain + OpenAI/Anthropic
- Auth: NextAuth.js

### What we're still building

The MVP covers contact management, interaction logging, AI agents, and gamification. Calendar integration and multi-vault sharing are on the roadmap.

### If you're skeptical

We get it. "Gamified CRM" sounds like a pitch deck buzzword salad. But the core insight is simple: **people maintain habits when there's positive feedback**. XP and streaks aren't gamification for its own sake — they're the feedback loop that makes relationship maintenance actually stick.

We're building in public. Issues and PRs welcome.

**GitHub:** github.com/socos/socos
**Live demo:** socos.io

Questions? Fire away.

---

*Author: SOCOS CMO — draft for review and adaptation*
