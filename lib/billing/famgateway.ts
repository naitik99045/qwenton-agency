import crypto from 'crypto';
import { Order } from '@/lib/db/types';

// FamGateway (https://famgateway.in) Configuration
// Only 1 environment variable is needed: FAMGATEWAY_API_KEY (or FAM_API_KEY)
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
}

/**
 * Creates a dynamic UPI payment session on FamGateway (https://famgateway.in/api/create-order)
 */
export async function createFamCheckout(order: Order, redirectUrl: string): Promise<FamCheckoutResult> {
  const mockOrderId = `fg_mock_${Date.now().toString(36)}`;

  // Fallback for local testing if API key is not configured
  if (!isFamGatewayConfigured) {
    const mockCheckoutUrl = `${redirectUrl}?fam_ref=${order.orderReference}&order_id=${mockOrderId}&status=success`;
    return {
      checkoutUrl: mockCheckoutUrl,
      orderId: mockOrderId,
      payableAmount: order.amount,
      mock: true,
    };
  }

  try {
    const res = await fetch(`${FAMGATEWAY_BASE_URL}/api/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': FAMGATEWAY_API_KEY,
      },
      body: JSON.stringify({
        api_key: FAMGATEWAY_API_KEY,
        amount: Number(order.amount),
        customer_name: order.userName || 'Customer',
        customer_email: order.userEmail || undefined,
        redirect_url: redirectUrl,
      }),
    });

    const data = await res.json();

    if (res.ok && data.status === 'success' && data.data) {
      return {
        checkoutUrl: data.data.checkout_url || `${FAMGATEWAY_BASE_URL}/pay.php?order_id=${data.data.order_id}`,
        qrUrl: data.data.qr_url,
        upiIntent: data.data.upi_intent,
        orderId: data.data.order_id,
        payableAmount: Number(data.data.payable_amount || order.amount),
        mock: false,
      };
    }

    throw new Error(data.message || data.error || `FamGateway error HTTP ${res.status}`);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('[FamGateway] API call error, falling back to local confirmation:', errorMsg);
    return {
      checkoutUrl: `${redirectUrl}?fam_ref=${order.orderReference}&order_id=${mockOrderId}&status=success`,
      orderId: mockOrderId,
      payableAmount: order.amount,
      mock: true,
    };
  }
}

/**
 * Server-to-server authoritative order verification (https://famgateway.in/api/verify-order.php)
 */
export async function verifyFamOrder(orderId: string): Promise<FamVerifyResult> {
  if (!isFamGatewayConfigured) {
    return { status: 'success', orderId };
  }

  try {
    const res = await fetch(
      `${FAMGATEWAY_BASE_URL}/api/verify-order.php?api_key=${encodeURIComponent(FAMGATEWAY_API_KEY)}&order_id=${encodeURIComponent(orderId)}`,
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      }
    );

    const data = await res.json();
    if (data.status === 'success' && data.data) {
      return {
        status: 'success',
        orderId: data.data.order_id || orderId,
        utr: data.data.utr,
        senderName: data.data.sender_name,
        amount: data.data.amount,
      };
    }

    return {
      status: data.status === 'expired' ? 'expired' : 'pending',
      orderId,
    };
  } catch (err) {
    console.error('[FamGateway] Verification check failed:', err);
    return { status: 'pending', orderId };
  }
}

/**
 * Verifies the cryptographic HMAC-SHA256 signature sent in X-FamGateway-Signature header
 * (FamGateway uses the active API Key as the HMAC secret)
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
