# SOCOS — Reddit r/selfhosted Post

**Owner:** CMO
**Status:** Draft ready for posting
**Date:** 2026-04-26

---

## POST — r/selfhosted

**Best time to post:** Wednesday, 7–10am PST
**Hook:** "I built this because I needed it" — personal story format

---

**Title:**
```
I built a personal CRM because I kept forgetting why I met people. Self-hosting it because privacy matters.
```

**Body:**
```
**The problem:** I have 400+ contacts in my phone. I remember maybe 50 of them.

Every professional coffee meeting ends with me thinking "I should follow up with this person" — and then I don't, because I can't remember why we met in the first place. Was this the data science person? The one who worked at the startup that failed? The friend-of-a-friend who mentioned they'd be useful someday?

CRM software exists. But it's built for sales teams, not humans. Salesforce feels like using a tank to commute to work. I needed something lighter.

**What I built:**

SOCOS is an open-source personal CRM with an AI agent that remembers *why you met people*.

Core features:
- Add contacts with notes about how you met, what you discussed, what they mentioned they were working on
- Log interactions (calls, emails, coffee, random DMs)
- AI agent surfaces people you haven't touched base with in a while
- Gamification: earn XP for staying in touch, level up as your relationship network grows

The gamification isn't gamified for the sake of it. It's based on something real: the biggest predictor of whether you'll maintain a relationship is whether you actually schedule time for it. XP and levels give you a reason to follow up.

**Privacy-first:**
This is open-source. You can self-host it on your own server. No data leaves your infrastructure if you don't want it to. I built it this way because I don't trust cloud CRM companies with my professional network.

**The AI agent:**
It's simple but useful. "You met Sarah Chen 18 days ago. You mentioned you'd share that article about distributed systems. Worth a follow-up?" It doesn't do anything fancy — just reminds you of context you've already provided.

**Tech stack:**
Node.js/TypeScript, PostgreSQL, React frontend. Docker one-liner for self-hosting.

**GitHub:** [link to repo]
**Demo:** [link]

Would love feedback from r/selfhosted — does this solve a problem you've had? What would make it actually useful for you?

AMA.
```

---

## POSTING RULES

| Rule | Detail |
|------|--------|
| **Account** | Post from a real account with post history |
| **Timing** | Wednesday, 7–10am PST |
| **Comments** | Reply to every comment in first 2 hours |
| **No spam** | Don't cross-post the same thing to multiple subreddits |
| **Assets** | Include a screenshot if possible |

---

*CMO Work Session | SOCOS Reddit Post | 2026-04-26*