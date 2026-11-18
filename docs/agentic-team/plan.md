# Agentic Delivery Plan

## Wave 1: Requirements, Product & UI/UX Architecture
- [x] **AT-001 (product-manager)**: Ingest Blueprint PDF, define core modules, customer journeys (Simple vs Advanced mode), and scope boundaries.
- [x] **AT-002 (ui-ux-designer)**: Define design tokens (Warm Ivory, Muted Sage, Dusty Plum), soft claymorphism variables, typography, and navigation spec.

## Wave 2: Frontend & Design System Implementation
- [x] **AT-003 (frontend-developer)**: Update `app/globals.css` and `tailwind.config.ts` with Warm Ivory, Muted Sage, Dusty Plum, and soft clay shadows.
- [x] **AT-004 (frontend-developer)**: Rebuild `components/layout/AppShell.tsx` navigation groups (Workspace, Build, Connect, Knowledge, Operate, Admin) and top bar.
- [x] **AT-005 (frontend-developer)**: Re-style landing page `app/page.tsx` and hero components with Warm Ivory, Muted Sage, and Dusty Plum soft clay cards.

## Wave 3: Backend Boundaries & Error Taxonomy
- [x] **AT-006 (backend-developer)**: Verify server-authoritative entitlements, error taxonomy handling (Section 10), and ensure safe fallbacks.

## Wave 4: Verification, Quality Gates & Release
- [x] **AT-007 (code-reviewer)**: Audit files for adherence to blueprint constraints (zero black, 3-colour rule, accessibility).
- [x] **AT-008 (qa-test-automation)**: Run TypeScript typecheck, production build across all routes, and produce verification evidence.

## Wave 5: Landing Page Rework & Interactive Hero
- [x] **AT-009 (product-manager)**: Define product architecture, messaging, interactive states, and component spec for `AllRounderStudioShowcase.tsx` in `docs/agentic-team/brief-landing-rework.md`.
- [ ] **AT-010 (frontend-developer)**: Implement `components/landing/AllRounderStudioShowcase.tsx` and rework `app/page.tsx` with full 4-pillar showcase and department workflows.
- [ ] **AT-011 (qa-test-automation)**: Verify zero black, contrast ratios, and clean production build on reworked landing page.
