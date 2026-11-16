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
  - *Action:* Completely delete Section 5 (4-tier pricing grid table) and `#pricing` nav anchor from `app/page.tsx`.
  - *Target Files:* `app/page.tsx`
  - *Done When:* Pricing table is removed, eliminating visual clutter and satisfying anti-trope design constraints.
- [x] **Task 2.2: Favicon Deployment**
  - *Action:* Deploy `favicon.png` to `public/favicon.png`, `public/favicon.ico`, `app/icon.png`, and `app/favicon.ico`. Configure in `app/layout.tsx` metadata.
  - *Target Files:* `app/layout.tsx`, `public/favicon.png`, `app/icon.png`
  - *Done When:* Favicon appears across all browser tabs and mobile bookmark manifests.

## Phase 3: Defensive Auditing & Compliance Verification
- [x] **Task 3.1: Anti-Trope Design Review (`qwenton-review`)**
  - *Action:* Audit landing page against the 28 negative AI tropes and 2 mandatory requirements. Produce comprehensive compliance table.
  - *Target Files:* `app/page.tsx`, `app/globals.css`
  - *Done When:* 28/28 negative tropes avoided, skeleton loaders and legal footer links confirmed.
- [x] **Task 3.2: SAST & Defensive Pentest Audit (`qwenton-pentest`)**
  - *Action:* Perform full codebase security scan (secret hygiene, webhook HMAC-SHA256, quota DoS protection, input sanitization). Generate `.agent/security_report.md`.
  - *Target Files:* `.agent/security_report.md`, `app/api/*`
  - *Done When:* Security report generated with zero high/critical unpatched vulnerabilities.

## Phase 4: Hero Table Purge & Tactile Sticker Stage Deployment
- [x] **Task 4.1: Purge Cockpit Table & Wireframes**
  - *Action:* Remove `ProductCommandCockpit` table structure from hero right column in `app/page.tsx`.
  - *Target Files:* `app/page.tsx`
  - *Done When:* No table-like cockpit containers in hero; zero 3D rotating spheres/cubes or neon wireframes.
- [x] **Task 4.2: Build & Integrate Hero Sticker & GIF Stage**
  - *Action:* Create `components/landing/HeroStickerStage.tsx` with animated AI coworker GIF mascot, dual persona switcher (Multitask vs. Focus), 4 tactile interactive sticker notes, and stepper sync.
  - *Target Files:* `components/landing/HeroStickerStage.tsx`, `app/page.tsx`
  - *Done When:* Stage renders cleanly with responsive tactile stickers, persona switching, and zero neon/3D slop.

## Phase 5: Velvet Matte Shades, Android-First Safety & Interactive Keyword Sandbox
- [x] **Task 5.1: Velvet Matte Design Tokens (`app/globals.css`, `app/layout.tsx`)**
  - *Action:* Invert tokens into anti-glare Velvet Matte Chalk Linen (`#F4F0E8`), Matte Charcoal Moss (`#1C241B`), and Velvet Matte Ochre (`#C27329`). Set mobile viewport themeColor and accessibility scaling.
  - *Target Files:* `app/globals.css`, `app/layout.tsx`
  - *Done When:* Matte tokens compile with zero glare, and Android Chrome status bar matches canvas seamlessly.
- [x] **Task 5.2: Android Mobile Safety Hardening (`components/landing/HeroStickerStage.tsx`)**
  - *Action:* Build dedicated mobile touch sequencer with 48px touch targets, zero card collision, and 1-tap interactive approval gate. Prevent mobile input auto-zoom (`16px font-size`).
  - *Target Files:* `components/landing/HeroStickerStage.tsx`, `components/ui/Button.tsx`, `components/landing/HeroWorkflowStepper.tsx`
  - *Done When:* 100% Android-safe layout with comfortable touch ergonomics on small screens.
- [x] **Task 5.3: Live Keyword Simulator in Hero (`app/page.tsx`)**
  - *Action:* Implement live interactive trigger sandbox in hero with custom input and quick chips (`#PLAYBOOK`, `#VIP`, `#GROWTH`, `#AUDIT`) connected live to the mascot stage.
  - *Target Files:* `app/page.tsx`
  - *Done When:* Typing or clicking chips immediately animates the follower comment and DM response.
- [x] **Task 5.4: Production Build Verification & GitHub Sync**
  - *Action:* Verify build with exit code 0 and push commit to `origin/main`.
  - *Target Files:* Workspace, Git remote
  - *Done When:* Build passes and changes are live on GitHub.
