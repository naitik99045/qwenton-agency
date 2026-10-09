'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Bot,
  ShieldAlert,
  Play,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { Agent, Approval } from '@/lib/db/types';

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [entitlements, setEntitlements] = useState<{ activeAgents: number; maxAgents: number; isAtLimit: boolean; planName: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [agentsRes, apprRes, sessionRes] = await Promise.all([
          fetch('/api/agents'),
          fetch('/api/approvals'),
          fetch('/api/auth/session'),
        ]);

        if (agentsRes.ok) {
          const data = await agentsRes.json();
          setAgents(data.agents || []);
        }
        if (apprRes.ok) {
          const data = await apprRes.json();
          setApprovals(data.approvals || []);
        }
        if (sessionRes.ok) {
          const data = await sessionRes.json();
          setEntitlements(data.entitlements);
        }
      } catch (e) {
        console.error('Error loading dashboard:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const maxLimit = entitlements?.maxAgents || 2;
  const activeCount = entitlements?.activeAgents || agents.length;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Coworker Overview
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Observe and orchestrate your autonomous agents from one calm workspace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/agents/new">
              <Button size="md" disabled={entitlements?.isAtLimit} className="gap-2">
                <Plus className="w-4 h-4" />
                <span>Create Agent</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Top 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Agent Entitlement Meter */}
          <div className="clay-surface p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Agents</span>
              <div className="w-8 h-8 rounded-[10px] bg-cloud-blue text-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink">
                {activeCount} / {maxLimit}
              </div>
              <div className="w-full bg-border/60 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    entitlements?.isAtLimit ? 'bg-amber-approval' : 'bg-primary'
                  }`}
                  style={{
                    width: `${Math.min(100, (activeCount / maxLimit) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-ink-muted mt-2">
                {entitlements?.isAtLimit
                  ? `Limit reached (${activeCount} of ${maxLimit} agents used)`
                  : `${maxLimit - activeCount} slots available on ${entitlements?.planName || 'Normal'}`}
              </p>
            </div>
          </div>

          {/* Card 2: Active Runs */}
          <div className="clay-surface p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Active Runs</span>
              <div className="w-8 h-8 rounded-[10px] bg-[#E5F4EC] text-success flex items-center justify-center">
                <Play className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink">Ready</div>
              <p className="text-xs text-ink-muted mt-1">Autonomous loop standing by</p>
            </div>
            <div className="pt-2 text-[11px] text-success font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Safe Step Timeout: 30s</span>
            </div>
          </div>

          {/* Card 3: Pending Approvals */}
          <div className="clay-surface p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Approvals</span>
              <div className="w-8 h-8 rounded-[10px] bg-[#FDF4E7] text-amber-approval flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink">{pendingApprovals.length}</div>
              <p className="text-xs text-ink-muted mt-1">
                {pendingApprovals.length === 0 ? 'No actions waiting' : 'Human review required'}
              </p>
            </div>
            <Link href="/approvals" className="pt-2 text-[11px] text-amber-approval font-bold hover:underline flex items-center gap-1">
              <span>View Approvals Inbox</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 4: Plan & Storage */}
          <div className="clay-surface p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Plan & Usage</span>
              <div className="w-8 h-8 rounded-[10px] bg-soft-lavender text-[#523E8C] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-ink">{entitlements?.planName || 'Normal (Free)'}</div>
              <p className="text-xs text-ink-muted mt-1">FAM Gateway & OTP Ready</p>
            </div>
            <Link href="/billing" className="pt-2 text-[11px] text-primary font-bold hover:underline flex items-center gap-1">
              <span>Upgrade Capacity</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Active Agents Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <span>Your Active Agents</span>
              <Badge variant="default">{activeCount} / {maxLimit}</Badge>
            </h2>
            <Link href="/agents" className="text-xs font-bold text-primary hover:underline">
              View All Agents →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {agents.map((agent) => (
              <div key={agent.id} className="clay-surface p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <Avatar name={agent.name} size="lg" variant="agent" />
                    <Badge variant={agent.status === 'active' ? 'success' : 'amber'}>
                      ● {agent.status}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-ink mb-1 group-hover:text-primary transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-ink-muted font-medium mb-3">{agent.role}</p>
                  <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-4">
                    {agent.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="flex flex-wrap gap-1.5">
                    {agent.enabledTools.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8F6F1] border border-border text-ink-muted">
                        {t}
                      </span>
                    ))}
                    {agent.enabledTools.length > 3 ? (
                      <span className="text-[10px] px-1.5 py-0.5 text-ink-light">
                        +{agent.enabledTools.length - 3} more
                      </span>
                    ) : null}
                  </div>

                  <Link href={`/agents/${agent.id}`}>
                    <Button size="sm" className="w-full gap-2">
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {/* Empty slot placeholder if under limit */}
            {activeCount < maxLimit ? (
              <Link
                href="/agents/new"
                className="clay-surface p-6 border-2 border-dashed border-border/80 flex flex-col items-center justify-center text-center p-8 hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-[16px] bg-cloud-blue text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-ink">Add AI Coworker</h4>
                <p className="text-xs text-ink-muted mt-1">
                  Slot {activeCount + 1} of {maxLimit} available
                </p>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
