import { NextResponse } from 'next/server';
import { testLLMConnection } from '@/lib/llm/client';
import { isFirebaseAdminConfigured } from '@/lib/firebase/admin';

export async function GET() {
  const llmStatus = await testLLMConnection();

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '0.2.0',
    services: {
      llm: llmStatus,
      database: {
        type: isFirebaseAdminConfigured ? 'Firebase Cloud Firestore' : 'Local Persistence DB (Zero-Lag Mode)',
        configured: true,
      },
    },
  });
}
