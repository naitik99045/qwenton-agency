import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-user';
import { isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { isFamGatewayConfigured } from '@/lib/billing/famgateway';
import { testLLMConnection } from '@/lib/llm/client';
import { isEmailConfigured } from '@/lib/email/emailjs';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const llmTest = await testLLMConnection();

    return NextResponse.json({
      system: {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'production',
        appMode: process.env.NEXT_PUBLIC_APP_MODE || 'standard',
      },
      services: {
        firestore: {
          configured: isFirebaseAdminConfigured,
          provider: isFirebaseAdminConfigured ? 'Firebase Admin Firestore (Cloud)' : 'Local Embedded Datastore',
          status: 'online',
        },
        famgateway: {
          configured: isFamGatewayConfigured,
          endpoint: 'https://famgateway.in',
          status: isFamGatewayConfigured ? 'active' : 'fallback_mode',
        },
        llm: {
          configured: true,
          provider: llmTest.provider,
          model: llmTest.model,
          status: llmTest.ok ? 'connected' : 'degraded',
          latencyMs: llmTest.latencyMs,
          message: llmTest.message,
        },
        emailjs: {
          configured: isEmailConfigured(),
          status: isEmailConfigured() ? 'active' : 'simulated',
        },
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}
