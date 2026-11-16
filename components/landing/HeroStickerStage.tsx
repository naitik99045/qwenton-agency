'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MessageSquare,
  ShieldCheck,
  Send,
  Zap,
  Sparkles,
  CheckCircle2,
  Instagram,
  Coffee,
  Bot,
  Flame,
  ArrowUpRight,
} from 'lucide-react';

interface HeroStickerStageProps {
  activeStage?: number;
  setActiveStage?: (stage: number) => void;
}

export function HeroStickerStage({
  activeStage = 0,
  setActiveStage,
}: HeroStickerStageProps) {
  // Character switch: 'multitask' (leads & DMs) vs 'focus' (deep research)
  const [activeBot, setActiveBot] = useState<'multitask' | 'focus'>('multitask');
  const [stickerReaction, setStickerReaction] = useState<string | null>(null);

  const handleStickerClick = (stageIndex: number, reactionText: string) => {
    if (setActiveStage) setActiveStage(stageIndex);
    setStickerReaction(reactionText);
    setTimeout(() => {
      setStickerReaction((prev) => (prev === reactionText ? null : prev));
    }, 2800);
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#FAF7F2] border border-[#DCD3C5] p-5 sm:p-7 shadow-clay-card overflow-hidden select-none transition-all">
      {/* Subtle organic corner watermark / tag */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DCD3C5]/60 mb-5">
        {/* Left: Playful Bot Persona Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#EBE3D7]/70 border border-[#DCD3C5]">
          <button
            type="button"
            onClick={() => {
              setActiveBot('multitask');
              if (setActiveStage) setActiveStage(0);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeBot === 'multitask'
                ? 'bg-[#202D1E] text-[#F4EFEA] shadow-xs'
                : 'text-[#4A5E44] hover:text-[#202D1E]'
            }`}
          >
            <Zap className="w-3 h-3 text-[#C88018]" />
            <span>Multitask Coworker</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveBot('focus');
              if (setActiveStage) setActiveStage(1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeBot === 'focus'
                ? 'bg-[#202D1E] text-[#F4EFEA] shadow-xs'
                : 'text-[#4A5E44] hover:text-[#202D1E]'
            }`}
          >
            <Coffee className="w-3 h-3 text-[#C88018]" />
            <span>Deep Focus Coworker</span>
          </button>
        </div>

        {/* Right: Live Engine Status Pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#DCD3C5] text-[11px] font-mono font-bold text-[#202D1E]">
          <span className="w-2 h-2 rounded-full bg-[#C88018] animate-pulse" />
          <span>ACTIVE LEAD ENGINE</span>
        </div>
      </div>

      {/* Main Interactive Stage Canvas */}
      <div className="relative min-h-[420px] sm:min-h-[460px] rounded-2xl bg-[#F4EFEA] border border-[#DCD3C5] p-4 sm:p-6 flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle Decorative Botanical Grid Lines (Linen textured) */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#202D1E 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Dynamic Reaction Banner if user clicked a sticker */}
        {stickerReaction && (
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-center animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#202D1E] text-[#F4EFEA] text-xs font-bold shadow-clay-card border border-[#C88018]/50">
              <Sparkles className="w-3.5 h-3.5 text-[#C88018]" />
              <span>{stickerReaction}</span>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            STICKER 1: Real Inbound Comment (Top-Left)
            ---------------------------------------------------- */}
        <div
          onClick={() =>
            handleStickerClick(
              0,
              'Step 1: Real follower commented trigger keyword on Instagram Reel'
            )
          }
          className={`absolute top-4 left-3 sm:left-6 z-20 cursor-pointer max-w-[210px] sm:max-w-[240px] p-3 rounded-2xl bg-white border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
            activeStage === 0
              ? 'border-[#C88018] ring-2 ring-[#C88018]/20 -rotate-2'
              : 'border-[#DCD3C5] -rotate-3 hover:border-[#C88018]'
          }`}
          title="Click to inspect inbound Reel comment"
        >
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-[#C88018] text-white flex items-center justify-center text-[10px] font-black">
                M
              </div>
              <span className="text-[11px] font-bold text-[#202D1E]">@maya_agency</span>
            </div>
            <span className="text-[9px] font-mono font-semibold text-[#4A5E44]">12s ago</span>
          </div>

          <p className="text-[11px] text-[#202D1E] leading-snug font-medium mb-2">
            &ldquo;Loved the breakdown! Send me the{' '}
            <span className="bg-[#C88018]/15 text-[#C88018] px-1 py-0.5 rounded font-black font-mono">
              PLAYBOOK
            </span>{' '}
            guide!&rdquo;
          </p>

          <div className="flex items-center justify-between pt-1.5 border-t border-[#DCD3C5]/60 text-[9px] font-mono text-[#4A5E44]">
            <span className="inline-flex items-center gap-1">
              <Instagram className="w-2.5 h-2.5 text-[#C88018]" />
              <span>Reel #8902</span>
            </span>
            <span className="font-bold text-[#C88018]">KEYWORD DETECTED</span>
          </div>
        </div>

        {/* ----------------------------------------------------
            STICKER 2: Human Approval Stamp Seal (Top-Right)
            ---------------------------------------------------- */}
        <div
          onClick={() =>
            handleStickerClick(
              2,
              'Step 3: Telegram Mobile Firewall — Approved by human operator with 1-tap'
            )
          }
          className={`absolute top-4 right-3 sm:right-6 z-20 cursor-pointer p-3 sm:p-3.5 rounded-2xl bg-white border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
            activeStage === 2
              ? 'border-[#C88018] ring-2 ring-[#C88018]/20 rotate-3'
              : 'border-[#DCD3C5] rotate-4 hover:border-[#C88018]'
          }`}
          title="Click to inspect Human Approval Stamp"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-[#C88018] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-black text-[#202D1E] font-display uppercase tracking-wide">
                Human Verified
              </div>
              <div className="text-[9px] text-[#4A5E44] font-mono">0% Unsupervised Risk</div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#202D1E] text-[#F4EFEA] text-[9px] font-mono font-bold">
            <CheckCircle2 className="w-2.5 h-2.5 text-[#C88018]" />
            <span>APPROVED &bull; SIGNED</span>
          </div>
        </div>

        {/* ----------------------------------------------------
            CENTER: Animated AI Coworker GIF Mascot
            ---------------------------------------------------- */}
        <div className="relative my-6 sm:my-4 flex flex-col items-center justify-center z-10">
          {/* Subtle warm pedestal glow */}
          <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#C88018]/10 blur-2xl pointer-events-none" />

          {/* Animated GIF Container */}
          <div className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-3xl bg-white border-2 border-[#DCD3C5] p-3 shadow-clay-card flex items-center justify-center transition-transform hover:scale-102">
            {activeBot === 'multitask' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/stickers/multitask-agent.gif"
                alt="Qwenton Autonomous Coworker Multitasking"
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/stickers/coding-agent.gif"
                alt="Qwenton Autonomous Focus Agent"
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm"
              />
            )}

            {/* Micro Badge floating on bottom of mascot card */}
            <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-[#202D1E] text-[#F4EFEA] border border-[#C88018]/40 shadow-xs flex items-center gap-1.5 text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C88018] animate-pulse" />
              <span>
                {activeBot === 'multitask' ? 'COWORKER #01 • LEADS' : 'COWORKER #02 • RESEARCH'}
              </span>
            </div>
          </div>

          <div className="text-[11px] font-bold text-[#202D1E] mt-5 flex items-center gap-1.5">
            <span>{activeBot === 'multitask' ? 'Multitask Lead Agent' : 'Focus Research Agent'}</span>
            <span className="text-[#4A5E44] font-normal">&bull; Auto-dispatches on trigger</span>
          </div>
        </div>

        {/* ----------------------------------------------------
            STICKER 3: Autonomous Quality Seal (Bottom-Left)
            ---------------------------------------------------- */}
        <div
          onClick={() =>
            handleStickerClick(
              1,
              'Step 2: AI Coworker analyzes comment context, sentiment, and drafts personalized reply'
            )
          }
          className={`absolute bottom-3 left-3 sm:left-6 z-20 cursor-pointer p-2.5 sm:p-3 rounded-2xl bg-white border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
            activeStage === 1
              ? 'border-[#C88018] ring-2 ring-[#C88018]/20 rotate-2'
              : 'border-[#DCD3C5] rotate-2 hover:border-[#C88018]'
          }`}
          title="Click to inspect AI Triage Engine"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FAF7F2] border border-[#DCD3C5] flex items-center justify-center text-[#202D1E]">
              <Bot className="w-4 h-4 text-[#C88018]" />
            </div>
            <div>
              <div className="text-[10px] font-black text-[#202D1E] font-mono">
                AI TRIAGE ENGINE
              </div>
              <div className="text-[9px] text-[#4A5E44] font-medium">99.8% Intent Precision</div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------
            STICKER 4: DM Direct Delivery Receipt (Bottom-Right)
            ---------------------------------------------------- */}
        <div
          onClick={() =>
            handleStickerClick(
              3,
              'Step 4: Direct Message delivered to user inbox within 1.4s with tracked link'
            )
          }
          className={`absolute bottom-3 right-3 sm:right-6 z-20 cursor-pointer max-w-[210px] sm:max-w-[240px] p-3 rounded-2xl bg-white border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
            activeStage === 3
              ? 'border-[#C88018] ring-2 ring-[#C88018]/20 -rotate-2'
              : 'border-[#DCD3C5] -rotate-3 hover:border-[#C88018]'
          }`}
          title="Click to inspect DM Delivery Receipt"
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-black text-[#202D1E]">
              <Send className="w-2.5 h-2.5 text-[#C88018]" />
              <span>DM Delivered</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-[#C88018]">1.4s latency</span>
          </div>

          <p className="text-[10px] text-[#202D1E] font-medium leading-tight mb-1.5">
            &ldquo;Hey Maya! Here is your private Playbook access link: qwenton.ai/p/8902&rdquo;
          </p>

          <div className="flex items-center justify-between text-[8px] font-mono text-[#4A5E44]">
            <span>Receipt: #TX-9021</span>
            <span className="text-[#C88018] font-bold">VERIFIED DELIVERED ✓</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Telemetry Strip */}
      <div className="mt-4 pt-3 border-t border-[#DCD3C5]/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#4A5E44]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C88018]" />
          <span>Interactive Showcase: Click any sticker or switch persona</span>
        </div>
        <div className="flex items-center gap-3">
          <span>0% AI Slop</span>
          <span>&bull;</span>
          <span>Zero Rotating 3D Objects</span>
          <span>&bull;</span>
          <span className="font-bold text-[#202D1E]">Human Firewall Active</span>
        </div>
      </div>
    </div>
  );
}
