# Project State & Context
**Last Updated:** November 18, 2026, 17:35 IST (v4.0.0 All-Rounder AI Workforce Platform • Three-Colour Soft Claymorphism • Blueprint Navigation IA & Section 10 Error Taxonomy)

---

## 1. Project Overview

**Qwenton** (`qwenton-agents`) is an **All-Rounder AI Workforce Platform** designed for companies across industries to design, deploy, supervise, and improve AI-powered work. Built in strict alignment with `Qwenton_Updated_All_Rounder_Implementation_Blueprint.pdf` (18 November 2026), it features multi-coworker swarms, human-in-the-loop approval firewalls, server-authoritative entitlements, and zero-Docker serverless deployment on Vercel and Firebase.

### Operating Standards & Non-Negotiable Directives:
- **Three-Colour Design System (Blueprint Section 02)**:
  - **Warm Ivory (`#F4F0E8`)**: Base canvas, large surfaces, page background, calm neutral atmosphere.
  - **Muted Sage (`#8FA99A`, dark sage `#3A5245`)**: Secondary surfaces, selected states, active accents, subtle controls.
  - **Dusty Plum (`#80627D`, darkest plum `#3C2A3A`, deep plum `#5E445B`)**: Primary action emphasis, headings, focus accents, primary typography.
  - **Zero-Black Guarantee**: Zero `#000000`, zero near-black, zero charcoal, zero navy. Zero 4th brand colors.
  - **WCAG 2.2 AAA Contrast**: Measured at **11.66:1** on canvas and **12.71:1** on raised cards.
- **Soft Claymorphism**:
  - Gently raised cards with subtle dual shadows tinted with plum undertones (`shadow-clay-card`), soft borders (`#DED8CD`), and rounded corners (8px controls, 12px panels, 16–18px cards, 20px modal shells).
  - Shallow elevation, clean and calm surfaces, restrained micro-interactions (180ms).
- **Information Architecture & Navigation (Blueprint Section 03)**:
  - Stable left sidebar with 6 core functional groups:
    1. **Workspace**: Overview Dashboard (`/dashboard`)
    2. **Build**: Agent Studio (`/agents`), Workflow Studio (`/swarm`), Conversations (`/conversations`), Instagram Auto DM (`/instagram`)
    3. **Connect**: Integrations Hub (`/integrations`)
    4. **Knowledge**: Knowledge Hub (`/files`)
    5. **Operate**: Approvals Inbox (`/approvals`), Runs & Routines (`/routines`)
    6. **Admin**: Admin Command Panel (`/admin`), Billing & Usage (`/billing`), Settings (`/settings`)
- **Android & Mobile-First Safety**:
  - All interactive buttons, drawer links, chips, and stepper controls enforce **minimum 48px touch targets** (`min-h-[48px]`).
  - Mobile inputs enforce `font-size: 16px` to prevent automatic zoom-jump in Android Chrome.
  - Viewport configured with `themeColor: '#F4F0E8'` and `viewportFit: 'cover'`.
- **Reliability & Error Taxonomy (Blueprint Section 10 & 18)**:
  - Centralized error taxonomy (`lib/errors/taxonomy.ts`) covering Validation (400), Authentication (401), Authorization (403), QuotaLimit (403 with upgrade path), Integration (502/503), Conflict (409), Transient, Model, and Internal (500).
  - Automated credential redaction for Bearer tokens, API keys, and database passwords.
  - Server-authoritative quota gates in `lib/limits/entitlements.ts`.

---

## 2. Brainstormed Ideas & Architecture

### Top 3 Upgrades Delivered:
1. **Three-Colour Soft Claymorphism**:
   - Replaced all dark/neon/charcoal themes with Warm Ivory, Muted Sage, and Dusty Plum.
   - Dual shadows with soft plum undertones and top white rim highlight provide tactile physical depth without high-gloss reflection or heavy neumorphic insets.
2. **6-Group Information Architecture Shell**:
   - Reorganized the global navigation into Workspace, Build, Connect, Knowledge, Operate, and Admin.
   - Features persistent desktop sidebar, accessible mobile slide-out drawer, badging for active counts, and 48px Android touch ergonomics.
3. **Server-Authoritative Entitlements & Section 10 Error Taxonomy**:
   - Centralized `formatApiError` ensures all API responses return predictable, structured error payloads (`{ success: false, error, errorClass, recoveryAction }`).
   - Hard quota boundaries enforced on the server for active agents and workflows.

---

## 3. Current Progress

- **Design Tokens (`app/globals.css`, `tailwind.config.ts`)**: 3-colour palette and soft claymorphism tokens deployed.
- **UI Component Library (`components/ui/*`)**: Updated `Button`, `Badge`, `Input`, `Dialog`, `Avatar`, and `FormattedMessage`.
- **Navigation Shell (`components/layout/AppShell.tsx`)**: Rebuilt with 6 Blueprint Section 03 IA groups and 48px touch targets.
- **Landing Page & Hero (`app/page.tsx`, `components/landing/HeroStickerStage.tsx`)**: Re-styled with soft ivory cards, plum typography, and live keyword simulator.
- **Error Taxonomy & Entitlements (`lib/errors/taxonomy.ts`, `lib/limits/entitlements.ts`, `app/api/agents/route.ts`)**: Structured reliability layer with credential sanitization and 12/12 unit tests passing.
- **Quality Gates**: `tsc --noEmit` passed with 0 errors; `npm run build` compiled all 59 routes cleanly.

---

## 4. Pending Work & Next Steps

All 4 waves completed. Ready to stage, commit, and push to `origin/main` on GitHub.
