import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { PlanId } from '@/lib/db/types';
import { z } from 'zod';

const updateUserSchema = z.object({
  role: z.enum(['admin', 'user', 'member', 'owner']).optional(),
  planId: z.enum(['normal', 'lite', 'pro', 'ultra']).optional(),
  status: z.enum(['active', 'suspended', 'pending']).optional(),
  displayName: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const admin = await requireAdmin(req);
    const { uid } = await params;
    const body = await req.json();
    const validated = updateUserSchema.parse(body);
    const db = getDB();

    const user = await db.getUser(uid);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await db.saveUser({
      ...user,
      ...validated,
      status: validated.status === 'pending' ? 'pending_verification' : (validated.status || user.status),
      role: validated.role ? (validated.role === 'admin' ? 'admin' : validated.role === 'owner' ? 'admin' : 'user') : user.role,
      planId: (validated.planId || user.planId) as PlanId,
      updatedAt: new Date().toISOString(),
    });

    await db.createAuditEvent({
      actorUid: admin.uid,
      action: 'admin.user.update',
      resource: `users/${uid}`,
      details: {
        targetEmail: user.email,
        updates: validated,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
