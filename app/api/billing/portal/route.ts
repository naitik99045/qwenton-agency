import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { stripe, isStripeConfigured } from '@/lib/billing/stripe';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const appUrl = `${protocol}://${host}`;

    if (!isStripeConfigured || !user.stripeCustomerId) {
      return NextResponse.json({
        url: `${appUrl}/billing?notice=portal_mock`,
        mock: true,
        message: 'Stripe Customer Portal simulated in development mode.',
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
