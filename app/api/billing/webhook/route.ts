import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/billing/stripe';
import { getDB } from '@/lib/db/adapter';
import { PlanId } from '@/lib/db/types';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: 'Missing webhook secret or signature' }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Webhook signature verification failed: ${msg}` }, { status: 400 });
  }

  const db = getDB();

  // Handle relevant events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.userId;
      const planId = session.metadata?.planId;

      if (userId && planId) {
        const user = await db.getUser(userId);
        if (user) {
          await db.saveUser({
            ...user,
            planId: planId as PlanId,
            stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
            updatedAt: new Date().toISOString(),
          });
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const users = await db.getAllUsers();
      const matchedUser = users.find((u) => u.stripeCustomerId === subscription.customer);
      if (matchedUser) {
        await db.saveUser({
          ...matchedUser,
          planId: 'normal',
          updatedAt: new Date().toISOString(),
        });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
