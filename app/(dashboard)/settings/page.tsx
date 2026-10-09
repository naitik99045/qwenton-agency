'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Settings, Cpu, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Key, Globe, Sparkles } from 'lucide-react';

const PROVIDER_PRESETS: Record<string, { baseUrl: string; model: string; defaultKey: string }> = {
  lmstudio: {
    baseUrl: 'http://127.0.0.1:1234/v1',
    model: 'qwen2.5-7b-instruct',
    defaultKey: 'lm-studio-local',
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    model: 'gemini-1.5-flash',
    defaultKey: '',
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    defaultKey: '',
  },
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    defaultKey: '',
  },
  ollama: {
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3',
    defaultKey: 'ollama',
  },
  custom: {
    baseUrl: 'https://api.together.xyz/v1',
    model: 'meta-llama/Llama-3-70b-chat-hf',
    defaultKey: '',
  },
};

export default function SettingsPage() {
  const [provider, setProvider] = useState<string>('lmstudio');
  const [baseUrl, setBaseUrl] = useState('http://127.0.0.1:1234/v1');
  const [apiKey, setApiKey] = useState('lm-studio-local');
  const [model, setModel] = useState('qwen2.5-7b-instruct');
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const handleProviderChange = (p: string) => {
    setProvider(p);
    const preset = PROVIDER_PRESETS[p];
    if (preset) {
      setBaseUrl(preset.baseUrl);
      setModel(preset.model);
      if (preset.defaultKey) setApiKey(preset.defaultKey);
    }
  };

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/settings/model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          baseUrl,
          apiKey: apiKey || 'none',
          model,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({ ok: false, message: `Network error: ${msg}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">AI Model & Provider Settings</h1>
          <p className="text-xs text-ink-muted mt-1">
            Connect your workspace directly to Google Gemini, OpenAI, Groq, local LM Studio, or any custom BaseURL.
          </p>
        </div>

        {/* Multi-Model Configuration Form */}
        <div className="clay-surface p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border/70">
            <div className="w-10 h-10 rounded-[14px] bg-cloud-blue text-primary flex items-center justify-center shadow-clay-button-subtle">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Active LLM Provider Engine</h3>
              <p className="text-xs text-ink-muted">Configure endpoint and model parameters for agent execution</p>
            </div>
          </div>

          {/* Provider Preset Selector Pills */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-2">Select Provider</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { id: 'lmstudio', label: 'LM Studio' },
                { id: 'gemini', label: 'Gemini' },
                { id: 'openai', label: 'OpenAI' },
                { id: 'groq', label: 'Groq' },
                { id: 'ollama', label: 'Ollama' },
                { id: 'custom', label: 'Custom' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleProviderChange(item.id)}
                  className={`py-2 px-3 rounded-control text-xs font-bold transition-all border ${
                    provider === item.id
                      ? 'bg-primary text-white border-primary shadow-clay-button'
                      : 'bg-white text-ink-muted border-border hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleTestConnection} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                API Base URL (OpenAI-compatible)
              </label>
              <Input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.openai.com/v1"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                  API Key
                </label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key or leave for local..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                  Model Name / ID
                </label>
                <Input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. gemini-1.5-flash, gpt-4o-mini"
                  required
                />
              </div>
            </div>

            {testResult ? (
              <div
                className={`p-4 rounded-card text-xs flex items-start gap-2.5 border ${
                  testResult.ok
                    ? 'bg-[#E5F4EC] border-[#C8E8D7] text-success'
                    : 'bg-[#FDECEC] border-[#F8D2D2] text-danger'
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong>{testResult.ok ? 'Connection Verified!' : 'Connection Failed:'}</strong>{' '}
                  {testResult.message}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="submit" isLoading={testing} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Test & Validate Connection</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
