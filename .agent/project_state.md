# Project State & Context
**Last Updated:** November 15, 2026, 17:55 IST (v1.0.0 Editorial Product Theatre, 3D Bot Workspace & Interactive 4-Stage Workflow matching imp.md and refrence.png)

---

## 1. Project Overview

**Qwenton** (`qwenton-agents`) is an autonomous AI coworker platform, marketing automation engine, and agency operating system. It features real-time **Instagram Reel Comment-to-DM lead generation**, multi-agent swarms, Telegram mobile push approvals, and zero-Docker serverless deployment on Vercel and Firebase.

### Operating Standards & Non-Negotiable Directives:
- **Editorial Product Theatre & Clean Customer-Facing UI**:
  - Implements the exact design, positioning, and visual composition from `imp.md` and `refrence.png`.
  - Zero internal implementation or design methodology jargon displayed to visitors.
  - Zero third-party AI vendor names ("Groq", "Grok", "Gemini", "OpenAI") across all pages.
  - Zero emojis in body text and headlines.
- **Palette & Typography**:
  - Canvas: Warm paper `oklch(97% 0.012 90)` (`#F8F6F1`).
  - Ink: Deep graphite `oklch(21% 0.025 255)` (`#16191F`).
  - Surface: Softened graphite `oklch(27% 0.03 255)` (`#1E2229`) for dark product cards, pure chalk `oklch(100% 0 0)` for light cards.
  - Action Mint: `oklch(76% 0.16 165)` (`#2BE49C` / `#10E599`).
  - Human Approval Coral: `oklch(65% 0.17 28)` (`#FF7A66`).
  - Typography: `Space Grotesk` (Display), `Plus Jakarta Sans` (Body & Controls), `JetBrains Mono` (System Labels).

---

## 2. Brainstormed Ideas & Architecture

### Top 3 Brainstormed Upgrades:
1. **Photorealistic 3D Bot Workspace & Product Theatre (`components/landing/HeroBotTheatre.tsx`)**:
   - Replaced abstract empty panels with the authentic 3D desktop robot coworker on a natural wooden workspace desk (with laptop, coffee mug "Less tasks. More growth. Q", and books), complete with subtle mouse parallax and 3 floating interactive product cards connected via curved dashed arrows.
2. **Interactive 4-Stage Stepper & In-Card Coral Approval Gate (`components/landing/HeroWorkflowStepper.tsx`)**:
   - Built a floating pill bar with 4 stages: `(1) Comment received`, `(2) Understand`, `(3) Human approval`, `(4) DM delivered`.
   - Clicking `✓ Approve` on the coral pill inside the approval card triggers a live state transition to the delivered direct message card.
3. **Structured Editorial Landing Page Flow (`app/page.tsx`)**:
   - Implemented the 7-section flow specified in `imp.md`:
     1. Hero Product Theatre with 3D Bot & Stepper
     2. Product Proof: 3-step horizontal simulator (`Comment arrives → Human approves → DM delivered`)
     3. Why Human Approval Matters: Asymmetric trust layout with coral gate
     4. Agent Coworker Roster: 4 specialized agents with interactive selector
     5. Growth Audit Sandbox: 5-second agency intelligence engine
     6. Transparent 4-Tier Pricing & Clean FAQ Accordion
     7. Compact Closing CTA & Clean Technical Footer

---

## 3. Current Progress Audit

### Completed Milestones:
- **Design Tokens (`app/globals.css` & `tailwind.config.ts`)**: Warm paper canvas, deep graphite ink, action mint, and approval coral.
- **Hero Theatre (`components/landing/HeroBotTheatre.tsx`)**: Desktop bot workspace, 3 floating UI cards, mouse parallax, in-card coral approval button.
- **Workflow Stepper (`components/landing/HeroWorkflowStepper.tsx`)**: Floating 4-stage pill bar with active step synchronization.
- **Landing Page Rebuild (`app/page.tsx`)**: Complete 7-section rebuild matching `refrence.png` and `imp.md`.
- **Verification**: `npm run typecheck` passed (exit code `0`), `npm run build` compiled all 57 static/dynamic pages in 33.9s (exit code `0`).

---

## 4. Pending Work & Next Steps

All phases in `.plan/roadmap.md` are actively tracked. Ready for next automated execution task.
