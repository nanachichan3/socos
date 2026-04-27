# SOCOS Developer Outreach Sequence

> Outreach targets for developer communities. Personal story angle, not marketing copy. Each piece should feel like something a real builder would share.

---

## 1. DEV.to Article

**Platform:** DEV.to  
**Angle:** Personal story — why I stopped using Notion for contacts and built my own thing  
**Best timing:** Tuesday or Wednesday, 09:00 UTC (DEV.to newsletter hits Tuesday morning)

**Title:** _I Stopped Using Notion as a CRM and Built My Own (Then Open-Sourced It)_

**Body:**

I used Notion to track people I met — until I realized I was the only one updating it, and I barely ever looked at it.

The problem wasn't the tool. The problem was that a database doesn't *remind* you. It doesn't say "hey, you haven't talked to Alex in three weeks." It just sits there, waiting for you to remember to open it.

So I built [SOCOS](https://socos.rachkovan.com) — a personal CRM with AI agents that proactively track who you should reconnect with, when, and why. It earns you XP for showing up. Your relationships have levels. Your consistency has streaks.

The AI agent slides into your weekly rhythm with something like: *"You haven't touched base with Jordan in 22 days. Want to set a reminder?"* — before you've even noticed they went quiet.

It's self-hosted, open source (MIT), and built with Next.js + NestJS + PostgreSQL.

Would love feedback from other builders who've felt the "I should stay in touch with people" guilt.  
**Link:** https://dev.to/socos

---

## 2. HackerNews Top Comment Template

**Platform:** HackerNews (when SOCOS is mentioned or Show HN posted)  
**Angle:** Technical depth — what makes SOCOS different architecturally  
**Best timing:** Engage within first 30 minutes of post going live

**Comment template:**

```
Been building this. The "agent-first" framing is deliberate — most
CRMs are databases with good UX. SOCOS is built around the idea that
the AI agent is the primary interface, not the UI.

The relationship agent works like a cron job over your contact graph:
scores each person by time-since-last-contact, interaction frequency,
and relationship context, then fires reminders before you've noticed
someone went quiet.

Tech stack: Next.js 14 frontend, NestJS backend, Prisma/Postgres,
LangChain for agent orchestration. Self-hosted, MIT license.

Repo: https://github.com/rachkovan/socos

The gamification (XP, levels, streaks) isn't gimmick — it's the
reinforcement loop that makes people actually open the app and log
interactions instead of letting their contacts go stale.

Would appreciate any HN feedback on the agent architecture specifically.
```

**Rules:**
- Never post as a brand account — personal account only
- Add genuine technical detail (agents, gamification mechanics, architecture)
- Don't hard-sell; answer questions and be helpful
- If asked about Monica/Twenty comparison, acknowledge their strengths, explain SOCOS's differentiators

---

## 3. Reddit Outreach

### 3a. r/SideProject

**Platform:** Reddit / r/SideProject  
**Angle:** "I made this" + technical curiosity  
**Best timing:** Sunday 14:00–18:00 UTC (highest side-project browsing)

**Title:** _I Built a Personal CRM with AI Agents That Remind You to Stay in Touch (Open Source)_

**Body:**

> Hey r/SideProject — built [SOCOS](https://socos.rachkovan.com) over the past few months. It's a personal CRM with AI agents that proactively track your relationships.
>
> The core loop: the agent watches your contact graph, scores each person by recency/frequency, and fires reminders *before* you've noticed someone went quiet. Think of it like a fitness tracker — but for your social health.
>
> Gamification layer on top: XP for logging interactions, levels for your "relationship skill," streaks for consistency. Kept it deliberately light — the goal is a longer streak, not a higher score.
>
> Built with Next.js + NestJS + Postgres. Self-hosted, MIT license.
>
> Curious what other side-project builders use for relationship tracking? Felt like the space was wide open.
>
> **Link:** https://github.com/rachkovan/socos

---

### 3b. r/startups

**Platform:** Reddit / r/startups  
**Angle:** "We solved our own problem" + distribution question  
**Best timing:** Monday 15:00–20:00 UTC

**Title:** _Shipped an Open-Source Personal CRM with AI Agents — Building in Public_

**Body:**

> [SOCOS](https://socos.rachkovan.com) is live. Built it because we kept losing track of people we met at events, conferences, collabs.
>
> Most CRMs are built for sales teams chasing deals. We wanted something that works *for* you — an AI agent that says "you haven't hit up Alex in 3 weeks" before you've realized they've gone quiet.
>
> Open source, self-hosted, MIT. Built with Next.js 14 + NestJS + PostgreSQL + LangChain.
>
> **Question for r/startups:** What's the best channel for reaching indie devs who might actually want to self-host? GitHub stars are nice but feels like we're missing the right community for this one.
>
> **Link:** https://github.com/rachkovan/socos

---

### 3c. r/Entrepreneur

**Platform:** Reddit / r/Entrepreneur  
**Angle:** "Relationships are your real asset" + founder story  
**Best timing:** Tuesday 16:00–21:00 UTC

**Title:** _I Built a CRM for My Network Because LinkedIn and Notion Weren't Cutting It_

**Body:**

> Forgot to follow up with a potential co-founder for 6 weeks. That's when I decided to build [SOCOS](https://socos.rachkovan.com).
>
> It's a personal CRM with AI agents. The relationship agent proactively scores your contacts and fires reminders — so you're never the person who "always meant to reach out."
>
> Added gamification (XP, levels, streaks) because I wanted a reason to open the app daily and actually log interactions, not just store contacts.
>
> Open source, self-hosted. If you've been looking for a system to maintain your network deliberately, this might be useful.
>
> **Link:** https://github.com/rachkovan/socos

---

## 4. Newsletter Tip Submissions

### 4a. Indie Hackers Weekly

**Platform:** Indie Hackers Weekly (newsletter + ihaddons.com)  
**Angle:** "Built in public" — lessons from building a dev tool solo  
**Best timing:** Submit Thursday–Friday for Sunday edition

**Tip:**

> **SOCOS — AI-Powered Personal CRM for Builders**
>
> I built [SOCOS](https://socos.rachkovan.com) because I kept forgetting to follow up with people I met. It's a personal CRM with AI agents that proactively remind you to reach out before relationships go stale.
>
> Gamification layer: XP for logging interactions, relationship levels, streaks. Built with Next.js + NestJS + Postgres + LangChain. Self-hosted, MIT license.
>
> Lesson from shipping in public: the "agent-first" idea sounds complex but the implementation is mostly a cron job over a contact graph. Would do it again.
>
> **Link:** https://socos.rachkovan.com | https://github.com/rachkovan/socos

---

### 4b. Micropreneur Newsletter

**Platform:** Micropreneur (micropreneur.com)  
**Angle:** Tools for solo builders — what I use to manage my network  
**Best timing:** Submit Tuesday–Wednesday for Wednesday/Thursday edition

**Tip:**

> **Tool: SOCOS**
>
> Managing relationships as a solo founder is a real bottleneck. I built [SOCOS](https://socos.rachkovan.com) to solve it — a self-hosted personal CRM with AI agents that track who you should reconnect with and when.
>
> It's not just a database. The relationship agent fires reminders before you've noticed someone went quiet. Gamification keeps you opening the app daily.
>
> Free and open source (MIT). Runs on any VPS.
>
> **Link:** https://socos.rachkovan.com

---

### 4c. Indie Hackers "This Week in Startups"

**Platform:** Indie Hackers (Submit a tip or small launch post)  
**Angle:** Launch post with traction/progress  
**Best timing:** Submit Friday–Saturday for the following week's digest

**Post:**

> **SOCOS — Personal CRM with AI Agents (Open Source)**
>
> [SOCOS](https://socos.rachkovan.com) is a personal CRM that treats relationships like a skill you can level up. Built because existing tools are either too sales-focused (Twenty) or don't have proactive AI (Monica).
>
> **What's different:** The AI agent is the primary interface, not the UI. It scores your contact graph, tracks recency/frequency, and fires reminders before relationships go stale. Gamification (XP, streaks, levels) gives you a reason to open the app daily.
>
> **Stack:** Next.js 14 + NestJS + PostgreSQL + Prisma + LangChain. Self-hosted, MIT.
>
> **Status:** MVP live, building in public. GitHub stars welcome.
>
> **Link:** https://github.com/rachkovan/socos

---

## Outreach Calendar Summary

| Platform | Asset | Best Timing |
|---|---|---|
| DEV.to | Full article | Tue/Wed 09:00 UTC |
| HackerNews | Comment template | First 30 min of Show HN |
| r/SideProject | Post | Sun 14:00–18:00 UTC |
| r/startups | Post | Mon 15:00–20:00 UTC |
| r/Entrepreneur | Post | Tue 16:00–21:00 UTC |
| Indie Hackers Weekly | Tip | Thu/Fri |
| Micropreneur | Tip | Tue/Wed |
| Indie Hackers digest | Tip/Launch | Fri/Sat |

---

_Files created: `/data/workspace/socos/cmo-dev-outreach.md`_
