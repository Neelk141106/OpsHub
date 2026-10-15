# Next Steps — Part 4: Validation and Preview

Detailed plan and acceptance criteria for the upcoming development milestone.

---

## Next Task Objective

Implement **Part 4: Validation and Preview** within `src/features/builder/` to establish a dry-run execution simulator, linear workflow trace, and topological cycle analysis prior to Time Machine simulation and publishing.

---

## Scope of Work

1. **Dry-Run Path Simulation:**
   - Linear flow tracer that follows events from trigger/entry nodes through intermediate actions to terminal outputs.
   - Trace step highlighting: sequentially highlights nodes and edges along the active execution path.

2. **Topological Graph Analysis:**
   - Detect circular dependency loops (excluding configured retry cycles).
   - Verify contract schema compatibility between connected source output types and target input types.

3. **Read-Only Preview Drawer:**
   - Modal or drawer previewing the sanitized, executable workflow graph JSON representation.

---

## Acceptance Criteria

- [ ] **AC-1:** Operator can trigger "Dry-Run Simulation" from the toolbar or inspector to preview execution sequencing.
- [ ] **AC-2:** Circular loops are flagged with actionable remediation recommendations.
- [ ] **AC-3:** Contract mismatches between connected ports are clearly displayed.
- [ ] **AC-4:** Clean build via `npm run build` and zero warnings from `oxlint`.

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
