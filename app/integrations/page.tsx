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
  Trash2,
  Check,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Agent } from '@/lib/db/types';
import { getAuthToken, subscribeToAuthState } from '@/lib/auth/firebase-client-auth';

interface IntegrationItem {
  category: 'marketing' | 'design' | 'productivity' | 'ai_vault';
  provider: string;
  displayName: string;
  description: string;
  status: string;
  maskedKey?: string;
  config?: Record<string, any>;
  botUsername?: string;
  authType: string;
  requiresApproval: boolean;
}

const PROVIDER_DOCS: Record<string, { label: string; url: string; hint: string }> = {
  google_maps: {
    label: 'Open Google Cloud Console (Maps & Places API)',
    url: 'https://console.cloud.google.com/google/maps-apis/overview',
    hint: 'Enable "Places API" and "Maps JavaScript API" in Google Cloud, create an API Key, and paste it here.',
  },
  google_drive: {
    label: 'Open Google Cloud Console (Drive API)',
    url: 'https://console.cloud.google.com/apis/library/drive.googleapis.com',
    hint: 'Enable Google Drive API in your Google Cloud project and generate an API key or service credential.',
  },
  google_calendar: {
    label: 'Open Google Cloud Console (Calendar API)',
    url: 'https://console.cloud.google.com/apis/library/calendar-json.googleapis.com',
    hint: 'Enable Google Calendar API in Google Cloud Console to sync deadlines and client meetings.',
  },
  gmail: {
    label: 'Generate Google Account App Password',
    url: 'https://myaccount.google.com/apppasswords',
    hint: 'Turn on 2-Step Verification on your Google Account, generate a 16-character "App Password", and paste it here.',
  },
  instagram: {
    label: 'Meta for Developers Portal',
    url: 'https://developers.facebook.com/apps/',
    hint: 'Requires a Meta App with instagram_basic and instagram_content_publish permissions.',
  },
  facebook: {
    label: 'Meta for Developers (Page Access Token)',
    url: 'https://developers.facebook.com/apps/',
    hint: 'Generate a Page Access Token with pages_manage_posts and pages_read_engagement.',
  },
  telegram: {
    label: 'Open @BotFather in Telegram',
    url: 'https://t.me/BotFather',
    hint: 'Send /newbot to @BotFather in Telegram, name your coworker bot, and paste the HTTP API Token.',
  },
  fal_ai: {
    label: 'Get fal.ai API Key',
    url: 'https://fal.ai/dashboard/keys',
    hint: 'Generate an API key on the fal.ai dashboard for FLUX image synthesis.',
  },
  notion: {
    label: 'Notion Developer Integrations',
    url: 'https://www.notion.so/my-integrations',
    hint: 'Create an internal integration in Notion and paste the "Internal Integration Secret".',
  },
  slack: {
    label: 'Slack API Apps Dashboard',
    url: 'https://api.slack.com/apps',
    hint: 'Create a Slack App, install to workspace, and copy the "Bot User OAuth Token" (starts with xoxb-).',
  },
  groq: {
    label: 'Groq Cloud Console',
    url: 'https://console.groq.com/keys',
    hint: 'Generate a free API key on Groq Console for ultra-fast LPU inference.',
  },
  openai: {
    label: 'OpenAI API Keys',
    url: 'https://platform.openai.com/api-keys',
    hint: 'Generate an API key in the OpenAI developer portal.',
  },
  gemini: {
    label: 'Google AI Studio',
    url: 'https://aistudio.google.com/app/apikey',
    hint: 'Create a Google Gemini API key in Google AI Studio.',
  },
  anthropic: {
    label: 'Anthropic Console',
    url: 'https://console.anthropic.com/settings/keys',
    hint: 'Create an API key in the Anthropic console.',
  },
};

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'marketing' | 'design' | 'productivity' | 'ai_vault'>('marketing');
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<IntegrationItem | null>(null);

  // Form inputs
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [secondaryInput, setSecondaryInput] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');

  const [loading, setLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const [intRes, agentsRes] = await Promise.all([
        fetch('/api/integrations', { headers }),
        fetch('/api/agents', { headers }),
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
    const unsubscribe = subscribeToAuthState((fbUser) => {
      if (fbUser) fetchIntegrations();
    });
    return () => unsubscribe();
  }, []);

  const openIntegrationModal = (item: IntegrationItem) => {
    setActiveModalItem(item);
    setError(null);
    setSaveSuccess(null);
    setApiKeyInput('');
    
    // Preload secondary config if existing
    if (item.provider === 'instagram') {
      setSecondaryInput(item.config?.accountId || '');
    } else if (item.provider === 'google_calendar') {
      setSecondaryInput(item.config?.calendarId || 'primary');
    } else if (item.provider === 'google_drive') {
      setSecondaryInput(item.config?.folderId || '');
    } else if (item.provider === 'gmail') {
      setSecondaryInput(item.config?.userEmail || '');
    } else if (item.provider === 'slack') {
      setSecondaryInput(item.config?.channel || '#general');
    } else {
      setSecondaryInput('');
    }
  };

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalItem) return;
    setLoading(true);
    setError(null);
    setSaveSuccess(null);

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      if (activeModalItem.provider === 'telegram') {
        const res = await fetch('/api/telegram/connect', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            botToken: apiKeyInput,
            agentId: selectedAgentId,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to connect Telegram bot');
      } else {
        const configData: Record<string, any> = {};
        if (activeModalItem.provider === 'instagram') {
          configData.accountId = secondaryInput.trim();
        } else if (activeModalItem.provider === 'google_calendar') {
          configData.calendarId = secondaryInput.trim() || 'primary';
        } else if (activeModalItem.provider === 'google_drive') {
          configData.folderId = secondaryInput.trim();
        } else if (activeModalItem.provider === 'gmail') {
          configData.userEmail = secondaryInput.trim();
        } else if (activeModalItem.provider === 'slack') {
          configData.channel = secondaryInput.trim() || '#general';
        }

        const res = await fetch('/api/integrations', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            provider: activeModalItem.provider,
            apiKey: apiKeyInput,
            agentId: selectedAgentId,
            config: configData,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save credentials');
      }

      setSaveSuccess(`${activeModalItem.displayName} successfully connected & verified!`);
      setTimeout(() => {
        setActiveModalItem(null);
        setApiKeyInput('');
        setSecondaryInput('');
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

  const handleDisconnect = async () => {
    if (!activeModalItem) return;
    if (!confirm(`Are you sure you want to disconnect ${activeModalItem.displayName}?`)) return;

    setDisconnecting(true);
    setError(null);
    setSaveSuccess(null);

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/integrations?provider=${activeModalItem.provider}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to disconnect integration');

      setSaveSuccess(`${activeModalItem.displayName} disconnected successfully.`);
      setTimeout(() => {
        setActiveModalItem(null);
        setApiKeyInput('');
        setSecondaryInput('');
        setSaveSuccess(null);
        fetchIntegrations();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setDisconnecting(false);
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
                <p className="text-xs text-ink-muted leading-relaxed mb-3 min-h-[36px]">
                  {item.description}
                </p>

                {item.status === 'connected' && item.maskedKey && (
                  <div className="mb-3 px-2.5 py-1.5 rounded-control bg-[#E5F4EC]/60 border border-[#C8E8D7] text-[11px] font-mono text-success flex items-center justify-between">
                    <span>Key: {item.maskedKey}</span>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-ink-light flex items-center gap-1">
                  {item.requiresApproval ? '🛡️ Human Approval' : '⚡ Direct Execution'}
                </span>

                <Button
                  size="sm"
                  variant={item.status === 'connected' ? 'outline' : 'primary'}
                  onClick={() => openIntegrationModal(item)}
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
            title={`Configure ${activeModalItem.displayName}`}
            description="Securely link your credentials and assign which AI agent can utilize this integration."
          >
            <div className="space-y-4 pt-2">
              <div className="bg-[#F8F6F1] p-3.5 rounded-card text-xs text-ink space-y-1.5 border border-border">
                <p className="font-bold flex items-center gap-1.5 text-primary">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Security & Approval Safeguard</span>
                </p>
                <p className="text-ink-muted leading-relaxed">
                  Keys are stored encrypted and isolated to your workspace. All external write actions (publishing Instagram posts, sending client emails, scheduling meetings) automatically pause for your Human Approval in your inbox before executing.
                </p>
              </div>

              {activeModalItem.status === 'connected' && activeModalItem.maskedKey && (
                <div className="p-3 bg-white border border-border rounded-control flex items-center justify-between text-xs">
                  <div>
                    <span className="text-ink-muted block text-[11px]">Current Status</span>
                    <span className="font-bold text-success flex items-center gap-1">
                      ● Active & Verified ({activeModalItem.maskedKey})
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={disconnecting}
                    onClick={handleDisconnect}
                    className="text-danger hover:text-danger hover:bg-danger/10 text-xs py-1 px-2.5 gap-1 border-danger/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </Button>
                </div>
              )}

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
                {/* Primary Credential Input */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                    {activeModalItem.provider === 'telegram'
                      ? 'Telegram Bot Token (from @BotFather)'
                      : activeModalItem.provider === 'instagram'
                      ? 'Meta / Instagram Graph API Access Token'
                      : activeModalItem.provider === 'google_drive'
                      ? 'Google API Key / Service Account Key / OAuth Token'
                      : activeModalItem.provider === 'google_calendar'
                      ? 'Google Calendar API Key / OAuth Token'
                      : activeModalItem.provider === 'gmail'
                      ? 'Gmail App Password / OAuth Token'
                      : activeModalItem.provider === 'slack'
                      ? 'Slack Bot User OAuth Token (xoxb-...)'
                      : activeModalItem.provider === 'notion'
                      ? 'Notion Internal Integration Secret (secret_...)'
                      : `${activeModalItem.displayName} API Key`}
                  </label>
                  <Input
                    type="password"
                    placeholder={
                      activeModalItem.provider === 'instagram'
                        ? 'Paste Meta Graph API token (e.g. EAABw...)'
                        : activeModalItem.provider === 'telegram'
                        ? 'e.g. 7123456789:AAH...'
                        : 'Paste API key or secret token here...'
                    }
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    required
                  />
                  {PROVIDER_DOCS[activeModalItem.provider] && (
                    <div className="mt-2 p-2.5 rounded-control bg-[#F8F6F1] border border-border/80 text-[11px] space-y-1">
                      <p className="text-ink-muted leading-relaxed">{PROVIDER_DOCS[activeModalItem.provider].hint}</p>
                      <a
                        href={PROVIDER_DOCS[activeModalItem.provider].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-primary hover:text-primary-deep inline-flex items-center gap-1 hover:underline"
                      >
                        <span>{PROVIDER_DOCS[activeModalItem.provider].label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Secondary Provider Specific Fields */}
                {activeModalItem.provider === 'instagram' && (
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                      Instagram Business Account ID (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 17841400012345678"
                      value={secondaryInput}
                      onChange={(e) => setSecondaryInput(e.target.value)}
                    />
                    <p className="text-[11px] text-ink-muted mt-1 ml-1">
                      Your numeric Instagram Page/Account ID for direct container publishing.
                    </p>
                  </div>
                )}

                {activeModalItem.provider === 'google_calendar' && (
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                      Calendar ID
                    </label>
                    <Input
                      type="text"
                      placeholder="primary or your-email@gmail.com"
                      value={secondaryInput}
                      onChange={(e) => setSecondaryInput(e.target.value)}
                    />
                  </div>
                )}

                {activeModalItem.provider === 'google_drive' && (
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                      Root Folder ID / Drive Name (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdB..."
                      value={secondaryInput}
                      onChange={(e) => setSecondaryInput(e.target.value)}
                    />
                  </div>
                )}

                {activeModalItem.provider === 'gmail' && (
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                      Sender Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="your-business@domain.com"
                      value={secondaryInput}
                      onChange={(e) => setSecondaryInput(e.target.value)}
                    />
                  </div>
                )}

                {activeModalItem.provider === 'slack' && (
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                      Default Slack Channel
                    </label>
                    <Input
                      type="text"
                      placeholder="#general or #announcements"
                      value={secondaryInput}
                      onChange={(e) => setSecondaryInput(e.target.value)}
                    />
                  </div>
                )}

                {/* Assigned AI Coworker Agent */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                    Assign Primary AI Agent
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-border text-ink rounded-control text-sm shadow-clay-button-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
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
