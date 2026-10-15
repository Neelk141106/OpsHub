# File Map — Visual Workflow Builder

Detailed inventory of existing repository files and the planned file architecture for the Visual Workflow Builder.

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
| `src/App.jsx` | Top-level React application entry component. | Starter Template |
| `src/main.jsx` | DOM mount point rendering `<App />`. | Active |
| `src/features/builder/.gitkeep` | Scaffolding anchor for the Workflow Builder feature module. | Scaffolded |
| `src/features/central-stores/.gitkeep` | Scaffolding anchor for Central Stores inventory feature module. | Scaffolded |
| `src/features/service-centre/.gitkeep` | Scaffolding anchor for Service Centre maintenance feature module. | Scaffolded |
| `src/features/distribution/.gitkeep` | Scaffolding anchor for Distribution logistics feature module. | Scaffolded |

---

## 2. Feature Documentation Files (`src/features/builder/docs/`)

| Documentation File | Responsibility |
|---|---|
| `PROJECT_STATE.md` | Documents current actual implementation status, verified packages, and pending checks. |
| `PROGRESS.md` | Tracks delivery across Parts 1–6 with granular checklist items. |
| `CHANGELOG.md` | Records feature-specific updates, affected files, and upcoming version targets. |
| `DECISIONS.md` | Architectural Decision Records (ADRs) and domain integration contracts. |
| `FILE_MAP.md` | System map detailing existing files and planned module responsibilities. |
| `NEXT_STEPS.md` | Immediate action items, acceptance criteria, and constraints for Part 1. |

---

## 3. Planned Implementation Files (`src/features/builder/`)

### Layout & Containers
- `components/BuilderLayout.jsx`: Master layout organizing header, palette, canvas, and inspector.
- `components/BuilderToolbar.jsx`: Action bar with Undo/Redo, Zoom, Clear, Export, and Simulation toggle.
- `components/NodePalette.jsx`: Draggable sidebar categorized by site (Central Stores, Service Centre, Distribution).
- `components/InspectorPanel.jsx`: Dynamic configuration panel editing selected node properties.
- `components/StatusBar.jsx`: Footnote bar showing graph health, node/edge counts, and zoom level.

### Canvas & Flow
- `components/WorkflowCanvas.jsx`: Core `@xyflow/react` canvas wrapper with interactive event handlers.
- `components/CustomConnectionLine.jsx`: Custom animated SVG line for dragging new connections.

### Node Definitions (`nodes/`)
- `nodes/BaseNode.jsx`: Common node wrapper (selection border, status indicator, site badge, delete button).
- `nodes/TriggerNode.jsx`: Entry point node for operational triggers (arrival, alert, requisition).
- `nodes/ActionNode.jsx`: Execution step node for domain tasks (reserve, assign, package).
- `nodes/ApprovalNode.jsx`: Manual decision gate requiring manager authorization.
- `nodes/ConditionNode.jsx`: Branching node with configurable conditional expressions.
- `nodes/SiteTransitNode.jsx`: Inter-site transit node displaying transfer duration and custody handoff.

### State Management (`store/`)
- `store/useWorkflowStore.js`: Zustand store for nodes, edges, selection, history (undo/redo), and canvas viewport.
- `store/useSimulationStore.js`: Zustand store managing Time Machine timeline, playback status, and what-if variables.

### Registries & Logic
- `registry/siteModules.js`: Definitions and schema metadata for Central Stores, Service Centre, and Distribution modules.
- `validation/validateWorkflow.js`: Graph integrity checks (trigger presence, orphans, cycles, contract mismatches).
- `simulation/simulationEngine.js`: Deterministic event generation and node traversal logic for Time Machine.
