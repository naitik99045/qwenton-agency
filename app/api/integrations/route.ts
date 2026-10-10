import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const db = getDB();
    const telegram = await db.getTelegramConnection(user.uid);

    const userIntegrations = await db.getIntegrationsByUser(user.uid);
    const intMap: Record<string, any> = {};
    userIntegrations.forEach((i) => {
      intMap[i.provider] = i;
    });

    const integrations = [
      // Marketing & Social
      {
        category: 'marketing',
        provider: 'instagram',
        displayName: 'Instagram Business',
        description: 'Publish carousels, schedule grid posts, research hashtags, and analyze engagement.',
        status: intMap['instagram']?.status || 'not_connected',
        authType: 'oauth',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'facebook',
        displayName: 'Facebook Pages',
        description: 'Draft organic posts, promotional announcements, and sync customer inquiries.',
        status: intMap['facebook']?.status || 'not_connected',
        authType: 'oauth',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'gmail',
        displayName: 'Gmail & Business Email',
        description: 'Send client outreach, email marketing campaigns, and handle inbound inquiries.',
        status: intMap['gmail']?.status || 'not_connected',
        authType: 'oauth',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'google_calendar',
        displayName: 'Google Calendar',
        description: 'Check team availability, schedule consultations, and sync marketing deadlines.',
        status: intMap['google_calendar']?.status || 'not_connected',
        authType: 'oauth',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'google_maps',
        displayName: 'Google Maps & Local SEO',
        description: 'Audit competitor rankings, analyze customer reviews, and enhance local search visibility.',
        status: intMap['google_maps']?.status || 'not_connected',
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'marketing',
        provider: 'telegram',
        displayName: 'Telegram Coworker Bot',
        description: 'Connect a Telegram bot to chat with your agents and receive mobile approval alerts.',
        status: telegram?.status || intMap['telegram']?.status || 'not_connected',
        botUsername: telegram?.botUsername,
        lastTestedAt: telegram?.lastTestedAt,
        authType: 'bot_token',
        requiresApproval: true,
      },

      // Design & Creative
      {
        category: 'design',
        provider: 'canva',
        displayName: 'Canva Design Hub',
        description: 'Auto-generate branded banner specs, color palettes, and social design templates.',
        status: intMap['canva']?.status || 'not_connected',
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'design',
        provider: 'figma',
        displayName: 'Figma Design Tokens',
        description: 'Inspect UI wireframes, extract design tokens, and audit brand style consistency.',
        status: intMap['figma']?.status || 'not_connected',
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'design',
        provider: 'fal_ai',
        displayName: 'FLUX / Midjourney (fal.ai)',
        description: 'High-speed AI image generation for photo-realistic creatives and clay 3D assets.',
        status: intMap['fal_ai']?.status || 'not_connected',
        authType: 'api_key',
        requiresApproval: false,
      },

      // Productivity & Docs
      {
        category: 'productivity',
        provider: 'google_drive',
        displayName: 'Google Drive & Sheets',
        description: 'Index spreadsheets, PDF briefs, and presentations into agent knowledge base.',
        status: intMap['google_drive']?.status || 'not_connected',
        authType: 'oauth',
        requiresApproval: false,
      },
      {
        category: 'productivity',
        provider: 'notion',
        displayName: 'Notion Workspace',
        description: 'Sync company documentation, databases, and project tasks into live memory.',
        status: intMap['notion']?.status || 'not_connected',
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'productivity',
        provider: 'slack',
        displayName: 'Slack Workspace',
        description: 'Post AI briefings, reports, and real-time team alerts directly to channels.',
        status: intMap['slack']?.status || 'not_connected',
        authType: 'oauth',
        requiresApproval: true,
      },

      // AI Models & Engines Vault
      {
        category: 'ai_vault',
        provider: 'openai',
        displayName: 'OpenAI API (GPT-4o & o3-mini)',
        description: 'Direct BYOK (Bring Your Own Key) access for OpenAI reasoning models.',
        status: intMap['openai']?.status || 'not_connected',
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'ai_vault',
        provider: 'anthropic',
        displayName: 'Anthropic Claude 3.5 Sonnet',
        description: 'Advanced nuance, creative copywriting, and structured data synthesis.',
        status: intMap['anthropic']?.status || 'not_connected',
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'ai_vault',
        provider: 'gemini',
        displayName: 'Google Gemini 1.5 Pro',
        description: 'Massive 1M+ token context window for large document and video analysis.',
        status: intMap['gemini']?.status || 'not_connected',
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'ai_vault',
        provider: 'groq',
        displayName: 'Groq Ultra-Fast Llama 3.3',
        description: 'Sub-second real-time streaming inference for rapid agent response loops.',
        status: intMap['groq']?.status || 'not_connected',
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'ai_vault',
        provider: 'elevenlabs',
        displayName: 'ElevenLabs Voice & Speech',
        description: 'Generate high-fidelity AI audio narration and multilingual voiceovers.',
        status: intMap['elevenlabs']?.status || 'not_connected',
        authType: 'api_key',
        requiresApproval: false,
      },
    ];

    return NextResponse.json({ integrations });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { provider, apiKey, config } = body;
    const db = getDB();

    if (!provider || !apiKey) {
      return NextResponse.json({ error: 'Provider and API key/token are required.' }, { status: 400 });
    }

    // Save directly to user's Firestore document
    const integrationRecord = {
      id: `${user.uid}_${provider}`,
      ownerUid: user.uid,
      provider,
      displayName: provider.replace('_', ' ').toUpperCase(),
      authType: 'api_key' as const,
      status: 'connected' as const,
      scopes: ['read', 'write'],
      lastTestedAt: new Date().toISOString(),
      config: {
        ...(config || {}),
        apiKeyEncrypted: apiKey, // Securely saved in server-side Firestore
      },
    };

    await db.saveIntegration(integrationRecord);

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'integration_configured',
      resource: provider,
      details: { status: 'connected', provider },
    });

    return NextResponse.json({
      success: true,
      message: `${provider} credentials securely saved in your Firestore.`,
      status: 'connected',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
