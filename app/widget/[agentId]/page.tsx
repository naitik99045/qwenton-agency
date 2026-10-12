'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Bot, Send, Sparkles, ExternalLink, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { FormattedMessage } from '@/components/ui/FormattedMessage';

interface WidgetAgent {
  id: string;
  name: string;
  role: string;
  description: string;
}

interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export default function EmbeddedAgentWidget() {
  const params = useParams();
  const agentId = (params?.agentId as string) || '';

  const [agent, setAgent] = useState<WidgetAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    if (!agentId) return;

    async function loadAgent() {
      try {
        setLoading(true);
        const res = await fetch(`/api/widget/${agentId}/info`);
        if (!res.ok) {
          throw new Error('This AI agent is currently private or unavailable.');
        }
        const data = await res.json();
        setAgent(data.agent);
        setMessages([
          {
            id: 'init_welcome',
            role: 'assistant',
            content: `Hello! I'm **${data.agent.name}**, your **${data.agent.role}**.\n\n${data.agent.description || 'How can I assist you today?'}`,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to connect to agent');
      } finally {
        setLoading(false);
      }
    }

    loadAgent();
  }, [agentId]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isStreaming || !agent) return;

    const userMessage: ChatMessageItem = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsStreaming(true);
    setStreamingText('');

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`/api/widget/${agentId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to receive reply');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No readable response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: [DONE]')) {
            break;
          }
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.type === 'token' && parsed.content) {
                accumulated += parsed.content;
                setStreamingText(accumulated);
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error);
              }
            } catch (pErr) {
              // Ignore partial stream parse
            }
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: accumulated,
          createdAt: new Date().toISOString(),
        },
      ]);
      setStreamingText('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Communication error';
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${msg}`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingText('');
    }
  };

  const starterSuggestions = [
    'What services do you offer?',
    'How do I get started?',
    'Can you tell me about your pricing?',
  ];

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#F8F6F1] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#523E8C] text-white flex items-center justify-center shadow-md animate-pulse mb-3">
          <Bot className="w-6 h-6" />
        </div>
        <div className="text-sm font-bold text-[#1A1824]">Connecting to AI Coworker...</div>
        <p className="text-xs text-[#523E8C]/70 mt-1">Initializing secure widget session</p>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="h-screen w-full bg-[#F8F6F1] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm mb-3">
          <Bot className="w-6 h-6" />
        </div>
        <div className="text-base font-bold text-[#1A1824]">Agent Offline</div>
        <p className="text-xs text-neutral-500 mt-1 max-w-xs">{error || 'Agent not found'}</p>
        <a
          href="/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-xs font-bold text-[#523E8C] hover:underline"
        >
          Build your own AI Coworker with Qwenton →
        </a>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#F8F6F1] flex flex-col overflow-hidden font-sans text-[#1A1824] select-none">
      {/* Widget Header */}
      <div className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-[#E6EEF8] flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar name={agent.name} size="md" variant="agent" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-[#1A1824] tracking-tight flex items-center gap-1.5">
              <span>{agent.name}</span>
              <span className="text-[10px] font-bold text-[#523E8C] bg-[#E6EEF8] px-1.5 py-0.2 rounded-full">
                AI Coworker
              </span>
            </div>
            <div className="text-[11px] text-neutral-500 line-clamp-1">{agent.role}</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            ● Active
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div key={m.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="shrink-0 mt-0.5">
                  <Avatar name={agent.name} size="sm" variant="agent" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-[#523E8C] text-white rounded-br-xs font-medium'
                    : 'bg-white border border-[#E6EEF8] text-[#1A1824] rounded-bl-xs'
                }`}
              >
                {isUser ? m.content : <FormattedMessage content={m.content} />}
              </div>
            </div>
          );
        })}

        {/* Streaming Bubble */}
        {isStreaming && (
          <div className="flex gap-2.5 justify-start">
            <div className="shrink-0 mt-0.5">
              <Avatar name={agent.name} size="sm" variant="agent" />
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-bl-xs px-4 py-2.5 text-xs sm:text-sm bg-white border border-[#E6EEF8] text-[#1A1824] shadow-xs">
              {streamingText ? (
                <FormattedMessage content={streamingText} />
              ) : (
                <div className="flex items-center gap-1.5 py-1 text-xs text-neutral-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-[#523E8C]" />
                  <span>Thinking...</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions (if conversation is fresh) */}
      {messages.length <= 2 && !isStreaming && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
          {starterSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSendMessage(s)}
              className="text-[11px] font-semibold text-[#523E8C] bg-white hover:bg-[#E6EEF8] border border-[#D0DFEF] px-2.5 py-1 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-white/95 border-t border-[#E6EEF8] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${agent.name}...`}
            disabled={isStreaming}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-[#F8F6F1]/70 text-[#1A1824] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#523E8C]/30 focus:border-[#523E8C] transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isStreaming}
            className="p-2 sm:px-4 sm:py-2 rounded-xl bg-[#523E8C] hover:bg-[#433177] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

      {/* VIRAL EMBED GROWTH BADGE (The 100x Growth Loop Engine) */}
      <div className="py-1.5 px-4 bg-[#F2EFE9] border-t border-[#E5E0D5] text-center shrink-0">
        <a
          href={`/signup?utm_source=widget&utm_medium=embed&agent=${agent.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#523E8C] hover:text-[#382B61] transition-colors group"
        >
          <Sparkles className="w-3 h-3 text-[#523E8C] group-hover:scale-110 transition-transform" />
          <span>⚡ Powered by Qwenton AI Agents • Build Yours Free</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
        </a>
      </div>
    </div>
  );
}
