import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';

export async function POST(req: NextRequest, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    const user = await requireUser(req);
    const { approvalId } = await params;
    const db = getDB();

    const approval = await db.getApproval(approvalId);
    if (!approval || approval.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Approval request not found' }, { status: 404 });
    }

    if (approval.status !== 'pending') {
      return NextResponse.json({ error: `Action is already ${approval.status}` }, { status: 400 });
    }

    const updated = await db.updateApproval(approvalId, 'rejected', user.uid);

    if (approval.runId) {
      await db.updateRun(approval.runId, {
        status: 'cancelled',
        completedAt: new Date().toISOString(),
      });
      await db.createRunEvent({
        runId: approval.runId,
        type: 'finish',
        title: `Human rejected action "${approval.actionType}"`,
        details: { rejectedBy: user.email },
      });
    }

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'approval.reject',
      resource: `approvals/${approvalId}`,
      details: { actionType: approval.actionType },
    });

    return NextResponse.json({ approval: updated, message: 'Action rejected and cancelled.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
