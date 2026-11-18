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

### DEC-003: Landing Page Value Proposition Pivot
- **Context:** Previous landing page focused exclusively on Instagram Reel Comment-to-DM automation. Blueprint Section 01 mandates an All-Rounder AI Workforce Platform across Sales, Support, Operations, and Engineering.
- **Decision:** Replace Instagram-only messaging with the Blueprint positioning statement: *"One workspace to build AI agents, connect business systems, automate processes, coordinate teams of agents, and govern every important action."*

### DEC-004: Interactive Hero Architecture (`AllRounderStudioShowcase.tsx`)
- **Context:** Prospective users need immediate, frictionless proof of the 4 core pillars without registering.
- **Decision:** Build `AllRounderStudioShowcase.tsx` as a high-fidelity interactive client component featuring 4 playable tabs: Agent Studio, Workflow Studio, Multi-Agent Swarms, and the Human Approval Firewall with simulated execution traces.

### DEC-005: Strict Exclusion of Telephony/Call Management CRM
- **Context:** Blueprint Section 01 explicitly excludes call-management CRM, inbound/outbound telephony, PBX queues, audio recording, and call-center dashboards.
- **Decision:** Omit all voice/telephony features from marketing copy, interactive demos, and pricing tiers to ensure zero false promises and focused digital operations.
