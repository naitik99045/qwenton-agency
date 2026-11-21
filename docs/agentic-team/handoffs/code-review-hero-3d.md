# Code & Architecture Review Report: Hero 3D Spatial Experience

**Task ID:** AT-017  
**Role:** `code-reviewer`  
**Status:** `done`  
**Date:** 21 November 2026  
**Reference Baseline:**  
- `C:\Users\hp\.gemini\config\plugins\agentic-product-team\company\policies\ui-reference-notes.md` (ThreeUI, Taste Skill, GSAP, 21st.dev)
- `Qwenton_Updated_All_Rounder_Implementation_Blueprint.pdf` (Sections 02 & 03)
- `docs/agentic-team/handoffs/frontend-hero-3d.md`  

**Scope Inspected:**
- `components/landing/Hero3DExperience.tsx`
- `app/page.tsx`
- `app/globals.css`
- `scripts/audit-3d-compliance.js`

---

## 1. Executive Summary & Verdict

- **Review Verdict:** **APPROVED (PASS)**
- **Confidence Level:** High (verified via automated regex analysis, WebGL lifecycle review, mobile touch ergonomics audit, CSS animation inspection, TypeScript `tsc --noEmit` exit code 0, and Next.js production build exit code 0 across all 59 routes).
- **Core Summary:**
  The new Hero 3D Spatial Experience (`Hero3DExperience.tsx`) successfully implements an interactive, soft claymorphic Three.js scene featuring a central Agent Core and 4 orbiting department specialists (*Sales Lead Qualifier, Support Sentinel, Research Swarm, Approval Firewall Gate*). It strictly follows the 3-colour palette with zero black or wireframe artifacts, implements full WebGL memory disposal and off-screen pause, guarantees Android touch safety with 48px targets and `touch-pan-y`, and integrates seamlessly with GSAP-style choreographed cubic-bezier entry animations that respect `prefers-reduced-motion`.

---

## 2. Review Checklist Verification

### 2.1 Strict 3-Colour & Zero-Black Rule
- **Requirements:**
  - 0 occurrences of `#000000`, `0x000000`, `rgb(0,0,0)`, `bg-black`, `text-black`, `charcoal`, or `navy`.
  - All Three.js colors map strictly to Warm Ivory, Muted Sage, or Dusty Plum.
- **Verification & Findings:**
  - Automated regex audit via `node scripts/audit-3d-compliance.js` across all landing and 3D files reported:
    `Total violations found: 0`
    `PASS: Zero forbidden black, charcoal, or navy colors detected across all files including Hero3DExperience.tsx!`
  - Three.js palette audit in `Hero3DExperience.tsx` (lines 20–43):
    - **Warm Ivory:** Canvas clearColor `0xF4F0E8`, Raised Card `0xFCFAF6`, Panel `0xFAF7F2`, Well `0xEDE8DE`, Border `0xDED8CD`, Pure Highlight `0xFFFFFF`.
    - **Muted Sage:** Brand `0x8FA99A`, Dark Accent `0x3A5245`, Chip `0xEAF0EC`, Deep `0x587363`, Hover `0x7E9A8B`.
    - **Dusty Plum:** Brand `0x80627D`, Typography `0x3C2A3A`, CTA `0x5E445B`, Tint `0xF5EFF4`, Shadow `0x3C2A3A`.
  - Three-point lighting rig uses warm diffused ambient illumination (`0xFFFBF4`, 1.6), warm key light (`0xFFFAF0`, 2.2), cool fill (`0xE8EFF0`, 0.85), plum rim light (`0x80627D`, 1.3), and sage core point beacon (`0x8FA99A`, 0.8), casting zero harsh dark shadows.
  - **Verdict:** **Approved**

### 2.2 WebGL Resource Lifecycle & Memory Hygiene
- **Requirements:**
  - Verify recursive scene graph traversal and disposal of all geometries and materials on unmount.
  - Verify WebGL renderer disposal (`renderer.dispose()`) and canvas DOM detachment.
  - Verify event listeners cleanup on unmount.
  - Verify `cancelAnimationFrame` and `IntersectionObserver` auto-pause when scrolled off-screen.
- **Verification & Findings:**
  - In `Hero3DExperience.tsx` lines 642–675, the unmount cleanup function:
    1. Cancels the active animation frame: `cancelAnimationFrame(animId)`.
    2. Disconnects the `IntersectionObserver`: `observer.disconnect()`.
    3. Detaches all 8 window and container event listeners:
       - `window.removeEventListener('resize', handleResize)`
       - `container.removeEventListener('pointermove', handlePointerMove)`
       - `container.removeEventListener('pointerdown', handlePointerDown)`
       - `window.removeEventListener('pointerup', handlePointerUp)`
       - `container.removeEventListener('pointerleave', handlePointerLeave)`
       - `container.removeEventListener('click', handleClick)`
       - `canvas.removeEventListener('webglcontextlost', handleContextLost)`
       - `canvas.removeEventListener('webglcontextrestored', handleContextRestored)`
    4. Recursively traverses `scene.traverse((obj) => ...)`:
       - Disposes mesh geometries (`obj.geometry.dispose()`).
       - Disposes both single materials and material arrays (`mat.dispose()`).
    5. Disposes the WebGL renderer (`renderer.dispose()`) and detaches the DOM canvas element (`canvas.parentElement.removeChild(canvas)`).
    6. In the render loop (line 547), `if (!isVisible) return;` skips CPU/GPU frame computation whenever the canvas is scrolled out of view.
  - **Verdict:** **Approved**

### 2.3 Mobile & Android Safety
- **Requirements:**
  - Verify touch targets maintain `min-h-[48px]`.
  - Verify `touch-action: pan-y` on canvas container so mobile vertical scrolling is not trapped by 3D canvas touch gestures.
  - Verify DPR clamping to prevent mobile GPU overheating.
- **Verification & Findings:**
  - All 5 department switcher tabs (`Core Mesh`, `Sales Lead`, `Support`, `Research`, `Firewall Gate`) and action buttons in `Hero3DExperience.tsx` (lines 747, 760, 773, 786, 799, 851) enforce `min-h-[48px]`. In the non-WebGL 2D fallback, interactive cards also enforce `min-h-[48px]` (line 699).
  - Canvas container in `Hero3DExperience.tsx` (line 720) enforces `touch-pan-y` (`touch-action: pan-y`), guaranteeing that mobile vertical touch drag gestures scroll the webpage naturally rather than being intercepted by the canvas.
  - Device pixel ratio is clamped via `renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))` (line 196), preventing GPU thermal throttling on high-DPI Android and iOS screens.
  - **Verdict:** **Approved**

### 2.4 CSS Animation Hygiene & Motion Accessibility
- **Requirements:**
  - Verify staged GSAP-style cubic-bezier entry animations in `app/globals.css`.
  - Verify `prefers-reduced-motion` media query support for entry animations.
- **Verification & Findings:**
  - Staged entry sequence in `app/globals.css` (lines 193–251):
    - `.animate-hero-eyebrow`: `heroFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both`
    - `.animate-hero-headline`: `heroFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both`
    - `.animate-hero-subhead`: `heroFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both`
    - `.animate-hero-cta`: `heroFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.40s both`
    - `.animate-hero-pills`: `heroFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.52s both`
    - `.animate-hero-3d`: `heroBloomIn 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both`
  - In `app/globals.css` (lines 118–127), `@media (prefers-reduced-motion: reduce)` sets `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; animation-iteration-count: 1 !important;`, ensuring that users with vestibular sensitivities or reduced-motion OS settings experience instantaneous, jump-free rendering.
  - **Verdict:** **Approved**

### 2.5 TypeScript & Next.js Production Build
- **Requirements:**
  - TypeScript static analysis passes with code 0 (`npm run typecheck`).
  - Next.js production build succeeds with code 0 (`npm run build`).
- **Verification & Findings:**
  - `npm.cmd run typecheck` (`tsc --noEmit`) exited with **code 0**.
  - `npm.cmd run build` compiled all 59 static and dynamic routes cleanly with exit **code 0**.
  - **Verdict:** **Approved**

---

## 3. Detailed Findings & Review Categorization

| Severity | Category | Description | Status |
|---|---|---|---|
| **Approved** | 3-Colour Compliance | Zero `#000000`, zero `0x000000`, zero charcoal, zero navy. Strict Warm Ivory, Muted Sage, and Dusty Plum adherence. | Verified |
| **Approved** | WebGL Memory Hygiene | Scene graph traversal, geometry/material disposal, renderer disposal, DOM detachment, 8 event listeners removed on unmount. | Verified |
| **Approved** | Power & Thermal Safety | `IntersectionObserver` pause on off-screen scroll; DPR clamped to 1.75; no post-processing overhead. | Verified |
| **Approved** | Touch & Mobile Ergonomics | Canvas container features `touch-pan-y`; all interactive buttons and tabs maintain `min-h-[48px]`. | Verified |
| **Approved** | Motion Accessibility | Choreographed entry animations with `cubic-bezier(0.16, 1, 0.3, 1)`; clamped to 0.01ms in `prefers-reduced-motion`. | Verified |
| **Approved** | Build Quality | TypeScript `tsc --noEmit` and Next.js `npm run build` both exit with code 0 across 59 routes. | Verified |

---

## 4. Next Handoff

- **Target Agent:** `qa-test-automation` (Task ID: AT-018)
- **Handoff Scope:** Conduct automated browser validation on `Hero3DExperience.tsx`, verify department tab switching and live telemetry updates, test Android touch responsiveness, and compile final delivery release sign-off.
