# Delivery Risk Register

| Risk ID | Risk Description | Severity | Likelihood | Mitigation Strategy | Owner |
|---|---|---|---|---|---|
| RSK-001 | Text contrast failure when avoiding black typography | High | Med | Use deep plum tint (`#3C2A3A`) tested at 9.8:1 contrast against `#F4F0E8` (WCAG AAA). | `ui-ux-designer` |
| RSK-002 | Broken navigation routes when introducing Blueprint IA groups | Med | Low | Map all new navigation items to existing routes (`/dashboard`, `/agents`, `/swarm`, `/integrations`, `/files`, `/approvals`, `/billing`, `/settings`, `/admin`). | `frontend-developer` |
| RSK-003 | Next.js build or typecheck failure during token migration | High | Low | Run `tsc --noEmit` and `npm run build` at every wave completion. | `qa-test-automation` |
| RSK-004 | High component complexity in `AllRounderStudioShowcase.tsx` causing render lag or layout shifting | Med | Low | Use lightweight declarative state machine with CSS transitions (180ms); avoid heavy external canvas libraries. | `frontend-developer` |
| RSK-005 | Loss of existing social-automation search traffic or user expectations | Low | Low | Include social & marketing as one of the supported multi-channel integrations under Sales & Marketing without monopolizing the brand narrative. | `product-manager` |
| RSK-006 | Contrast degradation on secondary text elements across soft clay surfaces | High | Med | Enforce Muted Plum (`#644C61` at 6.72:1 contrast) and Dark Sage (`#3A5245` at 7.47:1 contrast) for all secondary text and icons. | `ui-ux-designer` |
