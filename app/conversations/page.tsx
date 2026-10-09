'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { MessageSquare, ArrowRight, Clock, Bot } from 'lucide-react';
import { Conversation, Agent } from '@/lib/db/types';
import { formatDate } from '@/lib/utils';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [agents, setAgents] = useState<Record<string, Agent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      try {
        const [convsRes, agentsRes] = await Promise.all([
          fetch('/api/conversations'),
          fetch('/api/agents'),
        ]);

        if (agentsRes.ok) {
          const aData = await agentsRes.json();
          const map: Record<string, Agent> = {};
          (aData.agents || []).forEach((a: Agent) => {
            map[a.id] = a;
          });
          setAgents(map);
        }

        if (convsRes.ok) {
          const cData = await convsRes.json();
          setConversations(cData.conversations || []);
        }
      } catch (e) {
        console.error('Error loading conversations:', e);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, []);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Conversation History</h1>
          <p className="text-xs text-ink-muted mt-1">
            Review past agent runs, research reports, and tool execution logs.
          </p>
        </div>

        <div className="space-y-3">
          {conversations.length === 0 ? (
            <div className="clay-surface p-12 text-center text-ink-muted text-xs">
              No conversations started yet. Select an agent to start chatting.
            </div>
          ) : (
            conversations.map((conv) => {
              const agent = agents[conv.agentId];
              return (
                <div
                  key={conv.id}
                  className="clay-surface p-5 flex items-center justify-between hover:shadow-clay-card-hover transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Avatar name={agent?.name || 'Agent'} size="md" variant="agent" />
                    <div>
                      <h3 className="text-sm font-bold text-ink">{conv.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
                        <span className="font-semibold text-primary">{agent?.name || 'Assigned Coworker'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(conv.lastMessageAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/agents/${conv.agentId}`}>
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <span>Resume</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
