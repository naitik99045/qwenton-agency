# Qwenton All-Rounder AI Workforce Platform — Landing Page Product Specification & Content Outline

**Task ID:** AT-009  
**Role:** Product Manager Agent (`agentic-product-team`)  
**Status:** Approved for Implementation  
**Date:** 18 November 2026  
**Reference Baseline:** `Qwenton_Updated_All_Rounder_Implementation_Blueprint.pdf` (Sections 01, 02, 03, 04, 05, 07)  
**Target File Deliverables:**
1. `app/page.tsx` (Complete landing page rework)
2. `components/landing/AllRounderStudioShowcase.tsx` (Brand new interactive multi-pillar hero centerpiece)

---

## 1. Product Positioning & Strategic Re-centering

### 1.1 The Shift: From Instagram DM Bot to Enterprise AI Workforce Platform
- **Previous State:** The legacy landing page focused narrowly on Instagram reel comment-to-DM automation, competitor social tracking, and lead-magnet download triggers.
- **New State:** A unified, composable **AI Workforce and Automation Platform** designed for teams, agencies, and growing companies to design, deploy, coordinate, and supervise autonomous agent teams across entire operational departments.
- **Core Positioning Statement (Blueprint Section 01):**
  > *“One workspace to build AI agents, connect business systems, automate processes, coordinate teams of agents, and govern every important action.”*

### 1.2 Target Customer Segments & Jobs-To-Be-Done (JTBD)
| Segment | Primary Need / Job-To-Be-Done | Experience & Feature Focus |
|---|---|---|
| **Small Businesses** | Automate repetitive administrative, sales, and support work without hiring automation specialists or software engineers. | Guided templates, plain-language setup, safe defaults, pre-configured approval rules. |
| **Agencies & Service Firms** | Operate and report on automated client workflows at scale with zero cross-tenant contamination. | Multi-workspace isolation, reusable template distribution, branded deliverables, audit logs. |
| **Growing Companies** | Coordinate cross-department handoffs between Sales, Marketing, Customer Support, and Ops with rigorous governance. | Multi-agent swarms, role-based access control (RBAC), approval firewalls, cost/token observability. |
| **Developers & Technical Teams** | Build custom tools, orchestrate complex data pipelines, and integrate internal APIs reliably. | Visual node editor with code nodes (TypeScript/Python), webhook triggers, MCP tool servers, live JSON schema validation, versioned rollbacks. |

### 1.3 Scope Boundaries & Non-Negotiable Directives
1. **Explicit Scope Exclusions (Blueprint Section 01 & 07):**
   - **Zero Telephony/Call Management:** Strictly avoid promoting inbound/outbound calling, PBX dialers, call queues, audio recording, or call-center CRM features. Focus 100% on digital business workflows (Email, CRM, Tickets, Webhooks, APIs, Spreadsheets, Knowledge).
   - **No Black-Box Actions:** Every external mutation (sending emails, updating CRM records, modifying databases) requires policy configuration and must default to the **Human Approval Firewall**.
2. **Three-Colour Design System & Soft Claymorphism (Blueprint Section 02):**
   - Canvas: **Warm Ivory (`#F4F0E8`)**
   - Secondary / Active Accents: **Muted Sage (`#8FA99A` / Deep Sage `#3A5245`)**
   - Primary / Emphasis / Typography: **Dusty Plum (`#80627D` / Deep Plum `#5E445B` / Ink Plum `#3C2A3A`)**
   - **Zero `#000000`, Zero Charcoal, Zero Navy.**
   - Soft claymorphic dual shadows, 8px/12px/16px/24px rounded corners, 48px touch targets.

---

## 2. Information Architecture & Structural Outline (`app/page.tsx`)

The landing page is organized into 10 cohesive sections designed to guide the visitor from top-of-funnel value comprehension to deep interactive proof, role validation, and conversion:

1. **Global Header & Navigation:** Sticky top navigation with brand identity, product pillar dropdown, customer segment links, authentication, and launch action.
2. **Hero Stage (`AllRounderStudioShowcase`):** High-impact headline, value proposition, trust pills, primary CTAs, and the interactive centerpiece.
3. **The 4 Core Platform Pillars:** Deep-dive cards into Agent Studio, Workflow Studio, Workforce Swarms, and Approval Firewall.
4. **Interactive Department Workflows:** 4 real-world operational blueprints (Sales, Support, Research, Data Pipelines) with inspectable execution traces and live simulation.
5. **Target Customer Segment Matrix:** 4-column card grid tailored to Small Businesses, Agencies, Growing Companies, and Developers.
6. **Trust, Security & Governance Architecture:** The Human Approval Firewall, server-authoritative RBAC, secret isolation, and audit trail.
7. **Platform Metrics & Quantitative Social Proof:** Accuracy, speed, cost-efficiency, and safety credentials.
8. **Transparent Interactive Pricing Tiers:** Free Starter, Pro Team, Business Scale, and Enterprise VPC with toggleable annual savings.
9. **Frequently Asked Questions (FAQ Accordion):** 6 detailed questions addressing enterprise trust, AI safety, telephony exclusions, and tool integrations.
10. **Final Conversion Stage & Footer:** High-contrast clay CTA banner, platform health badge, legal links, and multi-tenant credentials.

---

## 3. Detailed Section Copy & Interactive State Specifications (`app/page.tsx`)

### Section 1: Global Navigation Bar
- **Logo:** `Qwenton` with subtle agentic badge: `[All-Rounder AI v2.4]` in `Muted Sage`.
- **Navigation Links:**
  - **Platform Pillars** (Anchor / Scroll to Section 3: `#pillars`)
  - **Workflows** (Anchor / Scroll to Section 4: `#workflows`)
  - **Solutions** (Anchor / Scroll to Section 5: `#solutions`)
  - **Governance** (Anchor / Scroll to Section 6: `#governance`)
  - **Pricing** (Anchor / Scroll to Section 8: `#pricing`)
- **Right Action Buttons:**
  - `Sign In` -> Links to `/auth/login` (Ghost button with Deep Plum hover)
  - `Launch Studio` -> Links to `/dashboard` (Primary Plum Clay Button, rounded-control, min-h-[44px])
- **Mobile Menu State:** Hamburger toggle revealing a claymorphic drawer with full navigation links and touch targets >= 48px.

---

### Section 2: Hero Stage & Value Proposition
- **Eyebrow Badge:**
  - Content: `● Production-Ready Multi-Agent Orchestration`
  - Style: `Badge variant="success"` with Muted Sage background and Dark Sage text.
- **Main Heading (H1):**
  - Text: **“One workspace to build AI agents, connect business systems, automate processes, coordinate teams of agents, and govern every important action.”**
  - Typography: Ink Plum (`#3C2A3A`), responsive `text-3xl sm:text-5xl lg:text-6xl`, tracking-tight, font-extrabold.
- **Sub-headline:**
  - Text: *“Replace brittle point-tool bots with an enterprise workforce. Build autonomous agents with natural language, design visual multi-step workflows, deploy coordinated swarms across departments, and maintain 100% human control with our server-enforced Approval Firewall.”*
  - Typography: Muted Plum (`#644C61`), `text-lg sm:text-xl`, max-w-3xl, mx-auto.
- **Call-to-Action Buttons:**
  - **Primary CTA:** `[Start Building Free →]` -> Links to `/dashboard` (Variant `primary`, size `lg`, Dusty Plum with clay elevation).
  - **Secondary CTA:** `[Explore Interactive Showcase ↓]` -> Smooth scrolls to hero showcase (Variant `secondary`, size `lg`, Muted Sage styling).
- **Trust & Assurance Banner (Pill Strip):**
  - Pill 1: `✓ Zero-Risk Sandbox Execution`
  - Pill 2: `✓ Human-in-the-Loop Approval Firewall`
  - Pill 3: `✓ Multi-Tenant Workspace Isolation`
  - Pill 4: `✓ Zero Telephony Clutter — 100% Core Business Ops`
- **Centerpiece Component:** `<AllRounderStudioShowcase />` (Detailed in Section 4 of this spec).

---

### Section 3: The 4 Core Platform Pillars
- **Section Eyebrow:** `FOUNDATIONAL ARCHITECTURE`
- **Section Heading:** **“Four Pillars. One Autonomous Workforce Platform.”**
- **Section Description:** *“Every agent, tool, workflow, and approval checkpoint operates as a composable building block within an isolated, enterprise-grade environment.”*
- **Grid Layout:** 2x2 responsive grid of raised clay cards (`clay-surface p-6 sm:p-8 rounded-card border border-border-subtle`).
- **Pillar Cards Copy:**
  1. **Pillar 1: Agent Studio**
     - Icon: `Bot` (Dusty Plum)
     - Tag: `NATURAL LANGUAGE TO AGENT`
     - Heading: **Natural-Language Agent Studio**
     - Description: *“Describe the desired business outcome in plain English. Agent Studio generates an inspectable configuration including triggers, allowed system tools, knowledge boundaries, and strict output schemas. Never writes code or assumes permissions without your explicit approval.”*
     - Key Highlights:
       - Guided prompt-to-agent compiler with assumption checklist
       - Granular action-level permissions (Read, Draft, Write, Send, Delete)
       - Live interactive sandbox with sample inputs, token cost, and trace logs
  2. **Pillar 2: Workflow Studio**
     - Icon: `GitFork` / `Network` (Muted Sage)
     - Tag: `VISUAL GRAPH ORCHESTRATION`
     - Heading: **Composable Visual Workflow Studio**
     - Description: *“Design mission-critical processes on an infinite node canvas. Chain triggers, LLMs, condition branches, code execution nodes, database connectors, and approval checkpoints with typed schema validation and zero data-loss guarantees.”*
     - Key Highlights:
       - 15+ node types including Webhooks, Code (Python/TS), and MCP Tools
       - AI Builder converts natural-language instructions into visual graphs
       - Schema-aware ports detect incompatible data formats before execution
  3. **Pillar 3: Agent Workforce Swarms**
     - Icon: `Users` / `Layers` (Dusty Plum)
     - Tag: `MULTI-AGENT COORDINATION`
     - Heading: **Autonomous Multi-Agent Swarms**
     - Description: *“Coordinate specialized agents that delegate subtasks, share memory, review each other’s work, and aggregate complex research into structured business briefs. Built-in cycle detection guarantees agents never get stuck in infinite execution loops.”*
     - Key Highlights:
       - Hierarchical coordinator-specialist delegation architecture
       - Parallel task execution with shared working memory
       - Swarm-level budget caps and automatic loop termination
  4. **Pillar 4: Human Approval Firewall**
     - Icon: `ShieldCheck` (Dark Sage)
     - Tag: `GOVERNANCE & SAFETY FIRST`
     - Heading: **Human Approval Firewall**
     - Description: *“Enterprise autonomy requires immutable boundaries. The Approval Firewall intercepts sensitive agent actions—sending external emails, updating CRM records, issuing payments, or mutating databases—and holds them until an authorized person approves.”*
     - Key Highlights:
       - Server-authoritative interception immediately prior to external execution
       - Cryptographic action payload preview and tamper-proof audit hash
       - 1-click approvals via Web Dashboard, Slack, or Email notifications

---

### Section 4: Interactive Department Workflows
- **Section Eyebrow:** `REAL-WORLD OPERATIONAL TEMPLATES`
- **Section Heading:** **“Pre-Built Agent Teams Ready for Immediate Deployment”**
- **Section Description:** *“Inspect how Qwenton agents collaborate across four high-leverage departments. Select a workflow below to run a real-time execution simulation.”*
- **Interactive Tab Controller:** 4 department buttons:
  - Tab 1: `Sales & Lead Conversion`
  - Tab 2: `Customer Support Triage`
  - Tab 3: `Competitive Research Swarm`
  - Tab 4: `API & Data Pipeline Sync`
- **Workflow Detail & Simulation View:**
  - **Tab 1: Sales & Lead Conversion:**
    - Trigger: `New Inbound Lead via Webhook or Typeform`
    - Step 1 (Enrichment Agent): Pulls firmographic data, LinkedIn company profile, and annual revenue estimate.
    - Step 2 (CRM Sync): Creates company & contact record in HubSpot/Salesforce with lead score = 88/100.
    - Step 3 (Drafter Agent): Composes hyper-personalized outreach email referencing recent funding round.
    - Step 4 (Approval Firewall): **PROTECTED ACTION GATED.** Halts email send until SDR lead approves payload.
    - Step 5 (Dispatch): Email sent via SendGrid upon human sign-off; follow-up task scheduled in 3 days.
    - Metrics: Avg Duration: `1.8s` | Token Cost: `$0.014` | Humans in Loop: `1 Required Approval`
  - **Tab 2: Customer Support Triage:**
    - Trigger: `Zendesk / Intercom Inbound Ticket #8921`
    - Step 1 (Classification Agent): Classifies intent (`Billing Discrepancy`), sentiment (`Frustrated`), priority (`P1-High`).
    - Step 2 (Knowledge Hub Search): Semantic search across refund policy knowledge base and internal billing docs.
    - Step 3 (Resolution Drafter): Formats accurate response with transaction references and clear next steps.
    - Step 4 (Firewall Gate): Refund action ($49.00 credit) routed to Billing Manager for 1-click approval.
    - Step 5 (Delivery): Approved credit applied to Stripe; verified answer posted to customer ticket.
    - Metrics: Avg Duration: `2.2s` | Token Cost: `$0.019` | First-Response Time: `-94%`
  - **Tab 3: Competitive Research Swarm:**
    - Trigger: `Scheduled Weekly or Ad-Hoc Executive Prompt`
    - Step 1 (Coordinator Agent): Breaks brief into 3 sub-assignments: Feature Matrix, Pricing Changes, Customer Sentiment.
    - Step 2 (Specialist Agents in Parallel):
      - Agent A (Web Scraper): Extracts competitor product changelogs.
      - Agent B (Pricing Auditor): Monitors SaaS pricing table alterations.
      - Agent C (Review Synthesizer): Analyzes G2 & Trustpilot customer feedback trends.
    - Step 3 (Aggregator Agent): Synthesizes outputs into a 2-page Markdown Executive Brief with citations.
    - Step 4 (Knowledge Hub Archival): Indexes report into workspace Knowledge Base and notifies team in Slack.
    - Metrics: Parallel Tasks: `3 Agents` | Duration: `4.6s` | Source Citations: `14 Verified URLs`
  - **Tab 4: API & Data Pipeline Sync:**
    - Trigger: `PostgreSQL Database CDC Event / Stripe Webhook`
    - Step 1 (Validation Node): Schema-checks payload against Zod contract; rejects malformed inputs.
    - Step 2 (Code Transform Node): Python snippet normalizes currency, timestamps, and customer metadata.
    - Step 3 (ERP / Data Warehouse Load): Pushes normalized transaction records to Snowflake / BigQuery.
    - Step 4 (Dead-Letter Queue & Error Isolation): Failed records routed to quarantine with automatic exponential backoff retry.
    - Metrics: Throughput: `2,500 events/min` | Failure Isolation: `100% Idempotent` | Zero Data Loss
- **Interactive Simulator Control:**
  - Button: `[▶ Simulate Workflow Execution]`
  - Real-time animated state progression: `Idle` -> `Running Step 1 (300ms)` -> `Running Step 2 (400ms)` -> `Halted at Approval Firewall (Interactive Approve Button appears)` -> `User Clicks Approve` -> `Success Complete (200ms)`.

---

### Section 5: Target Customer Segments Matrix
- **Section Eyebrow:** `BUILT FOR EVERY SCALE`
- **Section Heading:** **“Tailored Workflows for Every Stage of Growth”**
- **4-Column Segment Cards:**
  1. **Small Businesses**
     - Subtitle: *“Automate without hiring specialists”*
     - Features:
       - No-code natural language setup
       - Pre-built templates for invoices, leads, and emails
       - Default safe sandboxes that prevent mistakes
       - Simple monthly pricing with transparent run budgets
     - CTA: `Browse Small Business Templates →`
  2. **Agencies & Consultancies**
     - Subtitle: *“Operate client workflows profitably”*
     - Features:
       - Isolated multi-tenant workspaces with client access
       - Exportable white-label workflow templates
       - Granular per-client token and API cost attribution
       - Strict tenant boundary security
     - CTA: `Explore Agency Solutions →`
  3. **Growing Companies**
     - Subtitle: *“Coordinate cross-department swarms”*
     - Features:
       - Multi-agent swarms across Sales, Support, and Ops
       - Server-enforced Human Approval Firewall
       - Shared Knowledge Hub with team collection permissions
       - Role-Based Access Control (Owner, Builder, Operator, Approver)
     - CTA: `Scale Your Workforce →`
  4. **Developers & Engineers**
     - Subtitle: *“Full extensibility and code-level control”*
     - Features:
       - TypeScript and Python sandbox execution nodes
       - Native Model Context Protocol (MCP) server connectivity
       - Webhook triggers, REST API dispatch, and version control
       - Live execution traces, step replay, and OpenTelemetry exports
     - CTA: `View Developer Documentation →`

---

### Section 6: Trust, Governance & Security Architecture
- **Section Eyebrow:** `ENTERPRISE GOVERNANCE BY DESIGN`
- **Section Heading:** **“Autonomous Power with Absolute Human Control”**
- **Section Description:** *“Most AI agent tools are reckless black boxes that execute unverified mutations directly to external systems. Qwenton enforces safety at the infrastructure layer.”*
- **3 Governance Architecture Pillars:**
  1. **The Human Approval Firewall:**
     - External actions (sending emails, modifying databases, charging cards) are halted at the server boundary.
     - Generates an immutable SHA-256 payload digest.
     - Configurable approval routing: 1-click in dashboard, signed Slack action, or email verification link.
  2. **Multi-Tenant Isolation & Least-Privilege RBAC:**
     - Strict tenant separation enforced in database rules and server authorization; never trusts client-supplied workspace IDs.
     - 6 granular roles: `Owner`, `Admin`, `Builder`, `Operator`, `Approver`, `Viewer`.
     - Zero credential leakage: API keys and OAuth tokens are stored in server-only vaults and never sent to client browsers.
  3. **Explainable Audit Traces & Idempotent Replays:**
     - Every agent action, prompt input, retrieved knowledge document, and tool invocation is logged in an immutable execution trace.
     - Idempotency keys prevent duplicate execution on network retries.
     - Instant rollback to previous agent or workflow versions with one click.

---

### Section 7: Measurable Business Impact & Performance
- **Section Eyebrow:** `PROVEN PLATFORM PERFORMANCE`
- **Section Heading:** **“Engineered for Speed, Reliability, and Zero Regrets”**
- **4 Key Quantitative Metrics:**
  - **`99.8%`** — **Action Accuracy** with Human Approval Firewall safety policies.
  - **`< 1.8s`** — **Average Swarm Execution Time** across parallel sub-agents.
  - **`100%`** — **Cryptographic Auditability** with immutable execution logs.
  - **`0`** — **Unapproved External Side Effects** across over 500,000 executed workflows.

---

### Section 8: Transparent Interactive Pricing Tiers
- **Billing Period Switcher:** `Monthly` / `Annual (Save 20%)` toggle state.
- **Tiers Grid (4 Plans):**
  1. **Starter ($0 / free forever)**
     - Ideal for: Solo founders and small businesses experimenting with automation.
     - Includes: 2 active agents, 100 runs/month, natural-language agent builder, standard templates, community support.
     - CTA: `Get Started Free` (Outline button)
  2. **Pro ($49 / month, billed annually as $39/mo)**
     - Ideal for: Fast-growing teams needing reliable cross-department automation.
     - Includes: 10 active agents, 5,000 runs/month, Workflow Studio visual canvas, Human Approval Firewall, Knowledge Hub (1 GB), email & Slack integrations.
     - CTA: `Start 14-Day Pro Trial` (Primary Dusty Plum Clay Button)
     - Popular Badge: `MOST POPULAR`
  3. **Team ($149 / month, billed annually as $119/mo)**
     - Ideal for: Multi-department companies and agencies managing multiple workspaces.
     - Includes: Unlimited active agents, 25,000 runs/month, Multi-Agent Swarms with parallel execution, 5 isolated workspaces, Role-Based Access Control, priority support.
     - CTA: `Upgrade to Team` (Primary Dusty Plum Clay Button)
  4. **Enterprise (Custom Pricing / Contact Us)**
     - Ideal for: Organizations with strict compliance, VPC, and dedicated throughput requirements.
     - Includes: Custom run quotas, dedicated VPC or on-prem deployment, custom MCP connector development, SAML/SSO & SCIM, 99.9% uptime SLA, dedicated success manager.
     - CTA: `Contact Enterprise Sales` (Secondary Muted Sage Button)

---

### Section 9: Frequently Asked Questions (FAQ Accordion)
Interactive accordion with single or multi-expand states:
1. **Q: How does the Human Approval Firewall prevent autonomous agents from making costly mistakes?**
   - *A: Unlike generic agent frameworks that execute external actions immediately, Qwenton’s Approval Firewall intercepts any protected action (such as sending an email to a customer, updating a CRM record, or modifying database rows) at the server layer. The action remains pending with an immutable payload preview until an authorized human reviews and clicks ‘Approve’. If anything looks incorrect, the reviewer can reject or edit the draft in real time.*
2. **Q: Can I use Qwenton without writing code or hiring software engineers?**
   - *A: Absolutely. Agent Studio allows you to create fully functional agents simply by describing your business goal in plain English. The platform automatically configures the triggers, required tools, and safe defaults. For visual builders, Workflow Studio provides an intuitive drag-and-drop canvas with pre-built nodes and templates.*
3. **Q: Does Qwenton support inbound or outbound phone calls and telephony CRM?**
   - *A: No. In accordance with our core product principles, Qwenton intentionally excludes call-management CRM, PBX phone queues, call recording, and voice dialers. We focus exclusively on high-reliability digital operations: email, CRM systems, helpdesks, webhooks, databases, spreadsheets, and internal knowledge bases.*
4. **Q: Which AI models and LLM providers does Qwenton connect to?**
   - *A: Qwenton is model-agnostic. You can deploy agents powered by Anthropic Claude 3.5, OpenAI GPT-4o, Google Gemini 2.0, or self-hosted open-weight models via local endpoints. You can mix and match models across different steps in a single workflow to optimize for speed, intelligence, or token cost.*
5. **Q: How does Qwenton guarantee that my company’s private data remains secure?**
   - *A: We enforce strict multi-tenant isolation at the database and server layers. Your documents in the Knowledge Hub are encrypted at rest and in transit, and access permissions are strictly validated before any agent can retrieve them. API keys and service credentials are stored in server-only vaults and are never exposed to client browsers.*
6. **Q: How do Multi-Agent Workforce Swarms work in practice?**
   - *A: In a Swarm, an executive Coordinator Agent breaks a complex goal into specialized sub-tasks and delegates them to dedicated agents (such as a Researcher, a Copywriter, and a Compliance Reviewer). The specialist agents work in parallel and hand off structured intermediate results back to the coordinator. Built-in cycle detection guarantees agents never get trapped in infinite loops.*

---

### Section 10: Final Call-to-Action & Footer
- **CTA Stage Card:**
  - Raised Clay card with Dusty Plum accents (`bg-surface-white rounded-hero border border-border-subtle p-8 sm:p-12 shadow-clay-card text-center`).
  - Heading: **“Ready to Orchestrate Your Autonomous AI Workforce?”**
  - Subhead: *“Join forward-thinking businesses and agile teams deploying reliable, governed AI agents today. Get started in minutes with zero credit card required.”*
  - Action Group:
    - `[Launch Free Workspace →]` (Deep Plum CTA)
    - `[Schedule Platform Demo]` (Sage Secondary CTA)
- **Global Footer:**
  - Left: Logo `Qwenton`, mission statement, system status indicator: `● All Systems Operational (99.98% uptime)`.
  - Links Columns:
    - **Platform:** Agent Studio, Workflow Studio, Swarms, Approval Firewall, Knowledge Hub, Marketplace.
    - **Solutions:** Small Businesses, Agencies, Growing Teams, Developers, Sales Ops, Support Triage.
    - **Resources:** Documentation, API Reference, MCP Tool Specs, Security Whitepaper, Changelog.
    - **Company & Governance:** About Us, Privacy Policy, Terms of Service, Multi-Tenant Trust Center.
  - Bottom Bar: `© 2026 Qwenton AI, Inc. Built with Warm Ivory, Muted Sage & Dusty Plum. Zero Black Guarantee.`

---

## 4. Component Specification: `AllRounderStudioShowcase.tsx`

### 4.1 Component Architecture & Responsibilities
- **File Location:** `components/landing/AllRounderStudioShowcase.tsx`
- **Target Role:** The premier interactive visual centerpiece on the landing page, demonstrating the 4 core pillars through engaging, realistic, and tactile claymorphic UI simulations.
- **Client Component:** Must include `'use client';` directive.
- **Zero-Black Guarantee:** Strictly uses the 3-colour palette tokens (`ivory`, `sage`, `plum`, and their designated tints).

### 4.2 Internal State Interface
```typescript
type ShowcasePillar = 'agent-studio' | 'workflow-studio' | 'workforce-swarm' | 'approval-firewall';

interface ShowcaseState {
  activePillar: ShowcasePillar;
  // Tab 1: Agent Studio State
  agentGoalInput: string;
  isAgentGenerating: boolean;
  agentGenerated: boolean;
  activeTools: { crm: boolean; email: boolean; docs: boolean; web: boolean };
  // Tab 2: Workflow Studio State
  activeWorkflowNode: string | null;
  isWorkflowRunning: boolean;
  workflowStep: number; // 0: Idle, 1: Trigger, 2: Agent Node, 3: Approval Node, 4: Delivery
  // Tab 3: Workforce Swarm State
  isSwarmExecuting: boolean;
  swarmProgress: { researcher: number; synthesizer: number; auditor: number };
  swarmStage: 'idle' | 'delegating' | 'running' | 'synthesizing' | 'complete';
  // Tab 4: Approval Firewall State
  approvalDecision: 'pending' | 'approved' | 'rejected';
  isInterceptionSimulating: boolean;
}
```

### 4.3 Detailed Pillar Interactive Views

#### View 1: Agent Studio Showcase (`activePillar === 'agent-studio'`)
- **Left Panel (Agent Configuration & Prompt Builder):**
  - Prompt Input Box: Pre-populated with:
    `"Monitor Zendesk tickets, search Knowledge Hub for solutions, draft friendly replies, and ask for approval on refund requests."`
  - Granular Permissions Checklist (Toggleable):
    - `[x] Read Tickets & Knowledge Documents` (Read-only)
    - `[x] Draft Responses in Zendesk` (Drafting permitted)
    - `[ ] Direct Send without Review` (Disabled by default - Security Policy)
    - `[x] Trigger Human Approval Firewall for Refunds > $20`
  - Button: `[⚡ Generate Agent Spec]` -> Simulates compilation in 400ms.
- **Right Panel (Live Agent Execution & Trace Sandbox):**
  - Displays generated Agent Profile Card:
    - Name: `Customer Care Sentinel Agent`
    - Trigger: `Inbound Zendesk Webhook`
    - Knowledge: `Refund Policy v3.2 & Help Docs (Indexed)`
    - Safety Boundary: `Approval Firewall Active on Refunds`
  - Live Interactive Test:
    - User types or clicks `[Simulate Ticket: "Need refund for order #4492"]`
    - Animated execution trace:
      1. `Reading ticket context...` (Sage pulse)
      2. `Querying Knowledge Hub embeddings... [Match: 96%]`
      3. `Drafting response with citation: Refund Policy Sec. 4`
      4. `Safety Check: Refund flag detected ($49.00) -> Routed to Firewall.`
    - Final Output Card displaying drafted response and pending approval status.

#### View 2: Workflow Studio Showcase (`activePillar === 'workflow-studio'`)
- **Visual Node Canvas (Interactive SVG / Clay Nodes):**
  - Displays an end-to-end operational graph with 4 distinct nodes:
    1. **Node 1: Webhook Trigger** (`Typeform / Inbound Lead`)
    2. **Node 2: Enrichment Agent** (`Firmographics & LinkedIn Scout`)
    3. **Node 3: Human Approval Firewall** (`Review High-Value Lead Outreach`)
    4. **Node 4: Multi-Channel Action** (`Send Email + Update Salesforce CRM`)
  - Nodes have connecting paths with animated dashed lines indicating active data flow.
- **Node Selection & Inspector Drawer:**
  - Clicking any node opens an inspectable side-panel showing:
    - Node Type & Status: `Validated (Type Safe)`
    - Input Schema: `{ leadEmail: string, companyUrl: string, intentScore: number }`
    - Action Permissions: `Restricted Execution via Firewall`
- **Canvas Action Bar:**
  - Button: `[▶ Run Workflow Simulation]`
  - Clicking runs an animated step-by-step trace where each node illuminates sequentially with Muted Sage and Dusty Plum pulses.

#### View 3: Workforce Swarm Showcase (`activePillar === 'workforce-swarm'`)
- **Hierarchical Swarm Stage:**
  - **Top: Executive Coordinator Agent (`"Operations Commander"`):**
    - Task: `"Synthesize 2026 Competitive Landscape in AI Automation"`
    - Loop Prevention Monitor: `Cycle Count: 0 / Max Allowed: 3 (Safe)`
    - Shared Memory Context: `Active Session Buffer (64 KB)`
  - **Bottom: 3 Specialist Agents Operating in Parallel:**
    - **Agent 1: Intelligence Harvester** (`Scrapes changelogs & pricing tables`) -> Progress bar: `100%`
    - **Agent 2: Quantitative Analyst** (`Normalizes feature matrix & API limits`) -> Progress bar: `100%`
    - **Agent 3: Executive Drafter** (`Formats structured Markdown briefing with citations`) -> Progress bar: `100%`
- **Interactive Trigger:**
  - Button: `[🚀 Dispatch Swarm]`
  - When clicked, progress bars advance in parallel with micro-timings (400ms, 700ms, 1100ms), followed by a consolidated output brief popping up in a clean clay well.

#### View 4: Human Approval Firewall Showcase (`activePillar === 'approval-firewall'`)
- **The Core Differentiator Stage:**
  - Displays a realistic, high-urgency **Pending Approval Interception Card**:
    - Header Badge: `🛡️ HUMAN APPROVAL FIREWALL • ACTION INTERCEPTED`
    - Alert Context: `Agent 'B2B Sales Swarm' attempted external mutation:`
    - Proposed Action: **“Send Enterprise Proposal & Binding Contract to Acme Corp ($24,000/yr)”**
    - Cryptographic Payload Hash: `sha256: 7f83b165...`
    - Affected Record: `Salesforce Opportunity #OPP-90214`
    - Risk Level: `CRITICAL • External Financial & Legal Commitment`
  - **Inspectable Payload Preview (Clay Recessed Well):**
    - Recipient: `sarah.chen@acmecorp.com`
    - Terms: `Annual Enterprise Tier, Net 30, SLA 99.9%`
    - Generated Document: `Acme_Corp_SOW_Nov2026.pdf (Ready for Signature)`
  - **Interactive Action Buttons:**
    - `[✓ Approve & Execute Action]` (Primary Deep Plum Button with Sage Success animation)
    - `[✕ Reject & Request Revision]` (Ghost / Outline Button)
  - **Real-Time Interactive Feedback:**
    - When user clicks `Approve`:
      - Card animates with a gentle lift.
      - Status badge transitions to: `APPROVED • Dispatched via SendGrid API with Audit Log #TX-89211`.
      - Displays timestamp and immutable approver record (`Signed by: user@company.com`).
    - When user clicks `Reject`:
      - Prompts for rejection reason (`"Change payment terms to Net 15"`) and routes feedback back to the agent.

---

## 5. Acceptance Criteria & Testable Quality Gates

| ID | Category | Requirement / Acceptance Test | Verification Method |
|---|---|---|---|
| **AC-001** | **Positioning** | Zero occurrences of Instagram-exclusive copy, Reels-only references, or social DM bot branding on `app/page.tsx`. | Automated grep / regex scan. |
| **AC-002** | **Headline** | Exact headline appears verbatim: *"One workspace to build AI agents, connect business systems, automate processes, coordinate teams of agents, and govern every important action."* | DOM text content test. |
| **AC-003** | **4 Pillars** | All 4 pillars (Agent Studio, Workflow Studio, Agent Workforce Swarms, Human Approval Firewall) are clearly presented with cards and interactive demos. | Component render check. |
| **AC-004** | **4 Segments** | All 4 customer segments (Small Businesses, Agencies, Growing Companies, Developers) have distinct value props, tailored feature lists, and CTAs. | Content inspection. |
| **AC-005** | **4 Workflows** | All 4 interactive department workflows (Sales, Support, Research, Data Pipelines) have inspectable steps, payloads, and simulation triggers. | Interactive state test. |
| **AC-006** | **Hero Showcase** | `AllRounderStudioShowcase.tsx` renders 4 functional tabs with interactive simulations, live traces, and approval actions. | Interactive click & tab test. |
| **AC-007** | **Zero-Black Rule** | Zero `#000000`, zero `#000`, zero charcoal (`#1C241B`), zero navy in any inline styles or classes. All typography uses Deep Plum (`#3C2A3A` / `#5E445B`). | Automated CSS & codebase regex audit. |
| **AC-008** | **Accessibility** | All text against backgrounds achieves WCAG 2.2 AA (>= 4.5:1) and AAA (>= 7.0:1) contrast. All interactive elements have min 48px touch targets. | Contrast formula & viewport test. |
| **AC-009** | **Compilation** | Clean compilation with `npm run build` and `tsc --noEmit` returning exit code 0. | CLI verification. |

---

## 6. Assumptions, Risks & Mitigation Strategies

### 6.1 Explicit Decisions & Assumptions
- **DEC-003:** The landing page replaces the previous Instagram Reels focus entirely, positioning Qwenton as an enterprise-grade AI Workforce Platform across Sales, Support, Operations, and Engineering.
- **DEC-004:** The centerpiece hero component `AllRounderStudioShowcase.tsx` will be built as an interactive client component, allowing immediate hands-on exploration without requiring user registration.
- **DEC-005:** Telephony and call-management CRM are strictly excluded from all promotional copy, feature grids, and interactive templates in adherence to Blueprint Section 01.

### 6.2 Risk Register
| Risk ID | Description | Severity | Impact | Mitigation Strategy | Owner |
|---|---|---|---|---|---|
| **RSK-004** | High component complexity in `AllRounderStudioShowcase.tsx` causing render lag or layout shifting. | Medium | User bounce rate on initial load. | Use lightweight declarative state machine with CSS transitions (180ms); avoid heavy external canvas libraries. | `frontend-developer` |
| **RSK-005** | Loss of existing social-automation search traffic or user expectations. | Low | Temporary repositioning adjustment. | Include social & marketing as one of the supported multi-channel integrations under Sales & Marketing without monopolizing the brand narrative. | `product-manager` |
| **RSK-006** | Contrast degradation on secondary text elements across soft clay surfaces. | High | WCAG AA failure on mobile screens. | Enforce Muted Plum (`#644C61` at 6.72:1 contrast) and Dark Sage (`#3A5245` at 7.47:1 contrast) for all secondary text and icons. | `ui-ux-designer` |

---

## 7. Downstream Handoff & Implementation Sequence

- **Immediate Next Handoff:** `frontend-developer`
- **Execution Tasks:**
  1. Build `components/landing/AllRounderStudioShowcase.tsx` matching the 4-tab interactive specification in Section 4.
  2. Implement `app/page.tsx` incorporating all copy, headings, workflows, customer segments, pricing, and FAQ sections specified in Section 3.
  3. Verify clean compilation via `tsc --noEmit` and `npm run build`.
