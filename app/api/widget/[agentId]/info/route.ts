import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/adapter';

export async function GET(req: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const { agentId } = await params;
    const db = getDB();

    const agent = await db.getAgent(agentId);
    if (!agent || agent.status !== 'active') {
      return NextResponse.json({ error: 'Agent not found or inactive' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        role: agent.role,
        description: agent.description,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error fetching widget agent info';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
