'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ThreeAgentCore({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [activeStage, setActiveStage] = useState<'idle' | 'analyzing' | 'firing'>('idle');

  useEffect(() => {
    // Check WebGL availability safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    // Determine initial dark mode state
    const isDark = document.documentElement.classList.contains('dark');

    // SCENE SETUP
    const scene = new THREE.Scene();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // COLOR SCHEMES ACCORDING TO QWENTON-UI TRI-COLOR CONTRACT
    const getThemeColors = (dark: boolean) => ({
      core: dark ? 0x141817 : 0xe6edea,
      coreWire: dark ? 0x10e599 : 0x059669,
      ring1: dark ? 0x10e599 : 0x059669,
      ring2: dark ? 0x54655f : 0x829a92,
      node: dark ? 0x10e599 : 0x047857,
      lightKey: dark ? 0xffffff : 0xffffff,
      lightFill: dark ? 0x10e599 : 0x10b981,
      ambient: dark ? 0x222a27 : 0xd8e4e0,
    });

    let currentColors = getThemeColors(isDark);

    // 1. LIGHTING
    const ambientLight = new THREE.AmbientLight(currentColors.ambient, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(currentColors.lightKey, 2.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(currentColors.lightFill, 1.4);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    // 2. CENTRAL NEURAL CORE (Autonomous Agent Processing Unit)
    const coreGeometry = new THREE.IcosahedronGeometry(1.85, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: currentColors.core,
      metalness: 0.85,
      roughness: 0.22,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Outer Faceted Wireframe Shell
    const wireGeometry = new THREE.IcosahedronGeometry(1.92, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: currentColors.coreWire,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    coreMesh.add(wireMesh);

    // 3. CONCENTRIC ORBITAL GIMBAL RINGS
    // Ring 1: Tool Execution Firewall Orbit (inner)
    const ring1Geom = new THREE.TorusGeometry(2.8, 0.035, 16, 96);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: currentColors.ring1,
      metalness: 0.6,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI * 0.28;
    ring1.rotation.y = Math.PI * 0.15;
    scene.add(ring1);

    // Ring 2: Social Lead & Meta Webhook Orbit (outer)
    const ring2Geom = new THREE.TorusGeometry(3.6, 0.035, 16, 96);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: currentColors.ring2,
      metalness: 0.5,
      roughness: 0.4,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI * 0.32;
    ring2.rotation.z = Math.PI * 0.2;
    scene.add(ring2);

    // 4. FLOATING SATELLITE DATA NODES (Approval Gate, Meta Webhook, Telegram Channel)
    const satellitesGroup = new THREE.Group();
    scene.add(satellitesGroup);

    const satelliteGeom = new THREE.BoxGeometry(0.32, 0.32, 0.32);
    const satelliteMat = new THREE.MeshStandardMaterial({
      color: currentColors.node,
      metalness: 0.9,
      roughness: 0.2,
    });

    const satellites: THREE.Mesh[] = [];
    const satelliteAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
    const orbitRadius = 3.6;

    satelliteAngles.forEach((angle) => {
      const sat = new THREE.Mesh(satelliteGeom, satelliteMat);
      sat.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * 0.8, Math.sin(angle) * orbitRadius * 0.6);
      satellitesGroup.add(sat);
      satellites.push(sat);
    });

    // POINTER TRACKING & LERP
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.55;
      mouseY = y * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // SCROLL CHOREOGRAPHY
    let scrollProgress = 0;
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // REDUCED MOTION PREFERENCE CHECK
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // THEME OBSERVER: Smooth Dynamic Re-theming
    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains('dark');
      currentColors = getThemeColors(darkNow);
      ambientLight.color.setHex(currentColors.ambient);
      keyLight.color.setHex(currentColors.lightKey);
      fillLight.color.setHex(currentColors.lightFill);
      coreMaterial.color.setHex(currentColors.core);
      wireMaterial.color.setHex(currentColors.coreWire);
      ring1Mat.color.setHex(currentColors.ring1);
      ring2Mat.color.setHex(currentColors.ring2);
      satelliteMat.color.setHex(currentColors.node);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // RENDER ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth pointer damping (lerp)
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      if (!prefersReducedMotion) {
        // Continuous rotation influenced by scroll depth
        const speedMultiplier = 1 + scrollProgress * 1.5;
        coreMesh.rotation.y += 0.35 * delta * speedMultiplier;
        coreMesh.rotation.x += 0.18 * delta;

        ring1.rotation.z += 0.45 * delta * speedMultiplier;
        ring2.rotation.z -= 0.3 * delta * speedMultiplier;

        // Satellite orbital rotation
        satellitesGroup.rotation.y = elapsedTime * 0.35;
        satellites.forEach((sat, i) => {
          sat.rotation.x += delta * 1.2;
          sat.rotation.y += delta * 1.4;
          // Subtle pulsation
          const pulse = 1 + Math.sin(elapsedTime * 2.5 + i) * 0.12;
          sat.scale.set(pulse, pulse, pulse);
        });

        // Scroll Choreography: Dynamic camera zoom and perspective elevation
        camera.position.z = 7.8 - scrollProgress * 1.8;
        camera.position.y = scrollProgress * 0.6;
        camera.lookAt(0, 0, 0);

        // Core tilt influenced by scroll
        coreMesh.rotation.x += (0.18 + scrollProgress * 0.3) * delta;

        // Expand orbital rings with depth on scroll
        const ringScale = 1 + scrollProgress * 0.45;
        ring1.scale.set(ringScale, ringScale, ringScale);
        ring2.scale.set(ringScale, ringScale, ringScale);

        // Satellite orbital vertical wave on scroll
        satellitesGroup.position.y = Math.sin(scrollProgress * Math.PI) * 0.4;

        // Tilt scene towards pointer
        scene.rotation.y = targetX;
        scene.rotation.x = -targetY;
      }

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose resources
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      satelliteGeom.dispose();
      satelliteMat.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    // Elegant SVG tactile fallback scene per qwenton-ui contract
    return (
      <div className={`relative w-full h-[380px] sm:h-[460px] flex items-center justify-center p-6 bg-surface border border-border rounded-hero ${className}`}>
        <svg viewBox="0 0 320 320" className="w-64 h-64 text-primary animate-pulse" aria-hidden="true">
          <circle cx="160" cy="160" r="130" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="160" cy="160" r="95" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="160,70 240,160 160,250 80,160" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="160" cy="160" r="28" className="fill-primary/20" stroke="currentColor" strokeWidth="2" />
          <circle cx="80" cy="160" r="8" className="fill-primary" />
          <circle cx="240" cy="160" r="8" className="fill-primary" />
          <circle cx="160" cy="70" r="8" className="fill-primary" />
        </svg>
        <span className="sr-only">Interactive 3D model of the Qwenton autonomous agent neural core and telemetry firewall rings.</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[400px] sm:h-[480px] lg:h-[520px] select-none flex items-center justify-center overflow-hidden rounded-hero border border-border bg-surface shadow-clay-card group ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Screen reader description per accessible 3D contract */}
      <div className="sr-only">
        Interactive 3D model of the Qwenton autonomous agent neural core, showing rotating telemetry firewall rings, real-time lead engine orbits, and human-in-the-loop nodes.
      </div>

      {/* Floating HUD Telemetry Overlay Badges */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1.5 font-mono text-[10px]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-canvas/90 backdrop-blur-sm border border-border text-ink font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>NEURAL_CORE: ACTIVE</span>
        </div>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-canvas/70 backdrop-blur-sm border border-border text-ink-muted">
          <span>ORBIT_TELEMETRY: 340ms</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none font-mono text-[10px] text-ink-muted bg-canvas/80 px-2.5 py-1 rounded border border-border">
        <span>INTERACTIVE: HOVER TO TILT • SCROLL TO EXPAND</span>
      </div>
    </div>
  );
}
