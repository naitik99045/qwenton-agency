export function repairJsonString(input: string): string {
  if (!input) return '{}';
  let cleaned = input.trim();

  // Strip markdown code fences if model wrapped response in ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  cleaned = cleaned.trim();

  // Remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  return cleaned;
}

export function safeJsonParse<T = Record<string, unknown>>(input: string, fallback: T): T {
  try {
    const repaired = repairJsonString(input);
    return JSON.parse(repaired) as T;
  } catch (e) {
    console.warn('[JSON Repair] Failed to parse JSON, returning fallback:', input);
    return fallback;
  }
}
