# Next Steps — Part 1: Builder UI Foundation

Detailed plan and acceptance criteria for the immediate next development milestone.

---

## Next Task Objective

Implement **Part 1: Builder UI Foundation** within `src/features/builder/` to establish the visual layout, structural panels, action toolbar, and core Zustand store skeleton before integrating the `@xyflow/react` canvas.

---

## Scope of Work

1. **Feature Directory Structure Setup:**
   - Create subdirectories:
     - `src/features/builder/components/`
     - `src/features/builder/store/`
     - `src/features/builder/nodes/`
     - `src/features/builder/registry/`
     - `src/features/builder/validation/`

2. **UI Frame Components:**
   - `BuilderLayout.jsx`: Responsive 3-column layout (Palette on left, Canvas in center, Inspector on right) with a persistent top toolbar and bottom status bar.
   - `BuilderToolbar.jsx`: Interactive top bar with:
     - Workflow title and editable name input.
     - Undo / Redo buttons (disabled states when history is empty).
     - Zoom controls (Zoom In, Zoom Out, Fit View).
     - Clear Canvas button with confirmation modal.
     - Simulation Mode toggle button (switches UI theme/mode for Time Machine).
   - `NodePalette.jsx`: Left-panel placeholder categorized into accordion sections:
     - Central Stores
     - Service Centre
     - Distribution
     - Flow Control (Triggers, Approvals, Conditions, Transit)
   - `InspectorPanel.jsx`: Right-panel properties drawer displaying placeholder prompt when no node is selected.
   - `StatusBar.jsx`: Bottom status line displaying:
     - Node count & Edge count.
     - Graph validation badge ("Valid" / "X Issues Found").
     - Viewport zoom percentage.

3. **Core Store Foundation (`useWorkflowStore.js`):**
   - Initialize Zustand store holding:
     - `nodes: []`
     - `edges: []`
     - `selectedNodeId: null`
     - `history: { past: [], future: [] }`
     - `simulationMode: false`
     - Basic actions: `setNodes`, `setEdges`, `selectNode`, `toggleSimulationMode`, `clearGraph`.

4. **Mounting / View Integration:**
   - Wire the `BuilderLayout` into the application view (e.g., via `src/App.jsx` or a designated route) cleanly without disrupting project configurations.

---

## Acceptance Criteria

- [ ] **AC-1:** The Builder layout renders without errors on `npm run dev` in standard modern desktop viewports (1280px+).
- [ ] **AC-2:** The 3-panel split (Palette, Canvas container, Inspector) and Toolbar are cleanly styled using Tailwind CSS classes without overflowing the viewport height (`h-screen overflow-hidden`).
- [ ] **AC-3:** Clicking the "Simulation Mode" toggle visually shifts the toolbar state to indicate simulation readiness.
- [ ] **AC-4:** The Inspector panel accurately reflects the empty state when `selectedNodeId` is `null`.
- [ ] **AC-5:** All UI icons utilize `lucide-react` components consistently.
- [ ] **AC-6:** `useWorkflowStore` is fully accessible and reacts to dispatched actions cleanly without re-rendering unrelated panels.
- [ ] **AC-7:** No lint errors produced by `oxlint`.

---

## Non-Goals for Part 1

- Do not implement `@xyflow/react` drag-and-drop connection logic yet (reserved for Part 2).
- Do not build custom node components or connection lines yet (reserved for Part 2).
- Do not populate live operational site APIs or mock simulation engines yet (reserved for Parts 3 & 5).
