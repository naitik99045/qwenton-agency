import { localDb, DEFAULT_PLANS } from './local-db';
import { adminFirestore, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
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
  TelegramConnection,
  Plan,
  PlanId,
  Order,
  Subscription,
  AuditEvent,
} from './types';

export interface DatabaseAdapter {
  // Users
  getUser(uid: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  saveUser(user: User): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Agents & Limit
  getAgentsByUser(ownerUid: string): Promise<Agent[]>;
  getAllAgentsByUser(ownerUid: string): Promise<Agent[]>;
  getAllAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | null>;
  createAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent>;
  updateAgent(id: string, updates: Partial<Agent>): Promise<Agent>;
  deleteAgent(id: string): Promise<boolean>;

  // Conversations & Messages
  getConversationsByUser(ownerUid: string): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | null>;
  createConversation(ownerUid: string, agentId: string, title?: string): Promise<Conversation>;
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(msg: Omit<Message, 'id' | 'createdAt'>): Promise<Message>;

  // Runs & Events
  createRun(run: Omit<Run, 'id' | 'startedAt'>): Promise<Run>;
  getRun(id: string): Promise<Run | null>;
  updateRun(id: string, updates: Partial<Run>): Promise<Run>;
  createRunEvent(event: Omit<RunEvent, 'id' | 'timestamp'>): Promise<RunEvent>;
  getRunEvents(runId: string): Promise<RunEvent[]>;

  // Approvals
  createApproval(approval: Omit<Approval, 'id' | 'createdAt' | 'status'>): Promise<Approval>;
  getApprovalsByUser(ownerUid: string): Promise<Approval[]>;
  getApproval(id: string): Promise<Approval | null>;
  updateApproval(id: string, status: 'approved' | 'rejected', decidedBy: string): Promise<Approval>;

  // Files & Knowledge
  createFile(file: Omit<FileRecord, 'id' | 'createdAt'>): Promise<FileRecord>;
  getFilesByUser(ownerUid: string): Promise<FileRecord[]>;
  getFile(id: string): Promise<FileRecord | null>;
  deleteFile(id: string): Promise<boolean>;
  saveChunks(chunks: Array<Omit<DocumentChunk, 'id'>>): Promise<void>;
  searchChunks(ownerUid: string, query: string, limit?: number): Promise<DocumentChunk[]>;

  // Routines
  getRoutinesByUser(ownerUid: string): Promise<Routine[]>;
  createRoutine(routine: Omit<Routine, 'id' | 'createdAt'>): Promise<Routine>;

  // Integrations & API Vault (Saved directly to User's Firestore)
  getIntegrationsByUser(ownerUid: string): Promise<Integration[]>;
  getIntegration(ownerUid: string, provider: string): Promise<Integration | null>;
  saveIntegration(integration: Integration): Promise<Integration>;
  deleteIntegration(ownerUid: string, provider: string): Promise<void>;

  // Telegram
  getTelegramConnection(ownerUid: string): Promise<TelegramConnection | null>;
  saveTelegramConnection(conn: TelegramConnection): Promise<TelegramConnection>;
  deleteTelegramConnection(id: string): Promise<void>;

  // Plans
  getPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | null>;
  updatePlan(id: string, updates: Partial<Plan>): Promise<Plan>;

  // Orders (FAM Gateway & OTP)
  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  getOrderByReference(reference: string): Promise<Order | null>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;

  // Subscriptions
  getSubscriptionByUser(userId: string): Promise<Subscription | null>;
  saveSubscription(sub: Subscription): Promise<Subscription>;

  // Audit
  createAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt'>): Promise<AuditEvent>;
  getAuditEvents(limit?: number): Promise<AuditEvent[]>;
}

class FirestoreAdapter implements DatabaseAdapter {
  async getUser(uid: string): Promise<User | null> {
    const doc = await adminFirestore.collection('users').doc(uid).get();
    return doc.exists ? (doc.data() as User) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const snap = await adminFirestore.collection('users').where('email', '==', email).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as User;
  }

  async saveUser(user: User): Promise<User> {
    await adminFirestore.collection('users').doc(user.uid).set(user, { merge: true });
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const snap = await adminFirestore.collection('users').get();
    return snap.docs.map((d) => d.data() as User);
  }

  async getAgentsByUser(ownerUid: string): Promise<Agent[]> {
    const snap = await adminFirestore
      .collection('agents')
      .where('ownerUid', '==', ownerUid)
      .get();
    return snap.docs
      .map((d) => d.data() as Agent)
      .filter((a) => a.status !== 'archived');
  }

  async getAllAgentsByUser(ownerUid: string): Promise<Agent[]> {
    const snap = await adminFirestore.collection('agents').where('ownerUid', '==', ownerUid).get();
    return snap.docs.map((d) => d.data() as Agent);
  }

  async getAllAgents(): Promise<Agent[]> {
    const snap = await adminFirestore.collection('agents').get();
    return snap.docs.map((d) => d.data() as Agent);
  }

  async getAgent(id: string): Promise<Agent | null> {
    const doc = await adminFirestore.collection('agents').doc(id).get();
    return doc.exists ? (doc.data() as Agent) : null;
  }

  async createAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent> {
    return await adminFirestore.runTransaction(async (transaction) => {
      const userRef = adminFirestore.collection('users').doc(agent.ownerUid);
      const userDoc = await transaction.get(userRef);
      const userData = userDoc.data() as User | undefined;
      const planId = (userData?.planId || 'normal') as PlanId;
      const plan = DEFAULT_PLANS[planId] || DEFAULT_PLANS.normal;

      const allAgentsSnap = await adminFirestore
        .collection('agents')
        .where('ownerUid', '==', agent.ownerUid)
        .get();
      const activeAgents = allAgentsSnap.docs
        .map((d) => d.data() as Agent)
        .filter((a) => a.status !== 'archived');

      if (activeAgents.length >= plan.maxAgents) {
        throw new Error(`Agent limit reached. Your "${plan.name}" allows up to ${plan.maxAgents} active agents.`);
      }

      const newAgentRef = adminFirestore.collection('agents').doc();
      const newAgent: Agent = {
        ...agent,
        id: newAgentRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      transaction.set(newAgentRef, newAgent);
      transaction.update(userRef, {
        activeAgentsCount: activeAgents.length + 1,
        updatedAt: new Date().toISOString(),
      });

      return newAgent;
    });
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    const ref = adminFirestore.collection('agents').doc(id);
    await ref.update({ ...updates, updatedAt: new Date().toISOString() });
    const doc = await ref.get();
    return doc.data() as Agent;
  }

  async deleteAgent(id: string): Promise<boolean> {
    await adminFirestore.collection('agents').doc(id).delete();
    return true;
  }

  async getConversationsByUser(ownerUid: string): Promise<Conversation[]> {
    const snap = await adminFirestore.collection('conversations').where('ownerUid', '==', ownerUid).get();
    return snap.docs
      .map((d) => d.data() as Conversation)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const doc = await adminFirestore.collection('conversations').doc(id).get();
    return doc.exists ? (doc.data() as Conversation) : null;
  }

  async createConversation(ownerUid: string, agentId: string, title?: string): Promise<Conversation> {
    const ref = adminFirestore.collection('conversations').doc();
    const conv: Conversation = {
      id: ref.id,
      ownerUid,
      agentId,
      title: title || 'New Conversation',
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await ref.set(conv);
    return conv;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const snap = await adminFirestore.collection('messages').where('conversationId', '==', conversationId).get();
    return snap.docs
      .map((d) => d.data() as Message)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createMessage(msg: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    const ref = adminFirestore.collection('messages').doc();
    const newMsg: Message = {
      ...msg,
      id: ref.id,
      createdAt: new Date().toISOString(),
    };
    await ref.set(newMsg);
    await adminFirestore.collection('conversations').doc(msg.conversationId).update({
      lastMessageAt: newMsg.createdAt,
    });
    return newMsg;
  }

  async createRun(run: Omit<Run, 'id' | 'startedAt'>): Promise<Run> {
    const ref = adminFirestore.collection('runs').doc();
    const newRun: Run = { ...run, id: ref.id, startedAt: new Date().toISOString() };
    await ref.set(newRun);
    return newRun;
  }

  async getRun(id: string): Promise<Run | null> {
    const doc = await adminFirestore.collection('runs').doc(id).get();
    return doc.exists ? (doc.data() as Run) : null;
  }

  async updateRun(id: string, updates: Partial<Run>): Promise<Run> {
    const ref = adminFirestore.collection('runs').doc(id);
    await ref.update(updates);
    const doc = await ref.get();
    return doc.data() as Run;
  }

  async createRunEvent(event: Omit<RunEvent, 'id' | 'timestamp'>): Promise<RunEvent> {
    const ref = adminFirestore.collection('runEvents').doc();
    const newEvent: RunEvent = { ...event, id: ref.id, timestamp: new Date().toISOString() };
    await ref.set(newEvent);
    return newEvent;
  }

  async getRunEvents(runId: string): Promise<RunEvent[]> {
    const snap = await adminFirestore.collection('runEvents').where('runId', '==', runId).get();
    return snap.docs
      .map((d) => d.data() as RunEvent)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createApproval(approval: Omit<Approval, 'id' | 'createdAt' | 'status'>): Promise<Approval> {
    const ref = adminFirestore.collection('approvals').doc();
    const newAppr: Approval = {
      ...approval,
      id: ref.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await ref.set(newAppr);
    return newAppr;
  }

  async getApprovalsByUser(ownerUid: string): Promise<Approval[]> {
    const snap = await adminFirestore.collection('approvals').where('ownerUid', '==', ownerUid).get();
    return snap.docs
      .map((d) => d.data() as Approval)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getApproval(id: string): Promise<Approval | null> {
    const doc = await adminFirestore.collection('approvals').doc(id).get();
    return doc.exists ? (doc.data() as Approval) : null;
  }

  async updateApproval(id: string, status: 'approved' | 'rejected', decidedBy: string): Promise<Approval> {
    const ref = adminFirestore.collection('approvals').doc(id);
    await ref.update({
      status,
      decidedAt: new Date().toISOString(),
      decidedBy,
    });
    const doc = await ref.get();
    return doc.data() as Approval;
  }

  async createFile(file: Omit<FileRecord, 'id' | 'createdAt'>): Promise<FileRecord> {
    const ref = adminFirestore.collection('files').doc();
    const newFile: FileRecord = { ...file, id: ref.id, createdAt: new Date().toISOString() };
    await ref.set(newFile);
    return newFile;
  }

  async getFilesByUser(ownerUid: string): Promise<FileRecord[]> {
    const snap = await adminFirestore.collection('files').where('ownerUid', '==', ownerUid).get();
    return snap.docs
      .map((d) => d.data() as FileRecord)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getFile(id: string): Promise<FileRecord | null> {
    const doc = await adminFirestore.collection('files').doc(id).get();
    return doc.exists ? (doc.data() as FileRecord) : null;
  }

  async deleteFile(id: string): Promise<boolean> {
    await adminFirestore.collection('files').doc(id).delete();
    return true;
  }

  async saveChunks(chunks: Array<Omit<DocumentChunk, 'id'>>): Promise<void> {
    const batch = adminFirestore.batch();
    chunks.forEach((chunk) => {
      const ref = adminFirestore.collection('documentChunks').doc();
      batch.set(ref, { ...chunk, id: ref.id });
    });
    await batch.commit();
  }

  async searchChunks(ownerUid: string, query: string, limit = 5): Promise<DocumentChunk[]> {
    const q = query.toLowerCase();
    const snap = await adminFirestore.collection('documentChunks').where('ownerUid', '==', ownerUid).limit(50).get();
    return snap.docs
      .map((d) => d.data() as DocumentChunk)
      .filter((c) => c.text.toLowerCase().includes(q))
      .slice(0, limit);
  }

  async getRoutinesByUser(ownerUid: string): Promise<Routine[]> {
    const snap = await adminFirestore.collection('routines').where('ownerUid', '==', ownerUid).get();
    return snap.docs.map((d) => d.data() as Routine);
  }

  async createRoutine(routine: Omit<Routine, 'id' | 'createdAt'>): Promise<Routine> {
    const ref = adminFirestore.collection('routines').doc();
    const newR: Routine = { ...routine, id: ref.id, createdAt: new Date().toISOString() };
    await ref.set(newR);
    return newR;
  }

  // Integrations & API Vault (Stored directly in user's subcollection in Firestore)
  async getIntegrationsByUser(ownerUid: string): Promise<Integration[]> {
    const snap = await adminFirestore.collection('users').doc(ownerUid).collection('integrations').get();
    return snap.docs.map((d) => d.data() as Integration);
  }

  async getIntegration(ownerUid: string, provider: string): Promise<Integration | null> {
    const doc = await adminFirestore.collection('users').doc(ownerUid).collection('integrations').doc(provider).get();
    return doc.exists ? (doc.data() as Integration) : null;
  }

  async saveIntegration(integration: Integration): Promise<Integration> {
    await adminFirestore
      .collection('users')
      .doc(integration.ownerUid)
      .collection('integrations')
      .doc(integration.provider)
      .set(integration, { merge: true });
    return integration;
  }

  async deleteIntegration(ownerUid: string, provider: string): Promise<void> {
    await adminFirestore
      .collection('users')
      .doc(ownerUid)
      .collection('integrations')
      .doc(provider)
      .delete();
  }

  async getTelegramConnection(ownerUid: string): Promise<TelegramConnection | null> {
    const snap = await adminFirestore.collection('telegramConnections').where('ownerUid', '==', ownerUid).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as TelegramConnection;
  }

  async saveTelegramConnection(conn: TelegramConnection): Promise<TelegramConnection> {
    await adminFirestore.collection('telegramConnections').doc(conn.id).set(conn, { merge: true });
    return conn;
  }

  async deleteTelegramConnection(id: string): Promise<void> {
    await adminFirestore.collection('telegramConnections').doc(id).delete();
  }

  async getPlans(): Promise<Plan[]> {
    try {
      const snap = await adminFirestore.collection('plans').get();
      if (snap.empty) {
        return Object.values(DEFAULT_PLANS);
      }
      return snap.docs.map((d) => d.data() as Plan);
    } catch {
      return Object.values(DEFAULT_PLANS);
    }
  }

  async getPlan(id: string): Promise<Plan | null> {
    try {
      const doc = await adminFirestore.collection('plans').doc(id).get();
      if (doc.exists) {
        return doc.data() as Plan;
      }
      return DEFAULT_PLANS[id as PlanId] || null;
    } catch {
      return DEFAULT_PLANS[id as PlanId] || null;
    }
  }

  async updatePlan(id: string, updates: Partial<Plan>): Promise<Plan> {
    const ref = adminFirestore.collection('plans').doc(id);
    const existing = await this.getPlan(id);
    const updated: Plan = {
      ...(existing || DEFAULT_PLANS[id as PlanId] || {
        id: id as PlanId,
        name: id,
        price: 0,
        priceFormatted: '$0',
        maxAgents: 2,
        maxRunsPerMonth: 50,
        maxFileStorageBytes: 25 * 1024 * 1024,
        maxTelegramBots: 1,
        features: [],
        active: true,
      }),
      ...updates,
      priceFormatted:
        updates.price !== undefined
          ? updates.price === 0
            ? '$0'
            : `$${updates.price} / mo`
          : existing?.priceFormatted || '$0',
    };
    await ref.set(updated, { merge: true });
    return updated;
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const ref = adminFirestore.collection('orders').doc();
    const newOrder: Order = {
      ...order,
      id: ref.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await ref.set(newOrder);
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | null> {
    const doc = await adminFirestore.collection('orders').doc(id).get();
    return doc.exists ? (doc.data() as Order) : null;
  }

  async getOrderByReference(reference: string): Promise<Order | null> {
    const snap = await adminFirestore.collection('orders').where('orderReference', '==', reference).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as Order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const ref = adminFirestore.collection('orders').doc(id);
    await ref.update({ ...updates, updatedAt: new Date().toISOString() });
    const doc = await ref.get();
    return doc.data() as Order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const snap = await adminFirestore.collection('orders').where('userId', '==', userId).get();
    return snap.docs
      .map((d) => d.data() as Order)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllOrders(): Promise<Order[]> {
    const snap = await adminFirestore.collection('orders').get();
    return snap.docs
      .map((d) => d.data() as Order)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getSubscriptionByUser(userId: string): Promise<Subscription | null> {
    const snap = await adminFirestore.collection('subscriptions').where('userId', '==', userId).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as Subscription;
  }

  async saveSubscription(sub: Subscription): Promise<Subscription> {
    await adminFirestore.collection('subscriptions').doc(sub.id).set(sub, { merge: true });
    return sub;
  }

  async createAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt'>): Promise<AuditEvent> {
    const ref = adminFirestore.collection('auditEvents').doc();
    const newA: AuditEvent = { ...event, id: ref.id, createdAt: new Date().toISOString() };
    await ref.set(newA);
    return newA;
  }

  async getAuditEvents(limit = 100): Promise<AuditEvent[]> {
    const snap = await adminFirestore.collection('auditEvents').orderBy('createdAt', 'desc').limit(limit).get();
    return snap.docs.map((d) => d.data() as AuditEvent);
  }
}

class LocalDBAdapter implements DatabaseAdapter {
  async getUser(uid: string) { return localDb.getUser(uid); }
  async getUserByEmail(email: string) { return localDb.getUserByEmail(email); }
  async saveUser(user: User) { return localDb.saveUser(user); }
  async getAllUsers() { return localDb.getAllUsers(); }

  async getAgentsByUser(ownerUid: string) { return localDb.getAgentsByUser(ownerUid); }
  async getAllAgentsByUser(ownerUid: string) { return localDb.getAllAgentsByUser(ownerUid); }
  async getAllAgents() { return localDb.getAllAgents(); }
  async getAgent(id: string) { return localDb.getAgent(id); }
  async createAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) { return localDb.createAgent(agent); }
  async updateAgent(id: string, updates: Partial<Agent>) { return localDb.updateAgent(id, updates); }
  async deleteAgent(id: string) { return localDb.deleteAgent(id); }

  async getConversationsByUser(ownerUid: string) { return localDb.getConversationsByUser(ownerUid); }
  async getConversation(id: string) { return localDb.getConversation(id); }
  async createConversation(ownerUid: string, agentId: string, title?: string) { return localDb.createConversation(ownerUid, agentId, title); }
  async getMessages(conversationId: string) { return localDb.getMessages(conversationId); }
  async createMessage(msg: Omit<Message, 'id' | 'createdAt'>) { return localDb.createMessage(msg); }

  async createRun(run: Omit<Run, 'id' | 'startedAt'>) { return localDb.createRun(run); }
  async getRun(id: string) { return localDb.getRun(id); }
  async updateRun(id: string, updates: Partial<Run>) { return localDb.updateRun(id, updates); }
  async createRunEvent(event: Omit<RunEvent, 'id' | 'timestamp'>) { return localDb.createRunEvent(event); }
  async getRunEvents(runId: string) { return localDb.getRunEvents(runId); }

  async createApproval(approval: Omit<Approval, 'id' | 'createdAt' | 'status'>) { return localDb.createApproval(approval); }
  async getApprovalsByUser(ownerUid: string) { return localDb.getApprovalsByUser(ownerUid); }
  async getApproval(id: string) { return localDb.getApproval(id); }
  async updateApproval(id: string, status: 'approved' | 'rejected', decidedBy: string) { return localDb.updateApproval(id, status, decidedBy); }

  async createFile(file: Omit<FileRecord, 'id' | 'createdAt'>) { return localDb.createFile(file); }
  async getFilesByUser(ownerUid: string) { return localDb.getFilesByUser(ownerUid); }
  async getFile(id: string) { return localDb.getFile(id); }
  async deleteFile(id: string) { return localDb.deleteFile(id); }
  async saveChunks(chunks: Array<Omit<DocumentChunk, 'id'>>) { return localDb.saveChunks(chunks); }
  async searchChunks(ownerUid: string, query: string, limit = 5) { return localDb.searchChunks(ownerUid, query, limit); }

  async getRoutinesByUser(ownerUid: string) { return localDb.getRoutinesByUser(ownerUid); }
  async createRoutine(routine: Omit<Routine, 'id' | 'createdAt'>) { return localDb.createRoutine(routine); }

  async getIntegrationsByUser(ownerUid: string) { return localDb.getIntegrationsByUser(ownerUid); }
  async getIntegration(ownerUid: string, provider: string) { return localDb.getIntegration(ownerUid, provider); }
  async saveIntegration(integration: Integration) { return localDb.saveIntegration(integration); }
  async deleteIntegration(ownerUid: string, provider: string) { return localDb.deleteIntegration(ownerUid, provider); }

  async getTelegramConnection(ownerUid: string) { return localDb.getTelegramConnection(ownerUid); }
  async saveTelegramConnection(conn: TelegramConnection) { return localDb.saveTelegramConnection(conn); }
  async deleteTelegramConnection(id: string) { return localDb.deleteTelegramConnection(id); }

  async getPlans() { return localDb.getPlans(); }
  async getPlan(id: string) { return localDb.getPlan(id); }
  async updatePlan(id: string, updates: Partial<Plan>) { return localDb.updatePlan(id, updates); }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) { return localDb.createOrder(order); }
  async getOrder(id: string) { return localDb.getOrder(id); }
  async getOrderByReference(reference: string) { return localDb.getOrderByReference(reference); }
  async updateOrder(id: string, updates: Partial<Order>) { return localDb.updateOrder(id, updates); }
  async getOrdersByUser(userId: string) { return localDb.getOrdersByUser(userId); }
  async getAllOrders() { return localDb.getAllOrders(); }

  async getSubscriptionByUser(userId: string) { return localDb.getSubscriptionByUser(userId); }
  async saveSubscription(sub: Subscription) { return localDb.saveSubscription(sub); }

  async createAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt'>) { return localDb.createAuditEvent(event); }
  async getAuditEvents(limit = 100) { return localDb.getAuditEvents(limit); }
}

export function getDB(): DatabaseAdapter {
  if (isFirebaseAdminConfigured) {
    return new FirestoreAdapter();
  }
  return new LocalDBAdapter();
}
