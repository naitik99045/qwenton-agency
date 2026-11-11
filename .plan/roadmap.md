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

## Phase 2: High-Craft Landing Page Redesign (The Wow Factor)
- [x] **Task 2.1: Live Interactive Hero Cockpit with Real Human-in-the-Loop Gateway**
  - *Action:* Replaced static marketing copy with an interactive dual-stage execution console allowing visitors to test 4 real workflows and click live `[Authorize & Dispatch]` / `[Reject]` controls.
  - *Target Files:* `app/page.tsx`
  - *Done When:* Visitors can test operations, modify trigger keywords, view live step traces, and toggle human approvals in real time.
- [x] **Task 2.2: Standalone Instagram Reel Comment-to-DM Playground**
  - *Action:* Built an interactive Reel tester right on the landing page where users test Reel links, input keywords, and preview public replies + private direct messages.
  - *Target Files:* `app/page.tsx`
  - *Done When:* Comment-to-DM simulator evaluates keywords and renders simulated Instagram phone screen.
- [x] **Task 2.3: Anti-Slop Architectural Pillars & Telemetry Specs**
  - *Action:* Implemented asymmetric split-stage capabilities (zero Bento grids, zero 3-card rows) and high-density technical comparison matrix.
  - *Target Files:* `app/page.tsx`
  - *Done When:* All 28 negative design constraints pass without marketing fluff.

## Phase 3: Production Verification & Git Sync
- [ ] **Task 3.1: TypeScript & Next.js Build Verification**
  - *Action:* Run `npm run typecheck` and `npm run build` to verify 0 errors across all 57 routes.
  - *Target Files:* `app/page.tsx`
  - *Done When:* Build exits with code 0.
- [ ] **Task 3.2: Git Commit & Remote Synchronization**
  - *Action:* Stage and commit all redesigned UI assets, push to `origin/main` on GitHub.
  - *Target Files:* Git workspace
  - *Done When:* Remote `origin/main` is up to date with new commit hash.
