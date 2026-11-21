'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  GitFork,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  Database,
  Menu,
  X,
  Lock,
  Server,
  HelpCircle,
  Building,
  Briefcase,
  TrendingUp,
  Code2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AllRounderStudioShowcase } from '@/components/landing/AllRounderStudioShowcase';
import { Hero3DExperience } from '@/components/landing/Hero3DExperience';
import { ScrollProgressBar } from '@/components/landing/ScrollProgressBar';

export default function LandingPage() {
  // Mobile Nav Drawer Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Section 4: Department Workflows State
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'sales' | 'support' | 'research' | 'pipeline'>('sales');
  const [isSimulatingWorkflow, setIsSimulatingWorkflow] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simulationApproved, setSimulationApproved] = useState<boolean>(false);

  // Section 8: Pricing Billing Cycle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Section 9: FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Department Workflow Simulation Handler
  const handleRunDepartmentSimulation = () => {
    if (isSimulatingWorkflow) return;
    setIsSimulatingWorkflow(true);
    setSimulationStep(1);
    setSimulationApproved(false);

    setTimeout(() => setSimulationStep(2), 600);
    setTimeout(() => setSimulationStep(3), 1200);
    setTimeout(() => {
      setSimulationStep(4); // Staged at firewall gate
      setIsSimulatingWorkflow(false);
    }, 1800);
  };

  const handleApproveGatedAction = () => {
    setSimulationApproved(true);
    setSimulationStep(5);
  };

  // 4 Department Workflows Data
  const departmentWorkflows = {
    sales: {
      name: 'Sales & Lead Conversion',
      icon: TrendingUp,
      trigger: 'Inbound Lead via Webhook or Typeform',
      avgDuration: '1.8s',
      tokenCost: '$0.014',
      safetyGate: '1 Required Approval',
      steps: [
        {
          num: 1,
          role: 'Enrichment Agent',
          action: 'Pulls firmographic data, LinkedIn company profile, and annual revenue estimate.',
          status: 'Automated',
        },
        {
          num: 2,
          role: 'CRM Sync Node',
          action: 'Creates company & contact record in CRM with verified lead score of 88/100.',
          status: 'Automated',
        },
        {
          num: 3,
          role: 'Drafter Agent',
          action: 'Composes hyper-personalized outreach email referencing recent funding round.',
          status: 'Automated',
        },
        {
          num: 4,
          role: 'Approval Firewall',
          action: 'PROTECTED ACTION GATED: Halts external email dispatch until SDR lead reviews payload.',
          status: 'Gated at Firewall',
          isGate: true,
        },
        {
          num: 5,
          role: 'Multi-Channel Dispatch',
          action: 'Email dispatched via SendGrid upon human sign-off; follow-up task scheduled in 3 days.',
          status: 'Executed on Approval',
        },
      ],
    },
    support: {
      name: 'Customer Support Triage',
      icon: HelpCircle,
      trigger: 'Zendesk / Intercom Inbound Ticket #8921',
      avgDuration: '2.2s',
      tokenCost: '$0.019',
      safetyGate: 'Financial Gate Active',
      steps: [
        {
          num: 1,
          role: 'Classification Agent',
          action: 'Classifies intent (Billing Discrepancy), sentiment (Frustrated), and priority (P1-High).',
          status: 'Automated',
        },
        {
          num: 2,
          role: 'Knowledge Hub Search',
          action: 'Semantic vector search across refund policy knowledge base and internal billing docs.',
          status: 'Automated',
        },
        {
          num: 3,
          role: 'Resolution Drafter',
          action: 'Formats accurate response with transaction references and clear next steps.',
          status: 'Automated',
        },
        {
          num: 4,
          role: 'Approval Firewall',
          action: 'FINANCIAL MUTATION GATED: Refund credit ($49.00) routed to Billing Manager for 1-click approval.',
          status: 'Gated at Firewall',
          isGate: true,
        },
        {
          num: 5,
          role: 'Stripe & Ticket Resolution',
          action: 'Approved credit applied to Stripe; verified answer posted to customer ticket.',
          status: 'Executed on Approval',
        },
      ],
    },
    research: {
      name: 'Competitive Research Swarm',
      icon: Search,
      trigger: 'Scheduled Weekly or Ad-Hoc Executive Prompt',
      avgDuration: '4.6s',
      tokenCost: '$0.028',
      safetyGate: 'Loop Prevention Monitored',
      steps: [
        {
          num: 1,
          role: 'Coordinator Agent',
          action: 'Breaks brief into 3 sub-assignments: Feature Matrix, Pricing Changes, Customer Sentiment.',
          status: 'Automated',
        },
        {
          num: 2,
          role: 'Parallel Specialist Agents',
          action: 'Agent A scrapes changelogs; Agent B monitors pricing tables; Agent C synthesizes G2 reviews.',
          status: 'Automated',
        },
        {
          num: 3,
          role: 'Aggregator Agent',
          action: 'Synthesizes outputs into a 2-page Markdown Executive Brief with 14 verified citations.',
          status: 'Automated',
        },
        {
          num: 4,
          role: 'Approval Firewall',
          action: 'DISTRIBUTION GATED: Holds executive summary for Chief Product Officer review before Slack broadcast.',
          status: 'Gated at Firewall',
          isGate: true,
        },
        {
          num: 5,
          role: 'Knowledge Hub Archival',
          action: 'Indexes report into workspace Knowledge Base and notifies leadership team in Slack.',
          status: 'Executed on Approval',
        },
      ],
    },
    pipeline: {
      name: 'API & Data Pipeline Sync',
      icon: Database,
      trigger: 'PostgreSQL CDC Event / Stripe Webhook',
      avgDuration: '0.9s',
      tokenCost: '$0.008',
      safetyGate: 'Zero Data-Loss Idempotency',
      steps: [
        {
          num: 1,
          role: 'Validation Node',
          action: 'Schema-checks payload against Zod contract; rejects malformed inputs.',
          status: 'Automated',
        },
        {
          num: 2,
          role: 'Code Transform Node',
          action: 'Python snippet normalizes currency, timestamps, and customer metadata.',
          status: 'Automated',
        },
        {
          num: 3,
          role: 'Data Warehouse Load',
          action: 'Pushes normalized transaction records to Snowflake / BigQuery.',
          status: 'Automated',
        },
        {
          num: 4,
          role: 'Approval Firewall',
          action: 'MUTATION AUDIT: Database schema alteration or high-volume batch held for DBA verification.',
          status: 'Gated at Firewall',
          isGate: true,
        },
        {
          num: 5,
          role: 'Delivery Confirmation',
          action: 'Transaction committed with cryptographic checksum and zero data loss.',
          status: 'Executed on Approval',
        },
      ],
    },
  };

  const currentWorkflow = departmentWorkflows[activeWorkflowTab];

  // 6 Comprehensive FAQs
  const faqs = [
    {
      q: 'How does the Human Approval Firewall prevent autonomous agents from making costly mistakes?',
      a: 'Unlike generic agent frameworks that execute external actions immediately, Qwenton’s Approval Firewall intercepts any protected action (such as sending an email to a customer, updating a CRM record, or modifying database rows) at the server layer. The action remains pending with an immutable payload preview until an authorized human reviews and clicks ‘Approve’. If anything looks incorrect, the reviewer can reject or edit the draft in real time.',
    },
    {
      q: 'Can I use Qwenton without writing code or hiring software engineers?',
      a: 'Absolutely. Agent Studio allows you to create fully functional agents simply by describing your business goal in plain English. The platform automatically configures the triggers, required tools, and safe defaults. For visual builders, Workflow Studio provides an intuitive drag-and-drop canvas with pre-built nodes and templates.',
    },
    {
      q: 'Does Qwenton support inbound or outbound phone calls and telephony CRM?',
      a: 'No. In accordance with our core product principles, Qwenton intentionally excludes call-management CRM, PBX phone queues, call recording, and voice dialers. We focus exclusively on high-reliability digital operations: email, CRM systems, helpdesks, webhooks, databases, spreadsheets, and internal knowledge bases.',
    },
    {
      q: 'Which AI models and LLM providers does Qwenton connect to?',
      a: 'Qwenton is model-agnostic. You can deploy agents powered by Anthropic Claude 3.5, OpenAI GPT-4o, Google Gemini 2.0, or self-hosted open-weight models via local endpoints. You can mix and match models across different steps in a single workflow to optimize for speed, intelligence, or token cost.',
    },
    {
      q: 'How does Qwenton guarantee that my company’s private data remains secure?',
      a: 'We enforce strict multi-tenant isolation at the database and server layers. Your documents in the Knowledge Hub are encrypted at rest and in transit, and access permissions are strictly validated before any agent can retrieve them. API keys and service credentials are stored in server-only vaults and are never exposed to client browsers.',
    },
    {
      q: 'How do Multi-Agent Workforce Swarms work in practice?',
      a: 'In a Swarm, an executive Coordinator Agent breaks a complex goal into specialized sub-tasks and delegates them to dedicated agents (such as a Researcher, a Copywriter, and a Compliance Reviewer). The specialist agents work in parallel and hand off structured intermediate results back to the coordinator. Built-in cycle detection guarantees agents never get trapped in infinite loops.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-plum-light selection:text-plum-deep">
      <ScrollProgressBar />

      {/* -------------------------------------------------------------------------
          SECTION 1: GLOBAL NAVIGATION BAR
          ------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full bg-surface-white/90 backdrop-blur-md border-b border-border-subtle shadow-clay-button-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Agentic Badge */}
          <Link href="/" className="flex items-center gap-2.5 select-none py-2 min-h-[48px]">
            <div className="w-8 h-8 rounded-control bg-primary text-white flex items-center justify-center font-bold text-base shadow-clay-button border border-plum-deep/30">
              Q
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-ink">Qwenton</span>
              <span className="hidden sm:inline-block text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-sage-light text-sage-dark border border-sage-border">
                All-Rounder AI v2.4
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-ink-muted">
            <a href="#pillars" className="hover:text-ink transition-colors min-h-[44px] flex items-center">
              Pillars
            </a>
            <a href="#workflows" className="hover:text-ink transition-colors min-h-[44px] flex items-center">
              Workflows (3D)
            </a>
            <a href="#solutions" className="hover:text-ink transition-colors min-h-[44px] flex items-center">
              Solutions
            </a>
            <a href="#governance" className="hover:text-ink transition-colors min-h-[44px] flex items-center">
              Governance
            </a>
            <a href="#pricing" className="hover:text-ink transition-colors min-h-[44px] flex items-center">
              Pricing
            </a>
            <a href="#faq" className="hover:text-ink transition-colors min-h-[44px] flex items-center">
              FAQ
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-ink-muted hover:text-ink px-4 py-2.5 rounded-control transition-colors min-h-[48px] flex items-center"
            >
              Sign In
            </Link>
            <Link href="/dashboard">
              <Button size="md" className="min-h-[48px] font-bold">
                Launch Studio
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-control text-ink-muted hover:text-ink hover:bg-surface-panel min-h-[48px] min-w-[48px] flex items-center justify-center border border-border-subtle"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden p-4 bg-surface-white border-b border-border-subtle shadow-clay-card flex flex-col gap-2">
            <a
              href="#pillars"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-control text-sm font-bold text-ink hover:bg-surface-panel min-h-[48px] flex items-center"
            >
              Platform Pillars
            </a>
            <a
              href="#workflows"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-control text-sm font-bold text-ink hover:bg-surface-panel min-h-[48px] flex items-center"
            >
              Department Workflows (3D)
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-control text-sm font-bold text-ink hover:bg-surface-panel min-h-[48px] flex items-center"
            >
              Customer Solutions
            </a>
            <a
              href="#governance"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-control text-sm font-bold text-ink hover:bg-surface-panel min-h-[48px] flex items-center"
            >
              Human Governance
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-control text-sm font-bold text-ink hover:bg-surface-panel min-h-[48px] flex items-center"
            >
              Pricing Tiers
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 rounded-control text-sm font-bold text-ink hover:bg-surface-panel min-h-[48px] flex items-center"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-control text-sm font-bold text-ink hover:bg-surface-panel border border-border-subtle min-h-[48px] flex items-center justify-center"
              >
                Sign In
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button size="lg" className="w-full min-h-[48px] font-bold">
                  Launch Studio
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* -------------------------------------------------------------------------
          SECTION 2: HERO STAGE & VALUE PROPOSITION
          ------------------------------------------------------------------------- */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Eyebrow Badge */}
          <div className="mb-6 animate-hero-eyebrow">
            <Badge variant="success" className="px-3.5 py-1 text-xs">
              ● Production-Ready Multi-Agent Orchestration
            </Badge>
          </div>

          {/* Core Verbatim Positioning Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight max-w-5xl leading-[1.12] animate-hero-headline">
            One workspace to build AI agents, connect business systems, automate processes, coordinate teams of agents, and govern every important action.
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-base sm:text-xl text-ink-muted max-w-3xl leading-relaxed animate-hero-subhead">
            Replace brittle point-tool bots with an enterprise workforce. Build autonomous agents with natural language, design visual multi-step workflows, deploy coordinated swarms across departments, and maintain 100% human control with our server-enforced Approval Firewall.
          </p>

          {/* Call-to-Action Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-hero-cta">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto min-h-[48px] text-base px-8 font-bold shadow-clay-button">
                Start Building Free →
              </Button>
            </Link>
            <a href="#showcase" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto min-h-[48px] text-base px-6 font-bold shadow-clay-button-subtle"
              >
                Explore Interactive Showcase ↓
              </Button>
            </a>
          </div>

          {/* Trust & Assurance Pill Strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono text-ink-muted animate-hero-pills">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-white border border-border-subtle shadow-clay-button-subtle">
              <Check className="w-3.5 h-3.5 text-sage-dark" />
              <span>Zero-Risk Sandbox Execution</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-white border border-border-subtle shadow-clay-button-subtle">
              <Check className="w-3.5 h-3.5 text-sage-dark" />
              <span>Human-in-the-Loop Approval Firewall</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-white border border-border-subtle shadow-clay-button-subtle">
              <Check className="w-3.5 h-3.5 text-sage-dark" />
              <span>Multi-Tenant Workspace Isolation</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-white border border-border-subtle shadow-clay-button-subtle">
              <Check className="w-3.5 h-3.5 text-sage-dark" />
              <span>Zero Telephony Clutter — 100% Digital Business Ops</span>
            </div>
          </div>

          {/* Spatial 3D Hero Mesh Experience */}
          <div className="w-full mt-10 sm:mt-14 max-w-5xl animate-hero-3d">
            <Hero3DExperience />
          </div>

          {/* Interactive Centerpiece Component */}
          <div id="showcase" className="w-full mt-14 sm:mt-20">
            <AllRounderStudioShowcase />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SECTION 3: THE 4 CORE PLATFORM PILLARS (WITH 3D PERSPECTIVE DEPTH)
          ------------------------------------------------------------------------- */}
      <section id="pillars" className="py-16 sm:py-24 bg-surface-panel border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono font-bold text-plum uppercase tracking-wider block mb-2">
              FOUNDATIONAL ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Four Pillars. One Autonomous Workforce Platform.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink-muted">
              Every agent, tool, workflow, and approval checkpoint operates as a composable building block within an isolated, enterprise-grade environment.
            </p>
          </div>

          {/* 2x2 Grid of Raised Clay Cards with 3D Tilt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 perspective-container">
            {/* Pillar 1: Agent Studio */}
            <div className="p-6 sm:p-8 rounded-card bg-surface-white border border-border-subtle shadow-clay-card hover:shadow-clay-card-hover transition-all clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-12 h-12 rounded-panel bg-plum-light border border-plum-border flex items-center justify-center text-plum-deep mb-5">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-plum block uppercase tracking-wider mb-1">
                  NATURAL LANGUAGE TO AGENT
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-ink mb-3">Natural-Language Agent Studio</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">
                  Describe the desired business outcome in plain English. Agent Studio generates an inspectable configuration including triggers, allowed system tools, knowledge boundaries, and strict output schemas. Never writes code or assumes permissions without your explicit approval.
                </p>
                <ul className="space-y-2 text-xs font-medium text-ink">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Guided prompt-to-agent compiler with assumption checklist</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Granular action-level permissions (Read, Draft, Write, Send, Delete)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Live interactive sandbox with sample inputs, token cost, and trace logs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 2: Workflow Studio */}
            <div className="p-6 sm:p-8 rounded-card bg-surface-white border border-border-subtle shadow-clay-card hover:shadow-clay-card-hover transition-all clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-12 h-12 rounded-panel bg-sage-light border border-sage-border flex items-center justify-center text-sage-dark mb-5">
                  <GitFork className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-sage-dark block uppercase tracking-wider mb-1">
                  VISUAL GRAPH ORCHESTRATION
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-ink mb-3">Composable Visual Workflow Studio</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">
                  Design mission-critical processes on an infinite node canvas. Chain triggers, LLMs, condition branches, code execution nodes, database connectors, and approval checkpoints with typed schema validation and zero data-loss guarantees.
                </p>
                <ul className="space-y-2 text-xs font-medium text-ink">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>15+ node types including Webhooks, Code (Python/TS), and MCP Tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>AI Builder converts natural-language instructions into visual graphs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Schema-aware ports detect incompatible data formats before execution</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 3: Agent Workforce Swarms */}
            <div className="p-6 sm:p-8 rounded-card bg-surface-white border border-border-subtle shadow-clay-card hover:shadow-clay-card-hover transition-all clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-12 h-12 rounded-panel bg-plum-light border border-plum-border flex items-center justify-center text-plum-deep mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-plum block uppercase tracking-wider mb-1">
                  MULTI-AGENT COORDINATION
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-ink mb-3">Autonomous Multi-Agent Swarms</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">
                  Coordinate specialized agents that delegate subtasks, share memory, review each other’s work, and aggregate complex research into structured business briefs. Built-in cycle detection guarantees agents never get stuck in infinite execution loops.
                </p>
                <ul className="space-y-2 text-xs font-medium text-ink">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Hierarchical coordinator-specialist delegation architecture</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Parallel task execution with shared working memory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Swarm-level budget caps and automatic loop termination</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 4: Human Approval Firewall */}
            <div className="p-6 sm:p-8 rounded-card bg-surface-white border border-border-subtle shadow-clay-card hover:shadow-clay-card-hover transition-all clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-12 h-12 rounded-panel bg-sage-light border border-sage-border flex items-center justify-center text-sage-dark mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-sage-dark block uppercase tracking-wider mb-1">
                  GOVERNANCE &amp; SAFETY FIRST
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-ink mb-3">Human Approval Firewall</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">
                  Enterprise autonomy requires immutable boundaries. The Approval Firewall intercepts sensitive agent actions—sending external emails, updating CRM records, issuing payments, or mutating databases—and holds them until an authorized person approves.
                </p>
                <ul className="space-y-2 text-xs font-medium text-ink">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Server-authoritative interception immediately prior to external execution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Cryptographic action payload preview and tamper-proof audit hash</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>1-click approvals via Web Dashboard, Slack, or Email notifications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SECTION 4: INTERACTIVE DEPARTMENT WORKFLOWS
          ------------------------------------------------------------------------- */}
      <section id="workflows" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-plum uppercase tracking-wider block mb-2">
              REAL-WORLD OPERATIONAL TEMPLATES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Pre-Built Agent Teams Ready for Immediate Deployment
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink-muted">
              Inspect how Qwenton agents collaborate across four high-leverage departments. Select a workflow below to run a real-time execution simulation.
            </p>
          </div>

          {/* Interactive Department Tab Controller with 48px touch targets */}
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-panel bg-surface-panel border border-border-subtle max-w-3xl mx-auto mb-8 overflow-x-auto no-scrollbar">
            {(
              [
                { key: 'sales', label: 'Sales & Lead Conversion' },
                { key: 'support', label: 'Customer Support Triage' },
                { key: 'research', label: 'Competitive Research Swarm' },
                { key: 'pipeline', label: 'API & Data Pipeline Sync' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveWorkflowTab(tab.key);
                  setSimulationStep(0);
                  setSimulationApproved(false);
                }}
                className={`flex-1 px-3 sm:px-4 py-2.5 rounded-control text-xs sm:text-sm font-bold transition-all min-h-[48px] whitespace-nowrap select-none ${
                  activeWorkflowTab === tab.key
                    ? 'bg-primary text-white shadow-clay-button border border-plum-deep/30'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Workflow Stage Container with 3D Depth */}
          <div className="perspective-container max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 rounded-card bg-surface-white border border-border-subtle shadow-clay-card clay-card-3d">
              {/* Header info bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-subtle clay-card-3d-content">
                <div>
                  <span className="text-xs font-mono font-bold text-sage-dark uppercase block mb-0.5">
                    Trigger: {currentWorkflow.trigger}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-ink">{currentWorkflow.name}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-ink-muted">
                  <span className="px-2.5 py-1 rounded-control bg-surface-inset">Avg: {currentWorkflow.avgDuration}</span>
                  <span className="px-2.5 py-1 rounded-control bg-surface-inset">Cost: {currentWorkflow.tokenCost}</span>
                  <span className="px-2.5 py-1 rounded-control bg-sage-light text-sage-dark font-bold">
                    {currentWorkflow.safetyGate}
                  </span>
                </div>
              </div>

              {/* Stepper Pipeline */}
              <div className="mt-6 space-y-3 clay-card-3d-content">
                {currentWorkflow.steps.map((step) => {
                  const isStepActive = simulationStep >= step.num;
                  const isGateWaiting = step.isGate && simulationStep === 4 && !simulationApproved;

                  return (
                    <div
                      key={step.num}
                      className={`p-3.5 sm:p-4 rounded-panel border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isGateWaiting
                          ? 'bg-plum-light border-plum shadow-clay-card ring-2 ring-plum/20'
                          : isStepActive
                          ? 'bg-surface-white border-sage-border shadow-clay-button-subtle'
                          : 'bg-surface-panel border-border-subtle opacity-70'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                            isStepActive ? 'bg-sage-deep text-white' : 'bg-surface-inset text-ink-muted'
                          }`}
                        >
                          {step.num}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-ink uppercase">{step.role}</span>
                            {step.isGate && (
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-plum-light text-plum-deep border border-plum-border">
                                FIREWALL INTERCEPTOR
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-ink-muted font-medium mt-0.5">{step.action}</p>
                        </div>
                      </div>

                      {/* Step Action / Status Badge */}
                      <div className="shrink-0 self-end sm:self-center">
                        {isGateWaiting ? (
                          <Button
                            onClick={handleApproveGatedAction}
                            size="sm"
                            className="min-h-[44px] text-xs font-bold animate-pulse"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Click to Approve Action
                          </Button>
                        ) : (
                          <span
                            className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                              isStepActive ? 'text-sage-dark font-bold' : 'text-ink-muted'
                            }`}
                          >
                            {isStepActive ? '✓ Completed' : step.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simulation Run Controller */}
              <div className="mt-6 pt-5 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 clay-card-3d-content">
                <span className="text-xs text-ink-muted font-medium">
                  Simulate end-to-end execution with real-time gate halt and resume.
                </span>
                <Button
                  onClick={handleRunDepartmentSimulation}
                  isLoading={isSimulatingWorkflow}
                  size="md"
                  variant="secondary"
                  className="w-full sm:w-auto min-h-[48px] font-bold"
                >
                  <Play className="w-4 h-4 mr-1.5 text-sage-dark" />
                  {isSimulatingWorkflow ? 'Simulating Workflow...' : '▶ Simulate Workflow Execution'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SECTION 5: TARGET CUSTOMER SEGMENTS MATRIX (WITH 3D TILT)
          ------------------------------------------------------------------------- */}
      <section id="solutions" className="py-16 sm:py-24 bg-surface-panel border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono font-bold text-plum uppercase tracking-wider block mb-2">
              BUILT FOR EVERY SCALE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Tailored Workflows for Every Stage of Growth
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink-muted">
              Whether you are an independent founder or an enterprise engineering team, Qwenton adapts to your governance requirements.
            </p>
          </div>

          {/* 4-Column Grid with 3D Depth */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
            {/* Segment 1: Small Businesses */}
            <div className="p-6 rounded-card bg-surface-white border border-border-subtle shadow-clay-card flex flex-col justify-between clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-10 h-10 rounded-panel bg-sage-light border border-sage-border flex items-center justify-center text-sage-dark mb-4">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-ink">Small Businesses</h3>
                <p className="text-xs font-bold text-sage-dark mt-0.5 mb-3">Automate without hiring specialists</p>
                <ul className="space-y-2 text-xs text-ink-muted font-medium mb-6">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>No-code natural language agent setup</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Pre-built templates for invoices &amp; leads</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Default safe sandboxes that prevent errors</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Transparent monthly run budgets</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-plum-deep hover:underline flex items-center gap-1 min-h-[48px] clay-card-3d-content"
              >
                <span>Browse Small Business Templates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Segment 2: Agencies */}
            <div className="p-6 rounded-card bg-surface-white border border-border-subtle shadow-clay-card flex flex-col justify-between clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-10 h-10 rounded-panel bg-plum-light border border-plum-border flex items-center justify-center text-plum-deep mb-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-ink">Agencies &amp; Consultancies</h3>
                <p className="text-xs font-bold text-plum-deep mt-0.5 mb-3">Operate client workflows profitably</p>
                <ul className="space-y-2 text-xs text-ink-muted font-medium mb-6">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Isolated multi-tenant workspaces</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Exportable white-label workflow templates</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Per-client token &amp; API cost attribution</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Strict cross-tenant security boundaries</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-plum-deep hover:underline flex items-center gap-1 min-h-[48px] clay-card-3d-content"
              >
                <span>Explore Agency Solutions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Segment 3: Growing Companies */}
            <div className="p-6 rounded-card bg-surface-white border border-border-subtle shadow-clay-card flex flex-col justify-between clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-10 h-10 rounded-panel bg-sage-light border border-sage-border flex items-center justify-center text-sage-dark mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-ink">Growing Companies</h3>
                <p className="text-xs font-bold text-sage-dark mt-0.5 mb-3">Coordinate cross-department swarms</p>
                <ul className="space-y-2 text-xs text-ink-muted font-medium mb-6">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Multi-agent swarms for Sales, Support, Ops</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Server-enforced Approval Firewall</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Shared Knowledge Hub with permissions</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Role-Based Access Control (RBAC)</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-plum-deep hover:underline flex items-center gap-1 min-h-[48px] clay-card-3d-content"
              >
                <span>Scale Your Workforce</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Segment 4: Developers & Engineers */}
            <div className="p-6 rounded-card bg-surface-white border border-border-subtle shadow-clay-card flex flex-col justify-between clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-10 h-10 rounded-panel bg-plum-light border border-plum-border flex items-center justify-center text-plum-deep mb-4">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-ink">Developers &amp; Engineers</h3>
                <p className="text-xs font-bold text-plum-deep mt-0.5 mb-3">Extensibility &amp; code-level control</p>
                <ul className="space-y-2 text-xs text-ink-muted font-medium mb-6">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>TypeScript and Python sandbox nodes</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Native Model Context Protocol (MCP) tools</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>Webhook triggers &amp; REST API dispatch</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span>OpenTelemetry traces &amp; execution replay</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-plum-deep hover:underline flex items-center gap-1 min-h-[48px] clay-card-3d-content"
              >
                <span>View Developer Documentation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SECTION 6: TRUST, GOVERNANCE & SECURITY ARCHITECTURE
          ------------------------------------------------------------------------- */}
      <section id="governance" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono font-bold text-sage-dark uppercase tracking-wider block mb-2">
              ENTERPRISE GOVERNANCE BY DESIGN
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Autonomous Power with Absolute Human Control
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink-muted">
              Most AI agent tools are reckless black boxes that execute unverified mutations directly to external systems. Qwenton enforces safety at the infrastructure layer.
            </p>
          </div>

          {/* 3 Pillars of Security Architecture with 3D Depth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-container">
            <div className="p-6 rounded-card bg-surface-white border border-border-subtle shadow-clay-card clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-10 h-10 rounded-control bg-sage-light text-sage-dark flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-ink mb-2">The Human Approval Firewall</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  External actions (sending emails, modifying databases, charging cards) are halted at the server boundary. Generates an immutable SHA-256 payload digest. Configurable approval routing via dashboard, Slack, or email.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-card bg-surface-white border border-border-subtle shadow-clay-card clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-10 h-10 rounded-control bg-plum-light text-plum-deep flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-ink mb-2">Multi-Tenant Isolation &amp; RBAC</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Strict tenant separation enforced in database rules and server authorization; never trusts client-supplied workspace IDs. 6 granular roles (`Owner`, `Admin`, `Builder`, `Operator`, `Approver`, `Viewer`). Zero credential leakage.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-card bg-surface-white border border-border-subtle shadow-clay-card clay-card-3d">
              <div className="clay-card-3d-content">
                <div className="w-10 h-10 rounded-control bg-surface-inset text-ink flex items-center justify-center mb-4">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-ink mb-2">Explainable Audit Traces &amp; Replays</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Every agent action, prompt input, retrieved knowledge document, and tool invocation is logged in an immutable execution trace. Idempotency keys prevent duplicate execution. Instant rollback with one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SECTION 7: MEASURABLE BUSINESS IMPACT & PERFORMANCE
          ------------------------------------------------------------------------- */}
      <section className="py-14 bg-surface-panel border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center perspective-container">
            <div className="p-4 rounded-card bg-surface-white border border-border-subtle shadow-clay-button-subtle clay-card-3d">
              <div className="text-3xl sm:text-4xl font-extrabold text-plum-deep font-mono clay-card-3d-content">99.8%</div>
              <p className="text-xs font-bold text-ink mt-1 clay-card-3d-content">Action Accuracy</p>
              <span className="text-[11px] text-ink-muted clay-card-3d-content">Enforced by Approval Firewall</span>
            </div>
            <div className="p-4 rounded-card bg-surface-white border border-border-subtle shadow-clay-button-subtle clay-card-3d">
              <div className="text-3xl sm:text-4xl font-extrabold text-sage-dark font-mono clay-card-3d-content">&lt; 1.8s</div>
              <p className="text-xs font-bold text-ink mt-1 clay-card-3d-content">Avg Swarm Execution</p>
              <span className="text-[11px] text-ink-muted clay-card-3d-content">Parallel sub-agent delegation</span>
            </div>
            <div className="p-4 rounded-card bg-surface-white border border-border-subtle shadow-clay-button-subtle clay-card-3d">
              <div className="text-3xl sm:text-4xl font-extrabold text-plum-deep font-mono clay-card-3d-content">100%</div>
              <p className="text-xs font-bold text-ink mt-1 clay-card-3d-content">Auditability</p>
              <span className="text-[11px] text-ink-muted clay-card-3d-content">Cryptographic action logs</span>
            </div>
            <div className="p-4 rounded-card bg-surface-white border border-border-subtle shadow-clay-button-subtle clay-card-3d">
              <div className="text-3xl sm:text-4xl font-extrabold text-sage-dark font-mono clay-card-3d-content">0</div>
              <p className="text-xs font-bold text-ink mt-1 clay-card-3d-content">Unapproved Side Effects</p>
              <span className="text-[11px] text-ink-muted clay-card-3d-content">Across 500k+ runs</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SECTION 8: TRANSPARENT INTERACTIVE PRICING TIERS (WITH 3D TILT)
          ------------------------------------------------------------------------- */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-plum uppercase tracking-wider block mb-2">
              TRANSPARENT VALUE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Predictable Pricing for Autonomous Scale
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink-muted">
              Choose the plan that fits your current operational scale. Upgrade or adjust anytime.
            </p>

            {/* Billing Toggle Switcher with 48px touch targets */}
            <div className="mt-6 inline-flex items-center p-1 rounded-control bg-surface-panel border border-border-subtle shadow-clay-inset">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2.5 rounded-control text-xs sm:text-sm font-bold transition-all min-h-[48px] select-none ${
                  billingCycle === 'monthly'
                    ? 'bg-surface-white text-ink shadow-clay-button-subtle border border-border-subtle'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2.5 rounded-control text-xs sm:text-sm font-bold transition-all min-h-[48px] flex items-center gap-1.5 select-none ${
                  billingCycle === 'annual'
                    ? 'bg-primary text-white shadow-clay-button'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-sage-light text-sage-dark font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid with 3D Depth */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
            {/* Starter Plan */}
            <div className="p-6 rounded-card bg-surface-white border border-border-subtle shadow-clay-card flex flex-col justify-between clay-card-3d">
              <div className="clay-card-3d-content">
                <span className="text-xs font-mono font-bold text-ink-muted uppercase block mb-1">STARTER</span>
                <div className="text-3xl font-extrabold text-ink">$0</div>
                <p className="text-xs text-ink-muted mt-1 mb-4">Free forever for solo exploration</p>
                <ul className="space-y-2.5 text-xs text-ink font-medium mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>2 active agents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>100 runs per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>Agent Studio Natural Builder</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>Standard Community Support</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="clay-card-3d-content">
                <Button variant="outline" size="md" className="w-full min-h-[48px] font-bold">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-6 rounded-card bg-surface-white border-2 border-plum shadow-clay-card flex flex-col justify-between relative clay-card-3d">
              <div className="absolute -top-3 right-4 clay-card-3d-badge">
                <Badge variant="default" className="bg-primary text-white border-none shadow-clay-button">
                  MOST POPULAR
                </Badge>
              </div>
              <div className="clay-card-3d-content">
                <span className="text-xs font-mono font-bold text-plum uppercase block mb-1">PRO TEAM</span>
                <div className="text-3xl font-extrabold text-ink">
                  {billingCycle === 'annual' ? '$39' : '$49'}
                  <span className="text-xs font-normal text-ink-muted">/month</span>
                </div>
                <p className="text-xs text-ink-muted mt-1 mb-4">For agile teams and serious workflows</p>
                <ul className="space-y-2.5 text-xs text-ink font-medium mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>10 active agents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>5,000 runs per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>Workflow Studio visual canvas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>Human Approval Firewall</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>1 GB Knowledge Hub memory</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="clay-card-3d-content">
                <Button size="md" className="w-full min-h-[48px] font-bold">
                  Start 14-Day Pro Trial
                </Button>
              </Link>
            </div>

            {/* Team Plan */}
            <div className="p-6 rounded-card bg-surface-white border border-border-subtle shadow-clay-card flex flex-col justify-between clay-card-3d">
              <div className="clay-card-3d-content">
                <span className="text-xs font-mono font-bold text-sage-dark uppercase block mb-1">BUSINESS SCALE</span>
                <div className="text-3xl font-extrabold text-ink">
                  {billingCycle === 'annual' ? '$119' : '$149'}
                  <span className="text-xs font-normal text-ink-muted">/month</span>
                </div>
                <p className="text-xs text-ink-muted mt-1 mb-4">For multi-department swarms &amp; agencies</p>
                <ul className="space-y-2.5 text-xs text-ink font-medium mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>Unlimited active agents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>25,000 runs per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>Multi-Agent Workforce Swarms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>5 isolated client workspaces</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>Role-Based Access Control (RBAC)</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="clay-card-3d-content">
                <Button size="md" className="w-full min-h-[48px] font-bold">
                  Upgrade to Business
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-6 rounded-card bg-surface-white border border-border-subtle shadow-clay-card flex flex-col justify-between clay-card-3d">
              <div className="clay-card-3d-content">
                <span className="text-xs font-mono font-bold text-ink-muted uppercase block mb-1">ENTERPRISE VPC</span>
                <div className="text-3xl font-extrabold text-ink">Custom</div>
                <p className="text-xs text-ink-muted mt-1 mb-4">Dedicated VPC, custom SLA, and MCP connectors</p>
                <ul className="space-y-2.5 text-xs text-ink font-medium mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>Custom run &amp; token quotas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>Dedicated VPC / On-Premise deploy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>SAML/SSO &amp; SCIM provisioning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-dark" />
                    <span>99.9% Uptime SLA &amp; Support Lead</span>
                  </li>
                </ul>
              </div>
              <Link href="/login" className="clay-card-3d-content">
                <Button variant="secondary" size="md" className="w-full min-h-[48px] font-bold">
                  Contact Enterprise Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SECTION 9: FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
          ------------------------------------------------------------------------- */}
      <section id="faq" className="py-16 sm:py-24 bg-surface-panel border-y border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold text-plum uppercase tracking-wider block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Enterprise Trust &amp; Safety Clarifications
            </h2>
            <p className="mt-3 text-sm text-ink-muted">
              Everything you need to know about our human firewall, model flexibility, and platform boundaries.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-panel bg-surface-white border border-border-subtle shadow-clay-button-subtle overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-ink hover:text-plum transition-colors min-h-[48px] select-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <div className="w-7 h-7 rounded-full bg-surface-panel border border-border-subtle flex items-center justify-center shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-plum" /> : <ChevronDown className="w-4 h-4 text-ink-muted" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-ink-muted leading-relaxed border-t border-border-subtle/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SECTION 10: FINAL CONVERSION STAGE & FOOTER
          ------------------------------------------------------------------------- */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center perspective-container">
          {/* Raised Clay CTA Banner with 3D Depth */}
          <div className="p-8 sm:p-14 rounded-hero bg-surface-white border border-border-subtle shadow-clay-card clay-card-3d">
            <div className="clay-card-3d-content">
              <span className="text-xs font-mono font-bold text-sage-dark uppercase tracking-wider block mb-3">
                DEPLOY YOUR WORKFORCE TODAY
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight max-w-2xl mx-auto leading-tight">
                Ready to Orchestrate Your Autonomous AI Workforce?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
                Join forward-thinking businesses and agile teams deploying reliable, governed AI agents today. Get started in minutes with zero credit card required.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto min-h-[48px] text-base px-8 font-bold">
                    Launch Free Workspace →
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto min-h-[48px] text-base px-6 font-bold">
                    Schedule Platform Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="mt-auto bg-surface-panel border-t border-border-subtle pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-border-subtle">
            {/* Col 1: Brand & Status */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-control bg-primary text-white flex items-center justify-center font-bold text-sm">
                  Q
                </div>
                <span className="font-extrabold text-lg text-ink">Qwenton</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed max-w-sm mb-4">
                The enterprise workforce platform to design, deploy, and govern autonomous AI agent swarms with human approval firewalls.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-sage-dark font-bold">
                <span className="w-2 h-2 rounded-full bg-sage-deep animate-pulse" />
                <span>All Systems Operational (99.98% uptime)</span>
              </div>
            </div>

            {/* Col 2: Platform */}
            <div>
              <span className="text-xs font-mono font-bold text-ink uppercase block mb-3">PLATFORM</span>
              <ul className="space-y-2 text-xs text-ink-muted">
                <li>
                  <a href="#pillars" className="hover:text-ink">
                    Agent Studio
                  </a>
                </li>
                <li>
                  <a href="#pillars" className="hover:text-ink">
                    Workflow Studio (3D)
                  </a>
                </li>
                <li>
                  <a href="#pillars" className="hover:text-ink">
                    Workforce Swarms
                  </a>
                </li>
                <li>
                  <a href="#pillars" className="hover:text-ink">
                    Approval Firewall
                  </a>
                </li>
                <li>
                  <Link href="/files" className="hover:text-ink">
                    Knowledge Hub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Solutions */}
            <div>
              <span className="text-xs font-mono font-bold text-ink uppercase block mb-3">SOLUTIONS</span>
              <ul className="space-y-2 text-xs text-ink-muted">
                <li>
                  <a href="#solutions" className="hover:text-ink">
                    Small Businesses
                  </a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-ink">
                    Agencies
                  </a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-ink">
                    Growing Teams
                  </a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-ink">
                    Developers
                  </a>
                </li>
                <li>
                  <a href="#workflows" className="hover:text-ink">
                    Sales &amp; Support Ops
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Resources & Legal */}
            <div>
              <span className="text-xs font-mono font-bold text-ink uppercase block mb-3">RESOURCES &amp; TRUST</span>
              <ul className="space-y-2 text-xs text-ink-muted">
                <li>
                  <Link href="/privacy" className="hover:text-ink">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-ink">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-ink">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a href="#governance" className="hover:text-ink">
                    Trust Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar with 3-Colour Zero-Black Guarantee */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted font-mono">
            <span>&copy; 2026 Qwenton AI, Inc. All rights reserved.</span>
            <span>Built with Warm Ivory, Muted Sage &amp; Dusty Plum. Zero Black Guarantee.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
