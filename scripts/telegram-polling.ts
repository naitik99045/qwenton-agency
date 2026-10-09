/**
 * Local Telegram Polling Script for Zero-Lag Development
 * Run with: npm run telegram:dev
 */
import { localDb } from '../lib/db/local-db';
import { runAgentLoop } from '../lib/agent-runtime/runner';
import { sendTelegramMessage } from '../lib/telegram/bot';

async function startPolling() {
  const users = localDb.getAllUsers();
  if (users.length === 0) {
    console.log('[Telegram Polling] No local user found. Please launch the web UI first.');
    return;
  }

  const user = users[0];
  const conn = localDb.getTelegramConnection(user.uid);

  if (!conn || !conn.botTokenEncrypted) {
    console.log('[Telegram Polling] No Telegram bot linked yet. Please connect your bot token in the web workspace at /integrations.');
    return;
  }

  console.log(`[Telegram Polling] 🚀 Starting long-polling for ${conn.botUsername}...`);
  let offset = 0;

  while (true) {
    try {
      const url = `https://api.telegram.org/bot${conn.botTokenEncrypted}/getUpdates?offset=${offset}&timeout=30`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          if (update.message?.text) {
            const text = update.message.text.trim();
            const chatId = update.message.chat.id;
            console.log(`[Telegram Received] "${text}" from Chat ${chatId}`);

            const agents = localDb.getAgentsByUser(user.uid);
            const assignedAgent = agents.find((a) => a.id === conn.assignedAgentId) || agents[0];

            if (!assignedAgent) {
              await sendTelegramMessage(conn.botTokenEncrypted, chatId, '⚠️ No active agent available.');
              continue;
            }

            const conversations = localDb.getConversationsByUser(user.uid);
            let conv = conversations.find((c) => c.agentId === assignedAgent.id);
            if (!conv) {
              conv = localDb.createConversation(user.uid, assignedAgent.id, 'Telegram Chat');
            }

            const runner = runAgentLoop({
              agentId: assignedAgent.id,
              conversationId: conv.id,
              userId: user.uid,
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
                  `⚠️ *Human Approval Required*\n\nAction: \`${event.action}\`\nTarget: ${event.target}`,
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
          }
        }
      }
    } catch (err) {
      console.error('[Telegram Polling] Error:', err);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

startPolling();
