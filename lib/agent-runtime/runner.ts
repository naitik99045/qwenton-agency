import { getDB } from '@/lib/db/adapter';
import { streamChatCompletion, ChatMessage, ToolDefinition } from '@/lib/llm/client';
import { TOOL_CATALOG } from '@/lib/tools/catalog';
import { executeTool } from '@/lib/tools/executor';

export interface RuntimeOptions {
  agentId: string;
  conversationId: string;
  userId: string;
  userPrompt: string;
}

export type RuntimeEvent =
  | { type: 'token'; content: string }
  | { type: 'thought'; message: string }
  | { type: 'tool_call'; tool: string; args: Record<string, unknown> }
  | { type: 'tool_result'; tool: string; result: unknown }
  | { type: 'approval_required'; approvalId: string; action: string; target: string; payload: Record<string, unknown> }
  | { type: 'run_created'; runId: string }
  | { type: 'completed'; runId: string; finalContent: string }
  | { type: 'error'; error: string };

export async function* runAgentLoop(options: RuntimeOptions): AsyncGenerator<RuntimeEvent, void, unknown> {
  const { agentId, conversationId, userId, userPrompt } = options;
  const db = getDB();

  const agent = await db.getAgent(agentId);
  if (!agent) {
    yield { type: 'error', error: 'Agent not found' };
    return;
  }

  // Create active run
  const run = await db.createRun({
    conversationId,
    agentId,
    ownerUid: userId,
    status: 'running',
    totalSteps: 0,
  });

  yield { type: 'run_created', runId: run.id };

  // Save user message to database
  await db.createMessage({
    conversationId,
    agentId,
    ownerUid: userId,
    sender: 'user',
    content: userPrompt,
  });

  // Load conversation history
  const pastMessages = await db.getMessages(conversationId);
  const contextMessages: ChatMessage[] = [
    {
      role: 'system',
      content: `${agent.systemPrompt}\n\nYou are operating as "${agent.name}" (${agent.role}). When asked to calculate, search files, or research, call the appropriate tools. If asked to perform an external communication action (like sending a Telegram or Slack message), call the appropriate tool which will request human approval before sending.`,
    },
  ];

  // Add recent conversation history (last 10 turns)
  pastMessages.slice(-10).forEach((m) => {
    contextMessages.push({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content,
    });
  });

  // Prepare enabled tools
  const tools: ToolDefinition[] = (agent.enabledTools || [])
    .map((name) => TOOL_CATALOG[name]?.definition)
    .filter(Boolean) as ToolDefinition[];

  let accumulatedContent = '';
  let step = 0;
  const maxSteps = 10;
  let isPausedForApproval = false;

  // Resolve Model Provider: Agent Override -> User Settings -> Connected AI Integration -> System Default
  const user = await db.getUser(userId);
  let effectiveOverride = agent.modelOverride;
  if (!effectiveOverride?.apiKey && user?.llmConfig?.apiKey) {
    effectiveOverride = {
      provider: user.llmConfig.provider,
      baseUrl: user.llmConfig.baseUrl,
      apiKey: user.llmConfig.apiKey,
      modelName: user.llmConfig.model,
    };
  } else if (!effectiveOverride?.apiKey) {
    try {
      const userIntegrations = await db.getIntegrationsByUser(userId);
      const geminiInt = userIntegrations.find((i) => i.provider === 'gemini' && i.status === 'connected');
      const openaiInt = userIntegrations.find((i) => i.provider === 'openai' && i.status === 'connected');
      const groqInt = userIntegrations.find((i) => i.provider === 'groq' && i.status === 'connected');
      if (geminiInt && geminiInt.config?.apiKeyEncrypted) {
        effectiveOverride = {
          provider: 'gemini',
          baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
          apiKey: String(geminiInt.config.apiKeyEncrypted),
          modelName: 'gemini-1.5-flash',
        };
      } else if (openaiInt && openaiInt.config?.apiKeyEncrypted) {
        effectiveOverride = {
          provider: 'openai',
          baseUrl: 'https://api.openai.com/v1',
          apiKey: String(openaiInt.config.apiKeyEncrypted),
          modelName: 'gpt-4o-mini',
        };
      } else if (groqInt && groqInt.config?.apiKeyEncrypted) {
        effectiveOverride = {
          provider: 'groq',
          baseUrl: 'https://api.groq.com/openai/v1',
          apiKey: String(groqInt.config.apiKeyEncrypted),
          modelName: 'llama-3.3-70b-versatile',
        };
      }
    } catch {
      // Fall through to system default
    }
  }

  while (step < maxSteps && !isPausedForApproval) {
    step++;
    await db.updateRun(run.id, { totalSteps: step });

    let detectedToolCall: { name: string; args: Record<string, unknown> } | null = null;
    let turnContent = '';

    const stream = streamChatCompletion(contextMessages, tools, effectiveOverride);

    for await (const event of stream) {
      if (event.type === 'token' && event.token) {
        turnContent += event.token;
        accumulatedContent += event.token;
        yield { type: 'token', content: event.token };
      } else if (event.type === 'tool_call' && event.toolCall) {
        detectedToolCall = event.toolCall;
      }
    }

    if (detectedToolCall) {
      const toolMeta = TOOL_CATALOG[detectedToolCall.name];
      yield {
        type: 'tool_call',
        tool: detectedToolCall.name,
        args: detectedToolCall.args,
      };

      await db.createRunEvent({
        runId: run.id,
        type: 'tool_call',
        title: `Invoked ${toolMeta?.displayName || detectedToolCall.name}`,
        details: detectedToolCall.args,
      });

      if (toolMeta?.requiresApproval) {
        // Create Approval Record & Pause
        const approval = await db.createApproval({
          runId: run.id,
          agentId,
          ownerUid: userId,
          actionType: detectedToolCall.name,
          targetService: detectedToolCall.name.includes('telegram')
            ? 'Telegram'
            : detectedToolCall.name.includes('instagram')
            ? 'Instagram'
            : detectedToolCall.name.includes('gmail')
            ? 'Gmail'
            : detectedToolCall.name.includes('calendar')
            ? 'Google Calendar'
            : detectedToolCall.name.includes('slack')
            ? 'Slack'
            : 'External Service',
          payload: detectedToolCall.args,
          riskLevel: 'medium',
        });

        await db.updateRun(run.id, { status: 'waiting_for_approval' });
        await db.createRunEvent({
          runId: run.id,
          type: 'approval_required',
          title: `Action paused: Approval required for ${toolMeta.displayName}`,
          details: { approvalId: approval.id },
        });

        yield {
          type: 'approval_required',
          approvalId: approval.id,
          action: detectedToolCall.name,
          target: toolMeta.displayName,
          payload: detectedToolCall.args,
        };

        isPausedForApproval = true;
        break;
      } else {
        // Execute safe tool
        const toolResult = await executeTool(detectedToolCall.name, detectedToolCall.args, userId);
        yield {
          type: 'tool_result',
          tool: detectedToolCall.name,
          result: toolResult.data || toolResult.error,
        };

        await db.createRunEvent({
          runId: run.id,
          type: 'tool_result',
          title: `Completed ${toolMeta?.displayName || detectedToolCall.name}`,
          details: (toolResult.data as Record<string, unknown>) || { error: toolResult.error },
        });

        // Add tool output back into context for next turn
        contextMessages.push({
          role: 'assistant',
          content: turnContent || `Invoking tool ${detectedToolCall.name}`,
        });
        contextMessages.push({
          role: 'tool',
          name: detectedToolCall.name,
          content: JSON.stringify(toolResult.data || toolResult.error),
        });
      }
    } else {
      // Finished model output without further tool calls
      break;
    }
  }

  if (!isPausedForApproval) {
    await db.updateRun(run.id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });

    // Save final agent response message
    await db.createMessage({
      conversationId,
      agentId,
      ownerUid: userId,
      sender: 'agent',
      content: accumulatedContent,
    });

    yield {
      type: 'completed',
      runId: run.id,
      finalContent: accumulatedContent,
    };
  }
}
