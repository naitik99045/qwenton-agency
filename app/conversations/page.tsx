'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  MessageSquare,
  ArrowRight,
  Clock,
  Bot,
  Send,
  Plus,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Check,
  X,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Conversation, Agent, Message, Approval, RunEvent } from '@/lib/db/types';
import { formatDate } from '@/lib/utils';
import { getAuthToken, subscribeToAuthState } from '@/lib/auth/firebase-client-auth';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [agentsList, setAgentsList] = useState<Agent[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('qwenton_cached_agents');
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return [];
  });
  const [agentsMap, setAgentsMap] = useState<Record<string, Agent>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('qwenton_cached_agents');
        if (cached) {
          const list: Agent[] = JSON.parse(cached);
          const map: Record<string, Agent> = {};
          list.forEach((a) => { map[a.id] = a; });
          return map;
        }
      } catch {}
    }
    return {};
  });
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<Approval | null>(null);
  const [activityEvents, setActivityEvents] = useState<RunEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const loadData = async () => {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const [convsRes, agentsRes] = await Promise.all([
        fetch('/api/conversations', { headers }),
        fetch('/api/agents', { headers }),
      ]);

      let loadedAgents: Agent[] = [];
      if (agentsRes.ok) {
        const aData = await agentsRes.json();
        loadedAgents = aData.agents || [];
        setAgentsList(loadedAgents);
        localStorage.setItem('qwenton_cached_agents', JSON.stringify(loadedAgents));
        const map: Record<string, Agent> = {};
        loadedAgents.forEach((a) => {
          map[a.id] = a;
        });
        setAgentsMap(map);
      }

      let loadedConvs: Conversation[] = [];
      if (convsRes.ok) {
        const cData = await convsRes.json();
        loadedConvs = cData.conversations || [];
        setConversations(loadedConvs);
      }

      // Automatically select initial agent and conversation
      if (loadedAgents.length > 0) {
        const firstAgent = loadedAgents[0];
        setSelectedAgentId(firstAgent.id);
        const existingConv = loadedConvs.find((c) => c.agentId === firstAgent.id);
        if (existingConv) {
          setActiveConversation(existingConv);
          loadMessages(existingConv.id);
        } else {
          // Create conversation for first agent
          createAndSelectConversation(firstAgent.id);
        }
      }
    } catch (e) {
      console.error('Error loading conversations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (fbUser) {
        loadData();
      }
    });

    const handleAgentsChanged = () => loadData();
    window.addEventListener('qwenton-agents-changed', handleAgentsChanged);

    return () => {
      unsubscribe();
      window.removeEventListener('qwenton-agents-changed', handleAgentsChanged);
    };
  }, []);

  const loadMessages = async (convId: string) => {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/conversations/${convId}/messages`, { headers });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Failed to load messages:', e);
    }
  };

  const createAndSelectConversation = async (agentId: string) => {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers,
        body: JSON.stringify({ agentId }),
      });
      if (res.ok) {
        const data = await res.json();
        const newConv = data.conversation;
        setActiveConversation(newConv);
        setConversations((prev) => [newConv, ...prev.filter((c) => c.id !== newConv.id)]);
        setMessages([]);
      }
    } catch (e) {
      console.error('Error creating conversation:', e);
    }
  };

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    const existingConv = conversations.find((c) => c.agentId === agentId);
    if (existingConv) {
      setActiveConversation(existingConv);
      loadMessages(existingConv.id);
    } else {
      createAndSelectConversation(agentId);
    }
  };

  const handleSendMessage = async (promptOverride?: string) => {
    const promptToSend = (promptOverride || inputPrompt).trim();
    if (!promptToSend || !activeConversation || isStreaming) return;

    setInputPrompt('');
    setIsStreaming(true);
    setStreamingContent('');

    // Optimistically push user message
    const tempUserMsg: Message = {
      id: `temp_${Date.now()}`,
      conversationId: activeConversation.id,
      agentId: selectedAgentId,
      ownerUid: 'me',
      sender: 'user',
      content: promptToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`/api/conversations/${activeConversation.id}/messages`, {
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
                  agentId: selectedAgentId,
                  ownerUid: 'me',
                  actionType: event.action,
                  targetService: event.target,
                  payload: event.payload,
                  riskLevel: 'medium',
                  status: 'pending',
                  createdAt: new Date().toISOString(),
                });
              } else if (event.type === 'error') {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `err_${Date.now()}`,
                    conversationId: activeConversation.id,
                    agentId: selectedAgentId,
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

                const freshMsgs = await fetch(`/api/conversations/${activeConversation.id}/messages`, {
                  headers: freshHeaders,
                });
                if (freshMsgs.ok) {
                  const mData = await freshMsgs.json();
                  setMessages(mData.messages || []);
                } else if (event.finalContent) {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `comp_${Date.now()}`,
                      conversationId: activeConversation.id,
                      agentId: selectedAgentId,
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
          conversationId: activeConversation.id,
          agentId: selectedAgentId,
          ownerUid: 'me',
          sender: 'agent',
          content: `⚠️ Could not complete request: ${errMsg}. Please verify your AI Model / API key in "AI Settings" or "Integrations".`,
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
      }
    } catch (e) {
      console.error('Approval action error:', e);
    }
  };

  const currentAgent = agentsMap[selectedAgentId] || agentsList[0];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-ink">Web Agent Chat Hub</h1>
              <Badge variant="success">Live Web Interface</Badge>
            </div>
            <p className="text-xs text-ink-muted mt-1">
              Select any AI coworker and dispatch instructions directly from the web panel.
            </p>
          </div>

          {currentAgent && (
            <Link href={`/agents/${currentAgent.id}`}>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <span>Dedicated Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </div>

        {/* Agent Switcher Ribbon */}
        {agentsList.length === 0 ? (
          <div className="clay-surface p-8 text-center text-xs text-ink-muted">
            <Bot className="w-8 h-8 text-primary mx-auto mb-2 opacity-60" />
            <p className="font-semibold text-ink">No AI Coworkers created yet</p>
            <p className="mt-1">Create your first AI coworker to start sending instructions.</p>
            <div className="mt-4">
              <Link href="/agents/new">
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Create Coworker</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-ink-muted uppercase tracking-wider shrink-0 mr-1">
              Talk with:
            </span>
            {agentsList.map((ag) => {
              const isSelected = ag.id === selectedAgentId;
              return (
                <button
                  key={ag.id}
                  onClick={() => handleSelectAgent(ag.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-[12px] text-xs font-semibold transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-clay-button'
                      : 'bg-white text-ink border-border hover:bg-black/5'
                  }`}
                >
                  <Avatar name={ag.name} size="sm" variant="agent" className="w-5 h-5" />
                  <span>{ag.name}</span>
                  <span className={`text-[10px] opacity-80 hidden sm:inline ${isSelected ? 'text-white' : 'text-ink-muted'}`}>
                    ({ag.role})
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Unified Web Chat Workspace */}
        {currentAgent && (
          <div className="clay-surface flex flex-col h-[650px] shadow-clay-card rounded-card border border-border/80 overflow-hidden">
            {/* Chat Bar Header */}
            <div className="p-3.5 sm:p-4 border-b border-border/60 bg-white/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Avatar name={currentAgent.name} size="md" variant="agent" />
                <div>
                  <h3 className="text-sm font-bold text-ink">{currentAgent.name}</h3>
                  <p className="text-xs text-ink-muted">{currentAgent.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={currentAgent.status === 'active' ? 'success' : 'amber'}>
                  ● {currentAgent.status}
                </Badge>
                {activityEvents.length > 0 && (
                  <Badge variant="outline" className="text-[10px]">
                    {activityEvents.length} actions run
                  </Badge>
                )}
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-canvas/40">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-xs text-ink-muted">
                  <Bot className="w-10 h-10 text-primary/40 mx-auto mb-3" />
                  <div className="font-bold text-ink text-sm">Start chatting with {currentAgent.name}</div>
                  <p className="text-ink-muted mt-1 max-w-sm mx-auto">
                    Type your instruction below or select a suggested task.
                  </p>
                </div>
              ) : null}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <Avatar
                    name={msg.sender === 'user' ? 'User' : currentAgent.name}
                    size="sm"
                    variant={msg.sender === 'user' ? 'user' : 'agent'}
                    className="shrink-0 mt-0.5"
                  />
                  <div
                    className={`p-3.5 sm:p-4 rounded-card text-xs sm:text-sm leading-relaxed max-w-[90%] sm:max-w-none ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-b from-[#4667B1] to-[#34518F] text-white shadow-clay-button'
                        : 'bg-white text-ink border border-border shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                  </div>
                </div>
              ))}

              {/* Streaming Bubble */}
              {isStreaming && streamingContent ? (
                <div className="flex gap-3 max-w-2xl">
                  <Avatar name={currentAgent.name} size="sm" variant="agent" className="shrink-0 mt-0.5" />
                  <div className="p-3.5 sm:p-4 rounded-card text-xs sm:text-sm leading-relaxed bg-white text-ink border border-border shadow-xs animate-pulse max-w-[90%] sm:max-w-none">
                    <div className="whitespace-pre-wrap break-words">{streamingContent}</div>
                  </div>
                </div>
              ) : null}

              {/* Pending Human Approval Banner */}
              {pendingApproval && (
                <div className="bg-[#FDF4E7] border-2 border-amber-approval p-4 rounded-card space-y-2 text-xs text-ink shadow-sm animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#8C5D1E] flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-approval" />
                      Human Approval Required Before External Action
                    </span>
                    <Badge variant="amber">Safety Firewall</Badge>
                  </div>
                  <div className="text-[11px] text-[#8C5D1E]">
                    Agent requested action: <strong>{pendingApproval.actionType}</strong> on <em>{pendingApproval.targetService}</em>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="amber"
                      onClick={() => handleApprovalDecision(pendingApproval.id, 'approve')}
                      className="flex-1 font-bold text-xs"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Approve & Execute
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprovalDecision(pendingApproval.id, 'reject')}
                      className="flex-1 text-xs"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Reject Action
                    </Button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Composer & Quick Chips */}
            <div className="p-3 sm:p-4 border-t border-border/60 bg-white/90 space-y-2 shrink-0">
              {/* Quick Prompt Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                <button
                  type="button"
                  onClick={() => handleSendMessage('Create 5 Instagram carousel slides with high converting hooks and hashtags')}
                  className="px-2.5 py-1 rounded-full bg-white border border-border hover:border-primary text-ink-muted hover:text-ink whitespace-nowrap shadow-xs active:scale-95 transition-all shrink-0"
                >
                  📸 Instagram Carousel
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Research local competitor marketing strategies and compile a brief')}
                  className="px-2.5 py-1 rounded-full bg-white border border-border hover:border-primary text-ink-muted hover:text-ink whitespace-nowrap shadow-xs active:scale-95 transition-all shrink-0"
                >
                  🌐 Competitor Research
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Draft a high converting email newsletter announcement for our new launch')}
                  className="px-2.5 py-1 rounded-full bg-white border border-border hover:border-primary text-ink-muted hover:text-ink whitespace-nowrap shadow-xs active:scale-95 transition-all shrink-0"
                >
                  ✉️ Email Campaign
                </button>
              </div>

              {/* Input Form */}
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
                  placeholder={`Instruct ${currentAgent.name}...`}
                  disabled={isStreaming}
                  className="flex-1 px-4 py-3 bg-white border border-border text-xs sm:text-sm text-ink placeholder:text-ink-light rounded-control focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-clay-button-subtle"
                />

                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isStreaming}
                  className="w-11 h-11 rounded-[12px] bg-gradient-to-b from-primary to-primary-deep text-white flex items-center justify-center shadow-clay-button hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Conversation History Archive */}
        {conversations.length > 0 && (
          <div className="space-y-3 pt-4">
            <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Past Conversation Threads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {conversations.slice(0, 6).map((conv) => {
                const agent = agentsMap[conv.agentId];
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedAgentId(conv.agentId);
                      setActiveConversation(conv);
                      loadMessages(conv.id);
                    }}
                    className={`clay-surface p-4 flex items-center justify-between cursor-pointer transition-all ${
                      activeConversation?.id === conv.id ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={agent?.name || 'Agent'} size="sm" variant="agent" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-ink truncate">{conv.title}</h4>
                        <span className="text-[11px] text-ink-muted flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(conv.lastMessageAt)}
                        </span>
                      </div>
                    </div>

                    <Link href={`/agents/${conv.agentId}`}>
                      <Button size="sm" variant="outline" className="text-xs px-2.5 py-1">
                        Workspace →
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
