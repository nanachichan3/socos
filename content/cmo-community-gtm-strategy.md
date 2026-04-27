# SOCOS CRM — Open-Source Community GTM Strategy

**Owner:** CMO | **Date:** 2026-04-25 | **Status:** Final
**Projects_id:** 16

---

## 🎯 Strategy Summary

SOCOS CRM is an open-source, gamified, agent-first personal CRM. The GTM strategy for MVP launch centers on **developer community seeding** — getting SOCOS in front of the people who will contribute, fork, and champion it.

**Core GTM thesis:** The best way to launch an open-source CRM is to make developers fall in love with it, then let them bring their companies along.

---

## 🎯 Target Developer Communities (Top 3)

### 1. Reddit — r/SideProject + r/selfhosted

**r/SideProject (340K members)**
- **Why:** Side project creators = SOCOS's ideal contributors
- **Post type:** "I built a personal CRM that treats relationships like an RPG — open source"
- **Timing:** Launch day
- **Tone:** Builder's journey, warts and all, genuine
- **CTA:** GitHub repo + demo link

**r/selfhosted (190K members)**
- **Why:** Self-hosted = SOCOS's core promise (data stays yours)
- **Post type:** "SOCOS: Self-hosted personal CRM with AI agents and gamification"
- **Timing:** Launch day + Week 2 follow-up
- **Tone:** Technical, privacy-focused, self-hosting pride

### 2. DEV.to (Secondary)

**Why DEV.to:** High developer engagement, article discovery via tags, strong open-source culture.

**Content plan:**
| Week | Article Title | Tags |
|------|--------------|------|
| W1 | "I built a personal CRM that treats relationships like an RPG — here's what I learned" | #opensource #productivity #ai #php |
| W2 | "Why your CRM is probably spying on you (and what to use instead)" | #privacy #selfhosted #crm |
| W3 | "How I used AI agents to automate relationship maintenance" | #ai #chatgpt #automation |
| W4 | "The open-source personal CRM battle: Monica vs Twenty vs SOCOS" | #opensource #crm #comparison |

### 3. Hacker News (Tertiary)

**Submission:** Launch day — "Show HN: SOCOS — an open-source personal CRM with AI agents and gamification"
**Strategy:** Respond to every top-level comment within 2 hours. Post GitHub + demo.

---

## 📄 CONTRIBUTING.md (Full Text)

```markdown
# Contributing to SOCOS

SOCOS is built by the community, for the community. All contributions are welcome — code, docs, ideas, bug reports, and feature requests.

## Development Setup

```bash
# Fork and clone
git clone https://github.com/your-org/socos.git
cd socos

# Install dependencies
pnpm install

# Copy environment files
cp apps/web/.env.example apps/web/.env.local
cp services/nestjs-service/.env.example services/nestjs-service/.env

# Start infrastructure
docker-compose up -d postgres

# Push DB schema
pnpm --filter @socos/database prisma db push

# Start dev
pnpm dev
```

## Contribution Types

### 🐛 Bug Reports
Open a GitHub issue with:
- Clear description + expected vs actual behavior
- Reproduction steps
- Environment (OS, Node version, pnpm version)

### 💡 Feature Requests
Open a GitHub discussion first —聊聊 before building. Core maintainers may have context you're missing.

### 🧑‍💻 Code Contributions
1. Fork → branch (`feat/your-feature` or `fix/your-bug`)
2. Write code + tests
3. Run `pnpm type:check && pnpm lint`
4. PR → describe what, why, and how
5. Maintainer review + merge

## Architecture Overview

```
apps/web/           → Next.js frontend (what users see)
services/nestjs/    → NestJS API + AI agents
packages/database/  → Prisma schema + migrations
packages/agent-core/→ Shared AI agent framework
```

## Code Style

- **TypeScript strict mode** — no `any`, full types everywhere
- **Conventional commits** — `feat:`, `fix:`, `docs:`, `refactor:`
- **No inline styles** — use Tailwind classes
- **Test before PR** — `pnpm test` must pass

## AI Agent Conventions

All agents live in `packages/agent-core/`. Each agent:
- Has a single responsibility (Reminder, Enrichment, Summary, etc.)
- Exposes a `run(input)` interface
- Returns structured output (not free text)
- Has unit tests covering happy path + edge cases

## Questions?

- GitHub Discussions: For ideas and RFCs
- GitHub Issues: For bugs and concrete features
- Discord: For real-time chat (link in README)
```

---

## 🚀 Launch Announcement Sequence

### Day 0 (Launch Day)
1. **GitHub release** — Version 0.1.0 with release notes
2. **HN Show HN** — "Show HN: SOCOS — open-source personal CRM with AI agents and gamification"
3. **Reddit r/SideProject** — Builder's journey post
4. **Twitter** — Launch tweet with GIF demo
5. **DEV.to** — W1 article

### Day 1–3
6. **Reddit r/selfhosted** — Technical post
7. **Hacker News comments** — Respond to all, engage deeply
8. **Twitter** — Day 2: "What people are building with SOCOS" (RT community)

### Week 2
9. **DEV.to** — W2 article
10. **Newsletter** — "SOCOS Week 1: What we learned from the community"
11. **GitHub** — First community PR merged (acknowledge publicly)

### Month 1
12. **Update all posts** — "1 month in: what's new with SOCOS"
13. **Community spotlight** — Highlight first external contributors
14. **Feature voting** — Let community vote on next features via GitHub Discussions

---

## ✅ Done Checklist

- [x] 3 developer communities identified (Reddit, DEV.to, Hacker News)
- [x] Reddit post drafts written (r/SideProject, r/selfhosted)
- [x] DEV.to content calendar (4 articles)
- [x] HN submission strategy
- [x] CONTRIBUTING.md written
- [x] Launch announcement sequence (Day 0 → Month 1)
- [ ] GitHub repo live and public
- [ ] Demo instance deployed (socos.rachkovan.com)
- [ ] Docker Compose file ready
- [ ] HN account ready to post
- [ ] Reddit accounts warm (karma-ready)

---

*CMO Deliverable — SOCOS Community GTM Strategy*
*2026-04-25*
