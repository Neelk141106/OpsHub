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

### 4. Cross-Facility Transit Connector (`SiteTransitNode`)
- **Node Type:** `siteTransit`
- **Contract:** `{ originSite: SiteId, targetSite: SiteId, transitDurationMin: number, custodyTransferSignoff: boolean }`
- **Status:** Accepted.

---

## ADR-005: Time Machine Simulation Architecture

- **Context:** OpsHub requires historical playback and predictive "What-If" modeling without interfering with live workflow configurations.
- **Decision:** Model the Time Machine as an isolated deterministic event queue executed by a discrete Zustand slice (`useSimulationStore`).
- **Rationale:**
  - Avoids mutating active workflow designer nodes during playback.
  - Enables instant forward/backward timeline scrubbing by keeping an array of simulation snapshots.
  - Allows applying "What-If" parameter multipliers (e.g., 20% technician shortage, freight delay) without modifying the published workflow configuration.
- **Status:** Accepted.

---

## ADR-006: Client-Side Graph Validation Strategy

- **Context:** Operators must receive real-time visual feedback if a workflow graph is incomplete or structurally flawed before publishing.
- **Decision:** Execute client-side graph analysis rules in `src/features/builder/validation/validateWorkflow.js` upon node/edge change events.
- **Validation Rules:**
  1. **Trigger Presence:** At least one Trigger node must exist with no incoming edges.
  2. **Connectivity:** No orphan nodes allowed (every node must be reachable from a trigger).
  3. **Terminal Path:** All execution branches must terminate at a recognized Action or Completion node.
  4. **Contract Matching:** Source handle output types must match target handle input types.
  5. **Cycle Detection:** Cycles are flagged as errors unless explicitly flagged as a configured `RetryLoopNode`.
- **Status:** Accepted.

---

## ADR-007: Multi-Layer Read-Only Enforcement for Preview Mode

- **Context:** Part 4 requires previewing the current site's workflow in a clean read-only mode, strictly preventing accidental movement, deletion, connection changes, or configuration edits while previewing.
- **Decision:** Implement a three-layer defense-in-depth architecture:
  1. **State Store Layer (`useWorkflowStore.js`):** All mutating actions (`addNode`, `deleteNode`, `deleteEdge`, `updateNodeConfig`, `updateNodeLabel`, `clearGraph`, `undo`, `redo`, `setWorkflowName`) immediately no-op if `isPreviewMode` is active. `onNodesChange` and `onEdgesChange` filter changes to allow only selection/dimension updates, strictly discarding position mutations and deletions.
  2. **Canvas Engine Layer (`WorkflowCanvas.jsx` & `WorkflowNode.jsx`):** `<ReactFlow>` is configured with `nodesDraggable={!isPreviewMode}`, `nodesConnectable={!isPreviewMode}`, and `deleteKeyCode={isPreviewMode ? null : ['Backspace', 'Delete']}`. Handles set `isConnectable={!isPreviewMode}` with non-interactive styling, and node delete buttons are omitted.
  3. **UI Component Layer (`InspectorPanel.jsx`, `ModulePalette.jsx`, `BuilderToolbar.jsx`):** Form controls render as formatted read-only displays instead of editable `<input>` controls. Module cards disable HTML5 drag and disable `+` quick-add buttons. Toolbar editing controls (Undo, Redo, Clear, Rename, Save, Publish) are visibly disabled with descriptive tooltips.
- **Rationale:** Guarantees that even if browser events or keyboard shortcuts fire, neither state nor layout can be inadvertently altered.
- **Status:** Accepted.

---

## ADR-008: Time Machine Step-by-Step Simulation & Interactive Branch Selection

- **Context:** Part 5 requires a deterministic step-by-step workflow simulation for the active site's nodes and connections, highlighting visited and active nodes, handling completed, empty, invalid, and blocked workflows, and resolving undefined branches without inventing business logic.
- **Decision:**
  1. **Direct Graph Traversal Engine:** Traversal starts at the entry trigger node (`incomingEdges.length === 0`). Step progression finds target nodes linked by active outgoing edges. Reachable node counts are dynamically calculated using breadth-first traversal from the entry node.
  2. **Strict Validation Pre-Flight:** Starting simulation invokes `validateWorkflow()`. Workflows with validation errors transition directly to `status: 'invalid'` with detailed error messages. Empty workflows transition to `status: 'empty'`.
  3. **Interactive Branch Selection for Undefined Rules:** When an active node has more than one outgoing edge and branching criteria are not configured, the engine transitions to `status: 'branching'` and prompts the user with distinct buttons corresponding to each valid outgoing edge. The user's explicit selection determines which branch is traversed via `chooseBranch(targetNodeId)`.
  4. **Dynamic Visual Pipeline:** Visited nodes receive emerald styling and completed step indices. The current active node pulses with an amber glow and an active step pill. Traversed edges are illuminated in amber with animated dash offsets, while untraversed edges are dimmed.
  5. **Simulation Inspector & Execution Log:** A dedicated simulation panel renders step metrics, node parameters, and a chronological execution log where clicking any entry navigates the canvas to focus on that node.
  6. **Inbound Connection Validation Integrity:** Operational modules with `inputs: 1` (such as `Supervisor Approval Gate` and action steps) strictly require an inbound connection from an upstream trigger or module. Pre-flight validation enforces that approval gates cannot act as autonomous entry triggers. Errors are preserved and presented with clear resolution guidance rather than silently weakening validation or auto-connecting nodes.
- **Status:** Accepted.

