import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { z } from 'zod';

const updateAgentSchema = z.object({
  name: z.string().min(2).max(64).optional(),
  role: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  systemPrompt: z.string().min(10).max(4000).optional(),
  enabledTools: z.array(z.string()).optional(),
  status: z.enum(['active', 'paused', 'archived']).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const user = await requireUser(req);
    const { agentId } = await params;
    const db = getDB();
    const agent = await db.getAgent(agentId);

    if (!agent || agent.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({ agent });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const user = await requireUser(req);
    const { agentId } = await params;
    const db = getDB();
    const agent = await db.getAgent(agentId);

    if (!agent || agent.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const body = await req.json();
    const validated = updateAgentSchema.parse(body);

    const updated = await db.updateAgent(agentId, validated);
    return NextResponse.json({ agent: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const user = await requireUser(req);
    const { agentId } = await params;
    const db = getDB();
    const agent = await db.getAgent(agentId);

    if (!agent || agent.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    await db.deleteAgent(agentId);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
