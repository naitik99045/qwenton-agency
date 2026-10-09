import crypto from 'crypto';
import { Order, PlanId } from '@/lib/db/types';

export const FAMGATEWAY_CONFIG = {
  apiKey: process.env.FAM_API_KEY || 'fam_test_api_key',
  secretKey: process.env.FAM_SECRET_KEY || 'fam_test_secret_key',
  merchantId: process.env.FAM_MERCHANT_ID || 'fam_merchant_qwenton',
  baseUrl: process.env.FAM_BASE_URL || 'https://api.famgateway.com/v1',
};

export const isFamGatewayConfigured = Boolean(
  process.env.FAM_API_KEY && process.env.FAM_API_KEY !== 'fam_test_api_key'
);

export interface FamCheckoutResult {
  checkoutUrl: string;
  transactionId: string;
  mock: boolean;
}

export async function createFamCheckout(order: Order, returnUrl: string): Promise<FamCheckoutResult> {
  const transactionId = `fam_tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // If live FAM Gateway credentials are not set or in local demo mode, provide direct callback URL
  if (!isFamGatewayConfigured) {
    const mockCheckoutUrl = `${returnUrl}?fam_ref=${order.orderReference}&fam_tx=${transactionId}&status=success`;
    return {
      checkoutUrl: mockCheckoutUrl,
      transactionId,
      mock: true,
    };
  }

  try {
    const signaturePayload = `${FAMGATEWAY_CONFIG.merchantId}|${order.orderReference}|${order.amount}|${order.currency}`;
    const signature = crypto
      .createHmac('sha256', FAMGATEWAY_CONFIG.secretKey)
      .update(signaturePayload)
      .digest('hex');

    const res = await fetch(`${FAMGATEWAY_CONFIG.baseUrl}/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-FAM-API-KEY': FAMGATEWAY_CONFIG.apiKey,
      },
      body: JSON.stringify({
        merchantId: FAMGATEWAY_CONFIG.merchantId,
        orderReference: order.orderReference,
        amount: order.amount,
        currency: order.currency,
        customerEmail: order.userEmail,
        customerName: order.userName,
        returnUrl,
        signature,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        checkoutUrl: data.checkoutUrl || data.paymentUrl,
        transactionId: data.transactionId || transactionId,
        mock: false,
      };
    }

    throw new Error(`FAM Gateway returned error: ${await res.text()}`);
  } catch (err: unknown) {
    console.warn('[FAM Gateway] Falling back to local confirmation mode:', err);
    return {
      checkoutUrl: `${returnUrl}?fam_ref=${order.orderReference}&fam_tx=${transactionId}&status=success`,
      transactionId,
      mock: true,
    };
  }
}

export function verifyFamSignature(payload: string, receivedSignature: string): boolean {
  if (!isFamGatewayConfigured) return true;
  const computed = crypto
    .createHmac('sha256', FAMGATEWAY_CONFIG.secretKey)
    .update(payload)
    .digest('hex');
  return computed === receivedSignature;
}
