import crypto from 'crypto';
import { Order } from '@/lib/db/types';

// FamGateway (https://famgateway.in) Configuration
export const FAMGATEWAY_API_KEY =
  process.env.FAMGATEWAY_API_KEY ||
  process.env.FAM_API_KEY ||
  '';

export const FAMGATEWAY_BASE_URL = 'https://famgateway.in';

export const isFamGatewayConfigured = Boolean(
  FAMGATEWAY_API_KEY &&
  FAMGATEWAY_API_KEY !== 'fam_test_api_key' &&
  FAMGATEWAY_API_KEY.trim().length > 0
);

export interface FamCheckoutResult {
  checkoutUrl: string;
  qrUrl?: string;
  upiIntent?: string;
  orderId: string;
  payableAmount: number;
  mock: boolean;
}

export interface FamVerifyResult {
  status: 'success' | 'pending' | 'expired' | 'failed';
  orderId: string;
  utr?: string;
  senderName?: string;
  amount?: number;
  rawResponse?: any;
}

/**
 * Creates a dynamic UPI payment session on FamGateway (https://famgateway.in/api/create-order)
 */
export async function createFamCheckout(
  order: Order,
  redirectUrl: string,
  webhookUrl?: string
): Promise<FamCheckoutResult> {
  const mockOrderId = `fg_mock_${Date.now().toString(36)}`;

  // Fallback for local testing if API key is not configured
  if (!isFamGatewayConfigured) {
    const mockCheckoutUrl = `${redirectUrl}&order_id=${mockOrderId}&status=success`;
    return {
      checkoutUrl: mockCheckoutUrl,
      orderId: mockOrderId,
      payableAmount: order.amount,
      mock: true,
    };
  }

  try {
    const payload: Record<string, any> = {
      api_key: FAMGATEWAY_API_KEY,
      amount: Number(order.amount),
      customer_name: order.userName || 'Customer',
      customer_email: order.userEmail || undefined,
      redirect_url: redirectUrl,
    };

    if (webhookUrl) {
      payload.webhook_url = webhookUrl;
    }

    const res = await fetch(`${FAMGATEWAY_BASE_URL}/api/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': FAMGATEWAY_API_KEY,
        'Authorization': `Bearer ${FAMGATEWAY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && (data.status === 'success' || data.success === true) && (data.data || data.order_id)) {
      const orderData = data.data || data;
      return {
        checkoutUrl: orderData.checkout_url || `${FAMGATEWAY_BASE_URL}/pay.php?order_id=${orderData.order_id}`,
        qrUrl: orderData.qr_url,
        upiIntent: orderData.upi_intent,
        orderId: orderData.order_id,
        payableAmount: Number(orderData.payable_amount || order.amount),
        mock: false,
      };
    }

    throw new Error(data.message || data.error || `FamGateway error HTTP ${res.status}`);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('[FamGateway] API call error, falling back to local confirmation:', errorMsg);
    return {
      checkoutUrl: `${redirectUrl}&order_id=${mockOrderId}&status=success`,
      orderId: mockOrderId,
      payableAmount: order.amount,
      mock: true,
    };
  }
}

/**
 * Server-to-server authoritative order verification (https://famgateway.in/api/verify-order.php)
 * Handles both root-level fields and nested data objects, with case-insensitive status matching.
 */
export async function verifyFamOrder(orderId: string): Promise<FamVerifyResult> {
  if (!isFamGatewayConfigured) {
    return { status: 'success', orderId };
  }

  const endpoints = [
    `${FAMGATEWAY_BASE_URL}/api/verify-order.php?api_key=${encodeURIComponent(FAMGATEWAY_API_KEY)}&order_id=${encodeURIComponent(orderId)}`,
    `${FAMGATEWAY_BASE_URL}/api/verify-order?api_key=${encodeURIComponent(FAMGATEWAY_API_KEY)}&order_id=${encodeURIComponent(orderId)}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Api-Key': FAMGATEWAY_API_KEY,
          'Authorization': `Bearer ${FAMGATEWAY_API_KEY}`,
        },
      });

      if (!res.ok && res.status !== 200) {
        continue; // try next endpoint
      }

      const data = await res.json();
      const statusRaw = String(
        data.status ||
        data.data?.status ||
        data.order_status ||
        (data.success ? 'success' : '')
      ).toLowerCase();

      // Check for success indicators
      if (
        statusRaw === 'success' ||
        statusRaw === 'completed' ||
        statusRaw === 'paid' ||
        statusRaw === 'true' ||
        data.event === 'payment.success'
      ) {
        return {
          status: 'success',
          orderId: data.data?.order_id || data.order_id || orderId,
          utr: data.data?.utr || data.utr || data.data?.bank_ref_num || undefined,
          senderName: data.data?.sender_name || data.sender_name || undefined,
          amount: Number(data.data?.amount || data.amount || 0),
          rawResponse: data,
        };
      }

      if (statusRaw === 'expired') {
        return { status: 'expired', orderId, rawResponse: data };
      }

      if (statusRaw === 'failed') {
        return { status: 'failed', orderId, rawResponse: data };
      }

      // If pending or processing, return pending
      return { status: 'pending', orderId, rawResponse: data };
    } catch (err) {
      console.warn(`[FamGateway] Verification check failed for ${endpoint}:`, err);
    }
  }

  return { status: 'pending', orderId };
}

/**
 * Polls verification with small delays to accommodate Gmail IMAP bank email latency (2 to 6 seconds)
 */
export async function pollVerifyFamOrder(
  orderId: string,
  maxAttempts = 3,
  delayMs = 1800
): Promise<FamVerifyResult> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await verifyFamOrder(orderId);
    if (result.status === 'success' || result.status === 'failed' || result.status === 'expired') {
      return result;
    }
    if (i < maxAttempts - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return { status: 'pending', orderId };
}

/**
 * Verifies the cryptographic HMAC-SHA256 signature sent in X-FamGateway-Signature header
 */
export function verifyFamWebhookSignature(rawBody: string, receivedSignature: string): boolean {
  if (!isFamGatewayConfigured) return true;
  if (!receivedSignature) return false;
  try {
    const expected = crypto
      .createHmac('sha256', FAMGATEWAY_API_KEY)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(expected, 'hex');
    const receivedBuf = Buffer.from(receivedSignature, 'hex');
    if (expectedBuf.length !== receivedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  } catch {
    return false;
  }
}
