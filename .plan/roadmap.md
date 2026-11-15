# Project Execution Roadmap
**Status:** Active
**Instruction for Execution Agent:** Pick the first unchecked `[ ]` task in the current active phase, implement it completely without placeholders, verify it, and mark it `[x]`.

## Phase 1: Linen (60%) + Moss (30%) + Ochre (10%) Universal Design System
- [x] **Task 1.1: Design Tokens & Palette Unification**
  - *Action:* Realign `app/globals.css` and `tailwind.config.ts` with Linen (`#F4EFEA`), Deep Moss (`#202D1E`), Sage Moss (`#4A5E44`), and Radiant Ochre (`#C88018`).
  - *Target Files:* `app/globals.css`, `tailwind.config.ts`
  - *Done When:* Design tokens compile with 60-30-10 ratio, WCAG AAA text contrast (>12:1), and zero mode discrepancy.
- [x] **Task 1.2: Remove Dark & Light Mode Toggle Switch**
  - *Action:* Eliminate theme switching script and `<ThemeToggle />` header component in `app/layout.tsx` and `app/page.tsx` for a universal palette.
  - *Target Files:* `app/layout.tsx`, `app/page.tsx`
  - *Done When:* Universal theme is permanently applied across all devices without flash or mode toggling.

## Phase 2: Landing Page Cleansing & Favicon Deployment
- [x] **Task 2.1: Purge Pricing Comparison Table**
  - *Action:* Completely delete Section 5 (4-tier pricing grid table, lines 708–918) and `#pricing` nav anchor from `app/page.tsx`.
  - *Target Files:* `app/page.tsx`
  - *Done When:* Pricing table is removed, eliminating visual clutter and satisfying anti-trope design constraints.
- [x] **Task 2.2: Favicon Deployment**
  - *Action:* Deploy `favicon.png` to `public/favicon.png`, `public/favicon.ico`, `app/icon.png`, and `app/favicon.ico`. Configure in `app/layout.tsx` metadata.
  - *Target Files:* `app/layout.tsx`, `public/favicon.png`, `app/icon.png`
  - *Done When:* Favicon appears across all browser tabs and mobile bookmark manifests.
- [x] **Task 2.3: Realign Cockpit & Interactive Stepper**
  - *Action:* Style [ProductCommandCockpit.tsx](file:///C:/Users/hp/Desktop/QWENTON-AGENTS/components/landing/ProductCommandCockpit.tsx), [HeroWorkflowStepper.tsx](file:///C:/Users/hp/Desktop/QWENTON-AGENTS/components/landing/HeroWorkflowStepper.tsx), and [Button.tsx](file:///C:/Users/hp/Desktop/QWENTON-AGENTS/components/ui/Button.tsx) with Linen, Moss, and Ochre.
  - *Target Files:* `components/landing/ProductCommandCockpit.tsx`, `components/landing/HeroWorkflowStepper.tsx`, `components/ui/Button.tsx`
  - *Done When:* Cockpit displays live 4-step pipeline telemetry with radiant Ochre action controls.

## Phase 3: Defensive Auditing & Compliance Verification
- [x] **Task 3.1: Anti-Trope Design Review (`qwenton-review`)**
  - *Action:* Audit landing page against the 28 negative AI tropes and 2 mandatory requirements. Produce comprehensive compliance table.
  - *Target Files:* `app/page.tsx`, `app/globals.css`
  - *Done When:* 28/28 negative tropes avoided, skeleton loaders and legal footer links confirmed.
- [x] **Task 3.2: SAST & Defensive Pentest Audit (`qwenton-pentest`)**
  - *Action:* Perform full codebase security scan (secret hygiene, webhook HMAC-SHA256, quota DoS protection, input sanitization). Generate `.agent/security_report.md`.
  - *Target Files:* `.agent/security_report.md`, `app/api/*`
  - *Done When:* Security report generated with zero high/critical unpatched vulnerabilities.

## Phase 4: Production Build Verification & Delivery
- [x] **Task 4.1: Production Build Verification & Typecheck**
  - *Action:* Run `npm run typecheck` and `npm run build` across all 57 routes.
  - *Target Files:* Workspace
  - *Done When:* Exit code 0 on both typecheck and build.
- [x] **Task 4.2: Terminal Executive Summary**
  - *Action:* Deliver final report with Top 3 Brainstormed Upgrades, Palette Architecture, `qwenton-review` Table, `qwenton-pentest` Matrix, and Synced Files.
