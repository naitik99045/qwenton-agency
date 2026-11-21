# Enterprise AI Hero Section Research & Pattern Recommendation

**Task ID:** AT-019  
**Role:** Product Manager Agent (`agentic-product-team`)  
**Status:** `done` — Ready for UI/UX Design & Frontend Implementation  
**Date:** 21 November 2026  
**Reference Baseline:**  
- `Qwenton_Updated_All_Rounder_Implementation_Blueprint.pdf` (Sections 01, 02, 03, 04, 07)
- `docs/agentic-team/brief-landing-rework.md` (AT-009 Landing Page PRD)
- `docs/agentic-team/handoffs/ui-ux-designer.md` (Design Token Specification)
- Negative Design Skill: `qwenton-review` (28 Forbidden Tropes)

---

## 1. Executive Summary & Strategic Problem Statement

### 1.1 The Problem
The previous hero prototype incorporated a Three.js WebGL scene featuring a central spinning matte clay sphere with gimbal torus rings, orbiting geometric satellites (capsules, octahedrons, cylinders), and ambient floating particles. 

**The user decisively rejected this as "AI slop."**

In enterprise B2B SaaS, abstract 3D geometric animations convey the wrong message:
1. **They scream "vaporware / toy":** Abstract floating shapes, spinning planets, and glowing orbital rings are associated with speculative crypto landing pages or generic AI demo wrappers.
2. **They obscure the product:** Enterprise buyers (VP of Operations, COO, Head of Engineering, Director of Support) cannot deduce what the software actually does, how agents operate, or where their data goes.
3. **They fail the Trust & Governance test:** The defining differentiator of Qwenton is the **Human Approval Firewall** and server-authoritative governance. A spinning sphere communicates chaos and autonomy out-of-control, rather than enterprise discipline and safety.

### 1.2 The Objective
Conduct competitive research across 10 top AI and enterprise SaaS platforms, identify the visual patterns that convert enterprise buyers in under 5 seconds, and recommend the **single best hero pattern** for Qwenton—tailored to its All-Rounder AI Workforce positioning and strict 3-colour soft claymorphism design system.

---

## 2. Competitive Analysis: Top 10 AI & Enterprise Platforms

We researched the hero sections of 10 market leaders across AI agent orchestration, developer infrastructure, and enterprise workflow platforms.

### 2.1 Competitive Analysis Summary Table

| Company | Category | Visual Anchor Type | Time-to-Value in <5s | Interactivity Level | Color & Contrast Strategy | Enterprise Trust Mechanism |
|---|---|---|---|---|---|---|
| **Linear** | Product Development & AI Agents | Ultra-crisp interactive product UI mockup showing issue cycles, keyboard flows, and agent tasks | Immediate: shows real UI doing real work at high velocity | Medium: Tabbed views, keyboard shortcut tooltips | Monochromatic dark slate, 1px crisp borders, subtle status accents (purple, green, amber) | Craftsmanship, speed, deterministic workflows |
| **Vercel** | Agentic Infrastructure & Cloud | Visual system architecture: Prompt -> Sandbox Runtime -> Global Edge Network | Immediate: shows the execution path of an AI agent | Low/Medium: Code vs Preview tab toggles | High-contrast stark monochrome, clean typography, zero decorative 3D | Explicit latency (ms), deterministic deployment, edge logs |
| **Retool** | Enterprise App Builder & AI Agents | Side-by-side IDE + Running Business App with live data and approval buttons | Immediate: shows drag-and-drop tool creation connected to real databases | High: Live prompt bar, interactive buttons, schema view | Pure light canvas, deep charcoal text, functional Retool blue, data tables | Connected databases (Postgres, Stripe), granular permissions |
| **Relevance AI** | B2B AI Workforce & GTM Agents | "AI Factory" Roster: Cards showing specialized agents (BDR, Triage, Enrichment) with live task queues | Immediate: enterprise buyer recognizes their departmental roles and workflows | High: Department switcher (Sales, Ops, Support), live status tags | Dark slate background, crisp mint green for online status, violet highlights | Step-by-step task approval, tool permissions, human oversight |
| **CrewAI** | Enterprise Multi-Agent Runtime | Interactive Multi-Agent DAG Orchestration Graph + Execution Trace | Immediate: proves agents collaborate hierarchically rather than hallucinating in a silo | High: Step simulator, task handoff view, trace inspector | Warm cream/charcoal contrast, burnt orange and forest green status badges | Shared memory buffer, cycle count (0/3), human-in-the-loop gates |
| **LangChain / LangSmith** | Agent Tooling & Observability | LangSmith Run Trace Tree with latency, token spend, and evaluation scores | Immediate: demystifies AI by showing inspectable inputs, outputs, and guardrails | High: Clickable trace nodes, prompt inspect drawer, score filters | Soft cream/blue-gray, deep slate text, emerald success badges, amber reviews | Complete execution auditability, token cost attribution, zero black box |
| **Writer** | Enterprise Generative AI Platform | Enterprise Architecture Diagram: Enterprise Data -> Knowledge Graph -> Guardrails -> App | Immediate: signals compliance, data security, and zero hallucination | Low: Industry use-case tabs (Finance, Healthcare, Retail) | Clean warm off-white canvas, slate typography, vibrant enterprise accents | HIPAA/SOC2 badges, explicit knowledge guardrail layer |
| **Jasper** | Enterprise Marketing AI Platform | Multi-agent campaign command center showing content generation + brand guidelines check | Immediate: shows end-to-end marketing pipeline with safety guardrails | Medium: Role switcher, interactive campaign preview | Slate/indigo canvas, coral and emerald tags, structured cards | Brand voice rulebook enforcement, approval workflow |
| **Anthropic** | AI Frontier Safety & Claude | Editorial, minimalist typography paired with real Claude Artifacts/Workspace view | Immediate: positions Claude as a deep, thoughtful collaborator for intellectual work | Low/Medium: Prompt suggestion chips, interactive artifact demo | Warm organic neutrals (Warm Sand, Terracotta, Charcoal), zero neon | Public Benefit Corporation charter, safety-first positioning |
| **OpenAI** | Frontier Models & Enterprise Platform | Clean, product-forward video or interactive prompt field demonstrating Canvas / Operator | Immediate: showcases autonomous execution directly on real tasks | Medium: Playable interactive demos, prompt switcher | Stark black/white, minimal ornamentation, focus 100% on output | Enterprise data privacy guarantee, SOC2 certification |

### 2.2 Key Insights from Market Leaders
1. **The Death of Abstract 3D in B2B SaaS:** Not a single market leader uses spinning wireframe globes, floating geometric shapes, or matrix grids in their primary hero. Abstract 3D is seen as a visual cliché that signals lack of substance.
2. **The Product-in-Action Twin Wins Every Time:** The highest-converting heroes across Linear, Retool, Relevance AI, and CrewAI all use a **"Product-in-Action Twin"**—a beautifully styled, functional recreation of the platform interface demonstrating a realistic, high-value business task running in real time.
3. **Enterprise Buyers Buy Certainty, Not Autonomy:** Uncontrolled autonomous agents terrify enterprise ops leaders. The heroes of LangSmith, CrewAI, and Relevance AI put **governance, traces, and human checkpoints** front and center.
4. **Authentic Data Trumps Generic Placeholders:** Heroes that convert show real-world payloads: `Customer: Acme Corp`, `Deal Size: $24,000`, `Ticket: #8921 Billing Discrepancy`, `Token Cost: $0.014`, `Latency: 1.8s`. Generic placeholder text (`Lorem ipsum`, `Agent 1`) fails the credibility test.

---

## 3. The "AI Slop" Autopsy: Why 3D Spheres & Orbital Rings Fail

| Rejected Design Element | Why It Failed / Buyer Perception | What Enterprise Buyers Actually Want |
|---|---|---|
| **Central spinning matte clay sphere with gimbal rings** | Looks like a sci-fi gyro, a crypto token logo, or a Three.js beginner tutorial. Conveys zero product functionality. | A visual diagram of an actual workflow connecting business tools (Zendesk, Salesforce, Stripe, Slack). |
| **Floating geometric satellites (capsules, octahedrons, cylinders)** | Abstract shapes do not represent "Sales", "Support", or "Research". They feel like decorative clutter. | Real agent profile cards with clear roles, assigned tools, and current tasks. |
| **Floating particle fields & cyber grids** | Gives the impression of a video game or an AI hype bubble. Fails enterprise security audits. | Clean, calm Warm Ivory surfaces with structured soft clay cards and clear typography. |
| **Decorative terminal windows with fake matrix text** | Alienates non-technical operations buyers (COOs, support managers); feels like a hobbyist hacker script. | An inspectable execution trace with plain-language status, verified citations, and audit logs. |
| **Black/Dark-mode cyber aesthetic** | Violates the blueprint's Warm Ivory / Muted Sage / Dusty Plum palette; feels cold and intimidating. | A warm, approachable, tactile aesthetic that feels like a calm executive control room. |

---

## 4. The Recommended Hero Pattern: "The Governed Workforce Cockpit"

### 4.1 Pattern Concept: The Governed Workforce Cockpit
Instead of abstract geometry, Qwenton’s hero must feature **The Governed Workforce Cockpit**—an interactive, tactile, soft-claymorphic product simulation that proves the product is real, functional, and enterprise-governed within 5 seconds of landing.

### 4.2 Why This Pattern Wins for Qwenton
1. **Communicates the All-Rounder Story in One View:**
   - Shows **Agent Studio** (configured specialist agents with distinct roles).
   - Shows **Workflow Studio** (visual DAG connecting triggers, knowledge, and actions).
   - Shows **Agent Workforce Swarms** (multiple agents working in parallel).
   - Shows **The Human Approval Firewall** (the showstopper: an intercepted sensitive action waiting for human sign-off).
2. **Speaks to Enterprise Operations Buyers:**
   - Proves Qwenton is safe to deploy in production.
   - Replaces buyer anxiety ("What if the agent emails our biggest client something crazy?") with instant relief ("Every sensitive action is caught by the Approval Firewall").
3. **Flawless Fit with the 3-Colour Soft Claymorphism System:**
   - Built with Warm Ivory (`#F4F0E8` canvas, `#FCFAF6` raised cards), Muted Sage (`#8FA99A` active nodes and success states), and Dusty Plum (`#80627D` / `#5E445B` headers, CTAs, and primary badges).
   - Utilizes subtle clay dual shadows (`shadow-clay-card`), 12px/16px rounded corners, and shallow elevation.
   - **Zero black, zero charcoal, zero wireframes.**
4. **100% Interactive Proof Without Registration:**
   - Visitors can toggle between 4 departments (Sales, Support, Research, Data).
   - Visitors can click **"Simulate Live Run"** to watch the workflow animate across nodes.
   - Visitors can click **"Approve Action"** on the firewall card to see the cryptographic audit badge seal in real time.

---

## 5. Visual Composition & Layout Specification

The hero section (`Section 2` of `app/page.tsx`) follows an authoritative, centered executive layout:

```
+-----------------------------------------------------------------------------------+
|  [Eyebrow Badge: ● Production-Ready Multi-Agent Orchestration • Enterprise Ready] |
|                                                                                   |
|            ONE WORKSPACE TO BUILD AI AGENTS, CONNECT BUSINESS SYSTEMS,            |
|                AUTOMATE PROCESSES, COORDINATE TEAMS OF AGENTS,                    |
|                         AND GOVERN EVERY IMPORTANT ACTION.                        |
|                                                                                   |
|    Replace brittle point-tool bots with an enterprise workforce. Build autonomous |
|    agents with natural language, design visual workflows, deploy coordinated     |
|    swarms across departments, and maintain 100% human control with our            |
|    server-enforced Approval Firewall.                                             |
|                                                                                   |
|           [Start Building Free →]        [Explore Governed Cockpit ↓]             |
|                                                                                   |
|    [✓ Zero-Risk Sandbox]  [✓ Human Approval Firewall]  [✓ Multi-Tenant Isolation]  |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +=============================================================================+  |
|  | THE GOVERNED WORKFORCE COCKPIT (Interactive Stage: AllRounderStudioShowcase)|  |
|  |                                                                             |  |
|  | Top Bar: Workspace Context (Acme Corp • Production) | Department Tabs:     |  |
|  |   [Sales Lead Triage]  [Support Sentinel]  [Research Swarm]  [Data Sync]    |  |
|  +-----------------------------------------------------------------------------+  |
|  |                                      |                                      |  |
|  |  LEFT PANE: VISUAL AGENT PIPELINE    |  RIGHT PANE: LIVE GOVERNANCE & TRACE |  |
|  |                                      |                                      |  |
|  |  [Node 1: Inbound Webhook Trigger]   |  +--------------------------------+  |  |
|  |             | (Animated path)        |  | 🛡️ HUMAN APPROVAL FIREWALL     |  |  |
|  |  [Node 2: Specialist Agent Swarm]    |  | Protected Action Intercepted:  |  |  |
|  |    • Lead Scout (Enrichment)         |  | "Send $24,000 Annual Proposal  |  |  |
|  |    • Deal Strategist (Drafting)      |  |  to sarah.chen@acmecorp.com"   |  |  |
|  |             |                        |  | Payload Hash: sha256:7f83b1... |  |  |
|  |  [Node 3: Knowledge Hub Verification]|  | Risk Level: CRITICAL (Legal)   |  |  |
|  |             |                        |  |                                |  |  |
|  |  [Node 4: 🛡️ APPROVAL FIREWALL GATE] |  | [✓ Approve (1-Click)] [Reject] |  |  |
|  |             | (Halted until signoff) |  +--------------------------------+  |  |
|  |  [Node 5: CRM Update & Dispatch]     |                                      |  |
|  |                                      |  Live Telemetry: Latency: 1.8s       |  |
|  |  Button: [▶ Simulate Live Execution] |  Cost: $0.014 | Audit: #TX-89211     |  |
|  +--------------------------------------+--------------------------------------+  |
|  | Bottom Status Bar: Server-enforced rules active • Zero black-box mutations  |  |
|  +=============================================================================+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 5.1 Component Breakdown & Spatial Hierarchy
1. **Container Dimensions:**
   - Max width: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`.
   - Card container: `bg-surface-white rounded-hero border border-border-subtle shadow-clay-card p-4 sm:p-6 lg:p-8`.
2. **Top Stage Bar:**
   - Left: Tenant indicator: `[Acme Corp Workspace • Environment: Production]` in Muted Sage font with a live pulsating status dot (`bg-sage-dark`).
   - Right: 4 interactive department switcher tabs:
     - `[💼 Sales & Leads]`
     - `[🎧 Support Sentinel]`
     - `[🔬 Research Swarm]`
     - `[⚡ Data Pipeline]`
3. **Left Column (Visual Orchestration Canvas - 55% width on desktop):**
   - Renders the node graph for the selected department.
   - Nodes are styled as soft clay cards (`bg-surface-panel rounded-card border border-border-subtle p-3.5`).
   - Connecting lines use SVG stroked paths with animated stroke-dasharray in Dusty Plum and Muted Sage.
   - Features active state badges (`Validated`, `Running`, `Gated by Firewall`).
   - Action Button at bottom: `[▶ Simulate Live Execution]` with instant visual progression.
4. **Right Column (Live Governance & Firewall Card - 45% width on desktop):**
   - The showstopper card: A high-contrast clay card with soft plum highlight border (`border-plum-border shadow-clay-card-hover`).
   - Header: `🛡️ HUMAN APPROVAL FIREWALL • ACTION INTERCEPTED`.
   - Explains the exact attempted external action, recipient, payload hash, and risk level.
   - Interactive Buttons:
     - `[✓ Approve Action (1-Click)]`: When clicked, status animates with a 180ms ease to `APPROVED • Dispatched via SendGrid with Cryptographic Audit Record #TX-89211`.
     - `[✕ Edit Draft / Reject]`: Resets or pauses the agent.
   - Telemetry strip: Real execution stats (Duration: `1.8s`, Cost: `$0.014`, Verification: `100% Typed`).

---

## 6. Copy Direction & Messaging Hierarchy

### 6.1 Top Stage Messaging
- **Eyebrow Badge:** `● Production-Ready Multi-Agent Orchestration • Enterprise Ready`
- **H1 Headline (Blueprint Verbatim):**  
  **“One workspace to build AI agents, connect business systems, automate processes, coordinate teams of agents, and govern every important action.”**
- **Sub-headline:**  
  *“Replace brittle point-tool bots with an enterprise workforce. Build autonomous agents with natural language, design visual workflows, deploy coordinated swarms across departments, and maintain 100% human control with our server-enforced Approval Firewall.”*
- **Primary CTA:** `[Start Building Free →]` (Deep Plum Button with shadow-clay-button)
- **Secondary CTA:** `[Explore Governed Cockpit ↓]` (Muted Sage Button)
- **Trust Pills:**
  - `✓ Zero-Risk Sandbox Execution`
  - `✓ Human-in-the-Loop Approval Firewall`
  - `✓ Multi-Tenant Isolation & Least-Privilege RBAC`
  - `✓ Zero Telephony Clutter — 100% Core Business Ops`

### 6.2 Interactive Cockpit Copy Samples
- **Sales Department Scenario:**
  - *Trigger:* Inbound Lead via Webhook (`Typeform / High-Intent Enterprise Inquiry`).
  - *Swarm Action:* Lead Enrichment Agent pulls LinkedIn & firmographic financials -> Deal Strategist composes custom proposal.
  - *Firewall Gate:* **INTERCEPTED.** Attempted to email $24,000/yr contract to `sarah.chen@acmecorp.com`. Requires human sign-off.
- **Support Department Scenario:**
  - *Trigger:* Zendesk Ticket `#8921` (`Billing discrepancy on annual license`).
  - *Swarm Action:* Sentinel Agent retrieves Refund Policy v3.2 from Knowledge Hub -> drafts credit adjustment.
  - *Firewall Gate:* **INTERCEPTED.** Attempted to issue $49.00 credit to customer Stripe account. Gated for Billing Manager approval.
- **Research Department Scenario:**
  - *Trigger:* Scheduled Executive Intelligence Brief (`AI Automation Market Shift`).
  - *Swarm Action:* 3 agents in parallel (Scraper, Quantitative Analyst, Synthesizer) compile 14 verified citations.
  - *Firewall Gate:* **INTERCEPTED.** Attempted to publish executive memo to company-wide Slack `#leadership`. Gated for VP Ops approval.

---

## 7. Interactive Behavior Specification

### 7.1 State Machine
```typescript
interface CockpitState {
  department: 'sales' | 'support' | 'research' | 'pipeline';
  simulationState: 'idle' | 'running-step-1' | 'running-step-2' | 'firewall-intercepted' | 'approved' | 'rejected';
  activeNodeId: string;
  approvalDecided: boolean;
  telemetry: {
    durationMs: number;
    tokensUsed: number;
    costUsd: number;
    auditId: string;
  };
}
```

### 7.2 Interactive Transitions (180ms Clay Timing)
1. **Department Switch:**
   - Clicking a department tab swaps the pipeline nodes, scenario context, and firewall payload instantly with a smooth 180ms opacity fade.
   - Resets simulation to `idle` state.
2. **"Simulate Live Run" Execution:**
   - Step 1 (300ms): Trigger node pulses Muted Sage (`animate-pulse`).
   - Step 2 (400ms): Intermediate Swarm nodes illuminate with active status badges.
   - Step 3 (instant): Pipeline **halts** at the Human Approval Firewall node with a Dusty Plum alert badge.
   - The Right Pane Approval Card highlights with an animated soft glow, prompting user interaction.
3. **"Approve Action" Click:**
   - The button flips to a confirmed state: `✓ Approved & Executed`.
   - The final pipeline node illuminates in Dark Sage (`bg-sage-light text-sage-dark`).
   - A cryptographic audit confirmation banner appears: `Immutable Log: sha256:7f83b165... Verified by server-side policy`.
4. **Mobile & Touch Hardening:**
   - Touch targets are strictly >= 48px (`min-h-[48px]`).
   - On mobile screens (<768px), the layout stacks cleanly (Pipeline on top, Approval Card below) with zero horizontal overflow.
   - Respects `prefers-reduced-motion` with instant transitions and zero continuous loops.

---

## 8. Anti-Patterns & Strict "What NOT to Do" Checklist

When implementing the new hero, the engineering and design teams MUST enforce these explicit negative constraints:

| Forbidden AI Trope / Anti-Pattern | Reason for Prohibition | Enforcement Rule |
|---|---|---|
| ❌ **Spinning 3D globes, spheres, or gimbal toruses** | Explicitly rejected by user as "AI slop". Distracts from product value. | Zero Three.js spheres or gimbal rings in the hero stage. |
| ❌ **Floating abstract shapes (capsules, octahedrons, pyramids)** | Meaningless decorative clutter. Conveys toy-like quality. | Zero unanchored geometric meshes. |
| ❌ **Sci-fi particle fields, starfields, neon matrices** | Cheap cyberpunk aesthetic incompatible with enterprise trust. | Background must be calm, pristine Warm Ivory (`#F4F0E8`). |
| ❌ **Pure pitch black (#000000), charcoal, or dark-mode bleed** | Violates blueprint 3-colour rule. | Strictly use Deep Plum (`#3C2A3A` / `#5E445B`) for typography. |
| ❌ **Radial glowing background orbs or liquid glassmorphism** | Forbidden trope (#7 and #8 in `qwenton-review`). | Use soft claymorphic card elevation (`shadow-clay-card`). |
| ❌ **Bento box grid explosion in the hero** | Forbidden trope (#2 in `qwenton-review`). Creates visual fatigue. | Use a clear 2-pane layout (Visual Pipeline + Live Governance Card). |
| ❌ **Fake testimonials or vague marketing fluff** | Forbidden trope (#24 in `qwenton-review`). Damages credibility. | Use realistic enterprise payloads (tickets, SOWs, CRM IDs). |
| ❌ **Telephony, PBX queues, or phone dialers** | Strictly excluded in Blueprint Section 01. | Focus 100% on digital operations (Email, CRM, Webhooks, APIs). |

---

## 9. Downstream Handoff & Implementation Sequence

### 9.1 Immediate Handoff
- **Target Role:** `frontend-developer`
- **Collaborator:** `ui-ux-designer`
- **Reviewer:** `code-reviewer`

### 9.2 Execution Steps
1. **Retire `Hero3DExperience.tsx`:** Remove the rejected spinning Three.js sphere/orbital satellite component from the hero stage of `app/page.tsx`.
2. **Build `GovernedWorkforceCockpit.tsx` (or update `AllRounderStudioShowcase.tsx`):** Implement the 2-pane Governed Workforce Cockpit featuring the visual pipeline and the interactive Human Approval Firewall card as specified in Sections 5, 6, and 7.
3. **Integrate into `app/page.tsx`:** Place the Governed Workforce Cockpit directly beneath the verbatim headline and CTA group in Section 2.
4. **Run Verification Gates:**
   - Audit for zero black (`#000000`, charcoal, navy).
   - Verify WCAG AAA contrast ratios on all text and badges.
   - Run `cmd /c "npx tsc --noEmit"` and verify exit code 0.
