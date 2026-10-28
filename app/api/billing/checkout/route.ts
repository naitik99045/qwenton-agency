import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { stripe, isStripeConfigured } from '@/lib/billing/stripe';
import { getDB } from '@/lib/db/adapter';
import { z } from 'zod';

const checkoutSchema = z.object({
  planId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { planId } = checkoutSchema.parse(body);
    const db = getDB();

    const plan = await db.getPlan(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const appUrl = `${protocol}://${host}`;

    if (!isStripeConfigured) {
      // Mock instant checkout upgrade for zero-friction local development
      const updatedUser = await db.saveUser({
        ...user,
        planId: plan.id,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({
        url: `${appUrl}/billing?success=true`,
        mock: true,
        message: `Upgraded to ${plan.name} in local demo mode!`,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: (plan as any).stripePriceId || 'price_123',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      client_reference_id: user.uid,
      customer_email: user.email,
      success_url: `${appUrl}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing?canceled=true`,
      metadata: {
        userId: user.uid,
        planId: plan.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
