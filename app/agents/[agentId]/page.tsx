'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Send,
  Sparkles,
  Bot,
  Radio,
  FileText,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Check,
  X,
  Clock,
  ArrowLeft,
  ChevronRight,
  SlidersHorizontal,
  Activity,
  Layers,
  Key,
  Code2,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { FormattedMessage } from '@/components/ui/FormattedMessage';
import { Agent, Conversation, Message, Approval, RunEvent } from '@/lib/db/types';
import { getAuthToken, subscribeToAuthState } from '@/lib/auth/firebase-client-auth';

export default function AgentWorkspacePage() {
  const routeParams = useParams();
  const agentId = (routeParams?.agentId as string) || '';
  const [agent, setAgent] = useState<Agent | null>(() => {
    if (typeof window !== 'undefined' && agentId) {
      try {
        const cached = localStorage.getItem('qwenton_cached_agents');
        if (cached) {
          const list: Agent[] = JSON.parse(cached);
          const found = list.find((a) => a.id === agentId);
          if (found) return found;
        }
      } catch {}
    }
    return null;
  });
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activityEvents, setActivityEvents] = useState<RunEvent[]>([]);
  const [pendingApproval, setPendingApproval] = useState<Approval | null>(null);
  const [mobileActivityOpen, setMobileActivityOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function loadWorkspace(tokenOverride?: string) {
      try {
        const token = tokenOverride || (await getAuthToken());
        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const [agentRes, convsRes] = await Promise.all([
          fetch(`/api/agents/${agentId}`, { headers }),
          fetch('/api/conversations', { headers }),
        ]);

        if (agentRes.ok) {
          const aData = await agentRes.json();
          setAgent(aData.agent);
        }

        if (convsRes.ok) {
          const cData = await convsRes.json();
          const convList = cData.conversations || [];
          let currentConv = convList.find((c: Conversation) => c.agentId === agentId);

          if (!currentConv) {
            const newConvRes = await fetch('/api/conversations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ agentId }),
            });
            if (newConvRes.ok) {
              const newCData = await newConvRes.json();
              currentConv = newCData.conversation;
            }
          }

          if (currentConv) {
            setConversation(currentConv);
            const msgsRes = await fetch(`/api/conversations/${currentConv.id}/messages`, { headers });
            if (msgsRes.ok) {
              const mData = await msgsRes.json();
              setMessages(mData.messages || []);
            }
          }
        }
      } catch (e) {
        console.error('Workspace load error:', e);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspace();

    const unsubscribe = subscribeToAuthState((fbUser) => {
      if (fbUser) {
        fbUser.getIdToken().then((t) => loadWorkspace(t));
      }
    });

    return () => unsubscribe();
  }, [agentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSendMessage = async (promptOverride?: string) => {
    const promptToSend = (promptOverride || inputPrompt).trim();
    if (!promptToSend || !conversation || isStreaming) return;

    setInputPrompt('');
    setIsStreaming(true);
    setStreamingContent('');

    // Optimistically push user message
    const tempUserMsg: Message = {
      id: `temp_${Date.now()}`,
      conversationId: conversation.id,
      sender: 'user',
      content: promptToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt: promptToSend }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText || 'Unknown error'}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No stream body received from agent engine');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const rawData = line.slice(6);
            if (rawData === '[DONE]') continue;

            try {
              const event = JSON.parse(rawData);
              if (event.type === 'token' && event.content) {
                setStreamingContent((prev) => prev + event.content);
              } else if (event.type === 'tool_call') {
                setActivityEvents((prev) => [
                  ...prev,
                  {
                    id: `tc_${Date.now()}_${Math.random()}`,
                    runId: 'temp',
                    type: 'tool_call',
                    title: `Invoked Tool: ${event.tool}`,
                    details: event.args,
                    timestamp: new Date().toISOString(),
                  },
                ]);
              } else if (event.type === 'tool_result') {
                setActivityEvents((prev) => [
                  ...prev,
                  {
                    id: `tr_${Date.now()}_${Math.random()}`,
                    runId: 'temp',
                    type: 'tool_result',
                    title: `Result: ${event.tool}`,
                    details: typeof event.result === 'object' ? event.result : { output: event.result },
                    timestamp: new Date().toISOString(),
                  },
                ]);
              } else if (event.type === 'approval_required') {
                setPendingApproval({
                  id: event.approvalId,
                  runId: 'temp',
                  agentId,
                  ownerUid: 'me',
                  actionType: event.action,
                  targetService: event.target,
                  payload: event.payload,
                  riskLevel: 'medium',
                  status: 'pending',
                  createdAt: new Date().toISOString(),
                });
                setActivityEvents((prev) => [
                  ...prev,
                  {
                    id: `appr_${Date.now()}`,
                    runId: 'temp',
                    type: 'approval_required',
                    title: `⚠️ Paused for Human Approval: ${event.target}`,
                    details: event.payload,
                    timestamp: new Date().toISOString(),
                  },
                ]);
              } else if (event.type === 'error') {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `err_${Date.now()}`,
                    conversationId: conversation.id,
                    agentId,
                    ownerUid: 'me',
                    sender: 'agent',
                    content: `⚠️ Error from agent runtime: ${event.error}`,
                    createdAt: new Date().toISOString(),
                  },
                ]);
              } else if (event.type === 'completed') {
                const freshToken = await getAuthToken();
                const freshHeaders: Record<string, string> = {};
                if (freshToken) freshHeaders.Authorization = `Bearer ${freshToken}`;

                const freshMsgs = await fetch(`/api/conversations/${conversation.id}/messages`, { headers: freshHeaders });
                if (freshMsgs.ok) {
                  const mData = await freshMsgs.json();
                  setMessages(mData.messages || []);
                } else if (event.finalContent) {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `comp_${Date.now()}`,
                      conversationId: conversation.id,
                      agentId,
                      ownerUid: 'me',
                      sender: 'agent',
                      content: event.finalContent,
                      createdAt: new Date().toISOString(),
                    },
                  ]);
                }
              }
            } catch (jsonErr) {
              // Ignore partial chunk
            }
          }
        }
      }
    } catch (err) {
      console.error('Streaming error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `catch_${Date.now()}`,
          conversationId: conversation.id,
          agentId,
          ownerUid: 'me',
          sender: 'agent',
          content: `⚠️ Could not complete request: ${errMsg}. Please verify your AI Model / API key settings in "AI Settings" or "Integrations".`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleApprovalDecision = async (approvalId: string, decision: 'approve' | 'reject') => {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/approvals/${approvalId}/${decision}`, { method: 'POST', headers });
      if (res.ok) {
        setPendingApproval(null);
        setActivityEvents((prev) => [
          ...prev,
          {
            id: `dec_${Date.now()}`,
            runId: 'temp',
            type: 'finish',
            title: `Human ${decision}ed the action.`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (e) {
      console.error('Approval action error:', e);
    }
  };

  if (!agent) {
    return (
      <AppShell>
        <div className="flex items-center justify-center p-12 text-sm text-ink-muted">
          Loading Coworker Workspace...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* 3-Panel Workspace Layout with Android / Mobile touch optimization */}
      <div className="h-[calc(100vh-9.5rem)] sm:h-[calc(100vh-8.5rem)] flex flex-col lg:flex-row gap-4 -m-2 sm:-m-4 overflow-hidden">
        {/* Left Panel (Desktop only): Agent Card, Purpose & Tools */}
        <div className="w-72 clay-surface p-5 flex-col justify-between shrink-0 overflow-y-auto hidden lg:flex">
          <div className="space-y-5">
            <Link href="/agents" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Agents List</span>
            </Link>

            <div className="text-center pb-4 border-b border-border/60">
              <Avatar name={agent.name} size="xl" variant="agent" className="mx-auto mb-3" />
              <h2 className="text-base font-bold text-ink">{agent.name}</h2>
              <p className="text-xs text-primary-deep font-semibold mt-0.5">{agent.role}</p>
              <Badge variant="success" className="mt-2 text-[10px]">
                ● Active Coworker
              </Badge>
            </div>

            <div>
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Mission Purpose</span>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                {agent.description || 'Specialized AI assistant for research, drafts, and business operations.'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Enabled Tools</span>
                <span className="text-[10px] text-ink-light font-bold">{agent.enabledTools.length} active</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {agent.enabledTools.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-[#F8F6F1] border border-border text-ink font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-2.5">
                <Link href="/integrations" className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1.5 p-2 rounded-control bg-primary/5 border border-primary/20">
                  <Key className="w-3.5 h-3.5 shrink-0" />
                  <span>Configure API Keys & Vault →</span>
                </Link>
              </div>
            </div>

            <div className="bg-[#F8F6F1] p-3 rounded-control border border-border/80">
              <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-primary" />
                  <span>Telegram Link</span>
                </span>
                <Badge variant="outline" className="text-[9px]">
                  Ready
                </Badge>
              </div>
              <p className="text-[10px] text-ink-muted">
                Bot ready to receive messages and dispatch approvals.
              </p>
            </div>

            <div className="bg-[#F8F6F1] p-3 rounded-control border border-border/80">
              <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-primary" />
                  <span>Website Widget</span>
                </span>
                <Badge variant="info" className="text-[9px]">
                  Viral
                </Badge>
              </div>
              <p className="text-[10px] text-ink-muted mb-2">
                Embed this coworker on any landing page or website.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEmbedModal(true)}
                className="w-full text-xs font-bold gap-1.5 py-1 h-7"
              >
                <Code2 className="w-3 h-3 text-primary" />
                <span>Get Embed Code</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Center Panel: Main Conversation & Composer */}
        <div className="flex-1 clay-surface flex flex-col justify-between overflow-hidden shadow-clay-card rounded-card border border-border/80 min-w-0">
          {/* Conversation Header with Mobile Activity Toggle */}
          <div className="p-3 sm:p-4 border-b border-border/60 bg-white/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <Link href="/agents" className="lg:hidden text-ink-muted hover:text-ink p-1">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Avatar name={agent.name} size="md" variant="agent" />
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-ink truncate">{agent.name}</h3>
                <p className="text-[10px] sm:text-[11px] text-ink-muted truncate">{agent.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEmbedModal(true)}
                className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5 shadow-xs py-1 px-2.5"
              >
                <Code2 className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Embed Widget</span>
                <span className="sm:hidden">Embed</span>
              </Button>

              <Link href="/integrations">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5 shadow-xs py-1 px-2.5">
                  <Key className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Connect Tools & Keys</span>
                  <span className="sm:hidden">Keys</span>
                </Button>
              </Link>

              <Badge variant="success" className="text-[10px] hidden sm:inline-flex">
                ● Live Streaming
              </Badge>

              {/* Mobile Activity Drawer Toggle */}
              <button
                onClick={() => setMobileActivityOpen(!mobileActivityOpen)}
                className="xl:hidden flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white border border-border rounded-control shadow-xs text-ink hover:bg-black/5"
              >
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px]">{activityEvents.length > 0 ? `Activity (${activityEvents.length})` : 'Activity'}</span>
              </button>
            </div>
          </div>

          {/* Messages Stream Area (Finger-scroll optimized for Android) */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3.5 overscroll-contain">
            {messages.length === 0 && (
              <div className="text-center py-10 sm:py-16 text-xs text-ink-muted">
                <Bot className="w-10 h-10 text-primary/40 mx-auto mb-3" />
                <div className="font-bold text-ink text-sm">Welcome to {agent.name}</div>
                <p className="text-[11px] text-ink-muted mt-1 max-w-sm mx-auto">
                  Send an instruction or tap one of the quick suggestions below to start your run.
                </p>
                <div className="mt-3">
                  <Link href="/integrations" className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                    <Key className="w-3 h-3" />
                    <span>Manage Connected Tools (Google Maps, Drive, Instagram)</span>
                  </Link>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <Avatar
                  name={msg.sender === 'user' ? 'User' : agent.name}
                  size="sm"
                  variant={msg.sender === 'user' ? 'user' : 'agent'}
                  className="shrink-0 mt-0.5"
                />
                <div
                  className={`p-3 sm:p-4 rounded-card text-xs sm:text-sm leading-relaxed max-w-[88%] sm:max-w-none ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-b from-[#4667B1] to-[#34518F] text-white shadow-clay-button'
                      : 'bg-[#F8F6F1] text-ink border border-border shadow-xs'
                  }`}
                >
                  <FormattedMessage content={msg.content} />
                </div>
              </div>
            ))}

            {/* Live Streaming Bubble */}
            {isStreaming && streamingContent ? (
              <div className="flex gap-2.5 sm:gap-3 max-w-2xl">
                <Avatar name={agent.name} size="sm" variant="agent" className="shrink-0 mt-0.5" />
                <div className="p-3 sm:p-4 rounded-card text-xs sm:text-sm leading-relaxed bg-[#F8F6F1] text-ink border border-border shadow-xs animate-pulse max-w-[88%] sm:max-w-none">
                  <FormattedMessage content={streamingContent} />
                </div>
              </div>
            ) : null}

            {/* Mobile Inline Human Approval Card */}
            {pendingApproval && (
              <div className="bg-[#FDF4E7] border-2 border-amber-approval p-3.5 rounded-card space-y-2.5 text-xs text-ink shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8C5D1E] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-approval" />
                    Human Decision Paused
                  </span>
                  <Badge variant="amber">Pending Approval</Badge>
                </div>
                <div className="text-[11px] text-[#8C5D1E]">
                  Agent wants to execute: <strong>{pendingApproval.actionType}</strong> on <em>{pendingApproval.targetService}</em>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="amber"
                    onClick={() => handleApprovalDecision(pendingApproval.id, 'approve')}
                    className="flex-1 text-xs py-1.5 font-bold"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprovalDecision(pendingApproval.id, 'reject')}
                    className="flex-1 text-xs py-1.5"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts & Composer Input Area (Android Keyboard Friendly) */}
          <div className="p-2.5 sm:p-4 border-t border-border/60 bg-white/80 space-y-2 shrink-0">
            {/* Quick Action Chips (Touch-scrollable) */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-[11px] sm:text-xs no-scrollbar">
              <button
                type="button"
                onClick={() => handleSendMessage('Create 5 Instagram carousel slides with high converting hooks and hashtags')}
                className="px-2.5 py-1 rounded-full bg-white border border-border hover:border-primary text-ink-muted hover:text-ink whitespace-nowrap shadow-xs active:scale-95 transition-all shrink-0"
              >
                📸 Instagram Carousel
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Perform deep competitor intelligence research and compile a summary')}
                className="px-2.5 py-1 rounded-full bg-white border border-border hover:border-primary text-ink-muted hover:text-ink whitespace-nowrap shadow-xs active:scale-95 transition-all shrink-0"
              >
                🌐 Competitor Research
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Analyze my indexed files and generate an executive summary')}
                className="px-2.5 py-1 rounded-full bg-white border border-border hover:border-primary text-ink-muted hover:text-ink whitespace-nowrap shadow-xs active:scale-95 transition-all shrink-0"
              >
                📄 Knowledge Summary
              </button>
            </div>

            {/* Main Message Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Instruct ${agent.name}...`}
                disabled={isStreaming}
                className="flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white border border-border text-xs sm:text-sm text-ink placeholder:text-ink-light rounded-control focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-clay-button-subtle"
              />

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isStreaming}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] bg-gradient-to-b from-primary to-primary-deep text-white flex items-center justify-center shadow-clay-button hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel: Observable Activity Timeline (Desktop & Mobile Slide-out Drawer) */}
        <div
          className={`w-80 clay-surface p-5 flex flex-col justify-between shrink-0 overflow-y-auto ${
            mobileActivityOpen
              ? 'fixed inset-y-16 right-0 z-40 bg-white shadow-2xl border-l border-border w-80'
              : 'hidden xl:flex'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <Play className="w-3.5 h-3.5 text-primary" />
                <span>Observable Activity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant={isStreaming ? 'amber' : 'default'} className="text-[10px]">
                  {isStreaming ? 'Executing Step' : 'Idle'}
                </Badge>
                {mobileActivityOpen && (
                  <button
                    onClick={() => setMobileActivityOpen(false)}
                    className="p-1 rounded-control text-ink-muted hover:text-ink xl:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Inline Approval Alert Card if Paused */}
            {pendingApproval ? (
              <div className="bg-[#FDF4E7] border-2 border-amber-approval/60 p-4 rounded-card space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8C5D1E]">
                  <ShieldAlert className="w-4 h-4 text-amber-approval" />
                  <span>Human Decision Paused</span>
                </div>
                <div className="text-xs text-[#8C5D1E]">
                  <strong>Action:</strong> {pendingApproval.actionType}
                </div>
                <div className="bg-white/80 p-2 rounded-control text-[11px] font-mono text-ink overflow-x-auto max-h-24">
                  <pre>{JSON.stringify(pendingApproval.payload, null, 2)}</pre>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="amber"
                    onClick={() => handleApprovalDecision(pendingApproval.id, 'approve')}
                    className="flex-1 font-bold text-xs"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprovalDecision(pendingApproval.id, 'reject')}
                    className="flex-1 text-xs"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Event Timeline */}
            <div className="space-y-3">
              {activityEvents.length === 0 ? (
                <div className="text-center py-8 text-[11px] text-ink-muted">
                  No active events. Start a conversation to view real-time tool execution.
                </div>
              ) : (
                activityEvents.map((ev) => (
                  <div key={ev.id} className="p-3 bg-[#F8F6F1] rounded-control border border-border/70 text-xs space-y-1">
                    <div className="font-bold text-ink">{ev.title}</div>
                    {ev.details && (
                      <pre className="text-[10px] text-ink-muted font-mono overflow-x-auto p-1 bg-white rounded-xs">
                        {JSON.stringify(ev.details, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Viral Embed Widget Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-ink">Embed {agent.name} on Your Website</h3>
                  <p className="text-[11px] text-ink-muted">Viral growth widget with automatic lead capture</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-black/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">
                1-Line Responsive iframe Snippet
              </label>
              <textarea
                readOnly
                rows={3}
                value={`<iframe src="${typeof window !== 'undefined' ? window.location.origin : 'https://agents.qwenton.shop'}/widget/${agent.id}" width="100%" height="600" frameborder="0" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.12);"></iframe>`}
                className="w-full p-2.5 text-xs font-mono bg-canvas rounded-xl border border-border select-all focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <a
                href={`/widget/${agent.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Live Widget in New Tab</span>
              </a>

              <Button
                size="sm"
                onClick={() => {
                  const snippet = `<iframe src="${window.location.origin}/widget/${agent.id}" width="100%" height="600" frameborder="0" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.12);"></iframe>`;
                  if (navigator?.clipboard) {
                    navigator.clipboard.writeText(snippet);
                    setCopiedEmbed(true);
                    setTimeout(() => setCopiedEmbed(false), 2000);
                  }
                }}
                className="font-bold gap-1.5 text-xs shadow-clay-button"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmbed ? 'Copied Snippet!' : 'Copy Embed Code'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
