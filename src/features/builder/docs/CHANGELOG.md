# Changelog — Visual Workflow Builder

All notable changes and milestones specific to the Visual Workflow Builder feature will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned for Part 1 (v0.1.0)
- Builder UI layout shell (`src/features/builder/components/BuilderLayout.jsx`).
- Top toolbar with action buttons (`src/features/builder/components/BuilderToolbar.jsx`).
- Left palette container and right property inspector frame.
- Initial Zustand canvas store (`src/features/builder/store/useWorkflowStore.js`).

### Planned for Part 2 (v0.2.0)
- `@xyflow/react` interactive canvas integration (`src/features/builder/components/WorkflowCanvas.jsx`).
- Custom base node component and typed connection handles (`src/features/builder/nodes/BaseNode.jsx`).
- Drag-and-drop transfer listener between palette and canvas.
- Edge connection validator and animated transit styles.

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
