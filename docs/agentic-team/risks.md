# Delivery Risk Register

| Risk ID | Risk Description | Severity | Likelihood | Mitigation Strategy | Owner |
|---|---|---|---|---|---|
| RSK-001 | Text contrast failure when avoiding black typography | High | Med | Use deep plum tint (`#3C2A3A`) tested at 9.8:1 contrast against `#F4F0E8` (WCAG AAA). | `ui-ux-designer` |
| RSK-002 | Broken navigation routes when introducing Blueprint IA groups | Med | Low | Map all new navigation items to existing routes (`/dashboard`, `/agents`, `/swarm`, `/integrations`, `/files`, `/approvals`, `/billing`, `/settings`, `/admin`). | `frontend-developer` |
| RSK-003 | Next.js build or typecheck failure during token migration | High | Low | Run `tsc --noEmit` and `npm run build` at every wave completion. | `qa-test-automation` |
