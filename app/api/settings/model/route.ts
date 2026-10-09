import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { testLLMConnection, LLMConfig } from '@/lib/llm/client';
import { z } from 'zod';

const testModelSchema = z.object({
  provider: z.enum(['openai', 'gemini', 'groq', 'lmstudio', 'ollama', 'custom']),
  baseUrl: z.string().url(),
  apiKey: z.string(),
  model: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const body = await req.json();
    const config = testModelSchema.parse(body);

    const result = await testLLMConnection({
      ...config,
      timeoutSeconds: 10,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, message: msg }, { status: 400 });
  }
}
