'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Plus, Bot, ArrowRight, Archive, MessageSquare } from 'lucide-react';
import { Agent } from '@/lib/db/types';

export default function AgentsListPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">My AI Agents</h1>
            <p className="text-xs text-ink-muted mt-1">
              You have used {activeCount} of {maxLimit} allowed agent slots ({entitlements?.planName || 'Normal Plan'}).
            </p>
          </div>

          <Link href="/agents/new">
            <Button disabled={entitlements?.isAtLimit} className="gap-2">
              <Plus className="w-4 h-4" />
              <span>Create New Agent</span>
            </Button>
          </Link>
        </div>

        {/* Limit Warning Banner if reached */}
        {entitlements?.isAtLimit ? (
          <div className="bg-[#FDF4E7] border border-[#F5E2C4] p-4 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-amber-approval/20 text-amber-approval flex items-center justify-center font-bold">
                !
              </div>
              <div>
                <div className="text-sm font-bold text-[#8C5D1E]">
                  Agent Allowance Reached ({activeCount} / {maxLimit})
                </div>
                <div className="text-xs text-[#8C5D1E]/80">
                  Upgrade to Lite (4), Pro (9), or Ultra (15) agents to unlock additional coworker slots.
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

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="clay-surface p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <Avatar name={agent.name} size="lg" variant="agent" />
                  <Badge variant={agent.status === 'active' ? 'success' : 'amber'}>
                    ● {agent.status}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-ink mb-1">{agent.name}</h3>
                <p className="text-xs text-primary-deep font-semibold mb-3">{agent.role}</p>
                <p className="text-xs text-ink-muted leading-relaxed mb-6">
                  {agent.description || 'No description provided.'}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-muted font-medium">Tools:</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {agent.enabledTools.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8F6F1] border border-border text-ink">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/agents/${agent.id}`} className="flex-1">
                    <Button size="sm" className="w-full gap-2">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Workspace</span>
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
      </div>
    </AppShell>
  );
}
