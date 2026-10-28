import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { InstagramAutoReplySettings } from '@/lib/db/types';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();

    const existing = await db.getInstagramSettings(user.uid);
    if (!existing) {
      const defaultSettings: InstagramAutoReplySettings = {
        id: `ig_settings_${user.uid}`,
        ownerUid: user.uid,
        isBusyModeActive: false,
        busyModeMessage: "Hey there! I'm currently busy in deep work or meetings. Our autonomous assistant is monitoring this inbox. Let me know what you need or type 'PRICE' for packages!",
        dmKeywordTriggers: [
          {
            id: 'kw_1',
            keyword: 'PRICE',
            reply: 'Our plans start from ₹0 (Normal Plan) up to ₹599/mo (Ultra Business with 15 Bots & 15 Reels). View details: https://qwenton.ai/pricing',
            active: true,
          },
          {
            id: 'kw_2',
            keyword: 'BOOK',
            reply: 'You can book a 1-on-1 strategy session directly with our team here: https://calendly.com/qwenton',
            active: true,
          },
        ],
        fallbackAiReply: true,
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json({ settings: defaultSettings });
    }

    return NextResponse.json({ settings: existing });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const db = getDB();

    const {
      isBusyModeActive,
      busyModeMessage,
      dmKeywordTriggers,
      fallbackAiReply,
      assignedAgentId,
    } = body;

    const current = await db.getInstagramSettings(user.uid);

    const updatedSettings: InstagramAutoReplySettings = {
      id: `ig_settings_${user.uid}`,
      ownerUid: user.uid,
      isBusyModeActive: Boolean(isBusyModeActive),
      busyModeMessage: busyModeMessage?.trim() || current?.busyModeMessage || "I'm currently busy or away. Our AI assistant will follow up shortly!",
      dmKeywordTriggers: Array.isArray(dmKeywordTriggers) ? dmKeywordTriggers : (current?.dmKeywordTriggers || []),
      fallbackAiReply: fallbackAiReply !== undefined ? Boolean(fallbackAiReply) : true,
      assignedAgentId: assignedAgentId || current?.assignedAgentId || undefined,
      updatedAt: new Date().toISOString(),
    };

    const saved = await db.saveInstagramSettings(updatedSettings);

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'instagram.settings_updated',
      resource: `instagram_settings/${saved.id}`,
      details: {
        isBusyModeActive: saved.isBusyModeActive,
        triggersCount: saved.dmKeywordTriggers.length,
      },
    });

    return NextResponse.json({
      success: true,
      settings: saved,
      message: 'Instagram away mode & DM triggers updated successfully!',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
