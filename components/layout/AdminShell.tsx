'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Bot,
  DollarSign,
  ShoppingCart,
  Server,
  Terminal,
  ExternalLink,
  RefreshCw,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  ArrowLeft,
  HardDrive,
  Menu,
  X,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { logoutUser, subscribeToAuthState, syncSessionToken } from '@/lib/auth/firebase-client-auth';

interface AdminShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminShell({
  children,
  activeTab,
  onTabChange,
  onRefresh,
  isRefreshing = false,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ displayName: string; email: string; role: string; planId: string } | null>(null);
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false);
  const [systemState, setSystemState] = useState<{ llmOk: boolean; firestoreOk: boolean; famOk: boolean }>({
    llmOk: true,
    firestoreOk: true,
    famOk: true,
  });

  useEffect(() => {
    const fetchAdminSession = async () => {
      try {
        const [sessionRes, sysRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/admin/system'),
        ]);

        if (sessionRes.ok) {
          const data = await sessionRes.json();
          if (data.user) {
            setAdminUser(data.user);
          }
        }

        if (sysRes.ok) {
          const sysData = await sysRes.json();
          setSystemState({
            llmOk: sysData.services?.llm?.status === 'connected',
            firestoreOk: sysData.services?.firestore?.configured,
            famOk: sysData.services?.famgateway?.configured,
          });
        }
      } catch (e) {
        console.warn('Admin telemetry fetch error:', e);
      }
    };

    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (fbUser) {
        const token = await fbUser.getIdToken();
        await syncSessionToken(token, fbUser.uid, fbUser.email || '', fbUser.displayName || undefined);
        await fetchAdminSession();
      } else {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setAdminUser(data.user);
            return;
          }
        }
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  const navTabs = [
    { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'agents', label: 'Global Agents Explorer', icon: Bot },
    { id: 'pricing', label: 'Subscription Plans & Pricing', icon: DollarSign },
    { id: 'orders', label: 'Orders & FAM Gateway', icon: ShoppingCart },
    { id: 'system', label: 'Cloud & AI Health', icon: Server },
    { id: 'audits', label: 'Security Audit Stream', icon: Terminal },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F2EB] text-[#1E293B]">
      {/* Mobile Backdrop Overlay */}
      {mobileAdminOpen && (
        <div
          onClick={() => setMobileAdminOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Dedicated Executive Admin Sidebar */}
      <aside
        className={cn(
          'w-68 border-r border-[#E2DECE] bg-[#1E1B2E] text-white flex flex-col justify-between p-4 shrink-0 shadow-xl z-50 transition-transform duration-300 ease-in-out',
          'fixed inset-y-0 left-0 lg:static lg:translate-x-0',
          mobileAdminOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div>
          {/* Executive Brand Mark */}
          <div className="flex items-center justify-between px-2 py-3 mb-6 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-[#523E8C] text-white flex items-center justify-center shadow-lg ring-2 ring-white/20 border border-[#7C5CFC]/40">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
                  qwenton<span className="text-[#A78BFA] font-black">admin</span>
                </div>
                <div className="text-[10px] text-[#C4B5FD] uppercase tracking-wider font-bold">
                  Executive Control Tower
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileAdminOpen(false)}
              className="p-1.5 text-white/60 hover:text-white rounded-control lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Navigation Menu */}
          <div className="px-3 text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">
            System Administration
          </div>
          <nav className="space-y-1.5">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileAdminOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-control text-xs font-semibold transition-all text-left select-none',
                    isActive
                      ? 'bg-[#7C5CFC] text-white shadow-md font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-[#A78BFA]')} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Workspace Quick-Switch Section */}
          <div className="mt-8 pt-5 border-t border-white/10">
            <div className="px-3 text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">
              Workspace Bridge
            </div>
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-control text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all border border-white/10"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-[#A78BFA]" />
                <span>Open User Dashboard</span>
              </div>
              <span className="text-[10px] text-white/50">/dashboard</span>
            </Link>
          </div>
        </div>

        {/* Bottom Profile & Admin Details */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="bg-white/5 p-3 rounded-control border border-white/10">
            <div className="flex items-center justify-between text-[11px] font-bold text-white/90 mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Root Authority
              </span>
              <span className="text-[#A78BFA] uppercase text-[10px]">Active</span>
            </div>
            <div className="text-[11px] text-white/60 truncate font-mono">
              {adminUser?.email || 'netiktalreja@gmail.com'}
            </div>
          </div>

          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name={adminUser?.displayName || 'Admin'} size="sm" variant="user" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {adminUser?.displayName || 'Administrator'}
                </div>
                <div className="text-[10px] text-[#C4B5FD] font-semibold">Owner Role</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-white/60 hover:text-rose-400 rounded-control hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F4F2EB]">
        {/* Executive Top Header */}
        <header className="h-16 border-b border-[#E2DECE] bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileAdminOpen(true)}
              className="p-2 rounded-control text-ink-muted hover:text-ink hover:bg-black/5 lg:hidden"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5 text-ink" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold text-[#1E1B2E] uppercase tracking-wider hidden sm:inline">Admin Portal</span>
              <span className="text-ink-muted hidden sm:inline">/</span>
              <span className="capitalize font-bold text-primary">
                {navTabs.find((t) => t.id === activeTab)?.label || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live System Diagnostics Badges */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-[#E2DECE] shadow-xs">
                <span className={cn('w-2 h-2 rounded-full', systemState.firestoreOk ? 'bg-emerald-500' : 'bg-amber-500')} />
                <span className="text-ink-muted">Firestore</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-[#E2DECE] shadow-xs">
                <span className={cn('w-2 h-2 rounded-full', systemState.famOk ? 'bg-emerald-500' : 'bg-amber-500')} />
                <span className="text-ink-muted">FamGateway</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-[#E2DECE] shadow-xs">
                <span className={cn('w-2 h-2 rounded-full', systemState.llmOk ? 'bg-emerald-500' : 'bg-rose-500')} />
                <span className="text-ink-muted">AI LLM</span>
              </div>
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 bg-white border border-[#E2DECE] hover:bg-[#F8F6F1] text-ink text-xs font-semibold rounded-control shadow-xs transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={cn('w-3.5 h-3.5 text-primary', isRefreshing && 'animate-spin')} />
                <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            )}

            <Link href="/dashboard">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 bg-[#1E1B2E] text-white text-xs font-bold rounded-control hover:bg-[#2B2742] transition-all shadow-sm">
                <ExternalLink className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span className="hidden sm:inline">User Workspace</span>
                <span className="sm:hidden">App</span>
              </button>
            </Link>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
