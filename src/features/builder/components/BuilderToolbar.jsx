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
  Trash,
  Sun,
  Moon,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { SITES } from '../registry/siteModules'

export function BuilderToolbar() {
  const { zoomIn: flowZoomIn, zoomOut: flowZoomOut, fitView } = useReactFlow()

  const theme = useWorkflowStore((s) => s.theme)
  const isDark = theme === 'dark'
  const toggleTheme = useWorkflowStore((s) => s.toggleTheme)

  const activeSite = useWorkflowStore((s) => s.activeSite)
  const siteDrafts = useWorkflowStore((s) => s.siteDrafts)
  const setActiveSite = useWorkflowStore((s) => s.setActiveSite)
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName)
  const isPreviewMode = useWorkflowStore((s) => s.isPreviewMode)
  const togglePreviewMode = useWorkflowStore((s) => s.togglePreviewMode)
  const isSimulationMode = useWorkflowStore((s) => s.isSimulationMode)
  const toggleSimulationMode = useWorkflowStore((s) => s.toggleSimulationMode)
  const undo = useWorkflowStore((s) => s.undo)
  const redo = useWorkflowStore((s) => s.redo)
  const clearGraph = useWorkflowStore((s) => s.clearGraph)
  const triggerSaveDraft = useWorkflowStore((s) => s.triggerSaveDraft)
  const triggerPublish = useWorkflowStore((s) => s.triggerPublish)

  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false)
  const currentDraft = siteDrafts[activeSite] || {
    nodes: [],
    edges: [],
    history: { past: [], future: [] },
    workflowName: '',
  }
  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]

  const pastCount = currentDraft.history?.past?.length || 0
  const futureCount = currentDraft.history?.future?.length || 0
  const nodeCount = currentDraft.nodes?.length || 0

  const handleZoomIn = () => {
    flowZoomIn({ duration: 250 })
  }

  const handleZoomOut = () => {
    flowZoomOut({ duration: 250 })
  }

  const handleFitView = () => {
    fitView({ padding: 0.25, duration: 300 })
  }

  const getSiteIcon = (id) => {
    switch (id) {
      case 'central-stores':
        return <Warehouse className="w-4 h-4 text-emerald-500" />
      case 'service-centre':
        return <Wrench className="w-4 h-4 text-amber-500" />
      case 'distribution':
        return <Truck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
      default:
        return <Boxes className="w-4 h-4 text-purple-500" />
    }
  }

  return (
    <header
      className={`h-14 border-b px-4 flex items-center justify-between gap-3 select-none z-20 transition-colors duration-150 ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      {/* Left: Branding, Site Selector & Editable Workflow Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Brand */}
        <div className={`flex items-center gap-2.5 pr-3 border-r ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-sm">
            <Boxes className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                OpsHub
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-300 font-semibold border border-purple-500/30">
                Builder
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Workflows
            </span>
          </div>
        </div>

        {/* Site Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSiteDropdownOpen((v) => !v)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isDark
                ? 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-100'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
            title="Switch operational site (Drafts are strictly isolated per facility)"
          >
            {getSiteIcon(currentSiteMeta.id)}
            <span>{currentSiteMeta.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {siteDropdownOpen && (
            <div
              className={`absolute top-full left-0 mt-1.5 w-72 border rounded-xl shadow-xl py-1.5 z-50 transition-all ${
                isDark ? 'bg-slate-900 border-slate-700 shadow-black/60' : 'bg-white border-slate-200 shadow-slate-300/80'
              }`}
            >
              <div className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase border-b ${
                isDark ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-100'
              }`}>
                Operational Facility Scope
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
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 transition-colors ${
                      isSelected
                        ? isDark
                          ? 'bg-purple-950/40 text-purple-200 font-medium'
                          : 'bg-purple-50 text-purple-900 font-medium'
                        : isDark
                        ? 'hover:bg-slate-800 text-slate-300'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5">{getSiteIcon(site.id)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{site.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{site.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Workflow Title Input */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-slate-400 text-sm select-none">/</span>
          <input
            type="text"
            value={currentDraft.workflowName || ''}
            onChange={(e) => setWorkflowName(e.target.value)}
            disabled={isPreviewMode}
            className={`border rounded-md px-2 py-1 text-xs font-semibold focus:outline-none transition-colors w-64 max-w-xs truncate ${
              isPreviewMode
                ? isDark
                  ? 'bg-slate-950/40 border-transparent text-slate-300 cursor-default'
                  : 'bg-slate-100/60 border-transparent text-slate-700 cursor-default'
                : isDark
                ? 'bg-transparent hover:bg-slate-800/60 focus:bg-slate-950 border-transparent focus:border-purple-500 text-slate-100'
                : 'bg-transparent hover:bg-slate-100 focus:bg-white border-transparent focus:border-purple-500 text-slate-800'
            }`}
            title={isPreviewMode ? 'Workflow renaming locked in Preview mode' : 'Click to rename workflow draft'}
            placeholder="Workflow title..."
          />
          {isPreviewMode && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40 font-semibold tracking-wide uppercase">
              Preview Mode
            </span>
          )}
        </div>
      </div>

      {/* Center: History, Canvas Navigation & Clear Controls */}
      <div className={`flex items-center gap-1 p-1 rounded-lg border ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100/90 border-slate-200'
      }`}>
        {/* Undo */}
        <button
          type="button"
          onClick={undo}
          disabled={pastCount === 0 || isPreviewMode || isSimulationMode}
          title={
            isSimulationMode
              ? 'Undo disabled during simulation'
              : isPreviewMode
              ? 'Undo disabled in Preview mode'
              : pastCount > 0
              ? `Undo (${pastCount} actions available, Ctrl+Z)`
              : 'Nothing to undo'
          }
          className={`p-1.5 rounded-md transition-colors ${
            !isPreviewMode && !isSimulationMode && pastCount > 0
              ? isDark
                ? 'hover:bg-slate-800 text-slate-200 cursor-pointer'
                : 'hover:bg-white text-slate-700 shadow-xs cursor-pointer'
              : 'text-slate-400 opacity-40 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={redo}
          disabled={futureCount === 0 || isPreviewMode || isSimulationMode}
          title={
            isSimulationMode
              ? 'Redo disabled during simulation'
              : isPreviewMode
              ? 'Redo disabled in Preview mode'
              : futureCount > 0
              ? `Redo (${futureCount} actions available, Ctrl+Y)`
              : 'Nothing to redo'
          }
          className={`p-1.5 rounded-md transition-colors ${
            !isPreviewMode && !isSimulationMode && futureCount > 0
              ? isDark
                ? 'hover:bg-slate-800 text-slate-200 cursor-pointer'
                : 'hover:bg-white text-slate-700 shadow-xs cursor-pointer'
              : 'text-slate-400 opacity-40 cursor-not-allowed'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <div className={`w-[1px] h-4 mx-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`} />

        {/* Zoom Out (Fully active in Preview and Simulation modes) */}
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom out"
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-white text-slate-700 shadow-xs'
          }`}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Fit View / Center (Fully active in Preview and Simulation modes) */}
        <button
          type="button"
          onClick={handleFitView}
          title="Fit view to show all nodes"
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-white text-slate-600 hover:text-slate-900 shadow-xs'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Zoom In (Fully active in Preview and Simulation modes) */}
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom in"
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-white text-slate-700 shadow-xs'
          }`}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Clear Canvas */}
        <div className={`w-[1px] h-4 mx-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`} />
        <button
          type="button"
          onClick={clearGraph}
          disabled={nodeCount === 0 || isPreviewMode || isSimulationMode}
          title={
            isSimulationMode
              ? 'Clear canvas disabled during simulation'
              : isPreviewMode
              ? 'Clear canvas disabled in Preview mode'
              : nodeCount > 0
              ? `Clear ${nodeCount} nodes from canvas`
              : 'Canvas is empty'
          }
          className={`p-1.5 rounded-md transition-colors ${
            !isPreviewMode && !isSimulationMode && nodeCount > 0
              ? 'hover:bg-rose-500/15 text-slate-400 hover:text-rose-500 cursor-pointer'
              : 'text-slate-400 opacity-40 cursor-not-allowed'
          }`}
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Theme Toggle, Preview Button, Time Machine Simulation, Save Draft & Publish */}
      <div className="flex items-center gap-2">
        {/* Light / Dark Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-800/90 hover:bg-slate-800 text-amber-400 border-slate-700'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
          }`}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* PREVIEW BUTTON (Part 4) */}
        <button
          type="button"
          onClick={togglePreviewMode}
          disabled={isSimulationMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isSimulationMode
              ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-500'
              : isPreviewMode
              ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500 shadow-sm ring-2 ring-purple-500/30 cursor-pointer'
              : isDark
              ? 'bg-slate-800/90 hover:bg-slate-800 text-purple-300 hover:text-purple-200 border-purple-500/30 hover:border-purple-500/50 cursor-pointer'
              : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 shadow-xs cursor-pointer'
          }`}
          title={
            isSimulationMode
              ? 'Preview mode disabled during active simulation'
              : isPreviewMode
              ? 'Exit Preview mode and return to full canvas editor'
              : 'Preview current site workflow in clean, read-only mode'
          }
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Exit Preview</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-purple-500" />
              <span>Preview</span>
            </>
          )}
        </button>

        {/* TIME MACHINE SIMULATION BUTTON (Part 5) */}
        <button
          type="button"
          onClick={toggleSimulationMode}
          disabled={isPreviewMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isPreviewMode
              ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-400'
              : isSimulationMode
              ? 'bg-amber-500/20 text-amber-500 dark:text-amber-300 border-amber-500/50 shadow-sm ring-2 ring-amber-500/30 cursor-pointer font-bold'
              : isDark
              ? 'bg-slate-800/90 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border-amber-500/30 hover:border-amber-500/50 cursor-pointer'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200 shadow-xs cursor-pointer'
          }`}
          title={
            isPreviewMode
              ? 'Time machine disabled in Preview mode'
              : isSimulationMode
              ? 'Exit Time Machine Simulation mode'
              : 'Start Step-by-Step Workflow Simulation (Part 5)'
          }
        >
          {isSimulationMode ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Exit Sim</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              <span>Time Machine</span>
            </>
          )}
        </button>

        {/* Save Draft Button (Honest: Stored in memory) */}
        <button
          type="button"
          onClick={triggerSaveDraft}
          disabled={isPreviewMode || isSimulationMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isPreviewMode || isSimulationMode
              ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-400'
              : isDark
              ? 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-slate-700 cursor-pointer'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs cursor-pointer'
          }`}
          title={
            isSimulationMode
              ? 'Save draft disabled during simulation'
              : isPreviewMode
              ? 'Save draft disabled in Preview mode (Exit preview to save)'
              : 'Save draft (stored in local memory; backend persistence scheduled for Part 6)'
          }
        >
          <Save className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Save Draft</span>
          <span className="text-[10px] text-slate-400 font-mono">(Local)</span>
        </button>

        {/* Publish Button (Honest: Unavailable) */}
        <button
          type="button"
          onClick={triggerPublish}
          disabled={isPreviewMode || isSimulationMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors ${
            isPreviewMode || isSimulationMode
              ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-400'
              : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
          }`}
          title={
            isSimulationMode
              ? 'Publishing disabled during simulation'
              : isPreviewMode
              ? 'Publishing disabled in Preview mode'
              : 'Publish workflow (Unlocks after Part 4 validation & Part 6 integration)'
          }
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Publish</span>
          <span className="text-[10px] bg-purple-700/80 px-1 py-0.2 rounded text-purple-200">P6</span>
        </button>
      </div>
    </header>
  )
}
