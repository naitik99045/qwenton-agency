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

## Phase 3: Three.js 3D Artifact, Dark/Light Mode Engine & Scroll Effects
- [x] **Task 3.1: Three.js 3D Autonomous Agent Neural Core (`components/landing/ThreeAgentCore.tsx`)**
  - *Action:* Built an interactive Three.js 3D scene with central icosahedron core, dual rotating gimbal rings, orbiting satellite nodes, pointer-tracked lerp tilt, scroll-responsive scaling, dynamic dark/light re-theming, and SVG accessible fallback.
  - *Target Files:* `components/landing/ThreeAgentCore.tsx`, `package.json`
  - *Done When:* 3D artifact renders smoothly on hero right column without WebGL errors or memory leaks.
- [x] **Task 3.2: Complete Dark Mode and Light Mode Tri-Color Architecture**
  - *Action:* Configured symmetrical 60-30-10 OKLCH tri-color palettes in `app/globals.css` with Architectural Porcelain in light mode, Deep Obsidian Carbon in dark mode, and high-voltage Signal Cyber Mint accents with >11:1 contrast.
  - *Target Files:* `app/globals.css`, `components/ui/ThemeToggle.tsx`
  - *Done When:* User can toggle dark and light modes with instant persistence and clean contrast across all components.
- [x] **Task 3.3: Scroll Progress Bar & Scroll-Linked Execution Pipeline**
  - *Action:* Built `components/landing/ScrollProgressBar.tsx` for real-time scroll completion tracking and `components/landing/ScrollPipeline.tsx` to demonstrate the 3-stage lead execution lifecycle.
  - *Target Files:* `components/landing/ScrollProgressBar.tsx`, `components/landing/ScrollPipeline.tsx`, `app/page.tsx`
  - *Done When:* Scroll bar tracks reading progress and pipeline updates stages dynamically during scroll.

## Phase 4: Header Streamlining, Scroll-Animated Stickers & Internal Data Cleanse
- [x] **Task 4.1: Remove Top Header Bar & Purge Internal Design Tokens**
  - *Action:* Deleted top telemetry black bar from `app/page.tsx`, sanitized eyebrow badges and comparison matrix of internal "60-30-10" meta-copy, and purged vendor mentions in `app/privacy/page.tsx`.
  - *Target Files:* `app/page.tsx`, `app/privacy/page.tsx`, `app/agents/[agentId]/page.tsx`
  - *Done When:* Page starts directly at sticky navigation, and zero internal design formulas are shown to users.
- [x] **Task 4.2: Scroll-Animated GIF Stickers & 3D Depth Zoom**
  - *Action:* Added `scrollReactive` sinusoidal parallax floating to `TactileSticker.tsx`, mounted `multitask-agent.gif` in the Reels Playground, and added camera zoom depth to `ThreeAgentCore.tsx`.
  - *Target Files:* `components/landing/TactileSticker.tsx`, `components/landing/ThreeAgentCore.tsx`, `app/page.tsx`
  - *Done When:* Stickers float gracefully during page scroll and 3D camera dynamically tracks scroll depth.

## Phase 5: Production Verification & Git Sync
- [ ] **Task 5.1: Git Commit & Remote Synchronization**
  - *Action:* Stage and commit all streamlined UI assets and push to `origin/main` on GitHub.
  - *Target Files:* Git workspace
  - *Done When:* All changes are committed and pushed cleanly to `origin/main`.
