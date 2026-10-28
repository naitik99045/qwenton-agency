import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { type, text, reelId } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text input is required to test simulation.' }, { status: 400 });
    }

    const db = getDB();
    const cleanText = text.trim();
    const upperText = cleanText.toUpperCase();

    if (type === 'comment') {
      // Test comment on Reel
      const rules = await db.getInstagramReelRules(user.uid);
      const activeRules = rules.filter((r) => r.status === 'active');

      let matchedRule = null;
      if (reelId) {
        matchedRule = activeRules.find((r) => r.id === reelId);
      }

      if (!matchedRule) {
        // Find by keyword
        matchedRule = activeRules.find((r) => {
          if (r.matchType === 'exact') {
            return upperText === r.triggerKeyword;
          }
          return upperText.includes(r.triggerKeyword);
        });
      }

      if (!matchedRule) {
        return NextResponse.json({
          matched: false,
          type: 'comment',
          message: `No active reel automation matched the comment "${cleanText}". Check your trigger keywords or activate the rule.`,
        });
      }

      // Pick randomized public reply
      const replies = matchedRule.publicReplies.length > 0
        ? matchedRule.publicReplies
        : ['Check your DM! Just sent you the blueprint 🚀'];
      const chosenReply = replies[Math.floor(Math.random() * replies.length)];

      // Increment stats for realism
      matchedRule.totalCommentsHandled = (matchedRule.totalCommentsHandled || 0) + 1;
      matchedRule.totalDmsSent = (matchedRule.totalDmsSent || 0) + 1;
      await db.saveInstagramReelRule(matchedRule);

      return NextResponse.json({
        matched: true,
        type: 'comment',
        ruleId: matchedRule.id,
        ruleTitle: matchedRule.reelTitle,
        triggerKeyword: matchedRule.triggerKeyword,
        publicReply: chosenReply,
        privateDm: matchedRule.dmMessage,
        stats: {
          commentsHandled: matchedRule.totalCommentsHandled,
          dmsSent: matchedRule.totalDmsSent,
        },
      });
    } else {
      // Test direct message
      const settings = await db.getInstagramSettings(user.uid);
      const triggers = settings?.dmKeywordTriggers || [];
      const activeTriggers = triggers.filter((t) => t.active);

      // 1. Check keyword triggers
      const matchedTrigger = activeTriggers.find((t) => upperText.includes(t.keyword.toUpperCase()));
      if (matchedTrigger) {
        return NextResponse.json({
          matched: true,
          type: 'keyword_dm',
          keyword: matchedTrigger.keyword,
          reply: matchedTrigger.reply,
        });
      }

      // 2. Check Busy / Away Mode
      if (settings?.isBusyModeActive) {
        return NextResponse.json({
          matched: true,
          type: 'busy_mode',
          isBusy: true,
          reply: settings.busyModeMessage,
        });
      }

      return NextResponse.json({
        matched: false,
        type: 'dm',
        message: `No keyword trigger matched "${cleanText}", and Away Mode is currently inactive.`,
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
