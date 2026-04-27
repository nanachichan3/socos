# SOCOS CRM — Launch Plan

## Overview

This is a 90-day MVP launch plan for SOCOS, the gamified, agent-first personal CRM. The strategy combines open-source release, product launch platforms, and community building to achieve initial traction and validate product-market fit.

**Launch Date Target:** TBD (based on engineering readiness)
**Budget:** $0 ( bootstrapped)
**Team:** 1 CMO (this plan), CTO (infrastructure), CEO (oversight)

---

## Phase 0: Pre-Launch (Weeks -4 to -1)

### GitHub Repository Setup

**Must-have before launch:**
- [ ] Clean, descriptive README with:
  - One-sentence product description
  - Demo GIF or screenshot (animated if possible)
  - Quick-start (Docker one-liner + cloud signup link)
  - Feature list with icons
  - Architecture overview (small diagram)
  - License badge (AGPL-3.0)
- [ ] Contributing guide (3 sections: bug reports, feature requests, code contributions)
- [ ] Code of conduct
- [ ] Issues templates (bug, feature, question)
- [ ] PR template
- [ ] Roadmap as GitHub Projects (public kanban board)
- [ ] License file (AGPL-3.0)
- [ ] Changelog (keep at v0.1 for now)

**Nice-to-have:**
- [ ] Contributing developers guide
- [ ] Architecture decision records (ADR)
- [ ] Docker Compose staging env

**GitHub Stars strategy:** Don't buy fake stars. Do this instead:
- Post in dev communities with genuine pitch (not spam)
- Ask friends/coworkers to star if genuinely interested
- Submit to directories (SaaS directories, OSS directories)

---

### Documentation

**Target users:** Non-technical users AND developers

**Must-have docs:**
1. **Getting Started Guide**
   - Self-hosted (Docker) — step by step with screenshots
   - Cloud signup — link + what to expect
   - 3 persona setup walkthrough (screenshots)

2. **Core Concepts**
   - Contact management
   - Interaction tracking (manual + AI-assisted)
   - AI Agent explained in plain English
   - Gamification system (levels, XP, badges)
   - Privacy controls

3. **Developer Setup**
   - Local dev environment
   - API documentation (if REST API exists)
   - Contributing guide

**Format:** Markdown in `/docs` folder + published via Docsify or similar (free static hosting)

---

### Demo Video

**Specs:** 60-90 seconds, no voiceover needed (or light text overlay), screen recorded

**Script:**
1. 0-10s: "Meet Sarah. She has 200 contacts but can't remember why she met half of them."
2. 10-30s: Install SOCOS in one command. Show the dashboard.
3. 30-60s: Add a contact. Log an interaction. The AI agent suggests a follow-up.
4. 60-80s: Show gamification — level up, earn a badge.
5. 80-90s: "Stop remembering. Start relating. SOCOS — open source, privacy-first."

**Where to host:** YouTube (unlisted initially) + embed in README

**Tools:** OBS (free) or Loom (paid, faster)

---

### Pre-Launch Community Seeding

**Actions:**
- [ ] Create r/SOCOScrm subreddit (private until launch)
- [ ] Create Discord server (invite-only for now)
- [ ] Post 1-2 "building in public" tweets (authentic, not promotional)
- [ ] Set up email newsletter (Mailchimp free tier up to 500 subscribers)

---

## Phase 1: Launch Week (Weeks 1-2)

### Day 1: Hacker News

**Submission strategy:**
- Submit at 9am UTC (catches morning US east coast traffic)
- Title: "Show HN: I built a personal CRM with an AI agent that remembers why you met people"
- Body: Story-driven, not feature list. Why did you build it? What problem does it solve? Include demo video link.
- Don't beg for upvotes. Let the story speak.

**What to expect:**
- HN can drive 1,000+ visitors if it hits front page
- Most visitors are technical — appeal to developers AND users
- Have a live person answering comments for first 2 hours

---

### Day 2: Indie Hackers

**Submission:**
- "Showcase" section
- Include: product description, demo link, pricing info, tech stack
- Start a "build in public" thread if IH supports it

**Follow-up:**
- Post to r/startups with launch announcement
- Post to r/SideProject with "I just launched" post

---

### Day 3: Product Hunt

**Launch strategy:**
- Schedule for Tuesday-Thursday (avoid Monday/Friday)
- Morning UTC launch (catches US daylight)
- Prepare a good tagline, description, and images

**PH-friendly assets:**
- Gallery images (clean, show the product)
- Feature icons
- 30-second demo video (Loom works)

**What to expect:**
- PH can drive 500-1,000 visitors on a good day
- Community is more user-facing than HN — emphasize ease of use
- Respond to every comment

---

### Days 4-7: Community & Reddit

**Post-launch Reddit strategy (not spam, genuine):**

| Subreddit | Post Type | Notes |
|-----------|-----------|-------|
| r/SideProject | "I launched" + demo | Be authentic, not salesy |
| r/startups | Launch announcement | Short, link to demo |
| r/privacy | Discussion about personal data + SOCOS | Position as privacy-first alternative |
| r/selfhosted | Show SOCOS, mention self-host option | Strong fit for the audience |
| r/PKM (Personal Knowledge Mgmt) | Cross-post: CRM for personal life | Appeal to the PKM crowd |

**What NOT to do:**
- Don't post the same thing to multiple subreddits simultaneously
- Don't ignore comments — respond within 24h
- Don't post vague "check out my project" without context

---

### Newsletter Launch

**Send to email list:**
- "Announcing SOCOS — the AI-powered personal CRM"
- Story-driven, include demo video
- Links to GitHub, demo, docs
- "Subscribe for updates" CTA

---

## Phase 2: Post-Launch Community Building (Weeks 3-8)

### Community Growth

**r/SOCOScrm subreddit:**
- Go public (was private during launch)
- Post weekly threads: "Show your SOCOS setup", "Tips & tricks", "Feature requests"
- Pin the launch announcement

**Discord:**
- Open invite to public
- Create channels: #introductions, #feature-requests, #help, #showoff
- Feature of the week: highlight a cool use case

**GitHub:**
- Monthly "Community Update" discussion
- Highlight top contributors
- Thank every person who submits a PR or issue

### Content Flywheel

**1 blog post per week (can be short):**

| Week | Topic |
|------|-------|
| 3 | "How I maintain 300 relationships without losing sleep" (personal story) |
| 4 | "Why personal CRM is different from sales CRM" |
| 5 | "The AI agent that remembers everyone you've ever met" (product deep dive) |
| 6 | "Gamifying your relationships: how XP and levels keep you in touch" |
| 7 | "Self-hosting SOCOS: what you need to know" (technical) |
| 8 | "SOCOS vs Monica HQ vs Twenty: a comparison" |

**Distribution:**
- Post each blog to r/productivity, r/PKM, r/Entrepreneur (where relevant)
- Submit to product newsletters that accept guest posts
- Share on Twitter/LinkedIn with a snippet

### Feedback Loops

- Add a feedback button in the app ("This suggestion goes directly to the team")
- Close the loop on GitHub issues within 72h
- Publish a "You asked, we built" monthly update

---

## Phase 3: Feature Announcements & Momentum (Weeks 9-12)

### Growth Mechanisms

**Referral system:**
- Implement "Share SOCOS, earn XP" — each referral = 50 XP
- Show a shareable achievement card when users hit level 5, 10, etc.

**Integration announcements:**
- "SOCOS now works with Google Contacts"
- "SOCOS now syncs with Apple Calendar"
- Each integration is a content piece + social post

**Feature launch posts:**
- New AI feature? → Blog post + demo GIF + PH submission
- New gamification element? → Social post + blog
- New self-host feature? → r/selfhosted post

### Analytics & Metrics to Track

| Metric | Target (30 days) | Target (90 days) |
|--------|------------------|------------------|
| GitHub Stars | 200+ | 500+ |
| Cloud signups | 100+ | 500+ |
| Discord members | 50+ | 200+ |
| r/SOCOScrm subscribers | 30+ | 100+ |
| Email list | 200+ | 500+ |
| Demo video views | 500+ | 1,500+ |
| Open issues / closed issues ratio | < 2:1 | < 1:1 |

---

## Pre-Launch Checklist

Before going live, verify each item:

### Product Readiness
- [ ] App runs without errors (self-hosted Docker install works)
- [ ] Signup/login works
- [ ] Contact creation + interaction logging works
- [ ] AI agent responds (basic)
- [ ] Gamification shows XP and level
- [ ] No broken links in README

### Content Readiness
- [ ] README complete (description, demo GIF, quick start, features)
- [ ] Getting started docs published
- [ ] Demo video recorded and uploaded (unlisted)
- [ ] Blog post 1 drafted ("How I maintain 300 relationships")

### Launch Readiness
- [ ] HN account created and karma > 10 (build karma in advance!)
- [ ] PH maker profile complete
- [ ] IH profile complete
- [ ] Reddit accounts ready (avoid brand-new accounts)
- [ ] Email newsletter set up (Mailchimp)
- [ ] Discord and subreddit created

### Social Proof
- [ ] 3 beta testers lined up to post comments on launch day
- [ ] Launch announcement draft ready to paste
- [ ] Response templates ready for common questions

---

## Launch Calendar (Example: Launch on May 1)

| Date | Action |
|------|--------|
| Apr 20 | GitHub repo public, docs live |
| Apr 22 | Demo video recorded |
| Apr 24 | r/SOCOScrm private, Discord private |
| Apr 26 | Seed content: 1 blog post, 2 tweets |
| Apr 28 | Pre-launch email to early list |
| May 1 | HN launch (9am UTC) |
| May 2 | IH showcase + r/startups, r/SideProject |
| May 3 | PH launch (morning UTC) |
| May 4-7 | Community posts, respond to all comments |
| May 8 | Post-launch email to full list |
| May 9-31 | Content flywheel, community building |
| Jun 1 | 30-day retrospective blog post |

---

## What Could Go Wrong

| Risk | Mitigation |
|------|------------|
| HN doesn't hit front page | That's fine. HN is bonus. Focus on IH + PH |
| Bug discovered on launch day | Monitor Discord/GitHub closely, fix fast, be transparent |
| Nobody comments | Engage first — comment on others' launches, respond to every comment |
| Self-host install fails | Have a Discord thread for help, fix docs within 24h |
| No traction in Month 1 | Pivot content strategy, try different channels, get user interviews |

---

## Success Criteria

**Month 1:**
- 100 cloud signups
- 200 GitHub stars
- 50 Discord members
- 3 posts on HN/IH/PH with >50 upvotes each

**Month 3:**
- Product-market fit signal: users organically recommending to others
- First community contributor submits a PR
- Email list of 500+ subscribers
- 10+ integration requests implemented

**Final test:** If the product were suddenly unavailable, would users be upset? If yes — you've built something people want.