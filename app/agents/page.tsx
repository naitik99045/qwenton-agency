'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Plus,
  Bot,
  ArrowRight,
  Archive,
  MessageSquare,
  Sparkles,
  Zap,
  Instagram,
  Calendar,
  Users,
  MapPin,
  Palette,
  BarChart3,
  Check,
} from 'lucide-react';
import { Agent } from '@/lib/db/types';

const PREBUILT_AGENTS = [
  {
    id: 'social_media_handler',
    name: 'Instagram & Social Media Growth Lead',
    role: 'Social Media Strategist & Content Creator',
    description: 'Designs multi-slide Instagram carousels, drafts viral hooks, creates Canva design briefs, and generates FLUX visual prompts.',
    icon: Instagram,
    badge: 'Trending for Marketing',
    enabledTools: ['publish_instagram_post', 'generate_canva_asset', 'generate_flux_image', 'web_research', 'read_file', 'generate_report'],
    systemPrompt: 'You are an Expert Instagram & Social Media Specialist. You craft high-converting carousels, viral hooks, Canva design specs, and generate optimized AI image prompts for visual creatives.',
  },
  {
    id: 'calendar_posting_manager',
    name: 'Content Calendar & Posting Date Manager',
    role: 'Editorial & Schedule Coordinator',
    description: 'Schedules weekly content batches, synchronizes post dates with Google Calendar, and maintains marketing deadlines in Notion.',
    icon: Calendar,
    badge: 'Workflow Automation',
    enabledTools: ['schedule_calendar_event', 'sync_notion_workspace', 'publish_instagram_post', 'generate_report', 'calculator'],
    systemPrompt: 'You are an Editorial Calendar & Posting Date Manager. You organize marketing schedules across Google Calendar and Notion, calculate release intervals, and coordinate post dates.',
  },
  {
    id: 'meetings_arrangement_agent',
    name: 'Executive Meetings & Client Booking Agent',
    role: 'Client Concierge & Meeting Coordinator',
    description: 'Checks availability on Google Calendar, drafts professional Gmail invitations, and coordinates consultation appointments.',
    icon: Users,
    badge: 'Operations & Sales',
    enabledTools: ['schedule_calendar_event', 'send_gmail_message', 'search_google_drive', 'calculator', 'current_time', 'send_telegram_message'],
    systemPrompt: 'You are an Executive Meeting Arrangement & Client Coordinator. You manage Google Calendar appointments, draft client emails via Gmail, search Google Drive files, and send real-time Telegram updates.',
  },
  {
    id: 'local_seo_maps_agent',
    name: 'Google Maps & Local SEO Strategist',
    role: 'Local Business Growth Specialist',
    description: 'Audits competitor rankings on Google Maps, tracks customer review sentiments, and drafts targeted local outreach.',
    icon: MapPin,
    badge: 'Local Business Growth',
    enabledTools: ['search_google_maps_businesses', 'send_gmail_message', 'web_research', 'generate_report'],
    systemPrompt: 'You are a Local SEO & Business Growth Strategist. You audit local competitors on Google Maps, analyze customer reviews, and identify high-converting local marketing opportunities.',
  },
  {
    id: 'visual_brand_director',
    name: 'Visual Brand & Creative Asset Director',
    role: 'Design Systems & Creative Direction',
    description: 'Creates standardized Canva banners, audits Figma design tokens, formats color palettes, and engineers 3D image prompts.',
    icon: Palette,
    badge: 'Brand & Creative',
    enabledTools: ['generate_canva_asset', 'generate_flux_image', 'sync_notion_workspace', 'read_file', 'generate_report'],
    systemPrompt: 'You are an AI Creative Director. You help businesses design consistent visual assets, format Canva design briefs, inspect Figma tokens, and structure FLUX image generation prompts.',
  },
  {
    id: 'deep_research_analyst',
    name: 'Deep Market Intelligence & Research Analyst',
    role: 'Market Intelligence & Copy Strategist',
    description: 'Conducts in-depth competitive market scans, analyzes uploaded briefs, and prepares actionable executive dossiers.',
    icon: BarChart3,
    badge: 'Strategic Intelligence',
    enabledTools: ['web_research', 'search_google_drive', 'sync_notion_workspace', 'search_knowledge', 'calculator', 'generate_report'],
    systemPrompt: 'You are a Senior Marketing Research Assistant. You help small businesses research competitive landscapes, synthesize documents, and draft high-converting copy.',
  },
];

export default function AgentsListPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [entitlements, setEntitlements] = useState<{ activeAgents: number; maxAgents: number; isAtLimit: boolean; planName: string } | null>(null);

  const fetchAgents = async () => {
    try {
      const [agentsRes, sessionRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/auth/session'),
      ]);
      if (agentsRes.ok) {
        const data = await agentsRes.json();
        setAgents(data.agents || []);
      }
      if (sessionRes.ok) {
        const sess = await sessionRes.json();
        setEntitlements(sess.entitlements);
      }
    } catch (e) {
      console.error('Error fetching agents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handle1ClickDeploy = async (template: typeof PREBUILT_AGENTS[0]) => {
    if (entitlements?.isAtLimit) {
      alert(`You have reached your active agent limit (${entitlements.activeAgents}/${entitlements.maxAgents}). Please upgrade your plan or archive an agent.`);
      return;
    }

    setDeployingId(template.id);
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: template.name,
          role: template.role,
          description: template.description,
          systemPrompt: template.systemPrompt,
          enabledTools: template.enabledTools,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to provision agent');
      }

      const { agent } = await res.json();
      router.push(`/agents/${agent.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Failed to deploy agent: ${msg}`);
      setDeployingId(null);
    }
  };

  const handleArchive = async (agentId: string) => {
    if (!confirm('Archive this agent? Its active slot will be released.')) return;
    try {
      const res = await fetch(`/api/agents/${agentId}/archive`, { method: 'POST' });
      if (res.ok) {
        fetchAgents();
      }
    } catch (e) {
      console.error('Archive failed:', e);
    }
  };

  const maxLimit = entitlements?.maxAgents || 2;
  const activeCount = entitlements?.activeAgents || agents.length;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-ink">My AI Coworkers</h1>
              <Badge variant="info">
                {activeCount} / {maxLimit} Slots Used ({entitlements?.planName || 'Normal Plan'})
              </Badge>
            </div>
            <p className="text-xs text-ink-muted mt-1">
              Operate your active AI workforce or deploy ready-made business agents in 1 click.
            </p>
          </div>

          <Link href="/agents/new">
            <Button disabled={entitlements?.isAtLimit} className="gap-2 shadow-clay-button">
              <Plus className="w-4 h-4" />
              <span>Custom Agent Studio</span>
            </Button>
          </Link>
        </div>

        {/* Limit Warning Banner if reached */}
        {entitlements?.isAtLimit ? (
          <div className="bg-[#FDF4E7] border border-[#F5E2C4] p-4 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-amber-approval/20 text-amber-approval flex items-center justify-center font-bold">
                !
              </div>
              <div>
                <div className="text-sm font-bold text-[#8C5D1E]">
                  Agent Allowance Reached ({activeCount} / {maxLimit})
                </div>
                <div className="text-xs text-[#8C5D1E]/80">
                  Upgrade your plan to Lite (4), Pro (9), or Ultra (15) agents to unlock additional slots.
                </div>
              </div>
            </div>
            <Link href="/billing">
              <Button size="sm" variant="amber">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        ) : null}

        {/* Active Agents Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Active Deployed Agents ({agents.length})</h2>
          </div>

          {agents.length === 0 ? (
            <div className="clay-surface p-8 text-center text-xs text-ink-muted space-y-3">
              <p>You have no active agents yet. Choose a pre-built agent below or create a custom one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="clay-surface p-6 flex flex-col justify-between hover:shadow-clay-card-hover transition-all">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <Avatar name={agent.name} size="lg" variant="agent" />
                      <Badge variant={agent.status === 'active' ? 'success' : 'amber'}>
                        ● {agent.status}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-ink mb-1">{agent.name}</h3>
                    <p className="text-xs text-primary-deep font-semibold mb-2">{agent.role}</p>
                    <p className="text-xs text-ink-muted leading-relaxed mb-4 min-h-[36px]">
                      {agent.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-ink-muted font-medium">Tools:</span>
                      <span className="font-semibold text-primary">{agent.enabledTools.length} connected</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/agents/${agent.id}`} className="flex-1">
                        <Button size="sm" className="w-full gap-1.5 text-xs py-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Open Chat</span>
                        </Button>
                      </Link>

                      <button
                        onClick={() => handleArchive(agent.id)}
                        title="Archive Agent (releases slot)"
                        className="p-2 text-ink-muted hover:text-danger rounded-control hover:bg-black/5 transition-colors"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 1-Click Pre-Built Ready-Made Agents Library */}
        <div className="space-y-4 pt-4 border-t border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <h2 className="text-lg font-bold text-ink">Pre-Built Ready-to-Use Agents</h2>
              <Badge variant="amber">1-Click Launch</Badge>
            </div>
            <p className="text-xs text-ink-muted mt-1">
              Select any pre-configured digital business specialist and click <strong>"Use for Me"</strong> to immediately deploy it to your workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PREBUILT_AGENTS.map((template) => {
              const Icon = template.icon;
              const isDeploying = deployingId === template.id;
              return (
                <div
                  key={template.id}
                  className="clay-surface p-5 flex flex-col justify-between border border-border/80 hover:border-primary/50 transition-all bg-white/90"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-[12px] bg-cloud-blue text-primary flex items-center justify-center shadow-clay-button-subtle">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="info" className="text-[10px]">
                        {template.badge}
                      </Badge>
                    </div>

                    <h3 className="text-sm font-bold text-ink mb-1">{template.name}</h3>
                    <p className="text-[11px] font-semibold text-primary mb-2">{template.role}</p>
                    <p className="text-xs text-ink-muted leading-relaxed mb-4 min-h-[48px]">
                      {template.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/50 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {template.enabledTools.slice(0, 3).map((tool) => (
                        <span key={tool} className="text-[9px] px-2 py-0.5 rounded-full bg-[#F8F6F1] border border-border text-ink-muted font-mono">
                          {tool.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {template.enabledTools.length > 3 ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cloud-blue text-primary font-bold">
                          +{template.enabledTools.length - 3}
                        </span>
                      ) : null}
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      disabled={entitlements?.isAtLimit || Boolean(deployingId)}
                      isLoading={isDeploying}
                      onClick={() => handle1ClickDeploy(template)}
                      className="w-full gap-2 text-xs py-2 shadow-clay-button"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{isDeploying ? 'Deploying...' : '⚡ Use for Me (1-Click)'}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
