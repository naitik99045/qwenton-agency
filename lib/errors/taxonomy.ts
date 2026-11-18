/**
 * Blueprint Section 10: Reliability, Error Taxonomy & Server-Authoritative Controls
 *
 * Provides typed standard error classes, safe message formatting,
 * and predictable structured responses for client and agent consumers:
 * { success: false, error: string, errorClass: string, recoveryAction?: string, ... }
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ErrorClass =
  | 'Validation'
  | 'Authentication'
  | 'Authorization'
  | 'QuotaLimit'
  | 'Integration'
  | 'Conflict'
  | 'Transient'
  | 'Model'
  | 'NotFound'
  | 'Internal';

export interface ApiErrorBody {
  success: false;
  error: string;
  errorClass: ErrorClass;
  code?: string;
  recoveryAction?: string;
  fields?: Record<string, string[]>;
  planLimit?: number;
  currentUsage?: number;
  upgradeUrl?: string;
  provider?: string;
  retryable?: boolean;
  retryAfterSeconds?: number;
  details?: unknown;
}

export interface AppErrorOptions {
  statusCode?: number;
  recoveryAction?: string;
  cause?: unknown;
  code?: string;
  details?: unknown;
}

/**
 * Base Application Error class adhering to Blueprint Section 10 taxonomy.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly errorClass: ErrorClass;
  readonly recoveryAction?: string;
  readonly code?: string;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(
    message: string,
    errorClass: ErrorClass = 'Internal',
    options?: AppErrorOptions
  ) {
    super(message);
    this.name = this.constructor.name;
    this.errorClass = errorClass;
    this.statusCode = options?.statusCode ?? 500;
    this.recoveryAction = options?.recoveryAction;
    this.code = options?.code;
    this.details = options?.details;
    this.isOperational = true;

    // Preserve clean prototype inheritance
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface ValidationErrorOptions extends AppErrorOptions {
  fields?: Record<string, string[]>;
}

/**
 * Validation Error (400 Bad Request)
 * Example: Missing required field / invalid schema
 * Expected response: Block before run; point to exact field
 */
export class ValidationError extends AppError {
  readonly fields?: Record<string, string[]>;

  constructor(
    message: string = 'Validation failed. Please verify submitted fields.',
    options?: ValidationErrorOptions
  ) {
    super(message, 'Validation', {
      statusCode: 400,
      recoveryAction:
        options?.recoveryAction ??
        'Please review the highlighted input fields and correct any formatting or constraint issues.',
      ...options,
    });
    this.fields = options?.fields;
  }

  static fromZod(error: ZodError): ValidationError {
    const fields: Record<string, string[]> = {};
    const messages: string[] = [];

    for (const issue of error.issues) {
      const fieldPath = issue.path.join('.') || 'root';
      if (!fields[fieldPath]) {
        fields[fieldPath] = [];
      }
      fields[fieldPath].push(issue.message);
      messages.push(`${fieldPath}: ${issue.message}`);
    }

    const preview = messages.slice(0, 3).join('; ');
    const extraCount = messages.length - 3;
    const message = `Validation failed: ${preview}${extraCount > 0 ? ` (+${extraCount} more)` : ''}`;

    return new ValidationError(message, {
      fields,
      recoveryAction: 'Please fix the indicated input values and submit again.',
      details: error.flatten(),
    });
  }
}

/**
 * Authentication Error (401 Unauthorized)
 * Example: Expired user session / missing token
 * Expected response: Re-authenticate; preserve safe draft
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Authentication required. Please sign in to continue.',
    options?: AppErrorOptions
  ) {
    super(message, 'Authentication', {
      statusCode: 401,
      recoveryAction:
        options?.recoveryAction ??
        'Your session has expired or is invalid. Please sign in again to refresh your session.',
      ...options,
    });
  }
}

/**
 * Authorization Error (403 Forbidden)
 * Example: Agent or user lacks permission
 * Expected response: Deny; explain required role/scope
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Access denied. You lack required permissions for this action.',
    options?: AppErrorOptions
  ) {
    super(message, 'Authorization', {
      statusCode: 403,
      recoveryAction:
        options?.recoveryAction ??
        'Contact your workspace administrator to request access or verify your account role.',
      ...options,
    });
  }
}

export interface QuotaLimitOptions extends AppErrorOptions {
  planLimit?: number;
  currentUsage?: number;
  upgradeUrl?: string;
}

/**
 * Quota & Billing Error (403 Forbidden)
 * Example: Budget or plan limit reached
 * Expected response: Pause safely and show upgrade/limit path
 */
export class QuotaLimitError extends AppError {
  readonly planLimit?: number;
  readonly currentUsage?: number;
  readonly upgradeUrl: string;

  constructor(
    message: string = 'Quota limit exceeded for current subscription tier.',
    options?: QuotaLimitOptions
  ) {
    super(message, 'QuotaLimit', {
      statusCode: 403,
      code: options?.code ?? 'QUOTA_LIMIT_EXCEEDED',
      recoveryAction:
        options?.recoveryAction ??
        'Upgrade your subscription plan to unlock higher capacity and continue provisioning.',
      ...options,
    });
    this.planLimit = options?.planLimit;
    this.currentUsage = options?.currentUsage;
    this.upgradeUrl = options?.upgradeUrl ?? '/billing';
  }
}

export interface IntegrationErrorOptions extends AppErrorOptions {
  provider?: string;
  retryAfterSeconds?: number;
  retryable?: boolean;
}

/**
 * Integration Error (502 Bad Gateway or 503 Service Unavailable)
 * Example: Expired OAuth token / rate limit on external connector
 * Expected response: Reconnect or back off; do not loop
 */
export class IntegrationError extends AppError {
  readonly provider?: string;
  readonly retryAfterSeconds?: number;
  readonly retryable: boolean;

  constructor(
    message: string = 'External integration connector encountered an error.',
    options?: IntegrationErrorOptions
  ) {
    super(message, 'Integration', {
      statusCode: options?.statusCode ?? 502,
      recoveryAction:
        options?.recoveryAction ??
        'Reconnect or verify provider credentials in the Integrations Hub. If rate-limited, back off and retry later.',
      ...options,
    });
    this.provider = options?.provider;
    this.retryAfterSeconds = options?.retryAfterSeconds;
    this.retryable = options?.retryable ?? true;
  }
}

/**
 * Conflict Error (409 Conflict)
 * Example: Record changed since preview / duplicate resource key
 * Expected response: Refresh and ask user to reconfirm
 */
export class ConflictError extends AppError {
  constructor(
    message: string = 'Conflict detected: record was modified by another process or already exists.',
    options?: AppErrorOptions
  ) {
    super(message, 'Conflict', {
      statusCode: 409,
      recoveryAction:
        options?.recoveryAction ??
        'Refresh the page to view current state and reconfirm your modifications.',
      ...options,
    });
  }
}

export interface TransientErrorOptions extends AppErrorOptions {
  retryAfterSeconds?: number;
}

/**
 * Transient Error (503 Service Unavailable)
 * Example: Network timeout / temporary upstream 5xx
 * Expected response: Bounded retry if operation is safe
 */
export class TransientError extends AppError {
  readonly retryAfterSeconds?: number;
  readonly retryable = true;

  constructor(
    message: string = 'A transient network or service glitch occurred.',
    options?: TransientErrorOptions
  ) {
    super(message, 'Transient', {
      statusCode: options?.statusCode ?? 503,
      recoveryAction:
        options?.recoveryAction ??
        'A temporary service interruption occurred. Safe to retry using bounded exponential backoff.',
      ...options,
    });
    this.retryAfterSeconds = options?.retryAfterSeconds;
  }
}

/**
 * Model Error (502 Bad Gateway)
 * Example: Invalid structured output / refusal by LLM provider
 * Expected response: Validate, repair only under policy, or fail visibly
 */
export class ModelError extends AppError {
  constructor(
    message: string = 'AI Model returned invalid structured output or refused the request.',
    options?: AppErrorOptions
  ) {
    super(message, 'Model', {
      statusCode: 502,
      recoveryAction:
        options?.recoveryAction ??
        'Adjust the agent system prompt instructions, or select an alternative model provider.',
      ...options,
    });
  }
}

/**
 * NotFound Error (404 Not Found)
 */
export class NotFoundError extends AppError {
  constructor(
    message: string = 'The requested resource could not be found.',
    options?: AppErrorOptions
  ) {
    super(message, 'NotFound', {
      statusCode: 404,
      recoveryAction:
        options?.recoveryAction ??
        'Verify the resource identifier and check if the item was archived or deleted.',
      ...options,
    });
  }
}

/**
 * Internal Server Error (500 Internal Server Error)
 * Example: Unhandled crash / DB connectivity issue
 * Expected response: Return redacted safe message to client; log details server-side
 */
export class InternalError extends AppError {
  constructor(
    message: string = 'An unexpected internal server error occurred.',
    options?: AppErrorOptions
  ) {
    super(message, 'Internal', {
      statusCode: 500,
      recoveryAction:
        options?.recoveryAction ??
        'An unexpected server error occurred. Please try again shortly or contact platform support.',
      ...options,
    });
  }
}

/**
 * Redacts sensitive credentials, tokens, secrets, and connection strings from error messages
 * in accordance with Blueprint Section 10 reliability controls.
 */
export function redactSensitiveDetails(text: string): string {
  if (!text) return text;
  let redacted = text;
  // Bearer tokens
  redacted = redacted.replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [REDACTED]');
  // API Keys (OpenAI, Gemini, GitHub tokens)
  redacted = redacted.replace(/\b(sk-[A-Za-z0-9_-]{20,})\b/g, '[REDACTED_API_KEY]');
  redacted = redacted.replace(/\b(AIza[0-9A-Za-z-_]{35})\b/g, '[REDACTED_API_KEY]');
  redacted = redacted.replace(/\b(ghp_[0-9a-zA-Z]{36})\b/g, '[REDACTED_TOKEN]');
  // Database connection strings containing user:password
  redacted = redacted.replace(/(mongodb(?:\+srv)?|postgres|postgresql|mysql):\/\/[^\s:@]+:[^\s:@]+@/gi, '$1://[REDACTED_CREDS]@');
  // JSON key-values with sensitive names
  redacted = redacted.replace(/("(?:password|secret|token|apiKey|api_key|auth|privateKey|private_key)"\s*:\s*)"[^"]+"/gi, '$1"[REDACTED]"');
  // Query param style secrets
  redacted = redacted.replace(/((?:password|secret|token|apiKey|api_key|auth)=)[^&\s]+/gi, '$1[REDACTED]');
  return redacted;
}

/**
 * Converts any thrown value into a structured { status, body } adhering to Blueprint Section 10.
 */
export function toApiErrorPayload(err: unknown): { status: number; body: ApiErrorBody } {
  // 1. Zod validation failure
  if (err instanceof ZodError) {
    const valErr = ValidationError.fromZod(err);
    return {
      status: valErr.statusCode,
      body: {
        success: false,
        error: valErr.message,
        errorClass: 'Validation',
        fields: valErr.fields,
        recoveryAction: valErr.recoveryAction,
        details: valErr.details,
      },
    };
  }

  // 2. Specific QuotaLimitError
  if (err instanceof QuotaLimitError) {
    return {
      status: err.statusCode,
      body: {
        success: false,
        error: err.message,
        errorClass: 'QuotaLimit',
        code: err.code || 'QUOTA_LIMIT_EXCEEDED',
        planLimit: err.planLimit,
        currentUsage: err.currentUsage,
        upgradeUrl: err.upgradeUrl,
        recoveryAction: err.recoveryAction,
        ...(err.details ? { details: err.details } : {}),
      },
    };
  }

  // 3. ValidationError
  if (err instanceof ValidationError) {
    return {
      status: err.statusCode,
      body: {
        success: false,
        error: err.message,
        errorClass: 'Validation',
        fields: err.fields,
        recoveryAction: err.recoveryAction,
        ...(err.code ? { code: err.code } : {}),
        ...(err.details ? { details: err.details } : {}),
      },
    };
  }

  // 4. Other AppError subclasses
  if (err instanceof AppError) {
    const body: ApiErrorBody = {
      success: false,
      error: redactSensitiveDetails(err.message),
      errorClass: err.errorClass,
      ...(err.code ? { code: err.code } : {}),
      ...(err.recoveryAction ? { recoveryAction: err.recoveryAction } : {}),
      ...(err.details ? { details: err.details } : {}),
    };

    if (err instanceof IntegrationError) {
      if (err.provider) body.provider = err.provider;
      if (err.retryable !== undefined) body.retryable = err.retryable;
      if (err.retryAfterSeconds !== undefined) body.retryAfterSeconds = err.retryAfterSeconds;
    }

    return {
      status: err.statusCode,
      body,
    };
  }

  // 5. Duck-typed AuthError (from lib/auth/require-user or elsewhere)
  if (
    typeof err === 'object' &&
    err !== null &&
    'statusCode' in err &&
    typeof (err as { statusCode: unknown }).statusCode === 'number'
  ) {
    const authErr = err as { message?: string; statusCode: number };
    const statusCode = authErr.statusCode;
    const is403 = statusCode === 403;
    const msg = authErr.message || (is403 ? 'Forbidden' : 'Unauthorized');
    return {
      status: statusCode,
      body: {
        success: false,
        error: redactSensitiveDetails(msg),
        errorClass: is403 ? 'Authorization' : 'Authentication',
        recoveryAction: is403
          ? 'Contact your workspace administrator to request access or verify account status.'
          : 'Please sign in again to refresh your session credentials.',
      },
    };
  }

  // 6. Generic JavaScript Error with intelligent message heuristics
  if (err instanceof Error) {
    const rawMsg = err.message || '';
    const lower = rawMsg.toLowerCase();

    // Check for quota or limit phrases
    if (lower.includes('limit reached') || lower.includes('quota')) {
      return {
        status: 403,
        body: {
          success: false,
          error: rawMsg,
          errorClass: 'QuotaLimit',
          code: 'QUOTA_LIMIT_EXCEEDED',
          upgradeUrl: '/billing',
          recoveryAction: 'Upgrade your subscription on the billing page to unlock higher capacity.',
        },
      };
    }

    // Check for auth phrases
    if (lower.includes('unauthorized') || lower.includes('not authenticated') || lower.includes('token expired')) {
      return {
        status: 401,
        body: {
          success: false,
          error: rawMsg,
          errorClass: 'Authentication',
          recoveryAction: 'Please sign in to obtain a valid session token.',
        },
      };
    }

    if (lower.includes('forbidden') || lower.includes('permission denied')) {
      return {
        status: 403,
        body: {
          success: false,
          error: rawMsg,
          errorClass: 'Authorization',
          recoveryAction: 'Your account lacks permission to perform this action.',
        },
      };
    }

    if (lower.includes('not found')) {
      return {
        status: 404,
        body: {
          success: false,
          error: rawMsg,
          errorClass: 'NotFound',
          recoveryAction: 'Verify the identifier of the requested resource.',
        },
      };
    }

    if (lower.includes('conflict') || lower.includes('already exists')) {
      return {
        status: 409,
        body: {
          success: false,
          error: rawMsg,
          errorClass: 'Conflict',
          recoveryAction: 'A resource with this identifier already exists. Use a unique value or refresh.',
        },
      };
    }

    // Unhandled 500 error: redact details in dev, sanitize in production
    const safeMsg =
      process.env.NODE_ENV === 'production'
        ? 'An unexpected server error occurred. Please try again later.'
        : redactSensitiveDetails(rawMsg);

    return {
      status: 500,
      body: {
        success: false,
        error: safeMsg || 'An unexpected internal server error occurred.',
        errorClass: 'Internal',
        recoveryAction: 'Try your request again shortly. If the issue persists, contact platform support.',
      },
    };
  }

  // 7. Unknown thrown types (string, number, null)
  const rawStr = redactSensitiveDetails(String(err));
  return {
    status: 500,
    body: {
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : rawStr,
      errorClass: 'Internal',
      recoveryAction: 'Try your request again shortly or contact support.',
    },
  };
}

/**
 * Formats any error into a standardized NextResponse containing Blueprint Section 10 JSON payload.
 *
 * @example
 * ```ts
 * try {
 *   // ...
 * } catch (err) {
 *   return formatApiError(err);
 * }
 * ```
 */
export function formatApiError(err: unknown, headers?: HeadersInit): NextResponse<ApiErrorBody> {
  const { status, body } = toApiErrorPayload(err);
  return NextResponse.json(body, { status, headers });
}
