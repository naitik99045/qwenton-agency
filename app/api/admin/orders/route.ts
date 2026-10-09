import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { PlanId } from '@/lib/db/types';
import { z } from 'zod';

const updateOrderAdminSchema = z.object({
  orderId: z.string(),
  status: z.enum(['otp_pending', 'otp_verified', 'paid', 'failed']),
  activatePlan: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = getDB();
    const orders = await db.getAllOrders();
    return NextResponse.json({ orders });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminUser = await requireAdmin(req);
    const body = await req.json();
    const { orderId, status, activatePlan } = updateOrderAdminSchema.parse(body);
    const db = getDB();

    const order = await db.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await db.updateOrder(orderId, { status });

    if (activatePlan && status === 'paid') {
      const user = await db.getUser(order.userId);
      if (user) {
        await db.saveUser({
          ...user,
          planId: order.planId as PlanId,
          updatedAt: new Date().toISOString(),
        });
        await db.saveSubscription({
          id: `sub_${order.userId}`,
          userId: order.userId,
          planId: order.planId as PlanId,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
          cancelAtPeriodEnd: false,
          gateway: 'famgateway',
        });
      }
    }

    await db.createAuditEvent({
      actorUid: adminUser.uid,
      action: 'admin.order.update',
      resource: `orders/${orderId}`,
      details: { status, activatePlan },
    });

    return NextResponse.json({ order: updatedOrder, message: 'Order updated successfully.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}
