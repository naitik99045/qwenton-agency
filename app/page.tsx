'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  ShieldAlert,
  Radio,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Zap,
  Check,
  ShieldCheck,
  Cpu,
  Layers,
  Instagram,
  Copy,
  ExternalLink,
  Film,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { TactileSticker } from '@/components/landing/TactileSticker';
import { InstantAuditSandbox } from '@/components/landing/InstantAuditSandbox';

export default function LandingPage() {
  // Hero Interactive Cockpit State
  const [activeCockpitOp, setActiveCockpitOp] = useState<'reels' | 'intel' | 'away' | 'swarm'>('reels');
  const [cockpitTriggerKeyword, setCockpitTriggerKeyword] = useState('GROWTH');
  const [cockpitApprovalState, setCockpitApprovalState] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [cockpitExecuting, setCockpitExecuting] = useState(false);

  // Standalone Instagram Reel Sandbox Tester
  const [testerReelUrl, setTesterReelUrl] = useState('https://instagram.com/reel/C8qwenton123');
  const [testerKeyword, setTesterKeyword] = useState('GROWTH');
  const [testerComment, setTesterComment] = useState('Send me the GROWTH blueprint please');
  const [testerSimulating, setTesterSimulating] = useState(false);
  const [testerResult, setTesterResult] = useState<{
    matched: boolean;
    publicReply: string;
    privateDm: string;
    latencyMs: number;
  } | null>({
    matched: true,
    publicReply: 'Sent directly to your inbox. Check your DMs.',
    privateDm: 'Hey there. Thanks for watching our Reel. Here is your direct access link: https://qwenton.com/access',
    latencyMs: 340,
  });

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSimulateReel = () => {
    setTesterSimulating(true);
    setTimeout(() => {
      const isMatch = testerComment.toUpperCase().includes(testerKeyword.toUpperCase().trim());
      if (isMatch) {
        setTesterResult({
          matched: true,
          publicReply: 'Sent directly to your inbox. Check your DMs.',
          privateDm: `Hey there. Thanks for commenting "${testerKeyword}" on our Reel. Here is your direct access link: https://qwenton.com/access`,
          latencyMs: 380,
        });
      } else {
        setTesterResult({
          matched: false,
          publicReply: 'No trigger matched. Add the keyword to trigger an instant DM.',
          privateDm: '',
          latencyMs: 120,
        });
      }
      setTesterSimulating(false);
    }, 420);
  };

  const cockpitPresets = {
    reels: {
      opId: 'OP_REEL_COMMENT_TO_DM_V20',
      title: 'Instagram Reel Comment-to-DM Engine',
      channel: 'Meta Graph API v20.0',
      incomingPayload: {
        event: 'comment_created',
        commenter: '@growth_founder',
        commentText: `Send me the ${cockpitTriggerKeyword} guide!`,
        mediaId: '1792837482910384',
      },
      actionSummary: `Trigger keyword "${cockpitTriggerKeyword}" matched. Preparing public comment reply and sending private direct message to @growth_founder.`,
      deliverable: {
        publicReply: 'Check your DM. Just sent you the complete growth guide.',
        privateDm: `Hey! Thanks for commenting "${cockpitTriggerKeyword}". Here is the private roadmap link you requested: https://qwenton.com/growth-guide`,
      },
      metrics: { executionTier: 'Tier 1 (HTTP Graph API)', latency: '340ms', jitterGuard: '4.2s delay' },
    },
    intel: {
      opId: 'OP_COMPETITOR_INTEL_AUDIT',
      title: 'Competitor Margin & Pricing Crawler',
      channel: 'Autonomous Web Extraction',
      incomingPayload: {
        event: 'scheduled_crawl_trigger',
        targetDomains: ['competitor-alpha.com', 'competitor-beta.io'],
        parameters: 'Q3 Enterprise Pricing Tiers & Feature Matrix',
      },
      actionSummary:
        'Parsed 14 competitor public pricing routes. Calculated unit margin delta (+18.4%) and compiled executive briefing dossier.',
      deliverable: {
        publicReply: 'Executive Intelligence Briefing v3.4 compiled.',
        privateDm: 'Dossier ready: Identified 3 tier expansion opportunities. Margins optimized at INR 299/mo with zero customer churn risk.',
      },
      metrics: { executionTier: 'Serverless Worker', latency: '680ms', jitterGuard: 'Stealth UA Rotation' },
    },
    away: {
      opId: 'OP_AWAY_MODE_DM_TRIAGE',
      title: '24/7 Away Mode Auto-Responder',
      channel: 'Inbound Direct Messaging',
      incomingPayload: {
        event: 'direct_message_received',
        sender: '@potential_enterprise_client',
        text: 'Are your agents available for custom API integrations?',
      },
      actionSummary:
        'Account is currently in Busy Mode. Evaluating customer inquiry against trained knowledge base and dispatching automated triage.',
      deliverable: {
        publicReply: 'Away status active.',
        privateDm: 'Hi. We are currently offline, but yes: Qwenton supports custom API keys, webhooks, and enterprise routing. Check our specs at https://qwenton.com/specs or reply with your use-case.',
      },
      metrics: { executionTier: 'Webhook Listener', latency: '210ms', jitterGuard: 'Anti-Spam Throttling' },
    },
    swarm: {
      opId: 'OP_MULTI_AGENT_SWARM',
      title: '4-Agent Collaborative Growth Swarm',
      channel: 'Internal Swarm Bus',
      incomingPayload: {
        event: 'swarm_dispatch',
        objective: 'Launch 30-Day Omnichannel Growth Campaign',
        participants: ['Strategy Lead', 'Visual Designer', 'Copywriter', 'Dispatcher'],
      },
      actionSummary:
        'Swarm decomposed objective into 4 parallel workstreams: research synthesis, 18 visual generation prompts, copy variations, and Telegram broadcast schedule.',
      deliverable: {
        publicReply: 'Campaign package assembled.',
        privateDm: '30-Day Growth Package prepared with 18 high-converting visual prompts, caption clusters, and scheduled queues pending your 1-tap review.',
      },
      metrics: { executionTier: 'Multi-Agent State Machine', latency: '920ms', jitterGuard: 'Human Gate Paused' },
    },
  };

  const currentOp = cockpitPresets[activeCockpitOp];

  const faqs = [
    {
      q: 'How does the Instagram Reel Comment-to-DM automation actually work?',
      a: 'When a follower comments your configured trigger keyword (such as GROWTH, PRICE, or VIP) on your Reel, Meta sends a real-time webhook payload to Qwenton. Our engine matches the keyword, applies humanized anti-ban jitter delays, and uses Meta Graph API v20.0 to post a public comment reply and dispatch a private 1-to-1 direct message directly to their inbox within seconds.',
    },
    {
      q: 'Does Qwenton protect my accounts from Instagram algorithmic flags?',
      a: 'Yes. Qwenton enforces a 3-tier safety guard: (1) Dynamic rotating spintax templates so comments never repeat identical text, (2) 3-7 second randomized delay jitter mimicking human typing speed, and (3) hard hourly rate limits (capped at 150 DMs/hour) ensuring your account operates safely within Meta developer guidelines.',
    },
    {
      q: 'How does the Human-in-the-Loop firewall protect external business operations?',
      a: 'Whenever an autonomous agent attempts a mutating external action—such as dispatching bulk messages, publishing content, or launching code—the execution state automatically pauses at an approval gate. You receive an instant notification in your web inbox or connected Telegram bot with inline Approve / Reject controls. Nothing executes externally without your explicit sign-off.',
    },
    {
      q: 'Do I need Docker or expensive cloud virtual machines to run Qwenton?',
      a: 'No. Unlike platforms that force users to pay $20/month per agent for heavy Linux cloud containers, Qwenton is cloud-native and serverless. It runs locally with zero setup using embedded datastore persistence, and deploys seamlessly to Vercel and Firebase in production.',
    },
    {
      q: 'Can I connect custom API keys and multi-provider models?',
      a: 'Yes. Qwenton supports flexible model routing with single-key cloud inference or local endpoints. You can configure global model defaults or assign individual model overrides per agent in the Integrations Vault.',
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-primary/20 selection:text-primary font-sans transition-colors duration-200">
      {/* ----------------------------------------------------
          TOP TECHNICAL TELEMETRY TICKER (Zero Vendor AI Names in Corner)
          ---------------------------------------------------- */}
      <div className="bg-ink text-white text-xs py-2 px-4 border-b border-border select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-white font-bold tracking-wider uppercase">Qwenton Fleet Architecture</span>
            <span className="text-ink-light hidden sm:inline">|</span>
            <span className="text-ink-light hidden sm:inline">v0.6.0 Production Core</span>
          </div>
          <div className="flex items-center gap-4 text-ink-light">
            <span className="hidden md:inline">
              META_GRAPH_API: <strong className="text-white font-semibold">v20.0 Active</strong>
            </span>
            <span>
              HUMAN_GATE: <strong className="text-primary font-semibold">100% Enforced</strong>
            </span>
            <span className="hidden sm:inline">
              TELEMETRY: <strong className="text-white font-semibold">99.98% Operational</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          ARCHITECTURAL NAVIGATION HEADER (With Light/Dark Switch)
          ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-control bg-ink text-white dark:bg-surface dark:text-ink flex items-center justify-center font-black text-sm border border-border shadow-clay-button-subtle">
              Q
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-ink tracking-tight">QWENTON</span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-ink text-white dark:bg-surface dark:text-ink font-bold border border-border">
                  Fleet
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-5">
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-ink-muted uppercase tracking-wider">
              <a href="#cockpit" className="hover:text-ink transition-colors">
                Live Cockpit
              </a>
              <a href="#reels-tester" className="text-primary hover:text-primary/80 transition-colors">
                Reels Engine
              </a>
              <a href="#instant-audit" className="hover:text-ink transition-colors">
                Instant Audit
              </a>
              <a href="#architecture" className="hover:text-ink transition-colors">
                Pillars
              </a>
              <a href="#pricing" className="hover:text-ink transition-colors">
                Pricing
              </a>
              <a href="#faq" className="hover:text-ink transition-colors">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {/* THE LIGHT & DARK MODE SWITCH BUTTON */}
              <ThemeToggle />

              <Link
                href="/login"
                className="hidden sm:inline-block text-xs font-bold text-ink-muted hover:text-ink px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link href="/signup">
                <Button size="sm" className="font-extrabold shadow-clay-button text-xs px-4 py-2 bg-primary text-black hover:bg-brand-hover">
                  Deploy Free Agents →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------
          HERO SECTION: THE COMMAND-CENTER & PHYSICAL STICKERS
          ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-12 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Hero Copy (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface text-ink font-mono text-[11px] font-medium border border-border">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>AUTONOMOUS WORKFORCE • 90% DARK CARBON + 10% CYBER MINT • ZERO GRADIENTS</span>
            </div>

            <h1 className="font-fluid-hero font-black text-ink tracking-tight">
              Autonomous Coworkers for Web, Leads & Social Growth.
            </h1>

            <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-normal max-w-2xl">
              Deploy specialized coworkers that execute real work: turn Instagram comments into instant direct messages, crawl competitor intelligence, and automate 24/7 routines with a strict human approval firewall.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto font-extrabold px-8 py-3.5 text-sm gap-2 bg-primary text-black hover:bg-brand-hover shadow-clay-button">
                  <span>Deploy 2 Free Agents</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Button>
              </Link>
              <a href="#reels-tester">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold px-6 py-3.5 text-sm border-border">
                  <Film className="w-4 h-4 text-primary mr-1" />
                  <span>Test Live Reels Engine</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Tactile Stickers & Online-Sourced Animated Bot Sticker (4 cols) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-center gap-4 pt-2">
            {/* Live Animated Coding Bot Sticker from Online Asset Search */}
            <TactileSticker variant="animated-bot" rotation={-2} />

            {/* Holographic Rotating Technical Seal Sticker */}
            <TactileSticker variant="seal" rotation={2.5} />
          </div>
        </div>

        {/* ----------------------------------------------------
            THE HERO WOW FACTOR: LIVE INTERACTIVE AGENT COCKPIT
            ---------------------------------------------------- */}
        <div id="cockpit" className="clay-surface border-2 border-border p-5 sm:p-7 relative overflow-hidden bg-surface shadow-clay-card">
          {/* Cockpit Sub-Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-danger inline-block border border-border" />
                <span className="w-3 h-3 rounded-full bg-amber-approval inline-block border border-border" />
                <span className="w-3 h-3 rounded-full bg-success inline-block border border-border" />
              </div>
              <div className="h-4 w-px bg-border mx-1" />
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-ink">
                <Bot className="w-4 h-4 text-primary" />
                <span>qwenton-cockpit://fleet.dispatch</span>
              </div>
            </div>

            {/* Operation Selector Chips (Solid States) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { id: 'reels', label: 'Reels Comment-to-DM', icon: Instagram },
                  { id: 'intel', label: 'Competitor Intelligence', icon: Search },
                  { id: 'away', label: 'Away Mode Assistant', icon: Radio },
                  { id: 'swarm', label: '4-Agent Swarm', icon: Layers },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCockpitOp === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCockpitOp(tab.id);
                      setCockpitApprovalState('pending');
                    }}
                    className={`px-3 py-1.5 rounded-control text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-ink text-white dark:bg-surface-inset dark:text-ink border border-primary shadow-clay-button'
                        : 'bg-canvas text-ink-muted hover:text-ink border border-border'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-ink-muted'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Dual-Stage Cockpit Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Command Intent & Telemetry Trace (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-card bg-canvas border border-border space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-ink uppercase tracking-wider">{currentOp.opId}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {currentOp.channel}
                  </Badge>
                </div>

                <div className="text-sm font-bold text-ink">{currentOp.title}</div>
                <p className="text-xs text-ink-muted leading-relaxed">{currentOp.actionSummary}</p>

                {/* Live Keyword Input Modifier for Reels */}
                {activeCockpitOp === 'reels' && (
                  <div className="pt-2 border-t border-border flex items-center gap-2">
                    <label className="text-xs font-bold text-ink font-mono shrink-0">TRIGGER_KEYWORD:</label>
                    <input
                      type="text"
                      value={cockpitTriggerKeyword}
                      onChange={(e) => setCockpitTriggerKeyword(e.target.value.toUpperCase())}
                      className="px-3 py-1 bg-surface border border-border rounded-md font-mono text-xs font-bold text-primary uppercase focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-[11px] text-ink-muted">(Followers comment this word)</span>
                  </div>
                )}
              </div>

              {/* Real-time Execution Steps Trace */}
              <div className="p-4 rounded-card bg-surface border border-border space-y-2.5 font-mono text-xs shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-ink-muted border-b border-border pb-1.5 font-bold">
                  <span>EXECUTION TELEMETRY TRACE</span>
                  <span className="text-success flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Handshake Verified
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-start gap-2 text-ink">
                    <span className="text-primary font-bold">[01]</span>
                    <span>Ingest inbound webhook event & verify HMAC-SHA256 signature</span>
                  </div>
                  <div className="flex items-start gap-2 text-ink">
                    <span className="text-primary font-bold">[02]</span>
                    <span>
                      Pattern match keyword:{' '}
                      <strong className="text-primary">&quot;{activeCockpitOp === 'reels' ? cockpitTriggerKeyword : 'AUDIT'}&quot;</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-ink">
                    <span className="text-primary font-bold">[03]</span>
                    <span>
                      Apply anti-ban delay jitter: <strong className="text-ink">{currentOp.metrics.jitterGuard}</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-ink">
                    <span className="text-primary font-bold">[04]</span>
                    <span>Compose Meta Graph API v20.0 private reply and comment response</span>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE HUMAN-IN-THE-LOOP APPROVAL GATEWAY */}
              <div className="p-4 rounded-card bg-ink text-white dark:bg-surface dark:text-ink dark:border dark:border-border space-y-3 shadow-clay-button-subtle">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                      Human-in-the-Loop Approval Gate
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 dark:bg-primary/10 text-white dark:text-primary font-bold">
                    FIREWALL: ACTIVE
                  </span>
                </div>

                <p className="text-xs text-white/80 dark:text-ink-muted leading-relaxed font-sans">
                  Action paused: Requires human operator sign-off before external Meta Graph API / Telegram dispatch.
                </p>

                <div className="flex items-center gap-2.5 pt-1">
                  {cockpitApprovalState === 'pending' ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          setCockpitExecuting(true);
                          setTimeout(() => {
                            setCockpitApprovalState('approved');
                            setCockpitExecuting(false);
                          }, 300);
                        }}
                        isLoading={cockpitExecuting}
                        className="bg-primary hover:bg-brand-hover text-black font-extrabold text-xs px-4 shadow-clay-button"
                      >
                        <Check className="w-3.5 h-3.5 mr-1 text-black" />
                        <span>Authorize & Dispatch</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCockpitApprovalState('rejected')}
                        className="text-white dark:text-ink border-white/20 dark:border-border hover:bg-white/10 font-bold text-xs"
                      >
                        Reject
                      </Button>
                    </>
                  ) : cockpitApprovalState === 'approved' ? (
                    <div className="p-2 bg-success/20 border border-success/40 rounded-md text-success text-xs font-mono font-bold flex items-center justify-between w-full">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        [AUTHORIZED: DISPATCHED OVER HTTP IN {currentOp.metrics.latency}]
                      </span>
                      <button
                        onClick={() => setCockpitApprovalState('pending')}
                        className="text-[10px] underline text-ink hover:opacity-80"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <div className="p-2 bg-danger/20 border border-danger/40 rounded-md text-danger text-xs font-mono font-bold flex items-center justify-between w-full">
                      <span>[REJECTED: MUTATION HALTED]</span>
                      <button
                        onClick={() => setCockpitApprovalState('pending')}
                        className="text-[10px] underline text-ink hover:opacity-80"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Live Deliverable Mockup (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-card bg-canvas border border-border space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-border pb-2">
                  <span className="font-mono font-bold text-ink">DELIVERABLE ARTIFACT</span>
                  <span className="text-[10px] text-ink-muted font-mono">{currentOp.metrics.executionTier}</span>
                </div>

                {/* Smartphone Preview Frame */}
                <div className="bg-ink p-4 rounded-hero text-white space-y-3 shadow-clay-card border border-border">
                  <div className="flex items-center justify-between text-[11px] text-white/50 border-b border-white/10 pb-2 font-mono">
                    <span className="flex items-center gap-1 text-white font-bold">
                      <Instagram className="w-3.5 h-3.5 text-primary" /> @qwenton_official
                    </span>
                    <span>Simulated Screen</span>
                  </div>

                  {/* Public Comment Response */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/50 uppercase">Public Comment Reply:</span>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/90 font-medium">
                      &quot;{currentOp.deliverable.publicReply}&quot;
                    </div>
                  </div>

                  {/* Private DM Response */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono text-primary uppercase">Private 1-to-1 Direct Message:</span>
                    <div className="p-3 rounded-lg bg-primary/20 border border-primary/40 text-xs text-white leading-relaxed font-sans">
                      {currentOp.deliverable.privateDm}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50 font-mono">
                    <span>Latency: {currentOp.metrics.latency}</span>
                    <span className="text-success">Delivery: Confirmed</span>
                  </div>
                </div>

                <div className="text-[11px] text-ink-muted leading-relaxed p-2.5 bg-surface rounded-md border border-border">
                  <strong className="text-ink font-bold">Meta Graph API v20.0 Integration:</strong> Uses Meta&apos;s verified Private Replies endpoint (<code className="font-mono text-primary">POST /&#123;comment_id&#125;/private_replies</code>) allowing direct 1-to-1 messages without existing conversations.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 2: STANDALONE LIVE INSTAGRAM REEL DM TESTER
          Interactive Product Proof: visitors test with own keyword
          ---------------------------------------------------- */}
      <section id="reels-tester" className="max-w-6xl mx-auto px-6 py-16 w-full border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-canvas text-ink font-mono text-xs font-bold mb-3 border border-border">
              <Film className="w-3.5 h-3.5 text-primary" />
              <span>INTERACTIVE PRODUCT PROOF • NO LOGIN REQUIRED</span>
            </div>
            <h2 className="font-fluid-section font-black text-ink tracking-tight mb-3">
              Test the Reel Comment-to-DM Engine Right Now
            </h2>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Enter your Reel link, choose a trigger word (e.g. GROWTH, PRICE, DEMO), type a test follower comment, and verify the instant automated direct message.
            </p>
          </div>

          <TactileSticker variant="hardware" rotation={1.5} className="shrink-0" />
        </div>

        <div className="clay-surface p-6 sm:p-8 bg-surface border border-border shadow-clay-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <label className="block text-xs font-bold font-mono text-ink uppercase mb-1.5">
                Instagram Reel URL
              </label>
              <input
                type="text"
                value={testerReelUrl}
                onChange={(e) => setTesterReelUrl(e.target.value)}
                placeholder="https://instagram.com/reel/C8abc..."
                className="w-full text-xs font-mono px-3.5 py-2.5 bg-canvas border border-border rounded-control text-ink focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono text-ink uppercase mb-1.5">
                Trigger Keyword (Lead Magnet Word)
              </label>
              <input
                type="text"
                value={testerKeyword}
                onChange={(e) => setTesterKeyword(e.target.value.toUpperCase())}
                placeholder="e.g. GROWTH, PRICE, ACCESS"
                className="w-full text-xs font-mono font-bold uppercase px-3.5 py-2.5 bg-canvas border border-border rounded-control text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono text-ink uppercase mb-1.5">
                Simulated Follower Comment
              </label>
              <textarea
                rows={2}
                value={testerComment}
                onChange={(e) => setTesterComment(e.target.value)}
                placeholder="Type a comment that includes your keyword..."
                className="w-full text-xs px-3.5 py-2.5 bg-canvas border border-border rounded-control text-ink focus:outline-none focus:ring-1 focus:ring-primary resize-none font-sans"
              />
            </div>

            <Button
              type="button"
              onClick={handleSimulateReel}
              isLoading={testerSimulating}
              className="w-full py-3 bg-primary hover:bg-brand-hover text-black font-extrabold text-xs uppercase tracking-wider shadow-clay-button gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-black" />
              <span>Simulate Meta Webhook Dispatch</span>
            </Button>
          </div>

          {/* Results Phone Display (6 cols) */}
          <div className="lg:col-span-6 bg-ink text-white p-5 rounded-card border border-border space-y-4 font-mono shadow-clay-button-subtle">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Instagram className="w-4 h-4 text-primary" /> Live Simulation Telemetry
              </span>
              <span className="text-success text-[11px]">
                {testerResult?.matched ? 'MATCHED (200 OK)' : 'NO_MATCH'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-white/50 block mb-1">INCOMING REEL COMMENT:</span>
                <div className="p-2.5 rounded bg-white/5 border border-white/10 text-white/90 font-sans">
                  <strong className="text-primary font-mono">@follower:</strong> &quot;{testerComment}&quot;
                </div>
              </div>

              {testerResult?.matched ? (
                <>
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">AUTOMATED PUBLIC COMMENT REPLY:</span>
                    <div className="p-2.5 rounded bg-white/5 border border-white/10 text-white/90 font-sans">
                      &quot;{testerResult.publicReply}&quot;
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-primary block mb-1">INSTANT DIRECT MESSAGE (DM):</span>
                    <div className="p-3 rounded bg-primary/20 border border-primary/40 text-white font-sans leading-relaxed">
                      {testerResult.privateDm}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded bg-amber-approval/15 border border-amber-approval/30 text-amber-approval text-xs font-sans">
                  The comment does not contain the trigger keyword &quot;{testerKeyword}&quot;. Type a comment with the keyword to test the auto-DM.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span>Latency: {testerResult?.latencyMs || 340}ms</span>
              <Link href="/instagram" className="text-primary hover:underline font-bold">
                Open Full Reels Manager →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 3: INSTANT AGENCY AUDIT SANDBOX (Free Lead Utility)
          ---------------------------------------------------- */}
      <section id="instant-audit" className="max-w-6xl mx-auto px-6 py-16 w-full border-t border-border">
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-canvas text-ink font-mono text-xs font-bold mb-3 border border-border">
            <Search className="w-3.5 h-3.5 text-primary" />
            <span>GROWTH AUDIT ENGINE • ZERO LOGIN NEEDED</span>
          </div>
          <h2 className="font-fluid-section font-black text-ink tracking-tight mb-3">
            5-Second Instant Agency Intelligence Sandbox
          </h2>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            Enter any local business or niche. Our autonomous research agent analyzes competitor reviews, drafts an Instagram strategy, and builds a client outreach pitch in seconds.
          </p>
        </div>

        <InstantAuditSandbox />
      </section>

      {/* ----------------------------------------------------
          SECTION 4: ARCHITECTURAL PILLARS (NO BENTO, NO 3-IN-A-ROW)
          Asymmetric editorial split stage layout
          ---------------------------------------------------- */}
      <section id="architecture" className="max-w-6xl mx-auto px-6 py-20 w-full border-t border-border space-y-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface text-ink font-mono text-xs font-bold mb-3 border border-border">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>TECHNICAL SPECIFICATIONS</span>
          </div>
          <h2 className="font-fluid-section font-black text-ink tracking-tight mb-3">
            Engineered for Production Autonomy
          </h2>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            Four structural systems designed from the ground up for high-conversion social virality, human oversight, and zero infrastructure friction.
          </p>
        </div>

        {/* Pillar 01: Instagram Reels Comment-to-DM */}
        <div className="clay-surface p-8 bg-surface border border-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-clay-card">
          <div className="lg:col-span-7 space-y-4">
            <Badge variant="outline" className="font-mono text-xs font-bold">
              PILLAR 01 • SOCIAL VIRALITY
            </Badge>
            <h3 className="text-2xl font-black text-ink tracking-tight">
              Meta Graph API v20.0 Reels & Private Reply Engine
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Standard marketing platforms require followers to initiate DMs before an automated reply can be sent. Qwenton leverages Meta&apos;s official Private Reply endpoint, empowering creators and agencies to send an instant 1-to-1 direct message whenever someone comments on a Reel.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs pt-2 font-mono">
              <div className="p-3 bg-canvas rounded-md border border-border">
                <span className="text-ink-muted block text-[10px]">ANTI-BAN JITTER</span>
                <strong className="text-ink text-xs">3–7s Randomized Delay</strong>
              </div>
              <div className="p-3 bg-canvas rounded-md border border-border">
                <span className="text-ink-muted block text-[10px]">ROTATING SPINTAX</span>
                <strong className="text-ink text-xs">Non-Repeating Templates</strong>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-ink p-5 rounded-card text-white space-y-3 font-mono text-xs border border-border">
            <div className="text-[10px] text-white/50 border-b border-white/10 pb-2">ENDPOINT CONFIGURATION</div>
            <div className="text-primary font-bold">POST /&#123;comment_id&#125;/private_replies</div>
            <p className="text-white/80 font-sans text-xs leading-relaxed">
              Verified token authentication, HMAC-SHA256 signature verification, and automated Reel quota enforcement (2 Reels on Normal, up to 15 on Ultra).
            </p>
            <div className="pt-2 text-success text-[11px] font-bold">● Rate limit: 150 DMs / hr (Safe threshold)</div>
          </div>
        </div>

        {/* Pillar 02: Human-in-the-Loop Safeguard Firewall */}
        <div className="clay-surface p-8 bg-surface border border-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-clay-card">
          <div className="lg:col-span-5 bg-ink p-5 rounded-card text-white space-y-3 font-mono text-xs border border-border order-2 lg:order-1">
            <div className="text-[10px] text-primary border-b border-white/10 pb-2 flex items-center justify-between">
              <span>FIREWALL PROTOCOL</span>
              <span>GATE: ENFORCED</span>
            </div>
            <div className="text-white font-bold">Mutating Actions Intercepted:</div>
            <div className="space-y-1 text-white/80 text-[11px]">
              <div>• Publishing ad creatives to Meta Ads Manager</div>
              <div>• Sending client emails or bulk Telegram broadcasts</div>
              <div>• Modifying live application code or database records</div>
            </div>
            <div className="pt-2 text-primary text-[11px] font-bold">● Zero unsupervised mutations</div>
          </div>
          <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
            <Badge variant="outline" className="font-mono text-xs font-bold">
              PILLAR 02 • TRUST & SECURITY
            </Badge>
            <h3 className="text-2xl font-black text-ink tracking-tight">
              Strict Human-in-the-Loop Governance Firewall
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Unlike fully autonomous agents that can hallucinate and publish errant campaigns or spam clients, Qwenton isolates read operations from write operations. Any action that communicates externally pauses for explicit human sign-off via your desktop dashboard or Telegram push notification.
            </p>
            <div className="pt-1">
              <Link href="/approvals" className="text-xs font-bold text-primary hover:underline font-mono">
                View Live Approvals Inbox →
              </Link>
            </div>
          </div>
        </div>

        {/* Pillar 03: 24/7 Mobile Operations via Telegram */}
        <div className="clay-surface p-8 bg-surface border border-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-clay-card">
          <div className="lg:col-span-7 space-y-4">
            <Badge variant="outline" className="font-mono text-xs font-bold">
              PILLAR 03 • MOBILE COMMAND
            </Badge>
            <h3 className="text-2xl font-black text-ink tracking-tight">
              24/7 Telegram Coworker Bot & Away Mode Assistant
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Manage your agency without sitting at a laptop. Connect your private Telegram bot to receive real-time lead alerts, approve scheduled campaigns with 1-tap inline buttons, and send voice notes for instant transcription and task delegation while traveling.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs pt-2 font-mono">
              <div className="p-3 bg-canvas rounded-md border border-border">
                <span className="text-ink-muted block text-[10px]">AWAY MODE</span>
                <strong className="text-ink text-xs">24/7 Inbound Triage</strong>
              </div>
              <div className="p-3 bg-canvas rounded-md border border-border">
                <span className="text-ink-muted block text-[10px]">APPROVALS</span>
                <strong className="text-ink text-xs">1-Tap Inline Push</strong>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-ink p-5 rounded-card text-white space-y-3 font-mono text-xs border border-border">
            <div className="text-[10px] text-white/50 border-b border-white/10 pb-2">TELEGRAM WEBHOOK GATEWAY</div>
            <div className="text-primary font-bold">Live Push Telemetry</div>
            <p className="text-white/80 font-sans text-xs leading-relaxed">
              &quot;Founder approved: Dispatching scheduled Instagram carousel and updating Q3 competitive briefing in datastore.&quot;
            </p>
            <div className="pt-2 text-success text-[11px] font-bold">● Connected: 1 Telegram Bot (Normal) / 5 (Ultra)</div>
          </div>
        </div>

        {/* Pillar 04: Zero-Docker Architecture */}
        <div className="clay-surface p-8 bg-surface border border-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-clay-card">
          <div className="lg:col-span-5 bg-ink p-5 rounded-card text-white space-y-3 font-mono text-xs border border-border order-2 lg:order-1">
            <div className="text-[10px] text-white/50 border-b border-white/10 pb-2">DUAL-MODE PERSISTENCE</div>
            <div className="text-white font-bold">Local Datastore + Cloud Sync</div>
            <p className="text-white/80 font-sans text-xs leading-relaxed">
              Zero Docker setup. Zero required databases during local development. Automatic cloud synchronization when deploying to Vercel and Firebase in production.
            </p>
            <div className="pt-2 text-success text-[11px] font-bold">● Next.js 15 App Router • TypeScript 5.7</div>
          </div>
          <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
            <Badge variant="outline" className="font-mono text-xs font-bold">
              PILLAR 04 • CLOUD NATIVE
            </Badge>
            <h3 className="text-2xl font-black text-ink tracking-tight">
              Zero-Docker Cloud Native Infrastructure
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Legacy platforms mandate complicated Docker daemon environments or charge $20/month per agent for slow Linux sandbox containers. Qwenton is completely serverless: fast HTTP Route Handlers on Vercel, lightweight JSON datastores for edge execution, and single-key cloud routing.
            </p>
            <div className="pt-1">
              <Link href="/integrations" className="text-xs font-bold text-primary hover:underline font-mono">
                Explore 50+ Integrations Vault →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 5: HIGH-DENSITY TECHNICAL SPECIFICATIONS TABLE
          ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 py-16 w-full border-t border-border">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-canvas text-ink font-mono text-xs font-bold mb-3 border border-border">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>ARCHITECTURAL BENCHMARK</span>
          </div>
          <h2 className="font-fluid-section font-black text-ink tracking-tight mb-3">
            Qwenton vs. Legacy AI Platforms
          </h2>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            Comparing core infrastructure, social lead generation capabilities, and operating costs.
          </p>
        </div>

        <div className="clay-surface bg-surface border border-border overflow-x-auto shadow-clay-card">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-canvas border-b border-border text-ink uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Feature Dimension</th>
                <th className="py-3 px-4 text-primary">Qwenton Fleet</th>
                <th className="py-3 px-4 text-ink-muted">Skydive.com</th>
                <th className="py-3 px-4 text-ink-muted">Generic AI Wrappers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-ink">
              <tr>
                <td className="py-3.5 px-4 font-bold">Reels Comment-to-DM Engine</td>
                <td className="py-3.5 px-4 text-success font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Meta v20.0 Private Replies
                </td>
                <td className="py-3.5 px-4 text-ink-muted">None (Ticketing only)</td>
                <td className="py-3.5 px-4 text-ink-muted">None</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold">Infrastructure Cost</td>
                <td className="py-3.5 px-4 text-success font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> INR 0 / mo Serverless
                </td>
                <td className="py-3.5 px-4 text-danger font-medium">$20+ / mo per Linux sandbox</td>
                <td className="py-3.5 px-4 text-ink-muted">$19–$49 / mo</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold">Human Approval Gate</td>
                <td className="py-3.5 px-4 text-success font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Desktop + 1-Tap Telegram
                </td>
                <td className="py-3.5 px-4 text-ink-muted">Web notifications only</td>
                <td className="py-3.5 px-4 text-danger">No approval firewall</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold">Multi-Model Support</td>
                <td className="py-3.5 px-4 text-success font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Flexible Multi-Provider Routing
                </td>
                <td className="py-3.5 px-4 text-ink-muted">Locked frontier models</td>
                <td className="py-3.5 px-4 text-ink-muted">Single provider lock-in</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold">Design Aesthetics</td>
                <td className="py-3.5 px-4 text-primary font-bold">
                  Tri-Color 60-30-10 Solid (90% Carbon Slate + 10% Cyber Mint)
                </td>
                <td className="py-3.5 px-4 text-ink-muted">Generic dark template</td>
                <td className="py-3.5 px-4 text-ink-muted">Overused AI purple glows</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 6: 4-TIER TRANSPARENT PRICING GRID
          ---------------------------------------------------- */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 w-full border-t border-border">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface text-ink font-mono text-xs font-bold mb-3 border border-border">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>TRANSPARENT 4-TIER SUBSCRIPTION ARCHITECTURE</span>
          </div>
          <h2 className="font-fluid-section font-black text-ink tracking-tight mb-3">
            Scale From Solo Creator to Enterprise Agency
          </h2>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            Predictable pricing in Indian Rupees. Upgrade or downgrade anytime with instant quota provisioning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Tier 1: Normal (Free Forever) */}
          <div className="clay-surface p-6 bg-surface border border-border flex flex-col justify-between hover:shadow-clay-card-hover transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-ink-muted uppercase">TIER 01</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  FREE
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-black text-ink">Normal Plan</h3>
                <div className="text-2xl font-black text-ink mt-1">INR 0</div>
                <p className="text-xs text-ink-muted mt-1">Free forever for solo founders</p>
              </div>
              <div className="space-y-2 text-xs font-mono border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>2 Active AI Coworkers</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink font-bold text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>2 Connected Instagram Reels</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>50 Automation Runs / mo</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>1 Telegram Bot Connection</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Human Approvals Firewall</span>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <Link href="/signup">
                <Button size="sm" variant="outline" className="w-full font-bold text-xs border-border">
                  Deploy Free Agents
                </Button>
              </Link>
            </div>
          </div>

          {/* Tier 2: Lite Coworker */}
          <div className="clay-surface p-6 bg-surface border border-border flex flex-col justify-between hover:shadow-clay-card-hover transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-ink-muted uppercase">TIER 02</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  CREATOR
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-black text-ink">Lite Coworker</h3>
                <div className="text-2xl font-black text-ink mt-1">
                  INR 99 <span className="text-xs font-normal text-ink-muted">/ mo</span>
                </div>
                <p className="text-xs text-ink-muted mt-1">For active content creators</p>
              </div>
              <div className="space-y-2 text-xs font-mono border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>4 Active AI Coworkers</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink font-bold text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>4 Connected Instagram Reels</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>300 Automation Runs / mo</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Priority Model Streaming</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>100MB File Knowledge Base</span>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <Link href="/billing">
                <Button size="sm" variant="outline" className="w-full font-bold text-xs border-border">
                  Upgrade to Lite
                </Button>
              </Link>
            </div>
          </div>

          {/* Tier 3: Pro Coworker */}
          <div className="clay-surface p-6 bg-surface border-2 border-primary flex flex-col justify-between hover:shadow-clay-card-hover transition-all relative">
            <div className="absolute -top-3 right-4 bg-primary text-black font-mono text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
              MOST POPULAR
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary uppercase">TIER 03</span>
                <Badge variant="outline" className="text-[10px] font-mono border-primary text-primary">
                  AGENCY
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-black text-ink">Pro Coworker</h3>
                <div className="text-2xl font-black text-ink mt-1">
                  INR 299 <span className="text-xs font-normal text-ink-muted">/ mo</span>
                </div>
                <p className="text-xs text-ink-muted mt-1">For boutique agencies</p>
              </div>
              <div className="space-y-2 text-xs font-mono border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>9 Active AI Coworkers</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink font-bold text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>9 Connected Instagram Reels</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>1,000 Automation Runs / mo</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>3 Telegram Bot Channels</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Scheduled Background Routines</span>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <Link href="/billing">
                <Button size="sm" className="w-full font-extrabold text-xs bg-primary text-black hover:bg-brand-hover shadow-clay-button">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>

          {/* Tier 4: Ultra Business */}
          <div className="clay-surface p-6 bg-surface border border-border flex flex-col justify-between hover:shadow-clay-card-hover transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-ink-muted uppercase">TIER 04</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  ENTERPRISE
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-black text-ink">Ultra Business</h3>
                <div className="text-2xl font-black text-ink mt-1">
                  INR 599 <span className="text-xs font-normal text-ink-muted">/ mo</span>
                </div>
                <p className="text-xs text-ink-muted mt-1">For high-velocity operations</p>
              </div>
              <div className="space-y-2 text-xs font-mono border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>15 Dedicated AI Coworkers</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink font-bold text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>15 Connected Instagram Reels</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>5,000 Automation Runs / mo</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>5 Telegram Bot Connections</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Multi-Agent Swarm Orchestration</span>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <Link href="/billing">
                <Button size="sm" variant="outline" className="w-full font-bold text-xs border-border">
                  Deploy Ultra Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 7: TECHNICAL FAQ ACCORDION (Clean Typography)
          ---------------------------------------------------- */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-16 w-full border-t border-border">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="font-mono text-xs font-bold mb-3">
            FREQUENTLY ASKED QUESTIONS
          </Badge>
          <h2 className="font-fluid-section font-black text-ink tracking-tight">
            Clear Answers for Operators & Engineers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="clay-surface bg-surface border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-ink hover:bg-canvas transition-colors"
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
          SECTION 8: CLOSING CONVERSION BANNER & LEGAL FOOTER
          ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="p-8 sm:p-12 rounded-hero bg-ink text-white dark:bg-surface dark:text-ink flex flex-col md:flex-row items-center justify-between gap-8 shadow-clay-card border border-border">
          <div className="space-y-3 max-w-xl">
            <Badge variant="outline" className="text-white dark:text-ink border-white/20 dark:border-border font-mono text-[10px]">
              GET STARTED IN 60 SECONDS
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white dark:text-ink tracking-tight">
              Deploy Your First Autonomous Coworker Today
            </h2>
            <p className="text-xs sm:text-sm text-white/70 dark:text-ink-muted leading-relaxed font-normal">
              Activate your free Normal plan. Automate 2 Instagram Reels, connect a private Telegram bot, and run 50 autonomous workflows per month with full human-in-the-loop protection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-extrabold px-8 py-3.5 text-xs bg-primary text-black hover:bg-brand-hover shadow-clay-button uppercase tracking-wider">
                Deploy 2 Free Agents →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Clean Technical Footer with Legal Links & Theme Toggle */}
      <footer className="border-t border-border bg-surface py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-ink-muted font-mono">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-ink text-white dark:bg-canvas dark:text-ink flex items-center justify-center font-bold text-xs border border-border">
              Q
            </div>
            <span>© {new Date().getFullYear()} Qwenton Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-ink hover:underline transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-ink hover:underline transition-colors">
              Privacy Policy
            </Link>
            <span className="text-primary font-bold">● 90% Dark Carbon + 10% Cyber Mint</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
