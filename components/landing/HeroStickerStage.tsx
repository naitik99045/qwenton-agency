'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Send,
  Zap,
  Sparkles,
  CheckCircle2,
  Instagram,
  Coffee,
  Bot,
  Check,
  Smartphone,
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
    <div className="relative w-full rounded-hero bg-surface-panel border border-border p-4 sm:p-7 shadow-clay-card overflow-hidden select-none transition-all">
      {/* ----------------------------------------------------
          TOP BAR: Bot Persona Switcher + Mobile/Desktop Telemetry
          ---------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-border/70 mb-4 sm:mb-6">
        {/* Left: Persona Switcher with 48px touch targets for Android */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-surface-inset border border-border w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setActiveBot('multitask');
              if (setActiveStage) setActiveStage(0);
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-full text-xs font-bold transition-all min-h-[48px] sm:min-h-0 ${
              activeBot === 'multitask'
                ? 'bg-primary text-white shadow-clay-button border border-plum-deep/30'
                : 'text-ink-muted hover:text-ink'
            }`}
            aria-label="Switch to Multitask Lead Coworker"
          >
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Multitask Coworker</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveBot('focus');
              if (setActiveStage) setActiveStage(1);
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-full text-xs font-bold transition-all min-h-[48px] sm:min-h-0 ${
              activeBot === 'focus'
                ? 'bg-primary text-white shadow-clay-button border border-plum-deep/30'
                : 'text-ink-muted hover:text-ink'
            }`}
            aria-label="Switch to Deep Focus Coworker"
          >
            <Coffee className="w-3.5 h-3.5 text-white" />
            <span>Deep Focus Coworker</span>
          </button>
        </div>

        {/* Right: Live Meta Webhook Pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-[11px] font-mono font-bold text-ink">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>META REEL INGRESS • 280MS</span>
        </div>
      </div>

      {/* ----------------------------------------------------
          MAIN STAGE CANVAS (Warm Ivory & Soft Clay Inset)
          ---------------------------------------------------- */}
      <div className="relative rounded-card bg-canvas border border-border p-4 sm:p-6 overflow-hidden">
        {/* Subtle Matte Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(var(--ink-muted) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Dynamic Interactive Reaction Pill */}
        {stickerReaction && (
          <div className="absolute top-3 inset-x-3 sm:inset-x-8 z-30 flex items-center justify-center animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-plum-dark text-ivory-card text-xs font-bold shadow-clay-card border border-primary/50 text-center">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
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
            className={`absolute top-2 left-2 lg:left-4 z-20 cursor-pointer max-w-[230px] p-3.5 rounded-card bg-surface border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
              currentStage === 0
                ? 'border-primary ring-2 ring-primary/20 -rotate-2'
                : 'border-border -rotate-3 hover:border-primary'
            }`}
            title="Click to inspect inbound Reel comment"
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-extrabold">
                  M
                </div>
                <span className="text-[11px] font-bold text-ink">@maya_agency</span>
              </div>
              <span className="text-[9px] font-mono font-semibold text-ink-muted">12s ago</span>
            </div>

            <p className="text-[11px] text-ink leading-snug font-medium mb-2">
              &ldquo;Loved this breakdown! Send me the{' '}
              <span className="bg-plum-light text-plum-deep px-1.5 py-0.5 rounded-control font-extrabold font-mono border border-plum-border">
                {displayKeyword}
              </span>{' '}
              guide!&rdquo;
            </p>

            <div className="flex items-center justify-between pt-1.5 border-t border-border/70 text-[9px] font-mono text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <Instagram className="w-2.5 h-2.5 text-primary" />
                <span>Reel #8902</span>
              </span>
              <span className="font-bold text-sage-dark">KEYWORD MATCH</span>
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
            className={`absolute top-2 right-2 lg:right-4 z-20 cursor-pointer p-3.5 rounded-card bg-surface border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
              currentStage === 2
                ? 'border-primary ring-2 ring-primary/20 rotate-3'
                : 'border-border rotate-3 hover:border-primary'
            }`}
            title="Click to toggle Human Approval Gate"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-clay-button">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-ink font-display uppercase tracking-wide">
                  Human Verified
                </div>
                <div className="text-[9px] text-ink-muted font-mono">Zero Unsupervised Risk</div>
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
              className={`w-full inline-flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-control text-[10px] font-mono font-bold transition-colors ${
                isApproved
                  ? 'bg-sage-light text-sage-dark border border-sage-border'
                  : 'bg-plum-light text-plum-deep border border-plum-border'
              }`}
            >
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-sage-dark" />
                <span>{isApproved ? 'STATUS: APPROVED' : 'STATUS: PAUSED'}</span>
              </span>
              <span className="text-[8px] underline">TAP</span>
            </button>
          </div>

          {/* CENTER: Animated AI Coworker Mascot */}
          <div className="relative my-4 flex flex-col items-center justify-center z-10">
            {/* Ambient Velvet Pedestal */}
            <div className="absolute w-48 h-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

            <div className="relative w-44 h-44 lg:w-48 lg:h-48 rounded-hero bg-surface border-2 border-border p-3 shadow-clay-card flex items-center justify-center transition-transform hover:scale-102">
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
              <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-plum-dark text-ivory-card border border-primary/40 shadow-xs flex items-center gap-1.5 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>
                  {activeBot === 'multitask' ? 'COWORKER #01 • LEADS' : 'COWORKER #02 • RESEARCH'}
                </span>
              </div>
            </div>

            <div className="text-[11px] font-bold text-ink mt-5 flex items-center gap-1.5">
              <span>{activeBot === 'multitask' ? 'Multitask Lead Agent' : 'Deep Focus Agent'}</span>
              <span className="text-ink-muted font-normal">&bull; Autonomous Reel Engine</span>
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
            className={`absolute bottom-2 left-2 lg:left-4 z-20 cursor-pointer p-3 rounded-card bg-surface border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
              currentStage === 1
                ? 'border-primary ring-2 ring-primary/20 rotate-2'
                : 'border-border rotate-2 hover:border-primary'
            }`}
            title="Click to inspect AI Triage Engine"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-control bg-sage-light border border-sage-border flex items-center justify-center text-sage-dark">
                <Bot className="w-4 h-4 text-sage-dark" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-ink font-mono">
                  AI TRIAGE ENGINE
                </div>
                <div className="text-[9px] text-ink-muted font-medium">99.8% Intent Precision</div>
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
            className={`absolute bottom-2 right-2 lg:right-4 z-20 cursor-pointer max-w-[230px] p-3.5 rounded-card bg-surface border transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-30 shadow-clay-card ${
              currentStage === 3
                ? 'border-primary ring-2 ring-primary/20 -rotate-2'
                : 'border-border -rotate-3 hover:border-primary'
            }`}
            title="Click to inspect DM Delivery Receipt"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-ink">
                <Send className="w-2.5 h-2.5 text-primary" />
                <span>DM Delivered</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-primary">1.4s latency</span>
            </div>

            <p className="text-[10px] text-ink font-medium leading-tight mb-1.5">
              &ldquo;Hey Maya! Here is your private {displayKeyword} access link: qwenton.ai/p/8902&rdquo;
            </p>

            <div className="flex items-center justify-between text-[8px] font-mono text-ink-muted">
              <span>Receipt: #TX-9021</span>
              <span className="text-sage-dark font-bold">VERIFIED DELIVERED ✓</span>
            </div>
          </div>
        </div>

        {/* ====================================================
            MOBILE VIEW: ANDROID-SAFE ADAPTIVE SEQUENCER (< 640px)
            Zero Overlapping Chaos • 48px Touch Targets • 100% Readable
            ==================================================== */}
        <div className="sm:hidden flex flex-col items-center space-y-4">
          {/* Animated Mascot in Compact Frame */}
          <div className="relative w-36 h-36 rounded-card bg-surface border border-border p-2.5 shadow-clay-card flex items-center justify-center">
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
            <div className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full bg-plum-dark text-ivory-card border border-primary/40 text-[9px] font-mono font-bold">
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
                  className={`min-h-[48px] py-2 px-1 rounded-control text-center flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-sage-light text-sage-dark border border-sage-border shadow-xs'
                      : 'bg-surface border border-border text-ink-muted'
                  }`}
                  aria-label={`View stage ${step.num}: ${step.label}`}
                >
                  <span className={`text-[10px] font-mono font-extrabold ${isSelected ? 'text-sage-dark' : 'text-ink-muted'}`}>
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
          <div className="w-full p-4 rounded-card bg-surface border border-border shadow-clay-card">
            {currentStage === 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-primary" />
                    @maya_agency
                  </span>
                  <span className="text-ink-muted">12s ago</span>
                </div>
                <p className="text-xs text-ink font-medium leading-relaxed bg-surface-panel p-3 rounded-control border border-border/60">
                  &ldquo;Loved this breakdown! Send me the{' '}
                  <span className="bg-plum-light text-plum-deep px-1.5 py-0.5 rounded-control font-extrabold font-mono border border-plum-border">
                    {displayKeyword}
                  </span>{' '}
                  guide!&rdquo;
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted pt-1">
                  <span>Reel #8902 &bull; 1.2k comments</span>
                  <span className="text-sage-dark font-bold">MATCH CONFIRMED</span>
                </div>
              </div>
            )}

            {currentStage === 1 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-control bg-sage-light flex items-center justify-center border border-sage-border">
                    <Bot className="w-4 h-4 text-sage-dark" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-ink">AI Intent Triage</div>
                    <div className="text-[10px] text-ink-muted">Semantic Lead Scoring</div>
                  </div>
                </div>
                <div className="text-xs text-ink bg-surface-panel p-3 rounded-control border border-border/60 space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-ink-muted">Intent Score:</span>
                    <span className="text-sage-dark font-bold">99.8% High-Value</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-ink-muted">Action:</span>
                    <span className="text-ink font-bold">Draft private link response</span>
                  </div>
                </div>
              </div>
            )}

            {currentStage === 2 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-control bg-primary text-white flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-ink">Human Firewall</div>
                      <div className="text-[10px] text-ink-muted">Telegram 1-Tap Checkpoint</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-sage-dark">
                    {isApproved ? 'READY' : 'PAUSED'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsApproved(!isApproved)}
                  className={`w-full py-2.5 px-3 rounded-control font-bold text-xs flex items-center justify-center gap-2 min-h-[48px] transition-all ${
                    isApproved
                      ? 'bg-sage-light text-sage-dark border border-sage-border'
                      : 'bg-primary text-white shadow-clay-button'
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
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-primary" />
                    Direct Message Delivered
                  </span>
                  <span className="text-sage-dark font-bold">1.4s</span>
                </div>
                <p className="text-xs text-ink font-medium leading-relaxed bg-surface-panel p-3 rounded-control border border-border/60">
                  &ldquo;Hey Maya! Here is your private {displayKeyword} access link: qwenton.ai/p/8902&rdquo;
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted pt-1">
                  <span>Receipt: #TX-9021</span>
                  <span className="text-sage-dark font-bold">VERIFIED DELIVERED ✓</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          BOTTOM TELEMETRY BAR
          ---------------------------------------------------- */}
      <div className="mt-3 sm:mt-4 pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-ink-muted">
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>Android & Mobile Verified &bull; 48px Touch Targets</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px]">
          <span>Soft Claymorphic</span>
          <span>&bull;</span>
          <span>Pure 3-Colour Palette</span>
          <span>&bull;</span>
          <span className="font-bold text-ink">Human Firewall Safe</span>
        </div>
      </div>
    </div>
  );
}
