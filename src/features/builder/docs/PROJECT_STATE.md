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
| **Part 4** | Validation and preview | **Not Started** | Validation engine initialized in Part 3; dry-run path simulator, linear execution preview, and comprehensive schema gates scheduled for Part 4. |
| **Part 5** | OpsHub Time Machine simulation | **Not Started** | No deterministic state machine or simulation runner implemented. |
| **Part 6** | Publish, versioning and integration | **Not Started** | No workflow serialization, versioning store, or site handoff triggers implemented. |

---

## 4. Current Workspace Files Status

- `src/features/builder/` — Feature active:
  - `components/BuilderLayout.jsx` — Master layout with Light/Dark theme and status bar.
  - `components/BuilderToolbar.jsx` — Toolbar with theme switcher, site dropdown, zoom/fit-view, and action buttons.
  - `components/ModulePalette.jsx` — 13 Core Modules + 20 Operational Steps with drag-and-drop & quick-add.
  - `components/WorkflowCanvas.jsx` — Interactive `@xyflow/react` canvas with smoothstep routing, grid, and minimap.
  - `components/InspectorPanel.jsx` — Node settings form, live inline validation, and clickable issue summary.
  - `nodes/WorkflowNode.jsx` — Custom node with typed handles, theme adaptation, and validation error badges.
  - `store/useWorkflowStore.js` — Zustand store with isolated drafts per facility, history, and theme state.
  - `registry/siteModules.js` — All 33 approved modules with typed settings schemas.
  - `validation/validateWorkflow.js` — Graph topology and settings validation engine.
  - `docs/` — Tracking documentation suite.
- `src/App.jsx` — Mounts `<BuilderLayout />` as main application entry point.
- `src/index.css` — Configured with Tailwind base directives and clean system font defaults.

---

## 5. Items Pending Verification

1. **Routing Integration (`src/app`):** Pending verification whether the Builder will be mounted at route `/builder` or rendered as the root view in `src/App.jsx`.
2. **Persistence Layer:** Pending verification whether workflow graphs should persist to `localStorage` or memory-only mock stores during client-side development.
3. **Site Data Contracts:** Schema models for Central Stores, Service Centre, and Distribution are conceptual in `PROJECT_CONTEXT.md` and need formal TypeScript/JSDoc type contracts in `src/data/` or `src/features/builder/types.js`.
4. **Time Machine Seed Data:** Pending verification of default timeline scenario events to seed initial playback.
