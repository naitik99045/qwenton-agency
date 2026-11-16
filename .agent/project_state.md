# Project State & Context
**Last Updated:** November 16, 2026, 12:32 IST (v3.2.0 Hero Table Purged • Interactive Hero Sticker & GIF Stage Deployed • Linen 60% + Moss 30% + Ochre 10%)

---

## 1. Project Overview

**Qwenton** (`qwenton-agents`) is an autonomous AI coworker platform, Instagram Reel lead generation engine, and agency operating system. It features real-time **Instagram Comment-to-DM lead generation**, multi-coworker swarms, Telegram mobile push approvals, and zero-Docker serverless deployment on Vercel and Firebase.

### Operating Standards & Non-Negotiable Directives:
- **Palette: Linen (60%) + Moss (30%) + Ochre (10%)**:
  - **Linen (60%)**: Natural warm canvas `--canvas-cream` (`#F4EFEA`), elevated panels `#FAF7F2`, pristine card surfaces `#FFFFFF`, and structural borders `#DCD3C5`.
  - **Moss (30%)**: Deep botanical text & structural headers `--ink` (`#202D1E`, >12:1 WCAG AAA contrast against linen), sage body prose `--ink-muted` (`#4A5E44`, >5.4:1 contrast).
  - **Ochre (10%)**: Radiant golden ochre `--brand-primary` (`#C88018`), hover state `#DB9326`, and coral approval trigger `#D96B27`.
- **Universal Palette (No Mode Discrepancy)**:
  - Eliminated dark/light mode switches, theme toggles, and localStorage theme sync scripts.
- **Zero AI Slop, Zero Neon, Zero 3D Rotating Objects**:
  - Purged the table-like control cockpit from the hero section.
  - No 3D rotating spheres, cubes, or neon wireframes.
  - Deployed [HeroStickerStage.tsx](file:///C:/Users/hp/Desktop/QWENTON-AGENTS/components/landing/HeroStickerStage.tsx) featuring a tactile animated AI coworker GIF mascot, interactive physical sticker notes (Reel Inbound Comment, Human Approval Stamp Seal, AI Triage Engine, DM Direct Delivery Receipt), and persona switcher (Multitask Lead Agent vs. Deep Focus Agent).
- **Favicon Integration**:
  - Deployed `favicon.png` across `public/favicon.png`, `public/favicon.ico`, `app/icon.png`, and `app/favicon.ico`.

---

## 2. Brainstormed Ideas & Architecture

### Top 3 Brainstormed Upgrades:
1. **Interactive Hero Sticker Stage ([HeroStickerStage.tsx](file:///C:/Users/hp/Desktop/QWENTON-AGENTS/components/landing/HeroStickerStage.tsx))**:
   - Replaced the bulky dark control table with a tactile, delightful 2D sticker stage.
   - Features animated AI coworker GIF mascot (`/stickers/multitask-agent.gif` and `/stickers/coding-agent.gif`) with dual persona switching.
   - 4 interactive tactile stickers with hover tilt physics, click reactions, and real-time step highlighting synchronized with the workflow stepper.
2. **Organic Editorial Color Harmony (Linen 60% + Moss 30% + Ochre 10%)**:
   - Retained strict zero-neon and zero-black constraints. High-contrast typography (>12.8:1 WCAG AAA).
3. **Frictionless Conversion Architecture**:
   - Purged all intimidating tables and dense configuration grids from the top of the funnel.
   - Highlights the core value proposition: Instagram Reel lead capture with 1-tap human approval.

---

## 3. Current Progress

- **Hero Sticker Stage (`components/landing/HeroStickerStage.tsx`)**: Created and integrated into `app/page.tsx`.
- **Table Purge (`app/page.tsx`)**: Removed `ProductCommandCockpit` from the hero right column; replaced with `HeroStickerStage`.
- **Sticker Token Unification (`components/landing/TactileSticker.tsx`)**: Updated status badges to Linen, Moss, and Ochre tokens.
- **Production Verification**: Zero TypeScript errors (`tsc --noEmit`), Next.js 59 routes production compilation verified.

---

## 4. Pending Work & Next Steps

- **GitHub Deployment:** Ready to stage, commit, and push `HeroStickerStage.tsx` and updated landing page to `origin/main`.
