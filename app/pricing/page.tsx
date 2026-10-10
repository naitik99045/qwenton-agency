'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
  const [dynamicPlans, setDynamicPlans] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/billing/plans')
      .then((res) => res.json())
      .then((data) => {
        if (data.plans) setDynamicPlans(data.plans);
      })
      .catch((e) => console.error('Error fetching plans:', e));
  }, []);

  const basePlans = [
    {
      id: 'normal',
      name: 'Normal (Free)',
      price: '₹0',
      period: 'forever free',
      description: 'Ideal for solo testing and exploring AI agent tools.',
      maxAgents: '2 Agents for Free Work',
      features: [
        '2 AI Agents for Free Work',
        'Local LM Studio & Ollama Support',
        'Safe Web Research Tool',
        'Human Approval Inbox',
        '1 Connected Telegram Bot',
        '25MB Knowledge Base Storage',
      ],
      highlighted: false,
      cta: 'Start Free',
      href: '/signup',
    },
    {
      id: 'lite',
      name: 'Lite Coworker',
      price: '₹499',
      period: 'per month',
      description: 'For growing individual creators and freelancers.',
      maxAgents: '4 Active AI Agents',
      features: [
        '4 Active AI Agents',
        'Priority LLM Streaming',
        'Telegram Bot Multi-Chat',
        '100MB Document Knowledge',
        'EmailJS OTP Verified Billing',
        'Standard Email Support',
      ],
      highlighted: false,
      cta: 'Upgrade to Lite',
      href: '/billing',
    },
    {
      id: 'pro',
      name: 'Pro Coworker',
      price: '₹1,499',
      period: 'per month',
      description: 'For teams requiring priority LLM streaming and automation routines.',
      maxAgents: '9 Active AI Agents',
      features: [
        '9 Active AI Agents',
        'Google Gemini & OpenAI Cloud Access',
        'Automated Scheduled Routines',
        '500MB Document Extraction',
        'FAM Gateway Checkout',
        'Priority Audit Logging & Export',
      ],
      highlighted: true,
      cta: 'Upgrade to Pro',
      href: '/billing',
    },
    {
      id: 'ultra',
      name: 'Ultra Business',
      price: '₹3,999',
      period: 'per month',
      description: 'Maximum capacity and dedicated enterprise throughput.',
      maxAgents: '15 Active AI Agents',
      features: [
        '15 Dedicated AI Agents',
        'Custom BaseURL & Key Override',
        'Multi-channel Slack & Telegram',
        '2GB Knowledge Base Storage',
        'Automated Executive Briefings',
        '24/7 Dedicated Support',
      ],
      highlighted: false,
      cta: 'Upgrade to Ultra',
      href: '/billing',
    },
  ];

  const plans = basePlans.map((bp) => {
    const live = dynamicPlans.find((dp) => dp.id === bp.id);
    if (!live) return bp;
    return {
      ...bp,
      name: live.name || bp.name,
      price:
        live.priceFormatted ||
        (live.price !== undefined
          ? live.price === 0
            ? '₹0'
            : `₹${live.price.toLocaleString('en-IN')}`
          : bp.price),
      maxAgents: live.maxAgents ? `${live.maxAgents} Active AI Agents` : bp.maxAgents,
      description: live.description || bp.description,
      features: live.features && live.features.length > 0 ? live.features : bp.features,
    };
  });

  return (
    <div className="min-h-screen bg-canvas py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight mb-4">
            Transparent, Honest Pricing
          </h1>
          <p className="text-base text-ink-muted max-w-2xl mx-auto">
            Scale your autonomous workforce with our clear 4-tier agent limits: Normal (2), Lite (4), Pro (9), and Ultra (15).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`clay-surface p-6 relative flex flex-col justify-between ${
                p.highlighted ? 'border-2 border-primary shadow-clay-card-hover' : ''
              }`}
            >
              {p.highlighted ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Recommended
                </div>
              ) : null}

              <div>
                <h3 className="text-lg font-bold text-ink mb-1">{p.name}</h3>
                <p className="text-xs text-ink-muted mb-4">{p.description}</p>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-extrabold text-ink">{p.price}</span>
                  <span className="text-xs text-ink-muted">/ {p.period}</span>
                </div>

                <div className="text-xs font-bold text-primary mb-4 pb-3 border-b border-border/60">
                  ⚡ {p.maxAgents}
                </div>

                <div className="space-y-2.5 mb-8">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-xs text-ink">
                      <div className="w-4 h-4 rounded-full bg-cloud-blue text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href={p.href}>
                <Button className="w-full" variant={p.highlighted ? 'primary' : 'outline'}>
                  {p.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
