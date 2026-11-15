# Project State & Context
**Last Updated:** November 15, 2026, 18:35 IST (v2.0.0 Black-Free Tri-Color Palette, Editorial Product Cockpit, 3D WebGL Canvas & Tactile Sticker Integration)

---

## 1. Project Overview

**Qwenton** (`qwenton-agents`) is an autonomous AI coworker platform, social lead generation engine, and agency operating system. It features real-time **Instagram Reel Comment-to-DM lead generation**, multi-coworker swarms, Telegram mobile push approvals, and zero-Docker serverless deployment on Vercel and Firebase.

### Operating Standards & Non-Negotiable Directives:
- **Black-Free & Primary-Free Tri-Color Contrast System (60-30-10 Solid Planes)**:
  - **Zero Black / Shades of Black**: Absolute prohibition on `#000`, `text-black`, `bg-black`, and graphite/carbon tones across user pages.
  - **Zero Primary Colors**: Absolute prohibition on raw red, blue, and yellow or their saturated primaries.
  - **Solid Planes**: Zero `bg-gradient-*` gradients; all structural cards and buttons use solid matte planes.
  - **3-Color Token Architecture**:
    - **60% Dominant Base**: Warm Alabaster Oat / Linen (`oklch(96.5% 0.015 95)` / `#F6F3EB`), pure chalk panels (`#FDFAF6`), and biscuit wells (`#EDE7DC`).
    - **30% Structure & High-Contrast Typography**: Deep Forest Pine (`oklch(29% 0.075 155)` / `#163A29`), providing deep visual weight and $>9:1$ WCAG AAA contrast against Alabaster without using black, plus balanced sage copy (`#496C5A`).
    - **10% High-Contrast Focal Accent**: Signal Cyber Mint (`oklch(78% 0.17 162)` / `#12E896`) paired with Deep Pine typography (`text-[#163A29]`), plus warm Terracotta Copper (`oklch(64% 0.14 42)` / `#C86241`) for the human approval checkpoint.
- **Physical Sticker & Vector Badging**:
  - Embedded tactile vector seal (`/stickers/autonomous-seal.svg`) in Deep Pine and Signal Mint with micro-tilt interaction.
  - Interactive coding coworker animation sticker (`/stickers/coding-agent.gif`) anchored in the hero cockpit.
- **Pure Code & 3D WebGL Product Cockpit**:
  - Removed all raster reference images (`hero-bot-stage.webp`, `refrence.png`).
  - Integrated interactive 3D WebGL Three.js canvas in Deep Pine and Signal Mint materials with real-time mouse parallax.
- **Human-in-the-Loop Approval Firewall**:
  - Every external action (Instagram direct message, comment response) pauses at the approval checkpoint.

---

## 2. Architecture & Design Implementation

### Key Components:
1. **Editorial Product Cockpit (`components/landing/EditorialProductCockpit.tsx`)**:
   - WebGL 3D geometric coworker node (Pine core + Mint wireframe cage) with ambient and directional key lights.
   - 3 floating interactive product cards in Deep Pine (`bg-pine text-alabaster`) connected by curved SVG dashed arrows:
     1. Inbound comment card (`@maya: "Send me the growth guide"`).
     2. Human approval card with drafted response, Edit button, and active Coral Approve button.
     3. Delivered DM card with *Human approved* verification badge.
   - Anchored physical animated sticker (`/stickers/coding-agent.gif`) and tactile autonomous seal.
2. **Interactive 4-Stage Stepper (`components/landing/HeroWorkflowStepper.tsx`)**:
   - Floating pill bar with 4 stages (`Comment received`, `Understand`, `Human approval`, `DM delivered`) in Alabaster and Deep Pine with Signal Mint active indicators.
3. **Instant Audit Sandbox (`components/landing/InstantAuditSandbox.tsx`)**:
   - Fast agency competitor audit engine fully styled in Deep Pine and Signal Mint with zero black text.
4. **Structured Landing Page Flow (`app/page.tsx`)**:
   - Complete 7-section user landing page adhering to the black-free tri-color contract, high-contrast typography, and accessible interactive controls.

---

## 3. Verification & Quality Assurance

- **Typecheck**: `npm run typecheck` passes with zero errors (exit code `0`).
- **Build**: `npm run build` compiles all 57 static and dynamic routes cleanly.
- **Color Audit**: 0 occurrences of `text-black`, `bg-black`, `#000000`, or graphite tones across landing page and landing components.
