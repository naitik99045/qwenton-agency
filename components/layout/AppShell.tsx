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
  Instagram,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { logoutUser, subscribeToAuthState, syncSessionToken, getAuthToken } from '@/lib/auth/firebase-client-auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  badgeText?: string;
  count?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

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

  // Blueprint Section 03 Information Architecture: 6 Organized Functional Groups
  const navigationGroups: NavGroup[] = [
    {
      group: 'Workspace',
      items: [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Build',
      items: [
        {
          label: 'Agent Studio',
          href: '/agents',
          icon: Bot,
          count: entitlements ? `${entitlements.activeAgents}/${entitlements.maxAgents}` : undefined,
        },
        { label: 'Workflow Studio', href: '/swarm', icon: Sparkles, badgeText: 'Mission' },
        { label: 'Conversations', href: '/conversations', icon: MessageSquare },
        { label: 'Instagram Auto DM', href: '/instagram', icon: Instagram, badgeText: 'Reels' },
      ],
    },
    {
      group: 'Connect',
      items: [
        { label: 'Integrations', href: '/integrations', icon: Radio },
      ],
    },
    {
      group: 'Knowledge',
      items: [
        { label: 'Knowledge Hub', href: '/files', icon: FolderLock },
      ],
    },
    {
      group: 'Operate',
      items: [
        { label: 'Approvals', href: '/approvals', icon: ShieldAlert, badgeCount: pendingApprovalsCount },
        { label: 'Runs & Routines', href: '/routines', icon: CalendarClock },
      ],
    },
    {
      group: 'Admin',
      items: [
        ...(user?.role === 'admin'
          ? [{ label: 'Admin Command', href: '/admin', icon: ShieldCheck }]
          : []),
        { label: 'Billing & Usage', href: '/billing', icon: CreditCard },
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-canvas text-ink selection:bg-primary/20 selection:text-plum-dark">
      {/* Mobile Drawer Overlay: Soft plum tint, zero dark shades */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-plum-dark/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Tactile Sidebar (Persistent on Desktop, Slide-out Drawer on Mobile/Android) */}
      <aside
        className={cn(
          'w-64 border-r border-border/70 bg-surface/95 backdrop-blur-md flex flex-col justify-between p-4 shrink-0 shadow-xs z-50 transition-transform duration-clay ease-in-out',
          'fixed inset-y-0 left-0 lg:static lg:translate-x-0 overflow-y-auto',
          mobileMenuOpen ? 'translate-x-0 shadow-clay-card' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div>
          {/* Brand Logo & Tactile Mark */}
          <div className="flex items-center justify-between mb-4 px-2 py-2">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-control bg-primary text-white flex items-center justify-center shadow-clay-button border border-plum-deep/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-base text-ink tracking-tight flex items-center gap-1.5 font-display">
                  qwenton<span className="text-primary font-extrabold">agents</span>
                </div>
                <div className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold font-mono">
                  Autonomous Workforce
                </div>
              </div>
            </Link>

            {/* Mobile Drawer Close Button: 48px touch target */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-control text-ink-muted hover:text-ink lg:hidden hover:bg-sage-light/60 min-h-[48px] min-w-[48px] flex items-center justify-center transition-colors"
              aria-label="Close Navigation Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links: 6 Organized Groups per Blueprint Section 03 */}
          <nav className="space-y-4">
            {navigationGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted/80">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-3.5 py-2.5 rounded-control text-sm font-medium transition-all select-none min-h-[48px]',
                        isActive
                          ? 'bg-sage-light text-sage-dark shadow-clay-button-subtle font-bold border border-sage-border'
                          : 'text-ink-muted hover:text-ink hover:bg-sage-light/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-sage-dark' : 'text-ink-muted')} />
                        <span>{item.label}</span>
                      </div>
                      {item.badgeCount && item.badgeCount > 0 ? (
                        <Badge variant="amber" className="text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center font-bold">
                          {item.badgeCount}
                        </Badge>
                      ) : item.badgeText ? (
                        <Badge variant="info" className="text-[10px] px-1.5 py-0 h-4 flex items-center justify-center font-bold">
                          {item.badgeText}
                        </Badge>
                      ) : item.count ? (
                        <span className="text-[11px] text-ink-light font-semibold font-mono">{item.count}</span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Entitlement Meter & User Info */}
        <div className="space-y-3 pt-4 border-t border-border/70 mt-6">
          {entitlements ? (
            <div className="bg-surface-inset p-3 rounded-control border border-border shadow-xs">
              <div className="flex items-center justify-between text-xs font-medium text-ink mb-1.5">
                <span className="capitalize font-semibold">{entitlements.planName} Plan</span>
                <span className="font-bold text-plum-dark font-mono">
                  {entitlements.activeAgents} / {entitlements.maxAgents}
                </span>
              </div>
              <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-clay rounded-full',
                    entitlements.isAtLimit ? 'bg-sage-deep' : 'bg-primary'
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
                <div className="text-[11px] text-ink-muted truncate font-mono">{user?.email || ''}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-ink-muted hover:text-danger rounded-control hover:bg-plum-light transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header */}
        <header className="h-16 border-b border-border/70 bg-surface/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Drawer Trigger (Android/iOS 48px touch target) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-control text-ink-muted hover:text-ink hover:bg-sage-light/60 lg:hidden min-h-[48px] min-w-[48px] flex items-center justify-center transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <span className="font-medium text-ink hidden sm:inline">Workspace</span>
              <span className="hidden sm:inline">/</span>
              <span className="capitalize font-bold text-ink sm:text-ink-muted font-display">
                {pathname.split('/')[1] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* LLM Status Pill */}
            {llmStatus ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-surface border border-border shadow-clay-button-subtle">
                {llmStatus.ok ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-dark" />
                    <span className="text-ink-muted font-medium font-mono">
                      AI Active ({llmStatus.provider || 'Multi-model'})
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-sage-deep" />
                    <span className="text-ink-muted font-medium font-mono">Local Model</span>
                  </>
                )}
              </div>
            ) : null}

            <Link href="/agents/new">
              <button
                disabled={entitlements?.isAtLimit}
                className="px-3.5 py-2 bg-primary hover:bg-plum-hover text-white text-xs font-bold rounded-control shadow-clay-button active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5 min-h-[40px] sm:min-h-[38px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Agent</span>
                <span className="sm:hidden">New</span>
              </button>
            </Link>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>{children}</div>
          <footer className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted gap-2 pb-16 lg:pb-0">
            <div>
              <span>© {new Date().getFullYear()} Qwenton Inc. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <Link href="/terms" className="hover:text-ink transition-colors hover:underline">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-ink transition-colors hover:underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <span className="font-mono text-[10px] text-ink-light">Warm Ivory • Muted Sage • Dusty Plum</span>
            </div>
          </footer>
        </main>

        {/* Android / Mobile Bottom Tab Bar (48px Touch Targets) */}
        <div className="fixed bottom-0 inset-x-0 h-16 bg-surface/95 backdrop-blur-md border-t border-border flex items-center justify-around px-2 z-30 lg:hidden shadow-clay-card">
          <Link
            href="/dashboard"
            className={cn(
              'flex flex-col items-center justify-center w-16 h-full min-h-[48px] text-[10px] font-medium transition-colors',
              pathname === '/dashboard' ? 'text-primary font-bold' : 'text-ink-muted'
            )}
            aria-label="Overview Home"
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/agents"
            className={cn(
              'flex flex-col items-center justify-center w-16 h-full min-h-[48px] text-[10px] font-medium transition-colors',
              pathname.startsWith('/agents') ? 'text-primary font-bold' : 'text-ink-muted'
            )}
            aria-label="Agents Studio"
          >
            <Bot className="w-4 h-4 mb-0.5" />
            <span>Agents</span>
          </Link>

          <Link
            href="/conversations"
            className={cn(
              'flex flex-col items-center justify-center w-16 h-full min-h-[48px] text-[10px] font-medium transition-colors',
              pathname.startsWith('/conversations') ? 'text-primary font-bold' : 'text-ink-muted'
            )}
            aria-label="Conversations"
          >
            <MessageSquare className="w-4 h-4 mb-0.5" />
            <span>Chat</span>
          </Link>

          <Link
            href="/approvals"
            className={cn(
              'flex flex-col items-center justify-center w-16 h-full min-h-[48px] text-[10px] font-medium transition-colors relative',
              pathname.startsWith('/approvals') ? 'text-primary font-bold' : 'text-ink-muted'
            )}
            aria-label="Approvals Firewall"
          >
            <ShieldAlert className="w-4 h-4 mb-0.5" />
            <span>Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-sage-deep animate-pulse" />
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center w-16 h-full min-h-[48px] text-[10px] font-medium text-ink-muted hover:text-ink transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
