'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  ShieldCheck,
  Zap,
  ArrowRight,
  Play,
  Users,
  Instagram,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  Radio,
  Layers,
  Film,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HeroStickerStage } from '@/components/landing/HeroStickerStage';
import { HeroWorkflowStepper } from '@/components/landing/HeroWorkflowStepper';
import { ScrollProgressBar } from '@/components/landing/ScrollProgressBar';
import { InstantAuditSandbox } from '@/components/landing/InstantAuditSandbox';

export default function LandingPage() {
  // Hero Stepper & Workflow State
  const [heroStage, setHeroStage] = useState<number>(0);
  const [heroKeyword, setHeroKeyword] = useState<string>('PLAYBOOK');

  // Section 1: Product Proof Interactive Simulator State
  const [proofStep, setProofStep] = useState<'comment' | 'approval' | 'delivered'>('approval');
  const [proofKeyword, setProofKeyword] = useState('GROWTH');
  const [proofComment, setProofComment] = useState('Send me the GROWTH blueprint please');
  const [proofApproved, setProofApproved] = useState(false);

  // Section 3: Coworker Roster Selection State
  const [selectedAgent, setSelectedAgent] = useState<'reels' | 'intel' | 'away' | 'research'>('reels');

  // Section 6: FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const agentRoster = {
    reels: {
      name: 'Reel Comment-to-DM Agent',
      role: 'Social Lead Conversion',
      icon: Instagram,
      description:
        'Listens for inbound follower comments matching your lead magnet keyword. Automatically composes a friendly public reply and drafts a 1-to-1 private direct message with your link.',
      sampleInput: 'Comment on Reel: "Send me the GROWTH guide"',
      sampleOutput: 'DM to @follower: "Hey! Here is your private growth guide link: https://qwenton.co/growth-guide"',
      status: 'Ready for Review',
    },
    intel: {
      name: 'Competitor Intelligence Agent',
      role: 'Market & Pricing Research',
      icon: Search,
      description:
        'Monitors competitor public pages, detects pricing changes and feature announcements, and compiles an executive briefing for your review.',
      sampleInput: 'Crawl target: competitor pricing routes',
      sampleOutput: 'Executive Briefing: "Identified 2 tier updates. Opportunity to package bundle at INR 299/mo."',
      status: 'Briefing Assembled',
    },
    away: {
      name: '24/7 Away Mode Assistant',
      role: 'Inbound Inquiries & Triage',
      icon: Radio,
      description:
        'Protects your business when you are offline. Evaluates inbound customer questions against your knowledge base, drafts polite answers, and requests approval for critical requests.',
      sampleInput: 'Direct Message: "Can you handle custom API integrations?"',
      sampleOutput: 'Draft Reply: "Hi! Yes, Qwenton supports custom webhooks and dedicated keys. Here is our spec."',
      status: 'Awaiting Sign-off',
    },
    research: {
      name: 'Research & Outreach Agent',
      role: 'Lead Enrichment',
      icon: Layers,
      description:
        'Enriches qualified leads with public company signals, crafts personalized pitch drafts, and stages follow-up queues for your approval.',
      sampleInput: 'Lead qualified from Instagram Reel comment',
      sampleOutput: 'Outreach Dossier: "Target is scaling content team; suggested angle is automated lead delivery."',
      status: 'Queue Ready',
    },
  };

  const currentAgentData = agentRoster[selectedAgent];

  const faqs = [
    {
      q: 'How does the Instagram Reel Comment-to-DM automation work?',
      a: 'When a follower comments your trigger keyword (such as GROWTH, PRICE, or ACCESS) on your connected Reel, Qwenton instantly captures the event, analyzes intent, and drafts both a public comment response and a private 1-to-1 direct message. You can approve the action with one tap or enable automated delivery.',
    },
    {
      q: 'How does the Human-in-the-Loop approval gate protect my accounts?',
      a: 'Whenever an AI coworker prepares an external action—such as sending a direct message, replying to a comment, or updating external records—the action pauses at the approval checkpoint. You receive an instant push notification on desktop or your Telegram bot with inline Approve / Edit controls. Nothing external is sent without your authorization.',
    },
    {
      q: 'Do I need Docker or complex virtual servers to run Qwenton?',
      a: 'No. Qwenton is serverless and cloud-native. It runs locally with embedded persistence during development, and deploys directly to Vercel and Firebase with zero Docker overhead.',
    },
    {
      q: 'Can I connect custom models and API keys?',
      a: 'Yes. Qwenton provides flexible model routing. You can connect your own API keys or use our verified managed cloud endpoints with single-tap configuration.',
    },
    {
      q: 'What is included in the free plan?',
      a: 'The Normal plan is free forever and includes 2 active AI coworkers, 2 connected Instagram Reels for auto-DM, 50 monthly workflows, 1 Telegram bot connection, and the complete human approval firewall.',
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-primary/20 selection:text-plum-dark font-sans transition-colors duration-clay">
      {/* Real-time reading progress bar */}
      <ScrollProgressBar />

      {/* ----------------------------------------------------
          1. NAVIGATION HEADER (Warm Ivory 60% + Muted Sage 30% + Dusty Plum 10%)
          ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand Mark: [Q] QWENTON AGENTS */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-control bg-plum-dark text-ivory-card flex items-center justify-center font-extrabold text-base shadow-clay-button border border-plum-deep/30">
              Q
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-ink tracking-tight font-display">
                QWENTON
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-border text-ink-muted font-bold">
                AGENTS
              </span>
            </div>
          </Link>

          {/* Navigation Anchors */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-ink-muted">
            <a href="#how-it-works" className="hover:text-ink transition-colors flex items-center gap-1">
              <span>Product</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </a>
            <a href="#roster" className="hover:text-ink transition-colors flex items-center gap-1">
              <span>Use Cases</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </a>
            <a href="#faq" className="hover:text-ink transition-colors flex items-center gap-1">
              <span>Resources</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center text-xs font-bold text-ink hover:text-primary transition-colors px-2 min-h-[48px] sm:min-h-0"
            >
              Sign In
            </Link>

            <Link href="/signup">
              <Button
                size="sm"
                className="rounded-full font-extrabold px-5 py-2.5 text-xs bg-primary text-white hover:bg-plum-hover shadow-clay-button border-0 transition-transform active:scale-95 min-h-[48px] sm:min-h-[38px]"
              >
                <span>Deploy Free Agents</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 text-white" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------
          2. HERO SECTION: 12-COL PRODUCT THEATRE (Warm Ivory + Muted Sage + Dusty Plum)
          ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
          {/* Left Column (5 cols): Positioning, Headlines, Actions & Trust Row */}
          <div className="lg:col-span-5 space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface text-ink font-mono text-[11px] font-semibold border border-border shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="tracking-wider uppercase text-ink-muted font-bold">
                AUTONOMOUS WORKFORCE • SOCIAL • LEADS • ZERO BUSYWORK
              </span>
            </div>

            {/* Master Headline */}
            <h1 className="font-fluid-hero font-extrabold text-ink tracking-tight font-display">
              AI coworkers that turn attention into approved action.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl font-normal">
              Capture Instagram leads, understand intent, draft the right reply, and get human approval — so you can grow without handing control to an opaque system.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-full font-extrabold px-8 py-3.5 text-sm bg-primary text-white hover:bg-plum-hover shadow-clay-button border-0 transition-transform active:scale-95 min-h-[48px]"
                >
                  <span>Deploy free agents</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-white" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full font-bold px-6 py-3.5 text-sm border-border bg-surface hover:bg-surface-inset text-ink gap-2 min-h-[48px]"
                >
                  <Play className="w-3.5 h-3.5 fill-ink text-ink" />
                  <span>Watch the workflow</span>
                </Button>
              </a>
            </div>

            {/* Live Interactive Keyword Tester Box */}
            <div className="p-4 rounded-card bg-surface border border-border shadow-clay-card space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-ink uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Try Live Trigger Simulator
                </span>
                <span className="text-[10px] font-mono text-ink-muted">Reacts live on right stage</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={heroKeyword}
                  onChange={(e) => setHeroKeyword(e.target.value.toUpperCase())}
                  placeholder="E.G. PLAYBOOK"
                  className="flex-1 text-xs font-mono font-bold uppercase px-3.5 py-2.5 bg-canvas border border-border rounded-control text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[48px]"
                  aria-label="Enter simulated Instagram Reel trigger keyword"
                />
                <button
                  type="button"
                  onClick={() => setHeroStage(0)}
                  className="px-4 py-2.5 rounded-control bg-plum-dark text-ivory-card font-bold text-xs hover:bg-plum-deep transition-all min-h-[48px] flex items-center gap-1.5 shrink-0 active:scale-95 shadow-clay-button"
                >
                  <Zap className="w-3 h-3 text-primary" />
                  <span>Simulate</span>
                </button>
              </div>

              {/* Quick-tap keyword chips (Touch-safe 48px for Android) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-mono text-ink-muted">Quick chips:</span>
                {['PLAYBOOK', 'VIP', 'GROWTH', 'AUDIT'].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => {
                      setHeroKeyword(kw);
                      setHeroStage(0);
                    }}
                    className={`px-3 py-1.5 rounded-control text-[10px] font-mono font-bold transition-all min-h-[40px] flex items-center ${
                      heroKeyword === kw
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-inset text-ink hover:bg-border'
                    }`}
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Micro-Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/80">
              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-ink font-mono">10,000+</div>
                  <div className="text-[11px] text-ink-muted leading-tight">
                    creators & businesses
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-ink font-mono">24/7</div>
                  <div className="text-[11px] text-ink-muted leading-tight">
                    autonomous outreach
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sage-dark mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-ink font-mono">You&apos;re in control</div>
                  <div className="text-[11px] text-ink-muted leading-tight">
                    human approval always
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): The Hero Sticker & GIF Stage */}
          <div className="lg:col-span-7">
            <HeroStickerStage
              activeStage={heroStage}
              setActiveStage={setHeroStage}
              simulatedKeyword={heroKeyword}
            />
          </div>
        </div>

        {/* Floating 4-Step Stepper Bar at bottom of Hero */}
        <div className="pt-2 pb-6">
          <HeroWorkflowStepper activeStage={heroStage} setActiveStage={setHeroStage} />
        </div>
      </section>

      {/* ----------------------------------------------------
          3. SECTION 1: PRODUCT PROOF — 3-STEP HORIZONTAL SIMULATOR
          ---------------------------------------------------- */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 w-full border-t border-border">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-panel text-ink font-mono text-xs font-bold mb-3 border border-border">
            <Film className="w-3.5 h-3.5 text-primary" />
            <span>PRODUCT PROOF IN ACTION • TEST IN REAL-TIME</span>
          </div>
          <h2 className="font-fluid-section font-extrabold text-ink tracking-tight mb-3 font-display">
            Comment Arrives → Human Approves → DM Delivered
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Experience the three-step flow that turns casual Reel comments into qualified leads without giving up human control.
          </p>
        </div>

        {/* 3-Step Horizontal Stepper Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              id: 'comment',
              num: '1',
              title: 'Comment Arrives',
              desc: 'Follower comments trigger keyword on your Reel',
            },
            {
              id: 'approval',
              num: '2',
              title: 'Human Approves',
              desc: 'Agent drafts reply & pauses at approval firewall',
            },
            {
              id: 'delivered',
              num: '3',
              title: 'DM Delivered',
              desc: 'Direct message lands in follower inbox instantly',
            },
          ].map((tab) => {
            const isActive = proofStep === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProofStep(tab.id as typeof proofStep)}
                className={`p-5 rounded-card border text-left transition-all min-h-[48px] ${
                  isActive
                    ? 'bg-surface border-primary shadow-clay-card'
                    : 'bg-surface-panel border-border text-ink-muted hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isActive ? 'bg-primary text-white' : 'bg-surface-inset text-ink-muted'
                    }`}
                  >
                    {tab.num}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                </div>
                <div className="text-sm font-bold text-ink font-display">{tab.title}</div>
                <div className="text-xs text-ink-muted mt-0.5">{tab.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Interactive Proof Canvas Panel */}
        <div className="clay-surface p-6 sm:p-8 bg-surface border border-border shadow-clay-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-hero">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold font-mono text-ink uppercase mb-1.5">
                Trigger Keyword
              </label>
              <input
                type="text"
                value={proofKeyword}
                onChange={(e) => setProofKeyword(e.target.value.toUpperCase())}
                className="w-full text-xs font-mono font-bold uppercase px-3.5 py-2.5 bg-canvas border border-border rounded-control text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[48px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono text-ink uppercase mb-1.5">
                Test Follower Comment
              </label>
              <input
                type="text"
                value={proofComment}
                onChange={(e) => setProofComment(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-canvas border border-border rounded-control text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[48px]"
              />
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => {
                  setProofApproved(true);
                  setProofStep('delivered');
                }}
                className="w-full py-3.5 rounded-full bg-primary hover:bg-plum-hover text-white font-extrabold text-xs uppercase tracking-wider shadow-clay-button gap-2 border-0 min-h-[48px]"
              >
                <Zap className="w-3.5 h-3.5 text-white" />
                <span>Simulate Complete Flow</span>
              </Button>
            </div>
          </div>

          {/* Live Deliverable Display Column (Warm Ivory 60% + Muted Sage 30% + Dusty Plum 10%) */}
          <div className="lg:col-span-7 bg-sage-deep text-ivory-card p-6 rounded-card border border-sage-border space-y-4 shadow-clay-card">
            <div className="flex items-center justify-between border-b border-sage-border pb-3 text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-plum-light" /> Live Deliverable Preview
              </span>
              <span className="font-mono text-plum-light text-[11px] font-bold">
                ● STATUS: {proofStep.toUpperCase()}
              </span>
            </div>

            {proofStep === 'comment' && (
              <div className="space-y-3 py-2">
                <div className="text-xs text-ivory-card/80 font-mono">INBOUND REEL COMMENT:</div>
                <div className="p-3.5 rounded-control bg-plum-dark/25 border border-sage-border text-sm">
                  <strong className="text-plum-light font-mono">@follower:</strong> &quot;{proofComment}&quot;
                </div>
                <div className="text-xs text-plum-light font-mono flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Trigger keyword &quot;{proofKeyword}&quot; identified
                </div>
              </div>
            )}

            {proofStep === 'approval' && (
              <div className="space-y-3 py-2">
                <div className="text-xs text-plum-light font-bold font-mono uppercase">
                  APPROVAL FIREWALL CHECKPOINT:
                </div>
                <div className="p-3.5 rounded-control bg-plum-dark/25 border border-plum-border/50 text-xs text-ivory-card leading-relaxed">
                  <div>Hey there! Thanks for commenting on our Reel.</div>
                  <div>Here is your requested access link: https://qwenton.co/{proofKeyword.toLowerCase()}</div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProofApproved(true);
                      setProofStep('delivered');
                    }}
                    className="py-2.5 px-5 rounded-full bg-primary hover:bg-plum-hover text-white font-extrabold text-xs flex items-center gap-1.5 shadow-clay-button active:scale-95 transition-transform cursor-pointer min-h-[44px]"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Approve & Send</span>
                  </button>
                  <span className="text-xs text-ivory-card/80">Paused for human operator sign-off</span>
                </div>
              </div>
            )}

            {proofStep === 'delivered' && (
              <div className="space-y-3 py-2">
                <div className="text-xs text-plum-light font-bold font-mono uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-plum-light" /> DELIVERED DIRECTLY TO INBOX:
                </div>
                <div className="p-3.5 rounded-control bg-plum-dark/25 border border-sage-border text-xs text-ivory-card leading-relaxed">
                  <div>Hey there! Thanks for commenting on our Reel.</div>
                  <div>Here is your requested access link: https://qwenton.co/{proofKeyword.toLowerCase()}</div>
                </div>
                <div className="flex items-center justify-between text-xs text-ivory-card/80 pt-1 font-mono">
                  <span>Latency: 280ms</span>
                  <span className="text-plum-light font-bold">✓ Human Approved & Verified</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          4. SECTION 2: WHY HUMAN APPROVAL MATTERS (Asymmetric Layout)
          ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20 w-full border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Approval Panel (5 cols) */}
          <div className="lg:col-span-5 bg-sage-deep text-ivory-card p-7 rounded-card border border-sage-border shadow-clay-card space-y-5">
            <div className="flex items-center justify-between border-b border-sage-border pb-3">
              <div className="flex items-center gap-2 text-plum-light font-bold text-xs uppercase tracking-wider font-mono">
                <ShieldAlert className="w-4 h-4" />
                <span>Approval Firewall</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-plum-dark/30 text-plum-light font-mono text-[10px] font-bold border border-plum-border/40">
                GATE: ENFORCED
              </span>
            </div>

            <div className="space-y-2 text-xs text-ivory-card/85 leading-relaxed font-sans">
              <div className="font-bold text-ivory-card text-sm font-display">
                No unsupervised external actions. Ever.
              </div>
              <p>
                Unlike autonomous agents that can hallucinate and dispatch errant messages to clients, Qwenton isolates proposal generation from external delivery.
              </p>
            </div>

            <div className="p-3.5 rounded-control bg-plum-dark/25 border border-sage-border space-y-2 text-xs">
              <div className="text-ivory-card/80 text-[11px] font-mono uppercase">
                MUTATIONS INTERCEPTED:
              </div>
              <div className="space-y-1 text-ivory-card">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-plum-light shrink-0" />
                  <span>Instagram Direct Messages & Private Replies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-plum-light shrink-0" />
                  <span>Client Emails & Telegram Broadcasts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-plum-light shrink-0" />
                  <span>Ad Campaigns & Budget Adjustments</span>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/approvals"
                className="text-xs font-bold text-plum-light hover:underline flex items-center gap-1 font-mono min-h-[48px] sm:min-h-0 inline-flex items-center"
              >
                <span>Inspect live approvals inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Principles (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-panel text-ink font-mono text-xs font-bold border border-border">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>THE TRUST ARCHITECTURE</span>
            </div>

            <h2 className="font-fluid-section font-extrabold text-ink tracking-tight font-display">
              Why Human Approval Matters in Production Autonomy
            </h2>

            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-card bg-surface border border-border space-y-1.5 shadow-clay-card">
                <div className="font-extrabold text-ink text-base font-display flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-mono font-bold">
                    1
                  </span>
                  <span>The agent prepares the action</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed pl-8">
                  Your coworkers scan inbound signals, parse intent, research context, and draft the complete deliverable without demanding your time for prep work.
                </p>
              </div>

              <div className="p-5 rounded-card bg-surface border border-border space-y-1.5 shadow-clay-card">
                <div className="font-extrabold text-ink text-base font-display flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sage-light text-sage-dark flex items-center justify-center text-xs font-mono font-bold border border-sage-border">
                    2
                  </span>
                  <span>A human controls external dispatch</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed pl-8">
                  You review proposed drafts on desktop or via 1-tap push buttons in your private Telegram bot. Nothing leaves your workspace until you give the green light.
                </p>
              </div>

              <div className="p-5 rounded-card bg-surface border border-border space-y-1.5 shadow-clay-card">
                <div className="font-extrabold text-ink text-base font-display flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-mono font-bold">
                    3
                  </span>
                  <span>Every event is completely traceable</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed pl-8">
                  Full audit logs track when triggers fired, how intent was categorized, which operator signed off, and exact delivery timestamps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          5. SECTION 3: AGENT COWORKER ROSTER (Interactive Selector)
          ---------------------------------------------------- */}
      <section id="roster" className="max-w-6xl mx-auto px-6 py-20 w-full border-t border-border">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-panel text-ink font-mono text-xs font-bold mb-3 border border-border">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>SPECIALIZED COWORKER ROSTER</span>
          </div>
          <h2 className="font-fluid-section font-extrabold text-ink tracking-tight mb-3 font-display">
            Four Dedicated AI Coworkers for Your Team
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Select a specialized coworker to review their workflow, inputs, and approved deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Vertical Roster Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {(
              [
                { id: 'reels', name: 'Reel Comment-to-DM Agent', icon: Instagram },
                { id: 'intel', name: 'Competitor Intelligence Agent', icon: Search },
                { id: 'away', name: '24/7 Away Mode Assistant', icon: Radio },
                { id: 'research', name: 'Research & Outreach Agent', icon: Layers },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const isSelected = selectedAgent === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAgent(item.id)}
                  className={`w-full p-4 rounded-card border text-left transition-all flex items-center justify-between gap-4 min-h-[48px] ${
                    isSelected
                      ? 'bg-surface border-primary text-ink shadow-clay-card scale-[1.02]'
                      : 'bg-surface-panel border-border text-ink-muted hover:border-border-strong hover:text-ink'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-control flex items-center justify-center ${
                        isSelected
                          ? 'bg-primary text-white shadow-clay-button'
                          : 'bg-surface-inset text-ink-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-ink font-display">{item.name}</div>
                      <div className="text-xs text-ink-muted">
                        {agentRoster[item.id].role}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-primary translate-x-1' : 'opacity-30'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Agent Detail Panel (7 cols) */}
          <div className="lg:col-span-7 clay-surface p-7 bg-surface border border-border shadow-clay-card space-y-5 rounded-hero">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-primary uppercase">
                  {currentAgentData.role}
                </span>
                <h3 className="text-xl font-extrabold text-ink font-display mt-0.5">
                  {currentAgentData.name}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold border border-primary/20">
                {currentAgentData.status}
              </span>
            </div>

            <p className="text-sm text-ink-muted leading-relaxed">
              {currentAgentData.description}
            </p>

            {/* Input & Output Artifact Preview */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-control bg-surface-inset border border-border">
                <span className="text-[10px] text-ink-muted uppercase block mb-1">
                  SAMPLE INBOUND INPUT:
                </span>
                <span className="text-ink font-semibold">{currentAgentData.sampleInput}</span>
              </div>

              <div className="p-3.5 rounded-control bg-canvas border border-border">
                <span className="text-[10px] text-primary uppercase block mb-1 font-bold">
                  DRAFTED ACTION DELIVERABLE:
                </span>
                <span className="text-ink leading-relaxed font-sans text-xs">
                  {currentAgentData.sampleOutput}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link href="/agents/new">
                <Button size="sm" className="rounded-full font-extrabold px-6 py-2.5 text-xs bg-primary text-white hover:bg-plum-hover shadow-clay-button border-0 min-h-[48px] sm:min-h-[38px]">
                  Deploy this Coworker →
                </Button>
              </Link>
              <span className="text-xs font-mono text-ink-muted">Setup: &lt; 60 seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          6. SECTION 4: GROWTH AUDIT SANDBOX (Visual Output)
          ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20 w-full border-t border-border">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-panel text-ink font-mono text-xs font-bold mb-3 border border-border">
            <Search className="w-3.5 h-3.5 text-primary" />
            <span>GROWTH AUDIT ENGINE • ZERO LOGIN NEEDED</span>
          </div>
          <h2 className="font-fluid-section font-extrabold text-ink tracking-tight mb-3 font-display">
            5-Second Agency Intelligence Sandbox
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Enter any niche or business category. Our autonomous research coworker inspects competitor opportunities, drafts a social strategy, and stages an approved client pitch.
          </p>
        </div>

        <InstantAuditSandbox />
      </section>

      {/* ----------------------------------------------------
          7. SECTION 5: FAQ ACCORDION (Clean Typography)
          ---------------------------------------------------- */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 w-full border-t border-border">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-panel text-ink font-mono text-xs font-bold mb-3 border border-border">
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-fluid-section font-extrabold text-ink tracking-tight font-display">
            Clear Answers for Creators & Operators
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="clay-surface bg-surface border border-border overflow-hidden rounded-card">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-ink hover:bg-surface-panel transition-colors font-display min-h-[48px]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-ink-muted shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ink-muted leading-relaxed border-t border-border/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------
          8. CLOSING CONVERSION BANNER (Warm Ivory 60% + Muted Sage 30% + Dusty Plum 10%)
          ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="p-8 sm:p-12 rounded-hero bg-sage-deep text-ivory-card flex flex-col md:flex-row items-center justify-between gap-8 shadow-clay-card border border-sage-border">
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-plum-light font-bold">
              GET STARTED IN 60 SECONDS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ivory-card tracking-tight font-display">
              Put your first AI coworker to work.
            </h2>
            <p className="text-xs sm:text-sm text-ivory-card/85 leading-relaxed font-normal">
              Activate your free Normal plan. Automate 2 Instagram Reels, connect a private Telegram bot, and run 50 autonomous workflows per month with full human-in-the-loop protection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full font-extrabold px-8 py-3.5 text-xs bg-primary text-white hover:bg-plum-hover shadow-clay-button uppercase tracking-wider border-0 min-h-[48px]"
              >
                <span>Deploy free agents</span>
                <ArrowRight className="w-4 h-4 ml-1 text-white" />
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full font-bold px-6 py-3.5 text-xs border border-ivory-card/40 text-ivory-card hover:bg-white/10 min-h-[48px]"
              >
                See how approval works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          9. CLEAN TECHNICAL FOOTER
          ---------------------------------------------------- */}
      <footer className="border-t border-border bg-surface py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-ink-muted font-mono">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-control bg-plum-dark text-ivory-card flex items-center justify-center font-bold text-xs shadow-clay-button">
              Q
            </div>
            <span>© {new Date().getFullYear()} Qwenton Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-ink hover:underline transition-colors min-h-[48px] sm:min-h-0 inline-flex items-center">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-ink hover:underline transition-colors min-h-[48px] sm:min-h-0 inline-flex items-center">
              Privacy Policy
            </Link>
            <span className="text-primary font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
