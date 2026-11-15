# Qwenton Agents — Master Landing-Page Rebuild Prompt

Copy everything inside the block below into the AI coding agent that will rebuild the site.

---

## MASTER PROMPT

You are a senior product designer, conversion-focused UX writer, React/Next.js engineer, and React Three Fiber architect. Rebuild the existing `agents.qwenton.shop` landing page into a polished, production-ready product website for Qwenton: an autonomous coworker platform for Instagram lead capture, competitor intelligence, and human-approved business automation.

Do not make a generic AI website. Do not make a cyberpunk website. Do not use a neon whirlpool, glowing rings, orbiting circles, particle soup, black-hole background, rotating wireframe sphere, or decorative 3D object with no product meaning.

The current website already contains useful product material—Reels Comment-to-DM, the human approval firewall, the execution pipeline, the growth audit sandbox, pricing, FAQ, and signup CTAs. Preserve and improve that product logic. Rebuild the visual hierarchy and the first viewport so the page immediately communicates what Qwenton does and shows a purposeful AI bot performing the work.

## 1. Fix the current website before adding visual polish

The current hero claims there is an interactive 3D neural-core model, but the visual region is effectively an empty panel. Replace that empty region with a real React Three Fiber scene. The scene must visibly render an AI bot and product UI on the first load. Do not leave a blank `<div>` or a canvas with no visible objects.

Audit and fix these current problems:

- The hero’s right side is too empty and does not visually explain the product.
- The “neural core” concept is abstract and does not help a customer understand the workflow.
- The page jumps quickly from a marketing headline into dense operational panels.
- The page has many technical labels, but not enough visual explanation of the outcome for a business owner.
- Several sections repeat the same dashboard/card language. Create different compositions for different jobs.
- The first visual should show a bot receiving a lead, thinking through a workflow, asking for approval, and sending a direct message—not just telemetry.
- Preserve the useful interactive demos, but visually simplify them and make the user outcome obvious before exposing implementation details.

## 2. Product positioning and message hierarchy

Use this product promise as the page’s core message:

> Qwenton gives your business AI coworkers that capture leads, research opportunities, and prepare actions for human approval before anything external is sent.

Use a more direct hero headline such as:

> AI coworkers that turn attention into approved action.

Use supporting copy that explains the three outcomes:

> Capture qualified Instagram leads, turn comments into helpful DMs, and run growth research without handing control to a black box.

Primary CTA:

> Deploy 2 free agents

Secondary CTA:

> Watch the workflow

Trust row:

- Human approval before external actions
- No Docker setup
- Works with your existing workflow

Do not use vague copy such as “Autonomous neural core,” “revolutionary AI,” or “the future of work” without explaining the customer outcome.

## 3. Visual art direction: premium product theatre, not sci-fi decoration

Use a bright editorial product stage with a deep graphite product module. The visual language should feel like a serious product demonstration with a slightly playful AI coworker.

Use this palette:

- Canvas: warm paper `oklch(97% 0.012 90)`
- Main ink: deep graphite `oklch(21% 0.025 255)`
- Product surface: softened graphite `oklch(27% 0.03 255)`
- Muted ink: `oklch(50% 0.025 255)`
- Primary mint action: `oklch(76% 0.16 165)`
- Human approval coral: `oklch(65% 0.17 28)`
- Quiet border: `color-mix(in oklch, var(--ink) 16%, var(--canvas))`

Use mint as the primary action/status colour. Use coral only for the human approval gate or an important exception. Do not use both as decorative accents everywhere. Do not use gradients. Do not use glowing outlines as a substitute for hierarchy.

Use typography that feels precise but not sterile:

- Display: `Sora` or `Space Grotesk`, weight 650–750.
- Body and controls: `DM Sans` or `Plus Jakarta Sans`, weight 400–600.
- System labels: `IBM Plex Mono`, weight 500.

Use these responsive type values:

```css
--hero: clamp(3.2rem, 5.3vw, 6.4rem);
--section-title: clamp(2.2rem, 3.6vw, 4.2rem);
--body: clamp(1rem, 0.95rem + 0.22vw, 1.18rem);
--label: clamp(0.7rem, 0.68rem + 0.12vw, 0.82rem);
```

Hero heading requirements:

- Maximum 3–4 lines on desktop.
- Maximum 12 words per line.
- `line-height: 0.96`.
- `letter-spacing: -0.045em`.
- The headline should occupy approximately 45–55% of the hero width.
- Never place the full hero headline inside a tiny card.

## 4. Hero layout

Create a 12-column desktop hero with a maximum width of 1320px:

- Left: 5 columns for eyebrow, headline, supporting copy, CTA row, and trust row.
- Right: 7 columns for the 3D product theatre.
- Hero height: approximately 760–900px on desktop, but content must remain visible without awkward empty space.
- The 3D theatre must be at least 540px tall on desktop and 360px tall on mobile.
- On mobile, stack the copy above the 3D scene. Do not hide the visual.

The top navigation should have:

- Qwenton brand mark and “Agents” descriptor.
- Links: Product, How it works, Use cases, Pricing.
- Sign in link.
- One mint “Deploy free agents” button.
- A compact status chip showing “Human approval built in”.

Avoid ten tiny navigation labels. Keep the navigation readable and calm.

## 5. Required 3D AI-bot scene

Build a real scene with React Three Fiber and Drei. The hero visual must be a small, premium AI coworker in a believable product-workspace scene.

### Main bot

Create or load a friendly, minimal AI bot with:

- A compact rounded body or desktop robot form.
- A clear head/screen with two simple expressive eyes or a status display.
- Two short articulated arms or tool manipulators.
- One mint status light, not a glowing aura.
- A solid graphite, warm white, and mint material palette.
- Real depth from bevels, lighting, contact shadow, and camera perspective.

If no external model asset is available, construct the bot from primitives: rounded boxes, spheres, capsules, cylinders, and thin emissive-free material panels. A primitive-built bot is acceptable if it is composed clearly and has a recognisable face/body/arms.

### Product UI around the bot

Place three crisp UI cards in the same scene using DOM overlays or screen textures:

1. **Inbound comment card**
   - “@maya: Send me the growth guide”
   - Instagram/Reel context.
   - A small mint “keyword matched” label.

2. **Human approval card**
   - “Reply ready for review”
   - Buttons: “Approve” and “Edit”.
   - Use coral only for the approval checkpoint.

3. **Delivered DM card**
   - “Growth guide sent”
   - A small timestamp and “Human approved” label.

The cards should look like product UI, not random floating rectangles. They must be anchored to the scene with clear depth and spacing. Use `Html transform occlude` for crisp text where appropriate.

### Scroll-driven story

Use GSAP ScrollTrigger or Framer Motion with a clear four-stage narrative:

- **Stage 1 — Notice:** the bot is idle beside a Reel comment card. The camera starts at a calm three-quarter product view.
- **Stage 2 — Understand:** the bot turns toward the comment, the inbound card moves closer, and a small label says “Keyword matched”.
- **Stage 3 — Ask:** the bot places the prepared response beside the human approval card. The coral approval checkpoint becomes visible. Do not imply the bot sends anything without approval.
- **Stage 4 — Deliver:** after the approval state, the delivered DM card slides into position. The bot returns to an idle, ready state.

Scroll motion must be smooth, staged, and legible. Do not spin the whole scene continuously. Do not use a vortex, orbit, ring system, whirlpool, or camera tunnel. The camera should dolly, slightly rotate, and change focus between the bot and the UI cards.

### Interaction

- Hovering the bot causes a small head tilt or arm movement.
- Hovering a card highlights that card and reveals a short description.
- Clicking a card focuses the camera on that stage.
- Provide equivalent HTML buttons below or beside the canvas for keyboard and touch users.
- On mobile, use horizontal card steps or a tap-to-advance story instead of requiring precise 3D gestures.

## 6. 3D implementation and failure prevention

Use this implementation contract:

```tsx
<ErrorBoundary fallback={<BotProductFallback />}>
  <Suspense fallback={<BotSceneSkeleton />}>
    <Canvas
      camera={{ position: [0.2, 0.8, 6.2], fov: 36 }}
      dpr={[1, 1.75]}
      shadows
      fallback={<BotProductFallback />}
    >
      <color attach="background" args={[COLORS.stage]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 5]} intensity={2.1} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.6} color={COLORS.mint} />
      <BotProductStage />
    </Canvas>
  </Suspense>
</ErrorBoundary>
```

Mandatory checks:

- The Canvas parent has an explicit height and never collapses to zero.
- The scene contains visible meshes before external assets finish loading.
- The first render shows the bot, not an empty background.
- If WebGL fails, render a high-quality DOM fallback with the same bot illustration, cards, labels, and workflow stages.
- If a model fails to load, keep the primitive bot and continue the page.
- Use cached loaders and reused materials/geometries.
- Keep the initial scene lightweight and adapt DPR on weaker devices.
- Test the console for asset errors, WebGL errors, hydration warnings, and failed imports.

## 7. Landing-page section flow after the hero

### Section 1 — Product proof

Immediately after the hero, show the promise in action with a wide interactive “comment to approved DM” simulator. Make the simulator visually dominant and understandable in under five seconds.

Use a three-step horizontal flow:

`Comment arrives → Human approves → DM is delivered`

The active step should update the central UI panel. Do not expose every API detail yet.

### Section 2 — Why human approval matters

Use an asymmetric layout with one large approval panel and three short principles:

- The agent prepares the action.
- A human controls external dispatch.
- Every event is traceable.

Use coral only for the approval checkpoint. This section should visually explain trust rather than repeat the hero.

### Section 3 — Agent coworker roster

Show four distinct agents with different jobs, not generic feature cards:

- Reel Comment-to-DM Agent.
- Competitor Intelligence Agent.
- Away Mode Assistant.
- Research and Outreach Agent.

Use a vertical roster or interactive selector. Selecting an agent updates the main product panel and the mini bot animation. Do not use a plain three-card row.

### Section 4 — Growth audit sandbox

Keep the existing business/city/industry sandbox, but simplify the form and make the result visual. Show a sample audit output with:

- Competitor gap.
- Content opportunity.
- Suggested first action.
- Confidence or evidence label.

Do not promise fake exact results. Use sample data labels when the result is simulated.

### Section 5 — Execution pipeline

Keep the existing 3-stage pipeline, but give every stage a distinct visual treatment:

1. Ingest: event stream and verified webhook badge.
2. Decide: triage panel with human approval gate.
3. Deliver: DM card and delivery receipt.

Use scroll-linked highlighting so only the current stage is visually dominant. Avoid three identical boxes across the page.

### Section 6 — Pricing and FAQ

Keep pricing scannable. Highlight the recommended plan without making every plan look identical. Show what is included, who the plan is for, and the next step. Keep technical limitations and human approval clearly stated.

Use an FAQ accordion with readable answer text, keyboard support, and visible focus states.

### Closing section

Use a compact closing CTA with the bot in a calm “ready” pose and the message:

> Put your first AI coworker to work.

Buttons:

- Deploy free agents.
- See how approval works.

## 8. Component and visual rules

- Use real UI labels and meaningful sample data.
- Use one dominant visual per section.
- Use 1px borders, moderate radius, and restrained shadows to establish surfaces.
- Avoid every section becoming a rounded card inside another rounded card.
- Keep a clear spacing rhythm: 8, 12, 16, 24, 32, 48, 64, 96, 128px.
- Use a maximum content width of 1320px.
- Keep body paragraphs between 45 and 68 characters per line where possible.
- Use real icons from Lucide or another consistent icon system. Do not use random emoji.
- Do not use gradients, glowing neon boxes, rainbow accents, decorative terminal windows, background dot grids, giant rotating spheres, or generic AI sparkles.
- Do not put technical code in the hero. Show the customer outcome first; reveal implementation detail lower on the page.

## 9. Accessibility and responsive requirements

- Normal text must meet at least 4.5:1 contrast; large text at least 3:1.
- Do not use colour alone for approval, error, selection, or status. Add labels and icons.
- Every 3D interaction has a DOM and keyboard alternative.
- Respect `prefers-reduced-motion: reduce`: freeze camera travel, remove auto movement, and show the complete four-stage workflow as static/tappable steps.
- Test at 1440px, 1024px, 768px, and 390px widths.
- Test at 200% zoom and with keyboard only.
- Do not hide the product visual on mobile. Simplify it to the bot plus one card and step controls.
- Do not allow horizontal overflow or clipped text.

## 10. Final QA gate

Before claiming completion, verify all of the following:

- The first viewport visibly contains a real AI bot, not an empty panel.
- The bot is recognisable and connected to the product workflow.
- The scroll animation has four understandable stages and no whirlpool/orbit gimmick.
- The human approval checkpoint is clearly visible before delivery.
- The hero has one clear primary action and one secondary action.
- The page has product proof, agent roster, audit sandbox, pipeline, pricing, FAQ, and footer.
- Each major section has a different visual composition.
- No 3D asset failure produces an empty region.
- No gradients, neon effects, generic space visuals, or decorative wireframe objects appear.
- The page works with reduced motion, keyboard input, WebGL disabled, slow loading, and mobile touch.
- The browser console has no uncaught errors, failed asset requests, hydration warnings, or missing-key warnings.
- Test the primary CTA and every simulator interaction. Do not leave buttons that only look clickable.

Return a short implementation summary listing the visual direction, font pair, scene architecture, scroll stages, fallback strategy, responsive changes, and QA results.

---

## What success should look like

The user should see a calm, premium landing page where a recognisable AI bot visibly handles a real lead workflow. The 3D scene should clarify the product: comment received, response prepared, human approves, DM delivered. The page should feel like a product people can trust, not a dashboard collage or a neon science-fiction demo.
