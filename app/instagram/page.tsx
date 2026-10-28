'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import {
  Instagram,
  Film,
  Sparkles,
  MessageSquare,
  Zap,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Shield,
  ArrowRight,
  Clock,
  Send,
  Check,
  Power,
  TrendingUp,
} from 'lucide-react';
import { Agent, InstagramReelRule, InstagramAutoReplySettings } from '@/lib/db/types';
import { getAuthToken, subscribeToAuthState } from '@/lib/auth/firebase-client-auth';

export default function InstagramAutomationPage() {
  const [activeTab, setActiveTab] = useState<'reels' | 'busy_dm' | 'simulator'>('reels');
  const [rules, setRules] = useState<InstagramReelRule[]>([]);
  const [settings, setSettings] = useState<InstagramAutoReplySettings | null>(null);
  const [quota, setQuota] = useState<{
    currentReels: number;
    maxReels: number;
    isAtLimit: boolean;
    planId: string;
    planName: string;
  } | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  // Reel Rule Form Modal State
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [reelUrl, setReelUrl] = useState('');
  const [reelTitle, setReelTitle] = useState('');
  const [triggerKeyword, setTriggerKeyword] = useState('');
  const [matchType, setMatchType] = useState<'contains' | 'exact'>('contains');
  const [publicRepliesText, setPublicRepliesText] = useState(
    'Check your DM! Just sent you the details 🚀\nSent to your inbox! Check your DMs 📩\nSent the blueprint to your direct messages! 📲'
  );
  const [dmMessage, setDmMessage] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [ruleModalError, setRuleModalError] = useState<string | null>(null);
  const [isSavingRule, setIsSavingRule] = useState(false);

  // Busy & Away Settings Form State
  const [isBusyModeActive, setIsBusyModeActive] = useState(false);
  const [busyModeMessage, setBusyModeMessage] = useState('');
  const [fallbackAiReply, setFallbackAiReply] = useState(true);
  const [dmKeywordTriggers, setDmKeywordTriggers] = useState<Array<{ id: string; keyword: string; reply: string; active: boolean }>>([]);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [newReplyInput, setNewReplyInput] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  // Simulator State
  const [simType, setSimType] = useState<'comment' | 'dm'>('comment');
  const [simSelectedReelId, setSimSelectedReelId] = useState<string>('');
  const [simInputText, setSimInputText] = useState('Hey! Can you send me the GROWTH blueprint?');
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const [rulesRes, settingsRes, agentsRes] = await Promise.all([
        fetch('/api/instagram/rules', { headers }),
        fetch('/api/instagram/settings', { headers }),
        fetch('/api/agents', { headers }),
      ]);

      if (rulesRes.ok) {
        const data = await rulesRes.json();
        setRules(data.rules || []);
        setQuota(data.quota || null);
        if (data.rules && data.rules.length > 0 && !simSelectedReelId) {
          setSimSelectedReelId(data.rules[0].id);
        }
      }

      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        if (sData.settings) {
          setSettings(sData.settings);
          setIsBusyModeActive(sData.settings.isBusyModeActive || false);
          setBusyModeMessage(sData.settings.busyModeMessage || '');
          setFallbackAiReply(sData.settings.fallbackAiReply !== false);
          setDmKeywordTriggers(sData.settings.dmKeywordTriggers || []);
        }
      }

      if (agentsRes.ok) {
        const aData = await agentsRes.json();
        setAgents(aData.agents || []);
        if (aData.agents?.length > 0 && !selectedAgentId) {
          setSelectedAgentId(aData.agents[0].id);
        }
      }
    } catch (e) {
      console.error('Instagram data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = subscribeToAuthState((fbUser) => {
      if (fbUser) fetchData();
    });
    return () => unsubscribe();
  }, []);

  const openCreateModal = () => {
    if (quota && quota.isAtLimit) {
      alert(`Plan quota reached: You can connect up to ${quota.maxReels} reels on the ${quota.planName}. Upgrade to the Ultra Plan to automate up to 15 Reels and 15 Bots!`);
      return;
    }
    setEditingRuleId(null);
    setReelUrl('');
    setReelTitle('');
    setTriggerKeyword('GROWTH');
    setMatchType('contains');
    setPublicRepliesText(
      'Check your DM! Just sent you the blueprint 🚀\nSent to your inbox! Check your DMs 📩\nSent the blueprint to your direct messages! 📲'
    );
    setDmMessage('Hey there! Here is your exclusive blueprint link: https://qwenton.ai/vip - Let me know if you have any questions!');
    setRuleModalError(null);
    setIsRuleModalOpen(true);
  };

  const openEditModal = (rule: InstagramReelRule) => {
    setEditingRuleId(rule.id);
    setReelUrl(rule.reelUrl);
    setReelTitle(rule.reelTitle);
    setTriggerKeyword(rule.triggerKeyword);
    setMatchType(rule.matchType);
    setPublicRepliesText(rule.publicReplies.join('\n'));
    setDmMessage(rule.dmMessage);
    setSelectedAgentId(rule.assignedAgentId || (agents[0]?.id || ''));
    setRuleModalError(null);
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setRuleModalError(null);
    setIsSavingRule(true);

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const replies = publicRepliesText
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const res = await fetch('/api/instagram/rules', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          id: editingRuleId || undefined,
          reelUrl,
          reelTitle,
          triggerKeyword,
          matchType,
          publicReplies: replies,
          dmMessage,
          assignedAgentId: selectedAgentId || undefined,
          status: 'active',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save reel automation');

      setIsRuleModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRuleModalError(msg);
    } finally {
      setIsSavingRule(false);
    }
  };

  const handleDeleteRule = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete automation for "${title}"?`)) return;
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/instagram/rules?id=${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error('Delete rule error:', e);
    }
  };

  const handleToggleStatus = async (rule: InstagramReelRule) => {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const newStatus = rule.status === 'active' ? 'paused' : 'active';
      await fetch('/api/instagram/rules', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...rule,
          status: newStatus,
        }),
      });
      fetchData();
    } catch (e) {
      console.error('Toggle status error:', e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess(null);

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/instagram/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          isBusyModeActive,
          busyModeMessage,
          fallbackAiReply,
          dmKeywordTriggers,
          assignedAgentId: selectedAgentId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      setSettingsSuccess('Instagram Away Mode & Keyword Triggers updated successfully!');
      setTimeout(() => setSettingsSuccess(null), 3500);
      fetchData();
    } catch (e) {
      console.error('Save settings error:', e);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddKeyword = () => {
    if (!newKeywordInput.trim() || !newReplyInput.trim()) return;
    const newKw = {
      id: `kw_${Date.now()}`,
      keyword: newKeywordInput.trim().toUpperCase(),
      reply: newReplyInput.trim(),
      active: true,
    };
    setDmKeywordTriggers([...dmKeywordTriggers, newKw]);
    setNewKeywordInput('');
    setNewReplyInput('');
  };

  const handleDeleteKeyword = (id: string) => {
    setDmKeywordTriggers(dmKeywordTriggers.filter((k) => k.id !== id));
  };

  const handleRunSimulation = async () => {
    setSimLoading(true);
    setSimResult(null);

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/instagram/simulate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: simType,
          text: simInputText,
          reelId: simType === 'comment' ? simSelectedReelId : undefined,
        }),
      });

      const data = await res.json();
      setSimResult(data);
    } catch (e) {
      console.error('Simulation error:', e);
      setSimResult({ error: 'Failed to run simulation' });
    } finally {
      setSimLoading(false);
    }
  };

  const quotaPercent = quota ? Math.min(100, Math.round((quota.currentReels / quota.maxReels) * 100)) : 0;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Title and Tier Quota Telemetry */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-[12px] bg-ink text-white flex items-center justify-center shadow-clay-button border border-border-strong">
                <Instagram className="w-5 h-5 text-approval-amber" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-ink tracking-tight flex items-center gap-2">
                  <span>Instagram Reels & Auto DM Engine</span>
                  <Badge variant="info" className="text-[10px]">
                    Auto Replies
                  </Badge>
                </h1>
                <p className="text-xs text-ink-muted mt-0.5">
                  Automate comment-to-DM triggers on your Reels, launch keyword lead magnets, and activate 24/7 away/busy mode assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Quota Telemetry Badge & Action */}
          {quota && (
            <div className="clay-surface p-3.5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1 gap-2">
                  <span className="font-bold text-ink">
                    Connected Reels Quota: <span className="text-primary">{quota.currentReels}</span> / {quota.maxReels}
                  </span>
                  <Badge variant={quota.isAtLimit ? 'amber' : 'success'} className="text-[10px]">
                    {quota.planName}
                  </Badge>
                </div>
                {/* Progress Bar */}
                <div className="w-48 h-2 bg-black/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      quota.isAtLimit ? 'bg-amber-500' : 'bg-primary'
                    }`}
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
              </div>

              {quota.planId !== 'ultra' && (
                <Link href="/billing">
                  <Button size="sm" variant="outline" className="text-xs py-1 px-3 gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Upgrade to Ultra (15 Reels & 15 Bots)</span>
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3">
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-2 px-4 py-2 rounded-control text-xs font-bold transition-all ${
              activeTab === 'reels'
                ? 'bg-primary text-white shadow-clay-button'
                : 'bg-white text-ink-muted border border-border/80 hover:bg-black/5 hover:text-ink'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Reels Comment-to-DM ({rules.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('busy_dm')}
            className={`flex items-center gap-2 px-4 py-2 rounded-control text-xs font-bold transition-all ${
              activeTab === 'busy_dm'
                ? 'bg-primary text-white shadow-clay-button'
                : 'bg-white text-ink-muted border border-border/80 hover:bg-black/5 hover:text-ink'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Away & Busy Assistant {isBusyModeActive && '🟢'}</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-control text-xs font-bold transition-all ${
              activeTab === 'simulator'
                ? 'bg-primary text-white shadow-clay-button'
                : 'bg-white text-ink-muted border border-border/80 hover:bg-black/5 hover:text-ink'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Live Interactive Simulator</span>
          </button>
        </div>

        {/* TAB 1: REELS COMMENT-TO-DM */}
        {activeTab === 'reels' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink">Connected Instagram Reels</h3>
                <p className="text-xs text-ink-muted">
                  When anyone comments your trigger word on a Reel, your bot automatically replies publicly and sends them a custom private DM.
                </p>
              </div>
              <Button onClick={openCreateModal} className="gap-1.5 shadow-clay-button">
                <Plus className="w-4 h-4" />
                <span>Connect Reel Automation</span>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2].map((n) => (
                  <div key={n} className="clay-surface p-5 space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[10px] bg-border-strong" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-border-strong rounded-md w-3/4" />
                        <div className="h-3 bg-border-subtle rounded-md w-1/3" />
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="h-3 bg-border-subtle rounded-md w-full" />
                      <div className="h-3 bg-border-subtle rounded-md w-5/6" />
                    </div>
                    <div className="h-8 bg-border-subtle rounded-control w-full mt-2" />
                  </div>
                ))}
              </div>
            ) : rules.length === 0 ? (
              <div className="clay-surface p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary mx-auto flex items-center justify-center">
                  <Film className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-ink">No Reels Connected Yet</h4>
                <p className="text-xs text-ink-muted max-w-md mx-auto">
                  Paste your Instagram Reel link, choose a trigger keyword (like <span className="font-mono font-bold text-primary">GROWTH</span> or <span className="font-mono font-bold text-primary">PRICE</span>), and let your bot handle comment replies and instant DMs 24/7.
                </p>
                <div className="pt-2">
                  <Button onClick={openCreateModal} className="gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Connect First Reel</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rules.map((rule) => (
                  <div key={rule.id} className="clay-surface p-5 flex flex-col justify-between space-y-4 hover:shadow-clay-card-hover transition-all">
                    <div>
                      {/* Reel Header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-[10px] bg-ink flex items-center justify-center text-white shrink-0 border border-border">
                            <Film className="w-4 h-4 text-approval-amber" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-ink line-clamp-1">{rule.reelTitle}</h4>
                            <a
                              href={rule.reelUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 font-medium"
                            >
                              <span>View Reel Post</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        <Badge variant={rule.status === 'active' ? 'success' : 'outline'} className="text-[10px]">
                          {rule.status === 'active' ? '● Active' : 'Paused'}
                        </Badge>
                      </div>

                      {/* Trigger Keyword Pill */}
                      <div className="my-2.5 p-2 rounded-control bg-[#F8F6F1] border border-border/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-ink-muted text-[11px]">Comment Trigger:</span>
                          <span className="font-mono font-bold px-1.5 py-0.5 rounded-md bg-white border border-border text-primary">
                            {rule.triggerKeyword}
                          </span>
                        </div>
                        <span className="text-[10px] text-ink-light uppercase tracking-wider font-semibold">
                          {rule.matchType} match
                        </span>
                      </div>

                      {/* Public Reply & DM Message Previews */}
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] text-ink-muted uppercase font-bold block mb-0.5">
                            Public Comment Reply ({rule.publicReplies.length} variations)
                          </span>
                          <p className="text-ink italic bg-white p-2 rounded-control border border-border text-[11px] line-clamp-2">
                            "{rule.publicReplies[0]}"
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] text-ink-muted uppercase font-bold block mb-0.5">
                            Private Direct Message (DM)
                          </span>
                          <p className="text-ink bg-white p-2.5 rounded-control border border-border text-[11px] leading-relaxed line-clamp-3">
                            {rule.dmMessage}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[11px] text-ink-muted">
                        <span className="flex items-center gap-1 font-semibold">
                          <MessageSquare className="w-3.5 h-3.5 text-primary" />
                          <span>{rule.totalCommentsHandled} replies</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Send className="w-3.5 h-3.5 text-success" />
                          <span>{rule.totalDmsSent} DMs sent</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSimType('comment');
                            setSimSelectedReelId(rule.id);
                            setSimInputText(`Send me ${rule.triggerKeyword} please!`);
                            setActiveTab('simulator');
                          }}
                          className="text-xs py-1 px-2 gap-1 text-primary hover:bg-primary/10"
                          title="Test in Simulator"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Test</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(rule)}
                          className="text-xs py-1 px-2"
                          title={rule.status === 'active' ? 'Pause Rule' : 'Activate Rule'}
                        >
                          <Power className={`w-3.5 h-3.5 ${rule.status === 'active' ? 'text-success' : 'text-ink-muted'}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(rule)}
                          className="text-xs py-1 px-2"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteRule(rule.id, rule.reelTitle)}
                          className="text-xs py-1 px-2 text-danger hover:bg-danger/10 border-danger/30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AWAY & BUSY ASSISTANT */}
        {activeTab === 'busy_dm' && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {settingsSuccess && (
              <div className="bg-[#EBF7F0] border border-[#BDE5CE] p-3 rounded-control text-xs text-success font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            {/* Away & Busy Mode Toggle Card */}
            <div className="clay-surface p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-white ${
                    isBusyModeActive ? 'bg-amber-500 shadow-clay-button' : 'bg-ink-muted/50'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink">Away & Busy Mode Assistant</h3>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Tell users you are currently busy in meetings, deep work, or off-hours, while providing instant automated services.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-ink">
                    {isBusyModeActive ? '🟢 Busy Mode Active' : '⚪ Standard Mode'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsBusyModeActive(!isBusyModeActive)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                      isBusyModeActive ? 'bg-primary' : 'bg-black/15'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        isBusyModeActive ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Away Message Input */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Automated Away / Busy Notification Message
                </label>
                <textarea
                  rows={3}
                  value={busyModeMessage}
                  onChange={(e) => setBusyModeMessage(e.target.value)}
                  placeholder="Hey there! I am currently busy in client meetings or focused work. Our automated coworker is here to help! Reply 'PRICE' for rates, or book a call here: https://calendly.com/qwenton"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-white text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed shadow-xs"
                />
              </div>

              {/* Fallback AI Reply Option */}
              <div className="p-3 bg-[#F8F6F1] rounded-control border border-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-ink block">Enable Autonomous AI Answering When Busy</span>
                  <span className="text-[11px] text-ink-muted">
                    If enabled, your assigned AI Coworker Agent will intelligently answer client questions using your company knowledge base.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={fallbackAiReply}
                  onChange={(e) => setFallbackAiReply(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Direct Message Keyword Triggers (ManyChat Style) */}
            <div className="clay-surface p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-ink">Direct Message (DM) Keyword Triggers</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  If any user sends a message containing these words, the bot will immediately reply with your pre-configured answer.
                </p>
              </div>

              {/* Keyword Triggers List */}
              <div className="space-y-2.5">
                {dmKeywordTriggers.map((kw) => (
                  <div key={kw.id} className="p-3 bg-white border border-border rounded-control flex items-start justify-between gap-3 text-xs shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary bg-[#F8F6F1] px-2 py-0.5 rounded border border-border">
                          {kw.keyword}
                        </span>
                        <span className="text-[10px] text-success font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Active Trigger</span>
                        </span>
                      </div>
                      <p className="text-ink leading-relaxed text-[11px] pl-0.5">{kw.reply}</p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteKeyword(kw.id)}
                      className="text-xs py-1 px-2 text-danger hover:bg-danger/10 border-danger/30"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Keyword Trigger */}
              <div className="pt-2 p-3.5 bg-[#F8F6F1] rounded-control border border-border space-y-3">
                <span className="text-xs font-bold text-ink block">Add New Keyword Trigger</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    placeholder="Keyword (e.g. PRICE, BOOK, INFO)"
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      placeholder="Automated reply message with links..."
                      value={newReplyInput}
                      onChange={(e) => setNewReplyInput(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="button" size="sm" onClick={handleAddKeyword} className="text-xs gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Keyword Trigger</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isSavingSettings} className="gap-2 shadow-clay-button">
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Away Mode & Triggers</span>
              </Button>
            </div>
          </form>
        )}

        {/* TAB 3: LIVE INTERACTIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="clay-surface p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Live Interactive Sandbox & Simulator</span>
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Test your automations instantly before going live. Simulate a viewer commenting on a Reel or sending a Direct Message.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Simulator Input Controls */}
              <div className="space-y-4">
                {/* Event Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Simulation Test Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSimType('comment');
                        setSimInputText('Hey! Send me the GROWTH blueprint please');
                      }}
                      className={`flex-1 py-2 px-3 text-xs font-bold rounded-control transition-all ${
                        simType === 'comment'
                          ? 'bg-primary text-white shadow-clay-button'
                          : 'bg-white border border-border text-ink-muted hover:text-ink'
                      }`}
                    >
                      Reel Comment
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSimType('dm');
                        setSimInputText('What is your pricing?');
                      }}
                      className={`flex-1 py-2 px-3 text-xs font-bold rounded-control transition-all ${
                        simType === 'dm'
                          ? 'bg-primary text-white shadow-clay-button'
                          : 'bg-white border border-border text-ink-muted hover:text-ink'
                      }`}
                    >
                      Direct Message (DM)
                    </button>
                  </div>
                </div>

                {/* Reel Selection if Comment */}
                {simType === 'comment' && rules.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">Select Reel Post</label>
                    <select
                      value={simSelectedReelId}
                      onChange={(e) => setSimSelectedReelId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-border text-ink rounded-control text-xs shadow-clay-button-subtle"
                    >
                      {rules.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.reelTitle} (Keyword: {r.triggerKeyword})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Simulated User Message Input */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Simulated User Input Text</label>
                  <Input
                    value={simInputText}
                    onChange={(e) => setSimInputText(e.target.value)}
                    placeholder="Type a comment or message..."
                  />
                  <p className="text-[11px] text-ink-muted mt-1">
                    Include your trigger keyword like <span className="font-mono font-bold text-primary">GROWTH</span> or <span className="font-mono font-bold text-primary">PRICE</span> to test the bot response.
                  </p>
                </div>

                <Button
                  onClick={handleRunSimulation}
                  isLoading={simLoading}
                  className="w-full py-2.5 text-xs font-bold gap-2 shadow-clay-button"
                >
                  <Zap className="w-4 h-4" />
                  <span>Run Live Simulation Handshake</span>
                </Button>
              </div>

              {/* Instagram Smartphone Preview Mockup */}
              <div className="bg-[#1A1824] p-5 rounded-[24px] text-white space-y-4 shadow-xl border border-white/10 max-w-md mx-auto w-full">
                {/* Simulated Phone Bar */}
                <div className="flex items-center justify-between text-[11px] text-white/50 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-white text-[12px]">Instagram Mock Preview</span>
                  </div>
                  <span>Live Sandbox</span>
                </div>

                {/* Simulated Incoming User Action */}
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block">Incoming User Action</span>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="font-bold text-white/90">@prospective_client: </span>
                    <span className="text-white/80">{simInputText}</span>
                  </div>
                </div>

                {/* Automated Bot Response */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block">Automated Bot Output</span>

                  {simLoading ? (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60 text-center animate-pulse">
                      Processing trigger and generating simulated DM...
                    </div>
                  ) : simResult ? (
                    simResult.matched ? (
                      <div className="space-y-2.5">
                        {simResult.publicReply && (
                          <div className="p-3 rounded-xl bg-ink border border-white/20 text-xs space-y-1">
                            <span className="font-bold text-primary text-[11px] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Public Comment Reply Posted:</span>
                            </span>
                            <p className="text-white/90 leading-snug pl-1">&quot;{simResult.publicReply}&quot;</p>
                          </div>
                        )}

                        {(simResult.privateDm || simResult.reply) && (
                          <div className="p-3.5 rounded-xl bg-primary/30 border border-primary/50 text-xs space-y-1">
                            <span className="font-bold text-[#D0DFEF] text-[11px] flex items-center gap-1">
                              <Send className="w-3.5 h-3.5 text-success" />
                              <span>Direct Message (DM) Sent to User:</span>
                            </span>
                            <p className="text-white/95 leading-relaxed bg-black/30 p-2.5 rounded-lg border border-white/5 text-[11px]">
                              {simResult.privateDm || simResult.reply}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                        {simResult.message || 'No automation trigger matched this input.'}
                      </div>
                    )
                  ) : (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/40 text-center">
                      Click "Run Live Simulation" to test your trigger.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CONNECT / EDIT REEL AUTOMATION */}
        {isRuleModalOpen && (
          <Dialog
            isOpen={isRuleModalOpen}
            onClose={() => setIsRuleModalOpen(false)}
            title={editingRuleId ? 'Edit Reel Automation' : 'Connect New Instagram Reel'}
            description="Configure trigger keywords for comment auto-replies and instant direct messages."
          >
            <form onSubmit={handleSaveRule} className="space-y-4 pt-2">
              {ruleModalError && (
                <div className="p-3 bg-danger/10 border border-danger/30 rounded-control text-xs text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{ruleModalError}</span>
                </div>
              )}

              {/* Reel URL & Title */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Reel Title / Post Topic</label>
                  <Input
                    placeholder="e.g. Viral Hook: 3 AI Secrets to 100x Growth"
                    value={reelTitle}
                    onChange={(e) => setReelTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Instagram Reel Link or ID</label>
                  <Input
                    placeholder="e.g. https://www.instagram.com/reel/C8abc123/"
                    value={reelUrl}
                    onChange={(e) => setReelUrl(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Trigger Keyword & Match Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Trigger Keyword</label>
                  <Input
                    placeholder="e.g. GROWTH, PRICE, LINK"
                    value={triggerKeyword}
                    onChange={(e) => setTriggerKeyword(e.target.value)}
                    required
                  />
                  <p className="text-[10px] text-ink-muted mt-0.5">Word commenter must type.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Match Type</label>
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-border text-ink rounded-control text-xs shadow-clay-button-subtle"
                  >
                    <option value="contains">Contains (e.g. "Send me GROWTH")</option>
                    <option value="exact">Exact (Comment must be only keyword)</option>
                  </select>
                </div>
              </div>

              {/* Public Comment Replies (Multi-variations) */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Public Comment Replies (1 per line for randomized variation)
                </label>
                <textarea
                  rows={3}
                  value={publicRepliesText}
                  onChange={(e) => setPublicRepliesText(e.target.value)}
                  placeholder="Check your DM! Just sent you the blueprint 🚀"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-white text-ink leading-relaxed shadow-xs"
                  required
                />
                <p className="text-[10px] text-ink-muted mt-0.5">
                  Rotating randomized replies prevent Instagram from flagging repeated comments.
                </p>
              </div>

              {/* Private DM Message */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Private Direct Message (DM) to Send
                </label>
                <textarea
                  rows={3}
                  value={dmMessage}
                  onChange={(e) => setDmMessage(e.target.value)}
                  placeholder="Hey! Here is your requested blueprint link: https://qwenton.ai/start - Let me know if you need help!"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-white text-ink leading-relaxed shadow-xs"
                  required
                />
              </div>

              {/* Assign AI Agent */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Assign AI Coworker Bot</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-border text-ink rounded-control text-xs shadow-clay-button-subtle"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsRuleModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSavingRule} className="gap-1.5 shadow-clay-button">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{editingRuleId ? 'Update Reel Automation' : 'Save & Activate Reel'}</span>
                </Button>
              </div>
            </form>
          </Dialog>
        )}
      </div>
    </AppShell>
  );
}
