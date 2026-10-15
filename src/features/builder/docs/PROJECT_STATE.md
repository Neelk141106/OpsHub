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
| **Part 2** | Drag-and-drop canvas and connections | **Not Started** | Canvas wrapper ready with grid & empty state; `@xyflow/react` node/edge drag-and-drop to be connected. |
| **Part 3** | Module registry and settings | **Not Started** | No registry for Central Stores, Service Centre, or Distribution modules exists. |
| **Part 4** | Validation and preview | **Not Started** | No graph traversal or topological validation logic implemented. |
| **Part 5** | OpsHub Time Machine simulation | **Not Started** | No deterministic state machine or simulation runner implemented. |
| **Part 6** | Publish, versioning and integration | **Not Started** | No workflow serialization, versioning store, or site handoff triggers implemented. |

---

## 4. Current Workspace Files Status

- `src/features/builder/` — Directory scaffolded with `.gitkeep`; no source files present.
- `src/features/central-stores/` — Directory scaffolded with `.gitkeep`; site data models not yet populated.
- `src/features/service-centre/` — Directory scaffolded with `.gitkeep`; ticket/triage models not yet populated.
- `src/features/distribution/` — Directory scaffolded with `.gitkeep`; fulfillment/dispatch models not yet populated.
- `src/app/`, `src/components/`, `src/config/`, `src/data/`, `src/lib/`, `src/store/` — All directories currently contain `.gitkeep`.
- `src/App.jsx` — Default Vite starter application.
- `src/index.css` — Configured with Tailwind base directives and clean system font defaults.

---

## 5. Items Pending Verification

1. **Routing Integration (`src/app`):** Pending verification whether the Builder will be mounted at route `/builder` or rendered as the root view in `src/App.jsx`.
2. **Persistence Layer:** Pending verification whether workflow graphs should persist to `localStorage` or memory-only mock stores during client-side development.
3. **Site Data Contracts:** Schema models for Central Stores, Service Centre, and Distribution are conceptual in `PROJECT_CONTEXT.md` and need formal TypeScript/JSDoc type contracts in `src/data/` or `src/features/builder/types.js`.
4. **Time Machine Seed Data:** Pending verification of default timeline scenario events to seed initial playback.
