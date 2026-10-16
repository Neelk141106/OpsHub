# Visual Workflow Builder — Development Progress Tracker

Tracking the 6-part roadmap for the Visual Workflow Builder within OpsHub.

---

## Progress Summary

| Part | Milestone Name | Status | Target Completion | Evidence / Outcome |
|---|---|---|---|---|
| **Part 1** | Builder UI Foundation | 🟢 Completed | Sprint 1 | Enterprise layout, top toolbar, responsive studio, light/dark theme. |
| **Part 2** | Drag-and-Drop Canvas & Connections | 🟢 Completed | Sprint 1 | Interactive `@xyflow/react` canvas, visible handles, smoothstep edges, keyboard deletion, isolated site drafts. |
| **Part 3** | Module Registry & Settings | 🟢 Completed | Sprint 2 | Dynamic inspector forms, bidirectional mutation, pre-flight graph & parameter validation engine. |
| **Part 4** | Workflow Preview | 🟢 Completed | Sprint 2 | Read-only preview mode, multi-layer mutation locks, click-to-focus navigation, validation report card. |
| **Part 5** | OpsHub Time Machine Simulation | 🟢 Completed | Sprint 3 | Deterministic step-by-step traversal, branch router gateway selection, virtual dry-run disclaimer, immutability guarantee. |
| **Part 6** | Templates, Persistence, Publishing, RBAC & Dashboards | 🟢 Completed | Sprint 3 | Predefined validated templates, localStorage & REST service contracts, semver publishing, version history rollback, RBAC authorization guards, and operational dashboards consuming live published SOPs. |
| **Part 7** | Plain-English Explanations & Directional Handles | 🟢 Completed | Sprint 4 | Plain-English explanations catalog (`nodeExplanations.js`) for all 39 modules, handle directional micro-labels (`Next →`, `True →`, `False →`, `← In`), entry/terminal banners, and smart non-overlapping node placement. |
| **Part 8** | Complete UX Simplification & Beginner Guidance | 🟢 Completed | Sprint 4 | **Light mode primary default experience** with optional dark toggle; disambiguated site selector (`"Editing workflow for: [Facility]"` vs top-bar navigation); dynamic accurate module counts (13 Core + 26 Ops = 39 Total); Section 4 welcoming screen; Section 5 floating 5-step guided process drawer & HUD Help button; 8-part ordered Inspector hierarchy; and actionable plain-English validation messages. |
| **Part 9** | Final Clean UI, Simple UX & Signature USP | 🟢 Completed | Sprint 4 | Unified compact header, single bottom-left canvas zoom control group, clean 2-choice welcome card (Template vs Build from scratch with starter trigger recommendation), non-scrolling compact palette with accurate counts (39 / 13 / 26), decluttered right panel, and prominent OpsHub Time Machine USP simulation. |
| **Part 10** | Complete UI/UX Fix, Template Editing & Integration | 🟢 Completed | Sprint 4 | Restored two-card creation screen (Option A / Option B) with zero auto-selection bias; universal template browser showing all 3 site templates; same-canvas template editing & module palette extension; immutable factory templates; clear workflow header with facility context, draft badge & unsaved indicator; cross-dashboard "Edit SOP in Builder" deep links; 100% test passage. |

*Status Legend:*
- 🟢 **Completed** — Fully implemented, integrated, verified, and documented.

---

## Detailed Milestone Breakdown

### Part 1: Builder UI Foundation
- **Objective:** Establish the visual frame and layout panels for the workflow builder.
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] Builder layout shell with header, sidebar, canvas area, and properties drawer.
  - [x] Top action bar: OpsHub branding, site selector, editable title, Undo, Redo, Zoom controls, Save draft, and Simulation mode toggle.
  - [x] Left sidebar container for searchable, categorized module palette with site tags and inputs/outputs badges.
  - [x] Right sidebar container for module settings inspector with contextual empty state and integration contract viewer.
  - [x] Bottom status bar showing readiness status, active site, and keyboard shortcut tips.
  - [x] Base Zustand store (`useWorkflowStore`) initialized with isolated per-site drafts, zoom, and undo/redo history.

---

### Part 2: Drag-and-Drop Canvas & Connections
- **Objective:** Implement the interactive node graph canvas using `@xyflow/react`.
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] Interactive canvas wrapping `@xyflow/react` with background grid, minimap, and controls.
  - [x] Visible connection handles with crosshair cursor and animated smoothstep edges.
  - [x] Drag-and-drop mechanism transferring palette items onto canvas coordinates (`screenToFlowPosition`) plus `+` quick-add button.
  - [x] Palette scope organized into 6 standard categories with dedicated Start and End node semantics.
  - [x] Custom node shell (`WorkflowNode.jsx`) with category badges, site identification, icons, and typed handles.
  - [x] Working Light / Dark theme toggle applied across all Builder panels and nodes.
  - [x] Zoom In, Zoom Out, and Fit View controls directly bound via `useReactFlow()`.
  - [x] Edge connection validator: prevents duplicate edges, self-connections, and invalid gateway branching.
  - [x] Node and edge deletion via keyboard (`Delete`, `Backspace`) or UI action buttons.
  - [x] Completely isolated drafts across Central Stores, Service Centre, and Distribution.

---

### Part 3: Module Registry & Settings
- **Objective:** Populate operational domain modules and provide dynamic parameter configuration and validation.
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] 33 approved enterprise modules with typed settings schemas (text, number, select, toggle, textarea).
  - [x] Contextual node inspector dynamically generating form fields based on active node schema.
  - [x] Real-time graph validation engine (`validateWorkflow.js`) reporting empty canvas, entry triggers, dangling nodes, invalid gateways, and field constraints.
  - [x] Clickable issue navigation in Inspector automatically selecting and centering problem nodes.

---

### Part 4: Workflow Preview
- **Objective:** Provide a dedicated read-only preview mode for inspecting workflows before execution.
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] Dedicated Preview Mode toggled via Builder toolbar.
  - [x] Canvas interaction locks: dragging, deletion, renaming, and edge drawing disabled in preview.
  - [x] Read-only node inspector displaying configured values with lock badges.
  - [x] Validation summary banner showing total errors and warnings.

---

### Part 5: OpsHub Time Machine Simulation
- **Objective:** Provide deterministic step-by-step traversal and virtual what-if simulation.
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] Simulation controls: Start Simulation, Step Forward, Restart, and Exit Simulation.
  - [x] Pre-flight validation gate: Blocks invalid flows; permits valid flows.
  - [x] Visual traversal state: active node pulse (amber), visited nodes (emerald checkmark), animated illuminated edges.
  - [x] Branching logic: Conditional Gateway prompts user to select valid conditional branch path (`out-true` / `out-false`).
  - [x] Immutability guarantee: Simulation never mutates node positions, draft configurations, published versions, or operational records. Explicit virtual dry-run disclaimer displayed in execution log.

---

### Part 6: Predefined Templates, Persistence, Publishing, RBAC & Dashboards
- **Objective:** Complete the end-to-end enterprise platform with validated templates, persistent versioned SOPs, safe rollback, RBAC security, and operational dashboard consumption.
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] **Predefined Starting Templates (`workflowTemplates.js`):**
    - Central Stores: Requisition -> Stock Check -> Approval Gate -> Material Allocation -> Completed & Staged (5 nodes, 4 edges, 0 errors, 0 warnings).
    - Service Centre: Repair Request -> Inspection -> Conditional Router -> Approval Gate / PCB Solder Rework -> Return-to-Service (7 nodes, 6 edges, 0 errors, 0 warnings).
    - Distribution: Order Intake -> Material Verification -> Lot Consumption Tracking -> RMA Returns -> Carrier Dispatch (5 nodes, 4 edges, 0 errors, 0 warnings).
    - Create from Scratch: Blank canvas.
  - [x] **Template Customization Modal (`TemplateSelectorModal.jsx`):** Allows an authorized Admin to preview template steps, inspect topology health, and load into an independent editable draft.
  - [x] **Separation of Draft & Published Configuration (`workflowService.js`):**
    - `saveDraft()` persists independent editable drafts per facility in local persistent storage.
    - Status indicator: Unsaved changes dot indicator and loading state.
  - [x] **Publishing & Semantic Versioning (`PublishWorkflowModal.jsx`):**
    - Pre-flight validation blocks invalid graphs from publishing.
    - Automated SemVer calculation (`patch`, `minor`, `major` bumps).
    - Mandatory audit release notes / changelog input.
    - Admin-only permission guard enforced.
  - [x] **Version History & Safe Rollback (`VersionHistoryModal.jsx`):**
    - Complete chronological audit log of published versions with timestamp, author, and changelog.
    - One-click rollback restores live operational SOP and syncs editable draft.
  - [x] **Site Isolation:** Central Stores, Service Centre, and Distribution maintain independent drafts, published versions, and history. Publishing to one site never touches other sites.
  - [x] **Role-Based Access Control (`authService.js`):**
    - Roles: `ADMIN`, `OPERATIONS_LEAD`, `OPERATOR`.
    - Demo user switcher in top navigation.
    - Admin permissions enforced on canvas editing, node deletion, draft saving, publishing, and rollback.
  - [x] **Operational Dashboards Consuming Live SOPs:**
    - `CentralStoresDashboard.jsx`: Live inventory catalog, requisition queues, stock checks, approval gates, and material allocation.
    - `ServiceCentreDashboard.jsx`: Repair intake, diagnostic inspection, critical defect branching, PCB soldering, and return-to-service validation.
    - `DistributionDashboard.jsx`: Outbound shipment manifests, lot consumption logging, carrier dispatch, and RMA returns.
  - [x] **Global App Shell (`AppShell.jsx`):** Navigation bar with view switcher, user role dropdown, site indicator, and light/dark theme toggle.

---

### Part 8: Complete UX Simplification & Beginner Guidance
- **Objective:** Make the Builder intuitive enough that a first-time, non-technical administrator can build a workflow without asking a developer what to do.
- **Status:** 🟢 Completed
- **Key Deliverables:**
  - [x] **Light Mode Default:** Primary default theme set to `light`; dark mode preserved as optional user toggle with crisp borders and high-contrast text.
  - [x] **Disambiguated Site Navigation:** Clearly separated global navigation (application area switching) from Builder facility editing (`"Editing workflow for: [Facility]"`).
  - [x] **Accurate Dynamic Module Counts:** Total registered (39), Core (13), and Ops (26) dynamically calculated across header, tabs, and footer.
  - [x] **Template Application Safety:** Verifies `nodes.length > 0`, properly updates active site, and only triggers success when actual nodes/edges are loaded.
  - [x] **Section 4 Welcoming First-Time Experience:** Empty canvas displays "Create a workflow" title, clear subtitle, and side-by-side Option A (Template) and Option B (Build from scratch).
  - [x] **Section 5 Guided Process & HUD Help:** Floating 5-step guided process drawer and persistent `(?) Help & Guide` button in canvas HUD.
  - [x] **Section 10 Ordered 8-Part Inspector:** Form reorganized into: 1. Node name/icon, 2. What this step does, 3. When to use it, 4. Example, 5. Required configuration (with `*`), 6. Optional configuration, 7. Connections, 8. Advanced settings (collapsible accordion with IDs and raw JSON).
  - [x] **Section 11 Actionable Validation Messages:** Clear operational plain-English error and connection messages.
