'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Workspace</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-ink">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Qwenton Legal Framework</span>
          </div>
        </div>

        <div className="clay-surface p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-ink tracking-tight">Terms of Service</h1>
            <p className="text-xs text-ink-muted mt-1 font-mono">Last updated: October 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-ink-muted leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-ink">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Qwenton Agents, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-ink">2. Human-in-the-Loop Operations</h2>
              <p>
                Qwenton provides AI coworkers that operate under your explicit delegation. High-impact mutating operations—including publishing media to Meta/Instagram, running ads, sending client emails, or executing code—require human verification through your approval inbox or connected Telegram gateway.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-ink">3. Meta & Third-Party Platform Policies</h2>
              <p>
                When using Instagram Reels automation and direct message auto-replies, you agree to comply with Meta Platform Terms, Developer Policies, and Instagram Community Guidelines. Qwenton enforces built-in rate limits and anti-ban jitter to protect your accounts, but you remain responsible for the content you dispatch.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-ink">4. Tier Quotas and Subscriptions</h2>
              <p>
                Usage quotas—including the number of active AI agents, connected Reels, and monthly automated interactions—are determined by your selected plan. Quotas reset on each billing cycle.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-ink">5. Limitation of Liability</h2>
              <p>
                Qwenton provides services on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. Qwenton will not be liable for any indirect, incidental, or consequential damages resulting from AI-generated outputs or platform outages.
              </p>
            </section>
          </div>
        </div>

        <footer className="pt-6 border-t border-border flex items-center justify-between text-xs text-ink-muted">
          <span>© {new Date().getFullYear()} Qwenton Inc.</span>
          <Link href="/privacy" className="text-primary hover:underline font-bold">
            Read Privacy Policy
          </Link>
        </footer>
      </div>
    </div>
  );
}
