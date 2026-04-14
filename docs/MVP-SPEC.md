# SOCOS MVP - Core User Flows Specification

**Version:** 1.0.0  
**Status:** MVP Specification  
**Last Updated:** 2026-04-14  
**Author:** Hermes (CTO)

---

## Table of Contents

1. [Overview](#1-overview)
2. [User Flows](#2-user-flows)
   - 2.1 [Authentication Flow](#21-authentication-flow)
   - 2.2 [Contact Management Flow](#22-contact-management-flow)
   - 2.3 [Interaction Logging Flow](#23-interaction-logging-flow)
   - 2.4 [Reminder Management Flow](#24-reminder-management-flow)
   - 2.5 [Gamification Flow](#25-gamification-flow)
   - 2.6 [Celebration Management Flow](#26-celebration-management-flow)
3. [User Stories](#3-user-stories)
4. [Edge Cases & Error Handling](#4-edge-cases--error-handling)
5. [Technical Considerations](#5-technical-considerations)
6. [Database Schema Reference](#6-database-schema-reference)
7. [API Contracts](#7-api-contracts)

---

## 1. Overview

### Purpose

This document provides detailed user flow specifications for the SOCOS MVP. It complements the existing PRD.md by providing ASCII diagrams, technical edge cases, and implementation guidance.

### Scope

MVP scope includes:
- ✅ User authentication (register, login, logout)
- ✅ Contact CRUD operations
- ✅ Interaction logging (call, message, meeting, note)
- ✅ Quick action buttons (Call, Message, Reminder)
- ✅ Basic reminder creation
- ✅ Gamification (XP, levels, stats display)
- ✅ Label/tag filtering and search
- ✅ Celebration packs (view, attach to contacts)

### Out of Scope (Post-MVP)

- AI agents (reminder agent, enrichment agent)
- Calendar integration (Google Calendar, Cal.com)
- Email/SMS sending from app
- Gift tracking
- Activity logging
- Multi-vault sharing
- Advanced analytics

---

## 2. User Flows

### 2.1 Authentication Flow

#### 2.1.1 User Registration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER REGISTRATION FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │  START   │──────▶│  Login Page  │──────▶│  Click "Sign Up" │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                       │
                                                       ▼
                                              ┌──────────────────┐
                                              │  Registration    │
                                              │     Form         │
                                              └────────┬─────────┘
                                                       │
                              ┌────────────────────────┼────────────────────────┐
                              │                        │                        │
                              ▼                        ▼                        ▼
                    ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
                    │ Name: ""          │   │ Name: ""         │   │ Invite Code: ""  │
                    │ Email: ""         │   │ Email: "abc"     │   │ (valid)          │
                    │ Password: ""      │   │ Password: "123"  │   └────────┬─────────┘
                    │ Invite Code: ""   │   └────────┬─────────┘            │
                    └────────┬─────────┘            │                        │
                             │                      ▼                        │
                             │            ┌──────────────────┐               │
                             │            │ Validation Error│               │
                             │            │ "Email invalid"  │               │
                             │            └────────┬─────────┘               │
                             │                     │                         │
                             └─────────────────────┼─────────────────────────┘
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │  Click Submit     │
                                            │  "Create Account" │
                                            └────────┬─────────┘
                                                     │
                         ┌───────────────────────────┼───────────────────────────┐
                         │                           │                           │
                         ▼                           ▼                           ▼
               ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
               │  HTTP 409        │     │  HTTP 400        │     │  HTTP 201        │
               │  Email already   │     │  Missing fields  │     │  Account created │
               │  exists          │     │                  │     │                  │
               └────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
                       │                          │                           │
                       ▼                          ▼                           ▼
             ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
             │  Show error:     │       │  Show validation │       │  Store JWT in    │
             │  "Email taken"   │       │  errors on form  │       │  localStorage    │
             └──────────────────┘       └──────────────────┘       └────────┬─────────┘
                                                                             │
                                                                             ▼
                                                                    ┌──────────────────┐
                                                                    │  Redirect to     │
                                                                    │  Dashboard       │
                                                                    │  /dashboard      │
                                                                    └──────────────────┘
```

#### 2.1.2 User Login

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER LOGIN FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │  START   │──────▶│  Login Page  │──────▶│  Enter Email     │
     └──────────┘       └──────────────┘       │  & Password      │
                                               └────────┬─────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────┐
                                               │  Click "Sign In"  │
                                               └────────┬─────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                              ▼                         ▼                         ▼
                    ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
                    │  HTTP 401        │     │  HTTP 400        │     │  HTTP 200        │
                    │  Invalid creds   │     │  Missing fields  │     │  Login success   │
                    └────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
                             │                          │                          │
                             ▼                          ▼                          ▼
                   ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
                   │  Show error:     │      │  Show validation │      │  Store JWT in    │
                   │  "Invalid email   │      │  errors on form  │      │  localStorage    │
                   │  or password"     │      │                  │      │                  │
                   └──────────────────┘      └──────────────────┘      └────────┬─────────┘
                                                                                 │
                                                                                 ▼
                                                                        ┌──────────────────┐
                                                                        │  Fetch user      │
                                                                        │  profile + stats │
                                                                        └────────┬─────────┘
                                                                                 │
                                                                                 ▼
                                                                        ┌──────────────────┐
                                                                        │  Render          │
                                                                        │  Dashboard       │
                                                                        └──────────────────┘
```

#### 2.1.3 User Logout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER LOGOUT FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Click User  │──────▶│  Click           │
     │          │       │  Avatar/Menu │       │  "Sign Out"      │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────┐
                                               │  Clear JWT from  │
                                               │  localStorage    │
                                               └────────┬─────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────┐
                                               │  Clear app state │
                                               │  (contacts, etc) │
                                               └────────┬─────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────┐
                                               │  Redirect to     │
                                               │  /login          │
                                               └──────────────────┘
```

---

### 2.2 Contact Management Flow

#### 2.2.1 Add New Contact

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ADD NEW CONTACT FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Click        │──────▶│  Add Contact     │
     │          │       │  "+" / Add    │       │  Modal Opens     │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                              ▼                         ▼                         ▼
                    ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
                    │  Fill form:      │     │  Click "Cancel"  │     │  Fill form:      │
                    │  First Name: ""  │     │                  │     │  First Name:     │
                    │  (required)      │     └────────┬─────────┘     │  "Alice"         │
                    └────────┬─────────┘              │                │  Last Name:      │
                             │                        ▼                │  "Smith"         │
                             │               ┌──────────────────┐       │  Company: "Acme" │
                             │               │  Close Modal     │       │  ...             │
                             │               │  No changes      │       └────────┬─────────┘
                             │               └──────────────────┘                │
                             │                                                   │
                             ▼                                                   ▼
                   ┌──────────────────┐                              ┌──────────────────┐
                   │  Click "Create"  │                              │  Click "Create"  │
                   │  (firstName="" )  │                              │  (valid form)    │
                   └────────┬─────────┘                              └────────┬─────────┘
                            │                                                  │
                            ▼                                                  ▼
                   ┌──────────────────┐                             ┌──────────────────┐
                   │  Validation:     │                             │  HTTP 201        │
                   │  "First name     │                             │  Contact created │
                   │  is required"    │                             │                  │
                   └────────┬─────────┘                             └────────┬─────────┘
                            │                                                  │
                            │                                                  ▼
                            │                                       ┌──────────────────┐
                            │                                       │  Add to contacts │
                            │                                       │  state in memory │
                            │                                       └────────┬─────────┘
                            │                                                  │
                            │                                                  ▼
                            │                                       ┌──────────────────┐
                            │                                       │  Show success    │
                            │                                       │  toast: "Contact │
                            │                                       │  Alice created!" │
                            │                                       └────────┬─────────┘
                            │                                                  │
                            ▼                                                  ▼
                   ┌──────────────────┐                             ┌──────────────────┐
                   │  Stay on modal   │                             │  Close modal     │
                   │  Show error      │                             │  Re-render       │
                   └──────────────────┘                             │  contact list    │
                                                                      └──────────────────┘
```

#### 2.2.2 Search and Filter Contacts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SEARCH & FILTER CONTACTS FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Type in     │──────▶│  Real-time       │
     │(Contacts)│       │  Search Box  │       │  filter contacts │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                              ▼                         ▼                         ▼
                    ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
                    │  Search: ""     │     │  Search: "Ali"   │     │  Click "Work"    │
                    │  (empty)        │     │  Matches: 2      │     │  Label filter    │
                    │  Show all       │     │  "Alice Smith"   │     │                  │
                    │  contacts       │     │  "Alice Jones"   │     │  (can combine    │
                    └─────────────────┘     └────────┬─────────┘     │  with search)    │
                                                    │                └────────┬─────────┘
                                                    ▼                         │
                                        ┌──────────────────┐                   │
                                        │  Hide non-       │                   │
                                        │  matching        │                   │
                                        │  contacts        │                   │
                                        └────────┬─────────┘                   │
                                                 │                             │
                                                 ▼                             ▼
                                      ┌──────────────────┐         ┌──────────────────┐
                                      │  Clear search    │         │  Show only       │
                                      │  → show all      │         │  contacts with  │
                                      │  contacts again  │         │  "Work" label    │
                                      └──────────────────┘         └──────────────────┘
```

#### 2.2.3 View Contact Details

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        VIEW CONTACT DETAILS FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Click on    │──────▶│  Contact Detail  │
     │(Contacts)│       │  Contact     │       │  Page Opens      │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                                                        ▼
                                              ┌──────────────────┐
                                              │  Show:           │
                                              │  - Profile info  │
                                              │  - Contact fields│
                                              │  - Labels/tags    │
                                              │  - Recent        │
                                              │    interactions  │
                                              │  - Upcoming      │
                                              │    reminders     │
                                              └──────────────────┘
```

#### 2.2.4 Edit Contact

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            EDIT CONTACT FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │ Contact │──────▶│  Click Edit  │──────▶│  Edit Form       │
     │ Details │       │  Button      │       │  Pre-filled      │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                              ▼                         ▼                         ▼
                    ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
                    │  Change fields   │     │  No changes      │     │  Update fields:  │
                    │  e.g. company    │     │  Click "Cancel"  │     │  company: "New   │
                    │  "Acme" → "NewCo"│     │                  │     │  Corp"           │
                    └────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
                             │                        │                        │
                             ▼                        ▼                        ▼
                   ┌──────────────────┐     ┌──────────────────┐    ┌──────────────────┐
                   │  Click "Save"   │     │  Close modal     │    │  HTTP 200       │
                   │                 │     │  No changes      │    │  Contact updated │
                   └────────┬─────────┘     └──────────────────┘    └────────┬─────────┘
                            │                                                  │
                            ▼                                                  ▼
                   ┌──────────────────┐                            ┌──────────────────┐
                   │  HTTP 200        │                            │  Show success    │
                   │  Contact updated │                            │  toast:          │
                   └────────┬─────────┘                            │  "Contact        │
                            │                                       │  updated!"       │
                            ▼                                       └────────┬─────────┘
                   ┌──────────────────┐                                     │
                   │  Update contact  │                                     │
                   │  in state        │                                     │
                   └────────┬─────────┘                                     │
                            │                                                │
                            ▼                                                ▼
                   ┌──────────────────┐                            ┌──────────────────┐
                   │  Close modal     │                            │  Re-render       │
                   │  Return to list  │                            │  contact detail  │
                   └──────────────────┘                            └──────────────────┘
```

#### 2.2.5 Delete Contact

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DELETE CONTACT FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │ Contact │──────▶│  Click Delete │──────▶│  Confirmation    │
     │ Details │       │  Button      │       │  Dialog Opens    │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                              ▼                         ▼                         ▼
                    ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
                    │  HTTP 200        │     │  HTTP 404        │     │  HTTP 403        │
                    │  Contact deleted │     │  Contact not     │     │  Not owner      │
                    │                  │     │  found           │     │                  │
                    └────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
                             │                          │                          │
                             ▼                          ▼                          ▼
                   ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
                   │  Show success    │     │  Show error      │     │  Show error      │
                   │  toast           │     │  toast           │     │  toast           │
                   │  Redirect to     │     │  Stay on page    │     │  Stay on page    │
                   │  contacts list   │     │                  │     │                  │
                   └──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

### 2.3 Interaction Logging Flow

#### 2.3.1 Quick Action: Log Call

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      QUICK ACTION: LOG CALL FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Hover over  │──────▶│  Action buttons  │
     │(Contacts)│       │  Contact     │       │  become visible │
     └──────────┘       └──────────────┘       └────────┬─────────┘
     │                   │                            │
     │                   │                            ▼
     │                   │                   ┌──────────────────┐
     │                   │                   │  Click "Call"    │
     │                   │                   │  button          │
     │                   │                   └────────┬─────────┘
     │                   │                            │
     │                   │                            ▼
     │                   │                   ┌──────────────────┐
     │                   │                   │  Create interaction│
     │                   │                   │  type: "call"     │
     │                   │                   │  occurredAt: now │
     │                   │                   │  xpEarned: 10    │
     │                   │                   └────────┬─────────┘
     │                   │                            │
     │                   │         ┌──────────────────┼──────────────────┐
     │                   │         │                  │                  │
     │                   │         ▼                  ▼                  ▼
     │                   │ ┌──────────────────┐┌──────────────────┐┌──────────────────┐
     │                   │ │HTTP 201          ││HTTP 401          ││HTTP 500          │
     │                   │ │Success           ││Unauthorized      ││Server Error      │
     │                   │ └────────┬─────────┘└────────┬─────────┘└────────┬─────────┘
     │                   │          │                    │                    │
     │                   │          ▼                    ▼                    ▼
     │                   │ ┌──────────────────┐┌──────────────────┐┌──────────────────┐
     │                   │ │+10 XP to user   ││Redirect to      ││Show error toast  │
     │                   │ │Update XP display││login             ││"Failed to log"   │
     │                   │ └────────┬─────────┘└──────────────────┘└──────────────────┘
     │                   │          │
     │                   │          ▼
     │                   │ ┌──────────────────┐
     │                   │ │Show success toast│
     │                   │ │"Call logged!"   │
     │                   │ └────────┬─────────┘
     │                   │          │
     │                   │          ▼
     │                   │ ┌──────────────────┐
     └───────────────────┼▶│Update contact's   │
                         │ │lastContactedAt    │
                         │ │Refresh timeline   │
                         │ └──────────────────┘
                         │
                         ▼
               ┌──────────────────┐
               │  Contact card    │
               │  shows updated    │
               │  "Last contacted"│
               └──────────────────┘
```

#### 2.3.2 Quick Action: Log Message

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    QUICK ACTION: LOG MESSAGE FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Hover over  │──────▶│  Action buttons  │
     │(Contacts)│       │  Contact     │       │  become visible │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────┐
                                               │  Click "Message" │
                                               │  button          │
                                               └────────┬─────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────┐
                                               │  Create interaction│
                                               │  type: "message"  │
                                               │  occurredAt: now │
                                               │  xpEarned: 10    │
                                               └────────┬─────────┘
                                                        │
                                    ┌────────────────────┼────────────────────┐
                                    │                    │                    │
                                    ▼                    ▼                    ▼
                          ┌──────────────────┐┌──────────────────┐┌──────────────────┐
                          │HTTP 201          ││HTTP 401          ││HTTP 500          │
                          │Success           ││Unauthorized      ││Server Error      │
                          └────────┬─────────┘└────────┬─────────┘└────────┬─────────┘
                                   │                    │                    │
                                   ▼                    ▼                    ▼
                         ┌──────────────────┐┌──────────────────┐┌──────────────────┐
                         │+10 XP to user   ││Redirect to      ││Show error toast  │
                         │Show success toast││login             ││"Failed to log"   │
                         │"Message logged!" ││                  ││                  │
                         └──────────────────┘└──────────────────┘└──────────────────┘
```

#### 2.3.3 Quick Action: Log Meeting (from contact detail)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LOG MEETING FROM CONTACT DETAIL                          │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │ Contact │──────▶│  Click "Log   │──────▶│  Meeting Form    │
     │ Details │       │  Meeting"     │       │  Opens           │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                              ▼                         ▼                         ▼
                    ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
                    │  Fill form:       │     │  Fill form:       │     │  Cancel          │
                    │  Title: "Lunch"  │     │  Title: ""       │     │  Close modal    │
                    │  Date: 2026-04-14│     │  (required)       │     └──────────────────┘
                    │  Duration: 60min │     └────────┬─────────┘
                    │  Notes: "..."    │              │
                    └────────┬─────────┘              │
                             │                        ▼
                             │              ┌──────────────────┐
                             │              │  Validation:     │
                             │              │  "Title required" │
                             │              └────────┬─────────┘
                             │                       │
                             └───────────────────────┘
                                                       │
                                                       ▼
                                              ┌──────────────────┐
                                              │  Click "Save"    │
                                              └────────┬─────────┘
                                                       │
                                    ┌──────────────────┼──────────────────┐
                                    │                  │                  │
                                    ▼                  ▼                  ▼
                          ┌──────────────────┐┌──────────────────┐┌──────────────────┐
                          │HTTP 201          ││HTTP 400          ││HTTP 401          │
                          │Success           ││Validation Error  ││Unauthorized      │
                          │+10 XP            ││                  ││                  │
                          └────────┬─────────┘└────────┬─────────┘└────────┬─────────┘
                                   │                    │                    │
                                   ▼                    ▼                    ▼
                         ┌──────────────────┐┌──────────────────┐┌──────────────────┐
                         │Show success toast││Show error toast  ││Redirect to       │
                         │"Meeting logged!" ││Stay on form      ││login             │
                         │Add to timeline   ││                  ││                  │
                         └──────────────────┘└──────────────────┘└──────────────────┘
```

---

### 2.4 Reminder Management Flow

#### 2.4.1 Quick Action: Create Reminder

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    QUICK ACTION: CREATE REMINDER FLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Hover over  │──────▶│  Action buttons  │
     │(Contacts)│       │  Contact     │       │  become visible │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────┐
                                               │  Click           │
                                               │  "Reminder"      │
                                               └────────┬─────────┘
                                                        │
                                                        ▼
                                    ┌───────────────────────────────────────────┐
                                    │  Default: Reminder for tomorrow, 9:00 AM  │
                                    │  Type: "followup"                          │
                                    │  Title: "Follow up with {contact.name}"   │
                                    └───────────────────────┬───────────────────┘
                                                            │
                                    ┌────────────────────────┼────────────────────────┐
                                    │                        │                        │
                                    ▼                        ▼                        ▼
                          ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
                          │  Accept defaults │    │  Edit reminder   │   │  Cancel          │
                          │  Click "Create"  │    │  Date/time/title │   │  Close modal    │
                          └────────┬─────────┘    └────────┬─────────┘   └──────────────────┘
                                   │                        │                        │
                                   ▼                        ▼                        ▼
                         ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
                         │HTTP 201          │    │HTTP 201          │   │No changes        │
                         │Reminder created │    │Reminder created │   └──────────────────┘
                         └────────┬─────────┘    └────────┬─────────┘
                                  │                        │
                                  ▼                        ▼
                         ┌──────────────────┐    ┌──────────────────┐
                         │Show success toast│    │Show success toast│
                         │"Reminder created!"│   │"Reminder created!"│
                         └────────┬─────────┘    └────────┬─────────┘
                                  │                        │
                                  ▼                        ▼
                         ┌──────────────────┐    ┌──────────────────┐
                         │Add to sidebar   │    │Add to sidebar   │
                         │reminder list    │    │reminder list    │
                         └──────────────────┘    └──────────────────┘
```

#### 2.4.2 View Upcoming Reminders

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      VIEW UPCOMING REMINDERS FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Look at     │──────▶│  Sidebar shows   │
     │          │       │  AI Sidebar │       │  upcoming         │
     └──────────┘       └──────────────┘       │  reminders        │
                                               │  sorted by date   │
                                               └────────┬─────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                              ▼                         ▼                         ▼
                    ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
                    │Reminder due today│     │Reminder due      │     │Reminder due in  │
                    │Shows "Today"     │     │tomorrow          │     │3+ days          │
                    │"Follow up with   │     │Shows "Tomorrow"  │     │Shows "3d", "5d"  │
                    │ Alice"           │     │                  │     │                  │
                    └──────────────────┘     └──────────────────┘     └──────────────────┘
```

#### 2.4.3 Complete Reminder

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE REMINDER FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Click the   │──────▶│  HTTP PUT         │
     │(Sidebar) │       │  checkbox    │       │  /reminders/:id  │
     └──────────┘       └──────────────┘       │  /complete       │
                                               └────────┬─────────┘
                                                        │
                                    ┌────────────────────┼────────────────────┐
                                    │                    │                    │
                                    ▼                    ▼                    ▼
                          ┌──────────────────┐┌──────────────────┐┌──────────────────┐
                          │HTTP 200          ││HTTP 404          ││HTTP 500          │
                          │+20 XP bonus     ││Reminder not      ││Server error      │
                          │Status → done    ││found             ││                  │
                          └────────┬─────────┘└────────┬─────────┘└────────┬─────────┘
                                   │                    │                    │
                                   ▼                    ▼                    ▼
                         ┌──────────────────┐┌──────────────────┐┌──────────────────┐
                         │Show success toast││Show error toast  ││Show error toast  │
                         │"Great job!" +20XP││"Reminder not     ││"Failed to        │
                         │Remove from list  ││found"            ││complete"         │
                         │or mark as done   ││                  ││                  │
                         └──────────────────┘└──────────────────┘└──────────────────┘
```

---

### 2.5 Gamification Flow

#### 2.5.1 View Stats

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            VIEW STATS FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Look at     │──────▶│  Stats Card      │
     │          │       │  Stats Card  │       │  Displays:       │
     └──────────┘       └──────────────┘       │  - Level: 5      │
                                               │  - XP: 340/500   │
                                               │  - Progress bar  │
                                               │  - Contacts: 23  │
                                               │  - Interactions: │
                                               │    156          │
                                               └────────┬─────────┘
                                                        │
                                                        ▼
                                              ┌──────────────────┐
                                              │  XP Progress Bar │
                                              │  [████████░░]    │
                                              │  340/500 to L6   │
                                              └──────────────────┘
```

#### 2.5.2 XP Gain Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            XP GAIN FLOW                                      │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐
     │ Action   │
     │ occurs   │
     └────┬─────┘
          │
          ▼
  ┌──────────────────┐
  │ Action type:     │
  │ - Log call: +10  │
  │ - Log message:+10│
  │ - Log meeting:+10│
  │ - Complete      │
  │   reminder: +20 │
  │ - Add contact: +50│
  └────────┬─────────┘
          │
          ▼
  ┌──────────────────┐
  │ Add XP to user   │
  │ xp = xp + amount │
  └────────┬─────────┘
          │
          ▼
  ┌──────────────────┐     ┌────────────┐
  │ Check level up   │────▶│ XP >=      │
  │ threshold       │     │ threshold? │
  └────────┬─────────┘     └─────┬──────┘
           │                       │
           ▼                       ├──────────┐
  ┌──────────────────┐            │          │
  │ threshold =      │            │ NO       │ YES
  │ level * 100      │            └──────────┘
  └────────┬─────────┘             │
           │                        ▼
           │               ┌──────────────────┐
           │               │ Level up!        │
           │               │ level++          │
           │               │ xp = xp - threshold│
           │               │ Show celebration │
           │               │ toast "Level X!" │
           │               └────────┬─────────┘
           │                        │
           └────────────────────────┘
                                    │
                                    ▼
                          ┌──────────────────┐
                          │ Update UI:      │
                          │ - XP counter    │
                          │ - Progress bar  │
                          │ - Level badge   │
                          └──────────────────┘
```

#### 2.5.3 Level Names

| Level Range | Name | XP Threshold |
|-------------|------|--------------|
| 1-10 | Social Novice | level * 100 |
| 11-25 | Network Builder | level * 150 |
| 26-50 | Relationship Master | level * 200 |
| 51-75 | Social Champion | level * 300 |
| 76-100 | Connection Virtuoso | level * 500 |

---

### 2.6 Celebration Management Flow

#### 2.6.1 View Celebration Packs

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       VIEW CELEBRATION PACKS FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │Dashboard │──────▶│  Navigate to │──────▶│  Celebration     │
     │          │       │  Celebrations│       │  Packs List      │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                              ▼                         ▼                         ▼
                    ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
                    │System Packs     │     │User Packs       │     │Click Pack       │
                    │(ownerId=null)   │     │(ownerId=userId) │     │                 │
                    │- Global Holidays│     │- My Custom Pack │     │View celebrations│
                    │- Buddhism       │     │                 │     │in this pack     │
                    └──────────────────┘     └──────────────────┘     └──────────────────┘
```

#### 2.6.2 Attach Celebration to Contact

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ATTACH CELEBRATION TO CONTACT FLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
     │ Contact │──────▶│  Click        │──────▶│  Celebration     │
     │ Details │       │  "Add         │       │  Picker Modal    │
     │          │       │  Celebration" │       │  Opens           │
     └──────────┘       └──────────────┘       └────────┬─────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              │                         │                         │
                              ▼                         ▼                         ▼
                    ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
                    │Search "Birthday"│     │Browse by        │     │Select "Buddhist  │
                    │Results show    │     │category         │     │New Year"         │
                    │Birthday options │     │- Religious       │     │                  │
                    └──────────────────┘     │- Cultural       │     └────────┬─────────┘
                                            │- Secular        │              │
                                            └──────────────────┘              │
                                                                           ▼
                                                                  ┌──────────────────┐
                                                                  │Optional: Override│
                                                                  │date for this     │
                                                                  │contact           │
                                                                  └────────┬─────────┘
                                                                           │
                                              ┌────────────────────────────┼────────────────────────────┐
                                              │                            │                            │
                                              ▼                            ▼                            ▼
                                    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
                                    │Keep default     │    │Set custom date   │    │Skip reminder     │
                                    │date from pack   │    │e.g. different   │    │uncheck "Remind"  │
                                    │shouldRemind:true│    │Buddhist BD      │    │                  │
                                    └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
                                             │                         │                         │
                                             ▼                         ▼                         ▼
                                    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
                                    │Click "Attach"   │    │Click "Attach"   │    │Click "Attach"   │
                                    └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
                                             │                         │                         │
                                             ▼                         ▼                         ▼
                                    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
                                    │HTTP 201         │    │HTTP 201         │    │HTTP 201         │
                                    │ContactCelebrati-│    │ContactCelebrati-│    │ContactCelebrati-│
                                    │on created       │    │on created       │    │on created       │
                                    └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
                                             │                         │                         │
                                             ▼                         ▼                         ▼
                                    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
                                    │Show success toast│    │Show success toast│    │Show success toast│
                                    │Celebration shown │    │Celebration shown │    │Reminder disabled │
                                    │in contact detail │    │in contact detail │    │for this contact  │
                                    └──────────────────┘    └──────────────────┘    └──────────────────┘
```

---

## 3. User Stories

### 3.1 Authentication

```gherkin
Feature: Authentication

  Scenario: New user registers with invite code
    Given I am on the login page
    When I click "Sign up"
    And I enter my name "Test User"
    And I enter email "test@example.com"
    And I enter password "TestPass123"
    And I enter a valid invite code
    And I click "Create Account"
    Then I am redirected to the dashboard
    And my name "Test User" appears in the sidebar

  Scenario: Existing user logs in
    Given I am on the login page
    When I enter email "user@example.com"
    And I enter password "ValidPass123"
    And I click "Sign In"
    Then I am redirected to the dashboard
    And my token is stored in localStorage

  Scenario: User logs out
    Given I am logged in to the dashboard
    When I click "Sign Out"
    Then I am redirected to the login page
    And my token is removed from localStorage

  Scenario: User fails login with wrong password
    Given I am on the login page
    When I enter email "user@example.com"
    And I enter password "WrongPassword"
    And I click "Sign In"
    Then I see an error message "Invalid email or password"
    And I remain on the login page
```

### 3.2 Contact Management

```gherkin
Feature: Contact Management

  Scenario: User adds a new contact
    Given I am logged in to the dashboard
    When I click "Add Contact"
    Then the Add Contact modal opens
    When I fill in first name "Alice"
    And I fill in last name "Smith"
    And I fill in company "Acme Corp"
    And I click "Create Contact"
    Then the modal closes
    And "Alice Smith" appears in the contact list
    And I see a success toast "Contact Alice created!"

  Scenario: User searches contacts
    Given I have 3+ contacts in my list
    When I type "Alice" in the search box
    Then I only see contacts matching "Alice"
    And other contacts are hidden

  Scenario: User filters contacts by label
    Given I have contacts with label "Networking"
    When I click the filter "Networking"
    Then I only see contacts with label "Networking"

  Scenario: Contact shows quick action buttons on hover
    Given I am on the dashboard with contacts
    When I hover over a contact card
    Then I see Call, Message, and Reminder buttons
    And they are invisible until hover

  Scenario: User deletes a contact
    Given I am viewing a contact's details
    When I click "Delete Contact"
    And I confirm the deletion
    Then the contact is removed from my list
    And all associated interactions are deleted
    And I see a success toast "Contact deleted"
```

### 3.3 Interaction Tracking

```gherkin
Feature: Interaction Tracking

  Scenario: User logs a call via quick action button
    Given I am logged in with contacts
    When I hover over a contact card
    And I click the Call button
    Then an interaction of type "call" is created
    And I see a success toast "Call logged!"
    And my XP increases by 10
    And the interaction appears in the contact's timeline

  Scenario: User logs a message via quick action button
    Given I am logged in with contacts
    When I hover over a contact card
    And I click the Message button
    Then an interaction of type "message" is created
    And I see a success toast "Message logged!"

  Scenario: User logs a meeting with details
    Given I am viewing a contact's details
    When I click "Log Meeting"
    And I enter title "Q1 Review"
    And I set the date to today
    And I set duration to 60 minutes
    And I add notes "Discussed project timeline"
    And I click "Save"
    Then an interaction of type "meeting" is created
    And I see a success toast "Meeting logged!"
    And the meeting appears in the timeline

  Scenario: User logs a note
    Given I am viewing a contact's details
    When I click "Add Note"
    And I enter "Had a great conversation about AI trends"
    And I click "Save"
    Then an interaction of type "note" is created
```

### 3.4 Gamification

```gherkin
Feature: Gamification

  Scenario: User sees correct XP and level
    Given I am logged in
    Then I see my current XP in the stats card
    And I see my current level
    And I see XP progress bar with current/needed values

  Scenario: XP increases after logging interaction
    Given I have 50 XP and Level 1
    When I log a call interaction
    Then my XP increases by 10 (to 60)
    And the XP counter updates immediately
    And the XP progress bar updates

  Scenario: Level up triggers celebration
    Given I have 90 XP at Level 1 (need 100 to level up)
    When I log a call interaction (+10 XP)
    Then my XP becomes 100
    And I level up to Level 2
    And I see a celebration toast "Level 2 - Network Builder!"

  Scenario: User sees contact count
    Given I have 6 contacts
    Then the stats card shows "Total Contacts: 6"
```

### 3.5 Reminders

```gherkin
Feature: Reminders

  Scenario: Quick reminder created for tomorrow
    Given I am logged in with contacts
    When I hover over a contact card
    And I click the Reminder button
    Then a reminder is created for tomorrow at 9:00 AM
    And the title is "Follow up with {contact.name}"
    And I see a success toast "Reminder created!"
    And the reminder appears in the sidebar reminder list

  Scenario: Upcoming reminders appear in sidebar
    Given I have reminders scheduled
    Then the AI sidebar shows my upcoming reminders
    And they are sorted by nearest date first

  Scenario: Reminder shows days until due
    Given a reminder is due tomorrow
    Then it shows "Tomorrow" label
    When a reminder is due today
    Then it shows "Today" label
    When a reminder is due in 3 days
    Then it shows "3d" label

  Scenario: User completes a reminder
    Given I have a pending reminder
    When I click the checkbox next to it
    Then the reminder status changes to "done"
    And I earn +20 XP bonus
    And the reminder is removed from the pending list
```

### 3.6 Celebrations

```gherkin
Feature: Celebrations

  Scenario: User views available celebration packs
    Given I am logged in
    When I navigate to Celebrations
    Then I see system packs (Global Holidays, Buddhism, etc.)
    And I see my custom packs if any

  Scenario: User attaches birthday to contact
    Given I am viewing a contact's details
    When I click "Add Celebration"
    And I search for "Birthday"
    And I select the "Birthday" celebration
    And I click "Attach"
    Then the birthday is linked to the contact
    And it will appear in upcoming celebrations

  Scenario: User overrides celebration date for contact
    Given I am attaching a celebration to a contact
    When the celebration has a lunar calendar date
    And I enable "Use different date for this contact"
    And I select "2026-05-15"
    Then this contact's celebration uses the override date
    And other contacts using this celebration are unaffected

  Scenario: User disables reminder for specific contact celebration
    Given I am attaching a celebration to a contact
    When I uncheck "Send reminder"
    Then no reminder will be generated for this contact's celebration
```

---

## 4. Edge Cases & Error Handling

### 4.1 Authentication Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty email field | Show validation error "Email is required" |
| Invalid email format | Show validation error "Please enter a valid email" |
| Empty password field | Show validation error "Password is required" |
| Password < 8 characters | Show validation error "Password must be at least 8 characters" |
| Wrong password | Show error "Invalid email or password" (don't reveal which) |
| Email not found | Show same error as wrong password (prevent enumeration) |
| Expired JWT token | Redirect to login page with message "Session expired" |
| Malformed JWT | Clear token, redirect to login |

### 4.2 Contact Management Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty first name | Show validation error "First name is required" |
| Duplicate contact (same name + company) | Allow (no unique constraint on name) |
| Search with special characters | Escape SQL, return empty results |
| Very long name (> 255 chars) | Truncate with validation error |
| Delete contact with interactions | Cascade delete all interactions |
| Delete contact with reminders | Cascade delete all reminders |
| Update contact to empty first name | Show validation error |

### 4.3 Interaction Logging Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Log interaction for deleted contact | Return 404, contact not found |
| Log interaction without type | Show validation error |
| Very long interaction note (> 10000 chars) | Truncate or show error |
| Concurrent interaction logging | Handle with optimistic locking |
| Contact already has interaction at same timestamp | Allow (no unique constraint) |

### 4.4 Reminder Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Reminder for deleted contact | Cascade delete reminder |
| Past due reminder | Show as overdue with "Overdue" label |
| Reminder exactly today | Show "Today" label |
| Reminder exactly tomorrow | Show "Tomorrow" label |
| Reminder in > 30 days | Show day count (e.g., "15d") |
| Recurring reminder completion | Reset for next occurrence |
| Invalid repeat interval | Ignore invalid, default to non-recurring |

### 4.5 Gamification Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| XP would exceed level threshold | Level up, apply remaining XP to next level |
| Multiple simultaneous level ups | Process one at a time, show each toast |
| XP goes negative | Clamp to 0 |
| Level exceeds 100 | Cap at 100, show "Max Level Reached" |
| Streak broken | Reset streakDays to 0, no penalty |

### 4.6 Celebration Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Lunar date conversion fails | Fall back to Gregorian date, log warning |
| Contact celebration with deleted celebration | Cascade delete junction record |
| Contact celebration with deleted contact | Cascade delete junction record |
| Same celebration attached twice to same contact | Show error "Celebration already attached" |
| Access celebration pack without permission | Return 404 for custom packs of other users |
| System pack celebration date is YYYY-MM-DD | Treat as non-recurring one-time event |
| Empty celebration search results | Show "No celebrations found" message |

### 4.7 API Error Responses

All API errors follow this format:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "firstName",
      "message": "First name is required"
    }
  ]
}
```

| HTTP Status | Meaning |
|-------------|---------|
| 400 | Bad Request - Validation failed |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Not allowed to access resource |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource (e.g., email exists) |
| 500 | Internal Server Error - Something went wrong on server |

---

## 5. Technical Considerations

### 5.1 Database Design

#### Cascading Deletes

The following relationships use cascade delete:
- `Contact` → `Interaction`, `Reminder`, `Task`, `Gift`, `Activity`, `ContactField`, `ContactCelebration`
- `Vault` → `Contact`, `VaultMember`
- `CelebrationPack` → `Celebration`
- `Celebration` → `ContactCelebration`
- `User` → `Contact`, `Interaction`, `Reminder`, `Achievement`, `Vault`, `Session`

**Important:** When deleting a contact, all related data is deleted. No soft-delete in MVP.

#### Indexes

Indexes exist on:
- `Contact`: `vaultId`, `ownerId`, `lastContactedAt`, `nextReminderAt`
- `Interaction`: `contactId`, `ownerId`, `occurredAt`
- `Reminder`: `contactId`, `ownerId`, `scheduledAt`, `status`
- `ContactCelebration`: `contactId`, `celebrationId`, `ownerId`

### 5.2 Authentication

#### JWT Token Structure

```json
{
  "sub": "user_cuid",
  "email": "user@example.com",
  "iat": 1713000000,
  "exp": 1713086400
}
```

- Token expiry: 24 hours
- Stored in `localStorage` (consider httpOnly cookie for enhanced security post-MVP)
- Authorization header: `Bearer <token>`

#### Password Security

- Minimum 8 characters
- bcrypt hashing with cost factor 12
- Never log or return password hashes

### 5.3 XP Calculation Rules

```typescript
const XP_VALUES = {
  interaction: 10,      // call, message, meeting, note
  reminderComplete: 20,  // completing a reminder
  addContact: 50,        // adding new contact
  achievement: 100,      // unlocking achievement
  streakBonus: 15,      // maintaining daily streak
};

const LEVEL_THRESHOLDS = {
  1: 100,    // 1-10: Social Novice
  11: 150,   // 11-25: Network Builder
  26: 200,   // 26-50: Relationship Master
  51: 300,   // 51-75: Social Champion
  76: 500,   // 76-100: Connection Virtuoso
};

function getXPThreshold(level: number): number {
  if (level <= 10) return 100;
  if (level <= 25) return 150;
  if (level <= 50) return 200;
  if (level <= 75) return 300;
  return 500;
}
```

### 5.4 Lunar Calendar Computation

For celebrations with `calendarType: "lunar"` or `"chinese"`:

```typescript
// Lunar date conversion is complex - use a library like:
// - lunolar (npm) for basic lunar calendar
// - chinese-calendar (npm) for Chinese lunar calendar

// The celebration date field stores the lunar month and day
// e.g., "01-15" for Chinese New Year (1st month, 15th day)
// This must be converted to Gregorian for display and reminder scheduling
```

**Note:** Lunar calendar computation is complex. For MVP:
1. Store lunar dates as-is in MM-DD format
2. Use a library for conversion to Gregorian
3. Handle edge cases (leap months, etc.) gracefully

### 5.5 Performance Considerations

| Concern | Mitigation |
|---------|------------|
| Large contact lists (500+) | Paginate API responses (default 20, max 100) |
| Frequent XP updates | Batch updates, debounce UI updates |
| Celebration date computation | Cache converted dates, invalidate on user timezone change |
| Search with wildcards | Use indexed search, limit results |
| Real-time updates | Consider WebSocket for reminder notifications (post-MVP) |

### 5.6 Input Validation

All user inputs must be sanitized:

```typescript
// Contact names
- Trim whitespace
- Max length: 255 characters
- Allow Unicode letters, spaces, hyphens, apostrophes

// Email
- Validate format (RFC 5322)
- Normalize to lowercase

// Phone numbers
- Store raw input (don't normalize - international formats vary)

// Tags/Labels
- Max 50 tags per contact
- Max tag length: 50 characters
- Deduplicate on save

// Interaction content
- Max length: 10,000 characters
- Strip HTML tags
```

### 5.7 Time Zones

- All dates stored in UTC (PostgreSQL `timestamptz`)
- Display in user's local timezone (detect via browser or user preference)
- For recurring events (birthdays), store the user's timezone offset for accurate reminder scheduling

### 5.8 Error Logging

Log the following for debugging:

```typescript
// Log levels: error, warn, info, debug
// Include: timestamp, userId (if authenticated), requestId, error stack

logger.error('Failed to create contact', {
  userId: req.user.id,
  error: error.message,
  stack: error.stack,
  body: req.body,
});
```

---

## 6. Database Schema Reference

See `services/api/prisma/schema.prisma` for the complete schema. Key entities:

### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  avatar        String?
  passwordHash  String?
  xp            Int       @default(0)
  level         Int       @default(1)
  streakDays    Int       @default(0)
  lastActiveAt  DateTime?
  // relations: contacts, interactions, reminders, achievements, vaults, sessions
}
```

### Contact
```prisma
model Contact {
  id              String    @id @default(cuid())
  firstName       String
  lastName        String?
  company         String?
  jobTitle        String?
  birthday        DateTime?
  labels          String[]  @default([])
  relationshipScore Int     @default(50)
  lastContactedAt DateTime?
  // relations: interactions, reminders, contactFields, contactCelebrations
}
```

### Interaction
```prisma
model Interaction {
  id          String    @id @default(cuid())
  type        String    // call, message, meeting, note, email, social
  title       String?
  content     String?
  occurredAt  DateTime  @default(now())
  xpEarned    Int       @default(10)
  // relations: contact, owner
}
```

### Reminder
```prisma
model Reminder {
  id            String    @id @default(cuid())
  type          String    // birthday, followup, custom, anniversary
  title         String
  scheduledAt   DateTime
  completedAt   DateTime?
  repeatInterval String?  // daily, weekly, monthly, yearly
  status        String    @default("pending")
  // relations: contact, owner
}
```

### CelebrationPack & Celebration
```prisma
model CelebrationPack {
  id          String   @id @default(cuid())
  ownerId     String?  // null = system pack
  name        String
  isDefault   Boolean  @default(false)
  // relations: celebrations
}

model Celebration {
  id           String   @id @default(cuid())
  name         String
  date         String   // MM-DD format (recurring)
  fullDate     DateTime? // YYYY-MM-DD for one-time
  calendarType String   @default("gregorian")
  // relations: pack, contactCelebrations
}

model ContactCelebration {
  contactId     String
  celebrationId String
  customDate    DateTime?
  status        String   @default("active")
  shouldRemind  Boolean  @default(true)
}
```

---

## 7. API Contracts

### Authentication

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| POST | `/api/auth/register` | No | `{email, password, name?, inviteCode?}` | `{accessToken, user}` |
| POST | `/api/auth/login` | No | `{email, password}` | `{accessToken, user}` |
| POST | `/api/auth/logout` | Yes | - | `{success: true}` |

### Contacts

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| GET | `/api/contacts` | Yes | `?search=&label=&page=&limit=` | `{contacts: Contact[], total}` |
| POST | `/api/contacts` | Yes | `{firstName, lastName?, company?, ...}` | `Contact` |
| GET | `/api/contacts/:id` | Yes | - | `Contact` |
| PUT | `/api/contacts/:id` | Yes | `{firstName?, lastName?, ...}` | `Contact` |
| DELETE | `/api/contacts/:id` | Yes | - | `{success: true}` |

### Interactions

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| GET | `/api/interactions` | Yes | `?contactId=&type=&page=` | `{interactions: Interaction[]}` |
| POST | `/api/interactions` | Yes | `{contactId, type, title?, content?, occurredAt?}` | `Interaction` |
| GET | `/api/interactions/:id` | Yes | - | `Interaction` |

### Reminders

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| GET | `/api/reminders/upcoming` | Yes | `?days=30` | `{reminders: Reminder[]}` |
| POST | `/api/reminders` | Yes | `{contactId, title, type, scheduledAt, repeatInterval?}` | `Reminder` |
| PUT | `/api/reminders/:id/complete` | Yes | - | `Reminder` |
| DELETE | `/api/reminders/:id` | Yes | - | `{success: true}` |

### Gamification

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| GET | `/api/gamification/stats` | Yes | - | `{user: User, stats: Stats}` |
| GET | `/api/achievements` | Yes | - | `{achievements: Achievement[]}` |
| POST | `/api/achievements/:id/claim` | Yes | - | `{achievement, xpBonus}` |

### Celebrations

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| GET | `/api/celebrations/packs` | Yes | - | `{packs: CelebrationPack[]}` |
| GET | `/api/celebrations/packs/:packId` | Yes | - | `{pack, celebrations}` |
| GET | `/api/celebrations/contacts/:contactId` | Yes | - | `{celebrations: ContactCelebration[]}` |
| POST | `/api/celebrations/contacts/:contactId` | Yes | `{celebrationId, customDate?, shouldRemind?}` | `ContactCelebration` |
| PUT | `/api/celebrations/contacts/:contactId/:celebrationId` | Yes | `{customDate?, shouldRemind?, status?}` | `ContactCelebration` |
| DELETE | `/api/celebrations/contacts/:contactId/:celebrationId` | Yes | - | `{success: true}` |

---

## Appendix A: Interaction Types

| Type | Icon | XP | Description |
|------|------|----|-------------|
| call | 📞 | 10 | Phone call |
| message | 💬 | 10 | Text message |
| meeting | 🤝 | 10 | In-person meeting |
| note | 📝 | 10 | Note or thought |
| email | ✉️ | 10 | Email exchange |
| social | 🌐 | 10 | Social media interaction |

---

## Appendix B: Reminder Types

| Type | Icon | Default Title |
|------|------|---------------|
| birthday | 🎂 | "Birthday of {name}" |
| followup | 📌 | "Follow up with {name}" |
| meeting | 📅 | "Meeting with {name}" |
| anniversary | 💑 | "Anniversary with {name}" |
| custom | ⏰ | User-provided title |

---

*Document Version: 1.0.0*  
*Created: 2026-04-14*  
*Author: Hermes (CTO)*
