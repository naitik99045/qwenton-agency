'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  ShieldAlert,
  FolderLock,
  CalendarClock,
  Radio,
  CreditCard,
  Settings,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { logoutUser, subscribeToAuthState, syncSessionToken, getAuthToken } from '@/lib/auth/firebase-client-auth';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ displayName: string; email: string; role: string; planId: string } | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('qwenton_cached_user');
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });
  const [entitlements, setEntitlements] = useState<{ activeAgents: number; maxAgents: number; isAtLimit: boolean; planName: string } | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('qwenton_cached_entitlements');
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [llmStatus, setLlmStatus] = useState<{ ok: boolean; message: string; provider?: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const fetchSessionAndTelemetry = async (tokenOverride?: string) => {
    try {
      const token = tokenOverride || (await getAuthToken());
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const [sessionRes, healthRes, approvalsRes] = await Promise.all([
        fetch('/api/auth/session', { headers }),
        fetch('/api/health'),
        fetch('/api/approvals', { headers }),
      ]);

      if (sessionRes.ok) {
        const data = await sessionRes.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('qwenton_cached_user', JSON.stringify(data.user));
        }
        if (data.entitlements) {
          setEntitlements(data.entitlements);
          localStorage.setItem('qwenton_cached_entitlements', JSON.stringify(data.entitlements));
        }
      }

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setLlmStatus(healthData.services?.llm);
      }
      if (approvalsRes.ok) {
        const apprData = await approvalsRes.json();
        const pending = (apprData.approvals || []).filter((a: { status: string }) => a.status === 'pending');
        setPendingApprovalsCount(pending.length);
      }
    } catch (e) {
      console.warn('Telemetry fetch error:', e);
    }
  };

  useEffect(() => {
    const handleAgentsChanged = () => {
      fetchSessionAndTelemetry();
    };
    window.addEventListener('qwenton-agents-changed', handleAgentsChanged);

    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (fbUser) {
        const token = await fbUser.getIdToken();
        await syncSessionToken(token, fbUser.uid, fbUser.email || '', fbUser.displayName || undefined);
        await fetchSessionAndTelemetry(token);
      } else {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setEntitlements(data.entitlements);
            return;
          }
        }
        router.push('/login');
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener('qwenton-agents-changed', handleAgentsChanged);
    };
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Agents', href: '/agents', icon: Bot, count: entitlements ? `${entitlements.activeAgents}/${entitlements.maxAgents}` : undefined },
    { label: 'Conversations', href: '/conversations', icon: MessageSquare },
    { label: 'Approvals', href: '/approvals', icon: ShieldAlert, badgeCount: pendingApprovalsCount },
    { label: 'Knowledge Base', href: '/files', icon: FolderLock },
    { label: 'Routines', href: '/routines', icon: CalendarClock },
    { label: 'Integrations', href: '/integrations', icon: Radio },
    { label: 'Billing & Plans', href: '/billing', icon: CreditCard },
    { label: 'AI Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-canvas text-ink selection:bg-cloud-blue selection:text-primary-deep">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Tactile Sidebar (Persistent on Desktop, Slide-out Drawer on Mobile/Android) */}
      <aside
        className={cn(
          'w-64 border-r border-border/70 bg-white/95 backdrop-blur-md flex flex-col justify-between p-4 shrink-0 shadow-xs z-50 transition-transform duration-300 ease-in-out',
          'fixed inset-y-0 left-0 lg:static lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div>
          {/* Brand Logo & Tactile Mark */}
          <div className="flex items-center justify-between mb-6 px-2 py-2">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-[12px] bg-primary text-white flex items-center justify-center shadow-clay-button border border-primary-deep/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-base text-ink tracking-tight flex items-center gap-1.5">
                  qwenton<span className="text-primary font-extrabold">agents</span>
                </div>
                <div className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold">AI Coworker Space</div>
              </div>
            </Link>

            {/* Mobile Drawer Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-control text-ink-muted hover:text-ink lg:hidden hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-control text-sm font-medium transition-all select-none',
                    isActive
                      ? 'bg-cloud-blue text-primary-deep shadow-clay-button-subtle font-semibold border border-[#D0DFEF]'
                      : 'text-ink-muted hover:text-ink hover:bg-black/5'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-ink-muted')} />
                    <span>{item.label}</span>
                  </div>
                  {item.badgeCount && item.badgeCount > 0 ? (
                    <Badge variant="amber" className="text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center font-bold">
                      {item.badgeCount}
                    </Badge>
                  ) : item.count ? (
                    <span className="text-[11px] text-ink-light font-semibold">{item.count}</span>
                  ) : null}
                </Link>
              );
            })}

            {/* Admin navigation if admin */}
            {user?.role === 'admin' ? (
              <div className="pt-4 mt-4 border-t border-border/50">
                <div className="px-3 text-[10px] font-bold text-ink-light uppercase tracking-wider mb-2">Administrator</div>
                <Link
                  href="/admin"
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-control text-sm font-medium transition-all select-none',
                    pathname.startsWith('/admin')
                      ? 'bg-[#EAE7F5] text-[#523E8C] shadow-clay-button-subtle font-semibold border border-[#CEC5EB]'
                      : 'text-ink-muted hover:text-ink hover:bg-black/5'
                  )}
                >
                  <ShieldCheck className="w-4 h-4 text-[#523E8C]" />
                  <span>Admin Command Panel</span>
                </Link>
              </div>
            ) : null}
          </nav>
        </div>

        {/* Bottom Entitlement Meter & User Info */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          {entitlements ? (
            <div className="bg-[#F8F6F1] p-3 rounded-control border border-border shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium text-ink mb-1.5">
                <span className="capitalize">{entitlements.planName}</span>
                <span className="font-bold text-primary-deep">
                  {entitlements.activeAgents} / {entitlements.maxAgents}
                </span>
              </div>
              <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300 rounded-full',
                    entitlements.isAtLimit ? 'bg-amber-approval' : 'bg-primary'
                  )}
                  style={{ width: `${Math.min(100, (entitlements.activeAgents / entitlements.maxAgents) * 100)}%` }}
                />
              </div>
            </div>
          ) : null}

          {/* User Profile & Logout */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name={user?.displayName || 'User'} size="md" variant="user" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink truncate">{user?.displayName || user?.email?.split('@')[0] || 'User'}</div>
                <div className="text-[11px] text-ink-muted truncate">{user?.email || ''}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-ink-muted hover:text-danger rounded-control hover:bg-black/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header */}
        <header className="h-16 border-b border-border/70 bg-white/70 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Drawer Trigger (Android/iOS) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-control text-ink-muted hover:text-ink hover:bg-black/5 lg:hidden"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <span className="font-medium text-ink hidden sm:inline">Workspace</span>
              <span className="hidden sm:inline">/</span>
              <span className="capitalize font-bold text-ink sm:text-ink-muted">
                {pathname.split('/')[1] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* LLM Status Pill */}
            {llmStatus ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-white border border-border shadow-clay-button-subtle">
                {llmStatus.ok ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span className="text-ink-muted font-medium">
                      AI Active ({llmStatus.provider || 'Multi-model'})
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-approval" />
                    <span className="text-ink-muted font-medium">Local Model</span>
                  </>
                )}
              </div>
            ) : null}

            <Link href="/agents/new">
              <button
                disabled={entitlements?.isAtLimit}
                className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 bg-gradient-to-b from-primary to-primary-deep text-white text-xs font-semibold rounded-[12px] shadow-clay-button hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 sm:hidden" />
                <span className="hidden sm:inline">+ New Agent</span>
                <span className="sm:hidden">New</span>
              </button>
            </Link>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>

        {/* Android / Mobile Bottom Tab Bar */}
        <div className="fixed bottom-0 inset-x-0 h-14 bg-white/95 backdrop-blur-md border-t border-border/80 flex items-center justify-around px-2 z-30 lg:hidden shadow-lg">
          <Link
            href="/dashboard"
            className={cn(
              'flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition-colors',
              pathname === '/dashboard' ? 'text-primary font-bold' : 'text-ink-muted'
            )}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/agents"
            className={cn(
              'flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition-colors',
              pathname.startsWith('/agents') ? 'text-primary font-bold' : 'text-ink-muted'
            )}
          >
            <Bot className="w-4 h-4 mb-0.5" />
            <span>Agents</span>
          </Link>

          <Link
            href="/conversations"
            className={cn(
              'flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition-colors',
              pathname.startsWith('/conversations') ? 'text-primary font-bold' : 'text-ink-muted'
            )}
          >
            <MessageSquare className="w-4 h-4 mb-0.5" />
            <span>Chat</span>
          </Link>

          <Link
            href="/approvals"
            className={cn(
              'flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition-colors relative',
              pathname.startsWith('/approvals') ? 'text-primary font-bold' : 'text-ink-muted'
            )}
          >
            <ShieldAlert className="w-4 h-4 mb-0.5" />
            <span>Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="absolute top-1.5 right-2.5 w-2 h-2 rounded-full bg-amber-approval animate-pulse" />
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium text-ink-muted hover:text-ink transition-colors"
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
