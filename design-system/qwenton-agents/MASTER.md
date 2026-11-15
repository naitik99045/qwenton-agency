# Design System Master File: Qwenton Agents
**Standard:** UI UX Pro Max v2.0
**Product Category:** AI Autonomous Coworker Platform & Marketing Automation
**Visual Archetype:** Midnight Navy + Glacial Ice + Electric Orchid (Cinematic Dark & Crisp Ice Light)
**Generated:** 2026-11-15 18:57 IST

---

## 1. Master Palette Tokens

### Dark Mode (Primary / Cinematic Command Desk)
| Token | Hex / HSL | Usage | WCAG Contrast |
| :--- | :--- | :--- | :--- |
| `--bg-midnight` | `#0B1120` | Base Canvas Background (Deep Midnight Navy) | Canvas |
| `--surface-panel` | `#111C35` | Primary Card & Window Surfaces | Elevated |
| `--surface-elevated`| `#172342` | Inset Containers, Input Wells, Sub-panels | Inset |
| `--border-subtle` | `rgba(226, 232, 240, 0.12)` | Quiet Structural Hairline Borders | Subtle |
| `--border-glow` | `rgba(192, 132, 252, 0.25)` | Focused / Active Card Outline | Accent |
| `--text-ice` | `#F1F5F9` | Primary Luminous Ice Text | 16.5:1 (AAA) |
| `--text-muted` | `#94A3B8` | Supporting Slate Ice Body Text | 7.8:1 (AAA) |
| `--ice-frost` | `#38BDF8` | Glacial Ice Accent, Metrics, Trust Badges | 9.2:1 (AAA) |
| `--orchid-primary` | `#D946EF` | Electric Orchid CTA Buttons, Live Indicators | 5.8:1 (AA) |
| `--orchid-hover` | `#E879F9` | Interactive Hover Elevation | 7.2:1 (AAA) |
| `--orchid-subtle` | `rgba(217, 70, 239, 0.12)` | Orchid Pill Fills, Ambient Spotlights | Accent |
| `--approval-gate` | `#F59E0B` | Human Approval Checkpoint Amber | 8.5:1 (AAA) |
| `--success-mint` | `#34D399` | Delivery Complete, Online Status | 9.8:1 (AAA) |

### Light Mode (Glacial Frost Alternative)
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--bg-light` | `#F8FAFC` | Luminous Glacial Ice Canvas |
| `--surface-light` | `#FFFFFF` | Crisp White Elevated Cards |
| `--surface-well` | `#F1F5F9` | Recessed Technical Wells |
| `--border-light` | `#E2E8F0` | Defined Container Boundaries |
| `--text-dark` | `#0B132B` | Midnight Navy Primary Headings & Copy |
| `--text-subtle` | `#64748B` | Slate Muted Text |
| `--orchid-btn` | `#9333EA` | Orchid Action CTAs (6.5:1 on light base) |
| `--ice-btn` | `#0284C7` | Deep Glacial Blue Secondary CTAs |

---

## 2. Typography Rules (ui-ux-pro-max standard)

- **Display & Headings**: `Space Grotesk`, `sans-serif` (Weights: 700 bold, 800 black). Unique tech character, tight tracking (`-0.03em`).
- **Body & Controls**: `Plus Jakarta Sans` or `Inter`, `sans-serif` (Weights: 400 normal, 500 medium, 600 semibold). Highly legible, open apertures.
- **System & Terminal Labels**: `JetBrains Mono` or `ui-monospace` (Weight: 500). Used for latency, trigger keywords, status tags.

---

## 3. Component & Interaction Rules

### A. Zero AI Slop & Zero Spinning Wireframes
- **Strictly Prohibited**: Rotating 3D wireframe spheres, particle mesh fields, glowing ring black holes, non-functional 3D clutter.
- **Mandatory**: Real product command cockpit displaying authentic product operations:
  1. Live Inbound Comment stream with trigger keyword highlight.
  2. Semantic intent parsing with confidence percentage.
  3. Interactive Human Approval Gate with inline "Approve & Send" and "Edit Reply" controls.
  4. Instant verified DM delivery receipt with millisecond latency proof.

### B. Button Architecture
- **Primary CTA (`.btn-orchid`)**:
  - Background: Solid Electric Orchid (`#D946EF`) with hover `#E879F9`.
  - Text: High-contrast pure white (`#FFFFFF`) or deep navy (`#0B1120`), font-weight 700.
  - Border: 1px hairline `rgba(255, 255, 255, 0.2)`.
  - Shadow: Soft orchid ambient glow (`0 8px 20px -4px rgba(217, 70, 239, 0.35)`).
- **Secondary CTA (`.btn-ice`)**:
  - Background: Glacial Ice Tint (`rgba(56, 189, 248, 0.1)`), border `rgba(56, 189, 248, 0.3)`.
  - Text: Ice Cyan (`#38BDF8`), hover background `rgba(56, 189, 248, 0.2)`.
- **Approval Action (`.btn-approval`)**:
  - Background: Amber Glow (`#F59E0B`), text `#0B1120` font-extrabold.

---

## 4. UI UX Pro Max Verification Checklist
- [x] Contrast ratio $> 4.5:1$ for body text, $> 3:1$ for large headings.
- [x] Touch targets minimum $44 \times 44\text{px}$.
- [x] Visible focus rings on all interactive elements.
- [x] Smooth transitions (150ms-250ms cubic-bezier).
- [x] Lucide SVG icons only (zero raw emojis used as icons).
- [x] Responsive layout tested for $375\text{px}$, $768\text{px}$, $1024\text{px}$, and $1440\text{px}$.
- [x] Zero spinning wireframe black hole circles.
