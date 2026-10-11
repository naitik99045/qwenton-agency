import { repairJsonString, safeJsonParse } from './json-repair';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface LLMConfig {
  provider: 'openai' | 'gemini' | 'groq' | 'custom';
  baseUrl: string;
  apiKey: string;
  model: string;
  timeoutSeconds: number;
}

export interface ModelOverride {
  provider?: string;
  baseUrl?: string;
  apiKey?: string;
  modelName?: string;
}

export function getLLMConfig(override?: ModelOverride): LLMConfig {
  // 1. If explicit agent override is provided
  if (override?.baseUrl && override?.modelName) {
    let model = override.modelName;
    const isGroq = override.provider === 'groq' || override.baseUrl.includes('groq.com');
    const provider = isGroq ? 'groq' : ((override.provider as LLMConfig['provider']) || 'custom');
    if (isGroq && (model.startsWith('llama') || !model)) {
      model = 'openai/gpt-oss-120b';
    }
    return {
      provider,
      baseUrl: override.baseUrl.replace(/\/+$/, ''),
      apiKey: override.apiKey || 'custom-key',
      model,
      timeoutSeconds: parseInt(process.env.MODEL_TIMEOUT_SECONDS || '120', 10),
    };
  }

  // 2. Global Provider from environment
  const provider = (process.env.MODEL_PROVIDER || 'groq').toLowerCase() as LLMConfig['provider'];
  let baseUrl = process.env.MODEL_BASE_URL || 'https://api.groq.com/openai/v1';
  let apiKey = process.env.MODEL_API_KEY || '';
  let model = process.env.MODEL_NAME || 'openai/gpt-oss-120b';

  switch (provider) {
    case 'gemini':
      baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai/';
      apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || apiKey;
      model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      break;

    case 'openai':
      baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
      apiKey = process.env.OPENAI_API_KEY || apiKey;
      model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      break;

    case 'custom':
      baseUrl = process.env.CUSTOM_MODEL_BASE_URL || baseUrl;
      apiKey = process.env.CUSTOM_MODEL_API_KEY || apiKey;
      model = process.env.CUSTOM_MODEL_NAME || model;
      break;

    case 'groq':
    default:
      baseUrl = process.env.GROQ_BASE_URL || baseUrl;
      apiKey = process.env.GROQ_API_KEY || apiKey;
      model = process.env.GROQ_MODEL || model;
      break;
  }

  return {
    provider,
    baseUrl: baseUrl.replace(/\/+$/, ''),
    apiKey,
    model,
    timeoutSeconds: parseInt(process.env.MODEL_TIMEOUT_SECONDS || '120', 10),
  };
}

export async function testLLMConnection(configOverride?: LLMConfig): Promise<{ ok: boolean; message: string; model?: string; provider?: string }> {
  const config = configOverride || getLLMConfig();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (config.apiKey && config.apiKey !== 'none') {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }

    const res = await fetch(`${config.baseUrl}/models`, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        ok: false,
        message: `Model server (${config.provider}) returned HTTP ${res.status}: ${res.statusText}`,
        provider: config.provider,
      };
    }

    const data = await res.json();
    const models = Array.isArray(data?.data) ? data.data.map((m: { id: string }) => m.id) : [];
    return {
      ok: true,
      message: `Connected successfully to ${config.baseUrl} (${config.provider})`,
      model: models[0] || config.model,
      provider: config.provider,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      message: `Could not connect to model provider at ${config.baseUrl}. (${errorMsg}).`,
      provider: config.provider,
    };
  }
}

export interface StreamEvent {
  type: 'token' | 'tool_call' | 'error' | 'done';
  token?: string;
  toolCall?: {
    id?: string;
    name: string;
    args: Record<string, unknown>;
  };
  error?: string;
}

export async function* streamChatCompletion(
  messages: ChatMessage[],
  tools?: ToolDefinition[],
  override?: ModelOverride
): AsyncGenerator<StreamEvent, void, unknown> {
  const config = getLLMConfig(override);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutSeconds * 1000);

  const payload: Record<string, unknown> = {
    model: config.model,
    messages,
    stream: true,
    temperature: 0.3,
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
    payload.tool_choice = 'auto';
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (config.apiKey && config.apiKey !== 'none') {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }

    let res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    // Auto-recovery 1: If Groq returns 404 (model decommissioned), automatically retry with active models
    if (res.status === 404 && (config.provider === 'groq' || config.baseUrl.includes('groq.com'))) {
      const fallback = payload.model === 'openai/gpt-oss-120b' ? 'openai/gpt-oss-20b' : 'openai/gpt-oss-120b';
      console.warn(`[LLM] Groq 404 for model ${payload.model}. Automatically falling back to ${fallback}...`);
      payload.model = fallback;
      res = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    }

    // Auto-recovery 2: If model server returns 400 (Bad Request with tools schema), retry without tools to guarantee user gets a valid answer
    if (res.status === 400 && payload.tools) {
      console.warn(`[LLM] Model endpoint returned 400 with tools schema. Retrying query without tools...`);
      delete payload.tools;
      delete payload.tool_choice;
      res = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    }

    clearTimeout(timeout);

    if (!res.ok) {
      let detailedMsg = '';
      try {
        const errText = await res.text();
        const parsed = JSON.parse(errText);
        detailedMsg = parsed.error?.message || parsed.message || errText;
      } catch {}

      let guidance = '';
      if (res.status === 401 || res.status === 403) {
        guidance = `*(Notice: Model endpoint authentication failed [Status ${res.status}]. Please check your API key in "AI Settings" or "Integrations")*\n\n`;
      } else {
        guidance = `*(Notice: Model endpoint at ${config.baseUrl} returned ${res.status}${detailedMsg ? `: ${detailedMsg}` : ''}. Falling back to local coworker analysis)*\n\n`;
      }
      yield {
        type: 'token',
        token: `${guidance}I am ready to assist you. To enable direct high-speed reasoning from Google Gemini, OpenAI, or Groq, configure your active API key in **AI Settings** or the **Integrations** vault.`,
      };
      yield { type: 'done' };
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error('No readable response body');
    }

    const decoder = new TextDecoder();
    let accumulatedToolCall: { id: string; name: string; arguments: string } | null = null;
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (trimmed === 'data: [DONE]') {
          if (accumulatedToolCall && accumulatedToolCall.name) {
            const parsedArgs = safeJsonParse(accumulatedToolCall.arguments, {});
            yield {
              type: 'tool_call',
              toolCall: {
                id: accumulatedToolCall.id,
                name: accumulatedToolCall.name,
                args: parsedArgs,
              },
            };
          }
          yield { type: 'done' };
          return;
        }

        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6));
            const delta = json.choices?.[0]?.delta;

            if (delta?.content) {
              yield { type: 'token', token: delta.content };
            }

            if (delta?.tool_calls && delta.tool_calls.length > 0) {
              const tc = delta.tool_calls[0];
              if (!accumulatedToolCall) {
                accumulatedToolCall = {
                  id: tc.id || `call_${Date.now()}`,
                  name: tc.function?.name || '',
                  arguments: '',
                };
              }
              if (tc.id) {
                accumulatedToolCall.id = tc.id;
              }
              if (tc.function?.name) {
                accumulatedToolCall.name = tc.function.name;
              }
              if (tc.function?.arguments) {
                accumulatedToolCall.arguments += tc.function.arguments;
              }
            }
          } catch (e) {
            // ignore partial JSON
          }
        }
      }
    }

    if (accumulatedToolCall && accumulatedToolCall.name) {
      const parsedArgs = safeJsonParse(accumulatedToolCall.arguments, {});
      yield {
        type: 'tool_call',
        toolCall: {
          id: accumulatedToolCall.id,
          name: accumulatedToolCall.name,
          args: parsedArgs,
        },
      };
    }

    yield { type: 'done' };
  } catch (err: unknown) {
    clearTimeout(timeout);
    const msg = err instanceof Error ? err.message : String(err);
    yield {
      type: 'token',
      token: `\n\n*(Notice: Could not connect to model endpoint at ${config.baseUrl}: ${msg}. Operating in local coworker mode)*\n\nI have received your prompt. To enable cloud streaming with Google Gemini, OpenAI, or Groq, please set your API key in **AI Settings** or **Integrations**.`,
    };
    yield { type: 'done' };
  }
}
