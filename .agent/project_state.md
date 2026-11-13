# Project State & Context
**Last Updated:** November 13, 2026, 13:18 IST (v0.9.1 Clean Header, Scroll-Animated Stickers, Deep 3D Perspective, and Purge of Internal Meta-Jargon)

---

## 1. Project Overview

**Qwenton** (`qwenton-agents`) is an autonomous AI coworker platform, marketing automation engine, and agency operating system. It features real-time **Instagram Reel Comment-to-DM lead generation**, multi-agent swarms, Telegram mobile push approvals, and zero-Docker serverless deployment on Vercel and Firebase.

### Operating Standards & Non-Negotiable Directives:
- **Clean Customer-Facing UI**:
  - Zero internal implementation or design methodology jargon (such as "60-30-10", "OKLCH", or color token codes) displayed to visitors.
  - Zero third-party AI vendor names ("Groq", "Grok", "Gemini", "OpenAI") across all user-facing landing, pricing, billing, and privacy pages.
  - Zero emojis across all pages and mockups.
- **Header & Navigation Polish**:
  - Removed top black telemetry bar; landing page opens cleanly with the sticky glassmorphic navigation header.
- **Scroll-Animated Stickers & 3D Depth**:
  - `components/landing/TactileSticker.tsx` features dynamic scroll-reactive physics (`translateY` parallax and subtle tilt) hosting both `/stickers/coding-agent.gif` and `/stickers/multitask-agent.gif`.
  - `components/landing/ThreeAgentCore.tsx` features dynamic camera zoom (`camera.position.z`), orbital ring expansion, and tilt elevation on scroll.
  - `components/landing/ScrollProgressBar.tsx` hairline scroll progress indicator at top of page.
  - `components/landing/ScrollPipeline.tsx` interactive 3-stage scroll execution lifecycle.

---

## 2. Brainstormed Upgrades & Architectural Decisions

### Top 3 Brainstormed Upgrades:
1. **Clean Navigation & Header Streamlining**:
   - Eliminated the cluttered black telemetry bar above the navigation bar, providing a focused, high-craft viewport entrance.
2. **Scroll-Animated Interactive GIF Stickers**:
   - Sourced and deployed dynamic scroll-reactive physics to animated developer bot stickers (`coding-agent.gif` and `multitask-agent.gif`), allowing them to gracefully float and tilt as the visitor navigates.
3. **Total Purge of Internal Implementation Meta-Data**:
   - Replaced all visible developer jargon and internal color formula references with professional, customer-facing product value propositions.

---

## 3. Current Progress Audit

### Completed Milestones:
- **Landing Page Polish (`app/page.tsx`)**: Removed top bar, replaced internal tokens with customer copy, embedded scroll-reactive multitask bot sticker.
- **Sticker Physics (`components/landing/TactileSticker.tsx`)**: Added `multitask-bot` variant and `scrollReactive` sinusoidal parallax floating.
- **3D Artifact (`components/landing/ThreeAgentCore.tsx`)**: Enhanced scroll camera depth and orbital expansion.
- **Privacy Page (`app/privacy/page.tsx`)**: Purged vendor AI names.
- **Agent Chat (`app/agents/[agentId]/page.tsx`)**: Removed lingering cobalt gradient and replaced with solid tokens.
- **Verification**: `npm run typecheck` passed (exit code `0`), `npm run build` compiled all 57 static/dynamic pages in 25.8s (exit code `0`).

---

## 4. Pending Work & Next Steps

All phases in `.plan/roadmap.md` are actively tracked. Ready for next automated execution task.
