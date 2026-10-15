# Changelog — Visual Workflow Builder

All notable changes and milestones specific to the Visual Workflow Builder feature will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned for Part 5 (v0.5.0)
- OpsHub Time Machine simulation engine and playback controller bar.
- Interactive scenario scrubbing and what-if parameter modification.

### Planned for Part 6 (v0.6.0)
- JSON export/import serializer and semantic versioning stamp.
- Integration triggers for Central Stores, Service Centre, and Distribution.

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
