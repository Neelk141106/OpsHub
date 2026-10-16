# File Map — OpsHub Platform & Visual Workflow Builder

Detailed inventory of repository files and system architecture as of v1.0.0.

---

## 1. Application Shell & Core Infrastructure

| File Path | Responsibility |
|---|---|
| `src/main.jsx` | DOM mount point rendering `<App />`. |
| `src/App.jsx` | Root application component mounting `<AppShell />`. |
| `src/app/AppShell.jsx` | Enterprise top navigation header, view switcher (`builder`, `central-stores`, `service-centre`, `distribution`), demo user RBAC switcher, and light/dark theme toggle. |
| `PROJECT_CONTEXT.md` | Single source of truth for platform scope, 3 operational sites, stack, and architecture. |
| `package.json` | Project dependencies, scripts (`dev`, `build`, `lint`, `preview`), and metadata. |
| `vite.config.js` | Vite bundler configuration with `@vitejs/plugin-react`. |
| `tailwind.config.js` | Tailwind CSS configuration with dark mode support. |

---

## 2. Visual Workflow Builder (`src/features/builder/`)

### Layout & Dialog Modals
- `components/BuilderLayout.jsx`: Master layout organizing header, palette, canvas, inspector, modals, and status footer inside `<ReactFlowProvider>`. Defaults to Light mode with optional dark mode toggle.
- `components/BuilderToolbar.jsx`: Action bar with primary actions group (Templates, Preview, Time Machine, Save Draft, Publish SOP), secondary controls (Undo, Redo, Zoom, Fit-View, History, Theme Toggle, Clear Canvas), and explicitly labeled site draft selector (`"Editing workflow for: [Facility]"`).
- `components/TemplateSelectorModal.jsx`: Modal for previewing starting templates, inspecting topology health, and loading into editable drafts.
- `components/PublishWorkflowModal.jsx`: Pre-flight validation gate, semver increment selector (`patch`, `minor`, `major`), changelog input, and admin authorization check.
- `components/VersionHistoryModal.jsx`: Immutable version audit trail, release notes inspector, and safe rollback dispatcher.
- `components/ModulePalette.jsx`: Searchable module palette structured into standard categories with dynamic module counts (13 Core + 26 Ops = 39 Total), category accordions, drag-and-drop, and quick-add.
- `components/InspectorPanel.jsx`: Strictly ordered 8-part sequence: 1. Node name/icon, 2. What this step does, 3. When to use it, 4. Example, 5. Required configuration (with `*`), 6. Optional configuration, 7. Connections, 8. Advanced settings (collapsible accordion with IDs and raw JSON).
- `components/WorkflowCanvas.jsx`: Interactive `@xyflow/react` canvas with Section 4 welcoming screen (Option A Template vs Option B Build from scratch), Section 5 floating 5-step guided process drawer, HUD `(?) Help & Guide` button, directional handle labels, and Time Machine simulation deck.
- `nodes/WorkflowNode.jsx`: Custom node component with category badges, site tags, icons, typed connection handles (dedicated 0-input Start and 0-output End handles), active simulation pulse/glow, visited step indicator, and read-only preview styling.

### State & Services
- `store/useWorkflowStore.js`: Zustand store managing isolated per-site drafts, published configurations, version history, simulation state machine, RBAC user context, and UI modes.
- `services/workflowService.js`: Client-side persistence, baseline seeding, draft saving, publishing, semver calculation, and rollback dispatcher with documented REST contracts.
- `services/authService.js`: RBAC definitions (`ADMIN`, `OPERATIONS_LEAD`, `OPERATOR`), demo users, and permission guards.
- `templates/workflowTemplates.js`: Predefined, 100% valid starting templates for Central Stores, Service Centre, and Distribution + Create from Scratch.
- `registry/siteModules.js`: All 39 approved modules reorganized into 6 standard categories with dedicated Start and End semantics.
- `registry/nodeExplanations.js`: Plain-English operational explanations catalog for all 39 modules (what it does, when to use, example, next step, connection rules).
- `validation/validateWorkflow.js`: Validation engine checking entry triggers, inbound/outbound wiring, 2-output gateway rules, required configuration schemas, and actionable fix hints.

---

## 3. Operational Site Dashboards (`src/features/`)

- `src/features/central-stores/CentralStoresDashboard.jsx`:
  - Consumes published SOP for Central Stores (`publishedWorkflows['central-stores']`).
  - Renders live inventory catalog, requisition queues, stock checks, approval gates, and material allocation.
- `src/features/service-centre/ServiceCentreDashboard.jsx`:
  - Consumes published SOP for Service Centre (`publishedWorkflows['service-centre']`).
  - Renders repair ticket intake, diagnostic inspection, critical defect branching, PCB soldering, and return-to-service validation.
- `src/features/distribution/DistributionDashboard.jsx`:
  - Consumes published SOP for Distribution (`publishedWorkflows['distribution']`).
  - Renders outbound shipment manifests, pick/pack verification, lot consumption logging, carrier dispatch, and RMA returns.

---

## 4. Feature Documentation Files (`src/features/builder/docs/`)

- `PROJECT_STATE.md`: Documents current implementation status and dependencies.
- `PROGRESS.md`: Tracks delivery across Parts 1–6.
- `CHANGELOG.md`: Records feature-specific updates and version history.
- `DECISIONS.md`: Architectural Decision Records (ADRs).
- `FILE_MAP.md`: System map detailing existing files and module responsibilities.
- `NEXT_STEPS.md`: Production deployment roadmap and backend configuration requirements.
