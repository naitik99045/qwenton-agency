import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/require-user';
import { getUserEntitlements } from '@/lib/limits/entitlements';
import { getDB } from '@/lib/db/adapter';
import { adminAuth, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { z } from 'zod';

const syncSessionSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. No active session.' }, { status: 401 });
    }
    const entitlements = await getUserEntitlements(user.uid);

    return NextResponse.json({
      user,
      entitlements,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const body = await req.json();
    const { uid, email, displayName } = syncSessionSchema.parse(body);
    const db = getDB();

    let verifiedUid = uid;
    let verifiedEmail = email;

    // Cryptographically verify Bearer token if Firebase Admin is configured
    if (authHeader?.startsWith('Bearer ') && isFirebaseAdminConfigured) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        verifiedUid = decoded.uid;
        verifiedEmail = decoded.email || email;
      } catch (tokenErr) {
        console.warn('[Session Sync] Invalid Firebase ID Token rejected:', tokenErr);
        return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
      }
    }

    const defaultAdmins = ['netiktalreja@gmail.com', 'admin@qwenton.shop'];
    const adminEmails = (process.env.ADMIN_EMAILS || defaultAdmins.join(','))
      .toLowerCase()
      .split(',')
      .map((e) => e.trim());
    const lowerEmail = verifiedEmail.toLowerCase();
    const isAdmin =
      adminEmails.includes(lowerEmail) ||
      defaultAdmins.includes(lowerEmail) ||
      lowerEmail === 'netiktalreja@gmail.com' ||
      verifiedUid === 'xFrBVnoWqWWpVEgQzuOqDDjiIAg1';

    let user = await db.getUser(verifiedUid);
    if (!user) {
      user = await db.saveUser({
        uid: verifiedUid,
        email: verifiedEmail,
        displayName: displayName || verifiedEmail.split('@')[0],
        role: isAdmin ? 'admin' : 'user',
        planId: isAdmin ? 'ultra' : 'normal',
        activeAgentsCount: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else if (isAdmin && user.role !== 'admin') {
      user.role = 'admin';
      user.planId = 'ultra';
      await db.saveUser(user);
    } else if (user.role === 'admin' && user.planId === 'normal') {
      user.planId = 'ultra';
      await db.saveUser(user);
    }

    const entitlements = await getUserEntitlements(user.uid);

    return NextResponse.json({
      success: true,
      user,
      entitlements,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
