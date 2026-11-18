import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { assertCanCreateAgent } from '@/lib/limits/entitlements';
import { formatApiError, ValidationError } from '@/lib/errors/taxonomy';
import { z } from 'zod';

const createAgentSchema = z.object({
  name: z.string().min(2, 'Agent name must be at least 2 characters').max(64, 'Agent name must not exceed 64 characters'),
  role: z.string().min(2, 'Agent role must be at least 2 characters').max(100, 'Agent role must not exceed 100 characters'),
  description: z.string().max(500, 'Description must not exceed 500 characters').default(''),
  systemPrompt: z.string().min(10, 'System prompt must be at least 10 characters').max(4000, 'System prompt must not exceed 4000 characters'),
  enabledTools: z.array(z.string()).default([]),
  knowledgeFileIds: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();
    const agents = await db.getAgentsByUser(user.uid);
    return NextResponse.json({ success: true, agents });
  } catch (err: unknown) {
    return formatApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    // Hard entitlement gate (server-authoritative: throws QuotaLimitError if quota exceeded)
    await assertCanCreateAgent(user.uid);

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      throw new ValidationError('Invalid JSON in request body. Please verify payload formatting.');
    }

    const validated = createAgentSchema.parse(rawBody);
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

    return NextResponse.json({ success: true, agent: newAgent }, { status: 201 });
  } catch (err: unknown) {
    return formatApiError(err);
  }
}
