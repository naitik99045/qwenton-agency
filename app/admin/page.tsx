'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Users, Bot, Activity, ShoppingCart, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { User, AuditEvent, Order } from '@/lib/db/types';
import { formatDate } from '@/lib/utils';

import NotFound from '@/app/not-found';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<{
    totalUsers: number;
    totalActiveAgents: number;
    activePlansCount: number;
    llmConnected: boolean;
    llmModel: string;
  } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [audits, setAudits] = useState<AuditEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [overviewRes, usersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/users'),
        fetch('/api/admin/orders'),
      ]);

      if (overviewRes.status === 403 || usersRes.status === 403 || overviewRes.status === 404 || usersRes.status === 404) {
        setIsUnauthorized(true);
        setLoading(false);
        return;
      }

      if (overviewRes.ok) {
        const oData = await overviewRes.json();
        setMetrics(oData.metrics);
        setAudits(oData.recentAudits || []);
      }
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData.users || []);
      }
      if (ordersRes.ok) {
        const ordData = await ordersRes.json();
        setOrders(ordData.orders || []);
      }
    } catch (e) {
      console.error('Admin data fetch error:', e);
      setIsUnauthorized(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleSuspend = async (uid: string, currentStatus: string) => {
    const action = currentStatus === 'suspended' ? 'reactivate' : 'suspend';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${uid}/${action}`, { method: 'POST' });
      if (res.ok) fetchAdminData();
    } catch (e) {
      console.error('Suspend error:', e);
    }
  };

  const handleManualActivateOrder = async (orderId: string) => {
    if (!confirm('Mark this order as Paid and activate user subscription?')) return;
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'paid', activatePlan: true }),
      });
      if (res.ok) fetchAdminData();
    } catch (e) {
      console.error('Activate order error:', e);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isUnauthorized) {
    return <NotFound />;
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-ink">System Administration</h1>
              <Badge variant="info">Admin Access Verified</Badge>
            </div>
            <p className="text-xs text-ink-muted mt-1">
              Platform-wide telemetry, user entitlements, FAM Gateway orders, and security audit streams.
            </p>
          </div>

          <Button size="sm" variant="outline" onClick={fetchAdminData} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </Button>
        </div>

        {/* 4 Admin Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="clay-surface p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink-muted uppercase">Total Users</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-extrabold text-ink">{metrics?.totalUsers || users.length}</div>
            <p className="text-[11px] text-ink-muted mt-1">Registered tenant accounts</p>
          </div>

          <div className="clay-surface p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink-muted uppercase">Active Agents</span>
              <Bot className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-extrabold text-ink">{metrics?.totalActiveAgents || 1}</div>
            <p className="text-[11px] text-ink-muted mt-1">Normal:2, Lite:4, Pro:9, Ultra:15</p>
          </div>

          <div className="clay-surface p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink-muted uppercase">Total Orders</span>
              <ShoppingCart className="w-4 h-4 text-[#523E8C]" />
            </div>
            <div className="text-2xl font-extrabold text-ink">{orders.length}</div>
            <p className="text-[11px] text-ink-muted mt-1">FAM Gateway & OTP purchases</p>
          </div>

          <div className="clay-surface p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink-muted uppercase">LLM Server</span>
              <Activity className="w-4 h-4 text-primary-deep" />
            </div>
            <div className="text-base font-bold text-ink truncate">{metrics?.llmModel || 'Multi-model'}</div>
            <p className="text-[11px] text-success font-semibold mt-1">Streaming Active</p>
          </div>
        </div>

        {/* Orders & Purchases Management Table */}
        <div className="clay-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink">FAM Gateway & Subscription Orders</h2>
              <p className="text-xs text-ink-muted">View purchase references, EmailJS OTP verification, and payment status</p>
            </div>
            <Badge variant="amber">{orders.length} Total Orders</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink">
              <thead>
                <tr className="border-b border-border/80 text-ink-muted uppercase font-bold text-[10px]">
                  <th className="pb-3 px-2">Order Reference</th>
                  <th className="pb-3 px-2">User / Email</th>
                  <th className="pb-3 px-2">Plan</th>
                  <th className="pb-3 px-2">Amount</th>
                  <th className="pb-3 px-2">OTP / Status</th>
                  <th className="pb-3 px-2">Requested At</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-ink-muted">
                      No purchase orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-black/[0.02]">
                      <td className="py-3 px-2 font-mono font-bold text-primary">
                        {ord.orderReference}
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-bold">{ord.userName}</div>
                        <div className="text-ink-muted text-[11px]">{ord.userEmail}</div>
                      </td>
                      <td className="py-3 px-2 font-semibold uppercase">{ord.planId}</td>
                      <td className="py-3 px-2 font-bold">${ord.amount}</td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={
                            ord.status === 'paid'
                              ? 'success'
                              : ord.status === 'otp_verified'
                              ? 'amber'
                              : 'outline'
                          }
                        >
                          ● {ord.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-ink-muted">{formatDate(ord.createdAt)}</td>
                      <td className="py-3 px-2 text-right">
                        {ord.status !== 'paid' ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleManualActivateOrder(ord.id)}
                            className="text-[11px] py-1 px-2.5 bg-success"
                          >
                            Mark Paid & Activate
                          </Button>
                        ) : (
                          <span className="text-success font-semibold text-[11px]">✓ Active</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management Table */}
        <div className="clay-surface p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-ink">User Entitlements & Accounts</h2>
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink">
              <thead>
                <tr className="border-b border-border/80 text-ink-muted uppercase font-bold text-[10px]">
                  <th className="pb-3 px-2">User</th>
                  <th className="pb-3 px-2">Role</th>
                  <th className="pb-3 px-2">Plan</th>
                  <th className="pb-3 px-2">Agents (Limit)</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-black/[0.02]">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.displayName} size="sm" variant="user" />
                        <div>
                          <div className="font-bold">{u.displayName}</div>
                          <div className="text-ink-muted text-[11px]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={u.role === 'admin' ? 'info' : 'outline'}>{u.role}</Badge>
                    </td>
                    <td className="py-3 px-2 font-semibold uppercase">{u.planId}</td>
                    <td className="py-3 px-2 font-bold">
                      {u.activeAgentsCount} / {u.planId === 'ultra' ? 15 : u.planId === 'pro' ? 9 : u.planId === 'lite' ? 4 : 2}
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {u.role !== 'admin' ? (
                        <Button
                          size="sm"
                          variant={u.status === 'suspended' ? 'outline' : 'danger'}
                          onClick={() => handleToggleSuspend(u.uid, u.status)}
                          className="text-[11px] py-1 px-2.5"
                        >
                          {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                        </Button>
                      ) : (
                        <span className="text-ink-light text-[11px]">Primary Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="clay-surface p-6 space-y-4">
          <h2 className="text-base font-bold text-ink">Security Audit Logs</h2>
          <div className="space-y-2">
            {audits.map((a) => (
              <div
                key={a.id}
                className="bg-[#F8F6F1] p-3 rounded-control border border-border/70 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-primary">{a.action}</span>
                  <span className="text-ink-muted">Target: {a.resource}</span>
                </div>
                <span className="text-ink-light text-[11px]">{formatDate(a.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
