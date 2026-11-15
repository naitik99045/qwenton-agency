'use client';

import React, { useState } from 'react';
import {
  Check,
  Edit2,
  Instagram,
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Activity,
  Lock,
} from 'lucide-react';

interface ProductCommandCockpitProps {
  activeStage: number;
  setActiveStage: (stage: number) => void;
  className?: string;
}

export function ProductCommandCockpit({
  activeStage,
  setActiveStage,
  className = '',
}: ProductCommandCockpitProps) {
  const [isApproved, setIsApproved] = useState(false);
  const [customReply, setCustomReply] = useState(
    'Hey Maya! Here is your exclusive access link to the 2026 Growth Playbook: https://qwenton.co/growth-playbook'
  );
  const [isEditing, setIsEditing] = useState(false);

  const stages = [
    { id: 0, label: '01 Inbound Comment', tag: 'LISTENER' },
    { id: 1, label: '02 AI Semantic Triage', tag: 'ANALYZER' },
    { id: 2, label: '03 Approval Gate', tag: 'FIREWALL' },
    { id: 3, label: '04 Direct Delivery', tag: 'DISPATCH' },
  ];

  const handleApprove = () => {
    setIsApproved(true);
    setActiveStage(3);
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-moss text-linen border border-moss-border shadow-2xl transition-all duration-300 ${className}`}
    >
      {/* ----------------------------------------------------
          1. COCKPIT HEADER BAR (Linen + Moss + Ochre)
          ---------------------------------------------------- */}
      <div className="px-5 py-3.5 border-b border-moss-border bg-[#182416]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        {/* Live Channel Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-ochre animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-linen uppercase tracking-wider">
            AGENT COCKPIT • REEL WEBHOOK ACTIVE
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-ochre/20 text-ochre font-mono text-[10px] font-bold border border-ochre/40">
            AUTO-DM ENGINE
          </span>
        </div>

        {/* Latency & Security Pill */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-linen/70">
          <span className="flex items-center gap-1 text-ochre">
            <Activity className="w-3.5 h-3.5" /> 280ms latency
          </span>
          <span className="flex items-center gap-1 text-linen font-semibold">
            <Lock className="w-3.5 h-3.5 text-ochre" /> Zero Unsupervised Actions
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------
          2. STAGE PROGRESSION TABS (Interactive 4-Step Navigation)
          ---------------------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-moss-border bg-[#151F13]">
        {stages.map((stage) => {
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              className={`px-4 py-3 text-left transition-all relative flex flex-col justify-center border-r border-moss-border/60 last:border-r-0 ${
                isActive
                  ? 'bg-[#212E1E] text-linen'
                  : 'text-linen/60 hover:text-linen hover:bg-[#1B2618]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-ochre">
                  {stage.tag}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-ochre animate-ping" />
                )}
              </div>
              <span className="font-sans text-xs font-bold truncate">{stage.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-ochre" />
              )}
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------
          3. MAIN INTERACTIVE COCKPIT DISPLAY AREA
          ---------------------------------------------------- */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[460px]">
        {/* Left Telemetry & Metadata Inspector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 rounded-xl bg-[#141C12] p-5 border border-moss-border font-mono text-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-moss-border/80 text-linen/70">
              <span className="flex items-center gap-1.5 font-bold text-linen uppercase tracking-wider text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-ochre" /> Pipeline Telemetry
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-moss-surface border border-moss-border text-ochre font-bold">
                NODE_01_PROD
              </span>
            </div>

            {/* Inbound Signal Payload */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-linen/60 uppercase tracking-wider block">
                Target Source
              </span>
              <div className="p-2.5 rounded-lg bg-[#1B2618] border border-moss-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-ochre" />
                  <span className="font-bold text-linen font-sans text-xs">Instagram Reel #8902</span>
                </div>
                <span className="text-[10px] text-ochre">● 1.2k comments</span>
              </div>
            </div>

            {/* Keyword Matcher */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-linen/60 uppercase tracking-wider block">
                Trigger Keyword Rule
              </span>
              <div className="p-2.5 rounded-lg bg-[#1B2618] border border-moss-border flex items-center justify-between">
                <span className="text-ochre font-bold">&quot;PLAYBOOK&quot;</span>
                <span className="px-2 py-0.5 rounded bg-ochre/20 text-ochre text-[10px] border border-ochre/30 font-bold">
                  MATCH CONFIRMED (99.8%)
                </span>
              </div>
            </div>

            {/* Safety Gate Indicator */}
            <div className="p-3 rounded-lg bg-[#1C2618] border border-ochre/30 space-y-1">
              <div className="flex items-center gap-1.5 text-ochre font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Human Firewall Status</span>
              </div>
              <p className="text-[11px] text-linen/75 font-sans leading-relaxed">
                External direct message paused until operator clicks approve. Zero automated spam.
              </p>
            </div>
          </div>

          {/* Quick Step Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStage((activeStage + 1) % 4)}
              className="w-full py-2.5 px-3 rounded-lg bg-ochre hover:bg-ochre-hover text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>Next Simulation Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right High-Fidelity Simulator Display (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-[#182316] p-6 border border-moss-border space-y-4">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between border-b border-moss-border/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-linen font-display">
                {activeStage === 0 && 'Step 1: Real Follower Comment Captured'}
                {activeStage === 1 && 'Step 2: AI Parsing Intent & Drafting Link'}
                {activeStage === 2 && 'Step 3: Telegram Push Approval Pending'}
                {activeStage === 3 && 'Step 4: Verified 1-to-1 Direct Message Delivered'}
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-ochre px-2.5 py-0.5 rounded-full bg-ochre/20 border border-ochre/40">
              STAGE {activeStage + 1} OF 4
            </span>
          </div>

          {/* Dynamic Content Per Stage */}
          <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
            {/* STAGE 0: COMMENT */}
            {activeStage === 0 && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#1F2C1D] border border-moss-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-linen">
                      <div className="w-6 h-6 rounded-full bg-ochre flex items-center justify-center text-[10px] text-white font-black">
                        M
                      </div>
                      <span>@maya_agency</span>
                    </div>
                    <span className="text-linen/60 text-[11px] font-mono">12s ago</span>
                  </div>
                  <p className="text-sm text-linen font-sans leading-relaxed">
                    &quot;Loved the breakdown! Please send me the complete{' '}
                    <span className="bg-ochre/30 text-ochre px-1.5 py-0.5 rounded font-bold">
                      PLAYBOOK
                    </span>{' '}
                    blueprint guide!&quot;
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#141C12] border border-moss-border flex items-center gap-2 text-xs text-ochre font-mono">
                  <CheckCircle2 className="w-4 h-4 text-ochre shrink-0" />
                  <span>Webhook fired: Lead scored high-intent creator profile.</span>
                </div>
              </div>
            )}

            {/* STAGE 1: UNDERSTAND */}
            {activeStage === 1 && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#1F2C1D] border border-moss-border space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-linen/60 border-b border-moss-border/60 pb-2">
                    <span>INTENT_CLASSIFIER</span>
                    <span className="text-ochre font-bold">LEAD_MAGNET_REQUEST</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-linen/60 text-[11px]">DRAFTED PUBLIC REPLY:</div>
                    <div className="text-linen font-sans text-xs bg-black/20 p-2 rounded border border-moss-border/50">
                      &quot;Sent directly to your DMs Maya! Check your inbox 🚀&quot;
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-linen/60 text-[11px]">DRAFTED PRIVATE DIRECT MESSAGE:</div>
                    <div className="text-linen font-sans text-xs bg-black/20 p-2 rounded border border-moss-border/50">
                      &quot;{customReply}&quot;
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-ochre/15 border border-ochre/30 flex items-center gap-2 text-xs text-ochre font-mono">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>Payload packaged. Routing to operator approval gate...</span>
                </div>
              </div>
            )}

            {/* STAGE 2: HUMAN APPROVAL */}
            {activeStage === 2 && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-ochre/15 border border-ochre/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-ochre font-bold font-mono uppercase">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Telegram Approval Request</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ochre/25 text-ochre font-bold">
                      PAUSED FOR SIGN-OFF
                    </span>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={customReply}
                      onChange={(e) => setCustomReply(e.target.value)}
                      className="w-full text-xs font-sans p-2.5 rounded bg-black/40 border border-ochre/40 text-linen focus:outline-none focus:ring-1 focus:ring-ochre"
                      rows={3}
                    />
                  ) : (
                    <div className="p-3 rounded-lg bg-black/20 border border-moss-border/60 text-xs text-linen leading-relaxed font-sans">
                      {customReply}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-ochre hover:bg-ochre-hover text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform cursor-pointer"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Approve & Dispatch Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-linen font-bold text-xs flex items-center gap-1.5 border border-moss-border transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'Save Text' : 'Edit Reply'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: DELIVERED */}
            {activeStage === 3 && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#141C12] border border-ochre/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-ochre font-bold font-mono uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Direct Message Delivered</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ochre/20 text-ochre font-bold">
                      VERIFIED HUMAN APPROVED
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#1F2C1D] border border-moss-border text-xs text-linen leading-relaxed font-sans space-y-2">
                    <p>{customReply}</p>
                    <div className="pt-2 border-t border-moss-border/60 flex items-center justify-between text-[11px] font-mono text-linen/70">
                      <span>Recipient: @maya_agency</span>
                      <span className="text-ochre font-bold">✓ Read receipt confirmed</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-ochre/15 border border-ochre/30 text-xs text-ochre font-mono">
                  <span>Lead Acquired • Follow-up Staged</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsApproved(false);
                      setActiveStage(0);
                    }}
                    className="hover:underline font-bold"
                  >
                    Reset Demo ↺
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Live Action Footer */}
          <div className="pt-2 border-t border-moss-border/80 flex items-center justify-between text-xs font-mono text-linen/70">
            <span className="flex items-center gap-1 text-linen">
              <Zap className="w-3.5 h-3.5 text-ochre" /> 100% Guaranteed Zero Rogue Actions
            </span>
            <span className="text-ochre font-bold">Serverless • No Docker</span>
          </div>
        </div>
      </div>
    </div>
  );
}
