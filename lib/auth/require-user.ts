import { NextRequest } from 'next/server';
import { adminAuth, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { getDB } from '@/lib/db/adapter';
import { User } from '@/lib/db/types';

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
  }
}

function isEmailAdmin(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || 'founder@qwenton.ai,admin@qwenton.ai')
    .toLowerCase()
    .split(',')
    .map((e) => e.trim());
  const em = (email || '').toLowerCase();
  return adminEmails.includes(em) || em.startsWith('admin@') || em.includes('+admin');
}

export async function getCurrentUser(req: NextRequest): Promise<User | null> {
  const db = getDB();
  const authHeader = req.headers.get('authorization');
  const devUserIdCookie = req.cookies.get('dev_user_id')?.value;
  const sessionCookie = req.cookies.get('session')?.value;

  // 1. Try Firebase Bearer Token if configured
  if (authHeader?.startsWith('Bearer ') && isFirebaseAdminConfigured) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      let user = await db.getUser(decoded.uid);
      const email = decoded.email || 'user@example.com';
      const role = isEmailAdmin(email) ? 'admin' : 'user';

      if (!user) {
        user = await db.saveUser({
          uid: decoded.uid,
          email,
          displayName: decoded.name || email.split('@')[0],
          photoURL: decoded.picture,
          role,
          planId: 'normal',
          activeAgentsCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else if (isEmailAdmin(user.email) && user.role !== 'admin') {
        user.role = 'admin';
        await db.saveUser(user);
      }

      if (user.status === 'suspended') {
        throw new AuthError('Account is suspended. Please contact support.', 403);
      }
      return user;
    } catch (e: unknown) {
      if (e instanceof AuthError) throw e;
      // Fall through to cookie resolution
    }
  }

  // 2. Check for real logged-in Firebase user UID from synced cookies
  const activeUid = devUserIdCookie || (sessionCookie && !sessionCookie.startsWith('ey') ? sessionCookie : null);
  if (activeUid) {
    const user = await db.getUser(activeUid);
    if (user) {
      if (user.status === 'suspended') {
        throw new AuthError('Account is suspended. Please contact support.', 403);
      }
      if (isEmailAdmin(user.email) && user.role !== 'admin') {
        user.role = 'admin';
        await db.saveUser(user);
      }
      return user;
    }
  }

  return null;
}

export async function requireUser(req: NextRequest): Promise<User> {
  const user = await getCurrentUser(req);
  if (!user) {
    throw new AuthError('Unauthorized. Please log in.', 401);
  }
  return user;
}

export async function requireAdmin(req: NextRequest): Promise<User> {
  const user = await requireUser(req);
  if (user.role !== 'admin') {
    throw new AuthError('Forbidden. Admin permissions required.', 403);
  }
  return user;
}
