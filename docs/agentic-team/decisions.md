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
