import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { sendOtpEmail } from '@/lib/email/emailjs';
import { PlanId } from '@/lib/db/types';
import { z } from 'zod';

const requestOtpSchema = z.object({
  planId: z.enum(['lite', 'pro', 'ultra']),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { planId } = requestOtpSchema.parse(body);
    const db = getDB();

    const plan = await db.getPlan(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Selected plan not found' }, { status: 404 });
    }

    // 1. Generate secure 6-digit OTP code (100000 to 999999)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Generate unique purchase reference: QW-2026-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
    const purchaseReference = `QW-2026-${randomSuffix}`;

    // 3. Expiry: 10 minutes from now
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 4. Create Order in Database
    const order = await db.createOrder({
      orderReference: purchaseReference,
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || user.email.split('@')[0],
      planId: plan.id as PlanId,
      amount: plan.price,
      currency: 'USD',
      status: 'otp_pending',
      otpCode,
      otpExpiresAt,
      gateway: 'famgateway',
    });

    // 5. Send OTP Email via EmailJS
    const emailResult = await sendOtpEmail({
      toEmail: user.email,
      userName: user.displayName || user.email.split('@')[0],
      otpCode,
      purchaseReference,
      expiresInMinutes: '10',
    });

    return NextResponse.json({
      success: true,
      orderReference: purchaseReference,
      expiresInMinutes: 10,
      emailSent: emailResult.ok,
      message: `A 6-digit confirmation code has been sent to ${user.email}. Please verify to proceed to payment.`,
      // In dev mode, return code for testing convenience
      ...(process.env.NODE_ENV !== 'production' ? { devOtpCode: otpCode } : {}),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
