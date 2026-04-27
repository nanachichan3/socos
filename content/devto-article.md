# Open-Sourcing My Relationship Management: Why I Built SOCOS

## Why I Wrote This

I've tried everything. Apple Notes with contact templates. Notion databases. Notion with Airtable syncing. A custom spreadsheet. Monica HQ. Google Contacts with birthday reminders.

Nothing stuck.

Not because the tools were bad — but because they all required me to remember to use them. And I already have too many things demanding my attention.

This is the story of how I built SOCOS — and why I decided to open source it.

---

## The Problem No One Talks About

We talk openly about fitness apps, habit trackers, productivity systems. But there's an embarrassing gap: **staying in touch with people**.

It's not a technical problem. It's a emotional one. People feel weird about systems for "managing friends." But the outcome is real: you drift from people you care about, you miss birthdays, you lose momentum in relationships that mattered.

I built this for myself. Then I realized — everyone has the same problem.

---

## The Insight: AI Agents Are Perfect for This

Here's the thing about relationship maintenance: it requires **consistent nudging over time**, not one-time actions.

- Send a follow-up in 3 days
- Touch base with this person every 2 weeks
- Remember to ask about their new job next time
- Birthday in 5 days — send a text

This is literally what AI agents do well. They track state, enforce schedules, and send reminders. The difference between SOCOS and a Todoist list is that SOCOS **proactively surfaces** people you've been neglecting — you don't have to remember to check.

---

## The Architecture: Agent-First Design

SOCOS is built around three core agents:

```
Review Agent → identifies people you haven't contacted recently
Reminder Agent → sends you gentle nudges at the right time
Enrichment Agent → logs context from your interactions
```

The agents are independent microservices. You can run just the reminder agent if you only want notifications. Or run the full stack for the complete experience.

---

## Why Gamification?

I'll be honest — adding XP and levels felt weird at first. "You're telling me I'm going to earn points for texting my mom?"

But here's what I realized: **we already gamify the things that stick**. Streaks on Duolingo. Completionist badges on健身 apps. Leaderboards at work.

Relationship maintenance doesn't have a bad reputation because it's dumb — it has a bad reputation because nothing made it satisfying. Gamification gives you positive feedback for doing the thing you already wanted to do.

---

## Why Open Source?

After three months of development, I made a call: **the core engine goes open source**.

Reasoning:
1. The CRM market is boring and dominated by enterprise players
2. Community-driven development leads to better features
3. If SOCOS helps people, it should be accessible

The stack: TypeScript, Node.js, Docker, PostgreSQL. If you want to run your own instance — it's a few commands.

---

## What I'm Building Right Now

- MVP with core agent functionality
- Landing page with waitlist
- Discord community for early users + contributors

**Week 1 goals:**
- 100 GitHub stars
- 500 waitlist signups
- Active Discord community

---

## How to Get Involved

**Star the repo:** Every star helps visibility and motivation.

**Try the demo:** [link] — spin up a container, add your first contact, see what happens.

**Contribute:** Issues, PRs, documentation, feature ideas — all welcome.

**Join Discord:** Talk to other builders working on personal productivity tools.

---

## What's Next

I'm going to be publishing more about the technical architecture, the gamification design decisions, and lessons learned from building AI agents that deal with messy human reality.

If you're interested in this space — let's build something that actually works.

---

*Originally published on DEV.to. Share if you found it useful.*