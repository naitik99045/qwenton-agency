import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { z } from 'zod';

const createMemorySchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().min(1).max(2000),
  agentId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();
    const url = new URL(req.url);
    const agentId = url.searchParams.get('agentId') || undefined;

    const memories = await db.getMemoriesByUser(user.uid, agentId);
    return NextResponse.json({ memories });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { key, value, agentId } = createMemorySchema.parse(body);
    const db = getDB();

    const memory = await db.saveMemory({
      ownerUid: user.uid,
      agentId,
      key,
      value,
    });

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'memory.created',
      resource: `memories/${memory.id}`,
      details: { key, agentId },
    });

    return NextResponse.json({ success: true, memory }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const url = new URL(req.url);
    const memoryId = url.searchParams.get('id');

    if (!memoryId) {
      return NextResponse.json({ error: 'Memory ID parameter required' }, { status: 400 });
    }

    const db = getDB();
    const deleted = await db.deleteMemory(memoryId);

    if (deleted) {
      await db.createAuditEvent({
        actorUid: user.uid,
        action: 'memory.deleted',
        resource: `memories/${memoryId}`,
        details: { memoryId },
      });
    }

    return NextResponse.json({ success: deleted });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
