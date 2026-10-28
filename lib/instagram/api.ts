/**
 * Meta Graph API v20.0 Client for Instagram
 * Provides direct HTTP execution for:
 * 1. Public Reel comment replies (POST /{comment_id}/replies)
 * 2. Instant Private 1-to-1 DMs to commenters (POST /{comment_id}/private_replies)
 * 3. Direct Messages to users (POST /v20.0/me/messages)
 */

const GRAPH_API_BASE = 'https://graph.facebook.com/v20.0';

export interface MetaApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface InstagramCommentReplyPayload {
  commentId: string;
  message: string;
  accessToken: string;
}

export interface InstagramPrivateReplyPayload {
  commentId: string;
  message: string;
  accessToken: string;
}

export interface InstagramDirectMessagePayload {
  recipientId: string;
  message: string;
  accessToken: string;
}

/**
 * Sends a public reply to a comment on an Instagram Reel or post.
 */
export async function replyToComment({
  commentId,
  message,
  accessToken,
}: InstagramCommentReplyPayload): Promise<MetaApiResponse<{ id: string }>> {
  if (!commentId || !message || !accessToken) {
    return { success: false, error: 'Missing required parameters for comment reply.' };
  }

  try {
    const url = `${GRAPH_API_BASE}/${encodeURIComponent(commentId)}/replies`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.error?.message || `Meta API error (${res.status})`;
      return { success: false, error: errMsg, statusCode: res.status, data };
    }

    return { success: true, data: { id: data.id } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Sends an instant private DM to a commenter on an Instagram Reel (Meta Private Reply API).
 * This endpoint allows sending a 1-to-1 direct message within 7 days of the comment.
 */
export async function sendPrivateReply({
  commentId,
  message,
  accessToken,
}: InstagramPrivateReplyPayload): Promise<MetaApiResponse<{ id: string }>> {
  if (!commentId || !message || !accessToken) {
    return { success: false, error: 'Missing required parameters for private reply.' };
  }

  try {
    // Meta v20.0 Private Reply endpoint
    const url = `${GRAPH_API_BASE}/${encodeURIComponent(commentId)}/private_replies`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.error?.message || `Meta API error (${res.status})`;
      return { success: false, error: errMsg, statusCode: res.status, data };
    }

    return { success: true, data: { id: data.id || 'sent' } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Sends a standard Direct Message via Instagram Graph Send API.
 */
export async function sendDirectMessage({
  recipientId,
  message,
  accessToken,
}: InstagramDirectMessagePayload): Promise<MetaApiResponse<{ message_id: string }>> {
  if (!recipientId || !message || !accessToken) {
    return { success: false, error: 'Missing required parameters for direct message.' };
  }

  try {
    const url = `${GRAPH_API_BASE}/me/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.error?.message || `Meta API error (${res.status})`;
      return { success: false, error: errMsg, statusCode: res.status, data };
    }

    return { success: true, data: { message_id: data.message_id || data.id } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}
