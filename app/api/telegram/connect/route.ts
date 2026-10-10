import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { validateBotToken, setTelegramWebhook } from '@/lib/telegram/bot';
import { z } from 'zod';

const connectBotSchema = z.object({
  botToken: z.string().min(20),
  agentId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { botToken, agentId } = connectBotSchema.parse(body);
    const db = getDB();

    // 1. Validate token with Telegram getMe
    const validation = await validateBotToken(botToken);
    if (!validation.ok || !validation.username) {
      return NextResponse.json({ error: validation.error || 'Invalid bot token' }, { status: 400 });
    }

    // 2. Set webhook if production URL is provided
    const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
    if (rawAppUrl && (rawAppUrl.startsWith('https://') || rawAppUrl.startsWith('http://'))) {
      const webhookUrl = `${rawAppUrl}/api/telegram/webhook?uid=${encodeURIComponent(user.uid)}`;
      await setTelegramWebhook(botToken, webhookUrl, user.uid);
    }

    // 3. Save connection
    const connection = await db.saveTelegramConnection({
      id: `tg_${user.uid}`,
      ownerUid: user.uid,
      botUsername: `@${validation.username}`,
      botTokenEncrypted: botToken,
      assignedAgentId: agentId,
      status: 'connected',
      lastTestedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'telegram.connect',
      resource: `telegram/${connection.id}`,
      details: { botUsername: connection.botUsername },
    });

    return NextResponse.json({
      connection,
      message: `Successfully linked ${connection.botUsername}! You can now chat with your agent via Telegram.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
