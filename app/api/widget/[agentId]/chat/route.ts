import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/adapter';
import { streamChatCompletion, ChatMessage, getLLMConfig } from '@/lib/llm/client';
import { z } from 'zod';

const widgetChatSchema = z.object({
  prompt: z.string().min(1).max(3000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

export const maxDuration = 45;

export async function POST(req: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const { agentId } = await params;
    const body = await req.json();
    const { prompt, history } = widgetChatSchema.parse(body);

    const db = getDB();
    const agent = await db.getAgent(agentId);
    if (!agent || agent.status !== 'active') {
      return NextResponse.json({ error: 'Agent is currently unavailable' }, { status: 404 });
    }

    // Resolve LLM config (Agent override > Owner config > System global)
    let llmConfig = getLLMConfig(agent.modelOverride);
    if (!llmConfig.apiKey) {
      const owner = await db.getUser(agent.ownerUid);
      if (owner?.llmConfig) {
        llmConfig = getLLMConfig(owner.llmConfig);
      }
    }

    const systemPrompt = `You are ${agent.name}, an AI Coworker with the role: "${agent.role}".
Your description: "${agent.description}".
Instructions & Personality:
${agent.systemPrompt}

You are currently interacting with an external website visitor via the Qwenton Embeddable Widget.
Be polite, highly professional, direct, and concise. Help them answer questions, provide quotes, share information, or book calls according to your guidelines.
If asked about who powers you, mention you are powered by Qwenton AI Agents.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-8).map((h) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: prompt },
    ];

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          const generator = streamChatCompletion(messages, [], llmConfig);

          for await (const chunk of generator) {
            if (chunk.content) {
              const payload = `data: ${JSON.stringify({ type: 'token', content: chunk.content })}\n\n`;
              controller.enqueue(encoder.encode(payload));
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (streamErr: unknown) {
          const errMessage = streamErr instanceof Error ? streamErr.message : String(streamErr);
          const errorPayload = `data: ${JSON.stringify({ type: 'error', error: errMessage })}\n\n`;
          controller.enqueue(encoder.encode(errorPayload));
          controller.close();
        }
      },
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid widget chat request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
