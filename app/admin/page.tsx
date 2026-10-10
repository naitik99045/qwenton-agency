'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import {
  ShieldCheck,
  Users,
  Bot,
  Activity,
  ShoppingCart,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Edit3,
  Check,
  X,
  Layers,
  Server,
  Terminal,
  ExternalLink,
  Search,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Zap,
  HardDrive,
  Cpu,
} from 'lucide-react';
import { User, AuditEvent, Order, Plan, Agent } from '@/lib/db/types';
import { formatDate } from '@/lib/utils';
import { auth } from '@/lib/firebase/config';
import NotFound from '@/app/not-found';

interface EnrichedAgent extends Agent {
  ownerEmail?: string;
  ownerName?: string;
  ownerPlan?: string;
}

interface SystemDiagnostics {
  system: {
    timestamp: string;
    nodeVersion: string;
    environment: string;
    appMode: string;
  };
  services: {
    firestore: { configured: boolean; provider: string; status: string };
    famgateway: { configured: boolean; endpoint: string; status: string };
    llm: {
      configured: boolean;
      provider?: string;
      model?: string;
      status: string;
      latencyMs?: number;
      message?: string;
    };
    emailjs: { configured: boolean; status: string };
  };
}

const INITIAL_PLANS: Plan[] = [
  {
    id: 'normal',
    name: 'Normal (Free)',
    price: 0,
    priceFormatted: '₹0',
    maxAgents: 2,
    maxRunsPerMonth: 50,
    maxFileStorageBytes: 25 * 1024 * 1024,
    maxTelegramBots: 1,
    features: ['2 AI Agents for Free Work', 'Local LM Studio & Ollama', 'Safe Web Research', 'Human Approvals'],
    active: true,
  },
  {
    id: 'lite',
    name: 'Lite Coworker',
    price: 499,
    priceFormatted: '₹499 / mo',
    maxAgents: 4,
    maxRunsPerMonth: 300,
    maxFileStorageBytes: 100 * 1024 * 1024,
    maxTelegramBots: 1,
    features: ['4 AI Agents', 'Priority LLM Streaming', 'Telegram Bot Chat', '100MB File Knowledge'],
    active: true,
  },
  {
    id: 'pro',
    name: 'Pro Coworker',
    price: 1499,
    priceFormatted: '₹1,499 / mo',
    maxAgents: 9,
    maxRunsPerMonth: 1000,
    maxFileStorageBytes: 500 * 1024 * 1024,
    maxTelegramBots: 3,
    features: ['9 AI Agents', 'Gemini & OpenAI Cloud Access', 'Automated Scheduled Routines', '500MB Storage'],
    active: true,
  },
  {
    id: 'ultra',
    name: 'Ultra Business',
    price: 3999,
    priceFormatted: '₹3,999 / mo',
    maxAgents: 15,
    maxRunsPerMonth: 5000,
    maxFileStorageBytes: 2 * 1024 * 1024 * 1024,
    maxTelegramBots: 5,
    features: ['15 AI Agents', 'Custom BaseURL & API Keys', 'Multi-channel Slack & Telegram', 'Unlimited Storage & Priority Queue'],
    active: true,
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'agents' | 'pricing' | 'orders' | 'system' | 'audits'
  >('overview');

  const [metrics, setMetrics] = useState<{
    totalUsers: number;
    totalActiveAgents: number;
    activePlansCount: number;
    llmConnected: boolean;
    llmModel: string;
  } | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [agents, setAgents] = useState<EnrichedAgent[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [audits, setAudits] = useState<AuditEvent[]>([]);
  const [systemDiag, setSystemDiag] = useState<SystemDiagnostics | null>(null);

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [agentSearch, setAgentSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Plan Edit State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editMaxAgents, setEditMaxAgents] = useState<number>(2);
  const [savingPlan, setSavingPlan] = useState(false);
  const [planSaveNotice, setPlanSaveNotice] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [updatingUserUid, setUpdatingUserUid] = useState<string | null>(null);

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // Ignore token fetch error, fallback to cookies
    }
    return headers;
  };

  const fetchAdminData = async () => {
    try {
      const headers = await getAuthHeaders();
      const [overviewRes, usersRes, agentsRes, ordersRes, plansRes, systemRes] = await Promise.all([
        fetch('/api/admin/overview', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/agents', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/plans', { headers }),
        fetch('/api/admin/system', { headers }),
      ]);

      if (overviewRes.status === 403 || usersRes.status === 403 || overviewRes.status === 404) {
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
      if (agentsRes.ok) {
        const aData = await agentsRes.json();
        setAgents(aData.agents || []);
      }
      if (ordersRes.ok) {
        const ordData = await ordersRes.json();
        setOrders(ordData.orders || []);
      }
      if (plansRes.ok) {
        const pData = await plansRes.json();
        setPlans(pData.plans || []);
      }
      if (systemRes.ok) {
        const sData = await systemRes.json();
        setSystemDiag(sData);
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
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    if (!confirm(`Are you sure you want to change this user status to ${nextStatus.toUpperCase()}?`)) return;

    try {
      setUpdatingUserUid(uid);
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/users/${uid}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) fetchAdminData();
    } catch (e) {
      console.error('Update status error:', e);
    } finally {
      setUpdatingUserUid(null);
    }
  };

  const handleUpdateRole = async (uid: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Are you sure you want to change user role to ${nextRole.toUpperCase()}?`)) return;

    try {
      setUpdatingUserUid(uid);
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/users/${uid}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ role: nextRole }),
      });
      if (res.ok) fetchAdminData();
    } catch (e) {
      console.error('Update role error:', e);
    } finally {
      setUpdatingUserUid(null);
    }
  };

  const handleUpdateUserPlan = async (uid: string, planId: string) => {
    try {
      setUpdatingUserUid(uid);
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/users/${uid}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ planId }),
      });
      if (res.ok) fetchAdminData();
    } catch (e) {
      console.error('Update user plan error:', e);
    } finally {
      setUpdatingUserUid(null);
    }
  };

  const handleDeleteAgent = async (agentId: string, agentName: string) => {
    if (!confirm(`Are you sure you want to permanently delete agent "${agentName}"?`)) return;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/agents', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ agentId }),
      });
      if (res.ok) fetchAdminData();
    } catch (e) {
      console.error('Delete agent error:', e);
    }
  };

  const handleManualActivateOrder = async (orderId: string) => {
    if (!confirm('Mark this order as Paid and activate user subscription?')) return;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ orderId, status: 'paid', activatePlan: true }),
      });
      if (res.ok) fetchAdminData();
    } catch (e) {
      console.error('Activate order error:', e);
    }
  };

  const handleStartEditPlan = (plan: Plan) => {
    setEditingPlanId(plan.id);
    setEditPrice(plan.price);
    setEditMaxAgents(plan.maxAgents);
    setPlanSaveNotice(null);
  };

  const handleCancelEditPlan = () => {
    setEditingPlanId(null);
    setPlanSaveNotice(null);
  };

  const handleSavePlan = async (planId: string) => {
    setSavingPlan(true);
    setPlanSaveNotice(null);
    try {
      const headers = await getAuthHeaders();

      // Optimistic update so UI reflects the new INR price immediately
      setPlans((prev) =>
        prev.map((pl) =>
          pl.id === planId
            ? {
                ...pl,
                price: Number(editPrice),
                maxAgents: Number(editMaxAgents),
                priceFormatted: `₹${Number(editPrice).toLocaleString('en-IN')} / mo`,
              }
            : pl
        )
      );

      const res = await fetch('/api/admin/plans', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          planId,
          price: Number(editPrice),
          maxAgents: Number(editMaxAgents),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update plan');
      }

      setPlanSaveNotice(`Plan ${planId.toUpperCase()} updated to ₹${editPrice}/mo (${editMaxAgents} max agents)!`);
      setEditingPlanId(null);
      fetchAdminData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      alert(`Error updating plan: ${msg}`);
      fetchAdminData();
    } finally {
      setSavingPlan(false);
    }
  };

  if (isUnauthorized) {
    return <NotFound />;
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.planId.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
      (a.ownerEmail && a.ownerEmail.toLowerCase().includes(agentSearch.toLowerCase())) ||
      a.role.toLowerCase().includes(agentSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.orderReference.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.userEmail && o.userEmail.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.userName && o.userName.toLowerCase().includes(orderSearch.toLowerCase())) ||
      o.planId.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <AdminShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onRefresh={fetchAdminData}
      isRefreshing={loading}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                onClick={() => setActiveTab('users')}
                className="clay-surface p-5 cursor-pointer hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink-muted uppercase group-hover:text-primary">
                    Total Users
                  </span>
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="text-3xl font-extrabold text-ink">{users.length}</div>
                <p className="text-[11px] text-ink-muted mt-1">Tenant accounts registered</p>
              </div>

              <div
                onClick={() => setActiveTab('agents')}
                className="clay-surface p-5 cursor-pointer hover:border-success/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink-muted uppercase group-hover:text-success">
                    Active Agents
                  </span>
                  <Bot className="w-4 h-4 text-success" />
                </div>
                <div className="text-3xl font-extrabold text-ink">{agents.length}</div>
                <p className="text-[11px] text-ink-muted mt-1">Across all workspace tenants</p>
              </div>

              <div
                onClick={() => setActiveTab('orders')}
                className="clay-surface p-5 cursor-pointer hover:border-[#523E8C]/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink-muted uppercase group-hover:text-[#523E8C]">
                    Total Orders
                  </span>
                  <ShoppingCart className="w-4 h-4 text-[#523E8C]" />
                </div>
                <div className="text-3xl font-extrabold text-ink">{orders.length}</div>
                <p className="text-[11px] text-ink-muted mt-1">FAM Gateway transactions</p>
              </div>

              <div
                onClick={() => setActiveTab('system')}
                className="clay-surface p-5 cursor-pointer hover:border-primary-deep/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink-muted uppercase group-hover:text-primary-deep">
                    LLM Engine
                  </span>
                  <Cpu className="w-4 h-4 text-primary-deep" />
                </div>
                <div className="text-lg font-bold text-ink truncate">{metrics?.llmModel || 'Multi-model'}</div>
                <p className="text-[11px] text-success font-semibold mt-1">● Operational</p>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Overview */}
              <div className="clay-surface p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-ink">Recent Orders & Upgrades</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-border/50">
                  {orders.slice(0, 4).map((ord) => (
                    <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-ink">{ord.userName || ord.userEmail}</div>
                        <div className="text-ink-muted text-[11px] font-mono">{ord.orderReference}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">₹{ord.amount} ({ord.planId.toUpperCase()})</div>
                        <Badge
                          variant={
                            ord.status === 'paid' ? 'success' : ord.status === 'otp_verified' ? 'amber' : 'outline'
                          }
                          className="text-[10px]"
                        >
                          {ord.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Security Audits */}
              <div className="clay-surface p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-ink">Recent Security Activity</h3>
                  <button
                    onClick={() => setActiveTab('audits')}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-2">
                  {audits.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 bg-[#F8F6F1] rounded-control border border-border/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-mono font-bold text-primary text-[11px]">{a.action}</div>
                        <div className="text-ink-muted text-[11px]">{a.resource}</div>
                      </div>
                      <span className="text-[10px] text-ink-light">{formatDate(a.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT & ROLES */}
        {activeTab === 'users' && (
          <div className="clay-surface p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-ink">User Entitlements & Account Control</h2>
                <p className="text-xs text-ink-muted">Manage roles, assign subscription tiers, and control account access</p>
              </div>
              <div className="w-full sm:w-72 relative">
                <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
                <Input
                  placeholder="Search by email, name, or plan..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ink">
                <thead>
                  <tr className="border-b border-border/80 text-ink-muted uppercase font-bold text-[10px]">
                    <th className="pb-3 px-2">User / Identity</th>
                    <th className="pb-3 px-2">Role</th>
                    <th className="pb-3 px-2">Plan Tier</th>
                    <th className="pb-3 px-2">Agents (Used / Max)</th>
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
                            <div className="font-bold text-ink">{u.displayName}</div>
                            <div className="text-ink-muted text-[11px]">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={u.role === 'admin' ? 'info' : 'outline'} className="capitalize">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={u.planId}
                          onChange={(e) => handleUpdateUserPlan(u.uid, e.target.value)}
                          disabled={updatingUserUid === u.uid}
                          className="bg-white border border-border text-ink font-semibold rounded-control px-2 py-1 text-xs"
                        >
                          <option value="normal">Normal (2 agents)</option>
                          <option value="lite">Lite (4 agents)</option>
                          <option value="pro">Pro (9 agents)</option>
                          <option value="ultra">Ultra (15 agents)</option>
                        </select>
                      </td>
                      <td className="py-3 px-2 font-bold text-primary">
                        {u.activeAgentsCount || 0} / {u.planId === 'ultra' ? 15 : u.planId === 'pro' ? 9 : u.planId === 'lite' ? 4 : 2}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                          ● {u.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateRole(u.uid, u.role)}
                            disabled={updatingUserUid === u.uid}
                            className="text-[11px] py-1 px-2 gap-1"
                          >
                            <Shield className="w-3 h-3 text-[#523E8C]" />
                            <span>{u.role === 'admin' ? 'Demote to User' : 'Make Admin'}</span>
                          </Button>

                          <Button
                            size="sm"
                            variant={u.status === 'suspended' ? 'outline' : 'danger'}
                            onClick={() => handleToggleSuspend(u.uid, u.status)}
                            disabled={updatingUserUid === u.uid}
                            className="text-[11px] py-1 px-2"
                          >
                            {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ALL PLATFORM AGENTS */}
        {activeTab === 'agents' && (
          <div className="clay-surface p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-ink">All Platform Agents Explorer</h2>
                <p className="text-xs text-ink-muted">Inspect and govern all AI agents configured across tenant accounts</p>
              </div>
              <div className="w-full sm:w-72 relative">
                <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
                <Input
                  placeholder="Search agents by name, role, owner..."
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ink">
                <thead>
                  <tr className="border-b border-border/80 text-ink-muted uppercase font-bold text-[10px]">
                    <th className="pb-3 px-2">Agent Name & Role</th>
                    <th className="pb-3 px-2">Tenant Owner</th>
                    <th className="pb-3 px-2">Model & Provider</th>
                    <th className="pb-3 px-2">Tools Enabled</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredAgents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-ink-muted">
                        No agents match the current search.
                      </td>
                    </tr>
                  ) : (
                    filteredAgents.map((a) => (
                      <tr key={a.id} className="hover:bg-black/[0.02]">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-control bg-primary/10 text-primary flex items-center justify-center font-bold">
                              <Bot className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-ink">{a.name}</div>
                              <div className="text-[11px] text-ink-muted capitalize">{a.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-semibold text-ink">{a.ownerName || 'User'}</div>
                          <div className="text-[11px] text-ink-muted">{a.ownerEmail || a.ownerUid}</div>
                        </td>
                        <td className="py-3 px-2 font-mono text-primary font-medium">
                          {a.modelProvider || 'Default'} / {a.modelName || 'qwen2.5-7b'}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1 flex-wrap">
                            {a.tools?.drive && <Badge variant="outline" className="text-[10px]">Drive</Badge>}
                            {a.tools?.instagram && <Badge variant="outline" className="text-[10px]">Instagram</Badge>}
                            {a.tools?.search && <Badge variant="outline" className="text-[10px]">Search</Badge>}
                            {a.tools?.telegram && <Badge variant="outline" className="text-[10px]">Telegram</Badge>}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={a.status === 'active' ? 'success' : 'outline'}>
                            ● {a.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteAgent(a.id, a.name)}
                            className="text-[11px] py-1 px-2 gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRICING & PLANS CONTROL */}
        {activeTab === 'pricing' && (
          <div className="clay-surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-bold text-ink">Subscription Plans & Live Pricing Control</h2>
                </div>
                <p className="text-xs text-ink-muted">
                  Adjust plan prices and quotas. Edits take effect immediately across all pricing, checkout, and billing endpoints.
                </p>
              </div>
              {planSaveNotice ? (
                <Badge variant="success" className="text-xs py-1 px-3">
                  ✓ {planSaveNotice}
                </Badge>
              ) : (
                <Badge variant="info">4 Active Tiers</Badge>
              )}
            </div>

            <div className="bg-[#EBF1FA] border border-[#C5D7F2] p-3.5 rounded-card flex items-center justify-between text-xs text-[#2A4374]">
              <div className="flex items-center gap-2.5">
                <span className="text-base">💡</span>
                <span>
                  <strong>How to Edit Pricing:</strong> Click the <strong>Edit Price & Limit</strong> button on the right side of any tier below. Enter your price in <strong>₹ INR</strong> and agent limit, then click <strong>Save</strong>.
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ink">
                <thead>
                  <tr className="border-b border-border/80 text-ink-muted uppercase font-bold text-[10px]">
                    <th className="pb-3 px-2">Tier ID</th>
                    <th className="pb-3 px-2">Plan Name</th>
                    <th className="pb-3 px-2">Monthly Price (₹ INR)</th>
                    <th className="pb-3 px-2">Max Agents Quota</th>
                    <th className="pb-3 px-2">Storage / Features</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {plans.map((p) => {
                    const isEditing = editingPlanId === p.id;
                    return (
                      <tr key={p.id} className="hover:bg-black/[0.02]">
                        <td className="py-3 px-2 font-mono font-bold text-primary uppercase">{p.id}</td>
                        <td className="py-3 px-2 font-bold text-ink">{p.name}</td>
                        <td className="py-3 px-2">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-sm">₹</span>
                              <input
                                type="number"
                                min={0}
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-20 px-2 py-1 bg-white border border-primary text-sm font-bold text-ink rounded-control shadow-xs"
                              />
                              <span className="text-[11px] text-ink-muted">/ mo</span>
                            </div>
                          ) : (
                            <span className="font-bold text-sm text-ink">{p.priceFormatted || `₹${p.price} / mo`}</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={1}
                                max={100}
                                value={editMaxAgents}
                                onChange={(e) => setEditMaxAgents(Number(e.target.value))}
                                className="w-16 px-2 py-1 bg-white border border-primary text-sm font-bold text-ink rounded-control shadow-xs"
                              />
                              <span className="text-[11px] text-ink-muted">agents</span>
                            </div>
                          ) : (
                            <span className="font-semibold text-primary">⚡ {p.maxAgents} Agents</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-ink-muted text-[11px]">
                          {p.id === 'ultra'
                            ? '2GB Storage / 5 Bots / Unlimited Runs'
                            : p.id === 'pro'
                            ? '500MB / 3 Bots / 1500 Runs'
                            : p.id === 'lite'
                            ? '100MB / 1 Bot / 300 Runs'
                            : '25MB / 1 Bot / 50 Runs'}
                        </td>
                        <td className="py-3 px-2 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="primary"
                                isLoading={savingPlan}
                                onClick={() => handleSavePlan(p.id)}
                                className="text-[11px] py-1 px-2.5 bg-success gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Save</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEditPlan}
                                className="text-[11px] py-1 px-2 gap-1"
                              >
                                <X className="w-3 h-3" />
                                <span>Cancel</span>
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartEditPlan(p)}
                              className="text-[11px] py-1 px-2.5 gap-1.5"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Price & Limit</span>
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS & TRANSACTIONS */}
        {activeTab === 'orders' && (
          <div className="clay-surface p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-ink">FAM Gateway & Subscription Orders</h2>
                <p className="text-xs text-ink-muted">View order references, customer details, and payment verification</p>
              </div>
              <div className="w-full sm:w-72 relative">
                <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
                <Input
                  placeholder="Search orders..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ink">
                <thead>
                  <tr className="border-b border-border/80 text-ink-muted uppercase font-bold text-[10px]">
                    <th className="pb-3 px-2">Order Reference</th>
                    <th className="pb-3 px-2">Customer / Email</th>
                    <th className="pb-3 px-2">Plan</th>
                    <th className="pb-3 px-2">Amount</th>
                    <th className="pb-3 px-2">Gateway Status</th>
                    <th className="pb-3 px-2">Created At</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-ink-muted">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-black/[0.02]">
                        <td className="py-3 px-2 font-mono font-bold text-primary">{ord.orderReference}</td>
                        <td className="py-3 px-2">
                          <div className="font-bold text-ink">{ord.userName || 'Customer'}</div>
                          <div className="text-ink-muted text-[11px]">{ord.userEmail}</div>
                        </td>
                        <td className="py-3 px-2 font-semibold uppercase">{ord.planId}</td>
                        <td className="py-3 px-2 font-bold">₹{ord.amount}</td>
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
        )}

        {/* TAB 6: SYSTEM HEALTH & DIAGNOSTICS */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="clay-surface p-6 space-y-4">
              <h2 className="text-base font-bold text-ink">Connected Cloud Services & Diagnostics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Firebase Firestore */}
                <div className="p-4 rounded-control bg-[#F8F6F1] border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-ink text-sm flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-primary" />
                      Firebase Cloud Firestore
                    </span>
                    <Badge variant={systemDiag?.services.firestore.configured ? 'success' : 'outline'}>
                      {systemDiag?.services.firestore.configured ? 'Configured' : 'Local Fallback'}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Provider: <span className="font-semibold text-ink">{systemDiag?.services.firestore.provider}</span>
                  </p>
                </div>

                {/* FamGateway */}
                <div className="p-4 rounded-control bg-[#F8F6F1] border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-ink text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      FamGateway (famgateway.in)
                    </span>
                    <Badge variant={systemDiag?.services.famgateway.configured ? 'success' : 'amber'}>
                      {systemDiag?.services.famgateway.configured ? 'API Key Active' : 'Waiting for FAMGATEWAY_API_KEY'}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Endpoint: <span className="font-semibold text-ink">{systemDiag?.services.famgateway.endpoint}</span>
                  </p>
                </div>

                {/* AI LLM Runtime */}
                <div className="p-4 rounded-control bg-[#F8F6F1] border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-ink text-sm flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-primary" />
                      Multi-Provider AI Runtime
                    </span>
                    <Badge variant={systemDiag?.services.llm.status === 'connected' ? 'success' : 'amber'}>
                      {systemDiag?.services.llm.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Model: <span className="font-semibold text-ink">{systemDiag?.services.llm.model}</span> (
                    {systemDiag?.services.llm.provider})
                  </p>
                </div>

                {/* EmailJS OTP */}
                <div className="p-4 rounded-control bg-[#F8F6F1] border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-ink text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      EmailJS OTP Verification
                    </span>
                    <Badge variant={systemDiag?.services.emailjs.configured ? 'success' : 'outline'}>
                      {systemDiag?.services.emailjs.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Verification emails for UPI purchase approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SECURITY AUDITS */}
        {activeTab === 'audits' && (
          <div className="clay-surface p-6 space-y-4">
            <h2 className="text-base font-bold text-ink">Real-time Platform Security Audits</h2>
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
        )}
      </div>
    </AdminShell>
  );
}
