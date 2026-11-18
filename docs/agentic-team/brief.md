# Qwenton All-Rounder Platform Delivery Brief

## 1. Outcome & Objective
Transform and upgrade Qwenton Agents from an Instagram-centric tool into the **All-Rounder AI Workforce Platform** defined in `Qwenton_Updated_All_Rounder_Implementation_Blueprint.pdf` (18 November 2026).
Deliver a production-ready UI/UX with soft claymorphism, the specified 3-colour palette (Warm Ivory, Muted Sage, Dusty Plum), full information architecture navigation, server-authoritative entitlements, robust error taxonomy, and zero runtime or compilation errors.

## 2. Core Non-Negotiable Directives
1. **Three-Colour Design System**:
   - **Warm Ivory (`#F4F0E8`)**: Main app canvas, large surfaces, page background.
   - **Muted Sage (`#8FA99A`)**: Secondary surfaces, selected states, active accents, subtle controls.
   - **Dusty Plum (`#80627D` / deep plum `#433041` for typography)**: Primary action emphasis, headings, focus accents, key navigation state.
   - **Strict Colour Constraints**: Zero `#000000`, zero near-black, zero charcoal, zero navy. Zero 4th brand colours. Zero red/blue/yellow primary accents.
2. **Soft Claymorphism**:
   - Gently raised cards with subtle dual shadows (`shadow-clay-card`), soft borders (`#DED8CD`), and rounded corners (12–18px).
   - Shallow elevation, clean and calm surfaces, restrained micro-interactions (120–200ms).
3. **Information Architecture (Section 03)**:
   - Stable left navigation with 6 core functional groups:
     - **Workspace**: Overview Dashboard
     - **Build**: Agent Studio, Workflow Studio, Agent Workforce, Marketplace
     - **Connect**: Integrations Hub
     - **Knowledge**: Knowledge Hub
     - **Operate**: Approvals Inbox, Runs & Logs, Analytics & Costs
     - **Admin**: Workspace & Members, Billing & Usage, Settings
4. **Scope Exclusions**:
   - Exclude call-management CRM / telephony workflows.
5. **Quality & Reliability Gate**:
   - Clean compilation: `tsc --noEmit` and `npm run build` must succeed with exit code 0.
   - Mobile and Android safe: 48px touch targets, zero clipping, no-zoom inputs.
