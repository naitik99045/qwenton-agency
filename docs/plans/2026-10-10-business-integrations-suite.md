# Business Integrations & Multi-Channel Marketing Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide full end-to-end capabilities for business owners to create AI agents, chat with them from the workspace, and connect their digital business channels (Instagram, Facebook, Gmail, Google Calendar, Google Maps/Local SEO, Telegram, and Webhooks) with Human-in-the-loop safety approvals.

**Architecture:** A unified modular integration architecture where each business connector registers its tools in `lib/tools/catalog.ts` and `lib/integrations/`, securely stores user credentials in encrypted form, provides sandbox/mock fallbacks for local and free tier testing, and enforces the Approval Firewall before any external mutation occurs.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS with Claymorphic theme, Firebase Firestore/Admin SDK, Meta Graph API connectors, Google Workspace APIs, Nodemailer/SMTP, Lucide Icons.

## Global Constraints
- Preserve existing claymorphic UI styling and color palette (`#523E8C`, `#6B52B5`, `#DDE6F5`, `#F8F6F1`).
- All external write actions (publishing a post, sending an email, booking a calendar slot) **MUST** trigger an Approval Event before execution.
- Read-only tools (fetching calendar events, searching local places, analyzing post metrics) execute immediately.
- Provide zero-config simulated sandbox modes for all external integrations so developers/users can test without paid API accounts.

---

### Task 1: Comprehensive Business Connectors Data Layer & Catalog

**Files:**
- Create: `lib/integrations/types.ts`
- Create: `lib/integrations/registry.ts`
- Modify: `lib/tools/catalog.ts`
- Modify: `lib/db/types.ts`

**Interfaces:**
- Consumes: `lib/db/types.ts`
- Produces: `IntegrationProvider`, `IntegrationConfig`, `ToolDefinition` with business tools:
  - `publish_instagram_post` (requires approval)
  - `fetch_instagram_analytics` (read-only)
  - `publish_facebook_post` (requires approval)
  - `send_business_email` (requires approval)
  - `fetch_calendar_events` (read-only)
  - `schedule_calendar_event` (requires approval)
  - `search_google_maps_businesses` (read-only)

- [ ] **Step 1: Define TypeScript types for all business connectors**
```typescript
// lib/integrations/types.ts
export type IntegrationProviderId =
  | 'instagram'
  | 'facebook'
  | 'gmail'
  | 'google_calendar'
  | 'google_maps'
  | 'telegram'
  | 'custom_webhook';

export interface IntegrationConnection {
  id: string;
  userId: string;
  provider: IntegrationProviderId;
  displayName: string;
  status: 'connected' | 'disconnected' | 'error';
  credentials: Record<string, string>; // e.g. accessToken, pageId, refreshToken
  metadata?: Record<string, any>; // username, email, pageName
  connectedAt: string;
  updatedAt: string;
}
```

- [ ] **Step 2: Update tool catalog with business marketing actions**
```typescript
// Add to lib/tools/catalog.ts
export const BUSINESS_TOOLS: Record<string, ToolDefinition> = {
  publish_instagram_post: {
    name: 'publish_instagram_post',
    displayName: 'Publish Instagram Post / Carousel',
    description: 'Publishes a single image or multi-slide carousel to connected Instagram Business account with caption & hashtags.',
    category: 'communication',
    requiresApproval: true,
  },
  send_business_email: {
    name: 'send_business_email',
    displayName: 'Send Customer / Marketing Email',
    description: 'Sends an email campaign, newsletter, or client response via connected Gmail/SMTP.',
    category: 'communication',
    requiresApproval: true,
  },
  schedule_calendar_event: {
    name: 'schedule_calendar_event',
    displayName: 'Schedule Google Calendar Event',
    description: 'Creates a calendar event or appointment on connected Google Calendar.',
    category: 'system',
    requiresApproval: true,
  },
  search_google_maps_businesses: {
    name: 'search_google_maps_businesses',
    displayName: 'Google Maps Local Business Audit',
    description: 'Analyzes local business listings, competitors, and reviews on Google Maps.',
    category: 'search',
    requiresApproval: false,
  },
};
```

---

### Task 2: Multi-Connector Settings & Integration Hub UI

**Files:**
- Modify: `app/integrations/page.tsx`
- Create: `components/integrations/IntegrationModal.tsx`
- Create: `app/api/integrations/[provider]/route.ts`

**Interfaces:**
- Consumes: `/api/integrations`, `/api/integrations/[provider]`
- Produces: Visual connection cards for Instagram, Facebook, Gmail, Google Calendar, Google Maps, and Telegram with 1-click connect modals and status badges.

- [ ] **Step 1: Build the unified Integration Connection Modal**
- [ ] **Step 2: Update `app/integrations/page.tsx` with all 6 business cards**
  - Instagram Business (Posts, Carousels, Stories, Analytics)
  - Facebook Page (Feed posts, Lead updates)
  - Gmail / SMTP (Client outreach, newsletters, auto-replies)
  - Google Calendar (Consultations, routine scheduling)
  - Google Maps & Local SEO (Competitor lookup, review analyzer)
  - Telegram Coworker Bot (Multi-agent chat via Telegram)

---

### Task 3: Agent Creation Wizard & Template Enrichment

**Files:**
- Modify: `app/agents/new/page.tsx`
- Modify: `app/agents/[agentId]/page.tsx`

**Interfaces:**
- Consumes: `TEMPLATES` and `TOOL_CATALOG`
- Produces: 6 distinct specialized templates ready for business owners:
  1. **Instagram & Social Growth Specialist** (equipped with Instagram publisher, AI image prompt builder, hashtag researcher)
  2. **Local SEO & Maps Growth Strategist** (equipped with Google Maps analyzer, local business competitor audit)
  3. **Executive Operations & Calendar Assistant** (equipped with Google Calendar, Gmail, routine scheduler)
  4. **Email Marketing & Newsletter Strategist** (equipped with Gmail publisher, customer segmenter)
  5. **Deep Research & Competitive Intelligence Analyst** (equipped with web scraper, PDF knowledge base)
  6. **Custom AI Coworker** (fully customizable)

- [ ] **Step 1: Expand templates in `app/agents/new/page.tsx`**
- [ ] **Step 2: Add quick-launch action buttons in `app/agents/[agentId]/page.tsx` (e.g. "Draft Instagram Post", "Audit Local Competitors", "Schedule Strategy Meeting")**

---

### Task 4: Real-time Chat Execution & Tool Dispatcher

**Files:**
- Modify: `lib/agents/executor.ts`
- Modify: `lib/llm/client.ts`
- Modify: `app/api/conversations/[conversationId]/messages/route.ts`

**Interfaces:**
- Consumes: Agent configuration, enabled tools, user message
- Produces: Streaming responses, tool calls for Instagram/Gmail/Calendar/Maps, and automatic approval requests for mutations.

- [ ] **Step 1: Integrate tool executors for Instagram, Gmail, Calendar, Maps in `lib/agents/executor.ts`**
- [ ] **Step 2: Ensure approval events are logged to `approvals` table with full action payload (caption, recipient, date, coordinates)**
- [ ] **Step 3: Test execution end-to-end with simulated sandbox mode**
