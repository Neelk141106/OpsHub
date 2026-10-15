# Changelog

All notable changes to the OpsHub project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-10-15

### Added
- Initialized React 19 + Vite frontend application.
- Installed core runtime dependencies:
  - `react-router-dom` for client-side routing.
  - `lucide-react` for consistent system iconography.
  - `recharts` for operational telemetry and KPI data visualizations.
  - `@xyflow/react` for the drag-and-drop workflow canvas and node editor.
  - `zustand` for lightweight, decoupled application state management.
- Installed and configured styling toolchain:
  - Tailwind CSS v3 (`tailwindcss@3.4.19`).
  - PostCSS (`postcss@8.5.30`).
  - Autoprefixer (`autoprefixer@10.6.1`).
- Configured content sources in `tailwind.config.js` (`index.html` and `src/**/*.{js,ts,jsx,tsx}`).
- Configured `src/index.css` with Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) and global base defaults (box-sizing, clean body margins, modern system font stack).
- Scaffolding of standard modular architecture within `src/`:
  - `src/app/` — Application shell, layout providers, routing setup.
  - `src/components/` — Shared reusable UI primitives.
  - `src/config/` — Environment and site settings.
  - `src/data/` — Static seed data, mock schemas, simulation fixtures.
  - `src/features/builder/` — Interactive visual workflow designer.
  - `src/features/central-stores/` — Inventory depot and intake workflows.
  - `src/features/service-centre/` — Diagnostics, maintenance, and repair operations.
  - `src/features/distribution/` — Dispatch, packing, and outbound fulfillment.
  - `src/lib/` — Shared utilities and formatters.
  - `src/store/` — Zustand store definitions.
- Created `PROJECT_CONTEXT.md` documenting platform scope, three operational sites, key feature sets (Builder, Time Machine, Config Diff, OpsHub Pulse), technology stack, and frontend-first development strategy.
- Updated `.gitignore` to explicitly ignore `node_modules/`, `dist/`, `.env`, `.env.*`, while retaining `!.env.example`.
