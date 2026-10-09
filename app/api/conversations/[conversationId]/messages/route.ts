import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { runAgentLoop } from '@/lib/agent-runtime/runner';
import { z } from 'zod';

const postMessageSchema = z.object({
  prompt: z.string().min(1).max(10000),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const user = await requireUser(req);
    const { conversationId } = await params;
    const db = getDB();

    const conversation = await db.getConversation(conversationId);
    if (!conversation || conversation.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const messages = await db.getMessages(conversationId);
    return NextResponse.json({ messages });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const user = await requireUser(req);
    const { conversationId } = await params;
    const db = getDB();

    const conversation = await db.getConversation(conversationId);
    if (!conversation || conversation.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const body = await req.json();
    const { prompt } = postMessageSchema.parse(body);

    // Create Server-Sent Events (SSE) Stream
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          const generator = runAgentLoop({
            agentId: conversation.agentId,
            conversationId,
            userId: user.uid,
            userPrompt: prompt,
          });

          for await (const event of generator) {
            const payload = `data: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(encoder.encode(payload));
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
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
