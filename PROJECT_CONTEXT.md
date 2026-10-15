# OpsHub — Project Context & Architecture Guide

## Overview

OpsHub is an operational workflow and intelligence platform engineered to streamline, monitor, simulate, and optimize complex operational lifecycles across distributed operational facilities. It acts as a single pane of glass and orchestration plane for supply chain, service operations, and fulfillment logistics.

---

## Operational Sites

OpsHub coordinates operations across three primary functional hubs:

1. **Central Stores**
   - **Role:** Centralized inventory depot, warehousing, and material intake.
   - **Key Capabilities:** Receiving logistics, lot and serial tracking, stock buffering, storage staging, and inventory allocation across demand channels.
   - **Interactions:** Dispatches raw parts and assemblies to the Service Centre; stages outbound finished goods for Distribution.

2. **Service Centre**
   - **Role:** Maintenance, repair, testing, and refurbishment operations.
   - **Key Capabilities:** Ticket-driven intake, technician triage and assignment, diagnostics execution, component replacement, QA inspection gates, and return-to-service validation.
   - **Interactions:** Requests parts from Central Stores; routes serviced and validated units to Distribution or back to inventory.

3. **Distribution**
   - **Role:** Outbound order fulfillment, freight management, and logistics handoff.
   - **Key Capabilities:** Picking, packing, dispatch verification, routing optimization, carrier manifest generation, and transit milestone monitoring.
   - **Interactions:** Receives stock from Central Stores and repaired equipment from the Service Centre to fulfill external customer or regional depot requisitions.

---

## Core System Modules

### 1. Drag-and-Drop Workflow Builder
- **Visual Canvas:** Built atop `@xyflow/react` to provide a node-based visual workflow designer.
- **Node Topology:** Supports triggers, automated action steps, manual approval gates, conditional branch routers, and inter-site transit connectors.
- **Operator Autonomy:** Allows operations engineers and site managers to build, adjust, and publish standard operating procedures (SOPs) visually without code deployments.

### 2. Time Machine Simulation
- **Historical Playback & Scrubbing:** Scrub forward and backward across operational timelines to investigate anomalies, outages, or throughput drops.
- **Predictive What-If Modeling:** Simulate future operational shifts by adjusting variable parameters (e.g., technician availability, inbound freight surges, machine downtime) to forecast bottlenecks before they manifest in production.
- **Deterministic Step-Through:** Trace item-level lifecycles event-by-event through the configured node graph.

### 3. Config Diff
- **Configuration Versioning:** Inspect changes between workflow revisions, site operating parameters, and deployment profiles.
- **Visual Comparison:** Provides unified and side-by-side diffing of node graphs, rules, and configuration parameters to prevent accidental configuration drift across sites and environments.
- **Audit & Governance:** Tracks parameter modifications, version tags, and authorization stamps.

### 4. OpsHub Pulse
- **Operational Telemetry:** Real-time health monitoring and operational status across Central Stores, Service Centre, and Distribution.
- **Throughput & Bottleneck Detection:** Real-time throughput indicators, active queue depths, cycle time anomalies, and SLA threshold alerts.
- **Visual Analytics:** Interactive dashboards powered by `recharts` and `lucide-react` for immediate operational situational awareness.

---

## Technology Stack

| Layer | Technology | Version / Details |
|---|---|---|
| **Core Framework** | React | 19.x |
| **Bundler & Dev Server** | Vite | 8.x |
| **Routing** | React Router | 7.x (`react-router-dom`) |
| **Styling** | Tailwind CSS | 3.x with PostCSS & Autoprefixer |
| **Iconography** | Lucide React | 1.x (`lucide-react`) |
| **Data Visualization** | Recharts | 3.x (`recharts`) |
| **Node Graph / Canvas** | XYFlow React | 12.x (`@xyflow/react`) |
| **State Management** | Zustand | 5.x (`zustand`) |
| **Linter** | Oxlint | Fast code analysis |

---

## Frontend-First Development Strategy

1. **Decoupled Velocity:** The initial milestones prioritize fully interactive, highly responsive client-side experiences driven by realistic mock data models and deterministic state machines.
2. **Contract-Driven Design:** UI modules and stores are modeled after clean domain interfaces, ensuring straightforward API integration when backend services come online.
3. **Zustand Reactive Stores:** State is encapsulated in modular Zustand stores, decoupling UI rendering from transport layers and persistence.
4. **Iterative Feature Scaffolding:** Each operational domain resides in its dedicated feature boundary (`features/*`), promoting modular development, isolated testing, and clean dependency boundaries.

---

## Project Structure

```text
OpsHub/
├── public/                 # Static assets
├── src/
│   ├── app/                # App-level routing, shell, layout providers
│   ├── components/         # Shared reusable UI primitives (buttons, modals, cards)
│   ├── config/             # Site configuration, route definitions, constants
│   ├── data/               # Mock datasets, fixtures, simulation seed data
│   ├── features/
│   │   ├── builder/        # Workflow Canvas (@xyflow/react nodes & edges)
│   │   ├── central-stores/ # Inventory and intake workflows
│   │   ├── service-centre/ # Repair and refurbishment workflows
│   │   └── distribution/   # Outbound and fulfillment workflows
│   ├── lib/                # Utility functions, formatters, helpers
│   ├── store/              # Zustand global state slices
│   ├── App.jsx             # Root application component
│   ├── App.css             # Root styles
│   ├── index.css           # Tailwind base styles and theme definitions
│   └── main.jsx            # Application entry point
├── .gitignore              # Git ignore rules
├── CHANGELOG.md            # History of changes and milestones
├── PROJECT_CONTEXT.md      # Platform context and architecture
├── package.json            # Project manifest & dependencies
├── postcss.config.js       # PostCSS pipeline configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```
