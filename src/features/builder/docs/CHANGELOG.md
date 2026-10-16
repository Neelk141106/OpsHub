# Changelog — Visual Workflow Builder

All notable changes and milestones specific to the Visual Workflow Builder feature will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.0] - 2026-10-16

### Completed — Complete UI/UX Fix, Template Editing, Module Palette & Workflow Creation
- **Creation Screen Restoration & Equal Choice Cards:**
  - Fixed initial screen state where templates were prematurely auto-loading; users now clearly see Option A (`Use a Template` / `Predefined SOP`) and Option B (`Build from Scratch` / `Custom Workflow`) with equal width, height, aligned baseline actions, and neutral unselected states.
  - Added "Resume Saved Draft" banner if a previous draft exists in local storage.
  - Added dedicated `New Workflow` button in toolbar allowing configurators to return to the creation screen at any time.
- **Universal Template Browsing:**
  - Added `'ALL'` facility filter tab: `All Facilities (3)` alongside site tabs (`Central Stores (1)`, `Service Centre (1)`, `Distribution (1)`).
  - Displays all 3 validated platform templates simultaneously with step counts, facility badges, operational categories, readable descriptions, and a step previewer.
  - Primary action: `Use This Template` loads the selected SOP into the visual canvas immediately.
- **Template Extension on the Same Canvas:**
  - Loading a template populates the live canvas with all nodes, connections, and configurations while keeping the module palette accessible.
  - Users can drag-and-drop additional modules from the palette directly onto the template canvas.
  - Users can connect new modules to existing nodes without breaking existing connections, configure node properties in the Inspector, delete nodes, and reposition freely.
  - Immutability guarantee: original template definitions in `workflowTemplates.js` are factory functions that remain 100% pristine and protected against corruption.
- **Clear Workflow Header & Editing Experience:**
  - Header explicitly displays `Editing: [Facility Name] — [Workflow Title]`.
  - Added live status pill (`Draft`), pulsing unsaved changes indicator, semver button (`v1.0.0`), direct `Validate` action, and `New Workflow` button.
  - In Preview mode, a prominent `Edit Workflow` action is displayed to seamlessly return to edit mode.
- **Cross-Dashboard Integration:**
  - Central Stores, Service Centre, and Distribution operational dashboards now feature an `Edit SOP in Builder` button next to their active SOP status badge.
  - Clicking automatically loads the facility's existing draft into the builder canvas and opens the workflow view.
- **Guided Build from Scratch Canvas:**
  - When starting from scratch, the canvas opens with a clean, friendly empty state (`Your workflow starts here. Drag a module from the left panel to add your first step.`).
  - Provides a single-click recommended starting trigger button based on the active facility, as well as a link back to template selection.
- **Zero-Mutation Time Machine Simulation:**
  - Verified that OpsHub Time Machine executes safe, in-memory topological traversals without generating or mutating real warehouse or service operational records.
- **Build and Lint Verification:**
  - Oxlint passed with 0 errors and 0 warnings across 25 files.
  - Vite production build succeeds in 1.41s.
  - End-to-end user journey test suite passed with 10/10 assertions.

## [1.3.0] - 2026-10-16

### Completed — Final Clean UI, Simple UX & Signature USP
- **Clean, Compact Top Header & Navigation Hierarchy:**
  - Streamlined global AppShell header and Builder toolbar into an intentional, visually coherent structure.
  - Eliminated duplicate OpsHub branding and duplicate theme toggles.
  - Dedicated "Editing workflow for: [Facility]" dropdown clearly distinguishes operational dashboard switching from workflow configuration.
  - Integrated version history pill, editable workflow title, undo/redo/clear group, and primary action buttons.
- **Light Mode as Primary Enterprise Default:**
  - Configured `darkMode: 'class'` in `tailwind.config.js` to prevent system OS dark mode from overriding light mode.
  - Styled surfaces with clean white and soft-grey backgrounds, dark readable text (`#0f172a`), restrained purple accents (`#7c3aed`), minimal borders, and high contrast status badges. Dark mode remains fully supported via AppShell toggle.
- **Simplified Start Screen (Empty Canvas):**
  - Replaced overwhelming multi-card guidance with ONE clean, compact welcome card: **Create a workflow** (*"Choose a template or build your own workflow, step by step."*).
  - Two equal, accessible choices: **Use a Template** (customizable prepared SOP) vs **Build from Scratch** (guided step-by-step trigger insertion).
  - "Build from scratch" recommends a verified starting trigger based on the active site registry (e.g. Requisition Intake for Central Stores) with a single-click insert.
- **Single Canvas Control Group:**
  - Removed duplicate zoom controls from the top toolbar.
  - Placed a sleek, unified floating canvas control deck in the bottom-left corner with Zoom In (`+`), Zoom Out (`-`), Fit-to-View (`[ ]`), and live placed node count.
  - Removed permanent floating guided drawer that previously competed with and covered canvas space.
- **Compact Module Palette:**
  - Replaced horizontal category scrolling pills with a compact `<select>` category filter dropdown.
  - Verified exact module registry counts: 39 total modules (13 Core, 26 Ops) displayed accurately without discrepancies.
  - Two-line module descriptions with full explanations deferred to the Inspector.
- **Focused Right-Side Validation & Inspector:**
  - Removed duplicate facility card and 5-step tutorial text.
  - Clear, actionable validation issues with click-to-focus canvas navigation.
  - Compact collapsible sections with instant status badges.
- **Prominent OpsHub Time Machine USP:**
  - Highlighted Time Machine simulation as OpsHub's signature capability in the toolbar with distinctive purple/indigo styling and USP badge.
  - Safe, deterministic in-memory execution that simulates real-world execution paths without mutating operational data.
  - Step-by-step traversal, active/visited node illumination, traversed edge animation, branching decisions, and simulation logs.

## [1.2.0] - 2026-10-16

### Completed — Complete UX Simplification, Beginner Guidance & Integration Improvement
- **Light Mode as Primary Default Experience:**
  - Configured default theme to `'light'` in `useWorkflowStore.js` and `BuilderLayout.jsx`.
  - Tuned crisp contrast for cards, canvas grid, panels, borders, and text in both light and dark themes.
- **Site Selection & Navigation Disambiguation:**
  - Clearly separated Top Navigation (application areas: Builder, Central Stores, Service Centre, Distribution) from Builder Facility Selector.
  - Added explicit label to Builder selector: `"Editing workflow for: [Facility Name]"`.
  - Facility switching stays inside the Builder without navigating away.
- **Dynamic Accurate Module Counts:**
  - Eliminated discrepancy (was 39 available vs All 33 vs 13 Core • 20 Ops).
  - Dynamically calculated exact module counts (13 Core + 26 Ops = 39 Total) across headers, tabs, and footers.
- **Reliable Template Application Safety:**
  - Trace and verified template loading in `useWorkflowStore.loadTemplate`: verifies `nodes.length > 0`, loads nodes/edges, updates active site to target site, and reports real success.
  - Eliminated false-success banners on empty drafts.
- **Welcoming First-Time Starting Experience (Section 4):**
  - Title: **Create a workflow**; Subtitle: *"Define the steps your team follows to complete an operational process."*
  - Side-by-side Option A (*Start from a template* - recommended for beginners) and Option B (*Build from scratch* - guided experience with 1-click starter module insertion and blank canvas options).
- **Dismissible Guided 5-Step Process (Section 5):**
  - Added floating guided process drawer tracking lifecycle steps (1: Starting trigger, 2: Add next step, 3: Connect steps, 4: Configure steps, 5: Validate and test).
  - Added persistent `(?) Help & Guide` button in bottom canvas HUD for reopening anytime.
- **Strictly Ordered 8-Part Inspector Hierarchy (Section 10):**
  - Restructured Inspector sequence: 1. Node name and icon, 2. What this step does, 3. When to use it, 4. Example, 5. Required configuration (with `*` and inline errors), 6. Optional configuration, 7. Incoming/outgoing connections, 8. Advanced settings (collapsible accordion with IDs and raw JSON).
- **Actionable Plain-English Validation Wording (Section 11):**
  - Replaced technical messages with exact requested plain-English instructions ("This step is not connected to a previous step. Connect a compatible output to its input handle.", "This step is missing a required setting...", "Both True and False output paths must be connected...").

## [1.1.0] - 2026-10-16

### Completed — Beginner-Friendly UX & Usability Enhancement
- **Plain-English Node Guidance Catalog (`nodeExplanations.js`):**
  - Created comprehensive, human-friendly metadata for all 39 workflow modules (what it does, when to use it, real-world examples, recommended next steps, and connection rules).
  - Attached to all modules via `siteModules.js` for universal availability across the application.
- **Obvious Canvas Handles & Connection Micro-Labels (`WorkflowNode.jsx`):**
  - Added visible micro-labels: `Next →` on single output handles, `True →` (emerald) and `False →` (rose) on gateway handles, and `← In` on target handles.
  - Added clear entry banners (`Starting Trigger (Entry Node)`) and terminal banners (`Terminal Outcome (Final Step)`).
  - Embedded beginner-friendly tooltips explaining exact drag behaviors on hover.
- **Smart Non-Overlapping Node Placement (`useWorkflowStore.js`):**
  - Upgraded `addNode` to calculate non-overlapping horizontal positions (`x = lastX + 290`, wrapping rows when `x > 920`).
  - Added dynamic `contextualHint` notification engine generating tailored next-step tips whenever a node is placed.
- **Empty Canvas Onboarding Experience (`WorkflowCanvas.jsx`):**
  - Replaced plain empty state with a structured 5-step beginner SOP lifecycle checklist (Trigger, Steps, Connections, Configuration, Simulation).
  - Added 2 prominent direct action buttons: `Start from a template` (modal trigger) and `Add [Trigger]` (1-click starter module insertion).
  - Added a dismissible floating contextual guidance toast banner at the top of the canvas.
- **Module Palette Usability Enhancements (`ModulePalette.jsx`):**
  - Added collapsible category accordions with chevron toggles for all standard categories.
  - Added inline `(i)` button toggling expandable details drawers directly in the palette.
  - Enriched port badges (`Entry (0 in)`, `Terminal (0 out)`, `2 branches`).
- **Actionable Validation & Connection Feedback (`validateWorkflow.js` & `InspectorPanel.jsx`):**
  - Added concrete `actionHint` strings to every validation rule explaining exactly how to fix the issue.
  - Added prominent actionable callouts in the Inspector's Connections card for missing inbound connections, next step requirements, and unrouted gateway branches.
  - Added a Beginner SOP Quick Guide card to the Inspector's empty state.

## [1.0.0] - 2026-10-16

### Completed
- Completed the full integrated enterprise Visual Workflow Builder and operational site orchestration platform:
  - **Module Registry Reorganization:**
    - Structured all 33 approved modules into 6 standard categories: `Start / Triggers`, `Operations`, `Decisions / Gateways`, `Approvals`, `End / Outcomes`, and `System Integrations`.
    - Added dedicated End/Outcome nodes with 0 outputs (`common-success-outcome`, `common-quarantine-outcome`, `common-dispatch-outcome`).
    - Added missing required template modules: `stores-stock-check`, `service-inspection`, `dist-returns-processing`.
  - **Topology & Gateway Validation Hardening:**
    - Dedicated Start semantics: 0-inbound nodes do not trigger missing inbound warnings.
    - Dedicated End semantics: 0-outbound nodes do not trigger missing outbound warnings.
    - Gateway rules: 2-output Conditional Routers must connect both `out-true` and `out-false` paths, preventing runtime dead-ends.
  - **Predefined Operational Templates:**
    - Central Stores: Requisition Intake -> Stock Availability Check -> Supervisor Approval Gate -> Material Allocation -> Completed & Staged.
    - Service Centre: Repair Request Intake -> Diagnostic Inspection & Triage -> Conditional Defect Router -> Lead Tech Approval / PCB Soldering -> Return-to-Service Validation.
    - Distribution: Outbound Order Intake -> Material Assignment & Scan -> Lot Consumption Logging -> RMA Returns -> Carrier Dispatch Handoff.
    - Create from Scratch: Clean blank canvas.
  - **Customization Modal (`TemplateSelectorModal.jsx`):**
    - Modal for previewing template steps, inspecting topology health, filtering by facility, and loading into active draft.
  - **Draft Persistence & Publishing Service (`WorkflowService.js`):**
    - Client-side persistence via `localStorage` with fallback to facility baseline templates.
    - Documented REST backend endpoints (`/api/v1/sites/:siteId/workflows/...`).
    - Semantic versioning engine with automated patch, minor, and major version increments.
    - Pre-flight validation gate blocking invalid workflows from publishing.
    - Mandatory audit changelog logging.
  - **Version History & Safe Rollback (`VersionHistoryModal.jsx`):**
    - Full chronological audit history of published SOPs per site.
    - One-click safe rollback to historical versions with audit reason stamp.
    - Live active SOP synchronization for operational dashboards upon rollback.
  - **Role-Based Access Control (`authService.js`):**
    - User roles: `ADMIN`, `OPERATIONS_LEAD`, `OPERATOR`.
    - Demo user switcher in top navigation.
    - Strict Admin guards on canvas editing, node deletion, draft saving, publishing, and rollback.
  - **Live Operational Dashboards:**
    - `CentralStoresDashboard.jsx`: Live inventory table, requisition queues, stock checks, approval gates, and material allocation consuming published SOP.
    - `ServiceCentreDashboard.jsx`: Repair ticket intake, diagnostic inspection, critical defect branching, PCB soldering, and return-to-service validation consuming published SOP.
    - `DistributionDashboard.jsx`: Outbound shipment manifests, lot consumption logging, carrier dispatch, and RMA returns consuming published SOP.
  - **App Shell Navigation (`AppShell.jsx`):**
    - Enterprise top navigation bar with view switcher (Workflow Builder, Central Stores, Service Centre, Distribution).
    - User RBAC demo switcher dropdown, facility badges, and global Light/Dark theme toggle.

### Affected Files
- `src/App.jsx` (Modified)
- `src/app/AppShell.jsx` (Added)
- `src/features/builder/registry/siteModules.js` (Modified)
- `src/features/builder/validation/validateWorkflow.js` (Modified)
- `src/features/builder/nodes/WorkflowNode.jsx` (Modified)
- `src/features/builder/components/ModulePalette.jsx` (Modified)
- `src/features/builder/components/BuilderToolbar.jsx` (Modified)
- `src/features/builder/components/BuilderLayout.jsx` (Modified)
- `src/features/builder/components/TemplateSelectorModal.jsx` (Added)
- `src/features/builder/components/PublishWorkflowModal.jsx` (Added)
- `src/features/builder/components/VersionHistoryModal.jsx` (Added)
- `src/features/builder/services/workflowService.js` (Added)
- `src/features/builder/services/authService.js` (Added)
- `src/features/builder/templates/workflowTemplates.js` (Added)
- `src/features/builder/store/useWorkflowStore.js` (Modified)
- `src/features/central-stores/CentralStoresDashboard.jsx` (Added)
- `src/features/service-centre/ServiceCentreDashboard.jsx` (Added)
- `src/features/distribution/DistributionDashboard.jsx` (Added)
- `src/features/builder/docs/PROJECT_STATE.md` (Modified)
- `src/features/builder/docs/PROGRESS.md` (Modified)
- `src/features/builder/docs/CHANGELOG.md` (Modified)
- `src/features/builder/docs/DECISIONS.md` (Modified)
- `src/features/builder/docs/FILE_MAP.md` (Modified)
- `src/features/builder/docs/NEXT_STEPS.md` (Modified)

---

## [0.5.0] - 2026-10-15

### Added
- Implemented Part 5 Time Machine Simulation:
  - **Time Machine Controls:** Integrated toolbar Time Machine button with full simulation lifecycle (`startSimulation`, `stepForward`, `chooseBranch`, `restartSimulation`, `exitSimulation`).
  - **State Isolation & Mutation Guards:** Locked all canvas mutations and disabled palette dragging during simulation mode.
  - **Step-by-Step Graph Traversal:** Traverses active site's placed workflow nodes and connections sequentially.
  - **Visual Node Highlighting:** Current active node illuminated with `border-amber-400 ring-4 ring-amber-400/50 animate-pulse`; visited nodes marked with emerald accent ring.
  - **Traversed Edge Illumination:** Canvas edges dynamically styled; traversed edges illuminate in bright animated amber.
  - **Floating Simulation Control Deck:** Canvas-top floating HUD with simulation status badge, step counter, Step Forward, Restart, and Exit buttons.
  - **Pre-Flight Topology & Health Validation:** Integrated `validateWorkflow.js` engine; detects empty graphs and blocks invalid topologies.
