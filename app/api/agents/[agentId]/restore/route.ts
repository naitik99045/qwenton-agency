import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { assertCanCreateAgent } from '@/lib/limits/entitlements';

export async function POST(req: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const user = await requireUser(req);
    const { agentId } = await params;
    const db = getDB();
    const agent = await db.getAgent(agentId);

    if (!agent || agent.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Check entitlement before restoring
    await assertCanCreateAgent(user.uid);

    const updated = await db.updateAgent(agentId, { status: 'active' });
    return NextResponse.json({ agent: updated, message: 'Agent restored successfully.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isLimit = msg.includes('limit reached');
    return NextResponse.json({ error: msg }, { status: isLimit ? 403 : 400 });
  }
}
