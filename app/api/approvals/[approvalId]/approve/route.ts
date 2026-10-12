import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { executeTool } from '@/lib/tools/executor';

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

    // 1. Dispatch real tool execution with isApproved: true
    const executionResult = await executeTool(
      approval.actionType,
      approval.payload || {},
      user.uid,
      { isApproved: true }
    );

    // 2. Mark approval as approved in database
    const updated = await db.updateApproval(approvalId, 'approved', user.uid);

    // 3. Update associated run status and log execution event
    if (approval.runId) {
      await db.updateRun(approval.runId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      await db.createRunEvent({
        runId: approval.runId,
        type: 'finish',
        title: `Human approved and executed "${approval.actionType}"`,
        details: {
          approvedBy: user.email,
          executionResult,
        },
      });

      // 4. Append assistant record to conversation
      const run = await db.getRun(approval.runId);
      if (run?.conversationId) {
        const executionSummary = executionResult.ok
          ? `✅ **Action Approved & Dispatched:** \`${approval.actionType}\`\n\n${
              (executionResult.data as any)?.message || 'Action executed successfully.'
            }`
          : `⚠️ **Action Approved, execution notice:** ${executionResult.error || 'Execution encountered an issue.'}`;

        await db.createMessage({
          conversationId: run.conversationId,
          agentId: approval.agentId,
          ownerUid: user.uid,
          sender: 'agent',
          content: executionSummary,
        });
      }
    }

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'approval.approve',
      resource: `approvals/${approvalId}`,
      details: {
        actionType: approval.actionType,
        targetService: approval.targetService,
        executionResult,
      },
    });

    return NextResponse.json({
      success: true,
      approval: updated,
      executionResult,
      message: 'Action approved and executed.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
