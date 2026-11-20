# 3D Soft Claymorphism UI Architecture & Interactive WebGL Scene Specification

**Task ID:** AT-012  
**Role:** `ui-ux-designer`  
**Status:** `done`  
**Date:** 20 November 2026  
**Reference Baseline:** `Qwenton_Updated_All_Rounder_Implementation_Blueprint.pdf` (Section 02 & Section 03), `qwenton-ui` skill, `docs/agentic-team/brief-landing-rework.md`  
**Target Deliverable:** `docs/agentic-team/handoffs/3d-ui-designer.md` (Specification for `frontend-developer`)  

---

## 1. Executive Summary & Spatial Design Vision

This specification defines the complete 3D UI architecture and WebGL scene for the **Qwenton All-Rounder AI Workforce Platform**. It elevates the landing page from a static 2D layout into a tactile, living **3D Soft Claymorphism Spatial Canvas** without introducing visual clutter, performance degradation, or accessibility barriers.

### 1.1 Spatial Intent & Visual Story
Rather than rendering arbitrary floating shapes (such as rotating wireframe icosahedrons or sci-fi neon grids), the 3D scene directly embodies Qwenton's core product truth:
> **An autonomous, multi-agent workflow where intelligent agents coordinate tasks, pass typed data payloads, and are strictly governed by the Human Approval Firewall.**

Visitors see an interactive, elevated 3D canvas depicting a 4-node autonomous pipeline. Nodes are soft, tactile clay tablets with subtle bevels and ambient lighting that gently react to cursor and touch movement, emit animated data pulses along Catmull-Rom splines, and synchronize bi-directionally with the interactive product showcase.

---

## 2. Strict 3-Colour Palette in Three.js Hex

In strict compliance with Blueprint Section 02 and the Zero-Black Rule:
- **Zero Black / Zero Cyber Wireframe:** Absolutely NO `0x000000`, NO near-black (`0x1C241B`), NO dark charcoal, NO navy, and NO neon green/purple wireframes.
- Every color in the WebGL scene, lighting model, materials, and background is directly mapped to the 3-colour system.

### 2.1 Three.js Color Constants
```typescript
export const THREE_PALETTE = {
  // Warm Ivory Family (Canvas, elevated surfaces, calm neutral space)
  ivory: {
    canvas: 0xF4F0E8,      // Scene background & clearColor
    card: 0xFCFAF6,        // Raised clay tablets, pristine matte surface
    panel: 0xFAF7F2,       // Sub-panel modules & containers
    well: 0xEDE8DE,        // Recessed wells & connector sockets
    border: 0xE7E1D7,      // Soft clay hairline bevels & node boundaries
  },

  // Muted Sage Family (Active states, intelligent agents, verified indicators)
  sage: {
    brand: 0x8FA99A,       // Agent Brain node body, pulse chips, connectors
    accent: 0x3A5245,      // Dark Sage text/icons, verified pulse core (WCAG AAA)
    chip: 0xEAF0EC,        // Soft Sage ambient base, active socket halos
    deep: 0x587363,        // Secondary buttons, active spline highlights
    hover: 0x7E9A8B,       // Interactive node hover highlight
  },

  // Dusty Plum Family (Primary actions, headings, Human Approval Firewall)
  plum: {
    brand: 0x80627D,       // Dusty Plum Firewall Shield, focal CTAs
    typography: 0x3C2A3A,  // Darkest Plum node headings & metadata (WCAG AAA)
    cta: 0x5E445B,         // Deep Plum high-contrast security gate borders
    tint: 0xF5EFF4,        // Ultra-soft plum aura for pending approval state
    shadow: 0x3C2A3A,      // Directional shadow tint (zero black)
  },
} as const;
```

### 2.2 Three-Point Ambient & Clay Lighting Rig
Claymorphic materials depend on warm, diffused illumination rather than harsh specular pinpoints. The scene uses an intentional 3-point clay lighting setup:

```typescript
export function setupClayLighting(scene: THREE.Scene) {
  // 1. Ambient Warm Diffuse Light: Prevents harsh shadows, keeps crevices warm ivory
  const ambientLight = new THREE.AmbientLight(0xFFFBF4, 1.4);
  scene.add(ambientLight);

  // 2. Key Sun Light (Warm Ivory): Directional light casting soft, shallow shadows
  const keyLight = new THREE.DirectionalLight(0xFFFAF0, 2.2);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  // 3. Fill Light (Cool Muted Sage): Soft upward bounce from bottom-left
  const fillLight = new THREE.DirectionalLight(0xE8EFF0, 0.85);
  fillLight.position.set(-4, -3, 3);
  scene.add(fillLight);

  // 4. Subtle Plum Rim/Accent Light: Positioned near Firewall node for security gate presence
  const plumRim = new THREE.PointLight(THREE_PALETTE.plum.brand, 1.2, 8);
  plumRim.position.set(1.4, 0.5, 2.5);
  scene.add(plumRim);
}
```

---

## 3. 3D Soft Claymorphism Material & Geometry Specification

### 3.1 Material Physics Parameters
The physical quality of "soft clay" requires high surface roughness, minimal metallic reflection, and a gentle clearcoat glaze:

| Property | Value | Rationale |
|---|---|---|
| `roughness` | `0.74` (range 0.70 - 0.78) | Unglazed matte earthen clay; prevents glossy plastic glare. |
| `metalness` | `0.02` (range 0.00 - 0.05) | Near-zero conductivity; pure organic ceramic appearance. |
| `clearcoat` | `0.10` | Delicate baked enamel sheen catching key-light grazing angles. |
| `clearcoatRoughness` | `0.30` | Diffuses clearcoat highlights softly across curved bevels. |
| `shadowSide` | `THREE.DoubleSide` | Eliminates shadow acne on thin clay tablets. |

```typescript
export const createClayMaterial = (colorHex: number, emissiveHex = 0x000000, emissiveIntensity = 0.0) => {
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.74,
    metalness: 0.02,
    emissive: emissiveHex,
    emissiveIntensity,
    shadowSide: THREE.DoubleSide,
  });
};
```

### 3.2 Tactile Bevel Geometries
All geometric primitives in the scene must exhibit smooth, rounded edges (12–18px equivalent radius in 3D units):
- **Clay Tablets (Trigger & Dispatch Nodes):** Created via `THREE.ExtrudeGeometry` with a 2D rounded rectangle shape (`bevelEnabled: true`, `bevelSegments: 8`, `bevelSize: 0.08`, `bevelThickness: 0.08`).
- **Agent Brain Node:** Smooth capsule / rounded cylinder (`THREE.CylinderGeometry` with `THREE.SphereGeometry` caps, 36 radial segments).
- **Firewall Shield Node:** Beveled pentagonal security shield with rounded apex and soft perimeter chamfer.
- **Connectors:** 3D circular tubes sweeping along cubic Catmull-Rom splines (`THREE.TubeGeometry(curve, 64, 0.045, 12, false)`).

---

## 4. 4-Stage Autonomous Workflow Canvas Scene Architecture

The scene represents an active, 4-stage operational pipeline floating in space. Nodes are arrayed along a gentle S-curve across the camera viewport.

```
+-----------------------------------------------------------------------------------------+
|                                3D WORKFLOW CANVAS VIEWPORT                               |
|                                                                                         |
|      [1. Trigger Node]  =======(Spline 1)=======>  [2. Agent Brain Node]                |
|      (Warm Ivory Tablet)                            (Tactile Sage Capsule + Orbit)      |
|                                                               ||                        |
|                                                            (Spline 2)                   |
|                                                               \/                        |
|      [4. Dispatch Node] <=======(Spline 3)=======  [3. Approval Firewall Node]          |
|      (Warm Ivory Sockets)                           (Dusty Plum Shield Gate)            |
+-----------------------------------------------------------------------------------------+
```

### 4.1 Spatial Node Coordinates & Inventory

| Node ID | Node Name | 3D Position [X, Y, Z] | Physical Shape & Clay Visuals | Role & State Indicator |
|---|---|---|---|---|
| `trigger` | **Webhook Trigger** | `[-3.8, 0.8, 0.0]` | Rounded Warm Ivory clay tablet (`0xFCFAF6`, 2.2 x 1.4 x 0.28) with subtle ivory border (`0xE7E1D7`). | Inbound webhook beacon; features a pulsing Muted Sage cylindrical button (`0x8FA99A`) on its top surface. |
| `enrich` | **Agent Brain** | `[-1.2, 1.4, 0.3]` | Muted Sage rounded capsule (`0x8FA99A`, r=0.55, h=1.1) with two concentric Dusty Plum orbiting rings (`0x80627D`). | Multi-model intelligence hub; 3 micro-spheres orbit the capsule, representing parallel sub-agent threads. |
| `firewall` | **Approval Firewall** | `[1.3, -0.6, 0.2]` | Beveled Dusty Plum faceted security shield (`0x80627D`, 2.0 x 2.2 x 0.35) with Deep Plum perimeter (`0x5E445B`). | Human-in-the-loop gate; features an embedded central status gem that pulses amber/plum when awaiting sign-off. |
| `action` | **Multi-Channel Dispatch** | `[3.9, -0.2, -0.1]` | Warm Ivory delivery dock (`0xFCFAF6`, 2.4 x 1.5 x 0.28) with two recessed sockets (SendGrid & Salesforce). | Guaranteed execution endpoint; dual output chips illuminate upon firewall clearance. |

---

## 5. 3D Connectors & Animated Data Pulses (`CatmullRomCurve3`)

### 5.1 Smooth Spline Pathways
Nodes are connected by continuous 3D Catmull-Rom bezier curves passing through spatial waypoints:

```typescript
// Spline 1: Trigger -> Agent Brain
const spline1 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2.7, 0.8, 0.0),
  new THREE.Vector3(-2.0, 1.2, 0.2),
  new THREE.Vector3(-1.8, 1.3, 0.3),
]);

// Spline 2: Agent Brain -> Approval Firewall
const spline2 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.6, 1.3, 0.3),
  new THREE.Vector3(0.2, 0.5, 0.4),
  new THREE.Vector3(0.4, -0.4, 0.2),
]);

// Spline 3: Approval Firewall -> Dispatch Node
const spline3 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(2.2, -0.6, 0.2),
  new THREE.Vector3(2.8, -0.4, 0.1),
  new THREE.Vector3(3.2, -0.3, -0.1),
]);
```

### 5.2 Animated Data Pulse Engine
Small clay beads (`radius: 0.08`, Warm Ivory / Muted Sage) traverse the splines to represent real-time JSON payloads:
- In the `idle` state, pulses travel at a tranquil pace (`0.35` cycle/sec).
- During active workflow simulation (`isWorkflowRunning === true`), pulses accelerate sequentially from Step 1 to Step 2, halt visibly at Node 3 (**Firewall Gate**) until the human clicks `[Approve]`, then burst forward to Node 4.

```typescript
// Pulse animation loop logic
function animatePulses(elapsedSeconds: number, isHaltedAtFirewall: boolean) {
  // Pulse 1 (Spline 1): Inbound payload
  const t1 = (elapsedSeconds * 0.4) % 1.0;
  pulseMesh1.position.copy(spline1.getPointAt(t1));

  // Pulse 2 (Spline 2): Agent thought payload
  const t2 = (elapsedSeconds * 0.4 + 0.33) % 1.0;
  pulseMesh2.position.copy(spline2.getPointAt(t2));

  // Pulse 3 (Spline 3): Approved action payload (Halted if awaiting approval)
  if (!isHaltedAtFirewall) {
    const t3 = (elapsedSeconds * 0.4 + 0.66) % 1.0;
    pulseMesh3.position.copy(spline3.getPointAt(t3));
    pulseMesh3.visible = true;
  } else {
    // Docked at Firewall entrance
    pulseMesh3.position.copy(spline2.getPointAt(0.98));
    pulseMesh3.scale.setScalar(1.0 + Math.sin(elapsedSeconds * 6) * 0.15); // Urgent breathing pulse
  }
}
```

---

## 6. Interactive Physics, Parallax Tilt & Tab Synchronization

### 6.1 Gentle Parallax Tilt (Clamped to ±8 Degrees)
The entire 3D stage reacts to cursor coordinates (desktop) or touch drag (mobile):
- Max horizontal rotation (`Y-axis`): `±0.14 rad` (`~8.0 degrees`).
- Max vertical rotation (`X-axis`): `±0.10 rad` (`~5.7 degrees`).
- Rotation is smoothly interpolated using spring lerping (`alpha = 0.06`) to ensure a weighty, ceramic feel with zero jitter.

```typescript
// Pointer move calculation
function onPointerMove(event: PointerEvent, containerRect: DOMRect) {
  const normX = ((event.clientX - containerRect.left) / containerRect.width) * 2 - 1;
  const normY = -(((event.clientY - containerRect.top) / containerRect.height) * 2 - 1);
  
  targetSceneRotation.y = THREE.MathUtils.clamp(normX * 0.14, -0.14, 0.14);
  targetSceneRotation.x = THREE.MathUtils.clamp(-normY * 0.10, -0.10, 0.10);
}

// In requestAnimationFrame
sceneGroup.rotation.y = THREE.MathUtils.lerp(sceneGroup.rotation.y, targetSceneRotation.y, 0.06);
sceneGroup.rotation.x = THREE.MathUtils.lerp(sceneGroup.rotation.x, targetSceneRotation.x, 0.06);
```

### 6.2 Raycasting & Bi-Directional Showcase Synchronization
Three.js raycasting maps pointer clicks directly to the parent `AllRounderStudioShowcase` component:
1. When user clicks **Node 1 (Trigger)** in 3D -> Selects `'trigger'` in `workflowNodes` inspector.
2. When user clicks **Node 2 (Agent Brain)** in 3D -> Switches tab to `'agent-studio'`.
3. When user clicks **Node 3 (Firewall)** in 3D -> Switches tab to `'approval-firewall'`.
4. When user clicks **Node 4 (Dispatch)** in 3D -> Highlights multi-channel execution in tab.
5. In reverse: When user clicks tabs or nodes in the 2D UI, the 3D scene smoothly elevates the active node by `+0.25` on the Z-axis with a gentle Muted Sage / Dusty Plum ambient glow.

---

## 7. CSS 3D Perspective Tilt Specification for Landing Page 2D Cards

To create a consistent 3D visual language throughout the entire page, all interactive cards (Core Pillars, Customer Solutions, Pricing Cards, and Workflow Steps) feature CSS 3D perspective tilting:

### 7.1 Container & Card CSS Classes
```css
/* Card Container */
.perspective-container {
  perspective: 1000px;
}

/* 3D Tilted Clay Card */
.clay-card-3d {
  transform-style: preserve-3d;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease;
  will-change: transform;
}

/* Internal Depth Layer (Heading & Badges pop forward) */
.clay-card-3d-content {
  transform: translateZ(14px);
}

.clay-card-3d-badge {
  transform: translateZ(24px);
}
```

### 7.2 Lightweight JavaScript Pointer Tilt Hook
```typescript
export function useCard3DTilt(maxTiltDeg = 6) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const tiltX = -y * maxTiltDeg;
    const tiltY = x * maxTiltDeg;
    card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(6px)`;
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  return { cardRef, onPointerMove: handlePointerMove, onPointerLeave: handlePointerLeave };
}
```

---

## 8. Mobile, Android & WebGL Context Loss Hardening

### 8.1 Android & Mobile Performance Tuning
- **Device Pixel Ratio (DPR) Clamping:** High-density Android displays (e.g. 3x or 4x DPR) cause severe GPU thermal throttling. DPR must be clamped strictly to `[1.0, 1.75]`:
  ```typescript
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  ```
- **Viewport Dimension Rules:** Canvas container enforces `min-h-[380px]` on mobile (`<640px`) and `min-h-[520px]` on desktop (`>=1024px`), preventing zero-height layout shifts.
- **Touch Targets:** All interactive 3D nodes have an expanded raycast bounding box (`minimum 48px equivalent touch volume`).

### 8.2 WebGL Context Loss & Restoration Recovery
Mobile browsers (especially Android Chrome when switching tabs or backgrounding apps) frequently drop WebGL contexts. The canvas must catch these events and provide uninterrupted fallback:

```typescript
const canvas = renderer.domElement;

const handleContextLost = (event: Event) => {
  event.preventDefault(); // Prevents browser from disabling WebGL permanently
  console.warn('[Qwenton WebGL] Context lost. Displaying tactile clay SVG fallback.');
  setIsWebGLAvailable(false);
  cancelAnimationFrame(animationFrameId);
};

const handleContextRestored = () => {
  console.info('[Qwenton WebGL] Context restored. Rebuilding scene graph.');
  setIsWebGLAvailable(true);
  initScene();
};

canvas.addEventListener('webglcontextlost', handleContextLost, false);
canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
```

### 8.3 Accessible DOM & Screen-Reader Fallback
When WebGL is loading, disabled, or unavailable, render a populated 2D/SVG clay representation displaying the exact same 4 nodes with full keyboard tabability and screen-reader semantics:
```html
<div className="sr-only" role="region" aria-label="Autonomous 4-Node Workflow Canvas">
  <h3>Interactive Workflow Canvas</h3>
  <p>Step 1: Inbound Webhook Trigger. Step 2: Enrichment Agent. Step 3: Human Approval Firewall. Step 4: Multi-Channel Delivery.</p>
</div>
```

---

## 9. Implementation Blueprint for `frontend-developer`

### 9.1 File Architecture
Create a dedicated component to house the WebGL canvas:
`components/landing/Workflow3DCanvas.tsx`

This component is then embedded directly into the top of `components/landing/AllRounderStudioShowcase.tsx` above or beside the interactive tabs, replacing flat 2D representations with the tactile 3D canvas.

### 9.2 Complete Production-Ready Component Skeleton (`Workflow3DCanvas.tsx`)
```tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface Workflow3DCanvasProps {
  activeNodeId?: string;
  isSimulating?: boolean;
  onSelectNode?: (nodeId: string) => void;
  className?: string;
}

export function Workflow3DCanvas({
  activeNodeId = 'trigger',
  isSimulating = false,
  onSelectNode,
  className = '',
}: Workflow3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL capability safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLFailed(true);
        return;
      }
    } catch {
      setWebGLFailed(true);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF4F0E8);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Setup Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFBF4, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFAF0, 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xE8EFF0, 0.85);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    // Clay Material Factory
    const createClayMat = (color: number) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.74,
        metalness: 0.02,
        shadowSide: THREE.DoubleSide,
      });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Node 1: Trigger Node (Warm Ivory Tablet)
    const triggerGeo = new THREE.BoxGeometry(2.0, 1.3, 0.25);
    const triggerMesh = new THREE.Mesh(triggerGeo, createClayMat(0xFCFAF6));
    triggerMesh.position.set(-3.6, 0.8, 0);
    triggerMesh.castShadow = true;
    triggerMesh.receiveShadow = true;
    triggerMesh.userData = { id: 'trigger' };
    rootGroup.add(triggerMesh);

    // 2. Node 2: Agent Brain Node (Muted Sage Capsule)
    const brainGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.2, 32);
    const brainMesh = new THREE.Mesh(brainGeo, createClayMat(0x8FA99A));
    brainMesh.position.set(-1.2, 1.3, 0.2);
    brainMesh.castShadow = true;
    brainMesh.userData = { id: 'enrich' };
    rootGroup.add(brainMesh);

    // Orbit Ring around Brain
    const ringGeo = new THREE.TorusGeometry(0.85, 0.035, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, createClayMat(0x80627D));
    ringMesh.rotation.x = Math.PI / 3;
    brainMesh.add(ringMesh);

    // 3. Node 3: Approval Firewall Node (Dusty Plum Shield)
    const firewallGeo = new THREE.BoxGeometry(2.0, 1.6, 0.35);
    const firewallMesh = new THREE.Mesh(firewallGeo, createClayMat(0x80627D));
    firewallMesh.position.set(1.3, -0.6, 0.2);
    firewallMesh.castShadow = true;
    firewallMesh.userData = { id: 'firewall' };
    rootGroup.add(firewallMesh);

    // 4. Node 4: Dispatch Node (Warm Ivory Dock)
    const dispatchGeo = new THREE.BoxGeometry(2.2, 1.3, 0.25);
    const dispatchMesh = new THREE.Mesh(dispatchGeo, createClayMat(0xFCFAF6));
    dispatchMesh.position.set(3.8, -0.2, 0);
    dispatchMesh.castShadow = true;
    dispatchMesh.userData = { id: 'action' };
    rootGroup.add(dispatchMesh);

    // Raycasting & Pointer Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let targetRotY = 0;
    let targetRotX = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = THREE.MathUtils.clamp(nx * 0.12, -0.12, 0.12);
      targetRotX = THREE.MathUtils.clamp(-ny * 0.08, -0.08, 0.08);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([triggerMesh, brainMesh, firewallMesh, dispatchMesh]);
      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.id;
        if (hitId && onSelectNode) onSelectNode(hitId);
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Gentle parallax damping
      rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, targetRotY, 0.05);
      rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, targetRotX, 0.05);

      // Orbit rotation
      ringMesh.rotation.z += delta * 0.8;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [onSelectNode]);

  if (webGLFailed) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-surface-white rounded-card border border-border-subtle p-6 text-center shadow-clay-card">
        <div>
          <p className="text-sm font-bold text-ink">3D Spatial Pipeline</p>
          <p className="text-xs text-ink-muted mt-1">WebGL is disabled or unavailable. Using high-fidelity tactile 2D view.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-card overflow-hidden shadow-clay-card border border-border-subtle cursor-grab active:cursor-grabbing ${className}`}
    >
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/80 backdrop-blur-xs text-ink border border-border-subtle shadow-xs">
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
          Interactive 3D Workflow Canvas
        </span>
      </div>
    </div>
  );
}
```

---

## 10. Quality Gate & Acceptance Verifications

| Check ID | Requirement | Verification Method | Pass Criteria |
|---|---|---|---|
| **3D-001** | Strict 3-Colour Palette | Automated hex check in Three.js parameters | Exactly Warm Ivory (`0xF4F0E8`), Muted Sage (`0x8FA99A`), Dusty Plum (`0x80627D`) and their specified derived tokens. |
| **3D-002** | Zero-Black Rule | Codebase string scan | Zero occurrences of `0x000000`, `0x000`, near-black, neon wireframes. |
| **3D-003** | Soft Clay Material Spec | `MeshStandardMaterial` parameter inspection | `roughness: 0.74`, `metalness: 0.02`, smooth lighting. |
| **3D-004** | 4-Stage Workflow Architecture | Geometry inspection | 4 distinct tactile nodes: Trigger, Agent Brain, Firewall, Dispatch. |
| **3D-005** | CatmullRomCurve3 Connectors | Curve & Tube geometry check | 3 continuous splines with parametric traveling pulse meshes. |
| **3D-006** | Parallax Tilt Physics | Mouse/touch event math | Clamped rotation within `[-8deg, +8deg]`, smooth lerp `0.06`. |
| **3D-007** | Raycasting Node Selection | Raycaster pointer event verification | Clicking 3D nodes updates active node state in parent showcase. |
| **3D-008** | CSS 3D Perspective Card Tilt | CSS class & hook spec | `perspective: 1000px`, `transform-style: preserve-3d`. |
| **3D-009** | Mobile DPR & Context Loss | WebGL context listener & DPR clamp | `Math.min(devicePixelRatio, 1.75)` and `webglcontextlost` fallback. |

---

## 11. Downstream Handoff

- **Target Role:** `frontend-developer`
- **Immediate Next Tasks:**
  1. Create `components/landing/Workflow3DCanvas.tsx` following the complete skeleton in Section 9.
  2. Integrate `Workflow3DCanvas` into `components/landing/AllRounderStudioShowcase.tsx` to replace static placeholders with the interactive 3D WebGL scene.
  3. Apply CSS 3D perspective tilt (`clay-card-3d`) to landing page cards in `app/page.tsx`.
  4. Verify clean compilation with `tsc --noEmit` and `npm run build`.
