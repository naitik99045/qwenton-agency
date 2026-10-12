'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  MapPin,
  Instagram,
  Mail,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Search,
  ShieldCheck,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AuditResult {
  businessName: string;
  location: string;
  niche: string;
  growthScore: number;
  auditSummary: string;
  googleMapsAudit: {
    competitorBenchmark: string;
    rankingOpportunity: string;
    reviewGap: string;
  };
  socialCarousel: {
    hook: string;
    slides: Array<{ slide: number; title: string; text: string }>;
    caption: string;
    hashtags: string[];
  };
  coldOutreach: {
    channel: string;
    subject: string;
    pitch: string;
  };
  recommendedAgents: Array<{ name: string; role: string; action: string }>;
}

const PRESET_EXAMPLES = [
  { name: 'Bella Cucina Cafe', location: 'Indiranagar, Bangalore', niche: 'Artisan Cafe & Bakery' },
  { name: 'Apex Smile Clinic', location: 'Bandra, Mumbai', niche: 'Cosmetic Dentistry' },
  { name: 'Ironclad Athletic', location: 'Hauz Khas, Delhi', niche: 'Boutique Crossfit Studio' },
  { name: 'Aura Linen D2C', location: 'Jaipur', niche: 'Luxury Home Textiles' },
];

export function InstantAuditSandbox() {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [niche, setNiche] = useState('Artisan Cafe & Bakery');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'maps' | 'carousel' | 'email'>('maps');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleRunAudit = async (preset?: typeof PRESET_EXAMPLES[0]) => {
    const biz = preset?.name || businessName;
    const loc = preset?.location || location;
    const nch = preset?.niche || niche;

    if (!biz.trim() || !loc.trim()) return;

    if (preset) {
      setBusinessName(preset.name);
      setLocation(preset.location);
      setNiche(preset.niche);
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/demo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: biz, location: loc, niche: nch }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audit) {
          setResult(data.audit);
          // Persist to localStorage so the user can import it after signing up!
          try {
            localStorage.setItem('qwenton_demo_audit', JSON.stringify(data.audit));
          } catch {}
        }
      }
    } catch (e) {
      console.error('Audit run error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSection(id);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8">
      {/* Outer Tactile Card */}
      <div className="clay-card border-2 border-primary/20 bg-white/95 rounded-2xl p-6 sm:p-8 shadow-clay-card relative overflow-hidden">
        {/* Top Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <Badge variant="info" className="font-bold text-xs">
                ⚡ 5-Second Instant Growth Sandbox • No Login Required
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
              Test Drive Your Autonomous Coworker Fleet Right Now
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Enter any real local business. Groq-powered AI specialists will run a live competitive gap audit in ~1.2 seconds.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0 bg-cloud-blue px-3.5 py-2 rounded-xl border border-primary/20 text-xs font-semibold text-primary-deep">
            <Zap className="w-4 h-4 text-primary" />
            <span>Sub-second Cloud LPU Engine</span>
          </div>
        </div>

        {/* Input Controls */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">
                1. Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Bella Cucina Cafe"
                className="w-full px-3.5 py-2.5 rounded-control border border-border bg-canvas/60 text-sm font-medium text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">
                2. City or Neighborhood
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Indiranagar, Bangalore"
                className="w-full px-3.5 py-2.5 rounded-control border border-border bg-canvas/60 text-sm font-medium text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wider">
                3. Industry / Niche
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Artisan Cafe & Bakery"
                className="w-full px-3.5 py-2.5 rounded-control border border-border bg-canvas/60 text-sm font-medium text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Quick Preset Selector Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-ink-muted">Quick Try:</span>
            {PRESET_EXAMPLES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleRunAudit(preset)}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-canvas hover:bg-cloud-blue text-ink-muted hover:text-primary-deep border border-border transition-all flex items-center gap-1 select-none"
              >
                <span>{preset.name}</span>
                <span className="text-[10px] text-ink-light">({preset.location.split(',')[0]})</span>
              </button>
            ))}
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={() => handleRunAudit()}
              disabled={isLoading || (!businessName.trim() && !location.trim())}
              size="lg"
              className="w-full sm:w-auto font-bold gap-2 shadow-clay-button px-8 text-sm"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>AI Coworker Fleet Auditing Competitors (~1.2s)...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-white" />
                  <span>Generate 5-Second Agency Audit Free</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Live Loading Pulse Animation */}
        {isLoading && (
          <div className="mt-8 p-8 rounded-xl bg-cloud-blue/50 border border-primary/20 flex flex-col items-center justify-center text-center space-y-3 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-clay-button">
              <Bot className="w-6 h-6 animate-bounce" />
            </div>
            <div className="font-bold text-base text-ink">
              Analyzing local Google Maps competitors & review sentiment for {businessName || 'target business'}...
            </div>
            <p className="text-xs text-ink-muted max-w-md">
              Extracting top review complaints, formulating 5-slide viral Instagram carousel, and personalizing cold acquisition outreach via Groq LPU.
            </p>
          </div>
        )}

        {/* Live Audit Output Window */}
        {result && !isLoading && (
          <div className="mt-8 pt-6 border-t border-border/80">
            {/* Scorecard Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-cloud-blue border border-primary/20 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex flex-col items-center justify-center font-black shadow-xs">
                  <span className="text-sm leading-none">{result.growthScore}</span>
                  <span className="text-[9px] uppercase tracking-tighter opacity-80">/100</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-primary-deep uppercase tracking-wider">
                    Opportunity Score • {result.businessName} ({result.location})
                  </div>
                  <div className="text-sm font-semibold text-ink line-clamp-1">
                    {result.auditSummary}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="success" className="font-bold">
                  High Local Demand
                </Badge>
                <Badge variant="amber" className="font-bold">
                  Low Competitor Moat
                </Badge>
              </div>
            </div>

            {/* Audit Section Tabs */}
            <div className="flex items-center gap-2 border-b border-border mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('maps')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all select-none ${
                  activeTab === 'maps'
                    ? 'border-primary text-primary-deep bg-cloud-blue/50 rounded-t-lg'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Google Maps 3-Pack Gap</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('carousel')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all select-none ${
                  activeTab === 'carousel'
                    ? 'border-primary text-primary-deep bg-cloud-blue/50 rounded-t-lg'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-primary" />
                <span>Viral 5-Slide Instagram Carousel</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all select-none ${
                  activeTab === 'email'
                    ? 'border-primary text-primary-deep bg-cloud-blue/50 rounded-t-lg'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>High-Converting Outreach Draft</span>
              </button>
            </div>

            {/* Tab 1: Google Maps Audit */}
            {activeTab === 'maps' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-canvas border border-border">
                    <div className="text-xs font-bold text-ink-muted uppercase mb-1">Competitor Benchmark</div>
                    <p className="text-xs text-ink font-medium leading-relaxed">
                      {result.googleMapsAudit.competitorBenchmark}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-canvas border border-border">
                    <div className="text-xs font-bold text-ink-muted uppercase mb-1">Local 3-Pack Opportunity</div>
                    <p className="text-xs text-ink font-medium leading-relaxed">
                      {result.googleMapsAudit.rankingOpportunity}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-canvas border border-border">
                    <div className="text-xs font-bold text-ink-muted uppercase mb-1">Unaddressed Review Gap</div>
                    <p className="text-xs text-ink font-medium leading-relaxed">
                      {result.googleMapsAudit.reviewGap}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="text-xs text-emerald-900 font-medium">
                      Marcus (Market Intelligence Agent) can monitor these competitor review shifts automatically every 24 hours.
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCopy(
                        `Local Audit for ${result.businessName}:\n- Benchmark: ${result.googleMapsAudit.competitorBenchmark}\n- 3-Pack: ${result.googleMapsAudit.rankingOpportunity}\n- Review Gap: ${result.googleMapsAudit.reviewGap}`,
                        'maps'
                      )
                    }
                    className="shrink-0 text-xs font-bold gap-1.5"
                  >
                    {copiedSection === 'maps' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'maps' ? 'Copied' : 'Copy Audit'}</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Tab 2: Instagram Carousel */}
            {activeTab === 'carousel' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-ink-muted uppercase">
                    Hook: <span className="text-ink font-bold lowercase">"{result.socialCarousel.hook}"</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {result.socialCarousel.slides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCarouselIndex(idx)}
                        className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all ${
                          carouselIndex === idx
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-canvas text-ink-muted hover:bg-black/5'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Slide Card */}
                {result.socialCarousel.slides[carouselIndex] && (
                  <div className="p-6 rounded-xl bg-canvas border-2 border-primary/20 relative shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Slide {carouselIndex + 1} of {result.socialCarousel.slides.length}
                      </span>
                      <span className="text-[11px] text-ink-muted font-mono">1080 x 1080 Square</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-ink mb-2">
                      {result.socialCarousel.slides[carouselIndex].title}
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed font-normal">
                      {result.socialCarousel.slides[carouselIndex].text}
                    </p>
                  </div>
                )}

                {/* Caption & Hashtags */}
                <div className="p-4 rounded-xl bg-canvas border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-ink uppercase">Ready-to-Post Instagram Caption</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(`${result.socialCarousel.caption}\n\n${result.socialCarousel.hashtags.join(' ')}`, 'caption')}
                      className="text-xs font-bold gap-1.5 h-7"
                    >
                      {copiedSection === 'caption' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === 'caption' ? 'Copied' : 'Copy Caption'}</span>
                    </Button>
                  </div>
                  <p className="text-xs text-ink font-normal leading-relaxed whitespace-pre-line mb-3">
                    {result.socialCarousel.caption}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.socialCarousel.hashtags.map((tag) => (
                      <span key={tag} className="text-[11px] font-semibold text-primary-deep bg-cloud-blue px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Cold Outreach */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-canvas border border-border space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Subject Line</span>
                    <div className="text-sm font-bold text-ink mt-0.5">{result.coldOutreach.subject}</div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Message Body</span>
                    <p className="text-xs text-ink font-normal leading-relaxed whitespace-pre-line mt-1">
                      {result.coldOutreach.pitch}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(`Subject: ${result.coldOutreach.subject}\n\n${result.coldOutreach.pitch}`, 'email')}
                    className="text-xs font-bold gap-1.5"
                  >
                    {copiedSection === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'email' ? 'Copied Email' : 'Copy Full Email Draft'}</span>
                  </Button>
                </div>
              </div>
            )}

            {/* 100x Growth CTA Banner (Converts Visitor to Free User) */}
            <div className="mt-6 p-5 rounded-xl bg-ink text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-clay-card">
              <div className="space-y-1">
                <div className="text-xs font-bold text-primary-light uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next Step: Put This Strategy on Autopilot</span>
                </div>
                <div className="text-sm font-bold text-white">
                  Deploy Maya & Marcus to execute this campaign with your 2 Free Agents.
                </div>
                <div className="text-xs text-white/70">
                  Zero credit card required • 100% human approval firewall on every live post.
                </div>
              </div>

              <Link href="/signup" className="shrink-0">
                <Button size="md" className="font-bold gap-2 shadow-clay-button bg-primary text-white hover:bg-primary-deep w-full sm:w-auto">
                  <span>Deploy 2 Free Agents Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
