'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
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
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { Agent, Conversation, Message, Approval, RunEvent } from '@/lib/db/types';

export default function AgentWorkspacePage() {
  const routeParams = useParams();
  const agentId = (routeParams?.agentId as string) || '';
  const [agent, setAgent] = useState<Agent | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activityEvents, setActivityEvents] = useState<RunEvent[]>([]);
  const [pendingApproval, setPendingApproval] = useState<Approval | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const [agentRes, convsRes] = await Promise.all([
          fetch(`/api/agents/${agentId}`),
          fetch('/api/conversations'),
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
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ agentId }),
            });
            if (newConvRes.ok) {
              const newCData = await newConvRes.json();
              currentConv = newCData.conversation;
            }
          }

          if (currentConv) {
            setConversation(currentConv);
            const msgsRes = await fetch(`/api/conversations/${currentConv.id}/messages`);
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
  }, [agentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || !conversation || isStreaming) return;

    setInputPrompt('');
    setIsStreaming(true);
    setStreamingContent('');

    // Add temporary user message to UI
    const tempUserMsg: Message = {
      id: `temp_${Date.now()}`,
      conversationId: conversation.id,
      agentId,
      ownerUid: 'me',
      sender: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    // Clear and initialize timeline
    setActivityEvents([
      {
        id: `start_${Date.now()}`,
        runId: 'temp',
        type: 'thought',
        title: 'Ingesting context & knowledge chunks...',
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.body) throw new Error('No stream body');

      const reader = response.body.getReader();
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
              } else if (event.type === 'completed') {
                // Fetch fresh messages
                const freshMsgs = await fetch(`/api/conversations/${conversation.id}/messages`);
                if (freshMsgs.ok) {
                  const mData = await freshMsgs.json();
                  setMessages(mData.messages || []);
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
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleApprovalDecision = async (approvalId: string, decision: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/approvals/${approvalId}/${decision}`, { method: 'POST' });
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
      {/* 3-Panel Workspace Layout */}
      <div className="h-[calc(100vh-8.5rem)] flex gap-5 -m-4">
        {/* Left Panel: Agent Card, Purpose & Tools */}
        <div className="w-72 clay-surface p-5 flex flex-col justify-between shrink-0 overflow-y-auto hidden lg:flex">
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
          </div>
        </div>

        {/* Center Panel: Main Conversation & Composer */}
        <div className="flex-1 clay-surface flex flex-col justify-between overflow-hidden shadow-clay-card">
          {/* Conversation Header */}
          <div className="p-4 border-b border-border/60 bg-white/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Avatar name={agent.name} size="md" variant="agent" />
              <div>
                <h3 className="text-sm font-bold text-ink">{conversation?.title || 'Interactive Session'}</h3>
                <p className="text-[11px] text-ink-muted">Streaming responses & safe step bounds</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-light font-medium">Auto-saved to history</span>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <Avatar
                  name={msg.sender === 'user' ? 'User' : agent.name}
                  size="md"
                  variant={msg.sender === 'user' ? 'user' : 'agent'}
                />
                <div
                  className={`p-4 rounded-card text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-b from-[#4667B1] to-[#34518F] text-white shadow-clay-button'
                      : 'bg-[#F8F6F1] text-ink border border-border shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}

            {/* Live Streaming Bubble */}
            {isStreaming && streamingContent ? (
              <div className="flex gap-3 max-w-2xl">
                <Avatar name={agent.name} size="md" variant="agent" />
                <div className="p-4 rounded-card text-sm leading-relaxed bg-[#F8F6F1] text-ink border border-border shadow-xs animate-pulse">
                  <div className="whitespace-pre-wrap">{streamingContent}</div>
                </div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts & Composer */}
          <div className="p-4 border-t border-border/60 bg-white/60 space-y-3 shrink-0">
            {/* Quick Action Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => handleSendMessage('Calculate ROI for a $12,000 ad campaign generating 340 customers at $85 LTV')}
                className="px-3 py-1 rounded-full bg-white border border-border hover:border-primary text-ink-muted hover:text-ink whitespace-nowrap shadow-xs transition-colors"
              >
                📊 Calculate Campaign ROI
              </button>
              <button
                onClick={() => handleSendMessage('Perform public web research on top marketing trends for AI coworkers in 2026')}
                className="px-3 py-1 rounded-full bg-white border border-border hover:border-primary text-ink-muted hover:text-ink whitespace-nowrap shadow-xs transition-colors"
              >
                🌐 Web Research Trends
              </button>
              <button
                onClick={() => handleSendMessage('Draft a formal marketing executive brief with recommendations')}
                className="px-3 py-1 rounded-full bg-white border border-border hover:border-primary text-ink-muted hover:text-ink whitespace-nowrap shadow-xs transition-colors"
              >
                📄 Generate Brief
              </button>
            </div>

            {/* Main Message Input */}
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
                className="flex-1 px-4 py-3 bg-white border border-border text-sm text-ink placeholder:text-ink-light rounded-control focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-clay-button-subtle"
              />

              <Button type="submit" size="md" isLoading={isStreaming} disabled={!inputPrompt.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right Panel: Observable Activity Timeline & Inline Approvals */}
        <div className="w-80 clay-surface p-5 flex flex-col justify-between shrink-0 overflow-y-auto hidden xl:flex">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <Play className="w-3.5 h-3.5 text-primary" />
                <span>Observable Activity</span>
              </div>
              <Badge variant={isStreaming ? 'amber' : 'default'} className="text-[10px]">
                {isStreaming ? 'Executing Step' : 'Idle'}
              </Badge>
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
                  {JSON.stringify(pendingApproval.payload, null, 2)}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleApprovalDecision(pendingApproval.id, 'approve')}
                    className="flex-1 py-1.5 bg-success text-white text-xs font-bold rounded-control hover:brightness-105 flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleApprovalDecision(pendingApproval.id, 'reject')}
                    className="flex-1 py-1.5 bg-danger text-white text-xs font-bold rounded-control hover:brightness-105 flex items-center justify-center gap-1 shadow-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Timeline Events List */}
            <div className="space-y-3">
              {activityEvents.length === 0 ? (
                <div className="text-center py-8 text-xs text-ink-muted">
                  No active run steps. Send a message to see real-time tool execution.
                </div>
              ) : (
                activityEvents.map((ev) => (
                  <div key={ev.id} className="bg-[#F8F6F1] p-3 rounded-control border border-border/80 text-xs">
                    <div className="font-semibold text-ink flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      <span>{ev.title}</span>
                    </div>
                    {ev.details ? (
                      <pre className="mt-1.5 p-2 bg-white rounded-[8px] text-[10px] font-mono text-ink-muted overflow-x-auto">
                        {JSON.stringify(ev.details, null, 2)}
                      </pre>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
