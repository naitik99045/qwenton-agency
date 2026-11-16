'use client';

import React, { useState } from 'react';
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
  Check,
  ArrowRight,
  Smartphone,
  Eye,
} from 'lucide-react';

interface HeroStickerStageProps {
  activeStage?: number;
  setActiveStage?: (stage: number) => void;
  simulatedKeyword?: string;
}

export function HeroStickerStage({
  activeStage = 0,
  setActiveStage,
  simulatedKeyword = 'PLAYBOOK',
}: HeroStickerStageProps) {
  // Character switch: 'multitask' (leads & DMs) vs 'focus' (deep research)
  const [activeBot, setActiveBot] = useState<'multitask' | 'focus'>('multitask');
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [stickerReaction, setStickerReaction] = useState<string | null>(null);

  // Mobile selected tab (0 = Comment, 1 = Triage, 2 = Approval, 3 = Delivery)
  const currentStage = activeStage ?? 0;

  const handleStageSelect = (stageIndex: number, reactionText: string) => {
    if (setActiveStage) setActiveStage(stageIndex);
    setStickerReaction(reactionText);
    setTimeout(() => {
      setStickerReaction((prev) => (prev === reactionText ? null : prev));
    }, 2800);
  };

  const displayKeyword = simulatedKeyword.trim() ? simulatedKeyword.toUpperCase() : 'PLAYBOOK';

  return (
    <div className="relative w-full rounded-3xl bg-[#FAF7F0] border border-[#DDD6C8] p-4 sm:p-7 shadow-clay-card overflow-hidden select-none transition-all">
      {/* ----------------------------------------------------
          TOP BAR: Bot Persona Switcher + Mobile/Desktop Telemetry
          ---------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-[#DDD6C8]/70 mb-4 sm:mb-6">
        {/* Left: Persona Switcher with 48px touch targets for Android */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#EBE5DA] border border-[#DDD6C8] w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setActiveBot('multitask');
              if (setActiveStage) setActiveStage(0);
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-1.5 rounded-full text-xs font-bold transition-all min-h-[44px] sm:min-h-0 ${
              activeBot === 'multitask'
                ? 'bg-[#1C241B] text-[#F4F0E8] shadow-xs'
                : 'text-[#4D5E4A] hover:text-[#1C241B]'
            }`}
            aria-label="Switch to Multitask Lead Coworker"
          >
            <Zap className="w-3.5 h-3.5 text-[#C27329]" />
            <span>Multitask Coworker</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveBot('focus');
              if (setActiveStage) setActiveStage(1);
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-1.5 rounded-full text-xs font-bold transition-all min-h-[44px] sm:min-h-0 ${
              activeBot === 'focus'
                ? 'bg-[#1C241B] text-[#F4F0E8] shadow-xs'
                : 'text-[#4D5E4A] hover:text-[#1C241B]'
            }`}
            aria-label="Switch to Deep Focus Coworker"
          >
            <Coffee className="w-3.5 h-3.5 text-[#C27329]" />
            <span>Deep Focus Coworker</span>
          </button>
        </div>

        {/* Right: Live Meta Webhook Pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#DDD6C8] text-[11px] font-mono font-bold text-[#1C241B]">
          <span className="w-2 h-2 rounded-full bg-[#C27329] animate-pulse" />
          <span>META REEL INGRESS • 280MS</span>
        </div>
      </div>

      {/* ----------------------------------------------------
          MAIN STAGE CANVAS (Matte Chalk Linen & Soft Clay Inset)
          ---------------------------------------------------- */}
      <div className="relative rounded-2xl bg-[#F4F0E8] border border-[#DDD6C8] p-4 sm:p-6 overflow-hidden">
        {/* Subtle Matte Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#1C241B 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Dynamic Interactive Reaction Pill */}
        {stickerReaction && (
          <div className="absolute top-3 inset-x-3 sm:inset-x-8 z-30 flex items-center justify-center animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C241B] text-[#F4F0E8] text-xs font-bold shadow-clay-card border border-[#C27329]/50 text-center">
              <Sparkles className="w-3.5 h-3.5 text-[#C27329] shrink-0" />
              <span className="truncate">{stickerReaction}</span>
            </div>
          </div>
        )}

        {/* ====================================================
            DESKTOP VIEW: TACTILE STICKER CARDS (sm & up)
            ==================================================== */}
        <div className="hidden sm:flex relative min-h-[460px] flex-col items-center justify-center">
          {/* STICKER 1: Real Inbound Comment (Top-Left) */}
          <div
            onClick={() =>
              handleStageSelect(
                0,
                'Step 1: Real follower commented trigger keyword on Instagram Reel'
              )
            }
            className={`absolute top-2 left-2 lg:left-4 z-20 cursor-pointer max-w-[230px] p-3.5 rounded-2xl bg-white border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
              currentStage === 0
                ? 'border-[#C27329] ring-2 ring-[#C27329]/20 -rotate-2'
                : 'border-[#DDD6C8] -rotate-3 hover:border-[#C27329]'
            }`}
            title="Click to inspect inbound Reel comment"
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#C27329] text-white flex items-center justify-center text-[10px] font-black">
                  M
                </div>
                <span className="text-[11px] font-bold text-[#1C241B]">@maya_agency</span>
              </div>
              <span className="text-[9px] font-mono font-semibold text-[#4D5E4A]">12s ago</span>
            </div>

            <p className="text-[11px] text-[#1C241B] leading-snug font-medium mb-2">
              &ldquo;Loved this breakdown! Send me the{' '}
              <span className="bg-[#C27329]/15 text-[#C27329] px-1 py-0.5 rounded font-black font-mono">
                {displayKeyword}
              </span>{' '}
              guide!&rdquo;
            </p>

            <div className="flex items-center justify-between pt-1.5 border-t border-[#DDD6C8]/70 text-[9px] font-mono text-[#4D5E4A]">
              <span className="inline-flex items-center gap-1">
                <Instagram className="w-2.5 h-2.5 text-[#C27329]" />
                <span>Reel #8902</span>
              </span>
              <span className="font-bold text-[#C27329]">KEYWORD MATCH</span>
            </div>
          </div>

          {/* STICKER 2: Human Approval Stamp Seal (Top-Right) */}
          <div
            onClick={() =>
              handleStageSelect(
                2,
                'Step 3: Telegram Mobile Firewall — Approved by human operator with 1-tap'
              )
            }
            className={`absolute top-2 right-2 lg:right-4 z-20 cursor-pointer p-3.5 rounded-2xl bg-white border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
              currentStage === 2
                ? 'border-[#C27329] ring-2 ring-[#C27329]/20 rotate-3'
                : 'border-[#DDD6C8] rotate-3 hover:border-[#C27329]'
            }`}
            title="Click to toggle Human Approval Gate"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#C27329] text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-black text-[#1C241B] font-display uppercase tracking-wide">
                  Human Verified
                </div>
                <div className="text-[9px] text-[#4D5E4A] font-mono">Zero Unsupervised Risk</div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsApproved(!isApproved);
                handleStageSelect(
                  2,
                  isApproved ? 'Firewall Paused: Lead holding for approval' : 'Firewall Approved: Instant delivery dispatched'
                );
              }}
              className={`w-full inline-flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                isApproved
                  ? 'bg-[#1C241B] text-[#F4F0E8]'
                  : 'bg-[#FAF7F0] border border-[#C27329] text-[#C27329]'
              }`}
            >
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#C27329]" />
                <span>{isApproved ? 'STATUS: APPROVED' : 'STATUS: PAUSED'}</span>
              </span>
              <span className="text-[8px] underline">TAP</span>
            </button>
          </div>

          {/* CENTER: Animated AI Coworker Mascot */}
          <div className="relative my-4 flex flex-col items-center justify-center z-10">
            {/* Ambient Velvet Pedestal */}
            <div className="absolute w-48 h-48 rounded-full bg-[#C27329]/10 blur-2xl pointer-events-none" />

            <div className="relative w-44 h-44 lg:w-48 lg:h-48 rounded-3xl bg-white border-2 border-[#DDD6C8] p-3 shadow-clay-card flex items-center justify-center transition-transform hover:scale-102">
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

              {/* Status Pill Badge */}
              <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-[#1C241B] text-[#F4F0E8] border border-[#C27329]/40 shadow-xs flex items-center gap-1.5 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C27329] animate-pulse" />
                <span>
                  {activeBot === 'multitask' ? 'COWORKER #01 • LEADS' : 'COWORKER #02 • RESEARCH'}
                </span>
              </div>
            </div>

            <div className="text-[11px] font-bold text-[#1C241B] mt-5 flex items-center gap-1.5">
              <span>{activeBot === 'multitask' ? 'Multitask Lead Agent' : 'Deep Focus Agent'}</span>
              <span className="text-[#4D5E4A] font-normal">&bull; Autonomous Reel Engine</span>
            </div>
          </div>

          {/* STICKER 3: AI Triage Engine (Bottom-Left) */}
          <div
            onClick={() =>
              handleStageSelect(
                1,
                'Step 2: AI Coworker analyzes comment intent, verifies lead score, and crafts response'
              )
            }
            className={`absolute bottom-2 left-2 lg:left-4 z-20 cursor-pointer p-3 rounded-2xl bg-white border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
              currentStage === 1
                ? 'border-[#C27329] ring-2 ring-[#C27329]/20 rotate-2'
                : 'border-[#DDD6C8] rotate-2 hover:border-[#C27329]'
            }`}
            title="Click to inspect AI Triage Engine"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#FAF7F0] border border-[#DDD6C8] flex items-center justify-center text-[#1C241B]">
                <Bot className="w-4 h-4 text-[#C27329]" />
              </div>
              <div>
                <div className="text-[10px] font-black text-[#1C241B] font-mono">
                  AI TRIAGE ENGINE
                </div>
                <div className="text-[9px] text-[#4D5E4A] font-medium">99.8% Intent Precision</div>
              </div>
            </div>
          </div>

          {/* STICKER 4: DM Direct Delivery Receipt (Bottom-Right) */}
          <div
            onClick={() =>
              handleStageSelect(
                3,
                'Step 4: Direct Message delivered to user inbox within 1.4s with verified tracking link'
              )
            }
            className={`absolute bottom-2 right-2 lg:right-4 z-20 cursor-pointer max-w-[230px] p-3.5 rounded-2xl bg-white border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
              currentStage === 3
                ? 'border-[#C27329] ring-2 ring-[#C27329]/20 -rotate-2'
                : 'border-[#DDD6C8] -rotate-3 hover:border-[#C27329]'
            }`}
            title="Click to inspect DM Delivery Receipt"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-black text-[#1C241B]">
                <Send className="w-2.5 h-2.5 text-[#C27329]" />
                <span>DM Delivered</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-[#C27329]">1.4s latency</span>
            </div>

            <p className="text-[10px] text-[#1C241B] font-medium leading-tight mb-1.5">
              &ldquo;Hey Maya! Here is your private {displayKeyword} access link: qwenton.ai/p/8902&rdquo;
            </p>

            <div className="flex items-center justify-between text-[8px] font-mono text-[#4D5E4A]">
              <span>Receipt: #TX-9021</span>
              <span className="text-[#C27329] font-bold">VERIFIED DELIVERED ✓</span>
            </div>
          </div>
        </div>

        {/* ====================================================
            MOBILE VIEW: ANDROID-SAFE ADAPTIVE SEQUENCER (< 640px)
            Zero Overlapping Chaos • 48px Touch Targets • 100% Readable
            ==================================================== */}
        <div className="sm:hidden flex flex-col items-center space-y-4">
          {/* Animated Mascot in Compact Frame */}
          <div className="relative w-36 h-36 rounded-2xl bg-white border border-[#DDD6C8] p-2.5 shadow-clay-card flex items-center justify-center">
            {activeBot === 'multitask' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/stickers/multitask-agent.gif"
                alt="Qwenton Autonomous Coworker Multitasking"
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/stickers/coding-agent.gif"
                alt="Qwenton Autonomous Focus Agent"
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            )}
            <div className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full bg-[#1C241B] text-[#F4F0E8] border border-[#C27329]/40 text-[9px] font-mono font-bold">
              <span>ONLINE &bull; 0% BUSYWORK</span>
            </div>
          </div>

          {/* Android Mobile Touch Stepper (48px Touch Targets) */}
          <div className="w-full grid grid-cols-4 gap-1.5 pt-2">
            {[
              { num: '1', label: 'Comment' },
              { num: '2', label: 'Triage' },
              { num: '3', label: 'Approval' },
              { num: '4', label: 'DM Sent' },
            ].map((step, idx) => {
              const isSelected = currentStage === idx;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => handleStageSelect(idx, `Stage ${idx + 1}: ${step.label} Active`)}
                  className={`min-h-[44px] py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#1C241B] text-[#F4F0E8] shadow-xs'
                      : 'bg-white border border-[#DDD6C8] text-[#4D5E4A]'
                  }`}
                  aria-label={`View stage ${step.num}: ${step.label}`}
                >
                  <span className={`text-[10px] font-mono font-black ${isSelected ? 'text-[#C27329]' : 'text-[#4D5E4A]'}`}>
                    {step.num}
                  </span>
                  <span className="text-[10px] font-bold leading-none mt-0.5">
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Adaptive Mobile Stage Card (Full Width, Zero Clipping) */}
          <div className="w-full p-4 rounded-2xl bg-white border border-[#DDD6C8] shadow-clay-card">
            {currentStage === 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#1C241B] flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-[#C27329]" />
                    @maya_agency
                  </span>
                  <span className="text-[#4D5E4A]">12s ago</span>
                </div>
                <p className="text-xs text-[#1C241B] font-medium leading-relaxed bg-[#FAF7F0] p-3 rounded-xl border border-[#DDD6C8]/60">
                  &ldquo;Loved this breakdown! Send me the{' '}
                  <span className="bg-[#C27329]/15 text-[#C27329] px-1 py-0.5 rounded font-black font-mono">
                    {displayKeyword}
                  </span>{' '}
                  guide!&rdquo;
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#4D5E4A] pt-1">
                  <span>Reel #8902 &bull; 1.2k comments</span>
                  <span className="text-[#C27329] font-bold">MATCH CONFIRMED</span>
                </div>
              </div>
            )}

            {currentStage === 1 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F0] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#C27329]" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#1C241B]">AI Intent Triage</div>
                    <div className="text-[10px] text-[#4D5E4A]">Semantic Lead Scoring</div>
                  </div>
                </div>
                <div className="text-xs text-[#1C241B] bg-[#FAF7F0] p-3 rounded-xl border border-[#DDD6C8]/60 space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-[#4D5E4A]">Intent Score:</span>
                    <span className="text-[#C27329] font-bold">99.8% High-Value</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-[#4D5E4A]">Action:</span>
                    <span className="text-[#1C241B] font-bold">Draft private link response</span>
                  </div>
                </div>
              </div>
            )}

            {currentStage === 2 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#C27329] text-white flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#1C241B]">Human Firewall</div>
                      <div className="text-[10px] text-[#4D5E4A]">Telegram 1-Tap Checkpoint</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#C27329]">
                    {isApproved ? 'READY' : 'PAUSED'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsApproved(!isApproved)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 min-h-[44px] transition-all ${
                    isApproved
                      ? 'bg-[#1C241B] text-[#F4F0E8]'
                      : 'bg-[#C27329] text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isApproved ? 'Approved by Operator (Tap to Pause)' : 'Tap to Approve & Dispatch'}</span>
                </button>
              </div>
            )}

            {currentStage === 3 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#1C241B] flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-[#C27329]" />
                    Direct Message Delivered
                  </span>
                  <span className="text-[#C27329] font-bold">1.4s</span>
                </div>
                <p className="text-xs text-[#1C241B] font-medium leading-relaxed bg-[#FAF7F0] p-3 rounded-xl border border-[#DDD6C8]/60">
                  &ldquo;Hey Maya! Here is your private {displayKeyword} access link: qwenton.ai/p/8902&rdquo;
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#4D5E4A] pt-1">
                  <span>Receipt: #TX-9021</span>
                  <span className="text-[#C27329] font-bold">VERIFIED DELIVERED ✓</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          BOTTOM TELEMETRY BAR
          ---------------------------------------------------- */}
      <div className="mt-3 sm:mt-4 pt-3 border-t border-[#DDD6C8]/70 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-[#4D5E4A]">
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-[#C27329] shrink-0" />
          <span>Android & Mobile Verified &bull; 48px Touch Targets</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px]">
          <span>Velvet Matte</span>
          <span>&bull;</span>
          <span>Zero AI Slop</span>
          <span>&bull;</span>
          <span className="font-bold text-[#1C241B]">Human Firewall Safe</span>
        </div>
      </div>
    </div>
  );
}
