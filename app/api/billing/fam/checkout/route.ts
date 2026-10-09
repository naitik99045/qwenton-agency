import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { createFamCheckout } from '@/lib/billing/famgateway';
import { z } from 'zod';

const famCheckoutSchema = z.object({
  orderReference: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { orderReference } = famCheckoutSchema.parse(body);
    const db = getDB();

    const order = await db.getOrderByReference(orderReference);
    if (!order || order.userId !== user.uid) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'otp_verified') {
      return NextResponse.json({
        error: `Order is not verified. Current status: "${order.status}". Please complete OTP verification first.`,
      }, { status: 400 });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const appUrl = `${protocol}://${host}`;
    const returnUrl = `${appUrl}/api/billing/fam/callback`;

    const checkoutResult = await createFamCheckout(order, returnUrl);

    await db.updateOrder(order.id, {
      gatewayTransactionId: checkoutResult.transactionId,
    });

    return NextResponse.json({
      checkoutUrl: checkoutResult.checkoutUrl,
      transactionId: checkoutResult.transactionId,
      mock: checkoutResult.mock,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
