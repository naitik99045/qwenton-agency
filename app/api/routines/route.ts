import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { z } from 'zod';

const createRoutineSchema = z.object({
  agentId: z.string(),
  name: z.string().min(2).max(100),
  cronExpression: z.string().default('0 9 * * 1'), // Weekly Mondays at 9am
  prompt: z.string().min(5),
  active: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();
    const routines = await db.getRoutinesByUser(user.uid);
    return NextResponse.json({ routines });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const validated = createRoutineSchema.parse(body);
    const db = getDB();

    const agent = await db.getAgent(validated.agentId);
    if (!agent || agent.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const routine = await db.createRoutine({
      ownerUid: user.uid,
      agentId: validated.agentId,
      name: validated.name,
      cronExpression: validated.cronExpression,
      prompt: validated.prompt,
      active: validated.active,
    });

    return NextResponse.json({ routine }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
