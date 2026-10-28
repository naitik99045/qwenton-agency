import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { DEFAULT_PLANS } from '@/lib/db/local-db';
import { InstagramReelRule, PlanId } from '@/lib/db/types';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();

    const plan = (await db.getPlan(user.planId)) || DEFAULT_PLANS[user.planId as PlanId] || DEFAULT_PLANS.normal;
    const rules = await db.getInstagramReelRules(user.uid);
    const maxReels = plan.maxInstagramReels ?? (user.planId === 'ultra' ? 15 : 2);

    return NextResponse.json({
      rules,
      quota: {
        currentReels: rules.length,
        maxReels,
        isAtLimit: rules.length >= maxReels,
        planId: user.planId,
        planName: plan.name,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const db = getDB();

    const {
      id,
      reelUrl,
      reelTitle,
      triggerKeyword,
      matchType = 'contains',
      publicReplies,
      dmMessage,
      assignedAgentId,
      status = 'active',
    } = body;

    if (!reelUrl || !triggerKeyword || !dmMessage) {
      return NextResponse.json(
        { error: 'Reel URL, trigger keyword, and DM message are required.' },
        { status: 400 }
      );
    }

    const plan = (await db.getPlan(user.planId)) || DEFAULT_PLANS[user.planId as PlanId] || DEFAULT_PLANS.normal;
    const maxReels = plan.maxInstagramReels ?? (user.planId === 'ultra' ? 15 : 2);
    const currentRules = await db.getInstagramReelRules(user.uid);

    // If creating a new rule, verify user hasn't hit their plan's reel limit
    const isNew = !id || !currentRules.some((r) => r.id === id);
    if (isNew && currentRules.length >= maxReels) {
      return NextResponse.json(
        {
          error: `Reels limit reached: Your ${plan.name} plan supports up to ${maxReels} reels. Upgrade to the Ultra Plan to automate up to 15 Reels and 15 Bots!`,
          isAtLimit: true,
          currentReels: currentRules.length,
          maxReels,
        },
        { status: 403 }
      );
    }

    const cleanReplies: string[] = Array.isArray(publicReplies) && publicReplies.length > 0
      ? publicReplies.map((r: string) => r.trim()).filter(Boolean)
      : ['Check your DM! Just sent you the details 🚀', 'Sent to your inbox! Check your DMs 📩'];

    const ruleRecord: InstagramReelRule = {
      id: id || `ig_reel_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ownerUid: user.uid,
      reelUrl: reelUrl.trim(),
      reelTitle: (reelTitle || 'Instagram Reel Automation').trim(),
      triggerKeyword: triggerKeyword.trim().toUpperCase(),
      matchType: matchType === 'exact' ? 'exact' : 'contains',
      publicReplies: cleanReplies,
      dmMessage: dmMessage.trim(),
      assignedAgentId: assignedAgentId || undefined,
      status: status === 'paused' ? 'paused' : 'active',
      totalCommentsHandled: isNew ? 0 : (currentRules.find((r) => r.id === id)?.totalCommentsHandled || 0),
      totalDmsSent: isNew ? 0 : (currentRules.find((r) => r.id === id)?.totalDmsSent || 0),
      createdAt: isNew ? new Date().toISOString() : (currentRules.find((r) => r.id === id)?.createdAt || new Date().toISOString()),
      updatedAt: new Date().toISOString(),
    };

    const saved = await db.saveInstagramReelRule(ruleRecord);

    await db.createAuditEvent({
      actorUid: user.uid,
      action: isNew ? 'instagram.reel_rule_created' : 'instagram.reel_rule_updated',
      resource: `instagram_reel/${saved.id}`,
      details: {
        reelTitle: saved.reelTitle,
        triggerKeyword: saved.triggerKeyword,
        status: saved.status,
      },
    });

    const updatedRules = await db.getInstagramReelRules(user.uid);

    return NextResponse.json({
      success: true,
      rule: saved,
      quota: {
        currentReels: updatedRules.length,
        maxReels,
        isAtLimit: updatedRules.length >= maxReels,
      },
      message: `Reel automation "${saved.reelTitle}" saved successfully!`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    const db = getDB();
    const existing = await db.getInstagramReelRule(id);
    if (!existing || existing.ownerUid !== user.uid) {
      return NextResponse.json({ error: 'Rule not found or unauthorized' }, { status: 404 });
    }

    await db.deleteInstagramReelRule(id);

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'instagram.reel_rule_deleted',
      resource: `instagram_reel/${id}`,
      details: { reelTitle: existing.reelTitle },
    });

    const currentRules = await db.getInstagramReelRules(user.uid);
    const plan = (await db.getPlan(user.planId)) || DEFAULT_PLANS[user.planId as PlanId] || DEFAULT_PLANS.normal;
    const maxReels = plan.maxInstagramReels ?? (user.planId === 'ultra' ? 15 : 2);

    return NextResponse.json({
      success: true,
      message: 'Reel automation removed.',
      quota: {
        currentReels: currentRules.length,
        maxReels,
        isAtLimit: currentRules.length >= maxReels,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
