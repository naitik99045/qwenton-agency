# Project Execution Roadmap
**Status:** Active
**Instruction for Execution Agent:** Pick the first unchecked `[ ]` task in the current active phase, implement it completely without placeholders, verify it, and mark it `[x]`.

## Phase 1: Context Discovery & Design System Modernization
- [x] **Task 1.1: Web & Competitor Research with api-anything & Linear/Raycast Analysis**
  - *Action:* Researched modern power-user UI standards (command palettes, prompt-first heroes, surface ladders, non-primary OKLCH palettes, and removal of AI slop).
  - *Target Files:* `.agent/project_state.md`, `app/globals.css`
  - *Done When:* Design tokens are updated with 0 primary colors, 0 gradients, and high-contrast OKLCH definitions.
- [x] **Task 1.2: Purge AI Slop and Outdated Palette Tokens**
  - *Action:* Removed lingering royal cobalt (`#4667B1`), purple (`#523E8C`), soft-lavender pastels, and sparkle decorative icons (`Sparkles`).
  - *Target Files:* `app/globals.css`, `components/landing/InstantAuditSandbox.tsx`
  - *Done When:* Codebase contains zero sparkle tropes and zero primary blue/purple references.

## Phase 2: Master Rebuild per imp.md and refrence.png
- [x] **Task 2.1: Palette & Typography Realignment (`app/globals.css`, `tailwind.config.ts`)**
  - *Action:* Configured warm paper canvas `oklch(97% 0.012 90)`, deep graphite ink `oklch(21% 0.025 255)`, mint action `oklch(76% 0.16 165)`, and approval coral `oklch(65% 0.17 28)`.
  - *Target Files:* `app/globals.css`, `tailwind.config.ts`
  - *Done When:* CSS variables and Tailwind tokens match `imp.md` Section 3.
- [x] **Task 2.2: 3D Bot Workspace Theatre (`components/landing/HeroBotTheatre.tsx`)**
  - *Action:* Built the photorealistic 3D bot desk scene with 3 floating interactive cards (Inbound Comment, Human Approval with Coral button, Delivered DM) connected with curved SVG dashed arrows and subtle mouse parallax.
  - *Target Files:* `components/landing/HeroBotTheatre.tsx`
  - *Done When:* 3D bot theatre renders on hero right side with full interactivity.
- [x] **Task 2.3: Interactive 4-Stage Stepper (`components/landing/HeroWorkflowStepper.tsx`)**
  - *Action:* Built floating pill bar with 4 stages (`Comment received`, `Understand`, `Human approval`, `DM delivered`) that syncs with hero state.
  - *Target Files:* `components/landing/HeroWorkflowStepper.tsx`
  - *Done When:* Stepper allows 1-click stage switching and updates corresponding card highlights.
- [x] **Task 2.4: Complete Landing Page Rebuild (`app/page.tsx`)**
  - *Action:* Implemented navigation matching `refrence.png`, 12-col hero, 3-step proof simulator, asymmetric human approval section, 4-agent coworker roster, audit sandbox, pricing, and FAQ.
  - *Target Files:* `app/page.tsx`
  - *Done When:* All 7 sections from `imp.md` are functional, responsive, and de-slopped.

## Phase 3: Production Verification & Git Sync
- [ ] **Task 3.1: Git Commit & Remote Synchronization**
  - *Action:* Stage and commit all redesigned UI assets, components, and documentation, and push to `origin/main` on GitHub.
  - *Target Files:* Git workspace
  - *Done When:* All changes are committed and pushed cleanly to `origin/main`.
