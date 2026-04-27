# SOCOS Launch Announcement
## Product Hunt + Hacker News Ready

**Lead Angle:** Personal CRM built for agents, not just humans.

---

## 1. Product Hunt — One-Line Description (≤260 chars)

> SOCOS is the agent-first personal CRM where AI agents track your relationships, gamification keeps you accountable, and self-hosting keeps your data yours.

---

## 2. Product Hunt — "Talk About It" Section

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
- People who've moved to a new city and want to be intentional about building their social circle
- Anyone who's ever said "I should reach out to them more" and then didn't

### Why it's different

Most CRMs treat you like a sales rep. SOCOS treats you like a person who wants to be better at relationships.

Monica is a database. Twenty is for pipelines. SOCOS is for the people you actually care about.

---

## 3. Hacker News — "Show HN" Submission

**Title:**
> Show HN: SOCOS — open-source personal CRM with AI agents and gamification

**Body:**

Hey HN — we built SOCOS, an open-source personal CRM with a different premise: **AI agents should manage your relationships, not just store them.**

Most personal CRMs (Monica, Fifty) are databases you manually update. SOCOS has AI agents that work between sessions:

- **Relationship Agent** — monitors contact health, flags who's gone dormant, suggests outreach
- **Reminder Agent** — auto-generates check-in and birthday reminders based on interaction history
- **Enrichment Agent** — pulls public profile data to auto-fill contact fields
- **Summary Agent** — generates a recap before you reconnect ("Last time you spoke, they mentioned their new project")

The agents run passively. You don't have to open the app to benefit.

### The gamification layer

We also added XP, levels, and streaks — because relationship maintenance is a habit, and habits need positive feedback to stick. Every check-in earns XP, daily engagement maintains streaks, and level progression reflects your "relationship maintenance skill."

It sounds gimmicky. The early feedback says it actually works — people open the app because they want to keep their streak alive.

### Tech stack

- Frontend: Next.js + React
- Backend: NestJS
- Database: PostgreSQL + Prisma
- AI: LangChain + OpenAI/Anthropic
- Auth: NextAuth.js

### Self-hosted, no lock-in

```bash
git clone https://github.com/socos/socos.git
cd socos && docker-compose up
```

That's it. Postgres, your own server, your data.

### Still building

MVP covers contact management, interaction logging, AI agents, and gamification. Calendar sync and multi-vault sharing are on the roadmap.

If you've ever let a friendship fade because you forgot to reach out — you need this.

**GitHub:** [github.com/socos/socos](https://github.com/socos/socos)
**Live:** socos.io

---

## 4. Twitter Announcements

**Version 1 — Long (thread-ready):**

> Most CRMs are built for sales teams. We built one for people who want to actually keep in touch with their friends.

> SOCOS is now live — an agent-first personal CRM with AI agents that track your relationships, XP gamification that keeps you accountable, and self-hosting that keeps your data yours.

> The key difference: SOCOS agents work for you between sessions. They flag dormant contacts, auto-create reminders, and enrich profiles — without you having to open the app.

> It's open-source and privacy-first. No subscription. No data harvesting.

> GitHub: github.com/socos/socos | Live: socos.io

> (If you've ever let a friendship fade because you forgot to reach out — you need this.) 🧵

---

**Version 2 — Medium:**

> Built SOCOS — a personal CRM where AI agents actually manage your relationships for you.

> Flag dormant contacts. Auto-create check-in reminders. Enrich profiles from public data. XP gamification keeps you coming back.

> Open-source, self-hosted, privacy-first.
> github.com/socos/socos | socos.io

---

**Version 3 — Short:**

> SOCOS: Personal CRM built for agents, not just humans.

> AI agents track your relationships. XP keeps you accountable. Self-hosted. Open-source.

> socos.io / github.com/socos/socos

---

*Polished by SOCOS CMO — ready for launch*
