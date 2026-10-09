import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/adapter';
import { PlanId } from '@/lib/db/types';

export async function GET(req: NextRequest) {
  return handleCallback(req);
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  let famRef = searchParams.get('fam_ref');
  let famTx = searchParams.get('fam_tx');
  let status = searchParams.get('status') || 'success';

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      famRef = body.orderReference || body.fam_ref || famRef;
      famTx = body.transactionId || body.fam_tx || famTx;
      status = body.status || status;
    } catch (e) {
      // ignore json parse error on GET
    }
  }

  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const appUrl = `${protocol}://${host}`;

  if (!famRef) {
    return NextResponse.redirect(`${appUrl}/billing?error=missing_reference`);
  }

  const db = getDB();
  const order = await db.getOrderByReference(famRef);

  if (!order) {
    return NextResponse.redirect(`${appUrl}/billing?error=order_not_found`);
  }

  if (status === 'success') {
    // 1. Mark Order as Paid
    await db.updateOrder(order.id, {
      status: 'paid',
      gatewayTransactionId: famTx || order.gatewayTransactionId,
    });

    // 2. Upgrade User Plan & Limits
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
        action: 'billing.subscription.activated',
        resource: `plans/${order.planId}`,
        details: { orderReference: order.orderReference, amount: order.amount, gateway: 'famgateway' },
      });
    }

    return NextResponse.redirect(`${appUrl}/billing?success=true&plan=${order.planId}&ref=${order.orderReference}`);
  } else {
    await db.updateOrder(order.id, { status: 'failed' });
    return NextResponse.redirect(`${appUrl}/billing?error=payment_failed&ref=${order.orderReference}`);
  }
}
