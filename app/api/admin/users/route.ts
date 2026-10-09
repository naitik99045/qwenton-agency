import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = getDB();
    const users = await db.getAllUsers();
    return NextResponse.json({ users });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}
