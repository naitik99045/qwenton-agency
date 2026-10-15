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
  Globe2,
  TrendingUp,
  BarChart2,
  Search,
  Video,
  Layers,
  Volume2,
  Compass,
  Film,
  Users,
  DollarSign,
  Lock,
  Link2,
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
  accountName?: string;
  authMethod?: string;
  config?: Record<string, any>;
  botUsername?: string;
  authType: string;
  requiresApproval: boolean;
}

const PROVIDER_DOCS: Record<string, { label: string; url: string; hint: string }> = {
  meta_ads: {
    label: 'Meta for Developers (Marketing API)',
    url: 'https://developers.facebook.com/apps/',
    hint: 'Generate an Access Token with ads_read and ads_management permissions to optimize ad campaigns and ROAS.',
  },
  tiktok: {
    label: 'TikTok for Business Developer Portal',
    url: 'https://business-api.tiktok.com/portal/',
    hint: 'Create a TikTok developer app and paste your Long-Term Business Access Token.',
  },
  instagram_creators: {
    label: 'Meta Creator Marketplace Portal',
    url: 'https://developers.facebook.com/docs/instagram-api/creator-marketplace/',
    hint: 'Connect your Instagram Professional or Business account with Creator Marketplace permissions.',
  },
  higgsfield: {
    label: 'Higgsfield AI Developer Portal',
    url: 'https://higgsfield.ai',
    hint: 'Generate an API Key on Higgsfield for cinematic generative video shots, motion dynamics, and camera angles.',
  },
  canva: {
    label: 'Canva Developer Portal (Connect API)',
    url: 'https://www.canva.com/developers/',
    hint: 'Create an integration on Canva Connect API to auto-generate and export branded templates.',
  },
  elevenlabs: {
    label: 'ElevenLabs API Keys',
    url: 'https://elevenlabs.io/app/settings/api-keys',
    hint: 'Obtain an API key from ElevenLabs to enable voice cloning, podcasting, and audio speech narration.',
  },
  similarweb: {
    label: 'Similarweb API Console',
    url: 'https://www.similarweb.com/corp/developer/',
    hint: 'Generate a Similarweb REST API Key to analyze domain traffic, channels, visitor demographics, and competitor rankings.',
  },
  ahrefs: {
    label: 'Ahrefs API Portal',
    url: 'https://ahrefs.com/api',
    hint: 'Create an API Key on Ahrefs to query organic keywords, backlinks, search volume, and domain rankings.',
  },
  brand24: {
    label: 'Brand24 Developer Integrations',
    url: 'https://brand24.com/integrations/',
    hint: 'Enter your Brand24 API Key to stream real-time brand mentions, sentiment alerts, and influencer reach.',
  },
  vercel: {
    label: 'Vercel Account Tokens',
    url: 'https://vercel.com/account/tokens',
    hint: 'Create a personal access token on Vercel to inspect preview deployments and domain configs.',
  },
  dify: {
    label: 'Dify AI Workspace Settings',
    url: 'https://dify.ai',
    hint: 'Enter your Dify API Key or App Secret to trigger external multi-agent pipelines and workflows.',
  },
  perplexity: {
    label: 'Perplexity AI Settings (API)',
    url: 'https://www.perplexity.ai/settings/api',
    hint: 'Generate an API key on Perplexity AI for real-time cited web search, Sonar models, and deep research.',
  },
  huggingface: {
    label: 'Hugging Face Access Tokens',
    url: 'https://huggingface.co/settings/tokens',
    hint: 'Create an Access Token with read permissions on Hugging Face to query open-source models, embeddings, and spaces.',
  },
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

const PROVIDER_SCOPES: Record<string, { scopes: string[]; accountPlaceholder: string }> = {
  canva: {
    scopes: [
      'Access brand kits, color palettes, and Canva design templates',
      'Export and auto-generate presentations, flyers, and social media banners',
      'Enforce Human-in-the-Loop review before publishing public designs',
    ],
    accountPlaceholder: 'e.g. creative@youragency.com or Canva Team Workspace',
  },
  higgsfield: {
    scopes: [
      'Generate cinematic AI video prompts, scenes, and camera angles',
      'Preview dynamic motion clips and video compositions',
      'Automatic approval safeguard before final video distribution',
    ],
    accountPlaceholder: 'e.g. studio@production.ai',
  },
  huggingface: {
    scopes: [
      'Query open-source LLMs, embeddings, and serverless inference APIs',
      'Inspect dataset schemas and model benchmark telemetry',
      'Read-only access to authorized models and Spaces',
    ],
    accountPlaceholder: 'e.g. hf-workspace or user@company.ai',
  },
  perplexity: {
    scopes: [
      'Real-time ground-truth internet search with live academic and web citations',
      'Deep Sonar market research and competitor telemetry analysis',
      'Automated fact-checking and source verification',
    ],
    accountPlaceholder: 'e.g. research@company.com',
  },
  meta_ads: {
    scopes: [
      'Read ad spend, ROAS, CPC, and campaign performance analytics',
      'Draft ad creative variations and audience split-tests',
      'Budget adjustments strictly require your 1-click Human Approval',
    ],
    accountPlaceholder: 'e.g. act_marketing_manager or ads@company.com',
  },
  tiktok: {
    scopes: [
      'Analyze TikTok Ads campaign ROI, video hook rates, and conversions',
      'Draft TikTok ad creative angles and trend recommendations',
      'Ad spend and campaign launches require approval in inbox',
    ],
    accountPlaceholder: 'e.g. tiktok_ads_account or user@brand.com',
  },
  instagram_creators: {
    scopes: [
      'Search creator profiles, engagement rates, and niche demographics',
      'Draft influencer collaboration briefs and pitch proposals',
      'Sending creator offers requires your confirmation',
    ],
    accountPlaceholder: 'e.g. @brand_collabs or creators@brand.com',
  },
  elevenlabs: {
    scopes: [
      'Synthesize ultra-realistic voice narration and brand speech clips',
      'Access approved voice clones and audio tone profiles',
      'Auditing generated audio duration and credit allocations',
    ],
    accountPlaceholder: 'e.g. audio@agency.com',
  },
  similarweb: {
    scopes: [
      'Analyze competitor domain traffic, traffic sources, and bounce rates',
      'Benchmark industry market share and referral channels',
      'Generate automated digital intelligence reports',
    ],
    accountPlaceholder: 'e.g. intel@company.com',
  },
  ahrefs: {
    scopes: [
      'Track organic search rankings, backlink profiles, and keyword volume',
      'Audit competitor SEO gaps and content opportunities',
      'Sync weekly SEO performance health scores',
    ],
    accountPlaceholder: 'e.g. seo-lead@company.com',
  },
  brand24: {
    scopes: [
      'Stream real-time brand mentions across Twitter, Reddit, and news',
      'Track sentiment shifts and PR crisis alert signals',
      'Deliver automated daily brand reputation digests',
    ],
    accountPlaceholder: 'e.g. reputation@company.com',
  },
  vercel: {
    scopes: [
      'Inspect preview deployment logs, status checks, and branch URLs',
      'Trigger preview builds and verify deployment health',
      'Production domain or deploy modifications require human approval',
    ],
    accountPlaceholder: 'e.g. engineering@company.com or Vercel Team',
  },
  dify: {
    scopes: [
      'Trigger Dify multi-agent pipelines and knowledge base workflows',
      'Pass conversation context into external orchestration DAGs',
      'Receive structured workflow responses in agent memory',
    ],
    accountPlaceholder: 'e.g. dify-prod-cluster',
  },
  slack: {
    scopes: [
      'Read messages in designated public channels and mentions',
      'Post agent reports, summaries, and alerts to channels',
      'Direct client messaging requires your approval',
    ],
    accountPlaceholder: 'e.g. #general or team-workspace',
  },
  google_drive: {
    scopes: [
      'Read documents, presentations, and spreadsheets in designated folder',
      'Draft and organize client proposals and report documents',
      'Permanent deletion or sharing permission changes locked',
    ],
    accountPlaceholder: 'e.g. drive@company.com',
  },
  google_calendar: {
    scopes: [
      'Inspect team availability and upcoming marketing milestones',
      'Draft client meeting slots and sync agenda descriptions',
      'Sending external calendar invites requires 1-click confirmation',
    ],
    accountPlaceholder: 'e.g. meetings@company.com',
  },
  gmail: {
    scopes: [
      'Draft customer replies, follow-ups, and marketing newsletters',
      'Read incoming inquiries in specific label or thread',
      'Sending any email strictly requires your 1-click Human Approval',
    ],
    accountPlaceholder: 'e.g. outreach@company.com',
  },
  google_maps: {
    scopes: [
      'Query Google Places and local business listings',
      'Audit competitor reviews, ratings, and local search visibility',
      'Analyze local keyword rankings across geographic zones',
    ],
    accountPlaceholder: 'e.g. local-seo@company.com',
  },
  instagram: {
    scopes: [
      'Read Instagram feed engagement, comments, and follower metrics',
      'Prepare grid posts, carousels, and captions',
      'Publishing to live feed requires your 1-click Human Approval',
    ],
    accountPlaceholder: 'e.g. @your_official_page',
  },
  facebook: {
    scopes: [
      'Read Facebook page posts, comments, and follower engagement',
      'Draft organic posts, updates, and community announcements',
      'Publishing to Facebook Page requires your approval',
    ],
    accountPlaceholder: 'e.g. Facebook Page Name',
  },
};

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'marketing' | 'design' | 'productivity' | 'ai_vault'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<IntegrationItem | null>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'oauth' | 'manual'>('oauth');
  const [accountLabelInput, setAccountLabelInput] = useState('');

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
      if (fbUser) {
        setCurrentUser(fbUser);
        fetchIntegrations();
      }
    });
    return () => unsubscribe();
  }, []);

  const openIntegrationModal = (item: IntegrationItem) => {
    setActiveModalItem(item);
    setError(null);
    setSaveSuccess(null);
    setApiKeyInput('');
    setAuthMode(
      item.provider === 'telegram'
        ? 'manual'
        : item.authMethod?.includes('Manual')
        ? 'manual'
        : 'oauth'
    );
    setAccountLabelInput(
      item.accountName ||
      currentUser?.email ||
      currentUser?.displayName ||
      (item.provider === 'slack' ? '#general' : 'work@mybrand.com')
    );
    
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
    } else if (item.provider === 'meta_ads') {
      setSecondaryInput(item.config?.adAccountId || '');
    } else if (item.provider === 'vercel') {
      setSecondaryInput(item.config?.projectId || '');
    } else if (item.provider === 'huggingface') {
      setSecondaryInput(item.config?.defaultModel || '');
    } else {
      setSecondaryInput('');
    }
  };

  const handleOAuthAuthorize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeModalItem) return;
    setLoading(true);
    setError(null);
    setSaveSuccess(null);

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const configData: Record<string, any> = {};
      if (activeModalItem.provider === 'instagram') {
        configData.accountId = secondaryInput.trim();
      } else if (activeModalItem.provider === 'meta_ads') {
        configData.adAccountId = secondaryInput.trim();
      } else if (activeModalItem.provider === 'vercel') {
        configData.projectId = secondaryInput.trim();
      } else if (activeModalItem.provider === 'huggingface') {
        configData.defaultModel = secondaryInput.trim();
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
          authType: 'oauth',
          accountName: accountLabelInput.trim() || currentUser?.email || 'Authorized Account',
          agentId: selectedAgentId,
          config: configData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to authorize application');

      setSaveSuccess(`Successfully authorized ${activeModalItem.displayName} via OAuth 2.0!`);
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

  const renderSecondaryFields = () => {
    if (!activeModalItem) return null;
    if (activeModalItem.provider === 'instagram') {
      return (
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
      );
    }
    if (activeModalItem.provider === 'meta_ads') {
      return (
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
            Meta Ad Account ID (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g. act_1234567890"
            value={secondaryInput}
            onChange={(e) => setSecondaryInput(e.target.value)}
          />
          <p className="text-[11px] text-ink-muted mt-1 ml-1">
            Your numeric Ad Account ID from Meta Ads Manager (starts with act_).
          </p>
        </div>
      );
    }
    if (activeModalItem.provider === 'google_calendar') {
      return (
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
      );
    }
    if (activeModalItem.provider === 'google_drive') {
      return (
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
      );
    }
    if (activeModalItem.provider === 'gmail') {
      return (
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
      );
    }
    if (activeModalItem.provider === 'slack') {
      return (
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
      );
    }
    if (activeModalItem.provider === 'vercel') {
      return (
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
            Default Vercel Project ID / Slug (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g. prj_1234 or my-project"
            value={secondaryInput}
            onChange={(e) => setSecondaryInput(e.target.value)}
          />
        </div>
      );
    }
    if (activeModalItem.provider === 'huggingface') {
      return (
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
            Default Model Repository (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g. BAAI/bge-large-en or meta-llama/Llama-3-8b"
            value={secondaryInput}
            onChange={(e) => setSecondaryInput(e.target.value)}
          />
        </div>
      );
    }
    return null;
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
        } else if (activeModalItem.provider === 'meta_ads') {
          configData.adAccountId = secondaryInput.trim();
        } else if (activeModalItem.provider === 'vercel') {
          configData.projectId = secondaryInput.trim();
        } else if (activeModalItem.provider === 'huggingface') {
          configData.defaultModel = secondaryInput.trim();
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
            authType: 'api_key',
            accountName: accountLabelInput.trim() || 'Manual API Key',
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
      case 'meta_ads':
        return <DollarSign className="w-5 h-5 text-[#1877F2]" />;
      case 'tiktok':
        return <Video className="w-5 h-5 text-ink" />;
      case 'instagram_creators':
        return <Users className="w-5 h-5 text-[#E1306C]" />;
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
      case 'higgsfield':
        return <Film className="w-5 h-5 text-[#84CC16]" />;
      case 'canva':
        return <Palette className="w-5 h-5 text-[#00C4CC]" />;
      case 'figma':
        return <Palette className="w-5 h-5 text-[#F24E1E]" />;
      case 'fal_ai':
        return <Sparkles className="w-5 h-5 text-[#523E8C]" />;
      case 'elevenlabs':
        return <Volume2 className="w-5 h-5 text-ink" />;
      case 'similarweb':
        return <Globe2 className="w-5 h-5 text-[#3B82F6]" />;
      case 'ahrefs':
        return <BarChart2 className="w-5 h-5 text-[#F97316]" />;
      case 'brand24':
        return <Radio className="w-5 h-5 text-[#10B981]" />;
      case 'vercel':
        return <Zap className="w-5 h-5 text-ink" />;
      case 'dify':
        return <Layers className="w-5 h-5 text-[#6366F1]" />;
      case 'google_drive':
        return <FolderLock className="w-5 h-5 text-[#FBBC05]" />;
      case 'notion':
        return <BookOpen className="w-5 h-5 text-ink" />;
      case 'slack':
        return <MessageSquare className="w-5 h-5 text-[#4A154B]" />;
      case 'perplexity':
        return <Compass className="w-5 h-5 text-[#0D9488]" />;
      case 'huggingface':
        return <Bot className="w-5 h-5 text-[#F59E0B]" />;
      case 'openai':
      case 'anthropic':
      case 'gemini':
      case 'groq':
        return <Cpu className="w-5 h-5 text-primary-deep" />;
      default:
        return <Key className="w-5 h-5 text-primary" />;
    }
  };

  const filteredIntegrations = integrations.filter((i) => {
    const matchesCategory = activeTab === 'all' || i.category === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      i.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (cat: 'all' | 'marketing' | 'design' | 'productivity' | 'ai_vault') => {
    if (cat === 'all') return integrations.length;
    return integrations.filter((i) => i.category === cat).length;
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-ink tracking-tight">Universal Tools & Connector Mesh</h1>
              <Badge variant="info">20+ Connected APIs</Badge>
            </div>
            <p className="text-xs text-ink-muted mt-1 max-w-2xl">
              Connect marketing ad channels, creative video suites, SEO intelligence, document storage, and AI reasoning models. Every connector runs with Human-in-the-Loop approval safeguards.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 20+ connectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-border bg-white text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3">
          {[
            { id: 'all', label: 'All Connectors', count: getCategoryCount('all'), icon: Sparkles },
            { id: 'marketing', label: 'Marketing & Ads', count: getCategoryCount('marketing'), icon: Instagram },
            { id: 'design', label: 'Creative & Video', count: getCategoryCount('design'), icon: Film },
            { id: 'productivity', label: 'Productivity & SEO', count: getCategoryCount('productivity'), icon: FolderLock },
            { id: 'ai_vault', label: 'AI Models & Reasoning', count: getCategoryCount('ai_vault'), icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-control text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-clay-button'
                    : 'bg-white text-ink-muted border border-border/70 hover:bg-black/5 hover:text-ink'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F8F6F1] text-ink-muted font-semibold'
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

                {item.status === 'connected' && (
                  <div className="mb-3 px-2.5 py-1.5 rounded-control bg-[#E5F4EC]/70 border border-[#C8E8D7] text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                      <span className="font-semibold text-ink truncate text-[11px]">
                        {item.accountName ? `Authorized: ${item.accountName}` : 'Authorized & Active'}
                      </span>
                    </div>
                    <span className="text-[10px] text-success/90 font-mono font-medium shrink-0 ml-1">
                      {item.authMethod?.includes('OAuth') || !item.maskedKey ? 'OAuth 2.0' : item.maskedKey}
                    </span>
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
                  {item.status === 'connected' ? (
                    <>
                      <Key className="w-3 h-3" />
                      <span>Manage</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" />
                      <span>Connect</span>
                    </>
                  )}
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
            title={
              activeModalItem.provider === 'telegram'
                ? 'Connect Telegram Coworker Bot'
                : activeModalItem.status === 'connected'
                ? `Manage ${activeModalItem.displayName}`
                : `Connect ${activeModalItem.displayName}`
            }
            description={
              activeModalItem.provider === 'telegram'
                ? 'Link your Telegram coworker bot token to enable live mobile approvals.'
                : authMode === 'oauth'
                ? `Authorize Qwenton Agents to access and orchestrate ${activeModalItem.displayName}.`
                : `Configure custom developer API credentials for ${activeModalItem.displayName}.`
            }
          >
            <div className="space-y-4 pt-2">
              {/* Security & Safeguard Notice */}
              <div className="bg-[#F8F6F1] p-3.5 rounded-card text-xs text-ink space-y-1.5 border border-border">
                <p className="font-bold flex items-center gap-1.5 text-primary">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Security & Approval Safeguard</span>
                </p>
                <p className="text-ink-muted leading-relaxed">
                  Workspace connections are securely encrypted. Any high-impact external actions (publishing ad creatives, sending client emails, launching code) automatically pause for your Human-in-the-Loop Approval in your inbox.
                </p>
              </div>

              {/* Current Active Connection Status Banner */}
              {activeModalItem.status === 'connected' && (
                <div className="p-3 bg-white border border-border rounded-control flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <span className="text-ink-muted block text-[11px]">Current Status</span>
                    <span className="font-bold text-success flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Connected & Verified: {activeModalItem.accountName || activeModalItem.maskedKey || 'Active'}</span>
                    </span>
                    <span className="text-[10px] text-ink-muted block mt-0.5">
                      Method: {activeModalItem.authMethod || (activeModalItem.maskedKey ? 'Manual API Key' : '1-Click OAuth 2.0')}
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

              {/* Auth Mode Toggle for Non-Telegram Providers */}
              {activeModalItem.provider !== 'telegram' && (
                <div className="flex border-b border-border/70 pb-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('oauth')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-control text-xs font-bold transition-all ${
                      authMode === 'oauth'
                        ? 'bg-primary text-white shadow-clay-button'
                        : 'bg-white text-ink-muted border border-border/80 hover:bg-black/5 hover:text-ink'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>1-Click Authorize (OAuth 2.0)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('manual')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-control text-xs font-bold transition-all ${
                      authMode === 'manual'
                        ? 'bg-primary text-white shadow-clay-button'
                        : 'bg-white text-ink-muted border border-border/80 hover:bg-black/5 hover:text-ink'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Manual API Key / Token</span>
                  </button>
                </div>
              )}

              {/* 1-Click OAuth Authorization View */}
              {activeModalItem.provider !== 'telegram' && authMode === 'oauth' ? (
                <div className="space-y-4">
                  {/* Visual Handshake Banner */}
                  <div className="p-4 rounded-card bg-[#F8F6F1] border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[12px] bg-[#523E8C] text-white flex items-center justify-center font-black text-sm shadow-clay-button-subtle">
                        Q
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
                        <Shield className="w-4 h-4 text-success" />
                        <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
                      </div>
                      <div className="w-11 h-11 rounded-[12px] bg-white border border-border flex items-center justify-center shadow-clay-button-subtle">
                        {getProviderIcon(activeModalItem.provider)}
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge variant="success" className="text-[10px]">
                        OAuth 2.0 Ready
                      </Badge>
                      <p className="text-[10px] text-ink-muted mt-0.5">Zero API Key Required</p>
                    </div>
                  </div>

                  {/* Request Statement */}
                  <div>
                    <h4 className="text-sm font-bold text-ink">
                      Authorize Qwenton Agents to use your {activeModalItem.displayName} services
                    </h4>
                    <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                      Connect your account seamlessly. Your AI agents will read telemetry, create creative briefs, and prepare assets on your behalf.
                    </p>
                  </div>

                  {/* Scopes & Permissions Breakdown */}
                  <div className="p-3.5 rounded-card bg-white border border-border space-y-2 shadow-xs">
                    <span className="text-[10px] font-bold text-ink uppercase tracking-wider block text-ink-light">
                      Requested Access Scopes & Safeguards
                    </span>
                    {(
                      PROVIDER_SCOPES[activeModalItem.provider]?.scopes || [
                        `Read workspace data and telemetry for ${activeModalItem.displayName}`,
                        'Draft automated workflows, creative assets, and intelligence queries',
                        'Human-in-the-Loop Safeguard: High-impact actions require explicit inbox approval',
                      ]
                    ).map((scopeText, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-ink">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span className="leading-snug">{scopeText}</span>
                      </div>
                    ))}
                  </div>

                  {/* Account Label / Email Input */}
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                      Authorize as Account / Workspace
                    </label>
                    <Input
                      type="text"
                      placeholder={
                        PROVIDER_SCOPES[activeModalItem.provider]?.accountPlaceholder ||
                        'e.g. user@company.com or Workspace ID'
                      }
                      value={accountLabelInput}
                      onChange={(e) => setAccountLabelInput(e.target.value)}
                      required
                    />
                    <p className="text-[11px] text-ink-muted mt-1 ml-1">
                      The email, organization handle, or workspace name being linked.
                    </p>
                  </div>

                  {/* Secondary Fields (if applicable) */}
                  {renderSecondaryFields()}

                  {/* Assigned AI Agent */}
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                      Assign Primary AI Coworker Agent
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

                  {/* Action CTA */}
                  <div className="pt-2 space-y-2.5">
                    <Button
                      type="button"
                      onClick={handleOAuthAuthorize}
                      isLoading={loading}
                      className="w-full py-2.5 text-xs font-bold gap-2 bg-primary hover:bg-primary-deep text-white shadow-clay-button"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Authorize This Application & Connect Service</span>
                    </Button>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <button
                        type="button"
                        onClick={() => setAuthMode('manual')}
                        className="text-primary hover:underline font-medium"
                      >
                        Need custom enterprise developer keys? Switch to Manual API Key mode
                      </button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveModalItem(null)}
                        className="text-xs py-1 px-3"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Manual API Key Form View */
                <form onSubmit={handleSaveConnection} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                      {activeModalItem.provider === 'telegram'
                        ? 'Telegram Bot Token (from @BotFather)'
                        : activeModalItem.provider === 'instagram'
                        ? 'Meta / Instagram Graph API Access Token'
                        : activeModalItem.provider === 'google_drive'
                        ? 'Google API Key / Service Account Key'
                        : activeModalItem.provider === 'google_calendar'
                        ? 'Google Calendar API Key'
                        : activeModalItem.provider === 'gmail'
                        ? 'Gmail App Password'
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

                  {/* Secondary Provider Fields */}
                  {renderSecondaryFields()}

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

                  <div className="flex items-center justify-between pt-2">
                    {activeModalItem.provider !== 'telegram' ? (
                      <button
                        type="button"
                        onClick={() => setAuthMode('oauth')}
                        className="text-primary text-[11px] hover:underline font-medium"
                      >
                        ← Switch back to 1-Click Authorize mode
                      </button>
                    ) : <span />}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveModalItem(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" isLoading={loading} className="gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Save & Validate Credentials</span>
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </Dialog>
        ) : null}
      </div>
    </AppShell>
  );
}
