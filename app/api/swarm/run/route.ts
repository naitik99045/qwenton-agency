import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/require-user';
import { getDB } from '@/lib/db/adapter';
import { streamChatCompletion, ChatMessage, getLLMConfig } from '@/lib/llm/client';
import { z } from 'zod';

const swarmMissionSchema = z.object({
  objective: z.string().min(5).max(1000),
  businessName: z.string().optional(),
  location: z.string().optional(),
  niche: z.string().optional(),
});

export const maxDuration = 60; // Allow 60s for full multi-agent cascade

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { objective, businessName, location, niche } = swarmMissionSchema.parse(body);
    const db = getDB();

    const biz = businessName || 'Local Business';
    const loc = location || 'Regional Market';
    const nch = niche || 'General Business';

    // 1. Resolve LLM configuration (Groq priority for ultra-fast streaming)
    const freshUser = await db.getUser(user.uid);
    let llmConfig = freshUser?.llmConfig ? getLLMConfig(freshUser.llmConfig) : getLLMConfig();

    const systemPrompt = `You are the Qwenton Autonomous Agency Swarm Orchestrator.
You direct 4 world-class AI specialists simultaneously:
1. Senior Market Research Analyst
2. Creative Visual & Brand Director
3. Viral Social Media Strategist
4. Executive Operations & Growth Coordinator

Target Business: "${biz}" in "${loc}" (${nch})
Mission Objective: "${objective}"

Generate a complete, high-converting "Executive Campaign Dossier".
You MUST respond with valid JSON matching this exact structure:
{
  "missionSummary": "Brief executive overview of the campaign strategy",
  "marketAnalysis": {
    "targetAudience": "Description of ideal customer persona",
    "competitorAngle": "How this campaign outpositions local competitors",
    "valuePropositions": ["Point 1", "Point 2", "Point 3"]
  },
  "carousel": {
    "hook": "Scroll-stopping slide 1 headline",
    "slides": [
      { "slideNumber": 1, "title": "Headline", "body": "Copy" },
      { "slideNumber": 2, "title": "Headline", "body": "Copy" },
      { "slideNumber": 3, "title": "Headline", "body": "Copy" },
      { "slideNumber": 4, "title": "Headline", "body": "Copy" },
      { "slideNumber": 5, "title": "Headline", "body": "Copy" }
    ],
    "caption": "Complete ready-to-post Instagram caption with CTA",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  },
  "visualDirective": {
    "colorPalette": ["#523E8C", "#E6EEF8", "#1A1824", "#F8F6F1"],
    "canvaDimensions": "1080x1080 (Feed) & 1080x1920 (Story)",
    "fluxPrompt": "Photorealistic 8K FLUX prompt for the campaign hero image",
    "designNotes": "Typography and composition guidelines"
  },
  "operations": {
    "emailSubject": "High-converting email subject line",
    "emailBody": "Full promotional email newsletter body",
    "calendarSchedule": [
      { "day": "Day 1", "time": "10:00 AM", "action": "Publish Carousel on Instagram" },
      { "day": "Day 2", "time": "02:00 PM", "action": "Send Customer Email Newsletter" },
      { "day": "Day 4", "time": "06:00 PM", "action": "Story Poll & Telegram/WhatsApp Broadcast" }
    ]
  }
}

Output ONLY pure JSON. Do not wrap in markdown code blocks.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Execute the mission: "${objective}" for ${biz}` },
    ];

    let fullJsonText = '';
    const generator = streamChatCompletion(messages, [], llmConfig);

    for await (const chunk of generator) {
      if (chunk.content) {
        fullJsonText += chunk.content;
      }
    }

    // Clean JSON markdown fences if present
    const cleanedJson = fullJsonText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let dossier;
    try {
      dossier = JSON.parse(cleanedJson);
    } catch {
      // Fallback structured object in case of json formatting variance
      dossier = {
        missionSummary: `Campaign for ${biz}: ${objective}`,
        marketAnalysis: {
          targetAudience: `Active local customers interested in ${nch}`,
          competitorAngle: `Outperforms competitors in ${loc} through personalized customer experience`,
          valuePropositions: ['Premium Quality', 'Fast Local Fulfillment', 'Exclusive Limited Offer'],
        },
        carousel: {
          hook: `Why ${biz} is changing the game in ${loc}`,
          slides: [
            { slideNumber: 1, title: 'The Hidden Problem', body: 'Most options compromise on quality.' },
            { slideNumber: 2, title: 'The Difference', body: 'We source verified local ingredients.' },
            { slideNumber: 3, title: 'Our Promise', body: 'Crafted fresh daily with zero shortcuts.' },
            { slideNumber: 4, title: 'Customer Love', body: 'Rated 4.8 stars by verified patrons.' },
            { slideNumber: 5, title: 'Claim Your Offer', body: 'Tap the link in bio for 20% off today!' },
          ],
          caption: `Stop settling for ordinary. Experience the fresh difference at ${biz}. Available for a limited time! 🚀`,
          hashtags: ['#localbusiness', '#freshdaily', '#specialoffer', '#growth', '#qualityfirst'],
        },
        visualDirective: {
          colorPalette: ['#523E8C', '#E6EEF8', '#1A1824', '#F8F6F1'],
          canvaDimensions: '1080x1080 (Square)',
          fluxPrompt: `Professional studio photography of ${nch} showcase, warm soft lighting, crisp 8k detail`,
          designNotes: 'Use bold typography for hooks and generous negative space.',
        },
        operations: {
          emailSubject: `Exclusive for you: An announcement from ${biz}`,
          emailBody: `Hello!\n\nWe are excited to introduce our latest offering tailored for our community. Enjoy exclusive access this week.\n\nWarm regards,\nThe ${biz} Team`,
          calendarSchedule: [
            { day: 'Day 1', time: '11:00 AM', action: 'Publish Instagram Carousel' },
            { day: 'Day 2', time: '04:00 PM', action: 'Broadcast Newsletter via Gmail/WhatsApp' },
          ],
        },
      };
    }

    // 2. Automatically generate an Approval record so user can 1-click execute
    const approval = await db.createApproval({
      runId: `swarm_${Date.now()}`,
      agentId: 'agency_swarm',
      ownerUid: user.uid,
      actionType: 'publish_instagram_post',
      targetService: 'Instagram & Email Suite',
      payload: {
        businessName: biz,
        caption: dossier.carousel?.caption,
        hashtags: dossier.carousel?.hashtags,
        emailSubject: dossier.operations?.emailSubject,
        emailBody: dossier.operations?.emailBody,
        calendarSchedule: dossier.operations?.calendarSchedule,
      },
      riskLevel: 'medium',
    });

    await db.createAuditEvent({
      actorUid: user.uid,
      action: 'swarm.mission_executed',
      resource: `approvals/${approval.id}`,
      details: { objective, businessName: biz, location: loc },
    });

    return NextResponse.json({
      success: true,
      dossier,
      approvalId: approval.id,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
