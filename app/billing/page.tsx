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
  const [dynamicPlans, setDynamicPlans] = useState<any[]>([]);

  // Manual UTR & Verification States
  const [manualUtr, setManualUtr] = useState<string>('');
  const [manualRef, setManualRef] = useState<string>('');
  const [isVerifyingUtr, setIsVerifyingUtr] = useState<boolean>(false);
  const [utrSuccessMsg, setUtrSuccessMsg] = useState<string | null>(null);
  const [utrErrorMsg, setUtrErrorMsg] = useState<string | null>(null);

  // OTP & FAM Gateway Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('lite');
  const [modalStep, setModalStep] = useState<'request' | 'verify' | 'payment'>('request');
  const [orderRef, setOrderRef] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchSession = async () => {
    try {
      // 1. Instant check from localStorage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('qwenton_custom_plans');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) setDynamicPlans(parsed);
          } catch {}
        }
      }

      // 2. Check Firestore
      import('firebase/firestore').then(({ getDocs, collection }) => {
        import('@/lib/firebase/config').then(({ firestore }) => {
          if (firestore) {
            getDocs(collection(firestore, 'plans')).then((snap) => {
              if (!snap.empty) {
                const fsPlans = snap.docs.map((d) => d.data());
                setDynamicPlans(fsPlans);
              }
            }).catch(() => {});
          }
        });
      }).catch(() => {});

      const [sessRes, plansRes] = await Promise.all([
        fetch('/api/auth/session'),
        fetch('/api/billing/plans'),
      ]);
      if (sessRes.ok) {
        const data = await sessRes.json();
        setUser(data.user);
        setEntitlements(data.entitlements);
      }
      if (plansRes.ok) {
        const pData = await plansRes.json();
        if (pData.plans && pData.plans.length > 0) {
          setDynamicPlans((prev) => (prev.length > 0 ? prev : pData.plans));
        }
      }
    } catch (e) {
      console.error('Billing load error:', e);
    }
  };

  useEffect(() => {
    fetchSession();
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) setManualRef(ref);

    if (urlParams.get('success') === 'true') {
      setNotice(`Payment successful! Your ${urlParams.get('plan') || ''} subscription is now active.`);
    } else if (urlParams.get('pending') === 'true') {
      setNotice('Payment received by gateway! If your plan has not updated yet, verify below with your UPI UTR.');
    } else if (urlParams.get('error')) {
      const errType = urlParams.get('error');
      if (errType === 'payment_failed') {
        setError('Payment verification is pending from the bank. If you completed the UPI payment, enter your 12-digit UTR below to activate immediately.');
      }
    }
  }, []);

  const handleManualVerifyPayment = async () => {
    setIsVerifyingUtr(true);
    setUtrErrorMsg(null);
    setUtrSuccessMsg(null);
    try {
      const res = await fetch('/api/billing/fam/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: manualRef || orderRef || undefined,
          utr: manualUtr.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification check failed');

      if (data.success) {
        setUtrSuccessMsg(data.message || 'Payment verified! Plan activated.');
        setNotice(`Plan upgraded to ${data.planId?.toUpperCase() || 'new tier'} successfully!`);
        await fetchSession();
      } else {
        setUtrErrorMsg(data.message || 'Verification is still pending from the bank. Please try again in 10 seconds or enter your 12-digit UPI UTR number.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setUtrErrorMsg(msg);
    } finally {
      setIsVerifyingUtr(false);
    }
  };

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

  const basePlans = [
    {
      id: 'normal',
      name: 'Normal (Free)',
      price: 0,
      priceFormatted: '₹0',
      period: 'forever free',
      maxAgents: 2,
      description: 'Ideal for testing autonomous workflows.',
      features: ['2 AI Agents for Free Work', 'LM Studio & Ollama Support', 'Safe Web Research', 'Human Approvals'],
      highlighted: false,
    },
    {
      id: 'lite',
      name: 'Lite Coworker',
      price: 99,
      priceFormatted: '₹99 / mo',
      period: 'per month',
      maxAgents: 4,
      description: 'For growing individual creators and freelancers.',
      features: ['4 AI Agents', 'Priority LLM Streaming', 'Telegram Bot Chat', '100MB File Knowledge'],
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Pro Coworker',
      price: 299,
      priceFormatted: '₹299 / mo',
      period: 'per month',
      maxAgents: 9,
      description: 'For teams requiring deep research and routines.',
      features: ['9 AI Agents', 'Gemini & OpenAI Cloud Access', 'Automated Scheduled Routines', '500MB Storage'],
      highlighted: true,
    },
    {
      id: 'ultra',
      name: 'Ultra Business',
      price: 599,
      priceFormatted: '₹599 / mo',
      period: 'per month',
      maxAgents: 15,
      description: 'Maximum capacity and dedicated enterprise throughput.',
      features: ['15 AI Agents', 'Custom BaseURL & API Keys', 'Multi-channel Slack & Telegram', 'Unlimited Storage & Priority Queue'],
      highlighted: false,
    },
  ];

  const plans = basePlans.map((bp) => {
    const live = dynamicPlans.find((dp) => dp.id === bp.id);
    if (!live) return bp;
    return {
      ...bp,
      name: live.name || bp.name,
      price: live.price !== undefined ? live.price : bp.price,
      priceFormatted:
        live.priceFormatted ||
        (live.price !== undefined
          ? live.price === 0
            ? '₹0'
            : `₹${live.price.toLocaleString('en-IN')} / mo`
          : bp.priceFormatted),
      maxAgents: live.maxAgents || bp.maxAgents,
      description: live.description || bp.description,
      features: live.features && live.features.length > 0 ? live.features : bp.features,
    };
  });

  const selectedPlanObj = plans.find((p) => p.id === selectedPlanId) || plans[1];

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

        {/* UPI / FamGateway Instant Verification Box */}
        <div className="clay-surface p-5 sm:p-6 border-2 border-primary/20 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-primary text-white flex items-center justify-center shadow-clay-button shrink-0 border border-primary-deep/30">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-ink">
                  Paid via UPI / FAM Gateway? Instant Activation
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  If you transferred money and the plan didn&apos;t switch automatically, enter your 12-digit UPI UTR or check order status.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0 self-start sm:self-auto">
              Live Gateway Sync
            </Badge>
          </div>

          {utrSuccessMsg ? (
            <div className="mt-4 p-3.5 bg-[#E5F4EC] border border-[#C8E8D7] rounded-control text-xs text-success font-bold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{utrSuccessMsg}</span>
            </div>
          ) : null}

          {utrErrorMsg ? (
            <div className="mt-4 p-3.5 bg-[#FDECEC] border border-[#F8D2D2] rounded-control text-xs text-danger font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{utrErrorMsg}</span>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4">
            <div className="sm:col-span-4">
              <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-1">
                Order Reference (optional)
              </label>
              <Input
                placeholder="e.g. QW-2026-XXXXX"
                value={manualRef}
                onChange={(e) => setManualRef(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="sm:col-span-5">
              <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-1">
                12-Digit UPI UTR / Transaction No.
              </label>
              <Input
                placeholder="e.g. 420987654321 (from PhonePe / GPay / Paytm)"
                value={manualUtr}
                onChange={(e) => setManualUtr(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
            <div className="sm:col-span-3 flex items-end">
              <Button
                size="md"
                className="w-full text-xs font-bold shadow-clay-button"
                onClick={handleManualVerifyPayment}
                disabled={isVerifyingUtr}
              >
                {isVerifyingUtr ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </span>
                ) : (
                  <span>Verify & Activate</span>
                )}
              </Button>
            </div>
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
                    <span className="text-2xl font-extrabold text-ink">
                      {typeof p.priceFormatted === 'string' && p.priceFormatted.length > 0
                        ? p.priceFormatted.split(' ')[0]
                        : `₹${p.price.toLocaleString('en-IN')}`}
                    </span>
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
              ? `You are upgrading to the ${selectedPlanId.toUpperCase()} Plan (${selectedPlanObj.maxAgents} agents). We will send an OTP confirmation to your email.`
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
                  <span className="font-bold text-ink uppercase">{selectedPlanObj.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">New Agent Allowance:</span>
                  <span className="font-bold text-primary">
                    {selectedPlanObj.maxAgents} Agents
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Amount Due:</span>
                  <span className="font-bold text-ink">
                    ₹{selectedPlanObj.price.toLocaleString('en-IN')} / mo
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
