import { getDB } from '@/lib/db/adapter';
import { PlanId } from '@/lib/db/types';
import { QuotaLimitError } from '@/lib/errors/taxonomy';

export interface UserUsage {
  activeAgents: number;
  maxAgents: number;
  isAtLimit: boolean;
  activeReels: number;
  maxReels: number;
  isAtReelsLimit: boolean;
  planId: PlanId;
  planName: string;
}

export async function getUserEntitlements(userId: string): Promise<UserUsage> {
  const db = getDB();
  const user = await db.getUser(userId);
  const planId = (user?.planId || 'normal') as PlanId;
  const plan = await db.getPlan(planId);
  const maxAgents = plan?.maxAgents || (planId === 'ultra' ? 15 : 2);
  const maxReels = plan?.maxInstagramReels || (planId === 'ultra' ? 15 : 2);
  
  const agents = await db.getAgentsByUser(userId);
  const activeCount = agents.length;

  const reels = await db.getInstagramReelRules(userId);
  const activeReelsCount = reels.length;

  return {
    activeAgents: activeCount,
    maxAgents,
    isAtLimit: activeCount >= maxAgents,
    activeReels: activeReelsCount,
    maxReels,
    isAtReelsLimit: activeReelsCount >= maxReels,
    planId,
    planName: plan?.name || 'Normal (Free)',
  };
}

export async function assertCanCreateAgent(userId: string): Promise<void> {
  const { activeAgents, maxAgents, isAtLimit, planName } = await getUserEntitlements(userId);
  if (isAtLimit) {
    throw new QuotaLimitError(
      `Agent limit reached (${activeAgents} of ${maxAgents} used on "${planName}"). Upgrade to Lite (4 agents), Pro (9 agents), or Ultra (15 agents) to add more.`,
      {
        planLimit: maxAgents,
        currentUsage: activeAgents,
        upgradeUrl: '/billing',
        recoveryAction: 'Upgrade your subscription plan on the billing page to provision additional agents.',
      }
    );
  }
}

export async function assertCanCreateReel(userId: string): Promise<void> {
  const { activeReels, maxReels, isAtReelsLimit, planName } = await getUserEntitlements(userId);
  if (isAtReelsLimit) {
    throw new QuotaLimitError(
      `Instagram Reel limit reached (${activeReels} of ${maxReels} connected on "${planName}"). Upgrade to Ultra (15 Reels & 15 Bots) to automate more.`,
      {
        planLimit: maxReels,
        currentUsage: activeReels,
        upgradeUrl: '/billing',
        recoveryAction: 'Upgrade your subscription plan on the billing page to connect more Instagram reels.',
      }
    );
  }
}
