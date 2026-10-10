import fs from 'fs';
import path from 'path';
import {
  User,
  Agent,
  Conversation,
  Message,
  Run,
  RunEvent,
  Approval,
  FileRecord,
  DocumentChunk,
  Routine,
  Integration,
  TelegramConnection,
  Plan,
  PlanId,
  Order,
  Subscription,
  BillingEvent,
  AuditEvent,
} from './types';

interface DatabaseSchema {
  users: Record<string, User>;
  agents: Record<string, Agent>;
  conversations: Record<string, Conversation>;
  messages: Record<string, Message>;
  runs: Record<string, Run>;
  runEvents: Record<string, RunEvent>;
  approvals: Record<string, Approval>;
  files: Record<string, FileRecord>;
  documentChunks: Record<string, DocumentChunk>;
  routines: Record<string, Routine>;
  integrations: Record<string, Integration>;
  telegramConnections: Record<string, TelegramConnection>;
  plans: Record<string, Plan>;
  orders: Record<string, Order>;
  subscriptions: Record<string, Subscription>;
  billingEvents: Record<string, BillingEvent>;
  auditEvents: Record<string, AuditEvent>;
}

export const DEFAULT_PLANS: Record<PlanId, Plan> = {
  normal: {
    id: 'normal',
    name: 'Normal (Free)',
    price: 0,
    priceFormatted: '$0',
    maxAgents: 2,
    maxRunsPerMonth: 50,
    maxFileStorageBytes: 25 * 1024 * 1024, // 25MB
    maxTelegramBots: 1,
    features: ['2 AI Agents for Free Work', 'Local LM Studio & Ollama', 'Safe Web Research', 'Human Approvals'],
    active: true,
  },
  lite: {
    id: 'lite',
    name: 'Lite Coworker',
    price: 9,
    priceFormatted: '$9 / mo',
    maxAgents: 4,
    maxRunsPerMonth: 300,
    maxFileStorageBytes: 100 * 1024 * 1024, // 100MB
    maxTelegramBots: 1,
    features: ['4 AI Agents', 'Priority LLM Streaming', 'Telegram Bot Chat', '100MB File Knowledge'],
    active: true,
  },
  pro: {
    id: 'pro',
    name: 'Pro Coworker',
    price: 29,
    priceFormatted: '$29 / mo',
    maxAgents: 9,
    maxRunsPerMonth: 1000,
    maxFileStorageBytes: 500 * 1024 * 1024, // 500MB
    maxTelegramBots: 3,
    features: ['9 AI Agents', 'Gemini & OpenAI Cloud Access', 'Automated Scheduled Routines', '500MB Storage'],
    active: true,
  },
  ultra: {
    id: 'ultra',
    name: 'Ultra Business',
    price: 79,
    priceFormatted: '$79 / mo',
    maxAgents: 15,
    maxRunsPerMonth: 5000,
    maxFileStorageBytes: 2 * 1024 * 1024 * 1024, // 2GB
    maxTelegramBots: 5,
    features: ['15 AI Agents', 'Custom BaseURL & API Keys', 'Multi-channel Slack & Telegram', 'Unlimited Storage & Priority Queue'],
    active: true,
  },
};

class LocalDB {
  private data: DatabaseSchema;
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), '.local_db.json');
    this.data = this.loadInitialData();
  }

  private loadInitialData(): DatabaseSchema {
    if (fs.existsSync(this.filePath)) {
      try {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(content);
        // Ensure plans and orders match the new 4-tier structure
        parsed.plans = { ...DEFAULT_PLANS, ...(parsed.plans || {}) };
        parsed.orders = parsed.orders || {};
        // Clean any stale demo accounts
        if (parsed.users && parsed.users['demo_user_1']) {
          delete parsed.users['demo_user_1'];
        }
        if (parsed.agents && parsed.agents['agent_marketing_1']) {
          delete parsed.agents['agent_marketing_1'];
        }
        if (parsed.conversations && parsed.conversations['conv_welcome_1']) {
          delete parsed.conversations['conv_welcome_1'];
        }
        if (parsed.messages && parsed.messages['msg_welcome_1']) {
          delete parsed.messages['msg_welcome_1'];
        }
        return parsed;
      } catch (e) {
        console.warn('[LocalDB] Could not parse .local_db.json, reinitializing memory store', e);
      }
    }

    const initialData: DatabaseSchema = {
      users: {},
      agents: {},
      conversations: {},
      messages: {},
      runs: {},
      runEvents: {},
      approvals: {},
      files: {},
      documentChunks: {},
      routines: {},
      integrations: {},
      telegramConnections: {},
      plans: DEFAULT_PLANS,
      orders: {},
      subscriptions: {},
      billingEvents: {},
      auditEvents: {},
    };

    this.save(initialData);
    return initialData;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      // Ignore write errors in read-only serverless environments
    }
  }

  // Users
  getUser(uid: string): User | null {
    return this.data.users[uid] || null;
  }

  getUserByEmail(email: string): User | null {
    return Object.values(this.data.users).find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  saveUser(user: User): User {
    this.data.users[user.uid] = user;
    this.save();
    return user;
  }

  getAllUsers(): User[] {
    return Object.values(this.data.users);
  }

  // Agents & 4-Tier Hard Entitlement Limit
  getAgentsByUser(ownerUid: string): Agent[] {
    return Object.values(this.data.agents).filter((a) => a.ownerUid === ownerUid && a.status !== 'archived');
  }

  getAllAgentsByUser(ownerUid: string): Agent[] {
    return Object.values(this.data.agents).filter((a) => a.ownerUid === ownerUid);
  }

  getAllAgents(): Agent[] {
    return Object.values(this.data.agents);
  }

  getAgent(id: string): Agent | null {
    return this.data.agents[id] || null;
  }

  createAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Agent {
    const user = this.getUser(agent.ownerUid);
    const planId = (user?.planId || 'normal') as PlanId;
    const plan = this.data.plans[planId] || DEFAULT_PLANS.normal;
    const activeAgents = this.getAgentsByUser(agent.ownerUid);

    // Hard limit enforcement: Normal(2), Lite(4), Pro(9), Ultra(15)
    if (activeAgents.length >= plan.maxAgents) {
      throw new Error(`Agent limit reached. Your "${plan.name}" allows up to ${plan.maxAgents} active agents. Upgrade your plan to add more.`);
    }

    const id = `agent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newAgent: Agent = {
      ...agent,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.agents[id] = newAgent;
    if (user) {
      user.activeAgentsCount = activeAgents.length + 1;
      this.saveUser(user);
    }
    this.save();
    return newAgent;
  }

  updateAgent(id: string, updates: Partial<Agent>): Agent {
    const agent = this.getAgent(id);
    if (!agent) throw new Error('Agent not found');

    const updated: Agent = {
      ...agent,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.data.agents[id] = updated;

    if (updates.status && updates.status !== agent.status) {
      const user = this.getUser(agent.ownerUid);
      if (user) {
        user.activeAgentsCount = this.getAgentsByUser(agent.ownerUid).length;
        this.saveUser(user);
      }
    }

    this.save();
    return updated;
  }

  deleteAgent(id: string): boolean {
    const agent = this.getAgent(id);
    if (!agent) return false;
    delete this.data.agents[id];
    const user = this.getUser(agent.ownerUid);
    if (user) {
      user.activeAgentsCount = this.getAgentsByUser(agent.ownerUid).length;
      this.saveUser(user);
    }
    this.save();
    return true;
  }

  // Conversations & Messages
  getConversationsByUser(ownerUid: string): Conversation[] {
    return Object.values(this.data.conversations)
      .filter((c) => c.ownerUid === ownerUid)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }

  getConversation(id: string): Conversation | null {
    return this.data.conversations[id] || null;
  }

  createConversation(ownerUid: string, agentId: string, title?: string): Conversation {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const conversation: Conversation = {
      id,
      ownerUid,
      agentId,
      title: title || 'New Conversation',
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.data.conversations[id] = conversation;
    this.save();
    return conversation;
  }

  getMessages(conversationId: string): Message[] {
    return Object.values(this.data.messages)
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  createMessage(msg: Omit<Message, 'id' | 'createdAt'>): Message {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newMsg: Message = {
      ...msg,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.messages[id] = newMsg;

    const conv = this.getConversation(msg.conversationId);
    if (conv) {
      conv.lastMessageAt = newMsg.createdAt;
      this.data.conversations[conv.id] = conv;
    }

    this.save();
    return newMsg;
  }

  // Runs & Events
  createRun(run: Omit<Run, 'id' | 'startedAt'>): Run {
    const id = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRun: Run = {
      ...run,
      id,
      startedAt: new Date().toISOString(),
    };
    this.data.runs[id] = newRun;
    this.save();
    return newRun;
  }

  getRun(id: string): Run | null {
    return this.data.runs[id] || null;
  }

  updateRun(id: string, updates: Partial<Run>): Run {
    const run = this.getRun(id);
    if (!run) throw new Error('Run not found');
    const updated = { ...run, ...updates };
    this.data.runs[id] = updated;
    this.save();
    return updated;
  }

  createRunEvent(event: Omit<RunEvent, 'id' | 'timestamp'>): RunEvent {
    const id = `event_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEvent: RunEvent = {
      ...event,
      id,
      timestamp: new Date().toISOString(),
    };
    this.data.runEvents[id] = newEvent;
    this.save();
    return newEvent;
  }

  getRunEvents(runId: string): RunEvent[] {
    return Object.values(this.data.runEvents)
      .filter((e) => e.runId === runId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Approvals
  createApproval(approval: Omit<Approval, 'id' | 'createdAt' | 'status'>): Approval {
    const id = `appr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newAppr: Approval = {
      ...approval,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.data.approvals[id] = newAppr;
    this.save();
    return newAppr;
  }

  getApprovalsByUser(ownerUid: string): Approval[] {
    return Object.values(this.data.approvals)
      .filter((a) => a.ownerUid === ownerUid)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getApproval(id: string): Approval | null {
    return this.data.approvals[id] || null;
  }

  updateApproval(id: string, status: 'approved' | 'rejected', decidedBy: string): Approval {
    const appr = this.getApproval(id);
    if (!appr) throw new Error('Approval not found');
    appr.status = status;
    appr.decidedAt = new Date().toISOString();
    appr.decidedBy = decidedBy;
    this.data.approvals[id] = appr;
    this.save();
    return appr;
  }

  // Files & Knowledge
  createFile(file: Omit<FileRecord, 'id' | 'createdAt'>): FileRecord {
    const id = `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newFile: FileRecord = {
      ...file,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.files[id] = newFile;
    this.save();
    return newFile;
  }

  getFilesByUser(ownerUid: string): FileRecord[] {
    return Object.values(this.data.files)
      .filter((f) => f.ownerUid === ownerUid)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getFile(id: string): FileRecord | null {
    return this.data.files[id] || null;
  }

  deleteFile(id: string): boolean {
    if (!this.data.files[id]) return false;
    delete this.data.files[id];
    Object.keys(this.data.documentChunks).forEach((k) => {
      if (this.data.documentChunks[k].fileId === id) {
        delete this.data.documentChunks[k];
      }
    });
    this.save();
    return true;
  }

  saveChunks(chunks: Array<Omit<DocumentChunk, 'id'>>) {
    chunks.forEach((c) => {
      const id = `chunk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      this.data.documentChunks[id] = { ...c, id };
    });
    this.save();
  }

  searchChunks(ownerUid: string, query: string, limit = 5): DocumentChunk[] {
    const q = query.toLowerCase();
    const userChunks = Object.values(this.data.documentChunks).filter((c) => c.ownerUid === ownerUid);
    return userChunks
      .filter((c) => c.text.toLowerCase().includes(q))
      .slice(0, limit);
  }

  // Routines
  getRoutinesByUser(ownerUid: string): Routine[] {
    return Object.values(this.data.routines).filter((r) => r.ownerUid === ownerUid);
  }

  createRoutine(routine: Omit<Routine, 'id' | 'createdAt'>): Routine {
    const id = `routine_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newR = { ...routine, id, createdAt: new Date().toISOString() };
    this.data.routines[id] = newR;
    this.save();
    return newR;
  }

  // Integrations
  getIntegrationsByUser(ownerUid: string): Integration[] {
    return Object.values(this.data.integrations || {}).filter((i) => i.ownerUid === ownerUid);
  }

  getIntegration(ownerUid: string, provider: string): Integration | null {
    return Object.values(this.data.integrations || {}).find((i) => i.ownerUid === ownerUid && i.provider === provider) || null;
  }

  saveIntegration(integration: Integration): Integration {
    if (!this.data.integrations) this.data.integrations = {};
    this.data.integrations[integration.id] = integration;
    this.save();
    return integration;
  }

  deleteIntegration(ownerUid: string, provider: string) {
    if (!this.data.integrations) return;
    const found = Object.values(this.data.integrations).find((i) => i.ownerUid === ownerUid && i.provider === provider);
    if (found) {
      delete this.data.integrations[found.id];
      this.save();
    }
  }

  // Telegram
  getTelegramConnection(ownerUid: string): TelegramConnection | null {
    return Object.values(this.data.telegramConnections).find((t) => t.ownerUid === ownerUid) || null;
  }

  saveTelegramConnection(conn: TelegramConnection): TelegramConnection {
    this.data.telegramConnections[conn.id] = conn;
    this.save();
    return conn;
  }

  deleteTelegramConnection(id: string) {
    delete this.data.telegramConnections[id];
    this.save();
  }

  // Plans
  getPlans(): Plan[] {
    return Object.values(this.data.plans);
  }

  getPlan(id: string): Plan | null {
    return this.data.plans[id] || null;
  }

  updatePlan(id: string, updates: Partial<Plan>): Plan {
    const plan = this.getPlan(id);
    if (!plan) throw new Error('Plan not found');
    const updated: Plan = {
      ...plan,
      ...updates,
      priceFormatted:
        updates.price !== undefined
          ? updates.price === 0
            ? '$0'
            : `$${updates.price} / mo`
          : plan.priceFormatted,
    };
    this.data.plans[id] = updated;
    this.save();
    return updated;
  }

  // Orders (FAM Gateway & EmailJS OTP)
  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newOrder: Order = {
      ...order,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.orders[id] = newOrder;
    this.save();
    return newOrder;
  }

  getOrder(id: string): Order | null {
    return this.data.orders[id] || null;
  }

  getOrderByReference(reference: string): Order | null {
    return Object.values(this.data.orders).find((o) => o.orderReference === reference) || null;
  }

  updateOrder(id: string, updates: Partial<Order>): Order {
    const order = this.getOrder(id);
    if (!order) throw new Error('Order not found');
    const updated = {
      ...order,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.orders[id] = updated;
    this.save();
    return updated;
  }

  getOrdersByUser(userId: string): Order[] {
    return Object.values(this.data.orders)
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllOrders(): Order[] {
    return Object.values(this.data.orders).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Subscriptions
  getSubscriptionByUser(userId: string): Subscription | null {
    return Object.values(this.data.subscriptions).find((s) => s.userId === userId) || null;
  }

  saveSubscription(sub: Subscription): Subscription {
    this.data.subscriptions[sub.id] = sub;
    this.save();
    return sub;
  }

  // Audit
  createAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt'>): AuditEvent {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newA: AuditEvent = { ...event, id, createdAt: new Date().toISOString() };
    this.data.auditEvents[id] = newA;
    this.save();
    return newA;
  }

  getAuditEvents(limit = 100): AuditEvent[] {
    return Object.values(this.data.auditEvents)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

const globalForDb = globalThis as unknown as { localDbInstance: LocalDB };
export const localDb = globalForDb.localDbInstance || new LocalDB();
if (process.env.NODE_ENV !== 'production') globalForDb.localDbInstance = localDb;
