'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { Approval } from '@/lib/db/types';
import { formatDate } from '@/lib/utils';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('/api/approvals');
      if (res.ok) {
        const data = await res.json();
        setApprovals(data.approvals || []);
      }
    } catch (e) {
      console.error('Error fetching approvals:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (id: string, decision: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/approvals/${id}/${decision}`, { method: 'POST' });
      if (res.ok) {
        fetchApprovals();
      }
    } catch (e) {
      console.error('Decision error:', e);
    }
  };

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const pastApprovals = approvals.filter((a) => a.status !== 'pending');

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink flex items-center gap-3">
            <span>Human Approvals Inbox</span>
            {pendingApprovals.length > 0 ? (
              <Badge variant="amber">{pendingApprovals.length} Pending</Badge>
            ) : null}
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            External actions (sending Telegram/Slack messages, emails, updating records) require your explicit verification.
          </p>
        </div>

        {/* Pending Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Awaiting Decision</h2>
          {pendingApprovals.length === 0 ? (
            <div className="clay-surface p-8 text-center text-xs text-ink-muted">
              🎉 All caught up! No external agent actions currently require human approval.
            </div>
          ) : (
            pendingApprovals.map((appr) => (
              <div
                key={appr.id}
                className="clay-surface p-6 border-2 border-amber-approval/40 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[14px] bg-[#FDF4E7] text-amber-approval flex items-center justify-center font-bold">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-ink">Action: {appr.actionType}</h3>
                        <Badge variant="amber">{appr.riskLevel.toUpperCase()} RISK</Badge>
                      </div>
                      <p className="text-xs text-ink-muted mt-0.5">Target: {appr.targetService}</p>
                    </div>
                  </div>

                  <span className="text-[11px] text-ink-light flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(appr.createdAt)}
                  </span>
                </div>

                <div className="bg-[#F8F6F1] p-3.5 rounded-card border border-border">
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">
                    Payload Parameters
                  </span>
                  <pre className="text-xs font-mono text-ink overflow-x-auto">
                    {JSON.stringify(appr.payload, null, 2)}
                  </pre>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(appr.id, 'reject')}
                    className="gap-1.5 text-danger border-danger/30 hover:bg-danger-light"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Action</span>
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAction(appr.id, 'approve')}
                    className="gap-1.5 bg-success hover:brightness-105"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Execute</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* History Section */}
        {pastApprovals.length > 0 ? (
          <div className="space-y-3 pt-6 border-t border-border/60">
            <h2 className="text-sm font-bold text-ink-muted uppercase tracking-wider">Decision History</h2>
            {pastApprovals.map((appr) => (
              <div
                key={appr.id}
                className="clay-surface p-4 flex items-center justify-between text-xs opacity-75"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={appr.status === 'approved' ? 'success' : 'danger'}>
                    {appr.status.toUpperCase()}
                  </Badge>
                  <span className="font-bold text-ink">{appr.actionType}</span>
                  <span className="text-ink-muted">({appr.targetService})</span>
                </div>
                <span className="text-ink-light">{formatDate(appr.decidedAt || appr.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
