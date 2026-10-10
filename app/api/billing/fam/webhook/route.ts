import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/adapter';
import { PlanId } from '@/lib/db/types';
import { verifyFamOrder, verifyFamWebhookSignature } from '@/lib/billing/famgateway';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-famgateway-signature') || req.headers.get('x-signature') || '';

    // Verify webhook signature if provided
    if (signature && !verifyFamWebhookSignature(rawBody, signature)) {
      console.error('[FamGateway Webhook] Invalid signature rejected');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    let payload: Record<string, any> = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      // If form-urlencoded
      const params = new URLSearchParams(rawBody);
      payload = Object.fromEntries(params.entries());
    }

    const orderId = payload.order_id || payload.orderId || payload.fam_tx;
    const famRef = payload.fam_ref || payload.order_ref || payload.orderReference;
    const utr = payload.utr || payload.UTR || payload.bank_ref_num;
    const status = (payload.status || payload.event || '').toLowerCase();

    if (!orderId && !famRef) {
      return NextResponse.json({ error: 'Missing order identifiers' }, { status: 400 });
    }

    const db = getDB();
    let order = famRef ? await db.getOrderByReference(famRef) : null;

    if (!order && orderId) {
      const allOrders = await db.getAllOrders();
      order = allOrders.find((o) => o.gatewayTransactionId === orderId) || null;
    }

    if (!order) {
      console.warn(`[FamGateway Webhook] Order not found for orderId: ${orderId}, famRef: ${famRef}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Double check with FamGateway authoritative endpoint
    let isSuccess =
      status === 'success' ||
      status === 'paid' ||
      status === 'completed' ||
      status === 'payment.success' ||
      payload.event === 'payment.success';

    if (orderId && !orderId.startsWith('fg_mock_')) {
      const verified = await verifyFamOrder(orderId);
      if (verified.status === 'success') {
        isSuccess = true;
      } else if (verified.status === 'expired' || verified.status === 'failed') {
        isSuccess = false;
      }
    }

    if (isSuccess) {
      // 1. Mark Order as Paid
      await db.updateOrder(order.id, {
        status: 'paid',
        gatewayTransactionId: orderId || order.gatewayTransactionId,
      });

      // 2. Upgrade User Plan
      const user = await db.getUser(order.userId);
      if (user) {
        await db.saveUser({
          ...user,
          planId: order.planId as PlanId,
          updatedAt: new Date().toISOString(),
        });

        // 3. Create/Update Subscription record
        await db.saveSubscription({
          id: `sub_${order.userId}`,
          userId: order.userId,
          planId: order.planId as PlanId,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
          cancelAtPeriodEnd: false,
          gateway: 'famgateway',
        });

        await db.createAuditEvent({
          actorUid: order.userId,
          action: 'billing.webhook.subscription_activated',
          resource: `plans/${order.planId}`,
          details: { orderReference: order.orderReference, orderId, gateway: 'famgateway' },
        });
      }

      return NextResponse.json({ status: 'success', message: 'Order processed successfully' });
    } else {
      await db.updateOrder(order.id, { status: 'failed' });
      return NextResponse.json({ status: 'ignored', message: 'Payment not successful' });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[FamGateway Webhook] Handler error:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
