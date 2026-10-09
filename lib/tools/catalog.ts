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
};
