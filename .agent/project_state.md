# Project State & Context
**Last Updated:** November 18, 2026, 18:05 IST (v4.1.0 All-Rounder AI Workforce Flagship Landing Page • Purged Instagram-Only Copy • Interactive Studio Showcase)

---

## 1. Project Overview

**Qwenton** (`qwenton-agents`) is the **All-Rounder AI Workforce Platform** designed for companies across industries to design, deploy, supervise, and improve AI-powered work. Built in strict alignment with `Qwenton_Updated_All_Rounder_Implementation_Blueprint.pdf` (18 November 2026), it features multi-coworker swarms, visual workflow builders, human-in-the-loop approval firewalls, server-authoritative entitlements, and zero-Docker serverless deployment on Vercel and Firebase.

### Operating Standards & Non-Negotiable Directives:
- **True All-Rounder Platform Positioning**:
  - *"One workspace to build AI agents, connect business systems, automate processes, coordinate teams of agents, and govern every important action."*
  - Complete elimination of Instagram-only marketing constraints; social/comment handling is presented as one of many connected department channels.
- **Three-Colour Design System (Blueprint Section 02)**:
  - **Warm Ivory (`#F4F0E8` canvas / `#FCFAF6` card)**: Base canvas, large surfaces, page background, calm neutral atmosphere.
  - **Muted Sage (`#8FA99A` brand / `#3A5245` dark)**: Secondary surfaces, selected states, active accents, subtle controls.
  - **Dusty Plum (`#80627D` brand / `#3C2A3A` typography / `#5E445B` CTA)**: Primary action emphasis, headings, focus accents, primary text.
  - **Zero-Black Guarantee**: Zero `#000000`, zero near-black, zero charcoal, zero navy.
  - **WCAG 2.2 AAA Contrast**: Measured at **11.66:1** on canvas and **12.71:1** on raised cards.
- **Soft Claymorphic Depth**:
  - Gently raised cards with subtle dual shadows tinted with plum undertones (`shadow-clay-card`), soft borders (`#DED8CD`), and rounded corners (8px controls, 12px panels, 16–18px cards, 20px modal shells).
- **Interactive All-Rounder Studio Showcase (`components/landing/AllRounderStudioShowcase.tsx`)**:
  - 4 playable interactive tabs:
    1. **Agent Studio**: Natural-language creation prompt, generated configuration, allowed tools, sample test run.
    2. **Workflow Studio**: Visual node pipeline (Trigger -> LLM Reasoning -> Knowledge Search -> Action Node).
    3. **Multi-Agent Swarms**: Coordinator Agent -> Specialist Researcher & Writer Agents -> Handoff contracts.
    4. **Human Approval Firewall**: Interactive 1-tap review with simulated action preview, payload hash, and server-side gate.
  - Animated AI coworker mascot (`/stickers/multitask-agent.gif`) with dynamic contextual thoughts.
- **Android & Mobile-First Safety**:
  - All interactive buttons, drawer links, chips, and stepper controls enforce **minimum 48px touch targets** (`min-h-[48px]`).
  - Mobile inputs enforce `font-size: 16px` to prevent automatic zoom-jump in Android Chrome.
  - Viewport configured with `themeColor: '#F4F0E8'` and `viewportFit: 'cover'`.

---

## 2. Delivered Landing Page Sections

1. **Header & Global Navigation**: All-Rounder branding, 4 navigation anchors (`#features`, `#solutions`, `#governance`, `#pricing`, `#faq`), and quick auth actions.
2. **Hero Presentation**: Blueprint positioning headline, 4 core pillars, dual CTAs, and the interactive `AllRounderStudioShowcase`.
3. **Pillars Grid**: 4 core modules (Agent Studio, Workflow Canvas, Multi-Agent Swarms, Human Firewall).
4. **Live Department Simulator**: Interactive workflow runner across Sales & Leads, Customer Support Triage, Research Swarm, and Data Sync.
5. **Customer Segments Matrix**: Tailored value propositions for Small Businesses, Agencies, Growing Companies, and Developers.
6. **Governance & Human Firewall Deep-Dive**: Visual comparison of automated vs. human-gated actions with 1-tap approval card.
7. **Enterprise Connectors**: Multi-category integration catalogue (Email, CRM, Slack, Notion, GitHub, Webhooks, REST APIs).
8. **Performance & Reliability**: Transparent operational targets, error taxonomy handling, and explainable execution.
9. **Transparent Pricing Tiers**: Starter, Team, Agency, and Enterprise with Monthly/Annual discount toggle.
10. **Enterprise FAQ & Closing CTA Banner**: 6 comprehensive questions and soft claymorphic sign-up banner.

---

## 3. Current Progress

- **All-Rounder Landing Page (`app/page.tsx`)**: 10 sections implemented with 100% adherence to blueprint positioning and copy.
- **Interactive Hero Showcase (`components/landing/AllRounderStudioShowcase.tsx`)**: Built with 4 playable tabs and responsive mobile layout.
- **Design Tokens (`app/globals.css`, `tailwind.config.ts`)**: 3-colour palette and soft claymorphism tokens active.
- **Navigation Shell (`components/layout/AppShell.tsx`)**: 6 Blueprint Section 03 IA groups deployed with 48px touch targets.
- **Error Taxonomy & Entitlements (`lib/errors/taxonomy.ts`, `lib/limits/entitlements.ts`)**: Server-authoritative gates and structured reliability layer.
- **Production Verification**: 0 TypeScript errors (`tsc --noEmit`), Next.js 59 routes production compilation verified with exit code 0.
