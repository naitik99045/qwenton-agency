'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import {
  Sparkles,
  Bot,
  Zap,
  CheckCircle2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Mail,
  Palette,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Layers,
  Check,
} from 'lucide-react';
import { getAuthToken } from '@/lib/auth/firebase-client-auth';

interface CampaignDossier {
  missionSummary: string;
  marketAnalysis: {
    targetAudience: string;
    competitorAngle: string;
    valuePropositions: string[];
  };
  carousel: {
    hook: string;
    slides: Array<{ slideNumber: number; title: string; body: string }>;
    caption: string;
    hashtags: string[];
  };
  visualDirective: {
    colorPalette: string[];
    canvaDimensions: string;
    fluxPrompt: string;
    designNotes: string;
  };
  operations: {
    emailSubject: string;
    emailBody: string;
    calendarSchedule: Array<{ day: string; time: string; action: string }>;
  };
}

const PRESET_MISSIONS = [
  {
    title: 'Artisan Bakery Festive Offer',
    biz: 'Bella Crust Artisan Bakery',
    loc: 'Indiranagar, Bangalore',
    nch: 'Sourdough & Artisanal Pastries',
    obj: 'Launch our weekend sourdough gift hamper campaign with 20% early-bird discount.',
  },
  {
    title: 'D2C Skincare Monsoon Flash Sale',
    biz: 'Aura Botanics',
    loc: 'Mumbai & Pan-India',
    nch: 'Clean Ayurvedic Skincare',
    obj: 'Launch a 48-hour monsoon hydration serum drop targeting working professionals.',
  },
  {
    title: 'High-Ticket Interior Design Leads',
    biz: 'Studio Vastu Luxury Interiors',
    loc: 'South Delhi',
    nch: 'Luxury Residential Architecture',
    obj: 'Attract new villa renovation clients with a carousel showcasing our latest before/after redesigns.',
  },
  {
    title: 'Boutique Gym Membership Blitz',
    biz: 'Pulse Athletic Club',
    loc: 'Jubilee Hills, Hyderabad',
    nch: 'Functional Training & CrossFit',
    obj: 'Run a 30-day transformation challenge announcement to enroll 50 new annual members.',
  },
];

export default function AgencySwarmPage() {
  const [objective, setObjective] = useState(PRESET_MISSIONS[0].obj);
  const [businessName, setBusinessName] = useState(PRESET_MISSIONS[0].biz);
  const [location, setLocation] = useState(PRESET_MISSIONS[0].loc);
  const [niche, setNiche] = useState(PRESET_MISSIONS[0].nch);

  const [running, setRunning] = useState(false);
  const [dossier, setDossier] = useState<CampaignDossier | null>(null);
  const [approvalId, setApprovalId] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyPreset = (p: typeof PRESET_MISSIONS[0]) => {
    setObjective(p.obj);
    setBusinessName(p.biz);
    setLocation(p.loc);
    setNiche(p.nch);
  };

  const handleLaunchMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;

    setRunning(true);
    setError(null);
    setDossier(null);
    setActiveSlide(0);

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/swarm/run', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          objective,
          businessName,
          location,
          niche,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Swarm orchestration failed');

      setDossier(data.dossier);
      setApprovalId(data.approvalId || null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setRunning(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Hero Banner */}
        <div className="clay-surface p-6 sm:p-8 space-y-4 border-2 border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="info" className="px-3 py-1 text-xs font-bold gap-1.5 shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>100x Autonomous Agency Swarm</span>
              </Badge>
              <Badge variant="success">Groq LPU Engine Active</Badge>
            </div>
            <span className="text-xs text-ink-muted font-medium">Replaces 4 Human Agency Roles</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Launch an Entire Coordinated Marketing Campaign in 10 Seconds
            </h1>
            <p className="text-sm text-ink-muted mt-2 max-w-2xl leading-relaxed">
              Enter one business objective. Four specialized AI coworkers (Market Analyst, Creative Visual Director, Social Media Strategist, and Operations Coordinator) collaborate in parallel to deliver an Executive Campaign Dossier with 1-click approval.
            </p>
          </div>

          {/* Quick Mission Preset Chips */}
          <div className="pt-2">
            <span className="text-xs font-bold text-ink-muted uppercase tracking-wider block mb-2">
              1-Click Mission Templates:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_MISSIONS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-control bg-white border border-border hover:border-primary hover:bg-cloud-blue text-ink transition-all shadow-xs"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Input Form */}
        <form onSubmit={handleLaunchMission} className="clay-surface p-6 space-y-4">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Define Your Campaign Objective</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Business Name</label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Bella Crust Bakery"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">City / Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Indiranagar, Bangalore"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Niche / Category</label>
              <Input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Sourdough Bakery"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Core Campaign Objective & Offer</label>
            <Textarea
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What do you want the agency team to achieve? Include any discount, product name, or event date."
              required
            />
          </div>

          {error ? (
            <div className="p-3 rounded-card text-xs bg-[#FDECEC] border border-[#F8D2D2] text-danger font-medium">
              ⚠️ {error}
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div className="text-xs text-ink-muted">
              🚀 Generates Market Analysis + 5-Slide Carousel + Visual Specs + Email + Calendar Schedule
            </div>
            <Button type="submit" isLoading={running} className="gap-2 px-6">
              <Zap className="w-4 h-4" />
              <span>{running ? 'Orchestrating 4 Agents...' : 'Deploy Swarm Mission'}</span>
            </Button>
          </div>
        </form>

        {/* Live Running State */}
        {running && (
          <div className="clay-surface p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-primary text-white flex items-center justify-center mx-auto shadow-clay-button animate-spin">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink">Autonomous Swarm in Action</h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Market Analyst auditing competitors • Visual Director building color science & FLUX prompts • Social Strategist drafting viral carousel • Operations scheduling publication.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto pt-2">
              {['1. Market Audit', '2. Visual Specs', '3. Slide Copy', '4. Calendar Slots'].map((step, idx) => (
                <div key={idx} className="p-2 rounded-control bg-cloud-blue text-primary font-bold text-xs animate-pulse">
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Executive Campaign Dossier */}
        {dossier && !running && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/80">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-ink">Executive Campaign Dossier</h2>
                  <Badge variant="success">Ready for Approval</Badge>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">{dossier.missionSummary}</p>
              </div>

              {approvalId ? (
                <Link href="/approvals">
                  <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-clay-button">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Review in Approvals Inbox</span>
                  </Button>
                </Link>
              ) : null}
            </div>

            {/* 1. Market Positioning & Audience */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="clay-surface p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Target Audience</span>
                <p className="text-xs text-ink leading-relaxed font-medium">
                  {dossier.marketAnalysis.targetAudience}
                </p>
              </div>
              <div className="clay-surface p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Competitive Angle</span>
                <p className="text-xs text-ink leading-relaxed font-medium">
                  {dossier.marketAnalysis.competitorAngle}
                </p>
              </div>
              <div className="clay-surface p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Core Value Props</span>
                <ul className="text-xs text-ink space-y-1 font-medium">
                  {dossier.marketAnalysis.valuePropositions.map((vp, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>{vp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 2. Interactive 5-Slide Instagram Carousel */}
            <div className="clay-surface p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[10px] bg-primary text-white flex items-center justify-center font-bold text-xs">
                    IG
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink">5-Slide High-Retention Carousel</h3>
                    <p className="text-xs text-ink-muted">Scroll-stopping hook and engagement slides</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                    disabled={activeSlide === 0}
                    className="p-1.5 rounded-control border border-border bg-white text-ink disabled:opacity-40 hover:bg-gray-50 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-ink">
                    Slide {activeSlide + 1} of {dossier.carousel.slides.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSlide((prev) => Math.min(dossier.carousel.slides.length - 1, prev + 1))}
                    disabled={activeSlide === dossier.carousel.slides.length - 1}
                    className="p-1.5 rounded-control border border-border bg-white text-ink disabled:opacity-40 hover:bg-gray-50 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Slide Display */}
              {dossier.carousel.slides[activeSlide] && (
                <div className="p-6 rounded-card bg-[#FAF8F5] border-2 border-border/80 shadow-inner space-y-3 max-w-lg mx-auto text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-cloud-blue">
                    Slide {dossier.carousel.slides[activeSlide].slideNumber} / {dossier.carousel.slides.length}
                  </span>
                  <h4 className="text-lg font-extrabold text-ink pt-1">
                    {dossier.carousel.slides[activeSlide].title}
                  </h4>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-medium">
                    {dossier.carousel.slides[activeSlide].body}
                  </p>
                </div>
              )}

              {/* Caption & Hashtags with Copy Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border/60">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">Caption</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(dossier.carousel.caption, 'caption')}
                      className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      {copiedKey === 'caption' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'caption' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-control bg-canvas border border-border text-xs text-ink leading-relaxed max-h-32 overflow-y-auto">
                    {dossier.carousel.caption}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">Hashtag Clusters</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(dossier.carousel.hashtags.join(' '), 'hashtags')}
                      className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      {copiedKey === 'hashtags' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'hashtags' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-control bg-canvas border border-border text-xs text-primary font-medium flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {dossier.carousel.hashtags.map((tag, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded-control border border-border/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Creative Visual Directives & FLUX Prompt */}
            <div className="clay-surface p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-ink">Creative Visual Direction</h3>
                </div>
                <Badge variant="info">{dossier.visualDirective.canvaDimensions}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-ink block">Brand Color Palette</span>
                  <div className="flex items-center gap-3">
                    {dossier.visualDirective.colorPalette.map((hex, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div
                          className="w-7 h-7 rounded-[8px] border border-black/10 shadow-xs"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-[11px] font-mono text-ink-muted">{hex}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-ink-muted pt-1">{dossier.visualDirective.designNotes}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">FLUX 1.1 Hero Image Prompt</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(dossier.visualDirective.fluxPrompt, 'flux')}
                      className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      {copiedKey === 'flux' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'flux' ? 'Copied' : 'Copy Prompt'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-control bg-canvas border border-border text-xs text-ink font-mono italic">
                    "{dossier.visualDirective.fluxPrompt}"
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Operations: Email & Publishing Calendar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Promotional Email */}
              <div className="clay-surface p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-ink">Customer Email Broadcast</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${dossier.operations.emailSubject}\n\n${dossier.operations.emailBody}`, 'email')}
                    className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
                  >
                    {copiedKey === 'email' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'email' ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>

                <div className="text-xs font-bold text-ink border-b border-border/60 pb-2">
                  Subject: {dossier.operations.emailSubject}
                </div>
                <div className="text-xs text-ink-muted whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {dossier.operations.emailBody}
                </div>
              </div>

              {/* 7-Day Calendar Schedule */}
              <div className="clay-surface p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-ink">Publishing & Outreach Calendar</h3>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {dossier.operations.calendarSchedule.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-control bg-canvas border border-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{slot.day}</span>
                        <span className="text-ink-muted">({slot.time})</span>
                      </div>
                      <span className="font-semibold text-ink">{slot.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom 1-Click Approval Action */}
            <div className="clay-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-emerald-500/30 bg-[#F0FAF4]">
              <div>
                <h4 className="text-base font-bold text-ink">Ready to execute this entire campaign?</h4>
                <p className="text-xs text-ink-muted mt-0.5">
                  Approval token generated. Approving dispatches social posts and records scheduled events.
                </p>
              </div>

              <Link href="/approvals">
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-clay-button px-6">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Go to Approvals & Dispatch All</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
