'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PrivacyPolicyPage() {
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
            <Lock className="w-4 h-4 text-primary" />
            <span>Qwenton Privacy & Security</span>
          </div>
        </div>

        <div className="clay-surface p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-ink tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-ink-muted mt-1 font-mono">Last updated: October 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-ink-muted leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-ink">1. Information We Collect</h2>
              <p>
                We collect information necessary to operate your autonomous AI workspace: account credentials (email and display name), integration tokens (securely encrypted at rest in our server vault), and telemetry logs for scheduled agent routines.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-ink">2. Encryption and Token Security</h2>
              <p>
                Your API credentials (Meta Graph API tokens, Telegram bot tokens, OpenAI/Gemini/Groq keys) are never exposed to the client browser in plain text. All secrets are masked and encrypted using industry-standard AES-256 encryption before storage.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-ink">3. How We Process Meta & Instagram Data</h2>
              <p>
                When you connect your Instagram account, Qwenton processes incoming webhook events (comments and direct messages) solely to evaluate your configured trigger keywords and dispatch automated replies. We do not sell your social data or train public foundation models on private direct messages.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-ink">4. Third-Party AI Inference</h2>
              <p>
                Agent tasks are executed via server-side API calls to verified AI model providers (Groq, Google Gemini, OpenAI). Your data is processed in accordance with enterprise data privacy standards with zero training on your workspace data.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-ink">5. Your Rights and Data Deletion</h2>
              <p>
                You retain full ownership of your data and can disconnect any third-party integration or delete your workspace account at any time through the Integrations portal.
              </p>
            </section>
          </div>
        </div>

        <footer className="pt-6 border-t border-border flex items-center justify-between text-xs text-ink-muted">
          <span>© {new Date().getFullYear()} Qwenton Inc.</span>
          <Link href="/terms" className="text-primary hover:underline font-bold">
            Read Terms of Service
          </Link>
        </footer>
      </div>
    </div>
  );
}
