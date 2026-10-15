import { useState } from 'react'
import {
  Boxes,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  Save,
  UploadCloud,
  ChevronDown,
  Warehouse,
  Wrench,
  Truck,
  CheckCircle2,
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { SITES } from '../registry/siteModules'

export function BuilderToolbar() {
  const activeSite = useWorkflowStore((s) => s.activeSite)
  const siteDrafts = useWorkflowStore((s) => s.siteDrafts)
  const setActiveSite = useWorkflowStore((s) => s.setActiveSite)
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName)
  const isSimulationMode = useWorkflowStore((s) => s.isSimulationMode)
  const toggleSimulationMode = useWorkflowStore((s) => s.toggleSimulationMode)
  const zoomIn = useWorkflowStore((s) => s.zoomIn)
  const zoomOut = useWorkflowStore((s) => s.zoomOut)
  const resetZoom = useWorkflowStore((s) => s.resetZoom)
  const undo = useWorkflowStore((s) => s.undo)
  const redo = useWorkflowStore((s) => s.redo)
  const triggerSaveDraft = useWorkflowStore((s) => s.triggerSaveDraft)
  const triggerPublish = useWorkflowStore((s) => s.triggerPublish)

  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false)
  const currentDraft = siteDrafts[activeSite] || {}
  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]

  const pastCount = currentDraft.history?.past?.length || 0
  const futureCount = currentDraft.history?.future?.length || 0

  const getSiteIcon = (id) => {
    switch (id) {
      case 'central-stores':
        return <Warehouse className="w-4 h-4 text-emerald-400" />
      case 'service-centre':
        return <Wrench className="w-4 h-4 text-amber-400" />
      case 'distribution':
        return <Truck className="w-4 h-4 text-cyan-400" />
      default:
        return <Boxes className="w-4 h-4 text-purple-400" />
    }
  }

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-3 text-slate-200 select-none z-20">
      {/* Left: Branding & Site Selector */}
      <div className="flex items-center gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-950/50">
            <Boxes className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">OpsHub</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                Builder
              </span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Orchestrator
            </span>
          </div>
        </div>

        {/* Site Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSiteDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            title="Switch operational site (drafts are isolated per site)"
          >
            {getSiteIcon(currentSiteMeta.id)}
            <span className="font-semibold">{currentSiteMeta.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {siteDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl shadow-black/60 py-1.5 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 tracking-wider uppercase border-b border-slate-800">
                Operational Site
              </div>
              {SITES.map((site) => {
                const isSelected = site.id === activeSite
                return (
                  <button
                    key={site.id}
                    type="button"
                    onClick={() => {
                      setActiveSite(site.id)
                      setSiteDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-800 transition-colors ${
                      isSelected ? 'bg-purple-950/40 text-purple-200' : 'text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5">{getSiteIcon(site.id)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{site.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{site.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Workflow Title Input */}
        <div className="flex items-center gap-2 pl-2">
          <span className="text-slate-600 text-sm">/</span>
          <input
            type="text"
            value={currentDraft.workflowName || ''}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent hover:bg-slate-800/60 focus:bg-slate-950 border border-transparent focus:border-purple-500/50 rounded px-2 py-1 text-xs font-medium text-slate-100 focus:outline-none transition-colors w-64 truncate"
            title="Click to rename workflow draft"
          />
        </div>
      </div>

      {/* Center: Undo/Redo & Zoom Controls */}
      <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800/80">
        {/* Undo */}
        <button
          type="button"
          onClick={undo}
          disabled={pastCount === 0}
          title={pastCount > 0 ? `Undo (${pastCount} actions available)` : 'Nothing to undo'}
          className={`p-1.5 rounded transition-colors ${
            pastCount > 0
              ? 'hover:bg-slate-800 text-slate-200'
              : 'text-slate-600 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={redo}
          disabled={futureCount === 0}
          title={futureCount > 0 ? `Redo (${futureCount} actions available)` : 'Nothing to redo'}
          className={`p-1.5 rounded transition-colors ${
            futureCount > 0
              ? 'hover:bg-slate-800 text-slate-200'
              : 'text-slate-600 cursor-not-allowed'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        {/* Zoom Out */}
        <button
          type="button"
          onClick={zoomOut}
          title="Zoom out (min 40%)"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Zoom percentage */}
        <span className="text-[11px] font-mono font-medium text-slate-400 w-11 text-center select-none">
          {currentDraft.zoom || 100}%
        </span>

        {/* Zoom In */}
        <button
          type="button"
          onClick={zoomIn}
          title="Zoom in (max 200%)"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Reset Zoom */}
        <button
          type="button"
          onClick={resetZoom}
          title="Reset zoom to 100%"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Simulation Toggle, Save & Publish */}
      <div className="flex items-center gap-2">
        {/* Simulation Mode Toggle */}
        <button
          type="button"
          onClick={toggleSimulationMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
            isSimulationMode
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950/40'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
          title="Toggle OpsHub Time Machine simulation mode"
        >
          {isSimulationMode ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Simulation Active</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-slate-400" />
              <span>Time Machine</span>
            </>
          )}
        </button>

        {/* Save Draft Button */}
        <button
          type="button"
          onClick={triggerSaveDraft}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          title="Save draft to local memory"
        >
          <Save className="w-3.5 h-3.5 text-purple-400" />
          <span>Save Draft</span>
        </button>

        {/* Publish Button */}
        <button
          type="button"
          onClick={triggerPublish}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-sm shadow-purple-900/50 transition-colors"
          title="Publish workflow (Integration enabled in Part 6)"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Publish</span>
        </button>
      </div>
    </header>
  )
}
