# Architecture & Integration Decisions (ADRs)

Key architectural decisions governing the development of the OpsHub Visual Workflow Builder.

---

## ADR-001: Feature Directory Structure & Docs Placement

- **Context:** The task suggested evaluating `src/features/workflow-builder/docs/` while avoiding duplicate files and respecting existing architecture.
- **Decision:** Place the tracking documentation and subsequent feature code inside `src/features/builder/docs/`.
- **Rationale:**
  - `PROJECT_CONTEXT.md` explicitly lists `src/features/builder/` as the canonical location for the Workflow Canvas (`@xyflow/react` nodes & edges).
  - The repository was initialized with `src/features/builder/.gitkeep`.
  - Creating `src/features/workflow-builder/` would introduce divergent, redundant feature directories and violate established project conventions.
- **Status:** Accepted.

---

## ADR-002: Canvas Framework Selection (`@xyflow/react`)

- **Context:** The Visual Workflow Builder requires a resilient node graph layout supporting custom node views, custom edge connections, minimap navigation, and zoom/pan functionality.
- **Decision:** Adopt `@xyflow/react` (v12.x) as the sole canvas rendering engine.
- **Rationale:**
  - Already installed in `package.json` (`@xyflow/react@^12.12.0`).
  - Native React 19 compatibility.
  - Built-in support for custom node types, typed handles, background grid variants, and SVG-based edge customization.
- **Status:** Accepted.

---

## ADR-003: State Management via Zustand Store Slice

- **Context:** Node canvas interactions (node dragging, connecting edges, parameter updates, simulation scrubbing) generate high-frequency state updates. Storing canvas graph state in React local component state causes unnecessary re-renders across panels.
- **Decision:** Implement a dedicated Zustand store (`useWorkflowStore`) in `src/features/builder/store/useWorkflowStore.js` with decoupled selectors.
- **Rationale:**
  - `zustand` is already installed (`zustand@^5.0.15`).
  - Supports transient updates and outside-of-React dispatching, essential for Time Machine simulation ticks.
  - Allows clean separation between canvas UI state (zoom, selection) and domain graph topology (nodes, edges, node configs).
- **Status:** Accepted.

---

## ADR-004: Inter-Site Operational Integration Contracts

- **Context:** OpsHub connects three operational sites: Central Stores, Service Centre, and Distribution. The Workflow Builder must visually represent cross-facility handoffs and emit valid integration payloads.
- **Decision:** Standardize node payloads with site identifiers, typed trigger/action contracts, and inter-site transit connectors.
- **Contracts Schema:**

### 1. Central Stores Contract
- **Site Identifier:** `central-stores`
- **Primary Triggers:**
  - `STORES_STOCK_ARRIVAL`: Payload `{ sku: string, batchId: string, quantity: number, bay: string, timestamp: string }`
  - `STORES_THRESHOLD_ALERT`: Payload `{ sku: string, currentLevel: number, minThreshold: number }`
- **Primary Actions:**
  - `STORES_RESERVE_PARTS`: Input `{ requisitionId: string, sku: string, quantity: number }` -> Output `{ reservationId: string, status: "RESERVED" | "BACKORDERED" }`
  - `STORES_DISPATCH_TO_SERVICE`: Input `{ reservationId: string, destinationTicket: string }` -> Output `{ transitId: string, dispatchedAt: string }`

### 2. Service Centre Contract
- **Site Identifier:** `service-centre`
- **Primary Triggers:**
  - `SERVICE_TICKET_CREATED`: Payload `{ ticketId: string, serialNumber: string, defectCategory: string, priority: "LOW" | "NORMAL" | "CRITICAL" }`
  - `SERVICE_QA_FAILED`: Payload `{ ticketId: string, failedGate: string, reason: string }`
- **Primary Actions:**
  - `SERVICE_ASSIGN_TECH`: Input `{ ticketId: string, skillRequired: string }` -> Output `{ technicianId: string, estimatedHours: number }`
  - `SERVICE_REQUEST_PART`: Input `{ ticketId: string, partSku: string }` -> Triggers `STORES_RESERVE_PARTS` contract.
  - `SERVICE_QA_SIGN_OFF`: Input `{ ticketId: string, inspectorToken: string }` -> Output `{ pass: boolean, certifiedDate: string }`

### 3. Distribution Contract
- **Site Identifier:** `distribution`
- **Primary Triggers:**
  - `DIST_ORDER_QUEUED`: Payload `{ orderId: string, destinationDepot: string, units: Array<{ serialNumber: string }> }`
- **Primary Actions:**
  - `DIST_PICK_PACK_VERIFY`: Input `{ orderId: string }` -> Output `{ packageWeightKg: number, manifestBarcode: string }`
  - `DIST_CARRIER_DISPATCH`: Input `{ orderId: string, carrierCode: string }` -> Output `{ waybillNumber: string, trackingUrl: string, etd: string }`

---

## ADR-007: Multi-Layer Read-Only Enforcement for Preview Mode

- **Context:** Part 4 requires previewing the current site's workflow in a clean read-only mode, strictly preventing accidental movement, deletion, connection changes, or configuration edits while previewing.
- **Decision:** Implement a three-layer defense-in-depth architecture:
  1. **State Store Layer (`useWorkflowStore.js`):** All mutating actions no-op if `isPreviewMode` is active.
  2. **Canvas Engine Layer (`WorkflowCanvas.jsx` & `WorkflowNode.jsx`):** `<ReactFlow>` sets `nodesDraggable={!isPreviewMode}`, `nodesConnectable={!isPreviewMode}`, and deletion hotkeys disabled.
  3. **UI Component Layer (`InspectorPanel.jsx`, `ModulePalette.jsx`, `BuilderToolbar.jsx`):** Form controls render read-only displays.
- **Status:** Accepted.

---

## ADR-008: Time Machine Simulation Engine & Immutability Guarantee

- **Context:** Part 5 requires a deterministic step-by-step workflow simulation for the active site's nodes and connections, highlighting visited and active nodes without modifying the user's editable draft or production operational records.
- **Decision:**
  1. Model simulation as a read-only overlay state machine in `useWorkflowStore.js`.
  2. Traversal steps calculate dynamic active and visited paths without mutating placed nodes, edges, or parameter settings.
  3. Execution logs explicitly display a virtual dry-run disclaimer: "Virtual Dry Run Simulation only. Zero real-world inventory, assignment, repair, or approval operations occurred."
- **Status:** Accepted.

---

## ADR-009: Predefined Starting Templates with Customization

- **Context:** Users need out-of-the-box standard operating procedures for Central Stores, Service Centre, and Distribution, but must retain the ability to customize them on the canvas or start from scratch.
- **Decision:**
  - Provide tested starting templates in `src/features/builder/templates/workflowTemplates.js`.
  - Templates adhere 100% to graph validation rules with 0 errors and 0 warnings.
  - Loading a template creates an independent, fully editable draft for the active site without mutating other sites or overwriting published configurations.
- **Status:** Accepted.

---

## ADR-010: Client Persistence, SemVer Publishing & Rollback

- **Context:** OpsHub currently runs frontend-first (Vite + React 19). The system requires persistent drafts, versioned immutable published SOPs, and safe rollback without falsely claiming an external backend is running.
- **Decision:**
  - Implement `WorkflowService.js` using browser persistent storage (`localStorage`) with explicit simulated asynchronous latency.
  - Provide documented REST contracts (`/api/v1/sites/:siteId/workflows/...`) for future production backend deployment.
  - Enforce semantic versioning increments (`patch`, `minor`, `major`) and mandatory audit release notes.
  - Implement historical version tracking and one-click safe rollback.
- **Status:** Accepted.

---

## ADR-011: Role-Based Access Control (RBAC) Architecture

- **Context:** Workflow creation, editing, publishing, and rollback must be restricted to authorized Administrators/Workflow Configurators, while operational staff should only execute against published SOPs.
- **Decision:**
  - Implement `authService.js` defining `ADMIN`, `OPERATIONS_LEAD`, and `OPERATOR` roles with demo accounts for testing.
  - Enforce permission guards (`Permissions.canEditWorkflow`, `canPublishWorkflow`, `canRollbackWorkflow`, `canApproveOperations`) at both UI and store action levels.
  - Provide an interactive user role switcher in the global header for immediate evaluation.
- **Status:** Accepted.

---

## ADR-012: Operational Dashboard Consumption of Live Published SOPs

- **Context:** The operational sites (Central Stores, Service Centre, Distribution) must consume the active published SOP for their facility, ensuring site isolation and real operational workflow execution.
- **Decision:**
  - Build dedicated dashboards in `src/features/central-stores/`, `src/features/service-centre/`, and `src/features/distribution/`.
  - Dashboards subscribe to `publishedWorkflows[siteId]`, rendering the published process sequence.
  - Operational actions (approvals, stock allocation, triage, PCB soldering rework, carrier dispatch) enforce business rules and RBAC authorization without fake backend outcomes.
- **Status:** Accepted.

---

## ADR-013: Light Mode Primary Experience, Disambiguated Navigation & 8-Part Ordered Inspector

- **Context:** User testing identified cognitive overload in the Builder: dark mode by default was visually heavy for non-technical operations staff; global top-bar navigation vs. Builder site selection caused navigation confusion; module counts showed discrepancies; and the Inspector presented internal technical IDs before plain-English operational purposes.
- **Decision:**
  - **Light Mode Primary:** Configure light theme as the universal application default, maintaining an optional dark mode toggle with high text contrast.
  - **Disambiguated Site Selector:** Top navigation exclusively switches application workspaces (Builder vs. 3 Site Dashboards). The Builder selector is explicitly labeled `"Editing workflow for: [Facility]"` and isolates facility draft editing without navigating away.
  - **Dynamic Module Counts:** Replace hardcoded counts with dynamically evaluated tallies (13 Core + 26 Ops = 39 Total).
  - **Section 4 Welcoming Screen:** Render side-by-side Option A (Template - recommended for beginners) and Option B (Build from scratch with 1-click trigger add and blank canvas options).
  - **Section 5 Guided Process & HUD Help:** Implement a floating 5-step guided process drawer and persistent `(?) Help & Guide` button in the canvas HUD.
  - **8-Part Ordered Inspector:** Restructure node selection strictly into: 1. Node name/icon, 2. What this step does, 3. When to use it, 4. Example, 5. Required configuration (with `*`), 6. Optional configuration, 7. Connections, 8. Advanced settings (collapsible accordion with IDs and raw JSON).
- **Status:** Accepted.
