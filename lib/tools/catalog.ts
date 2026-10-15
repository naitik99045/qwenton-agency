import { ToolDefinition } from '@/lib/llm/client';

export interface ToolMeta {
  name: string;
  displayName: string;
  description: string;
  category: 'knowledge' | 'utility' | 'communication' | 'research';
  requiresApproval: boolean;
  definition: ToolDefinition;
}

export const TOOL_CATALOG: Record<string, ToolMeta> = {
  calculator: {
    name: 'calculator',
    displayName: 'Math Calculator',
    description: 'Safely evaluates mathematical expressions and numerical formulas.',
    category: 'utility',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'calculator',
        description: 'Safely evaluate a mathematical expression (e.g. "45000 * 0.15 + 1200").',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'The math expression to evaluate',
            },
          },
          required: ['expression'],
        },
      },
    },
  },
  current_time: {
    name: 'current_time',
    displayName: 'Current Time & Date',
    description: 'Returns the current ISO date, time, and server timezone.',
    category: 'utility',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'current_time',
        description: 'Get current date, time, and timezone information.',
        parameters: {
          type: 'object',
          properties: {
            timezone: {
              type: 'string',
              description: 'Optional timezone string such as UTC, America/New_York, Asia/Kolkata',
            },
          },
        },
      },
    },
  },
  read_file: {
    name: 'read_file',
    displayName: 'Read Uploaded File',
    description: 'Reads the extracted content of an uploaded file by file ID or name.',
    category: 'knowledge',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'read_file',
        description: 'Read the extracted content of a specific uploaded file.',
        parameters: {
          type: 'object',
          properties: {
            fileId: {
              type: 'string',
              description: 'The ID of the file to read',
            },
          },
          required: ['fileId'],
        },
      },
    },
  },
  search_knowledge: {
    name: 'search_knowledge',
    displayName: 'Search Company Knowledge',
    description: 'Performs semantic keyword search across all indexed files.',
    category: 'knowledge',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'search_knowledge',
        description: 'Search indexed knowledge base chunks for relevant context.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The topic or phrase to look up in the knowledge base',
            },
          },
          required: ['query'],
        },
      },
    },
  },
  web_research: {
    name: 'web_research',
    displayName: 'Public Web Research',
    description: 'Searches public web sources and returns verified snippets and citations.',
    category: 'research',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'web_research',
        description: 'Perform web research on a specific topic or competitive market question.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query to research',
            },
          },
          required: ['query'],
        },
      },
    },
  },
  generate_report: {
    name: 'generate_report',
    displayName: 'Draft Markdown Report',
    description: 'Compiles findings, data, and recommendations into a formatted brief.',
    category: 'utility',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'generate_report',
        description: 'Generate a structured markdown report draft with headers and bullet points.',
        parameters: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Report Title',
            },
            summary: {
              type: 'string',
              description: 'Executive summary',
            },
            keyFindings: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of key findings',
            },
            recommendations: {
              type: 'array',
              items: { type: 'string' },
              description: 'Recommended next steps',
            },
          },
          required: ['title', 'summary', 'keyFindings'],
        },
      },
    },
  },
  send_telegram_message: {
    name: 'send_telegram_message',
    displayName: 'Send Telegram Message',
    description: 'Dispatches a message to the connected Telegram chat. Requires Human Approval.',
    category: 'communication',
    requiresApproval: true,
    definition: {
      type: 'function',
      function: {
        name: 'send_telegram_message',
        description: 'Send a message to the connected Telegram channel or user. This external action requires human approval before sending.',
        parameters: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The message content to transmit',
            },
          },
          required: ['text'],
        },
      },
    },
  },
  send_slack_message: {
    name: 'send_slack_message',
    displayName: 'Post to Slack',
    description: 'Sends a drafted update to a Slack channel. Requires Human Approval.',
    category: 'communication',
    requiresApproval: true,
    definition: {
      type: 'function',
      function: {
        name: 'send_slack_message',
        description: 'Post a notification or draft message to Slack. Requires human approval.',
        parameters: {
          type: 'object',
          properties: {
            channel: {
              type: 'string',
              description: 'The Slack channel name (e.g. #marketing)',
            },
            text: {
              type: 'string',
              description: 'The message text to post',
            },
          },
          required: ['channel', 'text'],
        },
      },
    },
  },
  publish_instagram_post: {
    name: 'publish_instagram_post',
    displayName: 'Publish Instagram Post / Reel / Carousel',
    description: 'Publishes a video, single image, or carousel from Google Drive/assets to connected Instagram account. Requires Approval.',
    category: 'communication',
    requiresApproval: true,
    definition: {
      type: 'function',
      function: {
        name: 'publish_instagram_post',
        description: 'Publish visual content and marketing copy to connected Instagram Business profile. Supports Google Drive video/image assets and automated Meta Graph container publishing. Requires human approval.',
        parameters: {
          type: 'object',
          properties: {
            caption: { type: 'string', description: 'Trending post caption with hooks, line breaks, and emojis' },
            hashtags: { type: 'array', items: { type: 'string' }, description: 'High-converting viral hashtags' },
            mediaType: { type: 'string', enum: ['IMAGE', 'VIDEO', 'REEL', 'CAROUSEL'], description: 'Format of media to publish' },
            driveFileNameOrUrl: { type: 'string', description: 'Filename, folder path, or URL of the video/image in Google Drive' },
            mediaUrls: { type: 'array', items: { type: 'string' }, description: 'Direct image or video URLs' },
          },
          required: ['caption', 'hashtags'],
        },
      },
    },
  },
  send_gmail_message: {
    name: 'send_gmail_message',
    displayName: 'Send Business Email',
    description: 'Dispatches customer inquiry responses, newsletters, or proposals via Gmail. Requires Approval.',
    category: 'communication',
    requiresApproval: true,
    definition: {
      type: 'function',
      function: {
        name: 'send_gmail_message',
        description: 'Send an email to a client or subscriber list. Requires human approval.',
        parameters: {
          type: 'object',
          properties: {
            to: { type: 'string', description: 'Recipient email address' },
            subject: { type: 'string', description: 'Email subject line' },
            body: { type: 'string', description: 'Full HTML/text email content' },
          },
          required: ['to', 'subject', 'body'],
        },
      },
    },
  },
  schedule_calendar_event: {
    name: 'schedule_calendar_event',
    displayName: 'Google Calendar Scheduler',
    description: 'Creates client appointments, routine schedules, and marketing calendar events. Requires Approval.',
    category: 'utility',
    requiresApproval: true,
    definition: {
      type: 'function',
      function: {
        name: 'schedule_calendar_event',
        description: 'Schedule a new event on connected Google Calendar. Requires human approval.',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Event title' },
            startTime: { type: 'string', description: 'ISO start date-time string' },
            durationMinutes: { type: 'number', description: 'Duration in minutes' },
            attendees: { type: 'array', items: { type: 'string' }, description: 'Attendee email addresses' },
          },
          required: ['title', 'startTime'],
        },
      },
    },
  },
  search_google_maps_businesses: {
    name: 'search_google_maps_businesses',
    displayName: 'Google Maps Local SEO & Competitors',
    description: 'Audits local competitors, reviews, and Google Maps search visibility.',
    category: 'research',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'search_google_maps_businesses',
        description: 'Search local businesses, competitor ratings, and address locations via Google Maps.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search term e.g. "coffee shops in Brooklyn" or "real estate agencies in Austin"' },
            location: { type: 'string', description: 'City or coordinates' },
          },
          required: ['query'],
        },
      },
    },
  },
  search_google_drive: {
    name: 'search_google_drive',
    displayName: 'Google Drive & Docs Search',
    description: 'Searches spreadsheets, presentations, and docs across connected Google Drive.',
    category: 'knowledge',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'search_google_drive',
        description: 'Search files, sheets, and presentations across connected Google Drive.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Filename or document topic' },
          },
          required: ['query'],
        },
      },
    },
  },
  sync_notion_workspace: {
    name: 'sync_notion_workspace',
    displayName: 'Notion Workspace Sync',
    description: 'Reads tasks, client databases, and wikis from connected Notion workspace.',
    category: 'knowledge',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'sync_notion_workspace',
        description: 'Read or append structured notes to connected Notion databases.',
        parameters: {
          type: 'object',
          properties: {
            databaseName: { type: 'string', description: 'Target Notion database or page title' },
            action: { type: 'string', enum: ['read', 'create_page', 'append_note'], description: 'Action to perform' },
            content: { type: 'string', description: 'Content payload if creating or appending' },
          },
          required: ['databaseName', 'action'],
        },
      },
    },
  },
  generate_canva_asset: {
    name: 'generate_canva_asset',
    displayName: 'Canva Design Generator',
    description: 'Generates branded social banner specs and creative design briefs for Canva.',
    category: 'utility',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'generate_canva_asset',
        description: 'Create standardized design specifications, dimensions, and typography briefs for Canva.',
        parameters: {
          type: 'object',
          properties: {
            format: { type: 'string', enum: ['instagram_post', 'instagram_story', 'youtube_thumbnail', 'facebook_banner'], description: 'Target asset format' },
            headline: { type: 'string', description: 'Main hero headline' },
            subhead: { type: 'string', description: 'Supporting tagline' },
            colorPalette: { type: 'array', items: { type: 'string' }, description: 'Hex color codes' },
          },
          required: ['format', 'headline'],
        },
      },
    },
  },
  generate_flux_image: {
    name: 'generate_flux_image',
    displayName: 'FLUX & Midjourney AI Image Generator',
    description: 'Generates photorealistic or clay 3D visual assets from prompts.',
    category: 'research',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'generate_flux_image',
        description: 'Generate high-resolution marketing visuals and 3D assets using FLUX/fal.ai API.',
        parameters: {
          type: 'object',
          properties: {
            prompt: { type: 'string', description: 'Visual prompt description' },
            aspectRatio: { type: 'string', enum: ['1:1', '16:9', '9:16', '4:5'], description: 'Image aspect ratio' },
          },
          required: ['prompt'],
        },
      },
    },
  },
  perplexity_research: {
    name: 'perplexity_research',
    displayName: 'Perplexity AI Live Search & Sonar Reasoning',
    description: 'Queries live web sources with citations, market grounding, and real-time intelligence.',
    category: 'research',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'perplexity_research',
        description: 'Perform deep cited web research using Perplexity Sonar search engine.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Detailed research query or market question' },
            recency: { type: 'string', enum: ['day', 'week', 'month', 'year'], description: 'Filter search recency' },
          },
          required: ['query'],
        },
      },
    },
  },
  higgsfield_video: {
    name: 'higgsfield_video',
    displayName: 'Higgsfield Cinematic AI Video Generator',
    description: 'Generates cinematic video scenes, camera pans, and promotional video specifications.',
    category: 'utility',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'higgsfield_video',
        description: 'Create cinematic video generations and camera motion blueprints via Higgsfield AI.',
        parameters: {
          type: 'object',
          properties: {
            prompt: { type: 'string', description: 'Visual video scene prompt with lighting, subject, and atmosphere' },
            cameraMovement: { type: 'string', enum: ['dolly_in', 'dolly_out', 'orbit', 'pan_left', 'pan_right', 'crane_up', 'static'], description: 'Cinematic camera movement' },
            durationSeconds: { type: 'number', description: 'Duration in seconds (e.g. 5 or 10)' },
          },
          required: ['prompt'],
        },
      },
    },
  },
  huggingface_inference: {
    name: 'huggingface_inference',
    displayName: 'Hugging Face Model Inference & Embeddings',
    description: 'Runs inference against open-source models, classifiers, or embeddings on Hugging Face.',
    category: 'utility',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'huggingface_inference',
        description: 'Execute open-source model inference or classification on Hugging Face Hub.',
        parameters: {
          type: 'object',
          properties: {
            model: { type: 'string', description: 'Hugging Face model repository ID (e.g. meta-llama/Llama-3-8b, BAAI/bge-large-en)' },
            input: { type: 'string', description: 'Input text prompt or payload to process' },
          },
          required: ['input'],
        },
      },
    },
  },
  analyze_meta_ads: {
    name: 'analyze_meta_ads',
    displayName: 'Meta Ads Manager Performance Analyzer',
    description: 'Audits Facebook & Instagram ad campaign metrics, ROAS, CPC, and ad budget recommendations. Requires Approval.',
    category: 'communication',
    requiresApproval: true,
    definition: {
      type: 'function',
      function: {
        name: 'analyze_meta_ads',
        description: 'Audit Meta Ads Manager campaigns, ROAS, CPA, and CTR metrics. Requires approval.',
        parameters: {
          type: 'object',
          properties: {
            timeframe: { type: 'string', enum: ['last_7d', 'last_14d', 'last_30d', 'lifetime'], description: 'Reporting timeframe' },
            campaignId: { type: 'string', description: 'Optional specific Campaign ID' },
          },
        },
      },
    },
  },
  analyze_similarweb_traffic: {
    name: 'analyze_similarweb_traffic',
    displayName: 'Similarweb Competitor Traffic Intelligence',
    description: 'Inspects website traffic volumes, top referral sources, bounce rates, and organic channels.',
    category: 'research',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'analyze_similarweb_traffic',
        description: 'Audit competitor website traffic, visitor demographics, and traffic channels via Similarweb.',
        parameters: {
          type: 'object',
          properties: {
            domain: { type: 'string', description: 'Target website domain (e.g. competitor.com)' },
          },
          required: ['domain'],
        },
      },
    },
  },
  audit_ahrefs_seo: {
    name: 'audit_ahrefs_seo',
    displayName: 'Ahrefs SEO & Backlink Auditor',
    description: 'Extracts domain ratings, organic keyword rankings, and high-value backlink opportunities.',
    category: 'research',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'audit_ahrefs_seo',
        description: 'Analyze SEO performance, organic search volume, and backlink profile via Ahrefs.',
        parameters: {
          type: 'object',
          properties: {
            target: { type: 'string', description: 'Domain or URL to audit' },
            mode: { type: 'string', enum: ['overview', 'keywords', 'backlinks'], description: 'Audit focus' },
          },
          required: ['target'],
        },
      },
    },
  },
  track_brand_mentions: {
    name: 'track_brand_mentions',
    displayName: 'Brand24 Social Mentions & Sentiment Radar',
    description: 'Monitors brand mentions, public sentiment polarity, customer complaints, and reach.',
    category: 'research',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'track_brand_mentions',
        description: 'Track social media mentions, brand sentiment, and influencer reach via Brand24.',
        parameters: {
          type: 'object',
          properties: {
            brandName: { type: 'string', description: 'Brand or keyword to monitor' },
          },
          required: ['brandName'],
        },
      },
    },
  },
  manage_vercel_deployment: {
    name: 'manage_vercel_deployment',
    displayName: 'Vercel Deployment Manager',
    description: 'Inspects active Vercel deployments, staging preview URLs, and production domains. Requires Approval.',
    category: 'utility',
    requiresApproval: true,
    definition: {
      type: 'function',
      function: {
        name: 'manage_vercel_deployment',
        description: 'Check project deployment status or trigger rebuilds on Vercel. Requires human approval.',
        parameters: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['status', 'list_deployments', 'trigger_redeploy'], description: 'Action to perform' },
            projectId: { type: 'string', description: 'Optional specific Vercel project ID or slug' },
          },
          required: ['action'],
        },
      },
    },
  },
  run_dify_workflow: {
    name: 'run_dify_workflow',
    displayName: 'Dify Workflow Orchestrator',
    description: 'Triggers external multi-step LLM workflows and knowledge retrieval chains on Dify.',
    category: 'utility',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'run_dify_workflow',
        description: 'Execute an external AI workflow application in Dify.',
        parameters: {
          type: 'object',
          properties: {
            inputs: { type: 'object', description: 'Parameters and inputs required by the Dify workflow' },
          },
          required: ['inputs'],
        },
      },
    },
  },
  elevenlabs_voice_synthesis: {
    name: 'elevenlabs_voice_synthesis',
    displayName: 'ElevenLabs Lifelike Voiceover & Narration',
    description: 'Generates realistic AI voiceovers and multilingual speech audio from text.',
    category: 'utility',
    requiresApproval: false,
    definition: {
      type: 'function',
      function: {
        name: 'elevenlabs_voice_synthesis',
        description: 'Synthesize realistic voice audio narration for video or podcast scripts using ElevenLabs.',
        parameters: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'The script or dialogue to synthesize into speech' },
            voice: { type: 'string', description: 'Voice ID or description (e.g. Rachel, Adam, Josh, Bella)' },
          },
          required: ['text'],
        },
      },
    },
  },
};
