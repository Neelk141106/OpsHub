# Changelog — Visual Workflow Builder

All notable changes and milestones specific to the Visual Workflow Builder feature will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned for Part 6 (v0.6.0)
- Workflow serialization, semantic versioning stamp, and JSON export/import.
- Integration triggers and data contract bindings for Central Stores, Service Centre, and Distribution.
- Read-only live deployment simulator verification.

---

## [0.5.0] - 2026-10-15

### Added
- Implemented Part 5 Time Machine Simulation:
  - **Time Machine Controls:** Integrated toolbar Time Machine button with full simulation lifecycle (`startSimulation`, `stepForward`, `chooseBranch`, `restartSimulation`, `exitSimulation`).
  - **State Isolation & Mutation Guards:** Locked all canvas mutations (`addNode`, `deleteNode`, `deleteEdge`, `updateNodeConfig`, `updateNodeLabel`, `clearGraph`, `undo`, `redo`, `setWorkflowName`, `onConnect`) and disabled palette dragging during simulation mode.
  - **Step-by-Step Graph Traversal:** Traverses active site's placed workflow nodes and connections sequentially, calculating dynamic reachable step counts and visited node tracking.
  - **Visual Node Highlighting:** Current active node illuminated with `border-amber-400 ring-4 ring-amber-400/50 shadow-2xl animate-pulse` and `Step X` active indicator pill; previously visited nodes marked with emerald accent ring and checkmark pill.
  - **Traversed Edge Illumination:** Canvas edges dynamically styled; traversed edges illuminate in bright animated amber (`#f59e0b`, width 3.5, glow shadow), while untraversed edges are dimmed (`opacity: 0.3`).
  - **Floating Simulation Control Deck:** Canvas-top floating HUD with simulation status badge, step counter (`Step X of Y`), Step Forward, Restart, and Exit buttons, current node preview, and inline branch selection buttons.
  - **Interactive Undefined Branching:** When a node has multiple outgoing edges without defined business rules, the simulation halts cleanly with `status: 'branching'` and prompts the operator to choose a valid next connection.
  - **Pre-Flight Topology & Health Validation:** Integrated existing Part 3 `validateWorkflow.js` engine; detects empty graphs (`status: 'empty'`), blocks invalid topologies (`status: 'invalid'`), and displays detailed diagnostic reasons.
  - **Simulation Inspector Panel:** Dedicated inspection view in `InspectorPanel.jsx` showing simulation status banner, execution progress bar, read-only configured parameters table of the current node, chronological execution log with click-to-focus navigation, and pre-flight validation health card with actionable issue list and "Exit Simulation to Connect Nodes" action.
  - **Site Switching & Preview Safety:** Switching operational facilities or entering Preview mode automatically terminates running simulations cleanly.
  - **Inbound Connection Verification:** Traced and verified inbound connection rules for approval gates and operational modules; verified genuine configuration errors are preserved without weakening validation or silently auto-connecting nodes.

---

## [0.4.0] - 2026-10-15

### Added
- Implemented Part 4 Workflow Preview:
  - Added dedicated, high-visibility **Preview** button in `BuilderToolbar.jsx` with direct toggle between Edit and Preview modes.
  - Added "Exit Preview / Return to Editor" actions in Toolbar, floating Canvas HUD banner, and Palette lock banner.
  - Read-Only Canvas Mode in `WorkflowCanvas.jsx`: `nodesDraggable={false}`, `nodesConnectable={false}`, and deletion hotkeys (`Delete`, `Backspace`) disabled in preview mode.
  - Defense-in-depth state protection in `useWorkflowStore.js`: `addNode`, `deleteNode`, `deleteEdge`, `updateNodeConfig`, `updateNodeLabel`, `clearGraph`, `undo`, `redo`, and `setWorkflowName` strictly guarded from mutating during preview mode.
  - Read-Only Node Inspection in `InspectorPanel.jsx`: Placed nodes can be selected to inspect their module name, category, summary, and configured settings values without edit inputs.
  - Visual Validation Health Indicator: Distinguishes errors (red alert with detailed message), warnings (amber notice), and valid configurations (green checkmark).
  - Validation Issue Navigation: Clicking an issue in the Validation Summary selects the affected node and centers the canvas directly on it via `useReactFlow().setCenter()`.
  - Empty state messaging in Inspector: Clear prompt guiding users to select nodes on the canvas in read-only mode, coupled with complete workflow topology and settings validation summary.
  - Strict Operational Site Isolation: Preview strictly operates on the currently selected site's draft (`Central Stores`, `Service Centre`, `Distribution`); switching sites preserves draft separation, and exiting preview returns to the same draft with all edits intact.
  - Palette lock in `ModulePalette.jsx`: Dragging cards and `+` quick-add buttons disabled during preview mode with clear contextual notification.

### Affected Files
- `src/features/builder/store/useWorkflowStore.js` (Modified)
- `src/features/builder/components/BuilderToolbar.jsx` (Modified)
- `src/features/builder/components/WorkflowCanvas.jsx` (Modified)
- `src/features/builder/nodes/WorkflowNode.jsx` (Modified)
- `src/features/builder/components/InspectorPanel.jsx` (Modified)
- `src/features/builder/components/ModulePalette.jsx` (Modified)
- `src/features/builder/components/BuilderLayout.jsx` (Modified)
- `src/features/builder/docs/PROGRESS.md` (Modified)
- `src/features/builder/docs/PROJECT_STATE.md` (Modified)
- `src/features/builder/docs/CHANGELOG.md` (Modified)
- `src/features/builder/docs/NEXT_STEPS.md` (Modified)

---

## [0.3.0] - 2026-10-15

### Added
- Finished Part 2 Interactive Canvas:
  - Visible, crosshair-enabled input/output handles on `WorkflowNode.jsx` with animated smoothstep edges.
  - Palette scope corrected: Exactly 13 approved core modules (Auth, User Mgmt, Inventory, Dashboard Shell, Request Mgmt, Approval, Material Assignment, Assignment Frontend, Consumption Tracking, Return Mgmt, PCB Repair, Analytics Dashboard, Reports/Excel) and 20 operational steps clearly categorized.
  - Working Light/Dark theme toggle throughout Builder (Toolbar, Palette, Canvas, Nodes, Inspector, and Status Footer).
  - Zoom In, Zoom Out, and Fit View controls directly integrated via `useReactFlow()` inside `<ReactFlowProvider>`.
  - Independent drafts across Central Stores, Service Centre, and Distribution (nodes, edges, configurations, and history).
- Implemented Part 3 Module Registry and Settings:
  - Configurable settings schemas defined for all 33 modules in `src/features/builder/registry/siteModules.js`.
  - Dynamic parameter form generation in `src/features/builder/components/InspectorPanel.jsx` (text, number, select, boolean).
  - Bidirectional configuration state mutation via `useWorkflowStore.updateNodeConfig`.
  - Workflow Validation Engine in `src/features/builder/validation/validateWorkflow.js` checking required settings, numeric boundaries, orphan nodes, and terminal routes.
  - Interactive Workflow Validation Summary with clickable links to focus and inspect affected nodes.
  - Inline error messages on form inputs and real-time validation badges on canvas nodes.

---

## [0.2.0] - 2026-10-15

### Added
- Interactive `@xyflow/react` node canvas in `src/features/builder/components/WorkflowCanvas.jsx`:
  - Drag-and-drop mechanism via HTML5 drag events & `screenToFlowPosition`.
  - Node selection, movement, deletion, and connection via smoothstep edges.
- Custom node component `WorkflowNode.jsx`.
- Module palette with search, category tabs, and drag indicators.

---

## [0.1.0] - 2026-10-15

### Added
- Base layout foundation (`BuilderLayout.jsx`, `BuilderToolbar.jsx`, `InspectorPanel.jsx`).
- Zustand store scaffolding (`useWorkflowStore.js`).
- Initial tracking documentation suite.
