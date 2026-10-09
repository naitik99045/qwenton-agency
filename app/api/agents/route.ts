import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { assertCanCreateAgent } from '@/lib/limits/entitlements';
import { z } from 'zod';

const createAgentSchema = z.object({
  name: z.string().min(2).max(64),
  role: z.string().min(2).max(100),
  description: z.string().max(500).default(''),
  systemPrompt: z.string().min(10).max(4000),
  enabledTools: z.array(z.string()).default([]),
  knowledgeFileIds: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();
    const agents = await db.getAgentsByUser(user.uid);
    return NextResponse.json({ agents });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    // Hard 3-Agent entitlement gate
    await assertCanCreateAgent(user.uid);

    const body = await req.json();
    const validated = createAgentSchema.parse(body);
    const db = getDB();

    const newAgent = await db.createAgent({
      ownerUid: user.uid,
      name: validated.name,
      role: validated.role,
      description: validated.description,
      systemPrompt: validated.systemPrompt,
      status: 'active',
      enabledTools: validated.enabledTools,
      knowledgeFileIds: validated.knowledgeFileIds || [],
    });

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'agent.create',
      resource: `agents/${newAgent.id}`,
      details: { name: newAgent.name, role: newAgent.role },
    });

    return NextResponse.json({ agent: newAgent }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isLimit = msg.includes('limit reached');
    return NextResponse.json({ error: msg }, { status: isLimit ? 403 : 400 });
  }
}
