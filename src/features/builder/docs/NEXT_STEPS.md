# OpsHub Platform — Production Roadmap & Integration Guidelines

All 6 primary parts of the OpsHub Visual Workflow Builder and operational site dashboards are fully implemented, verified, and integrated.

---

## Current Status: Production Candidate (v1.0.0)

- **Workflow Builder:** 100% Complete (Foundation, Canvas, Registry, Preview, Time Machine Simulation, Templates, Versioning & Publishing).
- **Operational Dashboards:** 100% Complete (Central Stores, Service Centre, Distribution consuming live published SOPs).
- **Security & RBAC:** 100% Complete (Admin, Operations Lead, and Operator roles with strict permission guards).
- **Quality Gates:** `npx oxlint` passes with 0 errors and 0 warnings; `npm run build` compiles in 1.4s with 0 errors.

---

## Future Roadmap & Production Backend Configuration

When transitioning OpsHub from client-side persistent storage (`localStorage`) to production multi-tenant backend infrastructure:

### 1. Backend REST API Provisioning
Deploy REST microservices adhering to the contracts specified in `src/features/builder/services/workflowService.js`:
- `GET  /api/v1/sites/:siteId/workflows/published` -> Retrieves active immutable published SOP.
- `POST /api/v1/sites/:siteId/workflows/draft` -> Saves in-progress editable draft for a facility.
- `POST /api/v1/sites/:siteId/workflows/publish` -> Validates, increments semver, and deploys live SOP.
- `POST /api/v1/sites/:siteId/workflows/rollback` -> Restores operational SOP to historical version.
- `GET  /api/v1/sites/:siteId/workflows/versions` -> Retrieves immutable version audit trail.

### 2. External ERP & Logistics Gateway Integrations
Connect live credentials in place of the current offline demonstration adapters:
- **Central Stores:** SAP S/4HANA or NetSuite inventory ERP connector for real-time stock sync.
- **Service Centre:** Automated oscilloscope/JTAG telemetry test-bench bridge.
- **Distribution:** FedEx Freight Web Services and DHL Express API OAuth keys for carrier EDI manifest generation.

### 3. Enterprise Identity Provider (SSO)
- Replace mock accounts in `authService.js` with OpenID Connect (OIDC) / SAML 2.0 integration (e.g. Okta, Azure Active Directory) mapping enterprise directory groups directly to `USER_ROLES`.
