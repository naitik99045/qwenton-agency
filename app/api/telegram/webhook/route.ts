import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/adapter';
import { sendTelegramMessage } from '@/lib/telegram/bot';
import { runAgentLoop } from '@/lib/agent-runtime/runner';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const db = getDB();

    // 1. Handle Callback Query (Approval Inline Buttons)
    if (update.callback_query) {
      const callback = update.callback_query;
      const callbackData = String(callback.data || '');
      const chatId = callback.message?.chat?.id;

      if (callbackData.startsWith('appr_ok:')) {
        const approvalId = callbackData.split(':')[1];
        const approval = await db.getApproval(approvalId);
        if (approval) {
          await db.updateApproval(approvalId, 'approved', `telegram_${callback.from?.id}`);
          if (approval.runId) {
            await db.updateRun(approval.runId, { status: 'completed', completedAt: new Date().toISOString() });
          }
          const conn = await db.getTelegramConnection(approval.ownerUid);
          if (conn && chatId) {
            await sendTelegramMessage(conn.botTokenEncrypted, chatId, `✅ *Approved & Executed:* Action \`${approval.actionType}\``);
          }
        }
      } else if (callbackData.startsWith('appr_no:')) {
        const approvalId = callbackData.split(':')[1];
        const approval = await db.getApproval(approvalId);
        if (approval) {
          await db.updateApproval(approvalId, 'rejected', `telegram_${callback.from?.id}`);
          if (approval.runId) {
            await db.updateRun(approval.runId, { status: 'cancelled', completedAt: new Date().toISOString() });
          }
          const conn = await db.getTelegramConnection(approval.ownerUid);
          if (conn && chatId) {
            await sendTelegramMessage(conn.botTokenEncrypted, chatId, `❌ *Rejected & Cancelled:* Action \`${approval.actionType}\``);
          }
        }
      }

      return NextResponse.json({ ok: true });
    }

    // 2. Handle standard Telegram Message
    const message = update.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();

    // Find the exact tenant user associated with this telegram bot
    const url = new URL(req.url);
    const targetUid =
      req.headers.get('x-telegram-bot-api-secret-token') ||
      url.searchParams.get('uid');

    let matchedUser = targetUid ? await db.getUser(targetUid) : null;
    if (!matchedUser) {
      const users = await db.getAllUsers();
      matchedUser = users[0];
    }

    if (!matchedUser) {
      return NextResponse.json({ ok: true });
    }

    let conn = await db.getTelegramConnection(matchedUser.uid);
    if (!conn) {
      return NextResponse.json({ ok: true });
    }

    // Handle standard commands
    if (text === '/start' || text === '/help') {
      const helpText = `👋 *Welcome to qwenton-agents Telegram Gateway!*\n\nAvailable commands:\n• \`/agents\` — List your active AI agents\n• \`/status\` — View active runs and approvals\n• Send any text to chat directly with your assigned agent.`;
      await sendTelegramMessage(conn.botTokenEncrypted, chatId, helpText);
      return NextResponse.json({ ok: true });
    }

    if (text === '/agents') {
      const agents = await db.getAgentsByUser(matchedUser.uid);
      const listText = agents.map((a, i) => `${i + 1}. *${a.name}* (${a.role})`).join('\n');
      await sendTelegramMessage(conn.botTokenEncrypted, chatId, `🤖 *Your Active Agents:*\n\n${listText || 'No agents created yet.'}`);
      return NextResponse.json({ ok: true });
    }

    // Run agent with message
    const agents = await db.getAgentsByUser(matchedUser.uid);
    const assignedAgent = agents.find((a) => a.id === conn?.assignedAgentId) || agents[0];

    if (!assignedAgent) {
      await sendTelegramMessage(conn.botTokenEncrypted, chatId, '⚠️ No active agent found on your account. Please create an agent first.');
      return NextResponse.json({ ok: true });
    }

    // Create or retrieve conversation
    const conversations = await db.getConversationsByUser(matchedUser.uid);
    let conv = conversations.find((c) => c.agentId === assignedAgent.id);
    if (!conv) {
      conv = await db.createConversation(matchedUser.uid, assignedAgent.id, 'Telegram Chat');
    }

    const runner = runAgentLoop({
      agentId: assignedAgent.id,
      conversationId: conv.id,
      userId: matchedUser.uid,
      userPrompt: text,
    });

    let finalReply = '';
    for await (const event of runner) {
      if (event.type === 'token') {
        finalReply += event.content;
      } else if (event.type === 'approval_required') {
        await sendTelegramMessage(
          conn.botTokenEncrypted,
          chatId,
          `⚠️ *Human Approval Required*\n\nAgent *${assignedAgent.name}* wants to execute: \`${event.action}\`\n\n*Target:* ${event.target}\n*Details:* \`\`\`json\n${JSON.stringify(event.payload, null, 2)}\n\`\`\``,
          [
            { text: '✅ Approve', callback_data: `appr_ok:${event.approvalId}` },
            { text: '❌ Reject', callback_data: `appr_no:${event.approvalId}` },
          ]
        );
      }
    }

    if (finalReply) {
      await sendTelegramMessage(conn.botTokenEncrypted, chatId, finalReply);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Telegram Webhook] Error processing:', err);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
