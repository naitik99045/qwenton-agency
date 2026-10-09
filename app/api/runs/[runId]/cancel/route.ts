import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';

export async function POST(req: NextRequest, { params }: { params: Promise<{ runId: string }> }) {
  try {
    const user = await requireUser(req);
    const { runId } = await params;
    const db = getDB();

    const run = await db.getRun(runId);
    if (!run || run.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    }

    const updated = await db.updateRun(runId, {
      status: 'cancelled',
      completedAt: new Date().toISOString(),
    });

    return NextResponse.json({ run: updated, message: 'Run cancelled.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
