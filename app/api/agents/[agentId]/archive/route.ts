import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';

export async function POST(req: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const user = await requireUser(req);
    const { agentId } = await params;
    const db = getDB();
    const agent = await db.getAgent(agentId);

    if (!agent || agent.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const updated = await db.updateAgent(agentId, { status: 'archived' });
    return NextResponse.json({ agent: updated, message: 'Agent archived. Slot released.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
