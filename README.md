# qwenton-agents 🚀

> **A calm, tactile AI coworker workspace for business teams. Runs with zero lag locally and deploys seamlessly to Vercel and VPS servers.**

---

## Key Features

- **⚡ Zero-Lag Local First:** Starts instantly with `npm run dev`. Features an automatic local database and session fallback so you can develop and test without configuring external cloud services.
- **🛡️ Hard 3-Agent Limit:** Atomic backend entitlement transactions prevent any user from exceeding 3 active agents across all API endpoints.
- **🤖 Dual-Mode LLM Runtime:** Connects to local LM Studio (`http://127.0.0.1:1234/v1`) or Ollama out of the box, with automatic structured JSON tool call repair for 7B/8B models, and support for cloud providers (OpenAI, Groq, OpenRouter).
- **✋ Human-in-the-Loop Approvals:** External write actions (e.g. Telegram messages, Slack alerts) automatically pause execution until approved via the Web UI or Telegram inline buttons.
- **💬 Telegram Bot Integration:** Native Telegram Bot API client with webhooks for production and a local polling runner (`npm run telegram:dev`) for local testing without ngrok.
- **💳 Stripe-Ready Billing:** Complete Checkout session creation, customer portal links, and raw-body webhook handling with idempotency.
- **🎨 Tactile Claymorphism UI:** Warm light palette (`#F8F6F1`), soft 3D clay cards, friendly avatars, and an observable 3-panel workspace with live activity timeline.
- **📦 Multi-Target Deployment:** One-click Vercel deployment (no Docker required) or VPS hosting via PM2 cluster (`deploy/ecosystem.config.js`) / standalone Dockerfile.

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env.local
```
*Note: Even without filling out `.env.local`, the app will boot immediately into zero-lag local persistence mode.*

### 3. Connect Local LLM (LM Studio / Ollama)
- Open [LM Studio](https://lmstudio.ai/)
- Load any model (e.g., `Qwen2.5-7B-Instruct` or `Meta-Llama-3-8B-Instruct`)
- Start the Local Server on port `1234` with CORS enabled.

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Local Telegram Bot Testing (No Ngrok Required)

To test Telegram bots locally without setting up public webhooks or tunnels:
1. Obtain a bot token from [@BotFather](https://t.me/BotFather) on Telegram.
2. Link the bot in the workspace UI at `/integrations`.
3. In a separate terminal, run:
```bash
npm run telegram:dev
```
This starts the local polling worker that receives Telegram messages and passes them directly to your active AI coworker!

---

## Production Deployments

### Option A: Deploy to Vercel (Zero Docker)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set your production environment variables in the Vercel Project Settings:
   - `MODEL_PROVIDER=openai` (or `groq`)
   - `OPENAI_API_KEY=...` (or `GROQ_API_KEY=...`)
   - Firebase Client & Admin SDK keys
   - Stripe Keys & Webhook Secret
   - `NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app`
4. Deploy!

### Option B: Deploy to VPS Server (Ubuntu / Debian via PM2)
1. Clone repository to your VPS.
2. Build the optimized standalone Next.js bundle:
```bash
npm install
npm run build
```
3. Start the application cluster with PM2:
```bash
pm2 start deploy/ecosystem.config.js
pm2 save
```

### Option C: Deploy with Docker
```bash
docker build -t qwenton-agents -f deploy/Dockerfile .
docker run -p 3000:3000 -d qwenton-agents
```

---

## Firebase Setup (Cloud Mode)

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password & Google).
3. Enable **Cloud Firestore** and **Cloud Storage**.
4. Deploy security rules:
```bash
firebase deploy --only firestore:rules,storage
```

---

## Verification & Quality Gates

```bash
# Type check all TypeScript files
npm run typecheck

# Lint codebase
npm run lint

# Build production standalone bundle
npm run build
```

---

## License

MIT © 2026 qwenton-agents
