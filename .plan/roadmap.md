# Project Execution Roadmap
**Status:** Complete

## Phase 1: Meta Connection Ingress in Integrations Tab
- [x] **Task 1.1: Meta API Key, Account Selector & Reel Trigger Keyword in `/integrations`**
  - *Action:* Enhanced the Meta / Instagram modal in `app/integrations/page.tsx` with:
    1. Meta API Key / Access Token input with documentation guidance.
    2. Account Selector dropdown (select from connected accounts or enter Instagram Account ID/handle).
    3. Reel Trigger Keyword input (e.g. `GROWTH`, `DM`, `PRICE`) with helper explanation.
    4. Auto-sync on save: When saved, call `/api/integrations` and automatically provision or update the user's default `InstagramReelRule`.
    5. Direct action button to open `/instagram` for multi-reel rules.
  - *Target Files:* `app/integrations/page.tsx`, `app/api/integrations/route.ts`
  - *Done When:* User can enter Meta API key, select their account, specify the trigger word, click save, and see the integration connected and rule active.

## Phase 2: Live Meta Webhook Ingress & Dispatch Architecture
- [x] **Task 2.1: Live Meta Webhook Route Handler**
  - *Action:* Implemented `app/api/instagram/webhook/route.ts` with `GET` challenge handshake (`hub.challenge`, `hub.verify_token`) and `POST` event handler parsing incoming Instagram comment and DM events.
  - *Target Files:* `app/api/instagram/webhook/route.ts`
  - *Done When:* Route passes challenge verification and parses incoming comment events to trigger auto-replies.
- [x] **Task 2.2: Live Meta Graph API Client**
  - *Action:* Created `lib/instagram/api.ts` with `replyToComment`, `sendPrivateReply`, and `sendDirectMessage` using Meta Graph API v20.0.
  - *Target Files:* `lib/instagram/api.ts`
  - *Done When:* Graph API client is typed, supports Bearer auth from integration tokens, and handles error states.

## Phase 3: High-Contrast Tri-Color UI Redesign (Strictly Zero Gradients)
- [x] **Task 3.1: Eliminate All Gradients Across Codebase**
  - *Action:* Removed all `bg-linear-*`, `bg-gradient-*`, and ash gradients from `app/globals.css`, `components/layout/AppShell.tsx`, `app/integrations/page.tsx`, `app/instagram/page.tsx`, `app/conversations/page.tsx`, and `components/ui/Avatar.tsx`.
  - *Target Files:* `app/globals.css`, `components/layout/AppShell.tsx`, `app/integrations/page.tsx`, `app/instagram/page.tsx`, `app/conversations/page.tsx`, `components/ui/Avatar.tsx`
  - *Done When:* Codebase contains zero gradient utilities and renders with solid, high-contrast surfaces.
- [x] **Task 3.2: 60-30-10 Tri-Color Palette & Mandatory Review Elements**
  - *Action:* Applied 60% Base Canvas, 30% Structural Panels/Chalk, 10% High-Contrast Accent. Added skeleton loaders for async states and verified legal footer links (`/terms`, `/privacy`) are visible.
  - *Target Files:* `app/integrations/page.tsx`, `app/instagram/page.tsx`, `components/layout/AppShell.tsx`
  - *Done When:* Clean, high-contrast tri-color aesthetic is active without banned tropes.

## Phase 4: Defensive Security Pentest (`qwenton-pentest`)
- [x] **Task 4.1: Security Audit & Vulnerability Remediation**
  - *Action:* Audited `/api/integrations`, `/api/instagram/webhook`, `/api/instagram/rules`, and `/api/instagram/settings`. Verified secret masking, HMAC-SHA256 signature verification, and input validation.
  - *Target Files:* `.agent/security_report.md`, `app/api/instagram/webhook/route.ts`
  - *Done When:* Security audit report is compiled, all issues are marked `[FIXED]`, and verified.

## Phase 5: Design Review & Anti-Trope Verification (`qwenton-review`)
- [x] **Task 5.1: Negative Design Constraint Checklist & Final Polish**
  - *Action:* Audited against the 28 forbidden tropes (no gradients, no radial orbs, no 3 cards in a row, no em dashes in Geist, skeleton loaders present, legal footer links present).
  - *Target Files:* `.agent/review_report.md`
  - *Done When:* All 28 checks pass and full application builds with zero errors.
