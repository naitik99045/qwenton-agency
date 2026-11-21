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
  Check,
  X,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  FileText,
  Lock,
  Terminal,
  Clock,
  Database,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export type ShowcasePillar = 'agent-studio' | 'workflow-studio' | 'workforce-swarm' | 'approval-firewall';

export function AllRounderStudioShowcase() {
  const [activePillar, setActivePillar] = useState<ShowcasePillar>('agent-studio');

  // ==========================================
  // TAB 1: AGENT STUDIO STATE
  // ==========================================
  const [promptInput, setPromptInput] = useState<string>(
    'Monitor Zendesk tickets, search Knowledge Hub for solutions, draft friendly replies, and ask for approval on refund requests.'
  );
  const [isGeneratingAgent, setIsGeneratingAgent] = useState<boolean>(false);
  const [permissions, setPermissions] = useState({
    readDocs: true,
    draftZendesk: true,
    directSend: false,
    requireApprovalRefunds: true,
  });
  const [isSimulatingTicket, setIsSimulatingTicket] = useState<boolean>(false);
  const [ticketTraceStep, setTicketTraceStep] = useState<number>(0);

  const handleGenerateAgent = () => {
    setIsGeneratingAgent(true);
    setTimeout(() => {
      setIsGeneratingAgent(false);
      setTicketTraceStep(0);
    }, 450);
  };

  const handleSimulateTicket = () => {
    if (isSimulatingTicket) return;
    setIsSimulatingTicket(true);
    setTicketTraceStep(1);

    setTimeout(() => setTicketTraceStep(2), 500);
    setTimeout(() => setTicketTraceStep(3), 1000);
    setTimeout(() => {
      setTicketTraceStep(4);
      setIsSimulatingTicket(false);
    }, 1500);
  };

  // ==========================================
  // TAB 2: WORKFLOW STUDIO STATE
  // ==========================================
  const [selectedNodeId, setSelectedNodeId] = useState<string>('trigger');
  const [isWorkflowRunning, setIsWorkflowRunning] = useState<boolean>(false);
  const [workflowActiveStep, setWorkflowActiveStep] = useState<number>(0);

  const workflowNodes = [
    {
      id: 'trigger',
      title: 'Webhook Trigger',
      subtitle: 'Typeform / Inbound Lead',
      type: 'Event Listener',
      icon: Zap,
      schema: '{ email: "sarah@acme.com", company: "Acme Corp", seats: 45 }',
      policy: 'Rate-limited to 1,000 events/min with idempotency deduplication',
      status: 'Active',
    },
    {
      id: 'enrich',
      title: 'Enrichment Agent',
      subtitle: 'Firmographics & LinkedIn Scout',
      type: 'LLM Agent Node',
      icon: Bot,
      schema: '{ enrichedRevenue: "$18M ARR", employeeCount: 140, techStack: ["Salesforce", "PostgreSQL"] }',
      policy: 'Strict JSON schema verification. Fallback to cached company cache.',
      status: 'Validated',
    },
    {
      id: 'firewall',
      title: 'Approval Firewall',
      subtitle: 'Review High-Value Outreach',
      type: 'Server-Side Policy Gate',
      icon: ShieldCheck,
      schema: '{ action: "DISPATCH_PROPOSAL", contractValue: "$24,000/yr", hash: "sha256:7f83b165..." }',
      policy: 'MUST pause workflow. Requires 1 human approval signature before external mutation.',
      status: 'Gate Enforced',
    },
    {
      id: 'action',
      title: 'Multi-Channel Action',
      subtitle: 'Send Email + Update CRM',
      type: 'External Mutation',
      icon: CheckCircle2,
      schema: '{ salesforceId: "OPP-90214", sendgridStatus: "QUEUED_PENDING_APPROVAL" }',
      policy: 'Server-authenticated REST dispatch. Zero token leakage to client.',
      status: 'Guaranteed Delivery',
    },
  ];

  const handleRunWorkflow = () => {
    if (isWorkflowRunning) return;
    setIsWorkflowRunning(true);
    setWorkflowActiveStep(1);
    setSelectedNodeId('trigger');

    setTimeout(() => {
      setWorkflowActiveStep(2);
      setSelectedNodeId('enrich');
    }, 600);

    setTimeout(() => {
      setWorkflowActiveStep(3);
      setSelectedNodeId('firewall');
    }, 1300);

    setTimeout(() => {
      setWorkflowActiveStep(4);
      setSelectedNodeId('action');
      setIsWorkflowRunning(false);
    }, 2000);
  };

  // ==========================================
  // TAB 3: WORKFORCE SWARMS STATE
  // ==========================================
  const [isSwarmRunning, setIsSwarmRunning] = useState<boolean>(false);
  const [swarmProgress, setSwarmProgress] = useState({ researcher: 100, analyst: 100, drafter: 100 });
  const [swarmStage, setSwarmStage] = useState<'idle' | 'running' | 'completed'>('completed');

  const handleDispatchSwarm = () => {
    if (isSwarmRunning) return;
    setIsSwarmRunning(true);
    setSwarmStage('running');
    setSwarmProgress({ researcher: 0, analyst: 0, drafter: 0 });

    const interval = setInterval(() => {
      setSwarmProgress((prev) => {
        const nextResearcher = Math.min(100, prev.researcher + 25);
        const nextAnalyst = Math.min(100, prev.analyst + 18);
        const nextDrafter = Math.min(100, prev.drafter + 12);

        if (nextResearcher >= 100 && nextAnalyst >= 100 && nextDrafter >= 100) {
          clearInterval(interval);
          setIsSwarmRunning(false);
          setSwarmStage('completed');
          return { researcher: 100, analyst: 100, drafter: 100 };
        }
        return { researcher: nextResearcher, analyst: nextAnalyst, drafter: nextDrafter };
      });
    }, 100);
  };

  // ==========================================
  // TAB 4: HUMAN APPROVAL FIREWALL STATE
  // ==========================================
  const [approvalDecision, setApprovalDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectionReason, setRejectionReason] = useState<string>('Revise contract terms to Net 15 before sending.');
  const [isPromptingRejection, setIsPromptingRejection] = useState<boolean>(false);

  // Mascot dynamic thought text
  const getMascotThought = () => {
    switch (activePillar) {
      case 'agent-studio':
        return isSimulatingTicket
          ? 'Scanning Knowledge Hub embeddings and checking safety policies...'
          : 'I turn plain English into verified agents with strict guardrails!';
      case 'workflow-studio':
        return isWorkflowRunning
          ? `Executing step ${workflowActiveStep} of 4 in 3D with zero data loss...`
          : 'Drag to tilt the 3D scene or click any node to inspect schemas!';
      case 'workforce-swarm':
        return isSwarmRunning
          ? 'Coordinating 3 specialist agents in parallel with cycle detection!'
          : 'Hierarchical delegation assembled 14 sources in under 1.8 seconds!';
      case 'approval-firewall':
        if (approvalDecision === 'approved') return 'Approved! Dispatched externally with signed cryptographic log.';
        if (approvalDecision === 'rejected') return 'Action halted! Revision requirements returned to the agent.';
        return 'Protected mutation intercepted. Standing by for your 1-tap sign-off!';
      default:
        return 'Autonomous coworkers governed by enterprise guardrails.';
    }
  };

  return (
    <div id="showcase" className="relative w-full rounded-hero bg-surface-white border border-border-subtle p-4 sm:p-7 lg:p-8 shadow-clay-card transition-all">
      {/* ----------------------------------------------------
          TOP HEADER: 4 Playable Tabs + AI Coworker Mascot
          ---------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        {/* Playable Tabs Selector with 48px touch targets */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-panel bg-surface-inset border border-border-subtle overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActivePillar('agent-studio')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-control text-xs sm:text-sm font-bold transition-all min-h-[48px] select-none ${
              activePillar === 'agent-studio'
                ? 'bg-primary text-white shadow-clay-button border border-plum-deep/30'
                : 'text-ink-muted hover:text-ink hover:bg-surface-panel'
            }`}
            aria-label="Switch to Agent Studio interactive tab"
          >
            <Bot className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Agent Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar('workflow-studio')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-control text-xs sm:text-sm font-bold transition-all min-h-[48px] select-none ${
              activePillar === 'workflow-studio'
                ? 'bg-primary text-white shadow-clay-button border border-plum-deep/30'
                : 'text-ink-muted hover:text-ink hover:bg-surface-panel'
            }`}
            aria-label="Switch to Workflow Studio interactive tab"
          >
            <GitFork className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Workflow Studio (3D)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar('workforce-swarm')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-control text-xs sm:text-sm font-bold transition-all min-h-[48px] select-none ${
              activePillar === 'workforce-swarm'
                ? 'bg-primary text-white shadow-clay-button border border-plum-deep/30'
                : 'text-ink-muted hover:text-ink hover:bg-surface-panel'
            }`}
            aria-label="Switch to Workforce Swarms interactive tab"
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Workforce Swarms</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar('approval-firewall')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-control text-xs sm:text-sm font-bold transition-all min-h-[48px] select-none ${
              activePillar === 'approval-firewall'
                ? 'bg-primary text-white shadow-clay-button border border-plum-deep/30'
                : 'text-ink-muted hover:text-ink hover:bg-surface-panel'
            }`}
            aria-label="Switch to Human Approval Firewall interactive tab"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Approval Firewall</span>
          </button>
        </div>

        {/* Tactile Mascot Sticker Widget with Soft Clay Styling */}
        <div className="flex items-center gap-3 p-2 rounded-panel bg-surface-panel border border-border-subtle shadow-clay-button-subtle shrink-0">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-surface-white border border-border-subtle flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/stickers/multitask-agent.gif"
              alt="Autonomous AI Coworker Mascot"
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </div>
          <div className="max-w-[210px] sm:max-w-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sage deep animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sage-dark">
                AI Mascot Sentinel
              </span>
            </div>
            <p className="text-xs text-ink font-medium leading-tight line-clamp-2 mt-0.5">
              &ldquo;{getMascotThought()}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          TAB 1: NATURAL LANGUAGE AGENT STUDIO
          ---------------------------------------------------- */}
      {activePillar === 'agent-studio' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start perspective-container">
          {/* Left Panel: Configuration & Natural Language Prompt Builder */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-4 sm:p-5 rounded-panel bg-surface-panel border border-border-subtle shadow-clay-inset">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-plum uppercase tracking-wider">
                  Prompt-To-Agent Compiler
                </span>
                <Badge variant="success">Safe Default Sandbox</Badge>
              </div>

              <label htmlFor="agent-goal" className="block text-xs font-bold text-ink mb-1.5">
                Describe desired coworker outcome:
              </label>
              <textarea
                id="agent-goal"
                rows={3}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="w-full p-3 rounded-control text-xs sm:text-sm bg-surface-white border border-border-subtle text-ink focus:outline-none focus:border-plum transition-all font-sans resize-none shadow-clay-inset"
                placeholder="Type what this agent should do..."
              />

              {/* Template quick-pick chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[11px] font-medium text-ink-muted">Quick templates:</span>
                <button
                  type="button"
                  onClick={() =>
                    setPromptInput(
                      'Monitor Zendesk tickets, search Knowledge Hub for solutions, draft friendly replies, and ask for approval on refund requests.'
                    )
                  }
                  className="text-[11px] font-bold px-2 py-1 rounded-control bg-surface-white text-ink-muted hover:text-ink border border-border-subtle"
                >
                  Support Sentinel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPromptInput(
                      'Enrich inbound Typeform leads with LinkedIn and Clearbit signals, draft personalized email outreach, and hold high-value leads for SDR approval.'
                    )
                  }
                  className="text-[11px] font-bold px-2 py-1 rounded-control bg-surface-white text-ink-muted hover:text-ink border border-border-subtle"
                >
                  Sales Qualifier
                </button>
              </div>
            </div>

            {/* Granular Permissions Checklist */}
            <div className="p-4 sm:p-5 rounded-panel bg-surface-panel border border-border-subtle">
              <span className="block text-xs font-mono font-bold text-ink uppercase tracking-wider mb-3">
                Action-Level Permissions &amp; Boundaries
              </span>
              <div className="space-y-2.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.readDocs}
                    onChange={(e) => setPermissions({ ...permissions, readDocs: e.target.checked })}
                    className="mt-0.5 rounded text-plum focus:ring-plum"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink">Read Tickets &amp; Knowledge Documents</span>
                    <p className="text-[11px] text-ink-muted">Semantic search across indexed refund policies &amp; FAQs.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.draftZendesk}
                    onChange={(e) => setPermissions({ ...permissions, draftZendesk: e.target.checked })}
                    className="mt-0.5 rounded text-plum focus:ring-plum"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink">Draft Responses in Helpdesk (Internal Staging)</span>
                    <p className="text-[11px] text-ink-muted">Generates replies in draft mode; never published automatically.</p>
                  </div>
                </label>

                <div className="flex items-start gap-2.5 opacity-65">
                  <input
                    type="checkbox"
                    checked={permissions.directSend}
                    disabled
                    className="mt-0.5 rounded text-plum"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink line-through">Direct Send without Human Review</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-plum-light text-plum-deep border border-plum-border">
                        BLOCKED BY POLICY
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted">Server enforces mandatory review on customer-facing messages.</p>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.requireApprovalRefunds}
                    onChange={(e) => setPermissions({ ...permissions, requireApprovalRefunds: e.target.checked })}
                    className="mt-0.5 rounded text-plum focus:ring-plum"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink">Trigger Approval Firewall for Financial Mutations</span>
                    <p className="text-[11px] text-ink-muted">Any refund, payment, or credit triggers cryptographic gate.</p>
                  </div>
                </label>
              </div>

              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
                <Button
                  onClick={handleGenerateAgent}
                  isLoading={isGeneratingAgent}
                  size="md"
                  className="w-full min-h-[48px]"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGeneratingAgent ? 'Compiling Agent...' : '⚡ Generate Agent Spec'}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel: Generated Agent Profile & Live Sandbox Simulation */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Generated Profile Summary Card with 3D Depth */}
            <div className="p-4 sm:p-5 rounded-panel bg-surface-white border border-border-subtle shadow-clay-button-subtle clay-card-3d">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle clay-card-3d-content">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-control bg-sage-light border border-sage-border flex items-center justify-center text-sage-dark">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-ink">Customer Care Sentinel Agent</h4>
                    <span className="text-[11px] text-ink-muted">Generated from natural language brief • Model: Claude 3.5 Sonnet</span>
                  </div>
                </div>
                <Badge variant="success">Active (Safeguarded)</Badge>
              </div>

              {/* Grid of Verified Agent Boundaries */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 text-xs clay-card-3d-content">
                <div className="p-2.5 rounded-control bg-surface-panel border border-border-subtle">
                  <span className="text-[10px] font-mono text-ink-muted block uppercase">Trigger Event</span>
                  <span className="font-bold text-ink">Zendesk Webhook</span>
                </div>
                <div className="p-2.5 rounded-control bg-surface-panel border border-border-subtle">
                  <span className="text-[10px] font-mono text-ink-muted block uppercase">Knowledge Hub</span>
                  <span className="font-bold text-ink">Refund Policy v3.2</span>
                </div>
                <div className="p-2.5 rounded-control bg-surface-panel border border-border-subtle col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono text-ink-muted block uppercase">Safety Barrier</span>
                  <span className="font-bold text-plum-deep">Firewall Interception</span>
                </div>
              </div>
            </div>

            {/* Live Interactive Test Simulation Box */}
            <div className="p-4 sm:p-5 rounded-panel bg-surface-white border border-border-subtle shadow-clay-button-subtle">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-plum" />
                  Live Trace Sandbox
                </span>
                <Button
                  onClick={handleSimulateTicket}
                  disabled={isSimulatingTicket}
                  size="sm"
                  variant="secondary"
                  className="min-h-[44px] text-xs"
                >
                  <Play className="w-3.5 h-3.5 mr-1 text-sage-dark" />
                  {isSimulatingTicket ? 'Executing Trace...' : 'Simulate Ticket: "Need refund for order #4492"'}
                </Button>
              </div>

              {/* Step Execution Trace */}
              <div className="space-y-2 p-3 rounded-control bg-surface-inset border border-border-subtle font-mono text-xs">
                <div className={`flex items-center gap-2 ${ticketTraceStep >= 1 ? 'text-sage-dark' : 'text-ink-muted'}`}>
                  {ticketTraceStep >= 1 ? <Check className="w-3.5 h-3.5 text-sage-dark" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>[0.1s] Inbound webhook received from Zendesk: Ticket #8921 (Order #4492, $49.00)</span>
                </div>

                <div className={`flex items-center gap-2 ${ticketTraceStep >= 2 ? 'text-sage-dark' : 'text-ink-muted'}`}>
                  {ticketTraceStep >= 2 ? <Check className="w-3.5 h-3.5 text-sage-dark" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>[0.4s] Knowledge Hub queried: Match found in &apos;Refund Policy 2026 - Section 4.2&apos; (Score: 96%)</span>
                </div>

                <div className={`flex items-center gap-2 ${ticketTraceStep >= 3 ? 'text-sage-dark' : 'text-ink-muted'}`}>
                  {ticketTraceStep >= 3 ? <Check className="w-3.5 h-3.5 text-sage-dark" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>[0.9s] Response drafted with reference citations: Staged $49.00 credit memo.</span>
                </div>

                <div className={`flex items-center gap-2 font-bold ${ticketTraceStep >= 4 ? 'text-plum-deep' : 'text-ink-muted'}`}>
                  {ticketTraceStep >= 4 ? <ShieldAlert className="w-3.5 h-3.5 text-plum-deep" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>[1.4s] POLICY CHECK: Mutation &gt; $20 detected. Execution HALTED at Approval Firewall.</span>
                </div>
              </div>

              {/* Final Output Result Card */}
              {ticketTraceStep >= 4 && (
                <div className="mt-3 p-3.5 rounded-panel bg-plum-light border border-plum-border">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-plum-deep flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Drafted Response Ready • Awaiting Human Sign-off
                    </span>
                    <Badge variant="danger">Approval Pending</Badge>
                  </div>
                  <p className="text-xs text-ink leading-relaxed font-sans bg-surface-white p-2.5 rounded-control border border-border-subtle">
                    &ldquo;Hello Alex, thank you for reaching out. In accordance with Section 4 of our policy, we have staged a $49.00 refund credit for order #4492. This request is currently awaiting final manager authorization.&rdquo;
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span>Target: Zendesk Ticket #8921</span>
                    <button
                      type="button"
                      onClick={() => setActivePillar('approval-firewall')}
                      className="text-plum-deep font-bold hover:underline flex items-center gap-1 min-h-[36px]"
                    >
                      Review in Approval Firewall →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: COMPOSABLE WORKFLOW STUDIO
          ---------------------------------------------------- */}
      {activePillar === 'workflow-studio' && (
        <div className="mt-6 flex flex-col gap-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-panel bg-surface-panel border border-border-subtle">
            <div>
              <span className="text-xs font-mono font-bold text-plum uppercase tracking-wider block">
                Visual Graph Pipeline • Composable Workflow Canvas
              </span>
              <p className="text-xs text-ink font-semibold">
                Click any node below to inspect schemas, parameters, runtime policies, and firewall rules.
              </p>
            </div>
            <Button
              onClick={handleRunWorkflow}
              isLoading={isWorkflowRunning}
              size="md"
              className="min-h-[48px]"
            >
              <Play className="w-4 h-4 mr-1.5" />
              {isWorkflowRunning ? 'Simulating Pipeline Flow...' : '▶ Run Workflow Simulation'}
            </Button>
          </div>

          {/* Interactive Pipeline Track Bar with Animated Data Pulses */}
          <div className="p-4 rounded-panel bg-surface-white border border-border-subtle shadow-clay-card">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-ink-muted">
              <span className="font-bold text-ink flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sage-dark animate-pulse" />
                Pipeline Execution Track: Webhook → AI Enrichment → Firewall Gate → CRM Dispatch
              </span>
              <span className="text-[11px] font-bold text-plum">
                {isWorkflowRunning ? `Active Stage: Step ${workflowActiveStep} of 4` : 'Ready for Simulation'}
              </span>
            </div>
            {/* Visual Progress Line */}
            <div className="relative w-full h-2.5 rounded-full bg-surface-inset border border-border-subtle overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sage to-plum rounded-full transition-all duration-500 ease-out"
                style={{
                  width: isWorkflowRunning
                    ? `${(workflowActiveStep / 4) * 100}%`
                    : selectedNodeId === 'trigger'
                    ? '25%'
                    : selectedNodeId === 'enrich'
                    ? '50%'
                    : selectedNodeId === 'firewall'
                    ? '75%'
                    : '100%',
                }}
              />
            </div>
          </div>

          {/* Interactive Node Canvas: 4 Sequential Nodes with 3D Depth */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative perspective-container">
            {workflowNodes.map((node, index) => {
              const NodeIcon = node.icon;
              const isSelected = selectedNodeId === node.id;
              const isActiveInSimulation = workflowActiveStep === index + 1;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`cursor-pointer p-4 rounded-panel transition-all min-h-[140px] flex flex-col justify-between border clay-card-3d ${
                    isSelected
                      ? 'bg-surface-white border-plum shadow-clay-card ring-2 ring-plum/20'
                      : isActiveInSimulation
                      ? 'bg-sage-light border-sage shadow-clay-card'
                      : 'bg-surface-white border-border-subtle hover:border-plum-border hover:bg-surface-panel shadow-clay-button-subtle'
                  }`}
                >
                  <div className="clay-card-3d-content">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-inset text-ink-muted">
                        Node 0{index + 1}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          isActiveInSimulation
                            ? 'bg-sage-deep text-white animate-bounce'
                            : isSelected
                            ? 'bg-primary text-white'
                            : 'bg-surface-inset text-ink'
                        }`}
                      >
                        <NodeIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <h5 className="text-xs sm:text-sm font-extrabold text-ink leading-tight">{node.title}</h5>
                    <p className="text-[11px] text-ink-muted mt-0.5">{node.subtitle}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono clay-card-3d-content">
                    <span className="text-sage-dark font-bold">{node.status}</span>
                    <span className="text-plum hover:underline">Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Inspector Drawer */}
          {(() => {
            const activeNode = workflowNodes.find((n) => n.id === selectedNodeId) || workflowNodes[0];
            return (
              <div className="p-4 sm:p-5 rounded-panel bg-surface-panel border border-border-subtle shadow-clay-inset">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-ink uppercase">Node Inspector:</span>
                    <span className="text-xs font-extrabold text-plum-deep">{activeNode.title}</span>
                    <Badge variant="outline">{activeNode.type}</Badge>
                  </div>
                  <Badge variant="success">Validated: Type-Safe</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-ink-muted block mb-1">
                      Validated Input / Output Schema:
                    </span>
                    <pre className="p-2.5 rounded-control bg-surface-white border border-border-subtle font-mono text-[11px] text-ink overflow-x-auto shadow-clay-inset">
                      {activeNode.schema}
                    </pre>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-ink-muted block mb-1">
                      Runtime Governance Policy:
                    </span>
                    <div className="p-2.5 rounded-control bg-surface-white border border-border-subtle text-ink leading-relaxed shadow-clay-inset">
                      <p className="text-xs font-medium text-ink">{activeNode.policy}</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-sage-dark font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Zero Data-Loss &amp; Idempotency Guarantee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: MULTI-AGENT WORKFORCE SWARMS
          ---------------------------------------------------- */}
      {activePillar === 'workforce-swarm' && (
        <div className="mt-6 flex flex-col gap-6">
          {/* Swarm Executive Header */}
          <div className="p-4 sm:p-5 rounded-panel bg-surface-panel border border-border-subtle shadow-clay-button-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="default">Executive Coordinator</Badge>
                <span className="text-[11px] font-mono text-sage-dark font-bold">
                  ● Loop Prevention Monitor: 0 cycles (Safe)
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-ink">
                Autonomous Competitive Research Swarm
              </h4>
              <p className="text-xs text-ink-muted">
                Executive agent breaks goal into 3 parallel specialist assignments and aggregates structured brief.
              </p>
            </div>
            <Button
              onClick={handleDispatchSwarm}
              isLoading={isSwarmRunning}
              size="md"
              className="min-h-[48px] shrink-0"
            >
              <Users className="w-4 h-4 mr-2" />
              {isSwarmRunning ? 'Swarm Working...' : '🚀 Dispatch Swarm'}
            </Button>
          </div>

          {/* 3 Parallel Specialist Agents with 3D Depth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 perspective-container">
            {/* Agent 1 */}
            <div className="p-4 rounded-panel bg-surface-white border border-border-subtle shadow-clay-button-subtle clay-card-3d">
              <div className="flex items-center justify-between mb-2 clay-card-3d-content">
                <div className="w-8 h-8 rounded-control bg-sage-light border border-sage-border flex items-center justify-center text-sage-dark">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-sage-dark">{swarmProgress.researcher}%</span>
              </div>
              <h5 className="text-xs sm:text-sm font-extrabold text-ink clay-card-3d-content">Intelligence Harvester</h5>
              <p className="text-[11px] text-ink-muted mt-0.5 clay-card-3d-content">Scrapes competitor changelogs and API announcements.</p>
              <div className="w-full bg-surface-inset rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-sage h-2 rounded-full transition-all duration-300"
                  style={{ width: `${swarmProgress.researcher}%` }}
                />
              </div>
            </div>

            {/* Agent 2 */}
            <div className="p-4 rounded-panel bg-surface-white border border-border-subtle shadow-clay-button-subtle clay-card-3d">
              <div className="flex items-center justify-between mb-2 clay-card-3d-content">
                <div className="w-8 h-8 rounded-control bg-plum-light border border-plum-border flex items-center justify-center text-plum-deep">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-plum-deep">{swarmProgress.analyst}%</span>
              </div>
              <h5 className="text-xs sm:text-sm font-extrabold text-ink clay-card-3d-content">Quantitative Analyst</h5>
              <p className="text-[11px] text-ink-muted mt-0.5 clay-card-3d-content">Normalizes pricing tiers and feature differences.</p>
              <div className="w-full bg-surface-inset rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${swarmProgress.analyst}%` }}
                />
              </div>
            </div>

            {/* Agent 3 */}
            <div className="p-4 rounded-panel bg-surface-white border border-border-subtle shadow-clay-button-subtle clay-card-3d">
              <div className="flex items-center justify-between mb-2 clay-card-3d-content">
                <div className="w-8 h-8 rounded-control bg-surface-inset border border-border-subtle flex items-center justify-center text-ink">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-ink">{swarmProgress.drafter}%</span>
              </div>
              <h5 className="text-xs sm:text-sm font-extrabold text-ink clay-card-3d-content">Executive Drafter</h5>
              <p className="text-[11px] text-ink-muted mt-0.5 clay-card-3d-content">Synthesizes findings into Markdown brief with citations.</p>
              <div className="w-full bg-surface-inset rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-ink-muted h-2 rounded-full transition-all duration-300"
                  style={{ width: `${swarmProgress.drafter}%` }}
                />
              </div>
            </div>
          </div>

          {/* Consolidated Executive Brief Result */}
          {swarmStage === 'completed' && (
            <div className="p-4 sm:p-5 rounded-panel bg-surface-white border border-border-subtle shadow-clay-card clay-card-3d">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle clay-card-3d-content">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-dark" />
                  <span className="text-xs font-extrabold text-ink">
                    Aggregated Executive Brief • Synthesized in 1.4s
                  </span>
                </div>
                <span className="text-[11px] font-mono text-ink-muted">14 Verified Citations • Indexed to Knowledge Hub</span>
              </div>
              <div className="mt-3 p-3 rounded-control bg-surface-inset text-xs text-ink font-mono leading-relaxed shadow-clay-inset clay-card-3d-content">
                <p className="font-bold text-plum-deep mb-1">### Executive Finding: 2026 Competitive Landscape</p>
                <p className="text-ink-muted font-sans text-xs mb-2">
                  Competitors A &amp; B updated enterprise tiers to include mandatory multi-agent swarms. Major customer friction is unverified agent mutations leading to data corruption.
                </p>
                <p className="font-bold text-sage-dark font-sans text-xs">
                  ✓ Qwenton Differentiator: Our server-enforced Human Approval Firewall eliminates black-box risks.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: HUMAN APPROVAL FIREWALL (CORE DIFFERENTIATOR)
          ---------------------------------------------------- */}
      {activePillar === 'approval-firewall' && (
        <div className="mt-6 flex flex-col gap-5 perspective-container">
          {/* Main Firewall Interception Card with 3D Depth */}
          <div className="p-5 sm:p-6 rounded-hero bg-surface-panel border-2 border-plum/30 shadow-clay-card clay-card-3d">
            {/* Top Firewall Alert Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border-subtle clay-card-3d-content">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-control bg-plum-light border border-plum-border flex items-center justify-center text-plum-deep">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-plum-deep uppercase tracking-wider block">
                    Human Approval Firewall • Mutation Intercepted
                  </span>
                  <span className="text-xs text-ink-muted">Server Boundary Security Policy Triggered</span>
                </div>
              </div>
              <Badge variant="danger" className="clay-card-3d-badge">CRITICAL ACTION PENDING</Badge>
            </div>

            {/* Mutation Summary */}
            <div className="mt-4 clay-card-3d-content">
              <div className="text-xs font-mono text-ink-muted mb-1">AGENT INTENDED ACTION:</div>
              <h4 className="text-base sm:text-lg font-extrabold text-ink leading-snug">
                Send Enterprise Proposal &amp; Binding Service Agreement to Acme Corp ($24,000/yr)
              </h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs font-mono text-ink-muted">
                <span>Record: Salesforce OPP-90214</span>
                <span>Payload Hash: sha256:7f83b165...904b</span>
                <span className="text-plum-deep font-bold">Severity: High Financial Impact</span>
              </div>
            </div>

            {/* Inspectable Payload Preview in Recessed Clay Well */}
            <div className="mt-4 p-4 rounded-control bg-surface-white border border-border-subtle shadow-clay-inset clay-card-3d-content">
              <span className="text-[11px] font-mono font-bold text-ink-muted block uppercase mb-2">
                Cryptographic Payload Preview:
              </span>
              <div className="space-y-1.5 text-xs font-mono text-ink">
                <div className="flex items-center justify-between py-1 border-b border-border-subtle/50">
                  <span className="text-ink-muted">Recipient:</span>
                  <span className="font-bold">sarah.chen@acmecorp.com</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-subtle/50">
                  <span className="text-ink-muted">Contract Terms:</span>
                  <span className="font-bold">Annual Enterprise, Net 30, 99.9% Uptime SLA</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-subtle/50">
                  <span className="text-ink-muted">Generated Document:</span>
                  <span className="text-plum font-bold">Acme_Corp_SOW_Nov2026.pdf (142 KB)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-ink-muted">Interception Gate:</span>
                  <span className="text-sage-dark font-bold">Server Authoritative Checkpoint #TX-89211</span>
                </div>
              </div>
            </div>

            {/* Interactive Decision States */}
            {approvalDecision === 'pending' && (
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-border-subtle clay-card-3d-content">
                <button
                  type="button"
                  onClick={() => setIsPromptingRejection(true)}
                  className="px-4 py-3 rounded-control text-xs sm:text-sm font-bold text-ink-muted hover:text-ink hover:bg-surface-inset border border-border-subtle transition-all min-h-[48px] select-none"
                >
                  ✕ Reject &amp; Request Revision
                </button>
                <Button
                  onClick={() => setApprovalDecision('approved')}
                  size="lg"
                  className="min-h-[48px] font-bold"
                >
                  <Check className="w-4 h-4 mr-2" />
                  ✓ Approve &amp; Execute Action
                </Button>
              </div>
            )}

            {/* Rejection Prompt Modal/Drawer */}
            {isPromptingRejection && approvalDecision === 'pending' && (
              <div className="mt-4 p-4 rounded-panel bg-surface-white border border-plum-border clay-card-3d-content">
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Provide revision instruction for the agent:
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 rounded-control text-xs bg-surface-inset border border-border-subtle text-ink font-sans focus:outline-none focus:border-plum"
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPromptingRejection(false)}
                    className="px-3 py-1.5 text-xs font-bold text-ink-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                  <Button
                    onClick={() => {
                      setApprovalDecision('rejected');
                      setIsPromptingRejection(false);
                    }}
                    variant="danger"
                    size="sm"
                    className="min-h-[40px]"
                  >
                    Confirm Rejection
                  </Button>
                </div>
              </div>
            )}

            {/* Approved State Feedback */}
            {approvalDecision === 'approved' && (
              <div className="mt-6 p-4 rounded-panel bg-sage-light border border-sage-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in clay-card-3d-content">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sage-deep text-white flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-extrabold text-sage-dark">
                      ACTION APPROVED &amp; DISPATCHED
                    </h5>
                    <p className="text-xs text-ink font-medium">
                      Executed via SendGrid API with immutable audit log record #TX-89211.
                    </p>
                    <span className="text-[10px] font-mono text-ink-muted">
                      Signed by: admin@workspace.corp • Verified at {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => setApprovalDecision('pending')}
                  size="sm"
                  variant="outline"
                  className="min-h-[44px] shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Reset Simulation
                </Button>
              </div>
            )}

            {/* Rejected State Feedback */}
            {approvalDecision === 'rejected' && (
              <div className="mt-6 p-4 rounded-panel bg-plum-light border border-plum-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in clay-card-3d-content">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-plum-deep text-white flex items-center justify-center shrink-0">
                    <X className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-extrabold text-plum-deep">
                      ACTION REJECTED &amp; BLOCKED
                    </h5>
                    <p className="text-xs text-ink font-medium">
                      Returned to B2B Sales Swarm with instruction: &ldquo;{rejectionReason}&rdquo;
                    </p>
                    <span className="text-[10px] font-mono text-ink-muted">
                      Audit Trail Updated • Zero External Side Effects Caused
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => setApprovalDecision('pending')}
                  size="sm"
                  variant="outline"
                  className="min-h-[44px] shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Reset Simulation
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          BOTTOM SHOWCASE PROOF BANNER
          ---------------------------------------------------- */}
      <div className="mt-6 pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sage-deep" />
          <span className="font-medium">Every action inspectable before execution. Zero black-box mutations.</span>
        </div>
        <Link
          href="/dashboard"
          className="text-plum-deep font-bold hover:underline flex items-center gap-1 min-h-[40px]"
        >
          <span>Open Full Qwenton Studio in Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
