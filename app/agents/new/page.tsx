'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { TOOL_CATALOG } from '@/lib/tools/catalog';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Bot,
  Sparkles,
  ShieldAlert,
  FileText,
  Search,
  MessageSquare,
} from 'lucide-react';

const TEMPLATES = [
  {
    id: 'instagram_lead',
    name: 'Instagram & Social Growth Specialist',
    role: 'Content Creator & Social Media Strategist',
    description: 'Designs multi-slide Instagram carousels, drafts viral hooks, creates Canva design briefs, and generates FLUX image prompts.',
    systemPrompt: 'You are an Expert Instagram & Social Media Specialist. You craft high-converting carousels, viral hooks, Canva design specs, and generate optimized AI image prompts for visual creatives.',
    tools: ['publish_instagram_post', 'generate_canva_asset', 'generate_flux_image', 'web_research', 'read_file', 'generate_report'],
  },
  {
    id: 'visual_designer',
    name: 'AI Creative & Visual Asset Director',
    role: 'Brand Asset Ideation & Design Systems',
    description: 'Creates detailed visual asset briefs, color palettes, Canva banners, and audits Figma design tokens.',
    systemPrompt: 'You are an AI Creative Director. You help businesses design consistent visual assets, format Canva design briefs, inspect Figma tokens, and structure FLUX image generation prompts.',
    tools: ['generate_canva_asset', 'generate_flux_image', 'sync_notion_workspace', 'read_file', 'generate_report'],
  },
  {
    id: 'local_seo_maps',
    name: 'Local Business & Google Maps Strategist',
    role: 'Local SEO & Competitor Growth Specialist',
    description: 'Audits local competitors on Google Maps, tracks customer review sentiments, and drafts client outreach.',
    systemPrompt: 'You are a Local SEO & Business Growth Strategist. You audit local competitors on Google Maps, analyze customer reviews, and identify high-converting local marketing opportunities.',
    tools: ['search_google_maps_businesses', 'send_gmail_message', 'web_research', 'generate_report'],
  },
  {
    id: 'executive_assistant',
    name: 'Executive Operations & Calendar Coworker',
    role: 'Operations & Workflow Coordinator',
    description: 'Schedules Google Calendar appointments, sends Gmail client responses, searches Google Drive docs, and syncs Notion wikis.',
    systemPrompt: 'You are an Executive AI Coworker. You manage Google Calendar meetings, search Google Drive files, draft Gmail responses, and maintain company documentation in Notion.',
    tools: ['schedule_calendar_event', 'send_gmail_message', 'search_google_drive', 'sync_notion_workspace', 'calculator', 'current_time', 'send_telegram_message'],
  },
  {
    id: 'marketing_analyst',
    name: 'Marketing & Deep Research Analyst',
    role: 'Market Analyst & Intelligence Strategist',
    description: 'Researches competitive trends, searches Google Drive sheets, syncs Notion pages, and prepares actionable market dossiers.',
    systemPrompt: 'You are a Senior Marketing Research Assistant. You help small businesses research competitive landscapes, synthesize documents, and draft high-converting copy. Always cite your sources, remain objective, and seek human approval before proposing any external messaging.',
    tools: ['web_research', 'search_google_drive', 'sync_notion_workspace', 'search_knowledge', 'calculator', 'generate_report'],
  },
  {
    id: 'custom_blank',
    name: 'Custom AI Coworker',
    role: 'Specialized Business Assistant',
    description: 'Create a completely custom agent tailored to your exact business specifications and tool needs.',
    systemPrompt: 'You are a specialized AI coworker designed to assist with business tasks.',
    tools: ['web_research', 'read_file', 'generate_report'],
  },
];

export default function NewAgentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('marketing_analyst');
  const [name, setName] = useState('Marketing Research Assistant');
  const [role, setRole] = useState('Market Analyst & Copy Strategist');
  const [description, setDescription] = useState('Researches competitive trends, reviews uploaded briefs, and prepares actionable marketing reports.');
  const [systemPrompt, setSystemPrompt] = useState(TEMPLATES[0].systemPrompt);
  const [selectedTools, setSelectedTools] = useState<string[]>(TEMPLATES[0].tools);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyTemplate = (tId: string) => {
    setSelectedTemplate(tId);
    const tmpl = TEMPLATES.find((t) => t.id === tId);
    if (tmpl) {
      setName(tmpl.name);
      setRole(tmpl.role);
      setDescription(tmpl.description);
      setSystemPrompt(tmpl.systemPrompt);
      setSelectedTools(tmpl.tools);
    }
  };

  const toggleTool = (toolName: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolName) ? prev.filter((t) => t !== toolName) : [...prev, toolName]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          description,
          systemPrompt,
          enabledTools: selectedTools,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create agent');
      }

      const { agent } = await res.json();
      router.push(`/agents/${agent.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/agents" className="inline-flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Agents</span>
        </Link>

        {/* Wizard Stepper */}
        <div className="clay-surface p-4 flex items-center justify-between">
          {[
            { num: 1, label: 'Template' },
            { num: 2, label: 'Identity' },
            { num: 3, label: 'Tools & Safety' },
            { num: 4, label: 'Provision' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  step === s.num
                    ? 'bg-primary text-white shadow-clay-button'
                    : step > s.num
                    ? 'bg-[#E5F4EC] text-success'
                    : 'bg-[#F8F6F1] text-ink-muted'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-semibold ${step === s.num ? 'text-ink' : 'text-ink-muted'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {error ? (
          <div className="bg-[#FDECEC] border border-[#F8D2D2] p-4 rounded-card text-xs text-danger font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Step 1: Template Selection */}
        {step === 1 ? (
          <div className="clay-surface p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-ink">Step 1: Choose a Coworker Template</h2>
              <p className="text-xs text-ink-muted mt-1">
                Select a pre-configured role or build a custom agent from scratch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => applyTemplate(tmpl.id)}
                  className={`p-4 rounded-card border cursor-pointer transition-all ${
                    selectedTemplate === tmpl.id
                      ? 'border-primary bg-cloud-blue/50 shadow-clay-button-subtle'
                      : 'border-border/80 bg-white hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-ink">{tmpl.name}</span>
                    {selectedTemplate === tmpl.id ? (
                      <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : null}
                  </div>
                  <p className="text-[11px] text-ink-muted leading-relaxed">{tmpl.description}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} className="gap-2">
                <span>Continue to Identity</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : null}

        {/* Step 2: Name & Instructions */}
        {step === 2 ? (
          <div className="clay-surface p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-ink">Step 2: Agent Identity & Instructions</h2>
              <p className="text-xs text-ink-muted mt-1">
                Define how your agent identifies and acts across business tasks.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Agent Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Job Title / Role</label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Short Purpose</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">System Instructions</label>
                <Textarea
                  rows={5}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="gap-2">
                <span>Configure Tools</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : null}

        {/* Step 3: Tools & Permissions */}
        {step === 3 ? (
          <div className="clay-surface p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-ink">Step 3: Tools & Safety Guardrails</h2>
              <p className="text-xs text-ink-muted mt-1">
                Equip your agent with read-only tools and human-gated communication connectors.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {Object.values(TOOL_CATALOG).map((tool) => {
                const isSelected = selectedTools.includes(tool.name);
                return (
                  <div
                    key={tool.name}
                    onClick={() => toggleTool(tool.name)}
                    className={`p-3.5 rounded-control border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-cloud-blue/30 shadow-xs'
                        : 'border-border bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-primary border-primary text-white' : 'border-border bg-white'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-ink">{tool.displayName}</span>
                          {tool.requiresApproval ? (
                            <Badge variant="amber" className="text-[10px]">
                              Requires Approval
                            </Badge>
                          ) : (
                            <Badge variant="success" className="text-[10px]">
                              Safe Read-Only
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-ink-muted mt-0.5">{tool.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="gap-2">
                <span>Review & Provision</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : null}

        {/* Step 4: Review & Provision */}
        {step === 4 ? (
          <div className="clay-surface p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-ink">Step 4: Provision AI Coworker</h2>
              <p className="text-xs text-ink-muted mt-1">
                Confirm your agent configuration. This will consume 1 of your 3 allowed agent slots.
              </p>
            </div>

            <div className="bg-[#F8F6F1] p-4 rounded-card border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted">Name & Role:</span>
                <span className="text-xs font-bold text-ink">{name} ({role})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted">Enabled Tools ({selectedTools.length}):</span>
                <span className="text-xs font-semibold text-primary">{selectedTools.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted">Safety Policy:</span>
                <span className="text-xs font-semibold text-amber-approval">Human Approval for External Writes</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={handleSubmit} isLoading={loading} size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Create & Launch Agent</span>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
