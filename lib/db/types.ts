export type UserRole = 'user' | 'admin' | 'support-admin';
export type UserStatus = 'active' | 'suspended' | 'deleted' | 'pending_verification';

export type PlanId = 'normal' | 'lite' | 'pro' | 'ultra';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  planId: PlanId;
  activeAgentsCount: number;
  status: UserStatus;
  stripeCustomerId?: string;
  llmConfig?: {
    provider: string;
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type AgentStatus = 'active' | 'paused' | 'archived';

export interface Agent {
  id: string;
  ownerUid: string;
  name: string;
  role: string;
  description: string;
  systemPrompt: string;
  status: AgentStatus;
  enabledTools: string[];
  knowledgeFileIds?: string[];
  telegramBotId?: string;
  modelOverride?: {
    provider?: string;
    baseUrl?: string;
    apiKey?: string;
    modelName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  ownerUid: string;
  agentId: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
}

export type MessageSender = 'user' | 'agent' | 'system';

export interface MessageAttachment {
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

export interface Message {
  id: string;
  conversationId: string;
  agentId: string;
  ownerUid: string;
  sender: MessageSender;
  content: string;
  attachments?: MessageAttachment[];
  toolCalls?: Array<{
    toolName: string;
    args: Record<string, unknown>;
    result?: unknown;
    status: 'pending' | 'success' | 'failed' | 'waiting_for_approval';
  }>;
  createdAt: string;
}

export type RunStatus = 'running' | 'waiting_for_approval' | 'completed' | 'failed' | 'cancelled';

export interface RunEvent {
  id: string;
  runId: string;
  type: 'thought' | 'tool_call' | 'tool_result' | 'approval_required' | 'error' | 'finish';
  title: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface Run {
  id: string;
  conversationId: string;
  agentId: string;
  ownerUid: string;
  status: RunStatus;
  totalSteps: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export type ApprovalRiskLevel = 'low' | 'medium' | 'high';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Approval {
  id: string;
  runId: string;
  agentId: string;
  ownerUid: string;
  actionType: string;
  targetService: string;
  payload: Record<string, unknown>;
  riskLevel: ApprovalRiskLevel;
  status: ApprovalStatus;
  createdAt: string;
  decidedAt?: string;
  decidedBy?: string;
}

export interface FileRecord {
  id: string;
  ownerUid: string;
  fileName: string;
  storageUrl: string;
  sizeBytes: number;
  mimeType: string;
  status: 'uploading' | 'extracting' | 'indexing' | 'ready' | 'failed';
  extractedText?: string;
  createdAt: string;
}

export interface DocumentChunk {
  id: string;
  fileId: string;
  ownerUid: string;
  chunkIndex: number;
  text: string;
  metadata?: Record<string, unknown>;
}

export interface Memory {
  id: string;
  ownerUid: string;
  agentId?: string;
  key: string;
  value: string;
  createdAt: string;
}

export interface Routine {
  id: string;
  ownerUid: string;
  agentId: string;
  name: string;
  cronExpression: string;
  prompt: string;
  active: boolean;
  lastRunAt?: string;
  createdAt: string;
}

export interface Integration {
  id: string;
  ownerUid: string;
  provider:
    | 'telegram'
    | 'instagram'
    | 'facebook'
    | 'gmail'
    | 'google_calendar'
    | 'google_maps'
    | 'google_drive'
    | 'notion'
    | 'canva'
    | 'figma'
    | 'openai'
    | 'anthropic'
    | 'gemini'
    | 'groq'
    | 'fal_ai'
    | 'elevenlabs'
    | 'slack'
    | 'rest_api';
  displayName: string;
  authType: 'api_key' | 'oauth' | 'bot_token' | 'webhook';
  status: 'connected' | 'needs_attention' | 'not_connected' | 'revoked';
  scopes: string[];
  lastTestedAt?: string;
  config?: Record<string, unknown>;
}

export interface TelegramConnection {
  id: string;
  ownerUid: string;
  botUsername: string;
  botTokenEncrypted: string;
  assignedAgentId?: string;
  status: 'connected' | 'error' | 'disconnected';
  lastTestedAt: string;
  createdAt: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  priceFormatted: string;
  maxAgents: number; // Normal: 2, Lite: 4, Pro: 9, Ultra: 15
  maxRunsPerMonth: number;
  maxFileStorageBytes: number;
  maxTelegramBots: number;
  features: string[];
  active: boolean;
}

export type OrderStatus = 'otp_pending' | 'otp_verified' | 'paid' | 'failed';

export interface Order {
  id: string;
  orderReference: string; // e.g. QW-2026-00125
  userId: string;
  userEmail: string;
  userName: string;
  planId: PlanId;
  amount: number;
  currency: string;
  status: OrderStatus;
  otpCode?: string;
  otpExpiresAt?: string;
  gateway: 'famgateway';
  gatewayTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanId;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'unpaid';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  gateway: 'famgateway' | 'stripe';
}

export interface BillingEvent {
  id: string;
  eventId: string;
  type: string;
  data: Record<string, unknown>;
  processedAt: string;
}

export interface AuditEvent {
  id: string;
  actorUid: string;
  action: string;
  resource: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}
