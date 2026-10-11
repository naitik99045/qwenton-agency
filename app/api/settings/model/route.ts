import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { testLLMConnection } from '@/lib/llm/client';
import { getDB } from '@/lib/db/adapter';
import { z } from 'zod';

const modelSchema = z.object({
  provider: z.enum(['openai', 'gemini', 'groq', 'custom']),
  baseUrl: z.string().url(),
  apiKey: z.string(),
  model: z.string(),
  save: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();
    const freshUser = await db.getUser(user.uid);
    let llmConfig = freshUser?.llmConfig || null;
    if (llmConfig && (llmConfig.provider === 'groq' || llmConfig.baseUrl?.includes('groq.com'))) {
      if (!llmConfig.model || llmConfig.model.startsWith('llama')) {
        llmConfig.model = 'openai/gpt-oss-120b';
      }
    }

    return NextResponse.json({
      success: true,
      config: llmConfig,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    let { provider, baseUrl, apiKey, model, save } = modelSchema.parse(body);
    const db = getDB();

    if (provider === 'groq' || baseUrl.includes('groq.com')) {
      if (!model || model.startsWith('llama')) {
        model = 'openai/gpt-oss-120b';
      }
    }

    const result = await testLLMConnection({
      provider,
      baseUrl,
      apiKey,
      model,
      timeoutSeconds: 12,
    });

    if (save) {
      const freshUser = await db.getUser(user.uid);
      if (freshUser) {
        freshUser.llmConfig = { provider, baseUrl, apiKey, model };
        freshUser.updatedAt = new Date().toISOString();
        await db.saveUser(freshUser);
      }

      await db.createAuditEvent({
        actorUid: user.uid,
        action: 'llm_config_saved',
        resource: provider,
        details: { provider, model, baseUrl },
      });
    }

    return NextResponse.json({
      ...result,
      saved: Boolean(save),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, message: msg }, { status: 400 });
  }
}
