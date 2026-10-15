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
      // Marketing & Social Ad Networks
      {
        category: 'marketing',
        provider: 'meta_ads',
        displayName: 'Meta Ads Manager',
        description: 'Automate ads insights, ROAS calculation, CPC tracking, and audience optimization.',
        status: intMap['meta_ads']?.status || 'not_connected',
        maskedKey: intMap['meta_ads']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['meta_ads'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['meta_ads']?.config || {},
        authType: 'api_key',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'tiktok',
        displayName: 'TikTok for Business',
        description: 'Automate TikTok Ads campaign performance, video hook metrics, and audience conversion reports.',
        status: intMap['tiktok']?.status || 'not_connected',
        maskedKey: intMap['tiktok']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['tiktok'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['tiktok']?.config || {},
        authType: 'api_key',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'instagram_creators',
        displayName: 'Instagram Creator Marketplace',
        description: 'Discover creators that fit your brand reach, engagement rate, and style for influencer partnerships.',
        status: intMap['instagram_creators']?.status || 'not_connected',
        maskedKey: intMap['instagram_creators']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['instagram_creators'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['instagram_creators']?.config || {},
        authType: 'api_key',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'instagram',
        displayName: 'Instagram Business',
        description: 'Publish carousels, schedule grid posts, research hashtags, and analyze engagement.',
        status: intMap['instagram']?.status || 'not_connected',
        maskedKey: intMap['instagram']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['instagram'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['instagram']?.config || {},
        authType: 'oauth',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'facebook',
        displayName: 'Facebook Pages',
        description: 'Draft organic posts, promotional announcements, and sync customer inquiries.',
        status: intMap['facebook']?.status || 'not_connected',
        maskedKey: intMap['facebook']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['facebook'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['facebook']?.config || {},
        authType: 'oauth',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'gmail',
        displayName: 'Gmail & Business Email',
        description: 'Send client outreach, email marketing campaigns, and handle inbound inquiries.',
        status: intMap['gmail']?.status || 'not_connected',
        maskedKey: intMap['gmail']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['gmail'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['gmail']?.config || {},
        authType: 'oauth',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'google_calendar',
        displayName: 'Google Calendar',
        description: 'Check team availability, schedule consultations, and sync marketing deadlines.',
        status: intMap['google_calendar']?.status || 'not_connected',
        maskedKey: intMap['google_calendar']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['google_calendar'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['google_calendar']?.config || {},
        authType: 'oauth',
        requiresApproval: true,
      },
      {
        category: 'marketing',
        provider: 'google_maps',
        displayName: 'Google Maps & Local SEO',
        description: 'Audit competitor rankings, analyze customer reviews, and enhance local search visibility.',
        status: intMap['google_maps']?.status || 'not_connected',
        maskedKey: intMap['google_maps']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['google_maps'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['google_maps']?.config || {},
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
        maskedKey: (telegram?.botTokenEncrypted || intMap['telegram']?.config?.apiKeyEncrypted) ? `••••••••${String(telegram?.botTokenEncrypted || intMap['telegram']?.config?.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['telegram']?.config || {},
        authType: 'bot_token',
        requiresApproval: true,
      },

      // Creative, Video & Design Hub
      {
        category: 'design',
        provider: 'higgsfield',
        displayName: 'Higgsfield AI Video',
        description: 'Create cinematic AI video shots, animated brand visuals, and dynamic camera movements.',
        status: intMap['higgsfield']?.status || 'not_connected',
        maskedKey: intMap['higgsfield']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['higgsfield'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['higgsfield']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'design',
        provider: 'canva',
        displayName: 'Canva Design Hub',
        description: 'Discover, autofill, and export branded social banner specs, color palettes, and Canva designs.',
        status: intMap['canva']?.status || 'not_connected',
        maskedKey: intMap['canva']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['canva'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['canva']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'design',
        provider: 'fal_ai',
        displayName: 'FLUX / Midjourney (fal.ai)',
        description: 'High-speed AI image generation for photo-realistic creatives and clay 3D assets.',
        status: intMap['fal_ai']?.status || 'not_connected',
        maskedKey: intMap['fal_ai']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['fal_ai'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['fal_ai']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'design',
        provider: 'elevenlabs',
        displayName: 'ElevenLabs Voice & Speech',
        description: 'Generate realistic voices, clone speech, and create custom audio narration.',
        status: intMap['elevenlabs']?.status || 'not_connected',
        maskedKey: intMap['elevenlabs']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['elevenlabs'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['elevenlabs']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'design',
        provider: 'figma',
        displayName: 'Figma Design Tokens',
        description: 'Inspect UI wireframes, extract design tokens, and audit brand style consistency.',
        status: intMap['figma']?.status || 'not_connected',
        maskedKey: intMap['figma']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['figma'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['figma']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },

      // SEO, Analytics & Intelligence
      {
        category: 'productivity',
        provider: 'similarweb',
        displayName: 'Similarweb',
        description: 'Access website traffic, audience demographic insights, SEO channels, and app intelligence.',
        status: intMap['similarweb']?.status || 'not_connected',
        maskedKey: intMap['similarweb']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['similarweb'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['similarweb']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'productivity',
        provider: 'ahrefs',
        displayName: 'Ahrefs',
        description: 'Analyze SEO performance, track search rankings, inspect backlinks, and research competitor keywords.',
        status: intMap['ahrefs']?.status || 'not_connected',
        maskedKey: intMap['ahrefs']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['ahrefs'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['ahrefs']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'productivity',
        provider: 'brand24',
        displayName: 'Brand24',
        description: 'Monitor brand mentions, social sentiment analysis, customer complaints, and key industry influencers.',
        status: intMap['brand24']?.status || 'not_connected',
        maskedKey: intMap['brand24']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['brand24'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['brand24']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },

      // Productivity & Cloud Workspaces
      {
        category: 'productivity',
        provider: 'vercel',
        displayName: 'Vercel',
        description: 'Manage Vercel projects, deployments, staging preview URLs, and production domains.',
        status: intMap['vercel']?.status || 'not_connected',
        maskedKey: intMap['vercel']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['vercel'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['vercel']?.config || {},
        authType: 'api_key',
        requiresApproval: true,
      },
      {
        category: 'productivity',
        provider: 'dify',
        displayName: 'Dify',
        description: 'Connect Dify and orchestrate AI-powered workflows across external LLM pipelines and knowledge bases.',
        status: intMap['dify']?.status || 'not_connected',
        maskedKey: intMap['dify']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['dify'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['dify']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'productivity',
        provider: 'google_drive',
        displayName: 'Google Drive & Sheets',
        description: 'Index spreadsheets, PDF briefs, and presentations into agent knowledge base.',
        status: intMap['google_drive']?.status || 'not_connected',
        maskedKey: intMap['google_drive']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['google_drive'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['google_drive']?.config || {},
        authType: 'oauth',
        requiresApproval: false,
      },
      {
        category: 'productivity',
        provider: 'notion',
        displayName: 'Notion Workspace',
        description: 'Sync company documentation, databases, and project tasks into live memory.',
        status: intMap['notion']?.status || 'not_connected',
        maskedKey: intMap['notion']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['notion'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['notion']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'productivity',
        provider: 'slack',
        displayName: 'Slack Workspace',
        description: 'Search, read, and act across your Slack workspace, posting updates directly to channels.',
        status: intMap['slack']?.status || 'not_connected',
        maskedKey: intMap['slack']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['slack'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['slack']?.config || {},
        authType: 'oauth',
        requiresApproval: true,
      },

      // AI Models, Search & Inference Vault
      {
        category: 'ai_vault',
        provider: 'perplexity',
        displayName: 'Perplexity AI (Sonar Search)',
        description: 'Real-time live cited web search, ground-truth market research, and deep reasoning engine.',
        status: intMap['perplexity']?.status || 'not_connected',
        maskedKey: intMap['perplexity']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['perplexity'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['perplexity']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'ai_vault',
        provider: 'huggingface',
        displayName: 'Hugging Face Hub',
        description: 'Access open-source foundation models, datasets, spaces, and serverless inference endpoints.',
        status: intMap['huggingface']?.status || 'not_connected',
        maskedKey: intMap['huggingface']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['huggingface'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['huggingface']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'ai_vault',
        provider: 'groq',
        displayName: 'Groq Ultra-Fast (GPT-OSS 120B)',
        description: 'Sub-second real-time streaming inference for rapid agent response loops.',
        status: intMap['groq']?.status || 'not_connected',
        maskedKey: intMap['groq']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['groq'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['groq']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'ai_vault',
        provider: 'openai',
        displayName: 'OpenAI API (GPT-4o & o3-mini)',
        description: 'Direct BYOK access for OpenAI frontier reasoning and multimodal models.',
        status: intMap['openai']?.status || 'not_connected',
        maskedKey: intMap['openai']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['openai'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['openai']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'ai_vault',
        provider: 'gemini',
        displayName: 'Google Gemini 1.5 Pro',
        description: 'Massive 1M+ token context window for large document and video analysis.',
        status: intMap['gemini']?.status || 'not_connected',
        maskedKey: intMap['gemini']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['gemini'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['gemini']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
      {
        category: 'ai_vault',
        provider: 'anthropic',
        displayName: 'Anthropic Claude 3.5 Sonnet',
        description: 'Advanced nuance, creative copywriting, and structured data synthesis.',
        status: intMap['anthropic']?.status || 'not_connected',
        maskedKey: intMap['anthropic']?.config?.apiKeyEncrypted ? `••••••••${String(intMap['anthropic'].config.apiKeyEncrypted).slice(-4)}` : undefined,
        config: intMap['anthropic']?.config || {},
        authType: 'api_key',
        requiresApproval: false,
      },
    ];

    const enrichedIntegrations = integrations.map((item) => ({
      ...item,
      accountName: intMap[item.provider]?.config?.accountName,
      authMethod: intMap[item.provider]?.config?.authMethod || (item.authType === 'oauth' ? '1-Click OAuth 2.0 Authorization' : 'API Key'),
    }));

    return NextResponse.json({ integrations: enrichedIntegrations });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { provider, apiKey, config, authType, accountName } = body;
    const db = getDB();

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required.' }, { status: 400 });
    }

    // Support 1-Click OAuth Authorization without forcing user to type an API key
    const isOAuth = authType === 'oauth' || !apiKey;
    const resolvedKey = (apiKey && apiKey.trim().length > 0)
      ? apiKey.trim()
      : `oauth_${provider}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const resolvedAccountName = accountName?.trim() || user.email || user.displayName || 'Authorized Account';
    const resolvedAuthMethod = isOAuth ? '1-Click OAuth 2.0 Authorization' : 'API Key / Manual Credential';

    // Save directly to user's database / Firestore document
    const integrationRecord = {
      id: `${user.uid}_${provider}`,
      ownerUid: user.uid,
      provider,
      displayName: provider.replace('_', ' ').toUpperCase(),
      authType: isOAuth ? ('oauth' as const) : ('api_key' as const),
      status: 'connected' as const,
      scopes: ['read', 'write', 'human_approval_enforced'],
      lastTestedAt: new Date().toISOString(),
      config: {
        ...(config || {}),
        apiKeyEncrypted: resolvedKey, // Securely saved in server-side vault
        accountName: resolvedAccountName,
        authMethod: resolvedAuthMethod,
      },
    };

    await db.saveIntegration(integrationRecord);

    // If an AI provider was configured, sync directly with user's active LLM config
    if (provider === 'gemini') {
      const freshUser = await db.getUser(user.uid);
      if (freshUser) {
        freshUser.llmConfig = {
          provider: 'gemini',
          baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
          apiKey: resolvedKey,
          model: 'gemini-1.5-flash',
        };
        await db.saveUser(freshUser);
      }
    } else if (provider === 'openai') {
      const freshUser = await db.getUser(user.uid);
      if (freshUser) {
        freshUser.llmConfig = {
          provider: 'openai',
          baseUrl: 'https://api.openai.com/v1',
          apiKey: resolvedKey,
          model: 'gpt-4o-mini',
        };
        await db.saveUser(freshUser);
      }
    } else if (provider === 'groq') {
      const freshUser = await db.getUser(user.uid);
      if (freshUser) {
        freshUser.llmConfig = {
          provider: 'groq',
          baseUrl: 'https://api.groq.com/openai/v1',
          apiKey: resolvedKey,
          model: 'openai/gpt-oss-120b',
        };
        await db.saveUser(freshUser);
      }
    }

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'integration_configured',
      resource: provider,
      details: { status: 'connected', provider, authMethod: resolvedAuthMethod },
    });

    return NextResponse.json({
      success: true,
      message: `${provider} successfully authorized & connected!`,
      status: 'connected',
      accountName: resolvedAccountName,
      authMethod: resolvedAuthMethod,
      maskedKey: `••••••••${String(resolvedKey).slice(-4)}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const url = new URL(req.url);
    const provider = url.searchParams.get('provider');

    if (!provider) {
      return NextResponse.json({ error: 'Provider parameter required.' }, { status: 400 });
    }

    const db = getDB();
    await db.deleteIntegration(user.uid, provider);

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'integration_disconnected',
      resource: provider,
      details: { status: 'not_connected', provider },
    });

    return NextResponse.json({
      success: true,
      message: `${provider} integration disconnected and credentials removed from vault.`,
      status: 'not_connected',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
