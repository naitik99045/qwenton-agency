# Project State & Context
**Last Updated:** November 16, 2026, 12:48 IST (v3.3.0 Velvet Matte Palette • Android Mobile Hardening & 48px Touch Targets • Interactive Live Keyword Hero Simulator)

---

## 1. Project Overview

**Qwenton** (`qwenton-agents`) is an autonomous AI coworker platform, Instagram Reel lead generation engine, and agency operating system. It features real-time **Instagram Comment-to-DM lead generation**, multi-coworker swarms, Telegram mobile push approvals, and zero-Docker serverless deployment on Vercel and Firebase.

### Operating Standards & Non-Negotiable Directives:
- **Palette: Velvet Matte Chalk Linen (60%) + Matte Charcoal Moss (30%) + Velvet Matte Ochre (10%)**:
  - **Matte Chalk Linen (60%)**: Velvet matte chalk canvas `--canvas-cream` (`#F4F0E8`), matte subpanels `#FAF7F0`, card surfaces `#FFFFFF`, and quiet hairline clay borders `#DDD6C8`.
  - **Matte Charcoal Moss (30%)**: Deep matte botanical charcoal headers `--ink` (`#1C241B`, >13:1 WCAG AAA contrast against linen), velvet sage body prose `--ink-muted` (`#4D5E4A`, >5.5:1 contrast).
  - **Velvet Matte Ochre (10%)**: Warm velvet matte ochre `--brand-primary` (`#C27329`), hover state `#D4832E`, and matte terracotta gate `#D66A2C` (`--coral-approval`).
- **Android & Mobile-First Safety**:
  - **Touch Targets:** All interactive buttons, chips, and stepper tabs adhere to Android/Material Design guidelines with minimum 44px–48px touch targets (`min-h-[44px]` / `min-h-[48px]`).
  - **Adaptive Mobile Stage:** On mobile viewports (< 640px), the hero stage presents an adaptive clean card sequencer with touch tabs (`1. Comment`, `2. Triage`, `3. Approval`, `4. DM Sent`) eliminating all overlapping card collisions.
  - **Viewport & Zoom Protection:** Mobile inputs use `font-size: 16px` to prevent automatic zoom-jump in Android Chrome. Viewport meta configured with `themeColor: '#F4F0E8'` and `viewportFit: 'cover'`.
- **Zero AI Slop, Zero Neon, Zero 3D Rotating Objects**:
  - Completely purged cockpit tables, 3D rotating spheres, cubes, and neon wireframes.
  - Deployed [HeroStickerStage.tsx](file:///C:/Users/hp/Desktop/QWENTON-AGENTS/components/landing/HeroStickerStage.tsx) featuring a tactile animated AI coworker GIF mascot, dual persona switcher (Multitask Lead Agent vs. Deep Focus Agent), and interactive 1-tap approval toggle.
- **Interactive Live Reel Keyword Simulator in Hero**:
  - Added an interactive live keyword testing box in the hero left column allowing visitors to type or tap trigger keywords (`#PLAYBOOK`, `#VIP`, `#GROWTH`, `#AUDIT`) that dynamically react on the right-side stage.

---

## 2. Brainstormed Ideas & Architecture

### Top 3 Brainstormed Upgrades:
1. **Velvet Matte Editorial Finish**:
   - Upgraded colors to an anti-glare, tactile velvet matte finish.
   - Eliminates shiny plastic reflections and synthetic AI vibes, replacing them with a premium editorial paper/matte ceramic texture.
2. **Android-Native Adaptive Sequencer**:
   - Engineered dedicated mobile touch tabs and full-width card rendering on small Android viewports.
   - Guaranteed zero card overlapping, 48px touch targets, and touch-action manipulation.
3. **Live Interactive Keyword Simulator**:
   - Visitors can type custom trigger keywords or click quick-tap chips in the hero, immediately seeing the follower comment, AI triage rating, and DM payload update live.

---

## 3. Current Progress

- **Velvet Matte CSS Tokens (`app/globals.css`, `tailwind.config.ts`)**: Applied anti-glare matte variables and mobile touch rules.
- **Android Viewport Configuration (`app/layout.tsx`)**: Updated `themeColor: '#F4F0E8'`, `maximumScale: 5`.
- **Adaptive Hero Stage (`components/landing/HeroStickerStage.tsx`)**: Re-architected with mobile touch tabs, 48px touch targets, simulated keyword prop, and 1-tap interactive approval toggle.
- **Hero Left Column Simulator (`app/page.tsx`)**: Added interactive trigger simulator box with quick-tap chips and live stage sync.
- **Button Sizing (`components/ui/Button.tsx`)**: Normalized `min-h-[44px]` and `min-h-[48px]` for Android accessibility.

---

## 4. Pending Work & Next Steps

- **GitHub Deployment:** Ready to stage, commit, and push changes to `origin/main`.
