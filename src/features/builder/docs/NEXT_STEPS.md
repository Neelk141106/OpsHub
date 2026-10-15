# Next Steps — Part 5: OpsHub Time Machine Simulation

Detailed plan and acceptance criteria for the upcoming development milestone.

---

## Next Task Objective

Implement **Part 5: OpsHub Time Machine Simulation** within `src/features/builder/` to establish a deterministic simulation runner, timeline scrubbing controls, scenario overrides, and bottleneck telemetry for operational workflows.

---

## Scope of Work

1. **Deterministic Simulation Runner:**
   - Event traversal engine advancing mock items through placed workflow modules.
   - Simulation state tracking: queue depth, processing latency, active node status, and edge transit progress.

2. **Playback Control Bar:**
   - Play / Pause / Step Forward / Step Back / Speed (1x, 2x, 5x, 10x).
   - Timeline scrubber with elapsed execution time and total estimated duration.

3. **Visual Execution Highlighting:**
   - Active node pulsing / glowing execution state.
   - Animated transit particles / edge stroke changes during payload movement.

4. **What-If Scenario Overrides:**
   - Technician capacity multiplier for Service Centre.
   - Inbound arrival rate / stock delivery latency for Central Stores.
   - Carrier transit delays / freight capacity for Distribution.

5. **Operational Telemetry & Bottleneck Overlay:**
   - Real-time queue counters on node badges.
   - Visual bottleneck alert when a node's processing time exceeds throughput limits.

---

## Acceptance Criteria

- [ ] **AC-1:** Operator can launch the Time Machine simulator from the toolbar and scrub through execution steps.
- [ ] **AC-2:** Playback controls (Play, Pause, Step) accurately update node execution states.
- [ ] **AC-3:** Scenario overrides allow testing high-load and bottleneck conditions dynamically.
- [ ] **AC-4:** Clean build via `npm run build` and zero warnings from `oxlint`.
- [ ] **AC-5:** Full Light and Dark theme consistency with zero regression in Parts 1–4.

---

## Non-Goals for Part 5

- Do not implement backend persistence or database publishing (reserved for Part 6).
- Do not implement export/import serialization (reserved for Part 6).
- Do not modify teammate dashboards outside `src/features/builder/`.
