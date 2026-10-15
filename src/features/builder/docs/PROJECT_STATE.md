# Visual Workflow Builder — Project State

Current actual implementation state as of **2026-10-15**.

---

## 1. Environment & Branch Context

- **Repository:** `OpsHub`
- **Active Git Branch:** `feature/workflow-builder`
- **Base Commit:** `45dd0be41d15b9b2ff9eaa838371897446ecd99a` (v0.1.0 initial setup)
- **Target Feature Directory:** `src/features/builder/` (aligned with `PROJECT_CONTEXT.md` and repository scaffolding)

---

## 2. Technology Stack & Available Dependencies

The project runtime and build tooling are installed and operational:

| Dependency | Version | Purpose in Workflow Builder |
|---|---|---|
| `react` & `react-dom` | `^19.2.8` | Core UI library |
| `vite` | `^8.3.0` | Development server and bundler |
| `@xyflow/react` | `^12.12.0` | Node graph canvas, connection handles, drag-and-drop |
| `zustand` | `^5.0.15` | Decoupled reactive store for canvas state and simulation |
| `lucide-react` | `^1.57.0` | Iconography for nodes, toolbar actions, and site badges |
| `recharts` | `^3.10.1` | Telemetry visualization (OpsHub Pulse / analytics) |
| `react-router-dom` | `^7.18.4` | Application routing |
| `tailwindcss` | `^3.4.19` | Utility styling with CSS variable support |
| `oxlint` | `^1.81.0` | Code quality and linting |

---

## 3. Actual Implementation Status

### Core Parts Overview

| Part | Description | Status | Evidence in Codebase |
|---|---|---|---|
| **Part 1** | Builder UI foundation | 🟢 **Completed** | `BuilderLayout.jsx`, `BuilderToolbar.jsx`, `ModulePalette.jsx`, `WorkflowCanvas.jsx`, `InspectorPanel.jsx`, `useWorkflowStore.js` rendered via `src/App.jsx`. |
| **Part 2** | Drag-and-drop canvas and connections | 🟢 **Completed** | Full `@xyflow/react` interactive canvas, visible connection handles and animated edges, HTML5 drag-and-drop & quick-add, node/edge deletion, zoom/fit-view controls via `useReactFlow`, Light/Dark theme toggle, exactly 13 approved core modules + 20 operational steps, and isolated per-site state. |
| **Part 3** | Module registry and settings | 🟢 **Completed** | Dynamic form generation in `InspectorPanel.jsx` based on module settings schemas, bidirectional parameter mutation via `useWorkflowStore.updateNodeConfig`, inline validation feedback, and full `validateWorkflow.js` topology/settings validation engine with clickable issue navigation. |
| **Part 4** | Workflow Preview | 🟢 **Completed** | Dedicated Preview Mode toggled via `BuilderToolbar.jsx`, multi-layer read-only mutation guards in `useWorkflowStore.js`, read-only node inspection & configured settings view in `InspectorPanel.jsx`, validation health indicators (errors, warnings, valid), click-to-focus canvas navigation via `useReactFlow().setCenter()`, and strict site draft isolation across Central Stores, Service Centre, and Distribution. |
| **Part 5** | OpsHub Time Machine simulation | 🟢 **Completed** | Full deterministic step-by-step traversal engine in `useWorkflowStore.js`, pre-flight validation integration via `validateWorkflow.js`, interactive Canvas Control Deck, active/visited node highlighting (amber pulse / emerald checkmark), illuminated animated traversed edges, read-only parameter inspection in `InspectorPanel.jsx`, execution timeline log, and interactive user branch selector for undefined branching. |
| **Part 6** | Publish, versioning and integration | 🔴 **Not Started** | Workflow serialization, semantic versioning stamp, JSON export/import, and integration contracts for Central Stores, Service Centre, and Distribution scheduled for Part 6. |

---

## 4. Current Workspace Files Status

- `src/features/builder/` — Feature active:
  - `components/BuilderLayout.jsx` — Master layout with Light/Dark theme and status bar.
  - `components/BuilderToolbar.jsx` — Toolbar with Preview toggle, site switcher, zoom/fit-view, and action buttons.
  - `components/ModulePalette.jsx` — 13 Core Modules + 20 Operational Steps with drag-and-drop, quick-add, and preview-mode locking banner.
  - `components/WorkflowCanvas.jsx` — `@xyflow/react` canvas with smoothstep routing, grid, minimap, preview banner, and read-only props.
  - `components/InspectorPanel.jsx` — Node settings form, read-only preview inspection, live validation health badges, and clickable issue navigation.
  - `nodes/WorkflowNode.jsx` — Custom node with typed handles, theme adaptation, validation badges, and read-only preview handles.
  - `store/useWorkflowStore.js` — Zustand store with `isPreviewMode` state, multi-layer mutation guards, isolated drafts per facility, history, and theme state.
  - `registry/siteModules.js` — All 33 approved modules with typed settings schemas.
  - `validation/validateWorkflow.js` — Graph topology and settings validation engine.
  - `docs/` — Tracking documentation suite.
- `src/App.jsx` — Mounts `<BuilderLayout />` as main application entry point.
- `src/index.css` — Configured with Tailwind base directives and clean system font defaults.

---

## 5. Items Pending Verification

1. **Routing Integration (`src/app`):** Pending verification whether the Builder will be mounted at route `/builder` or rendered as the root view in `src/App.jsx`.
2. **Persistence Layer:** Pending verification whether workflow graphs should persist to `localStorage` or memory-only mock stores during client-side development (scheduled for Part 6).
3. **Site Data Contracts:** Schema models for Central Stores, Service Centre, and Distribution are conceptual in `PROJECT_CONTEXT.md` and need formal TypeScript/JSDoc type contracts in `src/data/` or `src/features/builder/types.js` (scheduled for Part 6).
4. **Time Machine Verification:** Part 5 step-by-step traversal, branch resolution, visual simulation, and pre-flight validation blocking verified. Inbound connection requirement for gateways (`Supervisor Approval Gate`) confirmed as genuine enterprise workflow validation rule (not an ID matching bug); actionable resolution guidance provided in Simulation Inspector.
