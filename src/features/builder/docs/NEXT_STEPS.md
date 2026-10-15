# Next Steps — Part 6: Publish, Semantic Versioning & Integration Contract Generation

Detailed plan and acceptance criteria for the upcoming development milestone.

---

## Next Task Objective

Implement **Part 6: Publish, Semantic Versioning & Integration Contract Generation** within `src/features/builder/` to establish workflow serialization, client-side semantic versioning increments (Major.Minor.Patch), JSON export/import capabilities, and site contract event payloads for Central Stores, Service Centre, and Distribution.

---

## Scope of Work

1. **Workflow Serialization & Export/Import:**
   - Serialize graph nodes, edges, site metadata, and module parameter configs to standardized JSON schemas.
   - Support JSON export download and importing existing workflow definitions.

2. **Semantic Versioning Stamp:**
   - Increment semantic version strings (e.g., `v1.0.0` -> `v1.0.1` patch, `v1.1.0` minor) upon publishing.
   - Track published workflow manifests with author metadata, site target, and timestamp.

3. **Inter-Site Integration Contracts:**
   - Bind published triggers and actions to the facility contracts defined in ADR-004:
     - Central Stores: `STORES_STOCK_ARRIVAL`, `STORES_RESERVE_PARTS`, `STORES_DISPATCH_TO_SERVICE`.
     - Service Centre: `SERVICE_TICKET_CREATED`, `SERVICE_ASSIGN_TECH`, `SERVICE_REQUEST_PART`, `SERVICE_QA_SIGN_OFF`.
     - Distribution: `DIST_ORDER_QUEUED`, `DIST_PICK_PACK_VERIFY`, `DIST_CARRIER_DISPATCH`.

4. **Publish Modal & Read-Only Deployment Simulator:**
   - High-visibility Publish Confirmation dialog displaying pre-flight validation status, target facility, version increment, and emitted payload contract preview.
   - Visual deployment confirmation with toast notification.

---

## Acceptance Criteria

- [ ] **AC-1:** Operator can click Publish to trigger pre-flight validation and view the version increment summary.
- [ ] **AC-2:** Workflow serialization produces valid JSON matching ADR-004 data contract schemas.
- [ ] **AC-3:** Export/import allows downloading and reloading workflow configurations safely.
- [ ] **AC-4:** Clean build via `npm run build` and zero warnings from `oxlint`.
- [ ] **AC-5:** Full Light and Dark theme consistency with zero regression in Parts 1–5.

---

## Non-Goals for Part 6

- Do not modify teammate dashboards outside `src/features/builder/`.
- Do not construct live backend databases without an established API contract.

