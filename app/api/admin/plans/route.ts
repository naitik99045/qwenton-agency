import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { z } from 'zod';

const updatePlanSchema = z.object({
  planId: z.enum(['normal', 'lite', 'pro', 'ultra']),
  price: z.number().min(0).optional(),
  name: z.string().min(2).max(100).optional(),
  maxAgents: z.number().int().min(1).max(100).optional(),
  description: z.string().max(300).optional(),
  features: z.array(z.string()).optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = getDB();
    const plans = await db.getPlans();
    return NextResponse.json({ plans });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const validated = updatePlanSchema.parse(body);
    const db = getDB();

    const { planId, ...updates } = validated;
    const updatedPlan = await db.updatePlan(planId, updates);

    await db.createAuditEvent({
      actorUid: admin.uid,
      action: 'admin.plan.update',
      resource: `plans/${planId}`,
      details: {
        planId,
        newPrice: updatedPlan.price,
        maxAgents: updatedPlan.maxAgents,
        updates,
      },
    });

    return NextResponse.json({ success: true, plan: updatedPlan });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
