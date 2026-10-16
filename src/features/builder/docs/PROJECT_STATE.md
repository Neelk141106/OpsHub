# Visual Workflow Builder — Project State

Current actual implementation state as of **2026-10-16**.

---

## 1. Environment & Branch Context

- **Repository:** `OpsHub`
- **Active Git Branch:** `feature/workflow-builder`
- **Base Commit:** `45dd0be41d15b9b2ff9eaa838371897446ecd99a` (v0.1.0 initial setup)
- **Target Feature Directory:** `src/features/builder/`, `src/features/central-stores/`, `src/features/service-centre/`, `src/features/distribution/`, `src/app/`

---

## 2. Technology Stack & Available Dependencies

The project runtime and build tooling are installed, verified, and compiling cleanly:

| Dependency | Version | Purpose in Workflow Builder & Platform |
|---|---|---|
| `react` & `react-dom` | `^19.2.8` | Core UI library |
| `vite` | `^8.3.0` | Production build bundler and dev server (Compiles in 1.4s with 0 errors) |
| `@xyflow/react` | `^12.12.0` | Node graph canvas, connection handles, drag-and-drop |
| `zustand` | `^5.0.15` | Decoupled reactive store for canvas state, simulation, auth, and persistence |
| `lucide-react` | `^1.57.0` | Iconography for nodes, toolbar actions, dashboards, and site badges |
| `recharts` | `^3.10.1` | Telemetry visualization |
| `react-router-dom` | `^7.18.4` | Application routing |
| `tailwindcss` | `^3.4.19` | Utility styling with CSS variable support and dark mode |
| `oxlint` | `^1.81.0` | Code quality and linting (0 errors, 0 warnings across all 24 files) |

---

## 3. Actual Implementation Status

### Core Parts Overview

| Part | Description | Status | Evidence in Codebase |
|---|---|---|---|
| **Part 1** | Builder UI foundation | 🟢 **Completed** | `BuilderLayout.jsx`, `BuilderToolbar.jsx`, `ModulePalette.jsx`, `WorkflowCanvas.jsx`, `InspectorPanel.jsx`, `useWorkflowStore.js` rendered via `src/app/AppShell.jsx`. |
| **Part 2** | Drag-and-drop canvas and connections | 🟢 **Completed** | Full `@xyflow/react` interactive canvas, visible connection handles and animated edges, HTML5 drag-and-drop & quick-add, node/edge deletion, zoom/fit-view controls via `useReactFlow`, Light/Dark theme toggle, 6 standard module categories, and isolated per-site state. |
| **Part 3** | Module registry and settings | 🟢 **Completed** | Dynamic form generation in `InspectorPanel.jsx` based on module settings schemas, bidirectional parameter mutation via `useWorkflowStore.updateNodeConfig`, inline validation feedback, and full `validateWorkflow.js` topology/settings validation engine with clickable issue navigation. |
| **Part 4** | Workflow Preview | 🟢 **Completed** | Dedicated Preview Mode toggled via `BuilderToolbar.jsx`, multi-layer read-only mutation guards in `useWorkflowStore.js`, read-only node inspection & configured settings view in `InspectorPanel.jsx`, validation health indicators (errors, warnings, valid), click-to-focus canvas navigation via `useReactFlow().setCenter()`, and strict site draft isolation across Central Stores, Service Centre, and Distribution. |
| **Part 5** | OpsHub Time Machine simulation | 🟢 **Completed** | Full deterministic step-by-step traversal engine in `useWorkflowStore.js`, pre-flight validation integration via `validateWorkflow.js`, interactive Canvas Control Deck, active/visited node highlighting (amber pulse / emerald checkmark), illuminated animated traversed edges, read-only parameter inspection in `InspectorPanel.jsx`, virtual dry-run execution timeline log, and interactive user branch selector for conditional gateways. |
| **Part 6** | Predefined Templates, Persistence, Publishing, RBAC & Dashboards | 🟢 **Completed** | Predefined validated templates for Central Stores, Service Centre, and Distribution + Blank Canvas (`workflowTemplates.js`), async persistence service (`WorkflowService.js`), semantic versioning bump, version history audit log with one-click safe rollback, RBAC role-based authorization guards (`authService.js`), live operational dashboards for Central Stores, Service Centre, and Distribution consuming active published SOPs, and App Shell navigation (`AppShell.jsx`). |
| **Part 7** | Human-friendly explanations & handle labels | 🟢 **Completed** | Human-friendly explanations catalog (`nodeExplanations.js`) for all 39 modules with `whatItDoes`, `whenToUse`, `example`, `nextStep`, and connection requirements; directional handle micro-labels (`Next →`, `True →`, `False →`, `← In`), entry/terminal banners, smart non-overlapping node placement, and dismissible contextual guidance tips. |
| **Part 8** | Complete UX Simplification & Beginner Guidance | 🟢 **Completed** | **Light mode primary default experience** with optional dark mode toggle; clearly separated site selector (`"Editing workflow for: [Facility]"`); verified template application preventing empty false-success states; accurate dynamic module counts (13 Core + 26 Ops = 39 Total); Section 4 welcoming screen with side-by-side Option A (Template) and Option B (Build from scratch); Section 5 dismissible floating 5-step guided process drawer with HUD `(?) Help & Guide` button; strictly ordered 8-part Inspector hierarchy with plain-English field explanations and advanced collapsible settings; and actionable plain-English validation messages. |
| **Part 9** | Final Clean UI, Simple UX & Signature USP | 🟢 **Completed** | Compact unified header without duplicate branding or theme toggles; single bottom-left canvas zoom deck; clean 2-choice welcome card (Template vs Build from Scratch with starter trigger recommendation); compact non-scrolling module palette with accurate 39 / 13 / 26 counts; decluttered right panel; and elevated OpsHub Time Machine USP simulation. |
| **Part 10** | Complete UI/UX Fix, Template Editing & Integration | 🟢 **Completed** | Restored two-card creation screen (Option A / Option B) with zero auto-selection bias; universal template browser showing all 3 site templates; same-canvas template editing & module palette extension; immutable factory templates; clear workflow header with facility context, draft badge & unsaved indicator; cross-dashboard "Edit SOP in Builder" deep links; 100% test passage. |

---

## 4. Current Workspace Files Status

- `src/app/`
  - `AppShell.jsx` — Enterprise top navigation bar, view switcher (Builder, Stores, Service, Distribution), user RBAC demo switcher, and theme toggle.
- `src/features/builder/`
  - `components/BuilderLayout.jsx` — Master layout with Light/Dark theme, bottom status bar, and modal mounting.
  - `components/BuilderToolbar.jsx` — Toolbar with Templates trigger, Version History trigger, Preview toggle, Simulation toggle, Save Draft (with loading spinner & dirty dot), and Publish SOP.
  - `components/ModulePalette.jsx` — 6 standard module categories (Start/Triggers, Operations, Decisions/Gateways, Approvals, End/Outcomes, System Integrations) with drag-and-drop, quick-add, and category sub-filters.
  - `components/WorkflowCanvas.jsx` — `@xyflow/react` canvas with smoothstep routing, grid, minimap, preview banner, and read-only props.
  - `components/InspectorPanel.jsx` — Node settings form, read-only preview inspection, live validation health badges, and clickable issue navigation.
  - `components/TemplateSelectorModal.jsx` — Predefined template previewer, topology health inspector, and draft loader.
  - `components/PublishWorkflowModal.jsx` — Pre-flight validation gate, semver increment selector (Patch/Minor/Major), changelog input, and admin authorization check.
  - `components/VersionHistoryModal.jsx` — Immutable version audit trail, release notes inspector, and safe rollback dispatcher.
  - `nodes/WorkflowNode.jsx` — Custom node with category-specific badges, typed handles (dedicated 0-input Start and 0-output End handles).
  - `services/workflowService.js` — Client-side persistence, baseline seeding, draft saving, publishing, semver calculation, and rollback dispatcher with documented REST contracts.
  - `services/authService.js` — RBAC definitions (`ADMIN`, `OPERATIONS_LEAD`, `OPERATOR`), demo users, and permission guards.
  - `templates/workflowTemplates.js` — Predefined, 100% valid starting templates for Central Stores, Service Centre, and Distribution + Create from Scratch.
  - `store/useWorkflowStore.js` — Zustand store managing isolated site drafts, active published SOPs, version history, simulation state machine, RBAC user context, and UI modes.
  - `registry/siteModules.js` — All 33 approved modules reorganized into 6 categories with dedicated Start and End semantics.
  - `validation/validateWorkflow.js` — Validation engine enforcing start triggers, inbound/outbound connection rules, 2-output gateway rules, and required configuration schemas.
- `src/features/central-stores/`
  - `CentralStoresDashboard.jsx` — Requisition intake queue, inventory table, stock check, approval gate, and material allocation consuming published SOP.
- `src/features/service-centre/`
  - `ServiceCentreDashboard.jsx` — Repair ticket intake, diagnostic inspection, critical defect branching gate, PCB soldering rework, and return-to-service validation consuming published SOP.
- `src/features/distribution/`
  - `DistributionDashboard.jsx` — Outbound shipments queue, pick/pack verification, lot consumption tracking, carrier manifest handoff, and RMA returns consuming published SOP.
