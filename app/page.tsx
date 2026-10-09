'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  ShieldAlert,
  FolderLock,
  CalendarClock,
  Radio,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  BarChart3,
  Send,
  Zap,
  Check,
  ShieldCheck,
  BookOpen,
  Clock,
  Cpu,
  Layers,
  Users,
  Briefcase,
  HelpCircle,
  Instagram,
  Palette,
  Image as ImageIcon,
  MessageSquare,
  Globe2,
  TrendingUp,
  Share2,
  Wand2,
  Play,
  Flame,
  CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function LandingPage() {
  const [activeSandbox, setActiveSandbox] = useState<'social' | 'design' | 'research' | 'telegram'>('social');
  const [activeRoster, setActiveRoster] = useState<'social_lead' | 'visual_designer' | 'market_analyst' | 'operations' | 'support'>('social_lead');
  const [sandboxApproved, setSandboxApproved] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeArticle, setActiveArticle] = useState<number | null>(null);

  const sandboxDemos = {
    social: {
      title: 'Instagram & Social Media Growth Specialist',
      action: 'Generating 5-Slide Instagram Carousel & Visual Prompt',
      step1: 'Analyzing target demographic engagement signals & trending visual aesthetics.',
      step2: 'Drafted 5 carousel slides with high-retention copywriting & 20 high-converting hashtags.',
      step3: 'Created Midjourney / FLUX image prompt: "Minimalist clay 3D workstation, soft studio lighting, pastel palette #E6EEF8, 8k resolution".',
      approvalReq: 'Dispatch drafted Instagram carousel and visual asset pack to Social Team Telegram Channel (@qwenton_social).',
    },
    design: {
      title: 'AI Creative Director & Visual Concept Designer',
      action: 'Generating Brand Asset Kit & Visual Mockup Specs',
      step1: 'Extracted brand typography, claymorphism guidelines, and color tokens from BrandBook.pdf.',
      step2: 'Composed responsive UI hero section layout with custom clay depth shadow specifications.',
      step3: 'Rendered vector asset palette: #4667B1 (Primary), #F8F6F1 (Canvas), #B98232 (Amber Accent).',
      approvalReq: 'Export final high-resolution PNG/SVG assets to Figma shared workspace.',
    },
    research: {
      title: 'Deep Market & Competitor Intelligence Analyst',
      action: 'Conducting Multi-Source Competitive Dossier',
      step1: 'Scraped 14 live competitor pricing pages & parsed public Q3 financial disclosures.',
      step2: 'Evaluated unit economics: margin variance modeled at +18.4% without customer churn risk.',
      step3: 'Synthesized 12-page executive briefing report with verifiable source citations.',
      approvalReq: 'Send confidential Executive Strategy Dossier to Executive Board via secure Telegram bot.',
    },
    telegram: {
      title: '24/7 Mobile Operations & Telegram Coordinator',
      action: 'Processing Live Mobile Team Directive',
      step1: 'Received Telegram voice note from Founder: "Summarize today’s customer churn inquiries".',
      step2: 'Queried Knowledge Base & customer ticket vector database (98.8% match rate).',
      step3: 'Formulated concise 3-bullet action summary with recommended pricing mitigation.',
      approvalReq: 'Post automated reply back to Founder Telegram Direct Message with 1-tap approval.',
    },
  };

  const rosterPersonas = {
    social_lead: {
      name: 'Maya — Social & Instagram Growth Lead',
      role: 'Content Creation, Visual Direction & Scheduling',
      badge: 'Social & Instagram',
      category: 'Marketing & Audience Growth',
      description:
        'Architects viral Instagram carousels, drafts high-converting Reels scripts, crafts AI image generation prompts for visual assets, and plans 30-day cross-platform content calendars.',
      tools: ['Web Research', 'AI Image Prompting', 'Scheduled Routines', 'Telegram Dispatch'],
      sampleInput: 'Create an engaging 5-slide Instagram carousel on "5 AI Automations Every Agency Must Use in 2026", with visual design prompts for each slide.',
      sampleOutput:
        '✓ Slide 1: "The 40-Hour Work Week is a Choice" (Hook). Visual prompt: 3D floating clay clock with organic gradient lighting.\n✓ Slides 2-4: Deep dive into automated document extraction, competitive crawlers, and approval gates.\n✓ Slide 5: Actionable CTA + 18 curated hashtags. Ready for scheduled publication.',
    },
    visual_designer: {
      name: 'Aria — AI Visual & Creative Designer',
      role: 'Brand Asset Ideation & Creative Direction',
      badge: 'Creative & Design',
      category: 'Design & Visual Assets',
      description:
        'Turns rough business concepts into polished design briefs, creates precise prompts for image generation models, formats visual banner layouts, and maintains strict brand identity consistency.',
      tools: ['Knowledge Base Search', 'Visual Asset Modeling', 'Report Generator'],
      sampleInput: 'Generate a creative visual concept and color palette for our new "Autonomous Coworker" product launch campaign.',
      sampleOutput:
        'Palette defined: Cream Canvas (#F8F6F1), Slate Ink (#263247), Clay Primary (#4667B1). Generated 3 hero concept briefs with soft-body 3D isometric perspectives and human-in-the-loop approval icons.',
    },
    market_analyst: {
      name: 'Marcus — Deep Market & Intelligence Analyst',
      role: 'Competitive Strategy & Financial Modeling',
      badge: 'Deep Research',
      category: 'Strategy & Research',
      description:
        'Conducts automated competitive reconnaissance, synthesizes regulatory and financial documents, calculates margin impacts, and drafts boardroom-ready strategic battlecards.',
      tools: ['Web Research', 'Document Extraction', 'Math Calculator', 'Executive Briefing'],
      sampleInput: 'Track the latest pricing updates across top 3 competitors and model how a 10% price adjustment impacts our annual recurring revenue.',
      sampleOutput:
        'Competitor analysis complete: Average tier increased by 14.2%. Modeling indicates our annual revenue would expand by +$64,800 while maintaining a 12% price advantage over market leader.',
    },
    operations: {
      name: 'Devon — Operations & Workflow Coordinator',
      role: '24/7 Routine Automation & Telegram Sync',
      badge: 'Operations',
      category: 'Operations & Execution',
      description:
        'Monitors internal KPIs, triggers recurring scheduled audits, routes tasks to team members, and syncs high-priority alerts to private Telegram groups with instant approval buttons.',
      tools: ['Math Calculator', 'Scheduled Routines', 'Company Knowledge Search', 'Telegram Bot Dispatch'],
      sampleInput: 'Run Monday morning executive operational audit and send summary to the management Telegram channel.',
      sampleOutput:
        'Operational audit executed: All 6 routines ran successfully. Task backlog reduced by 24%. Executive briefing prepared and awaiting 1-click human verification.',
    },
    support: {
      name: 'Elena — Customer Intelligence Sentinel',
      role: 'Knowledge-Grounded Customer Success',
      badge: 'Customer Intelligence',
      category: 'Support & Retention',
      description:
        'Indexes company product manuals, policy docs, and FAQs. Resolves complex customer inquiries with zero hallucination and alerts managers to emerging complaint trends.',
      tools: ['Knowledge Base Search', 'Read File', 'Audit Logging', 'Approval Firewall'],
      sampleInput: 'Analyze customer feedback from the last 14 days and highlight top 3 requested features.',
      sampleOutput:
        'Identified 48 mentions of "Instagram auto-scheduler integration", 32 mentions of "multi-agent collaboration", and 19 mentions of "Slack webhook support". Actionable product roadmap memo compiled.',
    },
  };

  const businessArticles = [
    {
      title: 'Automating Instagram & Visual Content Creation with AI Coworkers',
      readTime: '5 min read',
      category: 'Social Media & Design',
      summary:
        'How modern brand builders and agencies use autonomous agents to conceptualize carousels, engineer AI image prompts, and schedule posts 10x faster.',
      content:
        'Social media management is notoriously time-consuming. From researching trending angles to drafting copy and designing visuals, creative teams spend dozens of hours every week on repetitive tasks. With specialized AI coworkers, you can delegate the entire ideation-to-drafting pipeline: agents research competitor performance, generate high-converting carousel copywriting, produce exact visual generation prompts, and queue posts for one-click human approval.',
    },
    {
      title: 'Deep Autonomous Research: Moving Beyond Surface-Level Search',
      readTime: '6 min read',
      category: 'Market Intelligence',
      summary:
        'A comprehensive guide on deploying multi-step autonomous research agents that crawl competitors, extract structured data, and synthesize board memos.',
      content:
        'Standard search engines return thousands of fragmented links. Deep-research coworkers, however, autonomously navigate through dozens of source documents, verify statistical data, perform real-time math calculations on pricing sheets, and compile comprehensive dossiers with exact paragraph citations—delivering executive-level intelligence in minutes instead of days.',
    },
    {
      title: 'The Human-in-the-Loop Safeguard: Why Uncontrolled AI Is a Business Risk',
      readTime: '4 min read',
      category: 'Enterprise Safety',
      summary:
        'Why enterprise organizations enforce strict approval firewalls before permitting AI agents to send messages, modify records, or execute financial transactions.',
      content:
        'Autonomy without governance invites catastrophe. Rogue emails, inaccurate client communications, and unintended API calls can devastate brand reputation. qwenton-agents pioneers the Approval Firewall: every high-risk external write pauses automatically, presenting managers with clear parameters and a one-click authorization button on desktop and Telegram.',
    },
    {
      title: 'Mobile Coworker Orchestration: Running a 24/7 Agency via Telegram',
      readTime: '5 min read',
      category: 'Operations Playbook',
      summary:
        'How solo founders and lean teams control their entire fleet of AI specialists from their mobile phones using custom Telegram bot integration.',
      content:
        'You do not need to be glued to a laptop to run sophisticated AI workflows. By connecting your agents to private Telegram bots, you can send voice notes, request instant market summaries while traveling, and approve critical deliverables with a single tap from anywhere in the world.',
    },
  ];

  const faqs = [
    {
      q: 'What all can my AI coworkers do beyond marketing?',
      a: 'Your coworkers are fully multi-modal and versatile! They handle Instagram & social media campaigns, AI image design briefs & prompt engineering, deep competitor market research, private document extraction (PDFs, contracts, spreadsheets), 24/7 scheduled automated routines, customer intelligence tracking, and seamless Telegram chat collaboration.',
    },
    {
      q: 'How does the creative image & design workflow work?',
      a: 'Agents like Aria (AI Visual & Creative Designer) parse your brand guidelines, color codes, and creative briefs to produce structured visual asset specifications, banner compositions, and tuned prompts for state-of-the-art image models (Midjourney, DALL-E, FLUX).',
    },
    {
      q: 'How does the human approval system protect my business?',
      a: 'Whenever an agent attempts an external action—such as sending a Telegram broadcast, publishing content, or calling external APIs—the run automatically pauses. A clear approval notification with exact parameters is sent to your dashboard and Telegram. Nothing is sent without your explicit sign-off.',
    },
    {
      q: 'Can I use custom AI models, OpenAI, Google Gemini, or local models?',
      a: 'Yes! qwenton-agents supports Google Gemini, OpenAI (GPT-4o), Groq (LLaMA 3.3), local LM Studio/Ollama, or any custom BaseURL and API key. You can configure global models or assign individual model overrides per agent.',
    },
    {
      q: 'What are the 4 subscription tiers and agent capacities?',
      a: 'We offer 4 clear tiers: Normal (Free forever, up to 2 active agents), Lite (4 active agents, $9/mo), Pro (9 active agents with scheduled routines and priority streaming, $29/mo), and Ultra (15 dedicated agents with custom enterprise routing, $79/mo).',
    },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col text-ink selection:bg-cloud-blue selection:text-primary-deep">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-md border-b border-border/70">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-primary to-primary-deep text-white flex items-center justify-center shadow-clay-button">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-ink tracking-tight">
                qwenton<span className="text-primary">agents</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-primary-deep uppercase tracking-wider bg-cloud-blue border border-[#D0DFEF] px-2.5 py-0.5 rounded-full">
                All-in-One AI Workforce
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-muted">
              <a href="#suite" className="hover:text-ink transition-colors">
                Capability Suite
              </a>
              <a href="#sandbox" className="hover:text-ink transition-colors">
                Live Sandbox
              </a>
              <a href="#roster" className="hover:text-ink transition-colors">
                Agent Roster
              </a>
              <a href="#insights" className="hover:text-ink transition-colors">
                Articles & Playbooks
              </a>
              <a href="#faq" className="hover:text-ink transition-colors">
                FAQ
              </a>
              <Link href="/pricing" className="hover:text-ink transition-colors font-bold text-primary">
                Pricing
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-ink-muted hover:text-ink px-3 py-1.5">
                Sign In
              </Link>
              <Link href="/login">
                <Button size="sm" className="shadow-clay-button font-bold">
                  Launch Workspace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cloud-blue border border-[#D0DFEF] text-primary-deep text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Social Media • Creative Design • Deep Research • Telegram Operations • Document Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-ink tracking-tight leading-[1.12] mb-6">
            Not Just Marketing.{' '}
            <span className="text-primary bg-gradient-to-r from-primary to-primary-deep bg-clip-text text-transparent">
              Your Entire Business Workforce
            </span>
            , Powered by AI.
          </h1>

          <p className="text-lg sm:text-xl text-ink-muted leading-relaxed max-w-3xl mx-auto mb-8 font-normal">
            Deploy specialized AI coworkers to manage your Instagram content, design visual creative briefs, conduct multi-source deep research, index company files, and collaborate 24/7 over Telegram — with strict human approval for every sensitive action.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto gap-2 shadow-clay-button font-bold px-8">
                <span>Deploy 2 Free Agents</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold">
                Explore 4 Scalable Plans (Up to 15 Agents)
              </Button>
            </Link>
          </div>
        </div>

        {/* Interactive Live Coworker Studio Sandbox */}
        <div id="sandbox" className="clay-surface p-6 sm:p-8 max-w-4xl mx-auto border-2 border-border/80 shadow-clay-card mt-8">
          {/* Sandbox Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/70 mb-5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveSandbox('social');
                  setSandboxApproved(false);
                }}
                className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeSandbox === 'social'
                    ? 'bg-primary text-white shadow-clay-button'
                    : 'bg-[#F8F6F1] text-ink-muted hover:text-ink'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram & Social</span>
              </button>

              <button
                onClick={() => {
                  setActiveSandbox('design');
                  setSandboxApproved(false);
                }}
                className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeSandbox === 'design'
                    ? 'bg-primary text-white shadow-clay-button'
                    : 'bg-[#F8F6F1] text-ink-muted hover:text-ink'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Creative & Design</span>
              </button>

              <button
                onClick={() => {
                  setActiveSandbox('research');
                  setSandboxApproved(false);
                }}
                className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeSandbox === 'research'
                    ? 'bg-primary text-white shadow-clay-button'
                    : 'bg-[#F8F6F1] text-ink-muted hover:text-ink'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Deep Research</span>
              </button>

              <button
                onClick={() => {
                  setActiveSandbox('telegram');
                  setSandboxApproved(false);
                }}
                className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeSandbox === 'telegram'
                    ? 'bg-primary text-white shadow-clay-button'
                    : 'bg-[#F8F6F1] text-ink-muted hover:text-ink'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Telegram Bot</span>
              </button>
            </div>

            <Badge variant="success" className="text-[11px] font-bold">
              ● Live Studio Simulation
            </Badge>
          </div>

          {/* Sandbox Running Details */}
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between text-ink font-bold pb-1">
              <span>{sandboxDemos[activeSandbox].title}</span>
              <span className="text-[11px] text-primary">{sandboxDemos[activeSandbox].action}</span>
            </div>

            {/* Step 1 */}
            <div className="bg-[#F8F6F1] p-3.5 rounded-control border border-border/70 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-ink">Step 1: Intelligent Data & Context Analysis</span>
                <p className="text-ink-muted mt-0.5 font-sans">{sandboxDemos[activeSandbox].step1}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F8F6F1] p-3.5 rounded-control border border-border/70 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-ink">Step 2: Generation & Mathematical Validation</span>
                <p className="text-ink-muted mt-0.5 font-sans">{sandboxDemos[activeSandbox].step2}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F8F6F1] p-3.5 rounded-control border border-border/70 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-ink">Step 3: Multi-Modal Output & Asset Staging</span>
                <p className="text-ink-muted mt-0.5 font-sans">{sandboxDemos[activeSandbox].step3}</p>
              </div>
            </div>

            {/* Step 4: Human Approval Firewall */}
            <div className="bg-[#FDF4E7] p-4 rounded-control border-2 border-amber-approval/50 text-ink">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-approval shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#8C5D1E] text-sm">
                      Human Approval Gate Required
                    </span>
                    <p className="text-xs text-[#8C5D1E]/90 mt-1 font-sans">
                      {sandboxDemos[activeSandbox].approvalReq}
                    </p>
                  </div>
                </div>

                {!sandboxApproved ? (
                  <Button
                    size="sm"
                    variant="amber"
                    onClick={() => setSandboxApproved(true)}
                    className="shrink-0 font-bold shadow-clay-button"
                  >
                    1-Click Authorize
                  </Button>
                ) : (
                  <Badge variant="success" className="shrink-0 py-1.5 px-3 font-bold">
                    ✓ Authorized & Executed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI & Key Metrics Strip */}
      <section className="bg-white border-y border-border/70 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary-deep mb-1">6-in-1</div>
            <div className="text-xs sm:text-sm font-semibold text-ink-muted">Complete Business Suite</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary-deep mb-1">20+ hrs</div>
            <div className="text-xs sm:text-sm font-semibold text-ink-muted">Saved per creator / manager</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary-deep mb-1">100% Safe</div>
            <div className="text-xs sm:text-sm font-semibold text-ink-muted">Zero unauthorized writes</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary-deep mb-1">&lt; 30s</div>
            <div className="text-xs sm:text-sm font-semibold text-ink-muted">Telegram Bot Deployment</div>
          </div>
        </div>
      </section>

      {/* The 6-Pillar Capability Suite: Everything You Can Do */}
      <section id="suite" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cloud-blue text-primary-deep text-xs font-bold mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Versatile Autonomous Coworkers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-4">
            A Complete Autonomous Workforce for Every Function
          </h2>
          <p className="text-base text-ink-muted">
            From social media viral campaigns to financial modeling and Telegram dispatch, manage all business operations from one calm workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1: Instagram & Social Media */}
          <div className="clay-surface p-7 flex flex-col justify-between hover:shadow-clay-card-hover transition-all border border-border/80">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-[#FDECEC] text-[#B95151] flex items-center justify-center mb-5 shadow-clay-button-subtle">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Instagram & Social Management</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Auto-generate multi-slide carousels, engaging caption hooks, hashtag clusters, and 30-day content calendars tailored to your brand voice.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-bold text-[#B95151] flex items-center gap-1">
              <span>Viral Content Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Module 2: Image & Creative Design */}
          <div className="clay-surface p-7 flex flex-col justify-between hover:shadow-clay-card-hover transition-all border border-border/80">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-soft-lavender text-[#523E8C] flex items-center justify-center mb-5 shadow-clay-button-subtle">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Creative Asset & Image Design</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Turn product ideas into structured visual briefs, aesthetic palettes, banner mockup concepts, and tuned prompts for top AI image models.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-bold text-[#523E8C] flex items-center gap-1">
              <span>Creative Studio Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Module 3: Deep Research Engine */}
          <div className="clay-surface p-7 flex flex-col justify-between hover:shadow-clay-card-hover transition-all border border-border/80">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-cloud-blue text-primary flex items-center justify-center mb-5 shadow-clay-button-subtle">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Deep Web & Market Research</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Scrapes live competitor websites, aggregates regulatory & pricing news, calculates margin models, and builds verified dossiers with citations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-bold text-primary flex items-center gap-1">
              <span>Autonomous Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Module 4: Telegram & Mobile Operations */}
          <div className="clay-surface p-7 flex flex-col justify-between hover:shadow-clay-card-hover transition-all border border-border/80">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-[#E5F4EC] text-[#2D6A53] flex items-center justify-center mb-5 shadow-clay-button-subtle">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Telegram 24/7 Mobile Sync</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Connect your Telegram bot in 30 seconds. Query agents via voice/text, receive morning summaries, and approve actions with one tap.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-bold text-[#2D6A53] flex items-center gap-1">
              <span>Mobile Dispatch Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Module 5: Document Intelligence Vault */}
          <div className="clay-surface p-7 flex flex-col justify-between hover:shadow-clay-card-hover transition-all border border-border/80">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-butter text-[#8C5D1E] flex items-center justify-center mb-5 shadow-clay-button-subtle">
                <FolderLock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Private Knowledge Base Vault</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Upload PDFs, spreadsheets, contracts, and handbooks. Agents extract answers with exact page references without public model leakage.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-bold text-[#8C5D1E] flex items-center gap-1">
              <span>Zero-Leakage Retrieval</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Module 6: Human Approval Firewall */}
          <div className="clay-surface p-7 flex flex-col justify-between hover:shadow-clay-card-hover transition-all border border-border/80">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-[#FDF4E7] text-amber-approval flex items-center justify-center mb-5 shadow-clay-button-subtle">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Human Approval Firewall</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Zero rogue external actions. High-stakes communication, Telegram broadcasts, and API updates always pause for manager sign-off.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-bold text-amber-approval flex items-center gap-1">
              <span>100% Enterprise Safety</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Agent Persona Roster */}
      <section id="roster" className="bg-white border-y border-border/70 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-4">
              Pre-Trained Specialized Coworkers Ready on Day One
            </h2>
            <p className="text-base text-ink-muted">
              Select a specialized coworker below to inspect their tool capabilities, manager prompts, and real-world execution.
            </p>
          </div>

          {/* Persona Switcher Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveRoster('social_lead')}
              className={`px-4 py-2.5 rounded-control text-xs font-bold transition-all ${
                activeRoster === 'social_lead'
                  ? 'bg-primary text-white shadow-clay-button'
                  : 'bg-[#F8F6F1] text-ink-muted hover:text-ink border border-border'
              }`}
            >
              Maya (Instagram & Social Lead)
            </button>
            <button
              onClick={() => setActiveRoster('visual_designer')}
              className={`px-4 py-2.5 rounded-control text-xs font-bold transition-all ${
                activeRoster === 'visual_designer'
                  ? 'bg-primary text-white shadow-clay-button'
                  : 'bg-[#F8F6F1] text-ink-muted hover:text-ink border border-border'
              }`}
            >
              Aria (AI Creative & Visual Designer)
            </button>
            <button
              onClick={() => setActiveRoster('market_analyst')}
              className={`px-4 py-2.5 rounded-control text-xs font-bold transition-all ${
                activeRoster === 'market_analyst'
                  ? 'bg-primary text-white shadow-clay-button'
                  : 'bg-[#F8F6F1] text-ink-muted hover:text-ink border border-border'
              }`}
            >
              Marcus (Market & Intel Analyst)
            </button>
            <button
              onClick={() => setActiveRoster('operations')}
              className={`px-4 py-2.5 rounded-control text-xs font-bold transition-all ${
                activeRoster === 'operations'
                  ? 'bg-primary text-white shadow-clay-button'
                  : 'bg-[#F8F6F1] text-ink-muted hover:text-ink border border-border'
              }`}
            >
              Devon (Operations Coordinator)
            </button>
            <button
              onClick={() => setActiveRoster('support')}
              className={`px-4 py-2.5 rounded-control text-xs font-bold transition-all ${
                activeRoster === 'support'
                  ? 'bg-primary text-white shadow-clay-button'
                  : 'bg-[#F8F6F1] text-ink-muted hover:text-ink border border-border'
              }`}
            >
              Elena (Customer Sentinel)
            </button>
          </div>

          {/* Persona Showcase Card */}
          <div className="clay-surface p-8 max-w-4xl mx-auto border border-border/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-primary to-primary-deep text-white flex items-center justify-center shadow-clay-button">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">{rosterPersonas[activeRoster].name}</h3>
                  <p className="text-xs text-ink-muted mt-0.5">{rosterPersonas[activeRoster].role}</p>
                </div>
              </div>
              <Badge variant="info">{rosterPersonas[activeRoster].badge}</Badge>
            </div>

            <p className="text-sm text-ink-muted leading-relaxed">
              {rosterPersonas[activeRoster].description}
            </p>

            {/* Tool Stack */}
            <div>
              <span className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
                Active Tool Stack:
              </span>
              <div className="flex flex-wrap gap-2">
                {rosterPersonas[activeRoster].tools.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-[#F8F6F1] border border-border rounded-full text-xs font-semibold text-primary-deep"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Input / Output Run */}
            <div className="bg-[#F8F6F1] p-5 rounded-control border border-border space-y-3">
              <div>
                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-1">
                  Manager Directive / Prompt:
                </span>
                <p className="text-xs font-medium text-ink italic">&quot;{rosterPersonas[activeRoster].sampleInput}&quot;</p>
              </div>
              <div className="pt-3 border-t border-border/60">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-1">
                  Coworker Grounded Output:
                </span>
                <pre className="text-xs text-ink font-sans whitespace-pre-line leading-relaxed">
                  {rosterPersonas[activeRoster].sampleOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles & Playbooks (Blog Section) */}
      <section id="insights" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-soft-lavender text-[#523E8C] text-xs font-bold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Articles & Business Playbooks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-4">
            Insights on Autonomous Agent Architecture
          </h2>
          <p className="text-base text-ink-muted">
            In-depth operational playbooks on social media automation, creative design direction, and enterprise safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businessArticles.map((article, idx) => (
            <div
              key={idx}
              className="clay-surface p-6 sm:p-8 flex flex-col justify-between hover:shadow-clay-card-hover transition-all border border-border/80"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="outline">{article.category}</Badge>
                  <span className="text-xs text-ink-light flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink mb-3 leading-snug">{article.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed mb-4">
                  {article.summary}
                </p>

                {activeArticle === idx ? (
                  <div className="mt-4 p-4 bg-[#F8F6F1] rounded-control border border-border text-xs text-ink leading-relaxed animate-in fade-in">
                    {article.content}
                  </div>
                ) : null}
              </div>

              <button
                onClick={() => setActiveArticle(activeArticle === idx ? null : idx)}
                className="mt-4 text-xs font-bold text-primary hover:underline flex items-center gap-1.5 self-start"
              >
                <span>{activeArticle === idx ? 'Collapse Article' : 'Read Full Playbook'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="bg-white border-t border-border/70 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-ink tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-ink-muted">
              Everything you need to know about creative workflows, agent capacities, and human safety firewalls.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="clay-surface overflow-hidden border border-border/80">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-black/[0.01] transition-colors"
                  >
                    <span className="font-bold text-sm text-ink">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-ink-muted shrink-0" />
                    )}
                  </button>
                  {isOpen ? (
                    <div className="px-5 pb-5 pt-1 text-xs text-ink-muted leading-relaxed border-t border-border/40">
                      {faq.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final High-Converting CTA Banner */}
      <section className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="clay-surface p-10 sm:p-14 text-center relative overflow-hidden bg-gradient-to-b from-white to-[#F6F4EE] border-2 border-primary/20 shadow-clay-card">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Ready to deploy your specialized AI workforce?
            </h2>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Start with 2 free agents on the Normal plan to manage Instagram, creative design, research, and Telegram workflows. Upgrade anytime to 4, 9, or 15 dedicated agents as your business grows.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/signup">
                <Button size="lg" className="shadow-clay-button font-bold px-8">
                  Create Workspace (2 Agents Free)
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="font-semibold">
                  View 4 Tier Limits
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clean, High-End Corporate Footer */}
      <footer className="border-t border-border/70 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-[10px] bg-primary text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-ink">
                qwenton<span className="text-primary">agents</span>
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              Autonomous AI coworkers for Instagram marketing, creative design, deep research, and Telegram operations with human-in-the-loop safety.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Capabilities</h4>
            <ul className="space-y-2 text-xs text-ink-muted font-medium">
              <li>
                <a href="#suite" className="hover:text-ink">
                  Instagram & Social Suite
                </a>
              </li>
              <li>
                <a href="#suite" className="hover:text-ink">
                  AI Image & Creative Design
                </a>
              </li>
              <li>
                <a href="#suite" className="hover:text-ink">
                  Deep Web Research
                </a>
              </li>
              <li>
                <a href="#suite" className="hover:text-ink">
                  Telegram Bot Orchestration
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-ink-muted font-medium">
              <li>
                <a href="#insights" className="hover:text-ink">
                  Articles & Playbooks
                </a>
              </li>
              <li>
                <a href="#sandbox" className="hover:text-ink">
                  Live Studio Sandbox
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-ink">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-ink">
                  Subscription Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Company & Safety</h4>
            <ul className="space-y-2 text-xs text-ink-muted font-medium">
              <li>
                <span className="hover:text-ink cursor-pointer">Security Policy</span>
              </li>
              <li>
                <span className="hover:text-ink cursor-pointer">Data Privacy Safeguards</span>
              </li>
              <li>
                <span className="hover:text-ink cursor-pointer">Human Approval SLA</span>
              </li>
              <li>
                <span className="hover:text-ink cursor-pointer">Enterprise Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <div>© 2026 qwenton-agents. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-ink cursor-pointer">Privacy Policy</span>
            <span className="hover:text-ink cursor-pointer">Terms of Service</span>
            <span className="hover:text-ink cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
