import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  try {
    const adminUser = await requireAdmin(req);
    const { uid } = await params;
    const db = getDB();

    const user = await db.getUser(uid);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.status = 'suspended';
    user.updatedAt = new Date().toISOString();
    await db.saveUser(user);

    await db.createAuditEvent({
      actorUid: adminUser.uid,
      action: 'admin.user.suspend',
      resource: `users/${uid}`,
      details: { targetEmail: user.email },
    });

    return NextResponse.json({ user, message: 'User account suspended.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}
