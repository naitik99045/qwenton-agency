'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  TrendingUp,
  HelpCircle,
  Search,
  ShieldCheck,
  Cpu,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// STRICT 3-COLOUR THREE.JS PALETTE (Zero Black / Zero Neon Rule)
// -----------------------------------------------------------------------------
const THREE_PALETTE = {
  ivory: {
    canvas: 0xF4F0E8,      // Scene clearColor
    card: 0xFCFAF6,        // Raised matte clay tablet
    panel: 0xFAF7F2,       // Sub-panel containers
    well: 0xEDE8DE,        // Recessed well sockets
    border: 0xDED8CD,      // Subtle clay hairline bevels
    pure: 0xFFFFFF,        // Pure white highlights
  },
  sage: {
    brand: 0x8FA99A,       // Primary Sage accent & Agent Brain
    accent: 0x3A5245,      // Dark Sage high-contrast core & verified badges
    chip: 0xEAF0EC,        // Soft Sage tint
    deep: 0x587363,        // Deep Sage secondary bevels
    hover: 0x7E9A8B,       // Interactive node hover highlight
  },
  plum: {
    brand: 0x80627D,       // Dusty Plum brand primary & firewall
    typography: 0x3C2A3A,  // Darkest Plum typography & shadow tint
    cta: 0x5E445B,         // Deep Plum emphasis
    tint: 0xF5EFF4,        // Ultra-soft plum aura
    shadow: 0x3C2A3A,      // Directional shadow tint (zero black)
  },
} as const;

export type AgentSatelliteId = 'core' | 'sales' | 'support' | 'research' | 'firewall';

interface AgentTelemetry {
  id: AgentSatelliteId;
  name: string;
  role: string;
  category: string;
  status: string;
  latency: string;
  tokenCost: string;
  gateType: string;
  capabilities: string[];
  description: string;
}

const AGENTS_TELEMETRY: Record<AgentSatelliteId, AgentTelemetry> = {
  core: {
    id: 'core',
    name: 'Autonomous Agent Core',
    role: 'Central Workforce Coordinator',
    category: 'System Orchestrator',
    status: 'Operational • 4 Swarms Active',
    latency: '0.4s',
    tokenCost: '$0.002',
    gateType: 'Continuous State Sync',
    capabilities: ['Dynamic Role Routing', 'Multi-Tenant Isolation', 'Zero Memory Leaks'],
    description:
      'The central orchestrator continuously synchronizes state, monitors execution health, and routes business events across specialized agents.',
  },
  sales: {
    id: 'sales',
    name: 'Lead Qualification Agent',
    role: 'Inbound Enrichment & SDR',
    category: 'Sales Automation',
    status: 'Active • 1.8s avg',
    latency: '1.8s',
    tokenCost: '$0.014',
    gateType: '1 Required Human Approval',
    capabilities: ['Firmographic Enrichment', 'CRM Contact Sync', 'Personalized Email Draft'],
    description:
      'Enriches incoming lead data via webhooks, scores intent, prepares customized outreach, and holds customer emails at the Approval Firewall.',
  },
  support: {
    id: 'support',
    name: 'Support Sentinel Agent',
    role: 'Ticket Triage & Knowledge Search',
    category: 'Customer Support',
    status: 'Active • P1 Monitored',
    latency: '2.2s',
    tokenCost: '$0.019',
    gateType: 'Financial Mutation Gate',
    capabilities: ['Semantic Vector Search', 'Intent Classification', 'Refund Payload Verification'],
    description:
      'Resolves customer inquiries against the verified Knowledge Base and isolates financial mutations (refunds/credits) for manager sign-off.',
  },
  research: {
    id: 'research',
    name: 'Research Swarm Agent',
    role: 'Competitive & Web Intelligence',
    category: 'Market Research',
    status: 'Active • 14 Citations',
    latency: '4.6s',
    tokenCost: '$0.028',
    gateType: 'Cycle & Loop Detection',
    capabilities: ['Parallel Web Synthesizer', 'Changelog Tracking', 'Markdown Brief Generation'],
    description:
      'Dispatches parallel sub-agents to monitor competitors, synthesize market signals, and generate cited intelligence briefs.',
  },
  firewall: {
    id: 'firewall',
    name: 'Approval Firewall Gate',
    role: 'Deterministic Security Checkpoint',
    category: 'Human Governance',
    status: 'Guarded • 100% Control',
    latency: '0.1s',
    tokenCost: '$0.000',
    gateType: 'Server-Side Mutation Lock',
    capabilities: ['Immutable Payload Hash', '1-Tap Human Review', 'Audit Trail Archival'],
    description:
      'Intercepts all external mutations (emails, refunds, database writes) before execution. Guaranteed zero rogue agent actions.',
  },
};

export interface Hero3DExperienceProps {
  className?: string;
  onSelectAgent?: (id: AgentSatelliteId) => void;
}

export function Hero3DExperience({ className = '', onSelectAgent }: Hero3DExperienceProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState<boolean>(false);
  const [activeAgentId, setActiveAgentId] = useState<AgentSatelliteId>('core');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Active ref to sync animation loop without rerunning effect
  const activeAgentRef = useRef<AgentSatelliteId>('core');
  useEffect(() => {
    activeAgentRef.current = activeAgentId;
  }, [activeAgentId]);

  const handleSelectAgent = useCallback(
    (id: AgentSatelliteId) => {
      setActiveAgentId(id);
      if (onSelectAgent) {
        onSelectAgent(id);
      }
    },
    [onSelectAgent]
  );

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Safe WebGL Support Verification
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

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 2. Three.js Scene & Responsive Perspective Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(THREE_PALETTE.ivory.canvas);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 9.2);

    // 3. Renderer with Mobile DPR Clamping (1.75 max for battery/thermal safety)
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

    // 4. Soft Three-Point Clay Lighting Rig (Zero Black Shadows)
    const ambientLight = new THREE.AmbientLight(0xFFFBF4, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFAF0, 2.2);
    keyLight.position.set(6, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xE8EFF0, 0.85);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const plumRim = new THREE.PointLight(THREE_PALETTE.plum.brand, 1.3, 10);
    plumRim.position.set(2, -1, 3.5);
    scene.add(plumRim);

    // 5. Tactile Soft Claymorphic Material Factory (roughness: 0.74, clearcoat: 0.10)
    const createClayMaterial = (color: number, roughness = 0.74, clearcoat = 0.10) =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness,
        metalness: 0.02,
        clearcoat,
        clearcoatRoughness: 0.30,
        shadowSide: THREE.DoubleSide,
      });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Array of interactive meshes for Raycaster
    const interactiveMeshes: THREE.Mesh[] = [];

    // -------------------------------------------------------------------------
    // A. CENTRAL AGENT CORE (Ivory Matte Sphere + Sage Ring + Dual Orbit Gimbals)
    // -------------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    rootGroup.add(coreGroup);

    // Central Sphere (Warm Ivory Clay)
    const coreGeo = new THREE.SphereGeometry(1.0, 36, 36);
    const coreMesh = new THREE.Mesh(coreGeo, createClayMaterial(THREE_PALETTE.ivory.card, 0.70, 0.12));
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    coreMesh.userData = { id: 'core' };
    coreGroup.add(coreMesh);
    interactiveMeshes.push(coreMesh);

    // Sage Equatorial Collar Ring
    const collarGeo = new THREE.TorusGeometry(1.04, 0.065, 20, 48);
    const collarMesh = new THREE.Mesh(collarGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.castShadow = true;
    coreGroup.add(collarMesh);

    // Plum Core Node Gem (Front Facing)
    const gemGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 24);
    const gemMesh = new THREE.Mesh(gemGeo, createClayMaterial(THREE_PALETTE.plum.brand));
    gemMesh.position.set(0, 0, 0.98);
    gemMesh.rotation.x = Math.PI / 2;
    gemMesh.castShadow = true;
    coreGroup.add(gemMesh);

    // Inner glowing core beacon
    const beaconLight = new THREE.PointLight(THREE_PALETTE.sage.brand, 0.8, 3.5);
    beaconLight.position.set(0, 0, 1.1);
    coreGroup.add(beaconLight);

    // Dual Counter-Rotating Gimbal Rings
    const gimbal1Geo = new THREE.TorusGeometry(1.5, 0.045, 18, 64);
    const gimbal1Mesh = new THREE.Mesh(gimbal1Geo, createClayMaterial(THREE_PALETTE.sage.brand));
    gimbal1Mesh.rotation.x = Math.PI / 4;
    gimbal1Mesh.castShadow = true;
    coreGroup.add(gimbal1Mesh);

    const gimbal2Geo = new THREE.TorusGeometry(1.78, 0.038, 18, 64);
    const gimbal2Mesh = new THREE.Mesh(gimbal2Geo, createClayMaterial(THREE_PALETTE.plum.brand));
    gimbal2Mesh.rotation.y = -Math.PI / 3;
    gimbal2Mesh.rotation.x = Math.PI / 6;
    gimbal2Mesh.castShadow = true;
    coreGroup.add(gimbal2Mesh);

    // -------------------------------------------------------------------------
    // B. ORBIT TRACKS (Subtle Clay Hairline Ellipses)
    // -------------------------------------------------------------------------
    const createOrbitLine = (radiusX: number, radiusY: number, tiltZ: number) => {
      const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(64);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const lineMat = new THREE.LineBasicMaterial({
        color: THREE_PALETTE.ivory.border,
        transparent: true,
        opacity: 0.75,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      line.rotation.z = tiltZ;
      return line;
    };

    const orbitTrack1 = createOrbitLine(2.45, 2.35, 0.12);
    const orbitTrack2 = createOrbitLine(3.1, 2.9, -0.16);
    const orbitTrack3 = createOrbitLine(2.75, 2.6, 0.28);
    const orbitTrack4 = createOrbitLine(3.55, 3.3, -0.08);

    rootGroup.add(orbitTrack1);
    rootGroup.add(orbitTrack2);
    rootGroup.add(orbitTrack3);
    rootGroup.add(orbitTrack4);

    // -------------------------------------------------------------------------
    // C. 4 ORBITING AGENT SATELLITES
    // -------------------------------------------------------------------------
    // 1. Sales Agent (Sage Capsule + Ivory Ring)
    const salesGroup = new THREE.Group();
    rootGroup.add(salesGroup);

    const salesBodyGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.65, 24);
    const salesBodyMesh = new THREE.Mesh(salesBodyGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    salesBodyMesh.castShadow = true;
    salesBodyMesh.userData = { id: 'sales' };
    salesGroup.add(salesBodyMesh);
    interactiveMeshes.push(salesBodyMesh);

    const capGeo = new THREE.SphereGeometry(0.32, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const salesTopCap = new THREE.Mesh(capGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    salesTopCap.position.y = 0.325;
    salesGroup.add(salesTopCap);
    const salesBottomCap = new THREE.Mesh(capGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    salesBottomCap.position.y = -0.325;
    salesBottomCap.rotation.x = Math.PI;
    salesGroup.add(salesBottomCap);

    const salesRingGeo = new THREE.TorusGeometry(0.44, 0.04, 16, 32);
    const salesRingMesh = new THREE.Mesh(salesRingGeo, createClayMaterial(THREE_PALETTE.ivory.card));
    salesRingMesh.rotation.x = Math.PI / 2;
    salesGroup.add(salesRingMesh);

    // 2. Support Sentinel Agent (Warm Ivory Disc + Sage Pupil)
    const supportGroup = new THREE.Group();
    rootGroup.add(supportGroup);

    const supportDiscGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.24, 32);
    const supportDiscMesh = new THREE.Mesh(supportDiscGeo, createClayMaterial(THREE_PALETTE.ivory.card));
    supportDiscMesh.castShadow = true;
    supportDiscMesh.userData = { id: 'support' };
    supportGroup.add(supportDiscMesh);
    interactiveMeshes.push(supportDiscMesh);

    const supportPupilGeo = new THREE.SphereGeometry(0.22, 20, 20);
    const supportPupilMesh = new THREE.Mesh(supportPupilGeo, createClayMaterial(THREE_PALETTE.sage.accent));
    supportPupilMesh.position.y = 0.12;
    supportPupilMesh.castShadow = true;
    supportGroup.add(supportPupilMesh);

    const supportRingGeo = new THREE.TorusGeometry(0.58, 0.035, 16, 32);
    const supportRingMesh = new THREE.Mesh(supportRingGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    supportRingMesh.rotation.x = Math.PI / 2;
    supportGroup.add(supportRingMesh);

    // 3. Research Swarm Coordinator (Plum Octahedron / Faceted Prism + Orbiting Mini Beads)
    const researchGroup = new THREE.Group();
    rootGroup.add(researchGroup);

    const researchGeo = new THREE.OctahedronGeometry(0.46, 0);
    const researchMesh = new THREE.Mesh(researchGeo, createClayMaterial(THREE_PALETTE.plum.brand, 0.65, 0.15));
    researchMesh.castShadow = true;
    researchMesh.userData = { id: 'research' };
    researchGroup.add(researchMesh);
    interactiveMeshes.push(researchMesh);

    // 2 Mini satellite beads orbiting the research coordinator
    const miniBeadGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const miniBead1 = new THREE.Mesh(miniBeadGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    const miniBead2 = new THREE.Mesh(miniBeadGeo, createClayMaterial(THREE_PALETTE.ivory.card));
    researchGroup.add(miniBead1);
    researchGroup.add(miniBead2);

    // 4. Approval Firewall Gate (Dusty Plum Octagonal Shield Tablet + Sage Verification Core)
    const firewallGroup = new THREE.Group();
    rootGroup.add(firewallGroup);

    const shieldGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.22, 8);
    const shieldMesh = new THREE.Mesh(shieldGeo, createClayMaterial(THREE_PALETTE.plum.brand, 0.70, 0.15));
    shieldMesh.rotation.y = Math.PI / 8;
    shieldMesh.castShadow = true;
    shieldMesh.userData = { id: 'firewall' };
    firewallGroup.add(shieldMesh);
    interactiveMeshes.push(shieldMesh);

    // Verification Badge Emblem on Shield
    const verifyRingGeo = new THREE.TorusGeometry(0.32, 0.045, 16, 24);
    const verifyRingMesh = new THREE.Mesh(verifyRingGeo, createClayMaterial(THREE_PALETTE.sage.accent));
    verifyRingMesh.position.y = 0.12;
    verifyRingMesh.rotation.x = Math.PI / 2;
    firewallGroup.add(verifyRingMesh);

    const verifyCoreGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const verifyCoreMesh = new THREE.Mesh(verifyCoreGeo, createClayMaterial(THREE_PALETTE.sage.brand));
    verifyCoreMesh.position.y = 0.14;
    firewallGroup.add(verifyCoreMesh);

    // -------------------------------------------------------------------------
    // 6. RAYCASTER & INTERACTION STATE
    // -------------------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    let targetRotX = 0;
    let targetRotY = 0;
    let isPointerDown = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Normalized coordinates (-1 to 1) for raycaster
      mouse.x = (clientX / rect.width) * 2 - 1;
      mouse.y = -(clientY / rect.height) * 2 + 1;

      if (isPointerDown) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;

        targetRotY += deltaX * 0.005;
        targetRotX += deltaY * 0.005;

        // Clamp rotation to safe 8 degree range (-0.14 to +0.14 radians)
        const maxTilt = THREE.MathUtils.degToRad(8);
        targetRotY = THREE.MathUtils.clamp(targetRotY, -maxTilt, maxTilt);
        targetRotX = THREE.MathUtils.clamp(targetRotX, -maxTilt, maxTilt);
      } else {
        // Subtle tilt parallax based on pointer position
        const maxParallax = THREE.MathUtils.degToRad(7);
        targetRotY = mouse.x * maxParallax;
        targetRotX = -mouse.y * maxParallax;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isPointerDown = false;
    };

    const handlePointerLeave = () => {
      isPointerDown = false;
      mouse.x = -999;
      mouse.y = -999;
      targetRotX = 0;
      targetRotY = 0;
      setIsHovered(false);
      container.style.cursor = 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(clickMouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const hitId = hit.userData?.id as AgentSatelliteId;
        if (hitId) {
          handleSelectAgent(hitId);
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('click', handleClick);

    // -------------------------------------------------------------------------
    // 7. RESPONSIVE RESIZE & INTERSECTION OBSERVER (Auto-pause when off-screen)
    // -------------------------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

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
      { threshold: 0.1 }
    );
    observer.observe(container);

    // -------------------------------------------------------------------------
    // 8. WEBGL CONTEXT LOSS & RESTORATION
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
    // 9. ANIMATION & KINEMATICS LOOP
    // -------------------------------------------------------------------------
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Skip GPU render when scrolled out of view
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth parallax damping
      rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, targetRotY, 0.08);
      rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, targetRotX, 0.08);

      // Continuous Core and Gimbal Rotations
      coreMesh.rotation.y += delta * 0.25;
      gimbal1Mesh.rotation.z += delta * 0.75;
      gimbal2Mesh.rotation.z -= delta * 0.55;

      // Raycaster Hover Detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);
      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        setIsHovered(true);
      } else {
        container.style.cursor = isPointerDown ? 'grabbing' : 'grab';
        setIsHovered(false);
      }

      const activeId = activeAgentRef.current;

      // 1. Sales Agent Orbit (Radius: 2.45, Speed: 0.52)
      const salesSpeed = 0.52;
      const salesAngle = elapsed * salesSpeed;
      salesGroup.position.set(
        Math.cos(salesAngle) * 2.45,
        Math.sin(salesAngle) * 0.32,
        Math.sin(salesAngle) * 2.35
      );
      salesGroup.rotation.y += delta * 1.2;
      salesGroup.rotation.z = Math.sin(elapsed * 2) * 0.15;
      const salesTargetScale = activeId === 'sales' ? 1.22 : 1.0;
      salesGroup.scale.lerp(new THREE.Vector3(salesTargetScale, salesTargetScale, salesTargetScale), 0.1);

      // 2. Support Sentinel Agent Orbit (Radius: 3.1, Speed: -0.38)
      const supportSpeed = -0.38;
      const supportAngle = elapsed * supportSpeed + 1.6;
      supportGroup.position.set(
        Math.cos(supportAngle) * 3.1,
        Math.sin(supportAngle * 1.2) * -0.42,
        Math.sin(supportAngle) * 2.9
      );
      supportGroup.rotation.x = Math.PI / 4 + Math.sin(elapsed) * 0.2;
      supportGroup.rotation.y += delta * 0.8;
      const supportTargetScale = activeId === 'support' ? 1.22 : 1.0;
      supportGroup.scale.lerp(new THREE.Vector3(supportTargetScale, supportTargetScale, supportTargetScale), 0.1);

      // 3. Research Swarm Agent Orbit (Radius: 2.75, Speed: 0.44)
      const researchSpeed = 0.44;
      const researchAngle = elapsed * researchSpeed + 3.2;
      researchGroup.position.set(
        Math.cos(researchAngle) * 2.75,
        Math.sin(researchAngle) * 0.55,
        Math.sin(researchAngle) * 2.6
      );
      researchMesh.rotation.x += delta * 0.9;
      researchMesh.rotation.y += delta * 1.1;

      // Mini satellite beads orbiting Research Coordinator
      miniBead1.position.set(Math.cos(elapsed * 3.5) * 0.65, Math.sin(elapsed * 3.5) * 0.3, Math.sin(elapsed * 3.5) * 0.65);
      miniBead2.position.set(Math.cos(elapsed * -2.8) * 0.72, Math.sin(elapsed * -2.8) * -0.35, Math.sin(elapsed * -2.8) * 0.72);

      const researchTargetScale = activeId === 'research' ? 1.25 : 1.0;
      researchGroup.scale.lerp(new THREE.Vector3(researchTargetScale, researchTargetScale, researchTargetScale), 0.1);

      // 4. Approval Firewall Gate Orbit (Radius: 3.55, Speed: -0.26)
      const firewallSpeed = -0.26;
      const firewallAngle = elapsed * firewallSpeed + 4.8;
      firewallGroup.position.set(
        Math.cos(firewallAngle) * 3.55,
        Math.sin(firewallAngle * 0.9) * -0.25,
        Math.sin(firewallAngle) * 3.3
      );
      firewallGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.12;
      firewallGroup.rotation.y += delta * 0.45;
      const firewallTargetScale = activeId === 'firewall' ? 1.25 : 1.0;
      firewallGroup.scale.lerp(new THREE.Vector3(firewallTargetScale, firewallTargetScale, firewallTargetScale), 0.1);

      // Core Highlight Scale
      const coreTargetScale = activeId === 'core' ? 1.06 : 1.0;
      coreGroup.scale.lerp(new THREE.Vector3(coreTargetScale, coreTargetScale, coreTargetScale), 0.08);

      renderer.render(scene, camera);
    };
    animate();

    // -------------------------------------------------------------------------
    // 10. CLEAN RESOURCE DISPOSAL ON UNMOUNT
    // -------------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();

      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('click', handleClick);

      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      // Recursively dispose geometries and materials
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
  }, [handleSelectAgent]);

  const activeTelemetry = AGENTS_TELEMETRY[activeAgentId];

  // High-Fidelity Tactile 2D Fallback for Non-WebGL Devices
  if (webGLFailed) {
    return (
      <div className={`w-full min-h-[460px] flex flex-col items-center justify-center bg-surface-white rounded-card border border-border-subtle p-8 text-center shadow-clay-card ${className}`}>
        <div className="max-w-md">
          <div className="w-14 h-14 rounded-full bg-sage-light border border-sage-border mx-auto flex items-center justify-center text-sage-dark mb-4 shadow-clay-button-subtle">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-ink">
            Qwenton Autonomous Workforce Spatial Mesh
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
            WebGL acceleration is unavailable in this environment. Full interactive multi-agent telemetry and firewall verification remain accessible via the standard controls below.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2 text-left">
            {Object.values(AGENTS_TELEMETRY).map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => handleSelectAgent(agent.id)}
                className={`p-3 rounded-panel border text-xs transition-all min-h-[48px] ${
                  activeAgentId === agent.id
                    ? 'bg-plum-light border-plum-border text-plum-deep font-bold shadow-clay-button-subtle'
                    : 'bg-surface-panel border-border-subtle text-ink-muted hover:text-ink'
                }`}
              >
                <div className="font-bold truncate">{agent.name}</div>
                <div className="text-[10px] text-ink-muted truncate">{agent.role}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-card overflow-hidden shadow-clay-card border border-border-subtle bg-canvas ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-[420px] sm:h-[480px] lg:h-[540px] cursor-grab active:cursor-grabbing select-none touch-pan-y"
        aria-label="Interactive 3D Autonomous Agent Core with Orbiting Department Specialists"
        role="region"
      />

      {/* Top Floating Badge Bar: Agent Orbit Telemetry */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-white/92 backdrop-blur-md border border-border-subtle shadow-clay-button-subtle pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-sage-dark animate-pulse" />
          <span className="text-[11px] sm:text-xs font-mono font-bold text-ink">
            Spatial Mesh: 4 Agents Active
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-white/92 backdrop-blur-md border border-border-subtle text-[11px] font-mono text-ink-muted pointer-events-auto">
          <Sparkles className="w-3 h-3 text-plum" />
          <span>Drag to Rotate • Click Node to Inspect</span>
        </div>
      </div>

      {/* Bottom Floating Interactive HUD Drawer */}
      <div className="p-3 sm:p-5 bg-surface-white border-t border-border-subtle flex flex-col gap-3">
        {/* Department Switcher Tabs (48px Touch Targets for Android/Mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => handleSelectAgent('core')}
            className={`min-h-[48px] px-3 py-2 rounded-control text-xs font-bold transition-all flex items-center justify-center gap-2 border select-none ${
              activeAgentId === 'core'
                ? 'bg-plum text-white border-plum-deep shadow-clay-button'
                : 'bg-surface-panel text-ink hover:bg-surface-inset border-border-subtle'
            }`}
          >
            <Cpu className="w-4 h-4 shrink-0" />
            <span className="truncate">Core Mesh</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectAgent('sales')}
            className={`min-h-[48px] px-3 py-2 rounded-control text-xs font-bold transition-all flex items-center justify-center gap-2 border select-none ${
              activeAgentId === 'sales'
                ? 'bg-sage-dark text-white border-sage-deep shadow-clay-button'
                : 'bg-surface-panel text-ink hover:bg-surface-inset border-border-subtle'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0 text-sage-hover" />
            <span className="truncate">Sales Lead</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectAgent('support')}
            className={`min-h-[48px] px-3 py-2 rounded-control text-xs font-bold transition-all flex items-center justify-center gap-2 border select-none ${
              activeAgentId === 'support'
                ? 'bg-sage-dark text-white border-sage-deep shadow-clay-button'
                : 'bg-surface-panel text-ink hover:bg-surface-inset border-border-subtle'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-sage-hover" />
            <span className="truncate">Support</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectAgent('research')}
            className={`min-h-[48px] px-3 py-2 rounded-control text-xs font-bold transition-all flex items-center justify-center gap-2 border select-none ${
              activeAgentId === 'research'
                ? 'bg-plum-deep text-white border-plum shadow-clay-button'
                : 'bg-surface-panel text-ink hover:bg-surface-inset border-border-subtle'
            }`}
          >
            <Search className="w-4 h-4 shrink-0 text-plum-light" />
            <span className="truncate">Research</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectAgent('firewall')}
            className={`col-span-2 sm:col-span-1 min-h-[48px] px-3 py-2 rounded-control text-xs font-bold transition-all flex items-center justify-center gap-2 border select-none ${
              activeAgentId === 'firewall'
                ? 'bg-plum-deep text-white border-plum shadow-clay-button'
                : 'bg-plum-light text-plum-deep hover:bg-brand-soft border-plum-border font-bold'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-plum" />
            <span className="truncate">Firewall Gate</span>
          </button>
        </div>

        {/* Selected Agent Telemetry Details Card */}
        <div className="p-3.5 sm:p-4 rounded-panel bg-surface-panel border border-border-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-plum uppercase tracking-wider">
                {activeTelemetry.category}
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-sage-light text-sage-dark border border-sage-border">
                {activeTelemetry.status}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-white text-ink-muted border border-border-subtle">
                Latency: {activeTelemetry.latency}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-extrabold text-ink tracking-tight">
              {activeTelemetry.name}
            </h4>

            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed line-clamp-2">
              {activeTelemetry.description}
            </p>

            {/* Capability tags */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {activeTelemetry.capabilities.map((cap, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-surface-white border border-border-subtle text-[11px] font-mono text-ink font-semibold"
                >
                  <CheckCircle2 className="w-3 h-3 text-sage-dark shrink-0" />
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="w-full md:w-auto shrink-0 flex items-center gap-2">
            <a
              href="#workflows"
              className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-control bg-surface-white hover:bg-surface-inset border border-border-subtle text-xs sm:text-sm font-bold text-ink min-h-[48px] shadow-clay-button-subtle transition-colors"
            >
              <span>View Canvas Pipeline</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
