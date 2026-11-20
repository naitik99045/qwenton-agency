'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface Workflow3DCanvasProps {
  activeNodeId?: string;
  isSimulating?: boolean;
  onNodeSelect?: (nodeId: string) => void;
  onSelectNode?: (nodeId: string) => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// STRICT 3-COLOUR THREE.JS PALETTE (Blueprint Section 02 & Zero-Black Rule)
// -----------------------------------------------------------------------------
const THREE_PALETTE = {
  ivory: {
    canvas: 0xF4F0E8,      // Scene background clearColor
    card: 0xFCFAF6,        // Raised clay tablets, pristine matte surface
    panel: 0xFAF7F2,       // Sub-panel modules & containers
    well: 0xEDE8DE,        // Recessed wells & connector sockets
    border: 0xE7E1D7,      // Soft clay hairline bevels & node boundaries
  },
  sage: {
    brand: 0x8FA99A,       // Agent Brain node body, pulse chips, connectors
    accent: 0x3A5245,      // Dark Sage text/icons, verified pulse core (WCAG AAA)
    chip: 0xEAF0EC,        // Soft Sage ambient base, active socket halos
    deep: 0x587363,        // Secondary buttons, active spline highlights
    hover: 0x7E9A8B,       // Interactive node hover highlight
  },
  plum: {
    brand: 0x80627D,       // Dusty Plum Firewall Shield, focal CTAs
    typography: 0x3C2A3A,  // Darkest Plum node headings & metadata (WCAG AAA)
    cta: 0x5E445B,         // Deep Plum high-contrast security gate borders
    tint: 0xF5EFF4,        // Ultra-soft plum aura for pending approval state
    shadow: 0x3C2A3A,      // Directional shadow tint (zero black)
  },
} as const;

export function Workflow3DCanvas({
  activeNodeId = 'trigger',
  isSimulating = false,
  onNodeSelect,
  onSelectNode,
  className = '',
}: Workflow3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState<boolean>(false);
  const activeNodeRef = useRef<string>(activeNodeId);
  const isSimulatingRef = useRef<boolean>(isSimulating);

  // Keep refs synchronized without recreating the scene
  useEffect(() => {
    activeNodeRef.current = activeNodeId;
  }, [activeNodeId]);

  useEffect(() => {
    isSimulatingRef.current = isSimulating;
  }, [isSimulating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Safe WebGL Support Check
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

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    // 2. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(THREE_PALETTE.ivory.canvas);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 7.5);

    // 3. Renderer with Mobile DPR Clamping
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebGLFailed(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Three-Point Diffused Clay Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xFFFBF4, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFAF0, 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xE8EFF0, 0.85);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    const plumRim = new THREE.PointLight(THREE_PALETTE.plum.brand, 1.2, 8);
    plumRim.position.set(1.4, 0.5, 2.5);
    scene.add(plumRim);

    // 5. Soft Claymorphic Material Factory (roughness: 0.74, metalness: 0.02, clearcoat: 0.10)
    const createClayMaterial = (color: number) =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.74,
        metalness: 0.02,
        clearcoat: 0.10,
        clearcoatRoughness: 0.30,
        shadowSide: THREE.DoubleSide,
      });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Interactive clickable node meshes registry
    const clickableNodes: THREE.Mesh[] = [];

    // -------------------------------------------------------------------------
    // NODE 0: WEBHOOK TRIGGER (Warm Ivory Clay Tablet + Sage Pulse Beacon)
    // -------------------------------------------------------------------------
    const triggerGroup = new THREE.Group();
    triggerGroup.position.set(-3.6, 0.8, 0);
    rootGroup.add(triggerGroup);

    const triggerGeo = new THREE.BoxGeometry(2.0, 1.3, 0.28);
    const triggerMesh = new THREE.Mesh(triggerGeo, createClayMaterial(THREE_PALETTE.ivory.card));
    triggerMesh.castShadow = true;
    triggerMesh.receiveShadow = true;
    triggerMesh.userData = { id: 'trigger', defaultZ: 0 };
    triggerGroup.add(triggerMesh);
    clickableNodes.push(triggerMesh);

    // Sage circular pulse beacon on tablet
    const beaconGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.12, 24);
    const beaconMesh = new THREE.Mesh(beaconGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    beaconMesh.position.set(0, 0, 0.18);
    beaconMesh.rotation.x = Math.PI / 2;
    beaconMesh.castShadow = true;
    triggerGroup.add(beaconMesh);

    const beaconCoreGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const beaconCoreMesh = new THREE.Mesh(beaconCoreGeo, createClayMaterial(THREE_PALETTE.sage.accent));
    beaconCoreMesh.position.set(0, 0, 0.26);
    triggerGroup.add(beaconCoreMesh);

    // -------------------------------------------------------------------------
    // NODE 1: AGENT BRAIN NODE (Tactile Sage Rounded Cylinder + Orbiting Plum Ring)
    // -------------------------------------------------------------------------
    const brainGroup = new THREE.Group();
    brainGroup.position.set(-1.2, 1.3, 0.2);
    rootGroup.add(brainGroup);

    const brainCylGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.1, 32);
    const brainMesh = new THREE.Mesh(brainCylGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    brainMesh.castShadow = true;
    brainMesh.receiveShadow = true;
    brainMesh.userData = { id: 'enrich', defaultZ: 0.2 };
    brainGroup.add(brainMesh);
    clickableNodes.push(brainMesh);

    // Spherical caps for rounded capsule feel
    const capGeo = new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topCap = new THREE.Mesh(capGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    topCap.position.set(0, 0.55, 0);
    topCap.castShadow = true;
    brainGroup.add(topCap);

    const bottomCap = new THREE.Mesh(capGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    bottomCap.position.set(0, -0.55, 0);
    bottomCap.rotation.x = Math.PI;
    bottomCap.castShadow = true;
    brainGroup.add(bottomCap);

    // Orbiting Dusty Plum Gimbal Ring
    const ringGeo = new THREE.TorusGeometry(0.88, 0.038, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, createClayMaterial(THREE_PALETTE.plum.brand));
    ringMesh.rotation.x = Math.PI / 3;
    brainGroup.add(ringMesh);

    // Micro-spheres representing sub-agent threads
    const orbiter1Geo = new THREE.SphereGeometry(0.08, 16, 16);
    const orbiter1Mesh = new THREE.Mesh(orbiter1Geo, createClayMaterial(THREE_PALETTE.ivory.card));
    brainGroup.add(orbiter1Mesh);

    const orbiter2Geo = new THREE.SphereGeometry(0.07, 16, 16);
    const orbiter2Mesh = new THREE.Mesh(orbiter2Geo, createClayMaterial(THREE_PALETTE.plum.cta));
    brainGroup.add(orbiter2Mesh);

    // -------------------------------------------------------------------------
    // NODE 2: HUMAN APPROVAL FIREWALL (Dusty Plum Security Shield Tablet)
    // -------------------------------------------------------------------------
    const firewallGroup = new THREE.Group();
    firewallGroup.position.set(1.3, -0.6, 0.2);
    rootGroup.add(firewallGroup);

    // Beveled shield body
    const firewallGeo = new THREE.BoxGeometry(2.0, 1.6, 0.35);
    const firewallMesh = new THREE.Mesh(firewallGeo, createClayMaterial(THREE_PALETTE.plum.brand));
    firewallMesh.castShadow = true;
    firewallMesh.receiveShadow = true;
    firewallMesh.userData = { id: 'firewall', defaultZ: 0.2 };
    firewallGroup.add(firewallMesh);
    clickableNodes.push(firewallMesh);

    // Deep Plum Security Border Frame
    const borderGeo = new THREE.BoxGeometry(2.14, 1.74, 0.12);
    const borderMesh = new THREE.Mesh(borderGeo, createClayMaterial(THREE_PALETTE.plum.cta));
    borderMesh.position.set(0, 0, -0.16);
    firewallGroup.add(borderMesh);

    // Embedded Central Status Gem (Verification Checkpoint)
    const gemGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.14, 16);
    const gemMesh = new THREE.Mesh(gemGeo, createClayMaterial(THREE_PALETTE.sage.accent));
    gemMesh.rotation.x = Math.PI / 2;
    gemMesh.position.set(0, 0, 0.22);
    gemMesh.castShadow = true;
    firewallGroup.add(gemMesh);

    // -------------------------------------------------------------------------
    // NODE 3: ENTERPRISE DISPATCH NODE (Warm Ivory Delivery Dock + Dual Sockets)
    // -------------------------------------------------------------------------
    const dispatchGroup = new THREE.Group();
    dispatchGroup.position.set(3.8, -0.2, 0);
    rootGroup.add(dispatchGroup);

    const dispatchGeo = new THREE.BoxGeometry(2.2, 1.3, 0.28);
    const dispatchMesh = new THREE.Mesh(dispatchGeo, createClayMaterial(THREE_PALETTE.ivory.card));
    dispatchMesh.castShadow = true;
    dispatchMesh.receiveShadow = true;
    dispatchMesh.userData = { id: 'action', defaultZ: 0 };
    dispatchGroup.add(dispatchMesh);
    clickableNodes.push(dispatchMesh);

    // Dual Recessed Wells (SendGrid Email & Salesforce CRM Sockets)
    const socketGeo = new THREE.BoxGeometry(0.65, 0.42, 0.08);
    const socket1Mesh = new THREE.Mesh(socketGeo, createClayMaterial(THREE_PALETTE.ivory.well));
    socket1Mesh.position.set(-0.55, 0, 0.16);
    dispatchGroup.add(socket1Mesh);

    const socket2Mesh = new THREE.Mesh(socketGeo, createClayMaterial(THREE_PALETTE.ivory.well));
    socket2Mesh.position.set(0.55, 0, 0.16);
    dispatchGroup.add(socket2Mesh);

    // Verified Status Indicator Beads
    const verifiedBeadGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const bead1 = new THREE.Mesh(verifiedBeadGeo, createClayMaterial(THREE_PALETTE.sage.accent));
    bead1.position.set(-0.55, 0, 0.22);
    dispatchGroup.add(bead1);

    const bead2 = new THREE.Mesh(verifiedBeadGeo, createClayMaterial(THREE_PALETTE.sage.accent));
    bead2.position.set(0.55, 0, 0.22);
    dispatchGroup.add(bead2);

    // -------------------------------------------------------------------------
    // 6. CATMULL-ROM SPLINE DATA CONNECTORS & TRAVELING PULSE BEADS
    // -------------------------------------------------------------------------
    // Spline 1: Trigger -> Agent Brain
    const spline1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.6, 0.8, 0.0),
      new THREE.Vector3(-1.9, 1.1, 0.2),
      new THREE.Vector3(-1.75, 1.3, 0.2),
    ]);

    // Spline 2: Agent Brain -> Approval Firewall
    const spline2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.65, 1.2, 0.2),
      new THREE.Vector3(0.3, 0.4, 0.3),
      new THREE.Vector3(0.5, -0.4, 0.2),
    ]);

    // Spline 3: Approval Firewall -> Dispatch Node
    const spline3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.1, -0.6, 0.2),
      new THREE.Vector3(2.8, -0.4, 0.1),
      new THREE.Vector3(3.0, -0.2, 0.0),
    ]);

    const tubeMat = createClayMaterial(THREE_PALETTE.sage.deep);

    const tubeGeo1 = new THREE.TubeGeometry(spline1, 32, 0.038, 8, false);
    const tubeMesh1 = new THREE.Mesh(tubeGeo1, tubeMat);
    tubeMesh1.castShadow = true;
    rootGroup.add(tubeMesh1);

    const tubeGeo2 = new THREE.TubeGeometry(spline2, 32, 0.038, 8, false);
    const tubeMesh2 = new THREE.Mesh(tubeGeo2, tubeMat);
    tubeMesh2.castShadow = true;
    rootGroup.add(tubeMesh2);

    const tubeGeo3 = new THREE.TubeGeometry(spline3, 32, 0.038, 8, false);
    const tubeMesh3 = new THREE.Mesh(tubeGeo3, tubeMat);
    tubeMesh3.castShadow = true;
    rootGroup.add(tubeMesh3);

    // Animated Traveling Clay Pulse Beads
    const pulseMat1 = createClayMaterial(THREE_PALETTE.sage.brand);
    const pulseMesh1 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), pulseMat1);
    pulseMesh1.castShadow = true;
    rootGroup.add(pulseMesh1);

    const pulseMat2 = createClayMaterial(THREE_PALETTE.ivory.card);
    const pulseMesh2 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), pulseMat2);
    pulseMesh2.castShadow = true;
    rootGroup.add(pulseMesh2);

    const pulseMat3 = createClayMaterial(THREE_PALETTE.plum.brand);
    const pulseMesh3 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), pulseMat3);
    pulseMesh3.castShadow = true;
    rootGroup.add(pulseMesh3);

    // -------------------------------------------------------------------------
    // 7. RAYCASTING, POINTER PARALLAX & TOUCH DRAG PHYSICS
    // -------------------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let targetRotY = 0;
    let targetRotX = 0;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = (e.clientX - prevPointerX) / rect.width;
        const deltaY = (e.clientY - prevPointerY) / rect.height;
        targetRotY = THREE.MathUtils.clamp(targetRotY + deltaX * 0.4, -0.14, 0.14);
        targetRotX = THREE.MathUtils.clamp(targetRotX - deltaY * 0.3, -0.10, 0.10);
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      } else {
        // Clamped gentle parallax (±8 degrees Y, ±5.7 degrees X)
        targetRotY = THREE.MathUtils.clamp(nx * 0.12, -0.14, 0.14);
        targetRotX = THREE.MathUtils.clamp(-ny * 0.08, -0.10, 0.10);
      }

      // Check hover for clickable nodes
      mouse.x = nx;
      mouse.y = ny;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableNodes);
      container.style.cursor = intersects.length > 0 ? 'pointer' : isDragging ? 'grabbing' : 'grab';
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableNodes);

      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.id;
        if (hitId) {
          onNodeSelect?.(hitId);
          onSelectNode?.(hitId);
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('click', handleClick);

    // -------------------------------------------------------------------------
    // 8. RESIZE & INTERSECTION OBSERVER (Pauses when off-screen)
    // -------------------------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // -------------------------------------------------------------------------
    // 9. WEBGL CONTEXT LOSS & RESTORATION HANDLERS
    // -------------------------------------------------------------------------
    const canvas = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebGLFailed(true);
    };
    const handleContextRestored = () => {
      setWebGLFailed(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    // -------------------------------------------------------------------------
    // 10. RENDER LOOP WITH CLAY KINEMATICS & NODE ELEVATION
    // -------------------------------------------------------------------------
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Skip GPU execution when scrolled out of view
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth parallax damping
      rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, targetRotY, 0.06);
      rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, targetRotX, 0.06);

      // Agent Brain gimbal & orbiters motion
      ringMesh.rotation.z += delta * 0.9;
      orbiter1Mesh.position.set(
        Math.cos(elapsed * 1.8) * 0.88,
        Math.sin(elapsed * 1.8) * 0.44,
        Math.sin(elapsed * 1.8) * 0.88
      );
      orbiter2Mesh.position.set(
        Math.cos(elapsed * -1.4) * 0.95,
        Math.sin(elapsed * -1.4) * -0.5,
        Math.sin(elapsed * -1.4) * 0.95
      );

      // Node dynamic elevation based on activeNodeId
      const currentActiveId = activeNodeRef.current;
      const elevatingSpeed = 0.12;

      triggerGroup.position.z = THREE.MathUtils.lerp(
        triggerGroup.position.z,
        currentActiveId === 'trigger' ? 0.35 : 0.0,
        elevatingSpeed
      );
      brainGroup.position.z = THREE.MathUtils.lerp(
        brainGroup.position.z,
        currentActiveId === 'enrich' ? 0.55 : 0.2,
        elevatingSpeed
      );
      firewallGroup.position.z = THREE.MathUtils.lerp(
        firewallGroup.position.z,
        currentActiveId === 'firewall' ? 0.55 : 0.2,
        elevatingSpeed
      );
      dispatchGroup.position.z = THREE.MathUtils.lerp(
        dispatchGroup.position.z,
        currentActiveId === 'action' ? 0.35 : 0.0,
        elevatingSpeed
      );

      // Animated traveling pulses
      const speedMultiplier = isSimulatingRef.current ? 0.75 : 0.35;
      const t1 = (elapsed * speedMultiplier) % 1.0;
      pulseMesh1.position.copy(spline1.getPointAt(t1));

      const t2 = (elapsed * speedMultiplier + 0.33) % 1.0;
      pulseMesh2.position.copy(spline2.getPointAt(t2));

      // Spline 3 pulse halts if waiting at Firewall
      const isFirewallPending = currentActiveId === 'firewall';
      if (isFirewallPending) {
        pulseMesh3.position.copy(spline2.getPointAt(0.96));
        const pulseScale = 1.0 + Math.sin(elapsed * 5.0) * 0.2;
        pulseMesh3.scale.set(pulseScale, pulseScale, pulseScale);
      } else {
        const t3 = (elapsed * speedMultiplier + 0.66) % 1.0;
        pulseMesh3.position.copy(spline3.getPointAt(t3));
        pulseMesh3.scale.set(1, 1, 1);
      }

      // Firewall status gem breathing pulse
      const gemScale = 1.0 + Math.sin(elapsed * 3.0) * 0.08;
      gemMesh.scale.set(gemScale, 1.0, gemScale);

      renderer.render(scene, camera);
    };
    animate();

    // -------------------------------------------------------------------------
    // 11. COMPLETE RESOURCE DISPOSAL ON UNMOUNT
    // -------------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();

      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('click', handleClick);

      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      // Traverse and dispose all scene geometries and materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) {
            obj.geometry.dispose();
          }
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
      }
    };
  }, [onNodeSelect, onSelectNode]);

  // High-Fidelity Tactile 2D Fallback for Non-WebGL Environments
  if (webGLFailed) {
    return (
      <div className={`w-full min-h-[380px] sm:min-h-[440px] flex flex-col items-center justify-center bg-surface-white rounded-card border border-border-subtle p-6 text-center shadow-clay-card ${className}`}>
        <div className="max-w-md">
          <div className="w-12 h-12 rounded-full bg-sage-light border border-sage-border mx-auto flex items-center justify-center text-sage-dark mb-3">
            <span className="font-mono font-bold text-xs">3D</span>
          </div>
          <h4 className="text-sm font-extrabold text-ink">Autonomous 4-Node Spatial Pipeline</h4>
          <p className="text-xs text-ink-muted mt-1 leading-relaxed">
            WebGL acceleration is inactive or unsupported on this display. Standard high-contrast clay controls remain fully active below.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-ink-muted">
            <span className="px-2.5 py-1 rounded-control bg-surface-panel border border-border-subtle">1. Webhook</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-control bg-surface-panel border border-border-subtle">2. Agent Brain</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-control bg-surface-panel border border-border-subtle">3. Firewall</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-control bg-surface-panel border border-border-subtle">4. Dispatch</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-card overflow-hidden shadow-clay-card border border-border-subtle cursor-grab active:cursor-grabbing select-none touch-pan-y transition-all ${className}`}
      aria-label="Autonomous 4-Node 3D Workflow Canvas"
      role="region"
    >
      {/* Top telemetry chip */}
      <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-surface-white/90 backdrop-blur-xs text-ink border border-border-subtle shadow-clay-button-subtle">
          <span className="w-2 h-2 rounded-full bg-sage-deep animate-pulse" />
          Interactive 3D Workflow Canvas
        </span>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 right-3 z-10 pointer-events-none hidden sm:block">
        <span className="text-[11px] font-mono text-ink-muted bg-surface-white/80 px-2.5 py-1 rounded-full border border-border-subtle backdrop-blur-xs">
          Click nodes to inspect • Drag to tilt in 3D
        </span>
      </div>
    </div>
  );
}
