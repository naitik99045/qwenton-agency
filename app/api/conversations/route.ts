import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { z } from 'zod';

const createConvSchema = z.object({
  agentId: z.string(),
  title: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();
    const conversations = await db.getConversationsByUser(user.uid);
    return NextResponse.json({ conversations });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { agentId, title } = createConvSchema.parse(body);
    const db = getDB();

    const agent = await db.getAgent(agentId);
    if (!agent || agent.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const conversation = await db.createConversation(user.uid, agentId, title || `Chat with ${agent.name}`);
    return NextResponse.json({ conversation }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
