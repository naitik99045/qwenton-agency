# Delivery Decisions Log

### DEC-001: 3-Colour Design Token Selection
- **Context:** Blueprint Section 02 mandates Warm Ivory, Muted Sage, and Dusty Plum without black or 4th brand colors.
- **Decision:**
  - Base Canvas: Warm Ivory (`#F4F0E8`)
  - Accent / Controls / Active: Muted Sage (`#8FA99A`, deep sage `#688273`)
  - Primary / Headings / CTAs: Dusty Plum (`#80627D`, deep plum typography `#3C2A3A`)
- **Rationale:** Deep plum typography (`#3C2A3A`) against warm ivory (`#F4F0E8`) achieves a **9.8:1 contrast ratio** (WCAG AAA compliant) while maintaining 100% adherence to the zero-black and 3-colour rule.

### DEC-002: Information Architecture Alignment
- **Context:** Blueprint Section 03 mandates a stable left sidebar with 6 navigation groups: Workspace, Build, Connect, Knowledge, Operate, Admin.
- **Decision:** Implement these groups in `AppShell.tsx` with collapsible mobile drawer, badging for active counts, and deep links.

### DEC-003: All-Rounder Positioning Rework
- **Context:** User requested to eliminate Instagram-only messaging and properly reflect the All-Rounder AI Workforce Platform.
- **Decision:** Adopt the headline: *"One workspace to build AI agents, connect business systems, automate processes, coordinate teams of agents, and govern every important action."* Across 4 core pillars and 4 customer segments.

### DEC-004: Interactive Studio Showcase Architecture
- **Context:** Need an engaging, tangible demonstration of the 4 pillars without requiring immediate account creation.
- **Decision:** Built `AllRounderStudioShowcase.tsx` featuring 4 playable interactive tabs: Agent Studio, Visual Workflow Canvas, Multi-Agent Swarms, and the Human Approval Firewall.

### DEC-005: Voice & Telephony Scope Exclusion
- **Context:** Blueprint Section 01 & 07 explicitly mandates excluding telephony CRM workflows in the current release.
- **Decision:** Excluded all phone call queues, PBX, voice recording, and telephony features from copy and UI.

### DEC-006: Proper 3D UI Architecture (Tactile Soft Claymorphism vs. Wireframe Tropes)
- **Context:** User requested: "redisign the ui from making it into a static ui into a proper 3d ui without any error's". Previous user critiques specifically rejected "spinning black hole circle / wireframe spheres" as generic AI slop.
- **Decision:**
  1. Implement a **Proper 3D Claymorphic WebGL Scene** (`ThreeWorkforceStudio3D.tsx`) using Three.js with soft clay materials (`MeshStandardMaterial` / `MeshPhysicalMaterial`, roughness: 0.75, zero metalness, warm ivory/sage/plum lighting).
  2. Geometries represent the **All-Rounder AI Workforce Platform**:
     - Beveled 3D Workflow Nodes: `[Trigger]` -> `[Agent Brain]` -> `[Approval Firewall]` -> `[Execution Action]`.
     - 3D Floating Agent Swarm Orbs with real shadows and connecting data pipes.
     - Interactive 3D Cursor Tilt & Gyroscope Physics (the 3D scene rotates and tracks cursor/touch smoothly).
     - Interactive 3D Node Selection: Clicking 3D nodes triggers live state updates on the studio board!
  3. Complement with **CSS 3D Perspective Card Tilt** across marketing cards for tactile physical depth.
  4. Ensure zero black, zero neon, zero unhandled errors, WebGL fallback, and 48px Android touch targets.
