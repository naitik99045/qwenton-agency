'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Check,
  Edit2,
  Instagram,
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HeroBotTheatreProps {
  activeStage: number;
  setActiveStage: (stage: number) => void;
  className?: string;
}

export function HeroBotTheatre({
  activeStage,
  setActiveStage,
  className = '',
}: HeroBotTheatreProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isApproved, setIsApproved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full rounded-2xl overflow-hidden select-none bg-[#EFECE6] dark:bg-[#1A1D24] border border-border shadow-clay-card ${className}`}
      style={{ minHeight: '560px' }}
    >
      {/* ----------------------------------------------------
          1. PHOTOREALISTIC 3D BOT & WORKSPACE STAGE (refrence.png)
          ---------------------------------------------------- */}
      <div className="relative w-full h-[580px] sm:h-[620px] lg:h-[660px] overflow-hidden flex items-center justify-center">
        {/* Background Desk & 3D Bot Stage Asset */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)`,
          }}
        >
          <Image
            src="/images/hero-bot-stage.webp"
            alt="Qwenton Autonomous AI Coworker Bot on Workspace Desk"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-center pointer-events-none"
          />
        </div>

        {/* Soft Ambient Depth Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* ----------------------------------------------------
          2. SVG CURVED CONNECTOR ARROWS (Matching refrence.png)
          ---------------------------------------------------- */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block"
          viewBox="0 0 800 660"
          fill="none"
        >
          {/* Arrow 1: From Comment Card (top) to Approval Card (middle) */}
          <path
            d="M 520 180 C 580 190, 600 230, 560 260"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-ink/30 dark:text-white/30"
          />
          <polygon
            points="558,264 564,258 555,256"
            fill="currentColor"
            className="text-ink/40 dark:text-white/40"
          />

          {/* Arrow 2: From Approval Card (middle) to Delivered Card (bottom) */}
          <path
            d="M 610 490 C 620 520, 610 540, 610 550"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-ink/30 dark:text-white/30"
          />
          <polygon
            points="610,554 614,546 606,546"
            fill="currentColor"
            className="text-ink/40 dark:text-white/40"
          />
        </svg>

        {/* ----------------------------------------------------
          3. FLOATING INTERACTIVE UI CARDS IN 3D PERSPECTIVE
          ---------------------------------------------------- */}

        {/* CARD 1: INBOUND COMMENT RECEIVED (Top Right) */}
        <div
          onClick={() => setActiveStage(0)}
          className={`absolute top-6 sm:top-8 right-4 sm:right-12 z-20 w-[270px] sm:w-[310px] p-3.5 rounded-2xl bg-[#1C2027]/95 text-white border transition-all duration-300 shadow-xl cursor-pointer backdrop-blur-md ${
            activeStage === 0 || activeStage === 1
              ? 'border-primary ring-2 ring-primary/40 scale-[1.02]'
              : 'border-white/10 hover:border-white/30 opacity-90'
          }`}
          style={{
            transform: `translate3d(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-sans">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 flex items-center justify-center text-white text-[11px] shadow-xs">
                <Instagram className="w-3.5 h-3.5" />
              </span>
              <span className="text-[13px] font-bold">Comment received</span>
            </div>
            <span className="text-[11px] font-mono text-white/50">2m ago</span>
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 shrink-0 border border-white/20">
              {/* User avatar representation */}
              <div className="w-full h-full bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                M
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white">@maya</div>
              <div className="text-xs text-white/90 font-medium truncate">
                Send me the growth guide
              </div>
            </div>
          </div>

          {/* Keyword match indicator */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
            <span className="text-primary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              KEYWORD: &quot;GROWTH&quot;
            </span>
            <span className="text-white/40">TRIGGER_OK</span>
          </div>
        </div>

        {/* CARD 2: HUMAN APPROVAL (Middle Right, pointed to by bot) */}
        <div
          onClick={() => setActiveStage(2)}
          className={`absolute top-[165px] sm:top-[175px] right-2 sm:right-6 z-20 w-[290px] sm:w-[335px] p-4 rounded-2xl bg-[#1C2027]/95 text-white border transition-all duration-300 shadow-2xl cursor-pointer backdrop-blur-md ${
            activeStage === 2
              ? 'border-coral ring-2 ring-coral/40 scale-[1.03]'
              : 'border-white/10 hover:border-white/30 opacity-90'
          }`}
          style={{
            transform: `translate3d(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-sans">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <span className="w-5 h-5 rounded-md bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                <MessageSquare className="w-3.5 h-3.5" />
              </span>
              <span className="text-[13px] font-bold">Reply ready for review</span>
            </div>
            <span className="text-[11px] font-mono text-white/50">1m ago</span>
          </div>

          {/* Drafted message box */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90 leading-relaxed font-sans space-y-1 mb-3">
            <div>Hi @maya! 👋</div>
            <div>
              Here&apos;s the growth guide you asked for:
            </div>
            <div className="text-primary underline font-mono text-[11px]">
              https://qwenton.co/growth-guide
            </div>
            <div className="text-[11px] text-white/70">
              Let me know if you have any questions!
            </div>
          </div>

          {/* Dual Action Controls: Coral Approve Button & Edit Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApprove}
              className="flex-1 py-2 px-3 rounded-full bg-coral hover:bg-coral-hover text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Approve</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveStage(2);
              }}
              className="py-2 px-4 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1 border border-white/15 transition-colors"
            >
              <Edit2 className="w-3 h-3 text-white/70" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* CARD 3: GROWTH GUIDE SENT / DM DELIVERED (Bottom Right) */}
        <div
          onClick={() => setActiveStage(3)}
          className={`absolute bottom-6 sm:bottom-8 right-4 sm:right-10 z-20 w-[280px] sm:w-[325px] p-3.5 rounded-2xl bg-[#1C2027]/95 text-white border transition-all duration-300 shadow-xl cursor-pointer backdrop-blur-md ${
            activeStage === 3 || isApproved
              ? 'border-primary ring-2 ring-primary/40 scale-[1.02]'
              : 'border-white/10 hover:border-white/30 opacity-90'
          }`}
          style={{
            transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-sans">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <span className="w-5 h-5 rounded-md bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                <Send className="w-3.5 h-3.5" />
              </span>
              <span className="text-[13px] font-bold">Growth guide sent</span>
            </div>
            <span className="text-[11px] font-mono text-white/50">Just now</span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-0.5">
            <div className="space-y-1.5 flex-1">
              <div className="text-xs text-white/90 font-medium">
                DM delivered to @maya
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold border border-primary/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>Human approved</span>
              </div>
            </div>

            {/* Thumbnail booklet cover */}
            <div className="w-12 h-16 rounded-md bg-gradient-to-br from-emerald-400 to-teal-700 p-1 flex flex-col justify-between text-white shrink-0 shadow-md border border-white/20">
              <div className="text-[8px] font-bold uppercase tracking-wider opacity-90">
                Growth
              </div>
              <div className="text-[7px] font-mono opacity-70">
                GUIDE v2
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader description for accessibility */}
      <div className="sr-only">
        Interactive 3D product theatre showing the Qwenton AI bot on an office desk, receiving an Instagram lead comment from @maya, pausing at the human approval gate, and delivering the approved direct message.
      </div>
    </div>
  );
}
