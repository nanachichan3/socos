# SOCOS CRM — GitHub Repository Landing Page Copy
**Purpose:** Primary GitHub README.md content for the SOCOS CRM repository
**Updated:** 2026-04-25

---

# SOCOS

### The Personal CRM Built for Humans Who Actually Want to Keep in Touch

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/badge/Discord-Join-blue?logo=discord)](https://discord.gg/socos)
[![Twitter Follow](https://img.shields.io/badge/Twitter-@socos_crm-blue?logo=twitter)](https://twitter.com/socos_crm)

> Gamified. Agent-first. Open source.

[🌐 Website](https://socos.rachkovan.com) | [📖 Docs](https://docs.socos.rachkovan.com) | [🚀 Deploy](https://docs.socos.rachkovan.com/deploy) | [💬 Discord](https://discord.gg/socos)

---

## The Problem

You met someone great at a conference six months ago. You meant to follow up. You didn't.

It's not a willpower problem. It's a **systems problem.**

Existing tools:
- **Monica CRM** — Beautiful, but you're doing all the work
- **Notion** — Flexible, but not built for relationships
- **Your brain** — Not designed to remember everyone you've ever met
- **Notes app** — Just names in a list

You needed a system that **actually reminded you** — and made relationship maintenance feel worth doing.

---

## What SOCOS Does Differently

| | Monica | Notion | SOCOS |
|--|--------|--------|-------|
| AI agents that proactively remind you | ❌ | ❌ | ✅ |
| Gamified relationship health (XP/levels) | ❌ | ❌ | ✅ |
| Contact auto-enrichment | ❌ | ❌ | ✅ |
| Open source | ✅ | ❌ | ✅ |
| Self-hosted | ✅ | ❌ | ✅ |
| API-first design (built for agents) | ❌ | ⚠️ | ✅ |

---

## ✨ Features

### 🤖 AI Agent System
- **Relationship Agent** — Tracks who to reach out to and when
- **Reminder Agent** — Proactively notifies you about birthdays and stale contacts
- **Enrichment Agent** — Auto-fills contact info from public sources
- **Summary Agent** — Generates conversation highlights
- **Suggestion Agent** — Recommends people to meet based on shared interests

### 🎮 Gamification That Actually Works
- **XP System** — Earn points for every interaction (+10 for logging a call, +20 for completing a reminder)
- **Levels** — Social Novice → Network Builder → Relationship Master → Social Champion → Connection Virtuoso
- **Achievements** — Unlock badges for milestones ("First Contact", "Streak Master", "Birthday Pro")
- **Streaks** — Daily engagement streaks that make relationship maintenance addictive

### 🔒 Privacy-First Architecture
- **Self-hosted** — Your contacts stay on your server
- **Open source** — Audit the code yourself
- **No data harvesting** — Built by a human, not a VC-backed surveillance company
- **Your data, your rules** — Export everything anytime

### 👥 Built for Real Relationships
- **Personal vaults** — Private contacts just for you
- **Shared vaults** — For couples, families, and friend groups
- **Celebration packs** — Sync birthdays across lunar and gregorian calendars
- **Relationship mapping** — Know exactly how you know someone

---

## 🚀 Quick Start

### Deploy to Railway (Recommended)

```bash
# One-command deploy
npx create-socos-app my-socos --template railway

# Or clone and deploy manually
git clone https://github.com/socos/socos.git
cd socos
pnpm install
pnpm db:migrate
pnpm dev
```

### Configuration

```env
# .env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-here"
OPENAI_API_KEY="sk-..."  # Optional: for AI features
```

See the [Deployment Guide](https://docs.socos.rachkovan.com/deploy) for full instructions (Docker, Railway, Fly.io, bare metal).

---

## 📊 How It Works

**Add a contact** → Your AI agent enriches their profile automatically → Earn XP

**Log an interaction** (call, message, coffee) → Earn XP → Your agent learns your patterns

**Miss someone for too long** → Your agent nudges you → You follow up → Relationship preserved

**Keep your streak alive** → Level up → Your network becomes a skill tree

---

## 🎯 Use Cases

### "I always forget to follow up"
Your AI agent detects when you've been out of touch with someone important and *automatically* drafts a check-in message. You approve or edit before it sends. No guilt. Just systems that work.

### "I met someone great at a conference"
Add them in 15 seconds. Your enrichment agent pulls their LinkedIn and GitHub. Your reminder agent schedules a follow-up. XP earned.

### "I want to stay closer to my college friends"
Create a shared vault. Your agent tracks birthdays and anniversaries. Celebration packs sync across all members. Suddenly you're the friend who actually remembers.

### "I manage a lot of professional contacts"
Labels, relationship types, and interaction history give you full context on every relationship. Your AI agent handles the reminders so you can focus on the conversation.

---

## �tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Next.js 14, TypeScript |
| Backend | NestJS, Prisma, PostgreSQL |
| Auth | NextAuth.js |
| AI | LangChain, OpenAI, Anthropic |
| Styling | Tailwind CSS |
| Self-host | Docker, Railway, Fly.io |

---

## 🤝 Contributing

SOCOS is open source and we welcome contributions.

- 🐛 Report bugs via [GitHub Issues](https://github.com/socos/socos/issues)
- 💡 Suggest features via [GitHub Discussions](https://github.com/socos/socos/discussions)
- 📖 Read the [Contributing Guide](https://docs.socos.rachkovan.com/contributing)
- 🎨 Check the [good first issues](https://github.com/socos/socos/labels/good%20first%20issue)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🌟 Star History

If SOCOS helps you build better relationships, star this repo and tell your network.

**Website:** [socos.rachkovan.com](https://socos.rachkovan.com)  
**Docs:** [docs.socos.rachkovan.com](https://docs.socos.rachkovan.com)  
**Discord:** [discord.gg/socos](https://discord.gg/socos)  
**Twitter:** [@socos_crm](https://twitter.com/socos_crm)

---

*Built with ❤️ by [@yevgeniusr](https://twitter.com/yevgeniusr)*  
*SOCOS — Your relationships deserve an AI agent.*
