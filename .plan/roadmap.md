# Project Execution Roadmap
**Status:** Active
**Instruction for Execution Agent:** Pick the first unchecked `[ ]` task in the current active phase, implement it completely without placeholders, verify it, and mark it `[x]`.

## Phase 1: Black-Free Tri-Color Architecture & Token Inversion
- [x] **Task 1.1: Tri-Color Palette Formulation (`app/globals.css`, `tailwind.config.ts`)**
  - *Action:* Replaced carbon/black shades with 60% Alabaster Oat (`#F6F3EB`), 30% Deep Forest Pine (`#163A29`), and 10% Signal Cyber Mint (`#12E896`) + Terracotta Copper (`#C86241`). Solid planes only, zero gradients.
  - *Target Files:* `app/globals.css`, `tailwind.config.ts`
  - *Done When:* Design tokens are updated without black or primary colors and contrast $>7:1$.
- [x] **Task 1.2: Purge Black Classes Across Components**
  - *Action:* Replaced all instances of `text-black` on buttons and chips with `text-pine font-black` (`#163A29`) or `text-alabaster`.
  - *Target Files:* `components/ui/Button.tsx`, `components/landing/InstantAuditSandbox.tsx`, `components/landing/HeroWorkflowStepper.tsx`
  - *Done When:* Zero instances of `text-black` or `bg-black` in landing components.

## Phase 2: Vector & Physical Sticker Assets
- [x] **Task 2.1: Tactile Vector Seal & GIF Sticker**
  - *Action:* Updated `public/stickers/autonomous-seal.svg` with Pine and Mint fills. Embedded `/stickers/coding-agent.gif` and micro-tilt sticker component.
  - *Target Files:* `public/stickers/autonomous-seal.svg`, `components/landing/TactileSticker.tsx`
  - *Done When:* Physical sticker elements render crisply on the landing page.

## Phase 3: Pure Code 3D WebGL Cockpit
- [x] **Task 3.1: 3D Three.js Geometric Coworker & Product Stage (`components/landing/EditorialProductCockpit.tsx`)**
  - *Action:* Removed raster reference images (`hero-bot-stage.webp`, `refrence.png`). Built interactive 3D WebGL Three.js geometric node in Deep Pine and Signal Mint with mouse parallax, connected to 3 floating interactive product cards.
  - *Target Files:* `components/landing/EditorialProductCockpit.tsx`, `app/page.tsx`
  - *Done When:* Cockpit renders with full interactivity and zero raster asset bloat.

## Phase 4: Production Verification & Git Sync
- [x] **Task 4.1: Typecheck & Production Build Verification**
  - *Action:* Run `npm run typecheck` and `npm run build` to confirm clean compilation across all 57 routes.
  - *Target Files:* Workspace
  - *Done When:* Exit code 0 on both typecheck and build.
- [x] **Task 4.2: Git Commit & Remote Synchronization**
  - *Action:* Stage and commit all redesigned UI assets, components, and documentation, and push to `origin/main` on GitHub.
  - *Target Files:* Git workspace
  - *Done When:* All changes are committed and pushed cleanly to `origin/main`.
