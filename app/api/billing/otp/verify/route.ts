import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { z } from 'zod';

const verifyOtpSchema = z.object({
  orderReference: z.string(),
  otpCode: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { orderReference, otpCode } = verifyOtpSchema.parse(body);
    const db = getDB();

    const order = await db.getOrderByReference(orderReference);
    if (!order || order.userId !== user.uid) {
      return NextResponse.json({ error: 'Order reference not found' }, { status: 404 });
    }

    if (order.status !== 'otp_pending') {
      return NextResponse.json({
        error: `Order status is "${order.status}". OTP verification already completed or expired.`,
      }, { status: 400 });
    }

    // Check expiry
    if (order.otpExpiresAt && new Date(order.otpExpiresAt).getTime() < Date.now()) {
      await db.updateOrder(order.id, { status: 'failed' });
      return NextResponse.json({ error: 'OTP code has expired. Please request a new code.' }, { status: 400 });
    }

    // Check code match
    if (order.otpCode !== otpCode.trim()) {
      return NextResponse.json({ error: 'Invalid verification code. Please check your email.' }, { status: 400 });
    }

    // Mark order as otp_verified
    const updatedOrder = await db.updateOrder(order.id, {
      status: 'otp_verified',
    });

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'billing.otp.verified',
      resource: `orders/${order.id}`,
      details: { orderReference: order.orderReference, planId: order.planId },
    });

    return NextResponse.json({
      verified: true,
      order: updatedOrder,
      message: 'OTP verified successfully! Proceeding to payment gateway.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
