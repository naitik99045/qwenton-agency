# Hero Section Visual Architecture & UX Specification
## Replacing Rejected 3D Abstract Spheres with an Ambient-Enhanced Product Cockpit

**Task ID:** AT-020  
**Role:** `ui-ux-designer`  
**Status:** `done`  
**Date:** 21 November 2026  
**Reference Baseline:**  
- `C:\Users\hp\.gemini\config\plugins\agentic-product-team\company\policies\ui-reference-notes.md` (ThreeUI, Taste Skill, GSAP, 21st.dev)  
- `Qwenton_Updated_All_Rounder_Implementation_Blueprint.pdf` (Section 01, 02 & 03)  
- `qwenton-review` negative design directives & anti-AI-slop rules  
**Target File Deliverable:** `docs/agentic-team/handoffs/hero-ux-spec.md` (Design Specification for `frontend-developer`)  

---

## 1. Executive Summary & Why the Previous Hero Was Rejected

### 1.1 The User's Rejection Context
The previous hero implementation introduced `Hero3DExperience.tsx`, which rendered:
- A large white clay sphere with orbiting green and purple rings.
- Floating random cubes, capsules, and geometric satellites scattered across an empty void.
- A cluster of buttons below the 3D scene ("Core Mesh", "Sales Lead", "Support", "Research", "Firewall Gate") that controlled camera angles rather than real software.

**User Verdict:** Rejected as **generic AI slop**. It communicated nothing about what Qwenton actually does. It felt like a tech demo for Three.js geometry rather than an enterprise workforce platform.

### 1.2 The Strategic Pivot: Product Cockpit Hero
Following the research across our 4 design references:
1. **Taste Skill (tasteskill.dev):** *“Anchor the hero with real content. Never use abstract shapes to explain software.”* The hero must show the **real product**—a live, interactive agent studio, visual workflow graph, and human approval firewall.
2. **ThreeUI (threeui.com):** 3D belongs in the *ambient depth layer* (subtle card tilt, soft clay specular highlights, depth-staged parallax badges), **never** as a disconnected centerpiece rotating in space.
3. **GSAP (gsap.com):** Motion must be **finite, choreographed, and purposeful**. Staggered entrance, reactive hover elevation, and zero infinite spinning geometry.
4. **21st.dev (21st.dev):** Modern SaaS heroes utilize a tactile, high-craft **Product Cockpit Window** with real telemetry, tabs, schema inspectors, and interactive controls.

---

## 2. Visual Composition Diagram (ASCII)

```
+---------------------------------------------------------------------------------------------------------+
| [STICKY GLOBAL NAVIGATION]                                                                              |
| Logo: Qwenton [All-Rounder v2.4]    Pillars    Workflows    Solutions    Governance    Pricing     [Launch] |
+---------------------------------------------------------------------------------------------------------+
                                                                                                           
                                    ● ENTERPRISE AUTONOMOUS WORKFORCE                                      
                                                                                                           
               One workspace to build AI agents, connect business systems,                                 
                 automate processes, coordinate teams of agents, and govern                                
                                   every important action.                                                 
                                                                                                           
     Replace brittle point-tool bots with an enterprise workforce. Build autonomous agents with           
      natural language, design visual multi-step workflows, and maintain 100% human control.              
                                                                                                           
                     [Start Building Free ->]         [Explore Interactive Studio v]                       
                                                                                                           
         [✓ Zero-Risk Sandbox]   [✓ Human Approval Firewall]   [✓ Multi-Tenant Isolation]                  
                                                                                                           
===========================================================================================================
  [3D PERSPECTIVE PRODUCT STUDIO COCKPIT] (perspective: 1200px, rotateX: 2deg, soft claymorphism)          
===========================================================================================================
+---------------------------------------------------------------------------------------------------------+
| [O O O]  qwenton / production-workspace / active-swarms          [● 4 Swarms Active] [Latency: 1.8s]    |
+---------------------------------------------------------------------------------------------------------+
| TAB SELECTOR:  [★ Agent Studio]   [⑂ Workflow Studio]   [☵ Multi-Agent Swarms]   [🛡️ Approval Firewall] |
+---------------------------------------------------------------------------------------------------------+
|                                                                    |                                    |
|  LEFT PANE: NATURAL LANGUAGE TO AGENT COMPILER                     | RIGHT PANE: LIVE SANDBOX & TRACE   |
|                                                                    |                                    |
|  Prompt: "Monitor Zendesk tickets, search Knowledge Hub            | Agent Profile:                     |
|  for solutions, draft friendly replies, and ask for                | 'Customer Care Sentinel v2.4'      |
|  approval on refund requests > $20."                               |                                    |
|                                                                    | Live Execution Trace:              |
|  Granular Policy Checkpoints:                                      | 1. Inbound Webhook Received [✓]    |
|  [x] Read Tickets & Knowledge Documents (Read-Only)                | 2. Semantic Search: 96% Match [✓]  |
|  [x] Draft Responses in Zendesk                                    | 3. Draft Generated (Refund $49)    |
|  [ ] Direct Send without Review (Locked by Security Policy)        | 4. GATED AT APPROVAL FIREWALL [!]  |
|  [x] Route Refunds to Human Approval Firewall                      |                                    |
|                                                                    | [Simulate Refund Ticket #4492]     |
|  [⚡ Compile Verified Agent Spec]                                   |                                    |
|                                                                    | Output: Pending Manager Sign-off   |
+---------------------------------------------------------------------------------------------------------+
  FLOATING PARALLAX SATELLITE A (translateZ: 28px)        FLOATING PARALLAX SATELLITE B (translateZ: 28px)  
  [🛡️ Human Approval Firewall: 1 Gated Action ($24,000)]   [⚡ Swarm: 3 Parallel Tasks Completed in 1.8s]  
===========================================================================================================
```

---

## 3. Component Breakdown

The new hero architecture consists of five coordinated modules:

### 3.1 Eyebrow Status Badge
- **Role:** High-level enterprise category anchor.
- **Visual:** Soft Muted Sage pill (`bg-sage-light text-sage-dark border border-sage-border`).
- **Content:** Pulsing green indicator dot + `"ENTERPRISE AUTONOMOUS WORKFORCE PLATFORM"`.
- **Touch Target:** Non-interactive or smooth scroll anchor.

### 3.2 Typography Anchor (Headline & Sub-headline)
- **Role:** Clear, authoritative statement of product purpose.
- **Headline (H1):** The approved Blueprint Section 01 positioning statement:
  > *“One workspace to build AI agents, connect business systems, automate processes, coordinate teams of agents, and govern every important action.”*
- **Sub-headline:** Explains *how* and *why* in 2 sentences:
  > *“Replace brittle point-tool bots with an enterprise workforce. Build autonomous agents with natural language, design visual multi-step workflows, deploy coordinated swarms across departments, and maintain 100% human control with our server-enforced Approval Firewall.”*

### 3.3 Call-to-Action Group & Trust Strip
- **Primary CTA:** `[Start Building Free →]` -> Links directly to `/dashboard`. Dusty Plum (`#80627D`) with soft clay elevation (`shadow-clay-button`), hover deep plum (`#5E445B`).
- **Secondary CTA:** `[Explore Interactive Studio ↓]` -> Smooth scrolls down to the studio cockpit with subtle Sage styling (`bg-sage-light text-sage-dark border border-sage-border`).
- **Trust Strip:** 3 compact checkmark pills:
  - `✓ Zero-Risk Sandbox Execution`
  - `✓ Human-in-the-Loop Approval Firewall`
  - `✓ Multi-Tenant Isolation (Zero Black-Box Actions)`

### 3.4 The Hero Centerpiece: `HeroStudioCockpit`
Replaces the abstract 3D sphere with an **elevated tactile application window**:
- **Window Chrome:**
  - 3 soft clay window control dots in Ivory, Sage, and Plum.
  - Workspace address breadcrumb: `qwenton / production-workspace / active-swarms`.
  - Real-time telemetry indicators: `● 4 Swarms Operational`, `Avg Latency: 1.8s`, `Action Accuracy: 99.8%`.
- **Interactive Multi-Pillar Tab Rail:**
  - 4 tabs allowing immediate hands-on exploration without sign-up:
    1. **Agent Studio:** Prompt-to-agent compiler with granular permissions checklist and live simulation trace.
    2. **Workflow Studio:** 4-node visual operational graph (`Webhook` -> `Enrichment` -> `Approval Gate` -> `Dispatch`).
    3. **Workforce Swarms:** Hierarchical Coordinator Agent orchestrating 3 parallel specialist workers with progress bars.
    4. **Approval Firewall:** Flagship pending action card ($24,000 Acme proposal) with 1-click Approve / Reject controls.
- **Interactive Simulation Engine:** Users can click `[⚡ Compile Agent]`, `[▶ Run Workflow]`, `[🚀 Dispatch Swarm]`, or `[✓ Approve Action]` and watch state changes unfold in real time.

### 3.5 Floating Ambient Parallax Badges (Depth Enhancement)
Instead of floating abstract shapes, two **contextual software badges** hover slightly forward in 3D space (`translateZ(28px)`):
- **Badge A (Top Right):** `🛡️ Human Approval Firewall: 1 Gated Action Pending Review ($24,000/yr Contract)`
- **Badge B (Bottom Left):** `⚡ Parallel Swarm: 3 Agents Synchronized in 1.8s • 14 Citations Verified`
These badges react to cursor parallax movement, adding tangible physical depth to real product features.

---

## 4. Color Assignments (Strict 60-30-10 Rule)

In strict adherence to Blueprint Section 02, zero black, zero near-black, and zero 4th brand colors:

| Color Family | Ratio | Hex Code | Assigned Elements in Hero Section |
|---|---|---|---|
| **Warm Ivory** | **60%** | `#F4F0E8` (Canvas) | Page background, hero container canvas. |
| | | `#FCFAF6` (Card) | Cockpit window shell, raised interactive card surfaces. |
| | | `#FAF7F2` (Panel) | Sub-panels, sandbox output wells, inspectable panes. |
| | | `#EDE8DE` (Well) | Prompt input wells, code boxes, recessed telemetry bars. |
| | | `#DED8CD` (Border) | Hairline borders, window dividers, subtle separators. |
| **Muted Sage** | **30%** | `#8FA99A` (Brand) | Active tab pills, agent brain nodes, secondary accents. |
| | | `#3A5245` (Dark Accent) | Success badges, verified checkmarks, high-contrast labels. |
| | | `#EAF0EC` (Chip Tint) | Eyebrow badge background, secondary CTA button surface. |
| | | `#587363` (Deep Sage) | Secondary button hover, active spline connector lines. |
| **Dusty Plum** | **10%** | `#80627D` (Brand Focal) | Primary CTA button, active navigation focus rings. |
| | | `#5E445B` (Deep Plum) | Primary CTA hover state, Approval Firewall security border. |
| | | `#3C2A3A` (Ink Plum) | H1 Headline, primary card titles, high-contrast body text. |
| | | `#644C61` (Muted Plum) | Sub-headline, descriptive prose, secondary metadata. |

---

## 5. Typography Hierarchy

| Role | Font Family | Size | Weight | Tracking | Line Height | Color |
|---|---|---|---|---|---|---|
| **Eyebrow Badge** | Sans / Mono | `0.75rem` (12px) | Bold (700) | `0.08em` | `1.0` | Dark Sage `#3A5245` |
| **H1 Hero Headline** | Sans (`var(--font-sans)`) | `clamp(2.25rem, 1.8rem + 2.5vw, 4.25rem)` | ExtraBold (800) | `-0.035em` | `1.08` | Ink Plum `#3C2A3A` |
| **Sub-headline** | Sans (`var(--font-sans)`) | `clamp(1.05rem, 0.95rem + 0.5vw, 1.25rem)` | Normal (400) | `-0.015em` | `1.55` | Muted Plum `#644C61` |
| **CTA Primary Button** | Sans | `1.0rem` (16px) | Bold (700) | `-0.01em` | `1.0` | Pure White `#FFFFFF` on Plum `#80627D` |
| **CTA Secondary Button**| Sans | `1.0rem` (16px) | SemiBold (600) | `-0.01em` | `1.0` | Dark Sage `#3A5245` on `#EAF0EC` |
| **Cockpit Window Title**| Mono | `0.8125rem` (13px) | Medium (500) | `0.02em` | `1.2` | Muted Plum `#644C61` |
| **Cockpit Headers** | Sans | `1.125rem` (18px) | Bold (700) | `-0.02em` | `1.25` | Ink Plum `#3C2A3A` |
| **Code / Trace Output** | Mono | `0.8125rem` (13px) | Regular (400) | `0.00em` | `1.4` | Darkest Plum `#3C2A3A` |

---

## 6. Animation Choreography & Motion Timing (GSAP / CSS Specifications)

All motion is purposeful, sequential, and respects `@media (prefers-reduced-motion: reduce)`.

### 6.1 Entrance Sequence (Total Duration: 850ms)
```
T+0.00s : Canvas background & header fade in               [duration: 300ms, ease: ease-out]
T+0.15s : Eyebrow badge drifts up (y: 12px -> 0, alpha: 0->1) [duration: 350ms, ease: cubic-bezier(0.16, 1, 0.3, 1)]
T+0.25s : H1 Headline reveals (y: 18px -> 0, alpha: 0->1)     [duration: 450ms, ease: cubic-bezier(0.16, 1, 0.3, 1)]
T+0.35s : Sub-headline reveals (y: 14px -> 0, alpha: 0->1)    [duration: 400ms, ease: cubic-bezier(0.16, 1, 0.3, 1)]
T+0.45s : CTA Button row & Trust strip reveal                 [duration: 350ms, ease: ease-out]
T+0.55s : Product Studio Cockpit elevates into 3D perspective [duration: 650ms, ease: cubic-bezier(0.16, 1, 0.3, 1)]
          - Transform: perspective(1200px) rotateX(4deg) translateY(28px) -> rotateX(1.8deg) translateY(0)
          - Shadow: 0 4px 18px -> 0 20px 40px -8px rgba(60, 42, 58, 0.12)
T+0.85s : Parallax Satellite Badges pop forward in Z-space    [duration: 300ms, ease: back.out(1.4)]
          - Transform: translateZ(0) -> translateZ(28px)
```

### 6.2 Interactive Cursor Parallax Physics
- **Container:** `perspective: 1200px;`
- **Cockpit Element:** `transform-style: preserve-3d;`
- **Mouse Movement Damping:**
  ```typescript
  // Clamped rotation formula
  const maxTilt = 3.5; // Max 3.5 degrees
  const tiltX = -((mouseY - centerY) / centerY) * maxTilt;
  const tiltY = ((mouseX - centerX) / centerX) * maxTilt;
  cockpitElement.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
  ```
- **Interpolation:** Smooth spring lerp (`lerp = 0.08`) ensuring an earthen, ceramic weight without plastic bounce.

---

## 7. Responsive Behavior Across Viewports

### 7.1 Desktop (1440px)
- Layout: Centered column with maximum width `1200px`.
- Cockpit: Full 2-pane interactive studio layout side-by-side (`50% config / 50% live trace`).
- Parallax: Full 3D perspective tilt active (`rotateX: 1.8deg` base, `±3.5deg` mouse interaction).
- Satellite Badges: Floating at `translateZ(28px)` positioned over the cockpit corners.

### 7.2 Tablet (768px)
- Layout: Stacked responsive container, max width `720px`.
- Cockpit: 2-pane layout collapses to stacked layout (Config pane top, Sandbox trace bottom).
- Parallax: Tilt effect reduced to gentle `±1.2deg` to avoid touch interference.
- Satellite Badges: Docked into top and bottom header bands instead of floating over interactive inputs.

### 7.3 Mobile & Android (390px)
- Layout: Single-column clean fluid stack.
- Headline: Scaled responsively to `2.25rem` (36px) with intentional line breaks avoiding widows.
- 3D Perspective: **Disabled** (`transform: none !important`). Cockpit renders as a crisp, raised clay card with soft dual shadows (`shadow-clay-card`), eliminating GPU drain and mobile Chrome overflow bugs.
- Touch Targets: All tab buttons and simulation triggers strictly enforce `min-height: 48px`.
- Input Typography: All inputs enforce `font-size: 16px` to prevent browser auto-zooming.

---

## 8. What Is Explicitly FORBIDDEN

To permanently protect Qwenton from generic AI tropes and aesthetic slop, the following elements are **strictly banned**:

1. ❌ **No Abstract Floating Spheres:** No white clay balls, crystal orbs, or metallic planets.
2. ❌ **No Concentric Orbital Rings:** No spinning gimbals or planetary tracks rotating around objects.
3. ❌ **No Disconnected Geometric Shapes:** No floating random cubes, capsules, prisms, or icosahedrons.
4. ❌ **No Camera-Control Button Bars:** No buttons labeled "Core Mesh", "Satellite View", or "Orbit Mode" that do not perform real software tasks.
5. ❌ **No Wireframe Grids or Neon Shaders:** No glowing purple/green grids resembling 1980s Tron or generic Web3 crypto projects.
6. ❌ **No Pitch Black `#000000` or Charcoal Surfaces:** All dark elements must use Darkest Plum (`#3C2A3A`).
7. ❌ **No Fake Animations Without Function:** Every button and trigger in the hero must perform a visible, meaningful action (e.g., compiling an agent, running a workflow, or approving a transaction).

---

## 9. Implementation Blueprint & File Restructuring for `frontend-developer`

### 9.1 File Clean-up Plan
1. **Remove `components/landing/Hero3DExperience.tsx`** from `app/page.tsx`.
2. **Elevate `components/landing/AllRounderStudioShowcase.tsx`** to become the premier hero visual.
3. Wrap the showcase in the **`3D Perspective Studio Window`** container (`perspective: 1200px`, `clay-surface`, `shadow-clay-card`, subtle hover tilt).
4. Add the two **Floating Parallax Satellite Badges** (`Human Approval Firewall` & `Multi-Agent Swarm Status`) around the window.

### 9.2 Complete Production-Ready Hero JSX Blueprint
```tsx
{/* Hero Stage Container */}
<section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden bg-canvas">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
    
    {/* 1. Eyebrow Status Badge */}
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-light border border-sage-border text-sage-dark text-xs font-mono font-bold shadow-xs select-none mb-6 animate-fade-in">
      <span className="w-2 h-2 rounded-full bg-sage-brand animate-pulse" />
      ENTERPRISE AUTONOMOUS WORKFORCE PLATFORM
    </div>

    {/* 2. Main H1 Headline */}
    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight max-w-4xl mx-auto leading-[1.08] mb-6">
      One workspace to build AI agents, connect business systems, automate processes, coordinate teams of agents, and govern every important action.
    </h1>

    {/* 3. Sub-headline */}
    <p className="text-base sm:text-lg lg:text-xl text-ink-muted max-w-3xl mx-auto leading-relaxed mb-8">
      Replace brittle point-tool bots with an enterprise workforce. Build autonomous agents with natural language, design visual multi-step workflows, deploy coordinated swarms across departments, and maintain 100% human control with our server-enforced Approval Firewall.
    </p>

    {/* 4. Action CTAs */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
      <Link href="/dashboard" className="w-full sm:w-auto">
        <Button variant="primary" size="lg" className="w-full sm:w-auto min-h-[48px] px-8 text-base shadow-clay-button">
          Start Building Free <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
      <a href="#showcase" className="w-full sm:w-auto">
        <Button variant="secondary" size="lg" className="w-full sm:w-auto min-h-[48px] px-6 text-base bg-sage-light text-sage-dark border border-sage-border hover:bg-sage/20">
          Explore Interactive Studio <ChevronDown className="w-4 h-4 ml-1.5" />
        </Button>
      </a>
    </div>

    {/* 5. Trust Strip */}
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-ink-muted mb-14">
      <span className="inline-flex items-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 text-sage-dark" /> Zero-Risk Sandbox Execution
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-sage-dark" /> Human-in-the-Loop Approval Firewall
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Lock className="w-4 h-4 text-sage-dark" /> Multi-Tenant Workspace Isolation
      </span>
    </div>

    {/* 6. Product Studio Cockpit with 3D Perspective Elevation */}
    <div 
      id="showcase" 
      className="relative w-full max-w-5xl transition-transform duration-300 ease-out perspective-[1200px]"
    >
      {/* Satellite Parallax Badge A: Firewall Interception */}
      <div className="hidden lg:flex absolute -top-5 -right-6 z-20 items-center gap-2.5 px-4 py-2.5 rounded-card bg-surface-white border border-border-subtle shadow-clay-card text-left transform translate-z-[28px] animate-float-gentle">
        <div className="w-8 h-8 rounded-control bg-plum-tint border border-plum/30 flex items-center justify-center text-plum">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-mono font-bold text-plum uppercase tracking-wider">Approval Firewall</div>
          <div className="text-xs font-semibold text-ink">1 Action Gated ($24,000 Proposal)</div>
        </div>
      </div>

      {/* Satellite Parallax Badge B: Swarm Telemetry */}
      <div className="hidden lg:flex absolute -bottom-5 -left-6 z-20 items-center gap-2.5 px-4 py-2.5 rounded-card bg-surface-white border border-border-subtle shadow-clay-card text-left transform translate-z-[28px] animate-float-gentle-reverse">
        <div className="w-8 h-8 rounded-control bg-sage-light border border-sage-border flex items-center justify-center text-sage-dark">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-mono font-bold text-sage-dark uppercase tracking-wider">Swarm Coordination</div>
          <div className="text-xs font-semibold text-ink">3 Specialist Agents • 1.8s Sync</div>
        </div>
      </div>

      {/* The Core Studio Component */}
      <div className="clay-surface rounded-card-lg border border-border-subtle shadow-clay-card overflow-hidden">
        {/* Cockpit Window Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface-panel/80 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-border-subtle border border-border-strong" />
            <span className="w-3 h-3 rounded-full bg-sage-brand/50 border border-sage-brand" />
            <span className="w-3 h-3 rounded-full bg-primary/40 border border-primary" />
            <span className="ml-2 font-mono text-xs text-ink-muted">qwenton / production-workspace / active-swarms</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sage-light text-sage-dark">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-dark animate-pulse" />
              4 Swarms Active
            </span>
            <span className="hidden sm:inline font-mono text-xs text-ink-light">Latency: 1.8s</span>
          </div>
        </div>

        {/* Studio Showcase Interactive Content */}
        <AllRounderStudioShowcase />
      </div>
    </div>

  </div>
</section>
```

---

## 10. Quality Gate & Acceptance Verifications

| ID | Check | Verification Method | Pass Criteria |
|---|---|---|---|
| **UX-001** | Zero Abstract 3D Spheres | Code & DOM inspection | Zero occurrences of `SphereGeometry`, wireframe meshes, or orbital rings in hero. |
| **UX-002** | Real Product Centered | Component render check | Hero visually anchors with `HeroStudioCockpit` showing real agent compiler & workflow trace. |
| **UX-003** | 3-Colour Compliance | Hex code audit | Warm Ivory `#F4F0E8` (60%), Muted Sage `#8FA99A` (30%), Dusty Plum `#80627D` (10%). |
| **UX-004** | Zero Black Guarantee | Codebase regex scan | 0 matches for `#000000`, `#000`, charcoal, navy. Darkest Plum `#3C2A3A` used for text. |
| **UX-005** | WCAG 2.2 AAA Contrast | Contrast calculation | Primary headings at 11.66:1 contrast; secondary text at 6.72:1 contrast. |
| **UX-006** | Mobile & Android Safe | Viewport testing | 48px touch targets, `font-size: 16px` on inputs, perspective tilt disabled on mobile. |
| **UX-007** | Clean Typecheck | `npm run typecheck` | Exit code 0 with zero compilation errors. |

---

## 11. Downstream Handoff

- **Target Role:** `frontend-developer`
- **Next Task:** Task AT-021 (Implement the New Hero Section Architecture)
- **Action Items for Frontend Developer:**
  1. Open `app/page.tsx` and completely remove `Hero3DExperience`.
  2. Implement the `HeroStudioCockpit` window wrapper around `AllRounderStudioShowcase` following Section 9 of this specification.
  3. Add the two floating parallax satellite badges with `translateZ(28px)`.
  4. Ensure zero abstract 3D spheres or disconnected buttons exist.
  5. Run `npm run typecheck` and verify clean compilation.
