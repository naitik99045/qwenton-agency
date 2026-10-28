import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/adapter';
import { verifyMetaSignature } from '@/lib/instagram/security';
import { replyToComment, sendPrivateReply, sendDirectMessage } from '@/lib/instagram/api';

const DEFAULT_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'qwenton_meta_verify_token_2026';

/**
 * GET: Meta Webhook Challenge Handshake Verification
 * Meta sends hub.mode, hub.verify_token, and hub.challenge
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === DEFAULT_VERIFY_TOKEN) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ error: 'Forbidden: Invalid verify token' }, { status: 403 });
}

/**
 * POST: Real-Time Event Dispatcher for Instagram Comments & Messages
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256');
    const appSecret = process.env.META_APP_SECRET;

    // Validate signature if appSecret is configured in environment
    if (appSecret && !verifyMetaSignature(rawBody, signature, appSecret)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody || '{}');
    const db = getDB();

    if (payload.object === 'instagram' || payload.object === 'page') {
      const entries = payload.entry || [];

      for (const entry of entries) {
        // 1. Process Reel / Post Comments
        if (Array.isArray(entry.changes)) {
          for (const change of entry.changes) {
            if (change.field === 'comments') {
              const value = change.value;
              const commentId = value.id;
              const commentText = (value.text || '').trim();
              const commenterId = value.from?.id;
              const mediaId = value.media?.id;

              if (!commentText || !commentId) continue;

              // Find matching InstagramReelRule across connected integrations
              // In local DB / Firestore, search all active rules matching keyword
              const allUsers = await db.getAllUsers?.() || [];
              for (const u of allUsers) {
                const rules = await db.getInstagramReelRules(u.uid);
                const activeRule = rules.find((r) => {
                  if (r.status !== 'active') return false;
                  const kw = r.triggerKeyword.toUpperCase().trim();
                  return commentText.toUpperCase().includes(kw);
                });

                if (activeRule) {
                  // Get user's connected Instagram API token
                  const userIntegrations = await db.getIntegrationsByUser(u.uid);
                  const igInt = userIntegrations.find((i) => i.provider === 'instagram' && i.status === 'connected');
                  const token = igInt?.config?.apiKeyEncrypted ? String(igInt.config.apiKeyEncrypted) : undefined;

                  if (token) {
                    // Pick random public reply
                    const publicReplies = activeRule.publicReplies.length > 0
                      ? activeRule.publicReplies
                      : ['Check your DM! Just sent you the details 🚀'];
                    const pickedReply = publicReplies[Math.floor(Math.random() * publicReplies.length)];

                    // Dispatch Public Reply & Private DM
                    await Promise.allSettled([
                      replyToComment({ commentId, message: pickedReply, accessToken: token }),
                      sendPrivateReply({ commentId, message: activeRule.dmMessage, accessToken: token }),
                    ]);

                    // Update rule statistics
                    activeRule.totalCommentsHandled = (activeRule.totalCommentsHandled || 0) + 1;
                    activeRule.totalDmsSent = (activeRule.totalDmsSent || 0) + 1;
                    activeRule.updatedAt = new Date().toISOString();
                    await db.saveInstagramReelRule(activeRule);
                  }
                  break; // Handled
                }
              }
            }
          }
        }

        // 2. Process Direct Messages (Away / Busy Mode)
        if (Array.isArray(entry.messaging)) {
          for (const msgEvent of entry.messaging) {
            const senderId = msgEvent.sender?.id;
            const text = (msgEvent.message?.text || '').trim();

            if (!senderId || !text) continue;

            const allUsers = await db.getAllUsers?.() || [];
            for (const u of allUsers) {
              const settings = await db.getInstagramSettings(u.uid);
              if (!settings) continue;

              const userIntegrations = await db.getIntegrationsByUser(u.uid);
              const igInt = userIntegrations.find((i) => i.provider === 'instagram' && i.status === 'connected');
              const token = igInt?.config?.apiKeyEncrypted ? String(igInt.config.apiKeyEncrypted) : undefined;

              if (!token) continue;

              // Check DM keyword triggers
              const matchedKw = settings.dmKeywordTriggers?.find(
                (k: { active: boolean; keyword: string; reply: string }) =>
                  k.active && text.toUpperCase().includes(k.keyword.toUpperCase())
              );

              if (matchedKw) {
                await sendDirectMessage({
                  recipientId: senderId,
                  message: matchedKw.reply,
                  accessToken: token,
                });
                break;
              }

              // Check Busy Mode
              if (settings.isBusyModeActive && settings.busyModeMessage) {
                await sendDirectMessage({
                  recipientId: senderId,
                  message: settings.busyModeMessage,
                  accessToken: token,
                });
                break;
              }
            }
          }
        }
      }
    }

    // Always respond 200 OK quickly to satisfy Meta Webhook delivery timeout
    return NextResponse.json({ success: true, processed: true }, { status: 200 });
  } catch (err: unknown) {
    console.error('Meta Webhook error:', err);
    return NextResponse.json({ success: true, error: 'Internal processing error logged' }, { status: 200 });
  }
}
