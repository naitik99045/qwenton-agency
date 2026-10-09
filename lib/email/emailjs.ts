export interface EmailJSOtpPayload {
  toEmail: string;
  userName: string;
  otpCode: string;
  purchaseReference: string;
  expiresInMinutes?: string;
  supportEmail?: string;
}

export const EMAILJS_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID || 'service_abzu8zd',
  templateId: process.env.EMAILJS_TEMPLATE_ID || 'template_qwk3yw4',
  publicKey: process.env.EMAILJS_PUBLIC_KEY || 'OSw8hsFWod_PR0CAl',
  privateKey: process.env.EMAILJS_PRIVATE_KEY || 'i19DT2N0T7cMlepB-nivt',
};

export async function sendOtpEmail(payload: EmailJSOtpPayload): Promise<{ ok: boolean; message: string }> {
  const now = new Date();
  const requestedAtFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(now);

  const templateParams: Record<string, string> = {
    app_name: 'qwenton-agents',
    user_name: payload.userName || 'Valued User',
    otp_code: payload.otpCode,
    expires_in_minutes: payload.expiresInMinutes || '10',
    purchase_reference: payload.purchaseReference,
    order_id: payload.purchaseReference,
    requested_at: requestedAtFormatted,
    support_email: payload.supportEmail || 'support@qwenton.ai',
    current_year: String(now.getFullYear()),
    to_email: payload.toEmail,
    email: payload.toEmail,
    send_to: payload.toEmail,
  };

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateId,
        user_id: EMAILJS_CONFIG.publicKey,
        accessToken: EMAILJS_CONFIG.privateKey,
        template_params: templateParams,
      }),
    });

    if (res.ok) {
      return { ok: true, message: 'OTP verification email sent successfully.' };
    }

    const errorText = await res.text();
    console.error('[EmailJS Send Error]', errorText);
    return { ok: false, message: `EmailJS error: ${errorText}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[EmailJS Network Error]', msg);
    return { ok: false, message: `Failed to connect to EmailJS: ${msg}` };
  }
}
