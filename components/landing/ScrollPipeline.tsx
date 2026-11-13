'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Radio,
  CheckCircle2,
  Zap,
  ArrowRight,
  Instagram,
  Terminal,
  Cpu,
  Lock,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function ScrollPipeline() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const stages = [
    {
      id: '01',
      title: 'Real-Time Ingestion & Anti-Spam Jitter',
      tag: 'STAGE 01 • INBOUND LISTENER',
      subtitle: 'Meta Webhook capture with HMAC-SHA256 signature verification',
      description:
        'When a user comments on any connected Reel, the inbound payload hits our serverless Route Handler in under 40ms. Our engine applies randomized delay jitter (3–7 seconds) and dynamically rotates spintax patterns, preventing automated trigger detection.',
      telemetry: {
        endpoint: 'POST /api/instagram/webhook',
        latency: '38ms',
        security: 'HMAC-SHA256 Verified',
        jitter: '4.8s delay active',
      },
      codeSnippet: `// Meta Webhook Verification & Jitter Defense
const signature = req.headers.get('x-hub-signature-256');
const isValid = verifyMetaSignature(payload, signature, APP_SECRET);
if (!isValid) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });

// Apply anti-ban humanized delay
await applyRandomizedJitter(3200, 6800);`,
    },
    {
      id: '02',
      title: 'Neural Triage & Human Approval Firewall',
      tag: 'STAGE 02 • SECURITY FIREWALL',
      subtitle: 'Multi-model consensus with zero unsupervised mutations',
      description:
        'The agent parses the follower intent and prepares public and private responses. If the action involves client communication, ad spend, or database updates, the execution automatically suspends at a Human-in-the-Loop firewall checkpoint. A push notification is dispatched instantly to your mobile Telegram bot.',
      telemetry: {
        endpoint: 'HOLD: /api/approvals/{id}',
        latency: '110ms',
        security: 'Air-Gapped Mutating Firewall',
        jitter: '1-Tap Push Notification Sent',
      },
      codeSnippet: `// Intercept external mutation
const approval = await createApprovalGate({
  action: 'INSTAGRAM_PRIVATE_REPLY',
  recipient: '@prospective_client',
  proposedMessage: 'Here is your growth blueprint link: ...',
  requiresHumanReview: true,
});
await notifyTelegramOperator(approval);`,
    },
    {
      id: '03',
      title: 'Meta Graph API v20.0 Private Reply Dispatch',
      tag: 'STAGE 03 • CONVERSION DISPATCH',
      subtitle: 'Instant 1-to-1 lead delivery without follower message prerequisites',
      description:
        'Upon operator authorization (or automated rule match), Qwenton calls Meta’s official Private Replies endpoint. The follower receives an immediate, personalized direct message directly into their primary inbox, converting engagement into revenue on autopilot.',
      telemetry: {
        endpoint: 'POST /{comment_id}/private_replies',
        latency: '340ms',
        security: 'OAuth 2.0 Token Bearer',
        jitter: 'Delivered to Primary Inbox',
      },
      codeSnippet: `// Official Meta Graph API v20.0 Private Reply
const response = await fetch(
  \`https://graph.facebook.com/v20.0/\${commentId}/private_replies\`,
  {
    method: 'POST',
    headers: { Authorization: \`Bearer \${PAGE_ACCESS_TOKEN}\` },
    body: JSON.stringify({ message: generatedPrivateDm }),
  }
);
return response.json(); // { id: 'm_mid.$...', recipient_id: '...' }`,
    },
  ];

  // Scroll detection to update active stage smoothly
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if container is in view
      if (rect.top < viewportHeight * 0.7 && rect.bottom > 0) {
        const totalHeight = rect.height;
        const currentProgress = Math.min(1, Math.max(0, (viewportHeight * 0.7 - rect.top) / totalHeight));

        if (currentProgress < 0.35) {
          setActiveStage(0);
        } else if (currentProgress < 0.7) {
          setActiveStage(1);
        } else {
          setActiveStage(2);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const current = stages[activeStage];

  return (
    <section ref={containerRef} className="max-w-6xl mx-auto px-6 py-20 w-full border-t border-border">
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-canvas text-ink font-mono text-xs font-bold mb-3 border border-border">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span>SCROLL-LINKED EXECUTION LIFECYCLE</span>
        </div>
        <h2 className="font-fluid-section font-black text-ink tracking-tight mb-3">
          Inside the Autonomous Execution Pipeline
        </h2>
        <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
          Follow the deterministic 3-stage lifecycle of every lead event, from the moment a follower types a keyword on your Reel to final direct message conversion.
        </p>
      </div>

      {/* Stage Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 font-mono">
        {stages.map((stage, idx) => {
          const isActive = activeStage === idx;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(idx)}
              className={`text-left p-4 rounded-card border transition-all ${
                isActive
                  ? 'bg-surface border-primary text-ink shadow-clay-card'
                  : 'bg-canvas border-border text-ink-muted hover:text-ink hover:border-border-strong'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className={`font-bold ${isActive ? 'text-primary' : 'text-ink-muted'}`}>
                  STAGE {stage.id}
                </span>
                {isActive && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
              </div>
              <div className="text-xs font-bold font-sans line-clamp-1">{stage.title}</div>
            </button>
          );
        })}
      </div>

      {/* Main Stage Display Card */}
      <div className="clay-surface bg-surface border border-border p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start shadow-clay-card">
        {/* Left Column: Stage Explanation & Telemetry */}
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2">
            <Badge variant="outline" className="font-mono text-[10px] font-bold">
              {current.tag}
            </Badge>
            <h3 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs font-mono text-primary font-semibold">{current.subtitle}</p>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{current.description}</p>

          {/* Telemetry Metrics Box */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-2">
            <div className="p-3 bg-canvas rounded-md border border-border">
              <span className="text-[10px] text-ink-muted block uppercase">ENDPOINT</span>
              <strong className="text-ink text-[11px] truncate block">{current.telemetry.endpoint}</strong>
            </div>
            <div className="p-3 bg-canvas rounded-md border border-border">
              <span className="text-[10px] text-ink-muted block uppercase">LATENCY</span>
              <strong className="text-success text-[11px] block">{current.telemetry.latency}</strong>
            </div>
            <div className="p-3 bg-canvas rounded-md border border-border">
              <span className="text-[10px] text-ink-muted block uppercase">SECURITY</span>
              <strong className="text-ink text-[11px] block">{current.telemetry.security}</strong>
            </div>
            <div className="p-3 bg-canvas rounded-md border border-border">
              <span className="text-[10px] text-ink-muted block uppercase">DEFENSE STATE</span>
              <strong className="text-primary text-[11px] block">{current.telemetry.jitter}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Code & Verification Trace */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-card bg-canvas border border-border font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-[11px] text-ink-muted border-b border-border pb-2">
              <span className="flex items-center gap-1.5 font-bold text-ink">
                <Terminal className="w-3.5 h-3.5 text-primary" /> deterministic_runtime.ts
              </span>
              <span className="text-[10px] text-success font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            </div>

            <pre className="p-3 rounded-md bg-surface text-ink text-[11px] overflow-x-auto border border-border leading-relaxed">
              <code>{current.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
