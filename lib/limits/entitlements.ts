import { getDB } from '@/lib/db/adapter';
import { PlanId } from '@/lib/db/types';

export interface UserUsage {
  activeAgents: number;
  maxAgents: number;
  isAtLimit: boolean;
  planId: PlanId;
  planName: string;
}

export async function getUserEntitlements(userId: string): Promise<UserUsage> {
  const db = getDB();
  const user = await db.getUser(userId);
  const planId = (user?.planId || 'normal') as PlanId;
  const plan = await db.getPlan(planId);
  const maxAgents = plan?.maxAgents || 2; // Normal/Free default = 2 agents
  
  const agents = await db.getAgentsByUser(userId);
  const activeCount = agents.length;

  return {
    activeAgents: activeCount,
    maxAgents,
    isAtLimit: activeCount >= maxAgents,
    planId,
    planName: plan?.name || 'Normal (Free)',
  };
}

export async function assertCanCreateAgent(userId: string): Promise<void> {
  const { activeAgents, maxAgents, isAtLimit, planName } = await getUserEntitlements(userId);
  if (isAtLimit) {
    throw new Error(
      `Agent limit reached (${activeAgents} of ${maxAgents} used on "${planName}"). Upgrade to Lite (4 agents), Pro (9 agents), or Ultra (15 agents) to add more.`
    );
  }
}
