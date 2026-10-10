'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import {
  Radio,
  Send,
  CheckCircle2,
  AlertCircle,
  Shield,
  ArrowRight,
  Instagram,
  Facebook,
  Mail,
  Calendar,
  MapPin,
  Palette,
  Sparkles,
  FolderLock,
  BookOpen,
  MessageSquare,
  Key,
  Cpu,
  Bot,
  Zap,
} from 'lucide-react';
import { Agent } from '@/lib/db/types';

interface IntegrationItem {
  category: 'marketing' | 'design' | 'productivity' | 'ai_vault';
  provider: string;
  displayName: string;
  description: string;
  status: string;
  botUsername?: string;
  authType: string;
  requiresApproval: boolean;
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'marketing' | 'design' | 'productivity' | 'ai_vault'>('marketing');
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<IntegrationItem | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
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

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalItem) return;
    setLoading(true);
    setError(null);
    setSaveSuccess(null);

    try {
      if (activeModalItem.provider === 'telegram') {
        const res = await fetch('/api/telegram/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            botToken: apiKeyInput,
            agentId: selectedAgentId,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to connect bot');
      } else {
        const res = await fetch('/api/integrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: activeModalItem.provider,
            apiKey: apiKeyInput,
            agentId: selectedAgentId,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save credentials');
      }

      setSaveSuccess(`${activeModalItem.displayName} successfully connected & verified!`);
      setTimeout(() => {
        setActiveModalItem(null);
        setApiKeyInput('');
        setSaveSuccess(null);
        fetchIntegrations();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-[#E1306C]" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-[#1877F2]" />;
      case 'gmail':
        return <Mail className="w-5 h-5 text-[#EA4335]" />;
      case 'google_calendar':
        return <Calendar className="w-5 h-5 text-[#4285F4]" />;
      case 'google_maps':
        return <MapPin className="w-5 h-5 text-[#34A853]" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-[#229ED9]" />;
      case 'canva':
        return <Palette className="w-5 h-5 text-[#00C4CC]" />;
      case 'figma':
        return <Palette className="w-5 h-5 text-[#F24E1E]" />;
      case 'fal_ai':
        return <Sparkles className="w-5 h-5 text-[#523E8C]" />;
      case 'google_drive':
        return <FolderLock className="w-5 h-5 text-[#FBBC05]" />;
      case 'notion':
        return <BookOpen className="w-5 h-5 text-ink" />;
      case 'slack':
        return <MessageSquare className="w-5 h-5 text-[#4A154B]" />;
      case 'openai':
      case 'anthropic':
      case 'gemini':
      case 'groq':
      case 'elevenlabs':
        return <Cpu className="w-5 h-5 text-primary-deep" />;
      default:
        return <Key className="w-5 h-5 text-primary" />;
    }
  };

  const filteredIntegrations = integrations.filter((i) => i.category === activeTab);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ink">Universal Tools & API Vault</h1>
            <Badge variant="info">Multi-App Mesh Active</Badge>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Connect your marketing channels, design suites, document workspaces, and AI model keys. Agents run securely on 1 unified platform with Human Approval safeguards.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3">
          {[
            { id: 'marketing', label: 'Marketing & Social', count: 6, icon: Instagram },
            { id: 'design', label: 'Design & Creative', count: 3, icon: Palette },
            { id: 'productivity', label: 'Productivity & Docs', count: 3, icon: FolderLock },
            { id: 'ai_vault', label: 'AI Models & Engines', count: 5, icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-control text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-clay-button'
                    : 'bg-white text-ink-muted border border-border/70 hover:bg-black/5 hover:text-ink'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F8F6F1] text-ink-muted'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Connectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIntegrations.map((item) => (
            <div key={item.provider} className="clay-surface p-5 flex flex-col justify-between hover:shadow-clay-card-hover transition-all">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-[12px] bg-white border border-border flex items-center justify-center shadow-clay-button-subtle">
                    {getProviderIcon(item.provider)}
                  </div>

                  <Badge variant={item.status === 'connected' ? 'success' : 'outline'} className="text-[10px]">
                    {item.status === 'connected' ? '● Connected' : 'Not Connected'}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-ink mb-1">{item.displayName}</h3>
                <p className="text-xs text-ink-muted leading-relaxed mb-4 min-h-[36px]">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-ink-light flex items-center gap-1">
                  {item.requiresApproval ? '🛡️ Human Approval' : '⚡ Direct Execution'}
                </span>

                <Button
                  size="sm"
                  variant={item.status === 'connected' ? 'outline' : 'primary'}
                  onClick={() => setActiveModalItem(item)}
                  className="text-xs py-1 px-3 gap-1.5"
                >
                  <Key className="w-3 h-3" />
                  <span>{item.status === 'connected' ? 'Manage' : 'Connect'}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Universal Connection & API Key Modal */}
        {activeModalItem ? (
          <Dialog
            isOpen={Boolean(activeModalItem)}
            onClose={() => {
              setActiveModalItem(null);
              setError(null);
              setSaveSuccess(null);
            }}
            title={`Connect ${activeModalItem.displayName}`}
            description="Configure credentials and tool permissions for this integration."
          >
            <div className="space-y-4 pt-2">
              <div className="bg-[#F8F6F1] p-3.5 rounded-card text-xs text-ink space-y-1.5 border border-border">
                <p className="font-bold flex items-center gap-1.5 text-primary">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Secure Credential Storage</span>
                </p>
                <p className="text-ink-muted leading-relaxed">
                  Keys are isolated per tenant. All external write actions (e.g. publishing posts, sending emails, booking appointments) require explicit human approval in your Safety Firewall.
                </p>
              </div>

              {saveSuccess ? (
                <div className="bg-[#EBF7F0] border border-[#BDE5CE] p-3 rounded-control text-xs text-success font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saveSuccess}</span>
                </div>
              ) : null}

              {error ? (
                <div className="bg-[#FDECEC] border border-[#F8D2D2] p-3 rounded-control text-xs text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              <form onSubmit={handleSaveConnection} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                    {activeModalItem.provider === 'telegram'
                      ? 'Telegram Bot Token (from @BotFather)'
                      : activeModalItem.authType === 'oauth'
                      ? 'Access Token / App Key'
                      : 'API Key / Secret Token'}
                  </label>
                  <Input
                    type="password"
                    placeholder="Paste secret key or token here..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Assign Primary AI Agent</label>
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveModalItem(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={loading} className="gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save & Validate Connection</span>
                  </Button>
                </div>
              </form>
            </div>
          </Dialog>
        ) : null}
      </div>
    </AppShell>
  );
}
