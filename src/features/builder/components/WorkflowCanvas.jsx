import {
  Workflow,
  Sparkles,
  Compass,
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { SITES } from '../registry/siteModules'

export function WorkflowCanvas() {
  const activeSite = useWorkflowStore((s) => s.activeSite)
  const siteDrafts = useWorkflowStore((s) => s.siteDrafts)
  const isSimulationMode = useWorkflowStore((s) => s.isSimulationMode)

  const currentDraft = siteDrafts[activeSite] || {}
  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]
  const zoom = currentDraft.zoom || 100

  return (
    <main
      className="flex-1 h-full relative overflow-hidden bg-slate-950 select-none flex flex-col justify-center items-center"
      style={{
        backgroundImage: `radial-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px)`,
        backgroundSize: `${24 * (zoom / 100)}px ${24 * (zoom / 100)}px`,
      }}
    >
      {/* Simulation Banner when simulation mode is active */}
      {isSimulationMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-lg shadow-black/50 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide">
            OpsHub Time Machine Simulation Active
          </span>
          <span className="text-[10px] text-amber-400/80 font-mono">
            (Scrubbing & what-if parameters enabled in Part 5)
          </span>
        </div>
      )}

      {/* Main Empty State Content */}
      <div
        className="max-w-xl mx-auto px-6 py-8 text-center flex flex-col items-center transition-transform duration-200"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        {/* Visual Glyph */}
        <div className="relative mb-5 group">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-900/60 to-indigo-900/40 border border-purple-500/30 flex items-center justify-center shadow-xl shadow-purple-950/40">
            <Workflow className="w-10 h-10 text-purple-400 group-hover:scale-105 transition-transform" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-lg font-bold text-slate-100 tracking-tight mb-2">
          Drag modules here to build your workflow
        </h1>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
          You are editing the operational canvas for{' '}
          <span className="text-purple-300 font-semibold">{currentSiteMeta.name}</span>.
          Select approved modules from the left palette to inspect their domain contracts, parameters, and routing rules.
        </p>

        {/* 3 Quick-Start Step Cards */}
        <div className="grid grid-cols-3 gap-3 w-full text-left mb-6">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="w-5 h-5 rounded bg-purple-500/20 text-purple-300 text-[11px] font-bold flex items-center justify-center mb-2 font-mono">
              1
            </div>
            <h2 className="text-xs font-semibold text-slate-200 mb-1">Pick a Trigger</h2>
            <p className="text-[11px] text-slate-400 leading-normal">
              Select stock arrivals, repair tickets, or order queues to initialize the lifecycle.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="w-5 h-5 rounded bg-purple-500/20 text-purple-300 text-[11px] font-bold flex items-center justify-center mb-2 font-mono">
              2
            </div>
            <h2 className="text-xs font-semibold text-slate-200 mb-1">Chain Operations</h2>
            <p className="text-[11px] text-slate-400 leading-normal">
              Connect inventory allocation, technician triage, QA gates, and dispatch actions.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="w-5 h-5 rounded bg-purple-500/20 text-purple-300 text-[11px] font-bold flex items-center justify-center mb-2 font-mono">
              3
            </div>
            <h2 className="text-xs font-semibold text-slate-200 mb-1">Simulate & Diff</h2>
            <p className="text-[11px] text-slate-400 leading-normal">
              Validate topology, scrub in the Time Machine, and publish version-stamped SOPs.
            </p>
          </div>
        </div>

        {/* Integration Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
          <span>Part 1: UI Foundation Active</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">XYFlow Interactive Canvas connecting in Part 2</span>
        </div>
      </div>

      {/* Canvas HUD Overlays */}
      {/* Bottom-Left: Site & Draft Info */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 backdrop-blur shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="font-semibold text-slate-200">{currentSiteMeta.name}</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 font-mono text-[10px]">
          {currentDraft.nodes?.length || 0} nodes • {currentDraft.edges?.length || 0} edges
        </span>
      </div>

      {/* Bottom-Right: Canvas Zoom & Compass */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 backdrop-blur shadow-md">
        <Compass className="w-3.5 h-3.5 text-purple-400" />
        <span className="font-mono text-slate-300">{zoom}% Zoom</span>
        <span className="text-slate-600">|</span>
        <span className="text-[10px] text-slate-500 font-mono">Grid 24px</span>
      </div>
    </main>
  )
}
