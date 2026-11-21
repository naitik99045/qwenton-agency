# Frontend Implementation Handoff Report — Hero 3D Spatial Experience

**Task ID:** AT-016  
**Role:** `frontend-developer`  
**Status:** `done`  
**Date:** 21 November 2026  
**Reference Baseline:**  
- `C:\Users\hp\.gemini\config\plugins\agentic-product-team\company\policies\ui-reference-notes.md` (ThreeUI, Taste Skill, GSAP, 21st.dev)
- `docs/agentic-team/brief-landing-rework.md`
- `docs/agentic-team/handoffs/3d-ui-designer.md`
- `Qwenton_Updated_All_Rounder_Implementation_Blueprint.pdf`

**Target Files Created & Modified:**
1. `components/landing/Hero3DExperience.tsx` (New Three.js WebGL tactile clay 3D Hero Spatial Experience with orbiting agent swarm and live telemetry HUD)
2. `app/page.tsx` (Integrated `Hero3DExperience` into Section 2 Hero Stage with choreographed GSAP-style cubic-bezier entry animations)
3. `app/globals.css` (Added `@keyframes heroFadeUp`, `@keyframes heroBloomIn`, `@keyframes heroFloatGentle`, `.animate-hero-eyebrow`, `.animate-hero-headline`, `.animate-hero-subhead`, `.animate-hero-cta`, `.animate-hero-pills`, `.animate-hero-3d`, `.animate-float-gentle`)
4. `docs/agentic-team/handoffs/frontend-hero-3d.md` (This handoff report)

---

## 1. Objective and Scope

### 1.1 Objective
Implement the Hero 3D Spatial Experience (`Hero3DExperience.tsx`) with choreographed entry animations and integrate into `app/page.tsx` using the 4 UI reference principles:
1. **ThreeUI Principle**:
   - Built a real Three.js WebGL scene with responsive perspective camera, soft clay materials, interactive raycasting, soft three-point lighting rig, and zero black wireframe meshes.
2. **Taste Skill Principle**:
   - Strict 3-colour palette (Warm Ivory `#F4F0E8` / `0xFCFAF6`, Muted Sage `#8FA99A` / `0x3A5245`, Dusty Plum `#80627D` / `0x5E445B` / `0x3C2A3A`).
   - Zero `#000000`, zero `0x000000`, zero charcoal, zero navy, and zero wireframes.
   - Tactile soft claymorphic materials (`roughness: 0.74, metalness: 0.02, clearcoat: 0.10, clearcoatRoughness: 0.30`).
3. **GSAP Easing & Choreography Principle**:
   - Staged sequence in Section 2:
     * Eyebrow badge: `animate-hero-eyebrow` (0.05s delay)
     * Verbatim headline: `animate-hero-headline` (0.15s delay)
     * Subhead: `animate-hero-subhead` (0.28s delay)
     * CTAs: `animate-hero-cta` (0.40s delay)
     * Trust pills: `animate-hero-pills` (0.52s delay)
     * 3D Canvas bloom: `animate-hero-3d` (0.65s delay)
   - All animations use `cubic-bezier(0.16, 1, 0.3, 1)` and respect `@media (prefers-reduced-motion: reduce)` with instant fallback.
4. **21st.dev Principle**:
   - Owned, clean TypeScript/Tailwind code with 48px touch targets for Android and mobile.
   - Keyboard accessible department switcher tabs (`[All Core, Sales Lead, Support, Research, Firewall]`).
   - Live telemetry card displaying category, status badge, latency, token cost, gate type, and verified capabilities.

### 1.2 3D Scene Architecture (`Hero3DExperience.tsx`)
- **Central Agent Core**:
  * Matte clay sphere (`0xFCFAF6`) with Sage equatorial collar ring (`0x8FA99A`).
  * Facing Plum gem core node with warm point light beacon.
  * Dual counter-rotating gimbal rings (TorusGeometry) in Sage and Plum tilted at 45° and -60°.
- **4 Orbiting Department Specialist Satellites**:
  1. *Sales Lead Qualifier* (`sales`): Sage capsule + Ivory collar ring; orbits at radius 2.45 with 0.52 rad/s.
  2. *Support Sentinel* (`support`): Ivory disc tablet + Sage pupil + Sage ring; orbits at radius 3.1 with -0.38 rad/s.
  3. *Research Swarm* (`research`): Plum octahedron prism + 2 orbiting mini-satellite beads; orbits at radius 2.75 with 0.44 rad/s.
  4. *Approval Firewall Gate* (`firewall`): Plum octagonal shield tablet + Sage verification emblem; orbits at radius 3.55 with -0.26 rad/s.
- **Physics & Parallax**:
  * Pointer and touch parallax physics smoothly lerps `targetRotX` and `targetRotY` within `[-8deg, +8deg]` (0.14 rad).
  * Raycaster highlights hovered satellite, alters cursor to pointer, and scales active satellite to 1.22x.
- **Performance & Safety**:
  * Device Pixel Ratio (DPR) clamped to `Math.min(window.devicePixelRatio || 1, 1.75)` for mobile GPU thermal management.
  * `IntersectionObserver` halts animation loop when scrolled off screen.
  * Complete lifecycle cleanup: disposes all geometries, materials, and renderer on unmount.
  * Full WebGL context loss handling and high-fidelity 2D clay fallback.

---

## 2. Verification and Evidence

| Check | Requirement | Command / Check | Result |
|---|---|---|---|
| **TypeScript** | Type-safety | `cmd /c "npm run typecheck"` | **PASS (Exit code 0)** |
| **Next.js Build** | Production compilation | `cmd /c "npm run build"` | **PASS (Exit code 0, 59/59 static pages generated)** |
| **Palette Compliance** | Strict 3-Colour Palette | Inspected `Hero3DExperience.tsx` and `app/page.tsx` | **PASS (Zero `#000000`, zero `0x000000`, zero charcoal/navy)** |
| **Mobile Accessibility** | 48px touch targets | Inspect tab and button styles in `Hero3DExperience.tsx` | **PASS (`min-h-[48px]` enforced)** |
| **Motion Accessibility** | Reduced motion support | `prefers-reduced-motion: reduce` in `app/globals.css` | **PASS** |

---

## 3. Decisions and Assumptions

1. **Integrated 3D Hero Placement**: Positioned the `Hero3DExperience` directly between the trust pills and the playable `AllRounderStudioShowcase` component within Section 2, ensuring the hero entry creates immediate 3D visual punch while smoothly guiding users to the playable showcase.
2. **Accessible Bi-Directional Selection**: While raycasting allows direct clicking of 3D meshes on desktop, mobile users and keyboard navigators require large touch targets. We provided a 5-tab claymorphic control bar (`min-h-[48px]`) that syncs bidirectionally with the 3D scene.
3. **Subtle Orbit Traces**: Faint clay hairline orbital ellipses (`0xDED8CD`, opacity 0.75) provide visual trajectory grounding without creating visual noise.

---

## 4. Next Handoff
- **Next Role:** `code-reviewer` / `test-engineer` to inspect the spatial hero implementation and confirm integration tests pass.
