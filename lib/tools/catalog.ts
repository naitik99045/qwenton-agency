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
    displayName: 'Publish Instagram Post / Carousel',
    description: 'Publishes a carousel or image post to connected Instagram account. Requires Approval.',
    category: 'communication',
    requiresApproval: true,
    definition: {
      type: 'function',
      function: {
        name: 'publish_instagram_post',
        description: 'Publish visual content and marketing copy to connected Instagram Business profile. Requires human approval.',
        parameters: {
          type: 'object',
          properties: {
            caption: { type: 'string', description: 'Post caption with hooks and emojis' },
            hashtags: { type: 'array', items: { type: 'string' }, description: 'Target hashtags' },
            mediaUrls: { type: 'array', items: { type: 'string' }, description: 'Image asset URLs or FLUX generated IDs' },
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
};
