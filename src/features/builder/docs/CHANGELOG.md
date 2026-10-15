# Changelog — Visual Workflow Builder

All notable changes and milestones specific to the Visual Workflow Builder feature will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned for Part 4 (v0.4.0)
- Graph execution path simulation and dry-run preview mode.
- Interactive schema contract matching gates.

### Planned for Part 5 (v0.5.0)
- OpsHub Time Machine simulation engine and playback controller bar.
- Interactive scenario scrubbing and what-if parameter modification.

### Planned for Part 6 (v0.6.0)
- JSON export/import serializer and semantic versioning stamp.
- Integration triggers for Central Stores, Service Centre, and Distribution.

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

### Affected Files
- `src/features/builder/registry/siteModules.js` (Modified)
- `src/features/builder/validation/validateWorkflow.js` (Created)
- `src/features/builder/store/useWorkflowStore.js` (Modified)
- `src/features/builder/nodes/WorkflowNode.jsx` (Modified)
- `src/features/builder/components/WorkflowCanvas.jsx` (Modified)
- `src/features/builder/components/ModulePalette.jsx` (Modified)
- `src/features/builder/components/InspectorPanel.jsx` (Modified)
- `src/features/builder/components/BuilderToolbar.jsx` (Modified)
- `src/features/builder/components/BuilderLayout.jsx` (Modified)

---

## [0.2.0] - 2026-10-15

### Added
- Interactive `@xyflow/react` node canvas in `src/features/builder/components/WorkflowCanvas.jsx`:
  - Drag-and-drop mechanism via HTML5 drag events & `screenToFlowPosition`.
  - Custom `WorkflowNode.jsx` component featuring site badges, category styling, icons, and input/output handles.
  - Multi-handle routing support (single-output for actions/triggers, dual-output for conditional gateways).
  - Background grid and interactive MiniMap navigation with category color-coding.
  - Keyboard node/edge deletion (`Delete`, `Backspace`) and multi-selection (`Shift`/`Ctrl`).
  - Clear canvas toolbar action with empty state toggle.
  - Placed node inspection in `src/features/builder/components/InspectorPanel.jsx` with live node renaming, coordinate display, and wired inbound/outbound edge counters.
  - Enhanced Zustand store `useWorkflowStore.js` with graph state operations (`onNodesChange`, `onEdgesChange`, `onConnect`, `addNode`, `deleteNode`, `deleteEdge`, `updateNodeLabel`, `clearGraph`) isolated per operational site.

### Affected Files
- `src/features/builder/nodes/WorkflowNode.jsx` (Created)
- `src/features/builder/store/useWorkflowStore.js` (Modified)
- `src/features/builder/components/WorkflowCanvas.jsx` (Modified)
- `src/features/builder/components/ModulePalette.jsx` (Modified)
- `src/features/builder/components/InspectorPanel.jsx` (Modified)
- `src/features/builder/components/BuilderToolbar.jsx` (Modified)

### Planned for Part 3 (v0.3.0)
- Module registry defining operational cards for Central Stores, Service Centre, and Distribution.
- Dynamic node inspector form components with schema validation.

### Planned for Part 4 (v0.4.0)
- Topological graph validator detecting disconnected nodes, cycles, and missing parameters.
- Canvas-level validation badge rendering.

### Planned for Part 5 (v0.5.0)
- OpsHub Time Machine simulation engine and playback controller bar.
- Interactive scenario scrubbing and what-if parameter modification.

### Planned for Part 6 (v0.6.0)
- JSON export/import serializer and semantic versioning stamp.
- Integration triggers for Central Stores, Service Centre, and Distribution.

---

## [0.0.1] - 2026-10-15

### Added
- Created lightweight, persistent development tracking documentation in `src/features/builder/docs/`:
  - `PROJECT_STATE.md`: Captures the actual implementation baseline, verified dependencies, and pending items.
  - `PROGRESS.md`: Detailed 6-part implementation roadmap with granular deliverables and status flags.
  - `CHANGELOG.md`: Feature-specific milestone and change tracking.
  - `DECISIONS.md`: Architectural Decision Records (ADRs) covering canvas library, state management, site contracts, and directory conventions.
  - `FILE_MAP.md`: Inventory of existing scaffolding and mapped responsibilities for all planned feature files.
  - `NEXT_STEPS.md`: Immediate specifications and acceptance criteria for Part 1 (Builder UI Foundation).

### Affected Files
- `src/features/builder/docs/PROJECT_STATE.md` (Created)
- `src/features/builder/docs/PROGRESS.md` (Created)
- `src/features/builder/docs/CHANGELOG.md` (Created)
- `src/features/builder/docs/DECISIONS.md` (Created)
- `src/features/builder/docs/FILE_MAP.md` (Created)
- `src/features/builder/docs/NEXT_STEPS.md` (Created)
