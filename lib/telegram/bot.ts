export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
}

export interface TelegramBotInfo {
  ok: boolean;
  result?: TelegramUser;
  description?: string;
}

export async function validateBotToken(botToken: string): Promise<{ ok: boolean; username?: string; error?: string }> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
      method: 'GET',
    });
    const data: TelegramBotInfo = await res.json();
    if (data.ok && data.result) {
      return { ok: true, username: data.result.username || data.result.first_name };
    }
    return { ok: false, error: data.description || 'Invalid Telegram bot token' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Telegram API error: ${msg}` };
  }
}

export async function setTelegramWebhook(botToken: string, webhookUrl: string, secretToken?: string): Promise<boolean> {
  try {
    const body: Record<string, unknown> = { url: webhookUrl };
    if (secretToken) body.secret_token = secretToken;

    const res = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Boolean(data.ok);
  } catch (e) {
    console.error('[Telegram Webhook] Failed to register:', e);
    return false;
  }
}

export async function deleteTelegramWebhook(botToken: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`, {
      method: 'POST',
    });
    const data = await res.json();
    return Boolean(data.ok);
  } catch (e) {
    return false;
  }
}

export async function sendTelegramMessage(
  botToken: string,
  chatId: number | string,
  text: string,
  inlineButtons?: Array<{ text: string; callback_data: string }>
): Promise<boolean> {
  try {
    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    };

    if (inlineButtons && inlineButtons.length > 0) {
      payload.reply_markup = {
        inline_keyboard: [inlineButtons],
      };
    }

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return Boolean(data.ok);
  } catch (e) {
    console.error('[Telegram Send] Error:', e);
    return false;
  }
}
