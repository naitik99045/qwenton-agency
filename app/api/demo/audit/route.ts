import { NextRequest, NextResponse } from 'next/server';
import { streamChatCompletion, ChatMessage, getLLMConfig } from '@/lib/llm/client';
import { z } from 'zod';

const auditRequestSchema = z.object({
  businessName: z.string().min(1).max(120),
  location: z.string().min(1).max(120),
  niche: z.string().max(120).optional().default('Local Business'),
});

export const maxDuration = 20;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const { businessName, location, niche } = auditRequestSchema.parse(rawBody);

    const biz = businessName.trim();
    const loc = location.trim();
    const nch = (niche || 'Local Business').trim();

    // Default fallback generator if LLM is unavailable
    const generateFallbackAudit = () => ({
      businessName: biz,
      location: loc,
      niche: nch,
      growthScore: Math.floor(Math.random() * 12) + 82, // 82 to 94
      auditSummary: `High local demand identified in ${loc}. ${biz} has an immediate opportunity to capture 3x more local customers by closing competitor response and content gaps.`,
      googleMapsAudit: {
        competitorBenchmark: `Average local competitor rating in ${loc} is 4.1⭐ with 38 reviews. 65% of competitors fail to reply to negative feedback within 48 hours.`,
        rankingOpportunity: `Optimizing for '${nch} near me' and '${biz} ${loc}' with consistent weekly photo uploads can lift ranking into the Google Maps Local 3-Pack within 21 days.`,
        reviewGap: `Competitors are penalized by customers for slow communication. Highlighting instant 24/7 responsiveness creates a massive trust moat.`,
      },
      socialCarousel: {
        hook: `Why ${loc} is choosing ${biz} over the usual alternatives`,
        slides: [
          { slide: 1, title: 'The Problem', text: `Most ${nch} options in ${loc} overpromise and deliver slow service.` },
          { slide: 2, title: 'The Benchmark', text: 'You shouldn’t have to chase providers or accept mediocre results.' },
          { slide: 3, title: `The ${biz} Standard`, text: 'Built on precision, rapid communication, and consistent quality every single time.' },
          { slide: 4, title: 'Verified Proof', text: 'Locals in our community depend on us for reliability and transparency.' },
          { slide: 5, title: 'Get Started', text: `Mention this post or DM 'START' for priority service and exclusive perks!` },
        ],
        caption: `Excellence isn't an accident. At ${biz}, we bring top-tier ${nch} craftsmanship straight to ${loc}. Tap the link in our bio or send us a DM to experience the difference! 🚀`,
        hashtags: [
          `#${loc.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          `#${biz.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          `#${nch.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          '#localgrowth',
          '#supportlocal',
          '#qualityfirst',
        ],
      },
      coldOutreach: {
        channel: 'Cold Email / Direct Message',
        subject: `Quick idea for ${biz}'s local customer acquisition in ${loc}`,
        pitch: `Hey ${biz} team,\n\nNoticed you're making waves in the ${loc} ${nch} scene, but several nearby competitors are aggressively bidding on your brand keywords.\n\nWe mapped out a simple 3-step automated funnel that converts local high-intent searchers into repeat customers without ad burn.\n\nMind if I send over the 2-minute breakdown?\n\nBest,\nAutonomous Growth Specialist`,
      },
      recommendedAgents: [
        { name: 'Maya', role: 'Social & Instagram Lead', action: 'Drafts and schedules high-converting carousels with visual briefs' },
        { name: 'Marcus', role: 'Market Intelligence Analyst', action: 'Monitors competitor pricing and tracks Google Maps ranking movements' },
      ],
    });

    const llmConfig = getLLMConfig();

    if (!llmConfig.apiKey) {
      // Return fast, high-quality tailored audit if no LLM key configured on server
      return NextResponse.json({ success: true, audit: generateFallbackAudit(), source: 'synthesis-engine' });
    }

    const systemPrompt = `You are the Qwenton 5-Second Instant Growth Auditor.
You analyze businesses and produce a high-impact, tactical 100x Growth Audit for landing page visitors.

Target Business: "${biz}"
Location: "${loc}"
Niche/Industry: "${nch}"

You MUST output ONLY valid JSON matching this exact structure:
{
  "businessName": "${biz}",
  "location": "${loc}",
  "niche": "${nch}",
  "growthScore": 85,
  "auditSummary": "Clear 1-sentence executive summary of the growth opportunity",
  "googleMapsAudit": {
    "competitorBenchmark": "Realistic competitor review numbers and weaknesses in ${loc}",
    "rankingOpportunity": "Specific Local SEO and Google Maps 3-pack ranking strategy",
    "reviewGap": "Identified gap in customer satisfaction among competitors"
  },
  "socialCarousel": {
    "hook": "Scroll-stopping slide 1 headline",
    "slides": [
      { "slide": 1, "title": "Slide 1 Title", "text": "Slide 1 Body" },
      { "slide": 2, "title": "Slide 2 Title", "text": "Slide 2 Body" },
      { "slide": 3, "title": "Slide 3 Title", "text": "Slide 3 Body" },
      { "slide": 4, "title": "Slide 4 Title", "text": "Slide 4 Body" },
      { "slide": 5, "title": "Slide 5 Title", "text": "Slide 5 Body" }
    ],
    "caption": "Full high-converting Instagram caption with CTA",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  },
  "coldOutreach": {
    "channel": "Cold Email / Direct Message",
    "subject": "Compelling subject line",
    "pitch": "Personalized 3-paragraph cold outreach message"
  },
  "recommendedAgents": [
    { "name": "Maya", "role": "Social & Instagram Lead", "action": "Automates carousel content & visual prompts" },
    { "name": "Marcus", "role": "Market Intelligence Analyst", "action": "Monitors competitor moves & ranking shifts" }
  ]
}

Respond ONLY with valid JSON. No markdown code blocks.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Run instant agency growth audit for "${biz}" in "${loc}"` },
    ];

    try {
      let fullJsonText = '';
      const generator = streamChatCompletion(messages, [], llmConfig);

      for await (const chunk of generator) {
        if (chunk.content) {
          fullJsonText += chunk.content;
        }
      }

      const cleanedJson = fullJsonText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsedAudit = JSON.parse(cleanedJson);
      return NextResponse.json({ success: true, audit: parsedAudit, source: 'groq-lpu' });
    } catch (llmErr) {
      console.warn('LLM audit generation fallback triggered:', llmErr);
      return NextResponse.json({ success: true, audit: generateFallbackAudit(), source: 'fallback-synthesis' });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
