'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Radio, Send, CheckCircle2, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { Agent } from '@/lib/db/types';

interface IntegrationItem {
  provider: string;
  displayName: string;
  description: string;
  status: string;
  botUsername?: string;
  requiresApproval: boolean;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      const [intRes, agentsRes] = await Promise.all([
        fetch('/api/integrations'),
        fetch('/api/agents'),
      ]);
      if (intRes.ok) {
        const data = await intRes.json();
        setIntegrations(data.integrations || []);
      }
      if (agentsRes.ok) {
        const aData = await agentsRes.json();
        const aList = aData.agents || [];
        setAgents(aList);
        if (aList.length > 0 && !selectedAgentId) {
          setSelectedAgentId(aList[0].id);
        }
      }
    } catch (e) {
      console.error('Fetch error:', e);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleConnectTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/telegram/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken,
          agentId: selectedAgentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect bot');
      }

      setIsTelegramModalOpen(false);
      setBotToken('');
      fetchIntegrations();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectTelegram = async () => {
    if (!confirm('Disconnect your Telegram bot?')) return;
    try {
      const res = await fetch('/api/telegram/disconnect', { method: 'POST' });
      if (res.ok) {
        fetchIntegrations();
      }
    } catch (e) {
      console.error('Disconnect error:', e);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Business Tool Connectors</h1>
          <p className="text-xs text-ink-muted mt-1">
            Connect communication channels and business tools. External actions always require your explicit approval.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {integrations.map((item) => (
            <div key={item.provider} className="clay-surface p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-[14px] bg-cloud-blue text-primary flex items-center justify-center shadow-clay-button-subtle">
                    {item.provider === 'telegram' ? <Send className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
                  </div>

                  <Badge variant={item.status === 'connected' ? 'success' : 'outline'}>
                    {item.status === 'connected' ? `● Connected (${item.botUsername || ''})` : 'Not Connected'}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-ink mb-1">{item.displayName}</h3>
                <p className="text-xs text-ink-muted leading-relaxed mb-4">{item.description}</p>
              </div>

              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] text-ink-muted">
                  {item.requiresApproval ? '🛡️ Human Approval Required' : '⚡ Read-Only Sync'}
                </span>

                {item.provider === 'telegram' ? (
                  item.status === 'connected' ? (
                    <Button size="sm" variant="outline" onClick={handleDisconnectTelegram}>
                      Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => setIsTelegramModalOpen(true)}>
                      Connect Bot
                    </Button>
                  )
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    Coming Soon
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Telegram Connection Wizard Modal */}
        <Dialog
          isOpen={isTelegramModalOpen}
          onClose={() => setIsTelegramModalOpen(false)}
          title="Connect Telegram Bot"
          description="Follow these steps to link your Telegram bot to an AI coworker."
        >
          <div className="space-y-4 pt-2">
            <div className="bg-[#F8F6F1] p-3 rounded-card text-xs text-ink space-y-1.5 border border-border">
              <p className="font-bold text-ink">How to get a Bot Token:</p>
              <ol className="list-decimal list-inside space-y-1 text-ink-muted">
                <li>Open Telegram and message <strong>@BotFather</strong></li>
                <li>Send <code>/newbot</code> and follow prompts to name your bot</li>
                <li>Copy the HTTP API token provided by BotFather</li>
              </ol>
            </div>

            {error ? (
              <div className="bg-[#FDECEC] border border-[#F8D2D2] p-3 rounded-control text-xs text-danger">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleConnectTelegram} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Bot Token</label>
                <Input
                  type="password"
                  placeholder="1234567890:ABCdefGhIJKlmNoPQRstUVwxyZ..."
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Route Messages to Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-border text-ink rounded-control text-sm shadow-clay-button-subtle"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsTelegramModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                  Validate & Connect
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      </div>
    </AppShell>
  );
}
