import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { testLLMConnection } from '@/lib/llm/client';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = getDB();

    const users = await db.getAllUsers();
    const plans = await db.getPlans();
    const auditEvents = await db.getAuditEvents(20);
    const llmStatus = await testLLMConnection();

    const totalActiveAgents = users.reduce((acc, u) => acc + (u.activeAgentsCount || 0), 0);

    return NextResponse.json({
      metrics: {
        totalUsers: users.length,
        totalActiveAgents,
        activePlansCount: plans.length,
        llmConnected: llmStatus.ok,
        llmModel: llmStatus.model || 'local-endpoint',
      },
      recentAudits: auditEvents,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}
