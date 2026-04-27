# SOCOS CRM — Positioning Deck
## Open-Source Launch | CMO v1.0

**Purpose:** Executive-level positioning document for SOCOS open-source launch
**Audience:** Developers, indie hackers, open-source community, early adopters
**Key themes:** Agent-first, gamification, privacy-first, self-hosted
**Version:** 1.0 | **Date:** 2026-04-27

---

## THE PROBLEM

### "I'll reach out to them next week."
*— You, approximately 47 times per year*

Most people genuinely want to stay in touch. They meet someone interesting, have a great conversation, exchange details — and then nothing. No follow-up. No reminder. The relationship fades because life happens and you forgot.

### Existing Tools Fail at This

**Apple Contacts:** A database you open when you need a phone number. No reminders. No follow-up. No intelligence.

**Notion Templates:** You build it once, it becomes clutter, you stop opening it.

**Monica CRM:** Better — it's actually designed for personal relationships. But it's still a database you maintain manually. You have to remember to use it.

**Traditional CRMs:** Built for sales pipelines. Wrong context entirely.

**The failure mode is the same across all tools:** You remember when you open the tool. The tool doesn't remind you.

---

## THE SOLUTION

### SOCOS — Agent-First Personal CRM

> "Stop maintaining a contact list. Let your AI maintain your relationships."

SOCOS isn't a database you update. It's an agent that works for you between sessions.

### What Makes It Different

#### 1. AI Agents That Actually Work

**Reminder Agent:**
Your contacts don't go stale anymore. SOCOS monitors interaction frequency, flags dormant relationships, and generates reminders before important dates — without you opening the app.

**Enrichment Agent:**
Add a contact once. SOCOS silently fills in public profile data, recent activity, and context — zero manual effort after the initial add.

**Summary Agent:**
Before you reconnect with someone, SOCOS generates a recap: "Last call was 6 weeks ago. You discussed the wellness startup collaboration. They mentioned they were hiring."

**Suggestion Agent:**
"You haven't messaged Alex in 47 days. Based on your history, you usually meet for coffee every 6 weeks. Want to schedule something?"

#### 2. Gamification That Makes It Stick

Relationship maintenance is a habit. Habits need positive feedback.

**XP per interaction:**
- +10 XP for logging a call
- +20 XP for completing a reminder
- +50 XP for meeting someone new
- +15 XP for maintaining a daily streak

**Levels that mean something:**
- Level 1–10: Social Novice (just getting started)
- Level 11–25: Network Builder (actively building)
- Level 26–50: Relationship Master (maintaining consistently)
- Level 51–75: Social Champion (proactive connector)
- Level 76–100: Connection Virtuoso (the goal)

**Streaks that create accountability:**
- Daily engagement streak tracked
- 7-day streak = +25 XP bonus
- 30-day streak = +100 XP bonus

**Achievements that celebrate progress:**
- "🔄 First Reconnection" — reached out to a dormant contact
- "📅 On Time" — completed 10 reminders on schedule
- "🔥 Streak Starter" — maintained 7-day engagement streak
- "🌟 Social Butterfly" — added 100 contacts

This isn't gamification for its own sake. Early users report opening the app specifically to maintain their streak — which means they're actually staying in touch with people. The game mechanic creates the habit.

#### 3. Agent-First Architecture

Most CRMs are **tools**. You operate them.

SOCOS is an **agent**. It operates on your behalf.

| Action | Monica | Traditional CRM | **SOCOS** |
|--------|--------|----------------|-----------|
| Remind to follow up | ❌ Manual | ⚠️ Basic reminder | ✅ Auto-generates |
| Fill contact details | ❌ Manual | ⚠️ Manual | ✅ Auto-enrich |
| Summarize before meeting | ❌ None | ❌ None | ✅ AI Summary Agent |
| Suggest who to reach out | ❌ None | ❌ None | ✅ AI Suggestion Agent |

#### 4. Privacy-First, Self-Hosted

Your relationships are yours.

- No data harvesting
- No subscription fatigue
- Self-hosted option — run it on your own server
- Open-source — audit the code yourself

```bash
git clone https://github.com/socos/socos.git
cd socos && docker-compose up
```

That's it. PostgreSQL, your own server, your data.

---

## WHO IT'S FOR

### Primary ICP: The Relationship Investor
- 25–45, professional who meets a lot of people
- Already knows they should use a CRM but fails to maintain it
- Active on LinkedIn/Twitter, attends events, networks regularly
- Pain: "I meet great people and then lose them forever"

### Secondary ICP: The Network-Dependent Professional
- Freelancers, investors, consultants, salespeople
- Revenue directly tied to relationships
- Will pay for tools that help them close deals through better relationship management

### Not For:
- People who genuinely don't care about maintaining relationships
- Teams that need B2B sales pipeline management (use Twenty for that)
- People who want a simple address book (Apple Contacts is fine)

---

## COMPETITIVE POSITIONING

| Dimension | Monica | Twenty | **SOCOS** |
|-----------|--------|--------|-----------|
| Target | Personal (individuals, couples) | Business (sales, B2B) | **Personal + Agent-first** |
| AI Agents | ❌ None | ⚠️ Basic chat only | ✅ Full automation layer |
| Gamification | ❌ None | ❌ None | ✅ XP, levels, achievements, streaks |
| Self-hosted | ✅ Yes | ✅ Yes | ✅ Yes |
| API-first | ❌ No | ✅ Yes | ✅ Built for agents |
| Reminders/Automation | Basic | Basic | **Proactive AI agents** |
| Contact enrichment | Manual | Manual | **AI auto-fill from web** |
| Privacy-first | ✅ Yes | ✅ Yes | ✅ Yes |
| Open source | ✅ Yes | ✅ Yes | ✅ Yes |
| Mobile | ⚠️ Basic | ⚠️ Basic | **Mobile-first design** |

### When Someone Asks About Monica:
> "Monica is great for couples. SOCOS is for people who want AI agents to do the remembering for them — and gamification to make it fun."

### When Someone Asks About Twenty:
> "Twenty is a B2B sales tool. SOCOS is a personal CRM for people who want to build genuine relationships — not manage a pipeline."

---

## BRAND VOICE

**Tone:** Warm, encouraging, slightly playful — not corporate. Think: "your smartest friend who actually keeps in touch."

**Avoid:** Buzzwords, "AI-powered synergy," cold sales language
**Embrace:** Honest language about the struggle ("you know you should call your mom more"), gamification humor, real examples

### Sample Voice:
- *"SOCOS doesn't just remember birthdays. It nags you until you actually call."*
- *"Your contact list is a graveyard. Let's resurrect it."*
- *"Level 12 Social Novice says: 'I should text her.' Level 47 Relationship Master says: 'Already scheduled.' Get there."*

---

## KEY MESSAGING THEMES

### Theme 1: The Contact Graveyard
**Hook:** "How many people in your contact list have you never actually followed up with? (Be honest.)"

The average professional has 1,000+ contacts. They've met great people and lost them forever. SOCOS resurrects those relationships.

### Theme 2: Agent vs. Tool
**Hook:** "Monica shows you your contacts. SOCOS reminds you TO DO something about them."

Monica = database you open when you remember. SOCOS = agent that messages you proactively.

### Theme 3: Level Up Your Social Life
**Hook:** "I hit level 47 Relationship Master this week. Here's what it took."

Gamification as a meta-game — watching yourself improve at relationships over time. Real achievement unlocks. Real level progression.

---

## LAUNCH THEME

### One-liner for Open-Source Launch
> "The personal CRM that remembers for you — now open source."

### Product Hunt Tagline
> Never lose touch. AI-powered personal CRM with gamification.

### Hacker News Hook
> "Show HN: SOCOS — open-source personal CRM with AI agents and gamification"

---

## SUCCESS METRICS

| Metric | Definition | Target |
|--------|-----------|--------|
| GitHub Stars | First week | 500+ |
| Waitlist signups | First week | 1,000+ |
| PH launch rank | Day of launch | Top 5 |
| Discord community | Month 1 | 200+ members |

---

## ROADMAP

### MVP (Now)
- Contact CRUD
- Basic interaction logging
- Labels/tags
- Simple reminders
- AI agents (Reminder, Enrichment, Summary, Suggestion)
- Gamification (XP, levels, streaks, achievements)

### Phase 2 (Q2)
- Calendar integration (Google Calendar, Cal.com)
- Multi-vault support (couples, teams)
- Communication hub (email, SMS templates)

### Phase 3 (Q3)
- Advanced analytics
- Network visualization
- Mobile app

---

*Positioning Deck v1.0 — SOCOS Open-Source Launch*
*CMO | 2026-04-27*
