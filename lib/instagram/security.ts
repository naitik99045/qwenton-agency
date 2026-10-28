import crypto from 'crypto';

/**
 * Validates Meta x-hub-signature-256 header using the Meta App Secret.
 * Meta hashes the raw request body with HMAC-SHA256 and sends it in the header:
 * x-hub-signature-256: sha256=<hash>
 */
export function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string
): boolean {
  if (!signatureHeader || !appSecret) {
    // If no secret configured in development, skip or fail safe
    return false;
  }

  const [prefix, hash] = signatureHeader.split('=');
  if (prefix !== 'sha256' || !hash) {
    return false;
  }

  const expectedHash = crypto
    .createHmac('sha256', appSecret)
    .update(rawBody, 'utf8')
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  } catch {
    return false;
  }
}
