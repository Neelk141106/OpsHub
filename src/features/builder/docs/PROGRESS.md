# Visual Workflow Builder — Development Progress Tracker

Tracking the 6-part roadmap for the Visual Workflow Builder within OpsHub.

---

## Progress Summary

| Part | Milestone Name | Status | Target Completion | Blockers / Dependencies |
|---|---|---|---|---|
| **Part 1** | Builder UI Foundation | 🟢 Completed | Sprint 1 | None (Connected to App) |
| **Part 2** | Drag-and-Drop Canvas & Connections | 🟢 Completed | Sprint 1 | None (Interactive Canvas Live) |
| **Part 3** | Module Registry & Settings | 🟢 Completed | Sprint 2 | None (Settings & Validation Live) |
| **Part 4** | Workflow Preview | 🟢 Completed | Sprint 2 | Ready for Part 5 |
| **Part 5** | OpsHub Time Machine Simulation | 🔴 Not Started | Sprint 3 | Depends on Parts 1–4 |
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
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] Interactive canvas wrapping `@xyflow/react` with background grid, minimap, and controls.
  - [x] Visible connection handles with crosshair cursor and animated smoothstep edges.
  - [x] Drag-and-drop mechanism transferring palette items onto canvas coordinates (`screenToFlowPosition`) plus `+` quick-add button.
  - [x] Palette scope corrected: Exactly 13 approved core modules + 20 operational steps, clearly distinguished.
  - [x] Custom node shell (`WorkflowNode.jsx`) with category badges, site identification, icons, and typed handles.
  - [x] Working Light / Dark theme toggle applied across all Builder panels and nodes.
  - [x] Zoom In, Zoom Out, and Fit View controls directly bound via `useReactFlow()`.
  - [x] Edge connection validator: prevents duplicate edges and self-connections.
  - [x] Node and edge deletion via keyboard (`Delete`, `Backspace`) or UI action buttons.
  - [x] Completely isolated drafts across Central Stores, Service Centre, and Distribution.

---

### Part 3: Module Registry & Settings
- **Objective:** Populate operational domain modules and provide dynamic parameter configuration and validation.
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] Form schemas defined for all 13 Core Modules and 20 Operational Modules with typed settings.
  - [x] Context-sensitive settings form in `InspectorPanel.jsx` rendering text, number, select, and boolean controls.
  - [x] Real-time state mutation through `useWorkflowStore.updateNodeConfig`.
  - [x] Built-in validation engine (`validateWorkflow.js`) evaluating missing required fields, number boundaries, and orphan/unconnected nodes.
  - [x] Inline field-level error messages and canvas node warning badges.
  - [x] Comprehensive Workflow Validation Summary with clickable links to focus affected nodes.

---

### Part 4: Workflow Preview
- **Objective:** Provide a dedicated read-only preview mode for the active site's workflow with graph inspection, validation navigation, and strict mutation locking.
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] High-visibility Preview button in `BuilderToolbar.jsx` with direct toggling between Edit and Preview modes.
  - [x] Dedicated "Exit Preview / Return to Editor" actions in both the toolbar, canvas banner, and palette overlay.
  - [x] Read-only canvas: `nodesDraggable={false}`, `nodesConnectable={false}`, and deletion keycodes disabled during preview.
  - [x] Multi-layer defense in `useWorkflowStore.js`: `addNode`, `deleteNode`, `deleteEdge`, `updateNodeConfig`, `updateNodeLabel`, `clearGraph`, `undo`, `redo`, and `setWorkflowName` strictly guarded against mutation in preview mode.
  - [x] Read-only parameter inspection in `InspectorPanel.jsx` showing configured values, required flags, and type badges.
  - [x] Node validation health cards in Inspector distinguishing errors, warnings, and valid status.
  - [x] Full Workflow Validation Summary showing total errors/warnings, actionable issue descriptions, and click-to-focus navigation that centers on affected nodes via `useReactFlow().setCenter()`.
  - [x] Strict site isolation: preview operates strictly on the active site draft (`central-stores`, `service-centre`, `distribution`), and exiting preview returns to the same draft with all edits intact.
  - [x] Polished Light and Dark theme styling with zero layout shift or unnecessary panels.

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
