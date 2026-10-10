import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/adapter';
import { PlanId } from '@/lib/db/types';
import { pollVerifyFamOrder, isFamGatewayConfigured } from '@/lib/billing/famgateway';

export async function GET(req: NextRequest) {
  return handleCallback(req);
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  let famRef =
    searchParams.get('fam_ref') ||
    searchParams.get('order_ref') ||
    searchParams.get('orderReference') ||
    searchParams.get('ref') ||
    null;

  let orderId =
    searchParams.get('order_id') ||
    searchParams.get('orderId') ||
    searchParams.get('fam_tx') ||
    searchParams.get('transaction_id') ||
    searchParams.get('txn_id') ||
    searchParams.get('client_txn_id') ||
    null;

  let utr =
    searchParams.get('utr') ||
    searchParams.get('UTR') ||
    searchParams.get('bank_ref_num') ||
    null;

  let status = (
    searchParams.get('status') ||
    searchParams.get('payment_status') ||
    'success'
  ).toLowerCase();

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      famRef = body.orderReference || body.order_ref || body.fam_ref || famRef;
      orderId = body.order_id || body.orderId || body.transactionId || body.fam_tx || body.client_txn_id || orderId;
      utr = body.utr || body.UTR || utr;
      status = (body.status || status).toLowerCase();
    } catch {
      // ignore json parse error on GET
    }
  }

  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const appUrl = `${protocol}://${host}`;

  const db = getDB();
  let order = famRef ? await db.getOrderByReference(famRef) : null;

  if (!order && orderId) {
    const allOrders = await db.getAllOrders();
    order = allOrders.find((o) => o.gatewayTransactionId === orderId) || null;
  }

  if (!order) {
    console.warn(`[FamGateway Callback] Order not found for famRef: ${famRef}, orderId: ${orderId}`);
    return NextResponse.redirect(`${appUrl}/billing?error=order_not_found`);
  }

  const targetOrderId = orderId || order.gatewayTransactionId;

  // Authoritative server-to-server verification with FamGateway
  let isVerifiedSuccess = false;
  let isPending = false;

  if (isFamGatewayConfigured && targetOrderId && !targetOrderId.startsWith('fg_mock_')) {
    // Poll up to 3 times with 1.8s delay to allow Gmail IMAP sync
    const verification = await pollVerifyFamOrder(targetOrderId, 3, 1800);

    if (verification.status === 'success') {
      isVerifiedSuccess = true;
      if (verification.utr && !utr) utr = verification.utr;
    } else if (verification.status === 'pending') {
      isPending = true;
    } else {
      isVerifiedSuccess = false;
    }
  } else {
    // Local demo / mock mode
    isVerifiedSuccess = status === 'success' || status === 'completed' || status === 'paid';
  }

  if (isVerifiedSuccess) {
    // 1. Mark Order as Paid
    await db.updateOrder(order.id, {
      status: 'paid',
      gatewayTransactionId: targetOrderId || order.gatewayTransactionId,
      ...(utr ? { utr } : {}),
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
        details: {
          orderReference: order.orderReference,
          amount: order.amount,
          gateway: 'famgateway',
          orderId: targetOrderId,
          utr,
        },
      });
    }

    return NextResponse.redirect(
      `${appUrl}/billing?success=true&plan=${order.planId}&ref=${order.orderReference}`
    );
  } else if (isPending) {
    // Do NOT mark failed! Keep order alive so user or webhook can finalize it
    return NextResponse.redirect(
      `${appUrl}/billing?pending=true&ref=${order.orderReference}&orderId=${targetOrderId || ''}`
    );
  } else {
    // Only fail if definitively expired or rejected
    await db.updateOrder(order.id, { status: 'failed' });
    return NextResponse.redirect(
      `${appUrl}/billing?error=payment_failed&ref=${order.orderReference}`
    );
  }
}
