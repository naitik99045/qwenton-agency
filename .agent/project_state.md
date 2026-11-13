# Project State & Context
**Last Updated:** November 13, 2026, 13:05 IST (v0.9.0 3D Agent Core Artifact, Dark/Light Mode Tri-Color Engine, Scroll-Linked Pipeline & Space Grotesk Typography)

---

## 1. Project Overview

**Qwenton** (`qwenton-agents`) is an autonomous AI coworker platform, marketing automation engine, and agency operating system. It features real-time **Instagram Reel Comment-to-DM lead generation**, multi-agent swarms, Telegram mobile push approvals, and zero-Docker serverless deployment on Vercel and Firebase.

### Operating Standards & Non-Negotiable Directives:
- **Strictly Non-Primary Tri-Color Architecture (qwenton-ui 60-30-10 Solid OKLCH)**:
  - **Light Mode (`:root`)**:
    - **60% Dominant Base**: Architectural Porcelain (`oklch(97.6% 0.005 250)`).
    - **30% Structure & High-Contrast Typography**: Elevated Pure Chalk (`oklch(100% 0 0)`), Hairline Slate Borders (`oklch(88% 0.012 250)`), and Deep Obsidian Ink (`oklch(18% 0.02 250)`).
    - **10% Light / Focal Accent**: Signal Cyber Mint (`oklch(76% 0.16 160)`) on buttons with bold black text, and Forest Emerald (`oklch(44% 0.16 160)`) for icons/links.
  - **Dark Mode (`.dark`)**:
    - **60% Dominant Base**: Deep Obsidian Carbon (`oklch(14.5% 0.015 250)`).
    - **30% Structure & High-Contrast Typography**: Elevated Graphite Slate (`oklch(19.5% 0.018 250)`), Hairline Borders (`oklch(27% 0.018 250)`), and Softened Platinum Chalk (`oklch(96% 0.005 90)`).
    - **10% Light / Focal Accent**: High-Voltage Cyber Mint (`oklch(78% 0.16 158)`).
  - **Zero Orange & Zero Primary Colors**: 100% free of orange (`#D96B27`), pure blue, pure red, and pure yellow.
  - **Strictly Zero Gradients**: Zero `bg-gradient-*`, zero radial glows, zero purple/neon haze.
- **Typography Pairing**:
  - Display Headings: `Space Grotesk` (`--font-display`).
  - Body & Interfaces: `Plus Jakarta Sans` (`--font-sans`).
  - Technical Metrics & Code: `JetBrains Mono` (`--font-mono`).
- **Interactive 3D Artifact**:
  - Three.js Autonomous Agent Neural Core (`components/landing/ThreeAgentCore.tsx`) featuring rotating gimbal rings, orbiting satellite data nodes, pointer-tracked lerp tilt, scroll-responsive ring scaling, and automated theme synchronization.
- **Scroll Effects**:
  - Fixed 2px hairline scroll progress bar (`components/landing/ScrollProgressBar.tsx`).
  - 3-stage scroll-reactive execution pipeline (`components/landing/ScrollPipeline.tsx`).
- **Total Purge of AI Vendor Hype & Emojis**:
  - Zero mentions of "Groq", "Grok", "Gemini", or "OpenAI".
  - Zero emojis across all pages and mockups.

---

## 2. Brainstormed Upgrades & Architectural Decisions

### Top 3 Brainstormed Upgrades:
1. **Full Dark Mode & Light Mode Tri-Color Engine (`app/globals.css`)**:
   - Implemented symmetrical 60-30-10 OKLCH tri-color palettes for both Light Mode (`:root`) and Dark Mode (`.dark`).
   - Clean dynamic switching via `ThemeToggle` with zero page reload and high WCAG AAA contrast ratios.
2. **Three.js 3D Autonomous Agent Neural Core (`components/landing/ThreeAgentCore.tsx`)**:
   - Built a custom 3D artifact representing the core agent engine, complete with dual orbital gimbal rings (Tool Execution & Social Webhook), orbiting satellite nodes, interactive mouse tilt, and SVG accessible fallback.
3. **Scroll-Linked Telemetry Bar & Deterministic Execution Pipeline (`components/landing/ScrollPipeline.tsx`)**:
   - Integrated a top scroll progress bar and a 3-stage interactive pipeline that updates in real-time as the user scrolls, visualizing webhook capture, approval firewall, and Meta Graph API v20.0 dispatch.

---

## 3. Current Progress Audit

### Completed Milestones:
- **Design Tokens (`app/globals.css` & `tailwind.config.ts`)**: Full Dark and Light Mode palettes, zero orange, zero primary colors.
- **Typography (`app/layout.tsx`)**: `Space Grotesk`, `Plus Jakarta Sans`, and `JetBrains Mono` configured via `next/font/google`.
- **3D Hero Artifact (`components/landing/ThreeAgentCore.tsx`)**: Three.js scene mounted in hero right column.
- **Scroll Effects (`components/landing/ScrollProgressBar.tsx` & `components/landing/ScrollPipeline.tsx`)**: Real-time progress bar and 3-stage interactive pipeline.
- **Verification**: `npm run typecheck` passed (exit code `0`), `npm run build` compiled all 57 static/dynamic pages (exit code `0`).

---

## 4. Pending Work & Next Steps

All core phases in `.plan/roadmap.md` are actively tracked. Ready for next automated execution task.
