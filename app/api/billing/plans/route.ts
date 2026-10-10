import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/adapter';

export async function GET() {
  try {
    const db = getDB();
    const plans = await db.getPlans();
    return NextResponse.json({ plans });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
