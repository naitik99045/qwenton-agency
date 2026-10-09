'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { CreditCard, Check, Sparkles, ShieldCheck, Mail, ArrowRight, AlertCircle, Lock } from 'lucide-react';
import { User, PlanId } from '@/lib/db/types';

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [entitlements, setEntitlements] = useState<{ activeAgents: number; maxAgents: number; isAtLimit: boolean } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // OTP & FAM Gateway Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('lite');
  const [modalStep, setModalStep] = useState<'request' | 'verify' | 'payment'>('request');
  const [orderRef, setOrderRef] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEntitlements(data.entitlements);
      }
    } catch (e) {
      console.error('Billing load error:', e);
    }
  };

  useEffect(() => {
    fetchSession();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setNotice(`Payment successful! Your ${urlParams.get('plan') || ''} subscription is now active.`);
    }
  }, []);

  const handleStartUpgrade = (planId: PlanId) => {
    setSelectedPlanId(planId);
    setModalStep('request');
    setError(null);
    setOtpCode('');
    setIsModalOpen(true);
  };

  const handleRequestOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/billing/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlanId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP code');

      setOrderRef(data.orderReference);
      setModalStep('verify');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Verify OTP with Server
      const verifyRes = await fetch('/api/billing/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: orderRef,
          otpCode,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'OTP verification failed');

      // 2. Initiate FAM Gateway Checkout
      const checkoutRes = await fetch('/api/billing/fam/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderReference: orderRef }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutData.error || 'Failed to create payment session');

      if (checkoutData.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'normal',
      name: 'Normal (Free)',
      price: '$0',
      period: 'forever free',
      maxAgents: 2,
      description: 'Ideal for testing autonomous workflows.',
      features: ['2 AI Agents for Free Work', 'LM Studio & Ollama Support', 'Safe Web Research', 'Human Approvals'],
      highlighted: false,
    },
    {
      id: 'lite',
      name: 'Lite Coworker',
      price: '$9',
      period: 'per month',
      maxAgents: 4,
      description: 'For growing individual creators and freelancers.',
      features: ['4 AI Agents', 'Priority LLM Streaming', 'Telegram Bot Chat', '100MB File Knowledge'],
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Pro Coworker',
      price: '$29',
      period: 'per month',
      maxAgents: 9,
      description: 'For teams requiring deep research and routines.',
      features: ['9 AI Agents', 'Gemini & OpenAI Cloud Access', 'Automated Scheduled Routines', '500MB Storage'],
      highlighted: true,
    },
    {
      id: 'ultra',
      name: 'Ultra Business',
      price: '$79',
      period: 'per month',
      maxAgents: 15,
      description: 'Maximum capacity and dedicated enterprise throughput.',
      features: ['15 AI Agents', 'Custom BaseURL & API Keys', 'Multi-channel Slack & Telegram', 'Unlimited Storage & Priority Queue'],
      highlighted: false,
    },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Plan & Subscription Management</h1>
          <p className="text-xs text-ink-muted mt-1">
            Choose your AI agent capacity with secure EmailJS OTP confirmation and FAM Gateway payments.
          </p>
        </div>

        {notice ? (
          <div className="bg-[#E5F4EC] border border-[#C8E8D7] p-4 rounded-card text-xs text-success font-semibold flex items-center gap-2 animate-in fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>{notice}</span>
          </div>
        ) : null}

        {/* Current Plan Overview Card */}
        <div className="clay-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Current Tier</span>
              <Badge variant={user?.planId === 'ultra' ? 'amber' : user?.planId === 'pro' ? 'info' : 'default'}>
                {user?.planId ? user.planId.toUpperCase() : 'NORMAL (FREE)'}
              </Badge>
            </div>
            <h2 className="text-2xl font-extrabold text-ink">
              {entitlements?.activeAgents || 1} of {entitlements?.maxAgents || 2} Agents In Use
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Normal: 2 Agents | Lite: 4 Agents | Pro: 9 Agents | Ultra: 15 Agents
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" className="text-xs py-1 px-3">
              ● Status: Active
            </Badge>
          </div>
        </div>

        {/* 4-Tier Plan Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((p) => {
            const isCurrent = (user?.planId || 'normal') === p.id;
            return (
              <div
                key={p.id}
                className={`clay-surface p-5 flex flex-col justify-between relative ${
                  p.highlighted ? 'border-2 border-primary shadow-clay-card-hover' : ''
                }`}
              >
                {p.highlighted ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                ) : null}

                <div>
                  <h3 className="text-base font-bold text-ink mb-0.5">{p.name}</h3>
                  <p className="text-[11px] text-ink-muted mb-4">{p.description}</p>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-extrabold text-ink">{p.price}</span>
                    <span className="text-xs text-ink-muted">/ {p.period}</span>
                  </div>

                  <div className="text-xs font-bold text-primary mb-4 pb-3 border-b border-border/60">
                    ⚡ {p.maxAgents} AI Agents Allowance
                  </div>

                  <div className="space-y-2 mb-6">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-xs text-ink">
                        <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant={isCurrent ? 'outline' : p.highlighted ? 'primary' : 'secondary'}
                  size="sm"
                  disabled={isCurrent || p.id === 'normal'}
                  onClick={() => handleStartUpgrade(p.id as PlanId)}
                  className="w-full"
                >
                  {isCurrent ? 'Current Plan' : p.id === 'normal' ? 'Free Tier' : `Upgrade to ${p.name.split(' ')[0]}`}
                </Button>
              </div>
            );
          })}
        </div>

        {/* EmailJS OTP & FAM Gateway Payment Modal */}
        <Dialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalStep === 'request' ? 'Confirm Subscription Purchase' : 'Verify One-Time Password'}
          description={
            modalStep === 'request'
              ? `You are upgrading to the ${selectedPlanId.toUpperCase()} Plan (${
                  selectedPlanId === 'ultra' ? '15' : selectedPlanId === 'pro' ? '9' : '4'
                } agents). We will send an OTP confirmation to your email.`
              : `Enter the 6-digit verification code sent to ${user?.email} to proceed to FAM Gateway payment.`
          }
        >
          {error ? (
            <div className="mb-4 bg-[#FDECEC] border border-[#F8D2D2] p-3 rounded-control text-xs text-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {modalStep === 'request' ? (
            <div className="space-y-4 pt-2">
              <div className="bg-[#F8F6F1] p-4 rounded-card border border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Target Plan:</span>
                  <span className="font-bold text-ink uppercase">{selectedPlanId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">New Agent Allowance:</span>
                  <span className="font-bold text-primary">
                    {selectedPlanId === 'ultra' ? '15' : selectedPlanId === 'pro' ? '9' : '4'} Agents
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Amount Due:</span>
                  <span className="font-bold text-ink">
                    {selectedPlanId === 'ultra' ? '$79.00' : selectedPlanId === 'pro' ? '$29.00' : '$9.00'} / mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Payment Gateway:</span>
                  <span className="font-semibold text-ink">FAM Gateway (Encrypted)</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestOtp} isLoading={loading} className="gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Send Confirmation OTP</span>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtpAndPay} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">
                  6-Digit OTP Code (from EmailJS)
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 482913"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center font-mono text-xl tracking-[6px]"
                  required
                />
                <p className="text-[11px] text-ink-muted mt-1.5 text-center">
                  Order Ref: <strong>{orderRef}</strong> (Expires in 10 minutes)
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Resend Code
                </button>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={loading} className="gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Verify & Pay with FAM Gateway</span>
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Dialog>
      </div>
    </AppShell>
  );
}
