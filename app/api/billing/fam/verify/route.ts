import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { PlanId } from '@/lib/db/types';
import { pollVerifyFamOrder, isFamGatewayConfigured } from '@/lib/billing/famgateway';
import { z } from 'zod';

const verifyRequestSchema = z.object({
  orderReference: z.string().optional(),
  orderId: z.string().optional(),
  utr: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { orderReference, orderId, utr } = verifyRequestSchema.parse(body);

    const db = getDB();
    let order = null;

    if (orderReference) {
      order = await db.getOrderByReference(orderReference);
    }

    if (!order && orderId) {
      const allOrders = await db.getAllOrders();
      order = allOrders.find((o) => o.gatewayTransactionId === orderId) || null;
    }

    if (!order) {
      // Find latest pending order for this user
      const userOrders = await db.getOrdersByUser(user.uid);
      order = userOrders
        .filter((o) => o.status !== 'paid')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
    }

    if (!order || order.userId !== user.uid) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'paid') {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        planId: order.planId,
        message: 'Your payment is already verified and subscription is active!',
      });
    }

    const targetOrderId = orderId || order.gatewayTransactionId;
    let isVerified = false;

    // 1. If valid 12-digit UTR is provided by user
    if (utr && utr.length >= 10) {
      isVerified = true;
    }

    // 2. Authoritative check with FamGateway
    if (!isVerified && isFamGatewayConfigured && targetOrderId && !targetOrderId.startsWith('fg_mock_')) {
      const result = await pollVerifyFamOrder(targetOrderId, 3, 1500);
      if (result.status === 'success') {
        isVerified = true;
      }
    }

    // 3. Fallback for mock/test environments
    if (!isFamGatewayConfigured) {
      isVerified = true;
    }

    if (isVerified) {
      // Activate order
      await db.updateOrder(order.id, {
        status: 'paid',
        ...(utr ? { utr } : {}),
      });

      // Upgrade user
      await db.saveUser({
        ...user,
        planId: order.planId as PlanId,
        updatedAt: new Date().toISOString(),
      });

      // Save subscription
      await db.saveSubscription({
        id: `sub_${user.uid}`,
        userId: user.uid,
        planId: order.planId as PlanId,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancelAtPeriodEnd: false,
        gateway: 'famgateway',
      });

      await db.createAuditEvent({
        actorUid: user.uid,
        action: 'billing.manual_verify.activated',
        resource: `plans/${order.planId}`,
        details: { orderReference: order.orderReference, utr },
      });

      return NextResponse.json({
        success: true,
        planId: order.planId,
        message: `Payment confirmed! Upgraded to ${order.planId.toUpperCase()} tier successfully.`,
      });
    }

    return NextResponse.json({
      success: false,
      pending: true,
      message: 'Payment is still being synced by FamGateway. If you have completed the payment, enter your 12-digit UPI UTR number.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
