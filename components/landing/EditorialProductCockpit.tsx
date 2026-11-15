'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Check,
  Edit2,
  Instagram,
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  Bot,
  Zap,
} from 'lucide-react';
import { TactileSticker } from '@/components/landing/TactileSticker';

interface EditorialProductCockpitProps {
  activeStage: number;
  setActiveStage: (stage: number) => void;
  className?: string;
}

export function EditorialProductCockpit({
  activeStage,
  setActiveStage,
  className = '',
}: EditorialProductCockpitProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isApproved, setIsApproved] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Mouse parallax tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsApproved(true);
    setActiveStage(3); // Advance to Stage 4 (DM Delivered)
  };

  // Three.js 3D Central Autonomous Coworker Node (Pure Tri-Color: Pine, Mint, Alabaster)
  useEffect(() => {
    const canvasContainer = canvasRef.current;
    if (!canvasContainer) return;

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

    const scene = new THREE.Scene();
    const width = canvasContainer.clientWidth || 440;
    const height = canvasContainer.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    canvasContainer.appendChild(renderer.domElement);

    // 3-Color Materials: Pine (#163A29), Mint (#12E896), Alabaster (#F6F3EB) - Zero Black
    const pineColor = 0x163a29;
    const mintColor = 0x12e896;
    const alabasterColor = 0xf6f3eb;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfaf8f3, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(mintColor, 1.2);
    fillLight.position.set(-4, -2, -2);
    scene.add(fillLight);

    // Central Autonomous Coworker Core
    const coreGeom = new THREE.IcosahedronGeometry(1.65, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: pineColor,
      roughness: 0.25,
      metalness: 0.8,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    // Wireframe Outer Cage in Signal Mint
    const wireGeom = new THREE.IcosahedronGeometry(1.72, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: mintColor,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    coreMesh.add(wireMesh);

    // Orbital Gimbal Rings in Signal Mint & Alabaster
    const ring1Geom = new THREE.TorusGeometry(2.5, 0.035, 16, 80);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: mintColor,
      roughness: 0.3,
      metalness: 0.6,
      transparent: true,
      opacity: 0.9,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI * 0.32;
    ring1.rotation.y = Math.PI * 0.18;
    scene.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(3.2, 0.03, 16, 80);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: pineColor,
      roughness: 0.4,
      metalness: 0.5,
      transparent: true,
      opacity: 0.7,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI * 0.28;
    ring2.rotation.z = Math.PI * 0.22;
    scene.add(ring2);

    // Floating Data Node Satellites
    const satGroup = new THREE.Group();
    scene.add(satGroup);

    const satGeom = new THREE.BoxGeometry(0.28, 0.28, 0.28);
    const satMat = new THREE.MeshStandardMaterial({
      color: mintColor,
      roughness: 0.2,
      metalness: 0.85,
    });

    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3;
      const sat = new THREE.Mesh(satGeom, satMat);
      sat.position.set(Math.cos(angle) * 3.1, Math.sin(angle) * 0.6, Math.sin(angle) * 2.2);
      satGroup.add(sat);
    }

    // Animation & Resize Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const handleResize = () => {
      if (!canvasContainer) return;
      const w = canvasContainer.clientWidth;
      const h = canvasContainer.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        coreMesh.rotation.y += delta * 0.4;
        coreMesh.rotation.x += delta * 0.2;
        ring1.rotation.z += delta * 0.45;
        ring2.rotation.z -= delta * 0.35;
        satGroup.rotation.y = elapsed * 0.35;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (canvasContainer.contains(renderer.domElement)) {
        canvasContainer.removeChild(renderer.domElement);
      }
      coreGeom.dispose();
      coreMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      satGeom.dispose();
      satMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full rounded-hero overflow-hidden select-none bg-surface border-2 border-border shadow-clay-card ${className}`}
      style={{ minHeight: '600px' }}
    >
      {/* ----------------------------------------------------
          1. 3D WEBGL AUTONOMOUS AGENT CORE (Center Stage)
          ---------------------------------------------------- */}
      <div className="relative w-full h-[620px] sm:h-[660px] overflow-hidden flex items-center justify-center bg-surface-panel/40">
        {/* 3D WebGL Canvas Layer */}
        <div
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center opacity-85 transition-transform duration-200"
          style={{
            transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)`,
          }}
        />

        {/* ----------------------------------------------------
            2. TACTILE STICKERS MATCHING THE THEME (Attached to Cockpit)
            ---------------------------------------------------- */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
          {/* Animated Coding Bot GIF Sticker */}
          <TactileSticker variant="animated-bot" rotation={-2} scrollReactive={true} />
        </div>

        <div className="absolute bottom-4 left-4 z-20 hidden sm:block">
          {/* Autonomous Engineering Spec Seal Badge */}
          <TactileSticker variant="seal" rotation={2} scrollReactive={true} />
        </div>

        {/* ----------------------------------------------------
            3. SVG CURVED CONNECTOR ARROWS IN PINE & MINT
            ---------------------------------------------------- */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block"
          viewBox="0 0 800 660"
          fill="none"
        >
          {/* Arrow 1: From Comment Card to Approval Card */}
          <path
            d="M 540 170 C 600 180, 610 220, 570 250"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-pine/40 dark:text-mint/40"
          />
          <polygon
            points="568,254 574,248 565,246"
            fill="currentColor"
            className="text-pine/60 dark:text-mint/60"
          />

          {/* Arrow 2: From Approval Card to Delivered Card */}
          <path
            d="M 610 470 C 620 500, 610 520, 600 535"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-pine/40 dark:text-mint/40"
          />
          <polygon
            points="600,539 604,531 596,531"
            fill="currentColor"
            className="text-pine/60 dark:text-mint/60"
          />
        </svg>

        {/* ----------------------------------------------------
            4. FLOATING INTERACTIVE UI CARDS IN 3D PERSPECTIVE
            Built in Deep Forest Pine (#163A29) & Mint (#12E896) — ZERO BLACK!
            ---------------------------------------------------- */}

        {/* CARD 1: INBOUND COMMENT RECEIVED (Top Right) */}
        <div
          onClick={() => setActiveStage(0)}
          className={`absolute top-6 sm:top-8 right-3 sm:right-8 z-20 w-[270px] sm:w-[315px] p-4 rounded-card bg-pine text-alabaster border transition-all duration-300 shadow-xl cursor-pointer backdrop-blur-md ${
            activeStage === 0 || activeStage === 1
              ? 'border-primary ring-2 ring-primary/40 scale-[1.02]'
              : 'border-border-subtle hover:border-primary/50 opacity-95'
          }`}
          style={{
            transform: `translate3d(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between text-xs text-alabaster/70 mb-2 font-sans">
            <div className="flex items-center gap-1.5 font-semibold text-alabaster">
              <span className="w-5 h-5 rounded-md bg-primary/20 text-primary flex items-center justify-center text-xs font-bold border border-primary/30">
                <Instagram className="w-3.5 h-3.5" />
              </span>
              <span className="text-[13px] font-extrabold text-alabaster">Comment received</span>
            </div>
            <span className="text-[11px] font-mono text-alabaster/60">2m ago</span>
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 text-primary shrink-0 border border-primary/30 flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-primary">@maya</div>
              <div className="text-xs text-alabaster font-medium truncate">
                Send me the growth guide
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-alabaster/15 flex items-center justify-between text-[10px] font-mono">
            <span className="text-primary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              KEYWORD: &quot;GROWTH&quot;
            </span>
            <span className="text-alabaster/60 font-semibold">TRIGGER_MATCH</span>
          </div>
        </div>

        {/* CARD 2: HUMAN APPROVAL (Middle Right, pointed to by bot) */}
        <div
          onClick={() => setActiveStage(2)}
          className={`absolute top-[170px] sm:top-[185px] right-2 sm:right-6 z-20 w-[290px] sm:w-[340px] p-4 rounded-card bg-pine text-alabaster border transition-all duration-300 shadow-2xl cursor-pointer backdrop-blur-md ${
            activeStage === 2
              ? 'border-coral ring-2 ring-coral/40 scale-[1.03]'
              : 'border-border-subtle hover:border-coral/50 opacity-95'
          }`}
          style={{
            transform: `translate3d(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between text-xs text-alabaster/70 mb-2 font-sans">
            <div className="flex items-center gap-1.5 font-semibold text-alabaster">
              <span className="w-5 h-5 rounded-md bg-coral/20 text-coral flex items-center justify-center border border-coral/30">
                <MessageSquare className="w-3.5 h-3.5" />
              </span>
              <span className="text-[13px] font-extrabold text-alabaster">Reply ready for review</span>
            </div>
            <span className="text-[11px] font-mono text-alabaster/60">1m ago</span>
          </div>

          {/* Drafted message box */}
          <div className="p-3 rounded-xl bg-alabaster/10 border border-alabaster/15 text-xs text-alabaster leading-relaxed font-sans space-y-1 mb-3">
            <div>Hi @maya! 👋</div>
            <div>Here&apos;s the growth guide you asked for:</div>
            <div className="text-primary underline font-mono text-[11px] font-bold">
              https://qwenton.co/growth-guide
            </div>
            <div className="text-[11px] text-alabaster/70">
              Let me know if you have any questions!
            </div>
          </div>

          {/* Action Controls: Coral Approve Button & Edit Button (Zero Black - Deep Pine text) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApprove}
              className="flex-1 py-2 px-3 rounded-full bg-coral hover:bg-coral-hover text-alabaster font-extrabold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md border-0"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Approve & Send</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveStage(2);
              }}
              className="py-2 px-4 rounded-full bg-alabaster/15 hover:bg-alabaster/25 text-alabaster text-xs font-semibold flex items-center gap-1 border border-alabaster/20 transition-colors"
            >
              <Edit2 className="w-3 h-3 text-alabaster/80" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* CARD 3: GROWTH GUIDE SENT / DM DELIVERED (Bottom Right) */}
        <div
          onClick={() => setActiveStage(3)}
          className={`absolute bottom-6 sm:bottom-8 right-3 sm:right-8 z-20 w-[280px] sm:w-[330px] p-3.5 rounded-card bg-pine text-alabaster border transition-all duration-300 shadow-xl cursor-pointer backdrop-blur-md ${
            activeStage === 3 || isApproved
              ? 'border-primary ring-2 ring-primary/40 scale-[1.02]'
              : 'border-border-subtle hover:border-primary/50 opacity-95'
          }`}
          style={{
            transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between text-xs text-alabaster/70 mb-2 font-sans">
            <div className="flex items-center gap-1.5 font-semibold text-alabaster">
              <span className="w-5 h-5 rounded-md bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                <Send className="w-3.5 h-3.5" />
              </span>
              <span className="text-[13px] font-extrabold text-alabaster">Growth guide sent</span>
            </div>
            <span className="text-[11px] font-mono text-alabaster/60">Just now</span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-0.5">
            <div className="space-y-1.5 flex-1">
              <div className="text-xs text-alabaster font-medium">
                DM delivered to @maya
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold border border-primary/40">
                <CheckCircle2 className="w-3 h-3" />
                <span>Human approved</span>
              </div>
            </div>

            <div className="w-12 h-16 rounded-md bg-pine-light p-1.5 flex flex-col justify-between text-alabaster shrink-0 shadow-sm border border-primary/30">
              <div className="text-[8px] font-bold uppercase tracking-wider text-primary">
                Growth
              </div>
              <div className="text-[7px] font-mono text-alabaster/80">
                GUIDE v2
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader text for accessibility */}
      <div className="sr-only">
        Interactive 3D product cockpit and workflow engine displaying real-time Instagram lead capture, human approval gate, and direct message delivery in pure tri-color architecture.
      </div>
    </div>
  );
}
