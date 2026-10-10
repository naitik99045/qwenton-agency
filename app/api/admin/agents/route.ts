import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = getDB();

    const [allAgents, allUsers] = await Promise.all([
      db.getAllAgents(),
      db.getAllUsers(),
    ]);

    const usersMap = new Map(allUsers.map((u) => [u.uid, u]));

    const enrichedAgents = allAgents.map((agent) => {
      const owner = usersMap.get(agent.ownerUid);
      return {
        ...agent,
        ownerEmail: owner?.email || 'Unknown',
        ownerName: owner?.displayName || 'Unknown User',
        ownerPlan: owner?.planId || 'normal',
      };
    });

    return NextResponse.json({ agents: enrichedAgents });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}

const deleteAgentSchema = z.object({
  agentId: z.string(),
});

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { agentId } = deleteAgentSchema.parse(body);
    const db = getDB();

    const agent = await db.getAgent(agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    await db.deleteAgent(agentId);

    await db.createAuditEvent({
      actorUid: admin.uid,
      action: 'admin.agent.deleted',
      resource: `agents/${agentId}`,
      details: { agentName: agent.name, ownerUid: agent.ownerUid },
    });

    return NextResponse.json({ success: true, message: `Agent "${agent.name}" removed.` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
