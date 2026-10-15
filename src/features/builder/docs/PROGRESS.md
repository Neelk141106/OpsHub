# Visual Workflow Builder — Development Progress Tracker

Tracking the 6-part roadmap for the Visual Workflow Builder within OpsHub.

---

## Progress Summary

| Part | Milestone Name | Status | Target Completion | Blockers / Dependencies |
|---|---|---|---|---|
| **Part 1** | Builder UI Foundation | 🟢 Completed | Sprint 1 | None (Connected to App) |
| **Part 2** | Drag-and-Drop Canvas & Connections | 🔴 Not Started | Sprint 1 | Ready to begin |
| **Part 3** | Module Registry & Settings | 🔴 Not Started | Sprint 2 | Depends on Part 2 & Site contracts |
| **Part 4** | Validation & Preview | 🔴 Not Started | Sprint 2 | Depends on Part 2, Part 3 |
| **Part 5** | OpsHub Time Machine Simulation | 🔴 Not Started | Sprint 3 | Depends on Part 3, Part 4 |
| **Part 6** | Publish, Versioning & Integration | 🔴 Not Started | Sprint 3 | Depends on Parts 1–5 |

*Status Legend:*
- 🔴 **Not Started** — Requirements defined; no implementation code in workspace.
- 🟡 **In Progress** — Active development underway.
- 🟢 **Completed** — Implemented, verified, and documented.
- ⚪ **Blocked** — Awaiting upstream dependency or design clarification.

---

## Detailed Milestone Breakdown

### Part 1: Builder UI Foundation
- **Objective:** Establish the visual frame and layout panels for the workflow builder.
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] Builder layout shell with header, sidebar, canvas area, and properties drawer.
  - [x] Top action bar: OpsHub branding, site selector, editable title, Undo, Redo, Zoom controls, Save draft, and Simulation mode toggle.
  - [x] Left sidebar container for searchable, categorized module palette with site tags and inputs/outputs badges.
  - [x] Right sidebar container for module settings inspector with contextual empty state and integration contract viewer.
  - [x] Bottom status bar showing readiness status, active site, and keyboard shortcut tips.
  - [x] Base Zustand store (`useWorkflowStore`) initialized with isolated per-site drafts, zoom, and undo/redo history.

---

### Part 2: Drag-and-Drop Canvas & Connections
- **Objective:** Implement the interactive node graph canvas using `@xyflow/react`.
- **Status:** 🔴 Not Started
- **Key Deliverables:**
  - [ ] Interactive canvas wrapping `@xyflow/react` with background grid, minimap, and controls.
  - [ ] Drag-and-drop mechanism transferring palette items onto the canvas coordinates.
  - [ ] Custom node shell with status badges, site identification color coding, and input/output handles.
  - [ ] Connection edge validator: prevent duplicate edges, self-connections, and invalid type connections.
  - [ ] Inter-site connection edge styling (dashed animations representing site transit/handoffs).
  - [ ] Canvas keyboard shortcuts (Delete, Duplicate, Escape, Ctrl+Z / Ctrl+Y).

---

### Part 3: Module Registry & Settings
- **Objective:** Populate operational domain modules and provide dynamic parameter configuration.
- **Status:** 🔴 Not Started
- **Key Deliverables:**
  - [ ] **Central Stores Modules:**
    - `StoresTrigger`: Stock Arrival, Min Reorder Threshold.
    - `StoresAction`: Reserve Parts, Allocate Bin, Quarantine Batch.
  - [ ] **Service Centre Modules:**
    - `ServiceTrigger`: Repair Intake, Defect Escalation.
    - `ServiceAction`: Assign Technician, Diagnostics Run, Parts Request, QA Gate.
  - [ ] **Distribution Modules:**
    - `DistributionTrigger`: Order Queued, Dispatch Window.
    - `DistributionAction`: Pick/Pack Verification, Carrier Manifest, Transit Handoff.
  - [ ] **Flow Control Modules:**
    - `ConditionNode`: Branching logic based on item status or inventory level.
    - `ApprovalGate`: Manual supervisor sign-off gate.
    - `SiteTransitNode`: Cross-facility transit delay and custody tracking.
  - [ ] Context-sensitive configuration panel: dynamically renders input fields based on selected node type.

---

### Part 4: Validation & Preview
- **Objective:** Ensure graph integrity and offer a read-only preview before deployment.
- **Status:** 🔴 Not Started
- **Key Deliverables:**
  - [ ] Graph topology validator:
    - [ ] Root trigger existence check (at least one valid trigger node).
    - [ ] Disconnected/orphan node detection.
    - [ ] Cyclic loop detection (unless explicitly configured as retry loop).
    - [ ] Missing required configuration parameters highlight.
  - [ ] Visual error badges rendered directly on invalid nodes and handles.
  - [ ] Read-only preview mode showing linear execution path.

---

### Part 5: OpsHub Time Machine Simulation
- **Objective:** Deterministic event simulation and timeline scrubbing across operational sites.
- **Status:** 🔴 Not Started
- **Key Deliverables:**
  - [ ] Deterministic simulation engine: traverses nodes event-by-event with synthetic mock items.
  - [ ] Time Machine control bar: Play, Pause, Step Forward, Step Back, Speed (1x, 2x, 5x, 10x).
  - [ ] Visual execution highlighting: active node pulse animation, glowing edges for active transits.
  - [ ] What-If parameter overrides:
    - Technician capacity multiplier (Service Centre).
    - Stock delivery latency adjustment (Central Stores).
    - Freight carrier delay injection (Distribution).
  - [ ] Real-time queue metrics and bottleneck indicator overlay.

---

### Part 6: Publish, Versioning & Integration
- **Objective:** Finalize, version-tag, and export operational workflows for site orchestration.
- **Status:** 🔴 Not Started
- **Key Deliverables:**
  - [ ] Workflow JSON export/import conforming to standard OpsHub workflow schema.
  - [ ] Semantic versioning generator (e.g., `v1.0.0`, `v1.1.0`) with release notes.
  - [ ] Integration contract generator: output event triggers consumable by Central Stores, Service Centre, and Distribution.
  - [ ] Visual diff view readiness: structural graph comparisons for OpsHub Config Diff feature.
