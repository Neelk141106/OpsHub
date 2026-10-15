# File Map — Visual Workflow Builder

Detailed inventory of existing repository files and the actual file architecture for the Visual Workflow Builder as of v0.4.0 (Part 4).

---

## 1. Existing Repository Files

| File Path | Responsibility | Current State |
|---|---|---|
| `PROJECT_CONTEXT.md` | Single source of truth for platform scope, 3 operational sites, stack, and architecture. | Complete & Active |
| `CHANGELOG.md` | Top-level project release log adhering to Keep a Changelog. | Initialized (v0.1.0) |
| `package.json` | Project dependencies, scripts (`dev`, `build`, `lint`, `preview`), and metadata. | Clean & Configured |
| `vite.config.js` | Vite bundler configuration with `@vitejs/plugin-react`. | Configured |
| `tailwind.config.js` | Tailwind content scanner (`src/**/*.{js,ts,jsx,tsx}`) and theme config. | Configured |
| `src/index.css` | Global Tailwind CSS directives (`@tailwind base/components/utilities`). | Configured |
| `src/App.jsx` | Top-level React application entry component mounting `<BuilderLayout />`. | Active |
| `src/main.jsx` | DOM mount point rendering `<App />`. | Active |
| `src/features/builder/` | Canonical root for the Workflow Builder feature module. | Active (Parts 1–4 Complete) |

---

## 2. Feature Documentation Files (`src/features/builder/docs/`)

| Documentation File | Responsibility |
|---|---|
| `PROJECT_STATE.md` | Documents current actual implementation status, verified packages, and pending checks. |
| `PROGRESS.md` | Tracks delivery across Parts 1–6 with granular checklist items. |
| `CHANGELOG.md` | Records feature-specific updates, affected files, and upcoming version targets. |
| `DECISIONS.md` | Architectural Decision Records (ADRs) and domain integration contracts. |
| `FILE_MAP.md` | System map detailing existing files and planned module responsibilities. |
| `NEXT_STEPS.md` | Immediate action items, acceptance criteria, and constraints for Part 5. |

---

## 3. Actual Implementation Files (`src/features/builder/`)

### Layout & Containers
- `components/BuilderLayout.jsx`: Master layout organizing header, palette, canvas, inspector, and status footer inside `<ReactFlowProvider>`.
- `components/BuilderToolbar.jsx`: Action bar with Time Machine simulation toggle, Preview toggle, Site selector (Central Stores, Service Centre, Distribution), editable title, Undo/Redo, Zoom/Fit-View, Theme toggle, and Save/Publish controls.
- `components/ModulePalette.jsx`: Searchable module palette with Scope Tabs (`All 33`, `Core 13`, `Ops 20`), category subfilters, HTML5 drag-and-drop, quick-add button, preview lock banner, and simulation lock banner.
- `components/InspectorPanel.jsx`: Dynamic configuration form, live validation errors, read-only preview inspection, and dedicated Simulation Inspector with execution progress, parameter table, timeline log, and branch selection controls.

### Canvas & Flow
- `components/WorkflowCanvas.jsx`: Interactive `@xyflow/react` canvas with smoothstep edge routing, dot grid, minimap, floating preview banner, empty state, floating Simulation Control Deck, illuminated traversed edges, and read-only simulation props.

### Node Definitions (`nodes/`)
- `nodes/WorkflowNode.jsx`: Custom node component with category badges, site tags, icons, typed connection handles, validation alert badges, active simulation pulse/glow (`amber-400`), visited step indicator (`emerald`), and read-only preview styling.

### State Management (`store/`)
- `store/useWorkflowStore.js`: Zustand store managing isolated per-site drafts, simulation state (`status`, `currentNodeId`, `visitedNodeIds`, `traversedEdgeIds`, `currentStep`, `totalSteps`, `pendingBranches`, `executionLog`), traversal actions (`startSimulation`, `stepForward`, `chooseBranch`, `restartSimulation`, `exitSimulation`), multi-layer mutation guards, history (undo/redo), and theme state.

### Registries & Logic
- `registry/siteModules.js`: Exactly 13 approved core modules and 20 operational steps with full settings schemas, icons, and site metadata.
- `validation/validateWorkflow.js`: Validation engine checking entry triggers, inbound/outbound wiring, required settings, and numeric bounds (reused by Time Machine pre-flight).

