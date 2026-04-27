# SOCOS CRM — Early Adopter Email Nurture Sequence (FINAL)
**Owner:** CMO | **Stage:** MVP | **Goal:** Convert first 10 signups to early adopters  
**Status:** ✅ Finalized | **Date:** 2026-04-27

---

## Sequence Overview
**Trigger:** User signs up for early access  
**Sequence:** 5 emails over 14 days  
**Tone:** Personal, direct, founder-energy — not corporate marketing  
**Platform:** Loops or ConvertKit (when email infrastructure is live)

---

## Email 1 — Welcome + The Problem (Day 0)

**Subject:** Welcome to SOCOS. Here's why it exists.

**Body:**
> Hey [Name],
>
> Thanks for signing up for early access to SOCOS.
>
> I built it because I kept letting good relationships slip through the cracks. Not because I didn't care — because I didn't have a system that worked while I slept.
>
> Notes apps are for contacts. Not for relationships.
> Notion is for projects. Not for people.
> HubSpot is for sales teams. Not for humans who just want to remember birthdays.
>
> SOCOS is a personal CRM with AI agents that do the relationship maintenance for you:
>
> → A reminder agent drafts check-in messages when relationships go cold
> → An enrichment agent pulls context (LinkedIn, last conversation topics) when you add someone
> → A review agent tells you "you haven't talked to X in 45 days" — before it's too late
>
> It's self-hosted. Your data stays yours. It's open-source. You can audit every line.
>
> I'll be in touch when early access opens. Until then — reply to this email. I read every one.
>
> — Yev

---

## Email 2 — The "Show Me" Email (Day 4)

**Subject:** What SOCOS actually looks like (2 min demo)

**Body:**
> Hey [Name],
>
> Last email I told you what SOCOS does. This one shows you.
>
> **[60-second GIF: adding a contact → AI enriching profile → reminder agent drafting a check-in]**
>
> Three things I want you to notice:
>
> 1. **Adding someone takes 10 seconds.** Paste a name. The AI fills in the rest.
>
> 2. **Reminders are drafted, not templated.** The agent writes a real message based on your relationship history — not a generic "haven't heard from you in a while."
>
> 3. **You can self-host it.** VPS, home server, Raspberry Pi. Your relationship data isn't in someone else's database.
>
> Early access is coming in the next 2 weeks. Want to be in the first cohort?
>
> Reply "yes" and I'll personally add you to the early access list.
>
> — Yev

---

## Email 3 — The ICP Validation (Day 7)

**Subject:** Genuinely curious — what's your current system for staying in touch?

**Body:**
> Hey [Name],
>
> Genuine question: what's your current system for remembering to reach out to people?
>
> I ask because — before I built SOCOS — I tried everything:
> - Notion pages (stopped opening them after week 2)
> - Contact apps (great for phone numbers, useless for context)
> - Spreadsheets (very on-brand for me, very bad for actually remembering)
>
> The honest answer for most people: "I just hope I remember." Which means, for most people, you don't.
>
> SOCOS exists because remembering is a infrastructure problem, not a motivation problem.
>
> If that resonates — early access is a few days away. I'll send the link as soon as it's live.
>
> — Yev

---

## Email 4 — Early Access Live (Day 10)

**Subject:** Early access is open. Here's your link.

**Body:**
> Hey [Name],
>
> SOCOS early access is live.
>
> → Get started: https://socos.rachkovan.com
> → GitHub: https://github.com/rachkovan/socos
> → Docs: https://docs.socos.rachkovan.com
>
> **First 20 users: lifetime 50% off.** No credit card required for early access.
>
> If you hit a bug or something feels off — reply to this email or open a GitHub issue. I've been building this in public and your feedback shapes every update.
>
> See you on the other side.
>
> — Yev
>
> P.S. If SOCOS isn't for you — that's totally fine. Reply and tell me what tool you'd actually want. I'm building in public and your take matters.

---

## Email 5 — Final Nudge + Social Proof (Day 14)

**Subject:** You've been on the list for 2 weeks. Here's where we're at.

**Body:**
> Hey [Name],
>
> Quick update — we've had [X] people join early access since we opened, and the feedback has been genuinely useful.
>
> A few things we've fixed based on early user feedback:
> - [Bug fix / improvement from early cohort]
> - [Another improvement]
>
> This email is my way of saying: if you're still interested, now's the time. Early access closes once we hit 20 users, and we're at [N] right now.
>
> If you're in — here's your link: https://socos.rachkovan.com/early-access
>
> If you're not ready yet — no pressure. The waitlist stays open. I'll reach out again when we launch publicly.
>
> Either way — thanks for being early. Means something.
>
> — Yev

---

## Personalization Fields

| Field | Source | Notes |
|-------|--------|-------|
| [Name] | Signup form — name field | Fall back to "there" if no name |
| [X] | Dynamic — current early access count | Update in Loops/ConvertKit |
| [N] | Dynamic — current cohort position | "N of 20 spots remaining" |
| [Bug fix] | Latest GitHub issues resolved | Pull from GitHub API or manual |

---

## Subject Line Options (A/B)

1. "Welcome to SOCOS. Here's why it exists."
2. "I built this because I kept forgetting people"
3. "The relationship CRM I wish existed 3 years ago"
4. "SOCOS early access — no fluff, just context"
5. "What if remembering was automatic?"

---

## Action Items (for CMO when signups arrive)

- [ ] Confirm email platform (Loops/ConvertKit) is set up
- [ ] Upload 5-email sequence to email platform
- [ ] Connect early adopter signup list
- [ ] Create [60-second GIF demo] — screen record of app flow
- [ ] Confirm GitHub link + live site URL are accurate
- [ ] Monitor open rates and reply rate after Day 7

---

*CMO Work Session | SOCOS Early Adopter Nurture Sequence | Finalized 2026-04-27*
