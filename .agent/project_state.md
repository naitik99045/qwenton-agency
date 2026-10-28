# Project State & Context
**Last Updated:** October 28, 2026, 18:04 IST (v0.5.0 Production Ready: Meta Connection Ingress, High-Contrast Tri-Color UI & Competitive Supremacy)

---

## 1. Project Overview

**Qwenton** (`qwenton-agents`) is an autonomous AI coworker platform, agency swarm orchestrator, and marketing growth automation engine designed for founders, creators, and agency operators.

### Core Systems Operating:
- **Zero-Docker Cloud Native**: Built with Next.js 15 App Router and deployed seamlessly to Vercel.
- **Dual-Mode Data Architecture**: Firebase Firestore in production with `LocalDBAdapter` and Realtime Database cloud sync.
- **Single-Key Cloud AI Inference**: Groq, Google Gemini, OpenAI inference with zero local model dependencies.
- **Meta & Instagram Connection Ingress**: Direct Meta API key connection modal in `/integrations` with Instagram Account Selector, Reel Trigger Keyword configuration, and instant auto-provisioning of Reel Comment-to-DM rules.
- **Live Meta Webhook & Graph API Dispatcher**: `app/api/instagram/webhook/route.ts` with HMAC-SHA256 signature verification and `lib/instagram/api.ts` for instant private DMs and public comment replies.
- **Tri-Color 60-30-10 Solid UI**: Strictly zero gradients, high-contrast OKLCH palette (Tactile Linen, Deep Obsidian, Signal Amber), skeleton loaders for async states, and dedicated legal terms and privacy compliance routes.

---

## 2. Competitive Teardown Summary: Skydive.com vs. Qwenton

| Feature | Skydive (`skydive.com`) | Qwenton (`qwenton-agents`) |
|---------|-------------------------|----------------------------|
| **Execution Architecture** | Heavy, isolated Linux cloud containers ($20+/mo per sandbox) | Cloud-native serverless Next.js 15 App Router on Vercel |
| **Social Virality Engine** | None (focused on internal ticketing) | **Instant Instagram Reel Comment-to-DM Engine with Spintax** |
| **Approval Flow** | Desktop web browser notifications | **Instant Telegram Mobile Push with 1-Click Inline Buttons** |
| **Design Aesthetics** | Generic dark AI template with heavy glow | **Pure Tri-Color 60-30-10 Solid OKLCH (Zero Gradients)** |
| **Multi-Agent Swarm** | General digital coworkers | **Specialized Agency Swarm (Strategy, Copy, Visuals, Code)** |

---

## 3. Completed Milestones & Status
- **Brainstorm (`qwenton-brainstorm`)**: [COMPLETED]
- **Execute & UI Making (`qwenton-ui`)**: [COMPLETED]
- **Pentest Audit (`qwenton-pentest`)**: [COMPLETED - 100% PASS in `.agent/security_report.md`]
- **Design Review (`qwenton-review`)**: [COMPLETED - 28/28 Passed in `.agent/review_report.md`]
- **Verification Build**: [COMPLETED - `npm run build` exited with code 0 across 57 routes]
