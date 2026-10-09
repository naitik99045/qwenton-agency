import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();
    const telegram = await db.getTelegramConnection(user.uid);

    const integrations = [
      {
        provider: 'telegram',
        displayName: 'Telegram Bot',
        description: 'Connect a Telegram bot to chat with your agents and receive approval alerts on mobile.',
        status: telegram?.status || 'not_connected',
        botUsername: telegram?.botUsername,
        lastTestedAt: telegram?.lastTestedAt,
        requiresApproval: true,
      },
      {
        provider: 'slack',
        displayName: 'Slack Workspace',
        description: 'Post AI briefings, reports, and alerts directly into your Slack channels.',
        status: 'not_connected',
        requiresApproval: true,
      },
      {
        provider: 'google_drive',
        displayName: 'Google Drive',
        description: 'Import research folders, PDF documents, and spreadsheets into the agent knowledge base.',
        status: 'not_connected',
        requiresApproval: false,
      },
      {
        provider: 'notion',
        displayName: 'Notion Workspace',
        description: 'Sync docs and marketing wiki pages directly into agent memory.',
        status: 'not_connected',
        requiresApproval: false,
      },
      {
        provider: 'github',
        displayName: 'GitHub Repositories',
        description: 'Review pull requests and code repos with specialized engineering agents.',
        status: 'not_connected',
        requiresApproval: false,
      },
    ];

    return NextResponse.json({ integrations });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}
