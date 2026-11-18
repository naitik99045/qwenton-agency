import { z } from 'zod';
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  QuotaLimitError,
  IntegrationError,
  ConflictError,
  TransientError,
  ModelError,
  NotFoundError,
  InternalError,
  toApiErrorPayload,
  formatApiError,
  redactSensitiveDetails,
} from '../lib/errors/taxonomy';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
  console.log(`✓ ${msg}`);
}

async function runTests() {
  console.log('--- Testing Error Taxonomy & Reliability Controls ---');

  // 1. ValidationError
  const valErr = new ValidationError('Invalid name input', {
    fields: { name: ['Must be at least 2 characters'] },
  });
  const valPayload = toApiErrorPayload(valErr);
  assert(valPayload.status === 400, 'ValidationError status is 400');
  assert(valPayload.body.errorClass === 'Validation', 'ValidationError errorClass is Validation');
  assert(valPayload.body.success === false, 'ValidationError success is false');
  assert(valPayload.body.fields?.name?.[0] === 'Must be at least 2 characters', 'ValidationError preserves field-level details');

  // 2. ZodError conversion
  const testSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
  });
  const zodResult = testSchema.safeParse({ username: 'ab', email: 'not-an-email' });
  if (!zodResult.success) {
    const zodPayload = toApiErrorPayload(zodResult.error);
    assert(zodPayload.status === 400, 'ZodError translates to 400 status');
    assert(zodPayload.body.errorClass === 'Validation', 'ZodError translates to Validation errorClass');
    assert(Boolean(zodPayload.body.fields?.username), 'ZodError field username mapped');
    assert(Boolean(zodPayload.body.fields?.email), 'ZodError field email mapped');
  } else {
    throw new Error('Zod safeParse should have failed');
  }

  // 3. AuthenticationError
  const authErr = new AuthenticationError('Token expired');
  const authPayload = toApiErrorPayload(authErr);
  assert(authPayload.status === 401, 'AuthenticationError status is 401');
  assert(authPayload.body.errorClass === 'Authentication', 'AuthenticationError class is Authentication');
  assert(Boolean(authPayload.body.recoveryAction), 'AuthenticationError includes recoveryAction');

  // 4. AuthorizationError
  const authzErr = new AuthorizationError('Requires admin privileges');
  const authzPayload = toApiErrorPayload(authzErr);
  assert(authzPayload.status === 403, 'AuthorizationError status is 403');
  assert(authzPayload.body.errorClass === 'Authorization', 'AuthorizationError class is Authorization');

  // 5. QuotaLimitError
  const quotaErr = new QuotaLimitError('Agent limit reached (2 of 2 used on "Normal (Free)"). Upgrade to add more.', {
    planLimit: 2,
    currentUsage: 2,
    upgradeUrl: '/billing',
  });
  const quotaPayload = toApiErrorPayload(quotaErr);
  assert(quotaPayload.status === 403, 'QuotaLimitError status is 403');
  assert(quotaPayload.body.errorClass === 'QuotaLimit', 'QuotaLimitError class is QuotaLimit');
  assert(quotaPayload.body.code === 'QUOTA_LIMIT_EXCEEDED', 'QuotaLimitError code is QUOTA_LIMIT_EXCEEDED');
  assert(quotaPayload.body.planLimit === 2, 'QuotaLimitError has planLimit');
  assert(quotaPayload.body.currentUsage === 2, 'QuotaLimitError has currentUsage');
  assert(quotaPayload.body.upgradeUrl === '/billing', 'QuotaLimitError has upgradeUrl');
  assert(Boolean(quotaPayload.body.recoveryAction), 'QuotaLimitError has recoveryAction');

  // 6. IntegrationError
  const integErr = new IntegrationError('Instagram API rate limited', {
    provider: 'instagram',
    retryAfterSeconds: 60,
    retryable: true,
  });
  const integPayload = toApiErrorPayload(integErr);
  assert(integPayload.status === 502, 'IntegrationError status is 502');
  assert(integPayload.body.errorClass === 'Integration', 'IntegrationError class is Integration');
  assert(integPayload.body.provider === 'instagram', 'IntegrationError provider is instagram');
  assert(integPayload.body.retryable === true, 'IntegrationError retryable is true');
  assert(integPayload.body.retryAfterSeconds === 60, 'IntegrationError retryAfterSeconds is 60');

  // 7. ConflictError
  const confErr = new ConflictError('Agent name already exists');
  const confPayload = toApiErrorPayload(confErr);
  assert(confPayload.status === 409, 'ConflictError status is 409');
  assert(confPayload.body.errorClass === 'Conflict', 'ConflictError class is Conflict');

  // 8. TransientError
  const transErr = new TransientError('Network socket timeout', { retryAfterSeconds: 5 });
  const transPayload = toApiErrorPayload(transErr);
  assert(transPayload.status === 503, 'TransientError status is 503');
  assert(transPayload.body.errorClass === 'Transient', 'TransientError class is Transient');

  // 9. ModelError
  const modelErr = new ModelError('LLM refused prompt due to content policy');
  const modelPayload = toApiErrorPayload(modelErr);
  assert(modelPayload.status === 502, 'ModelError status is 502');
  assert(modelPayload.body.errorClass === 'Model', 'ModelError class is Model');

  // 10. NotFoundError
  const notFoundErr = new NotFoundError('Agent ag_123 not found');
  const notFoundPayload = toApiErrorPayload(notFoundErr);
  assert(notFoundPayload.status === 404, 'NotFoundError status is 404');
  assert(notFoundPayload.body.errorClass === 'NotFound', 'NotFoundError class is NotFound');

  // 11. Redaction of sensitive details
  const sensitiveText = 'Error connecting to postgres://admin:secretPass123@db.internal:5432 with sk-abcdef1234567890abcdef1234567890 and Bearer eyJhbGciOi';
  const redacted = redactSensitiveDetails(sensitiveText);
  assert(!redacted.includes('secretPass123'), 'Redacts DB password');
  assert(!redacted.includes('sk-abcdef1234567890abcdef1234567890'), 'Redacts API key');
  assert(!redacted.includes('eyJhbGciOi'), 'Redacts Bearer token');
  assert(redacted.includes('[REDACTED'), 'Contains [REDACTED] tokens');

  // 12. formatApiError response
  const response = formatApiError(quotaErr);
  assert(response.status === 403, 'formatApiError returns correct HTTP status code');
  const jsonBody = await response.json();
  assert(jsonBody.success === false, 'formatApiError jsonBody has success: false');
  assert(jsonBody.errorClass === 'QuotaLimit', 'formatApiError jsonBody has correct errorClass');
  assert(jsonBody.code === 'QUOTA_LIMIT_EXCEEDED', 'formatApiError jsonBody has correct code');

  console.log('\nAll 12 error taxonomy tests PASSED successfully!');
}

runTests().catch((e) => {
  console.error('Test execution failed:', e);
  process.exit(1);
});
