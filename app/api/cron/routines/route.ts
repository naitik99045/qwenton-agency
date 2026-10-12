import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/adapter';
import { runAgentLoop } from '@/lib/agent-runtime/runner';
import { sendTelegramMessage } from '@/lib/telegram/bot';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow sufficient execution window for agent loops

export async function GET(req: NextRequest) {
  return handleCronExecution(req);
}

export async function POST(req: NextRequest) {
  return handleCronExecution(req);
}

async function handleCronExecution(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get('authorization');
    const url = new URL(req.url);
    const querySecret = url.searchParams.get('secret');

    // Verify CRON_SECRET if configured
    if (cronSecret && cronSecret.trim().length > 0) {
      const isAuthorized =
        authHeader === `Bearer ${cronSecret}` ||
        querySecret === cronSecret;

      if (!isAuthorized) {
        return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 });
      }
    }

    const db = getDB();
    const users = await db.getAllUsers();
    const results: Array<{ routineId: string; name: string; user: string; status: string; summary?: string }> = [];

    for (const user of users) {
      try {
        const routines = await db.getRoutinesByUser(user.uid);
        const activeRoutines = routines.filter((r) => r.active !== false);

        for (const routine of activeRoutines) {
          const agent = await db.getAgent(routine.agentId);
          if (!agent) continue;

          // Find or create dedicated conversation for routine executions
          const conversations = await db.getConversationsByUser(user.uid);
          let conv = conversations.find(
            (c) => c.agentId === routine.agentId && c.title === `Routine: ${routine.name}`
          );

          if (!conv) {
            conv = await db.createConversation(
              user.uid,
              routine.agentId,
              `Routine: ${routine.name}`
            );
          }

          // Execute agent loop
          const generator = runAgentLoop({
            agentId: routine.agentId,
            conversationId: conv.id,
            userId: user.uid,
            userPrompt: routine.prompt,
          });

          let finalOutput = '';
          for await (const event of generator) {
            if (event.type === 'completed') {
              finalOutput = event.finalContent;
            }
          }

          // If user has Telegram bot connected, notify them of completed routine
          try {
            const conn = await db.getTelegramConnection(user.uid);
            if (conn?.botTokenEncrypted) {
              const preview = finalOutput ? finalOutput.slice(0, 1000) : 'Briefing ready in workspace.';
              const tgMsg = `⏰ *Automated Routine Executed: ${routine.name}*\nAgent: *${agent.name}* (${agent.role})\n\n${preview}`;
              await sendTelegramMessage(conn.botTokenEncrypted, conn.ownerUid, tgMsg);
            }
          } catch (tgErr) {
            console.warn('[Routine Cron] Telegram dispatch notice:', tgErr);
          }

          await db.createAuditEvent({
            actorUid: user.uid,
            action: 'routine.executed',
            resource: `routines/${routine.id}`,
            details: { name: routine.name, agentId: routine.agentId, agentName: agent.name },
          });

          results.push({
            routineId: routine.id,
            name: routine.name,
            user: user.email,
            status: 'completed',
            summary: finalOutput.slice(0, 150),
          });
        }
      } catch (userErr) {
        console.error(`[Routine Cron] Error processing user ${user.uid}:`, userErr);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      routinesExecuted: results.length,
      executions: results,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
