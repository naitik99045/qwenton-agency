import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { deleteTelegramWebhook } from '@/lib/telegram/bot';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();
    const conn = await db.getTelegramConnection(user.uid);

    if (conn) {
      await deleteTelegramWebhook(conn.botTokenEncrypted);
      await db.deleteTelegramConnection(conn.id);
    }

    return NextResponse.json({ success: true, message: 'Telegram bot disconnected.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
