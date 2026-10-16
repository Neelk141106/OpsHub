import { useState } from 'react'
import {
  Boxes,
  RotateCcw,
  RotateCw,
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
  Eye,
  LayoutTemplate,
  History,
  Edit3,
  Sparkles,
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { SITES } from '../registry/siteModules'

export function BuilderToolbar() {
  const theme = useWorkflowStore((s) => s.theme)
  const isDark = theme === 'dark'

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
  const saveDraft = useWorkflowStore((s) => s.saveDraft)
  const isSavingDraft = useWorkflowStore((s) => s.isSavingDraft)
  const hasUnsavedChanges = useWorkflowStore((s) => s.hasUnsavedChanges)
  const setTemplateModalOpen = useWorkflowStore((s) => s.setTemplateModalOpen)
  const setPublishModalOpen = useWorkflowStore((s) => s.setPublishModalOpen)
  const setVersionHistoryModalOpen = useWorkflowStore((s) => s.setVersionHistoryModalOpen)
  const publishedWorkflows = useWorkflowStore((s) => s.publishedWorkflows)
  const validateWorkflowActive = useWorkflowStore((s) => s.validateWorkflowActive)
  const resetToCreationScreen = useWorkflowStore((s) => s.resetToCreationScreen)

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
      className={`h-12 border-b px-4 flex items-center justify-between gap-3 select-none z-20 transition-colors duration-150 ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      {/* Left: Site Selector & Editable Workflow Title */}
      {/* Left: Clear Workflow Header (Part 3: Editing: Central Stores — Requisition & Staging SOP) */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline whitespace-nowrap">
          Editing:
        </span>

        {/* Site Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSiteDropdownOpen((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-100'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 shadow-xs'
            }`}
            title="Switch facility (drafts are strictly isolated per facility)"
          >
            <span className="flex items-center gap-1.5 font-bold">
              {getSiteIcon(currentSiteMeta.id)}
              <span>{currentSiteMeta.name}</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {siteDropdownOpen && (
            <div
              className={`absolute top-full left-0 mt-1.5 w-72 border rounded-xl shadow-xl py-1.5 z-50 transition-all ${
                isDark ? 'bg-slate-900 border-slate-700 shadow-black/60' : 'bg-white border-slate-200 shadow-slate-300/80'
              }`}
            >
              <div
                className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase border-b ${
                  isDark ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-100'
                }`}
              >
                Switch Operational Facility
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
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 transition-colors cursor-pointer ${
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

        <span className="text-slate-400 font-bold select-none">—</span>

        {/* Workflow Title Input */}
        <input
          type="text"
          value={currentDraft.workflowName || ''}
          onChange={(e) => setWorkflowName(e.target.value)}
          disabled={isPreviewMode || isSimulationMode}
          className={`border rounded-md px-2 py-1 text-xs font-semibold focus:outline-none transition-colors w-36 sm:w-48 lg:w-60 truncate ${
            isPreviewMode || isSimulationMode
              ? isDark
                ? 'bg-slate-950/40 border-transparent text-slate-300 cursor-default'
                : 'bg-slate-100/60 border-transparent text-slate-700 cursor-default'
              : isDark
              ? 'bg-transparent hover:bg-slate-800/60 focus:bg-slate-950 border-transparent focus:border-purple-500 text-slate-100'
              : 'bg-transparent hover:bg-slate-100 focus:bg-white border-transparent focus:border-purple-500 text-slate-800'
          }`}
          title={isPreviewMode ? 'Workflow renaming locked in Preview mode' : 'Click to rename workflow'}
          placeholder="Workflow title..."
        />

        {/* Draft Status Badge */}
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
          Draft
        </span>

        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && !isPreviewMode && !isSimulationMode && (
          <span
            className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"
            title="Unsaved changes in editable draft"
          />
        )}

        {/* History / Current Version Trigger */}
        <button
          type="button"
          onClick={() => setVersionHistoryModalOpen(true)}
          disabled={isSimulationMode}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-mono font-semibold transition-colors cursor-pointer shrink-0 ${
            isSimulationMode
              ? 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
              : isDark
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-purple-300'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-purple-700'
          }`}
          title="Inspect SOP Version History and Rollback"
        >
          <History className="w-3 h-3 text-purple-500" />
          <span>{publishedWorkflows[activeSite]?.versionTag || 'v1.0.0'}</span>
        </button>
      </div>

      {/* Center: Undo, Redo, Clear Canvas */}
      <div
        className={`flex items-center gap-1 p-1 rounded-lg border ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100/90 border-slate-200'
        }`}
      >
        {/* Undo */}
        <button
          type="button"
          onClick={undo}
          disabled={pastCount === 0 || isPreviewMode || isSimulationMode}
          aria-label="Undo"
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
          aria-label="Redo"
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

        {/* Clear Canvas */}
        <button
          type="button"
          onClick={clearGraph}
          disabled={nodeCount === 0 || isPreviewMode || isSimulationMode}
          aria-label="Clear Canvas"
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

      {/* Right: Primary Actions (New Workflow, Templates, Validate, Preview/Edit, Time Machine, Save Draft, Publish SOP) */}
      <div className="flex items-center gap-2">
        {/* NEW WORKFLOW TRIGGER (Part 1) */}
        <button
          type="button"
          onClick={() => resetToCreationScreen(activeSite)}
          disabled={isPreviewMode || isSimulationMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            isPreviewMode || isSimulationMode
              ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-500'
              : isDark
              ? 'hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              : 'hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
          }`}
          title="Return to the creation screen to choose a new template or build from scratch"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span className="hidden xl:inline">New Workflow</span>
        </button>

        {/* TEMPLATES TRIGGER */}
        <button
          type="button"
          onClick={() => setTemplateModalOpen(true)}
          disabled={isPreviewMode || isSimulationMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            isPreviewMode || isSimulationMode
              ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-500'
              : isDark
              ? 'bg-slate-800/90 hover:bg-slate-800 text-purple-300 hover:text-purple-200 border-purple-500/30 hover:border-purple-500/50'
              : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 shadow-xs'
          }`}
          title="Browse validated starting SOP templates or create from scratch"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-purple-500" />
          <span>Templates</span>
        </button>

        {/* VALIDATE BUTTON (Part 3) */}
        <button
          type="button"
          onClick={validateWorkflowActive}
          disabled={isSimulationMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            isSimulationMode
              ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-500'
              : isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
          }`}
          title="Validate workflow topology and node configuration schemas"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Validate</span>
        </button>

        {/* PREVIEW / EDIT WORKFLOW BUTTON (Part 3) */}
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
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Workflow</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-purple-500" />
              <span>Preview</span>
            </>
          )}
        </button>

        {/* TIME MACHINE SIMULATION BUTTON (Signature USP) */}
        <button
          type="button"
          onClick={toggleSimulationMode}
          disabled={isPreviewMode}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            isPreviewMode
              ? 'opacity-40 cursor-not-allowed bg-slate-800/50 border-slate-800 text-slate-400'
              : isSimulationMode
              ? 'bg-amber-500/20 text-amber-500 dark:text-amber-300 border-amber-500/50 shadow-sm ring-2 ring-amber-500/30 cursor-pointer font-bold'
              : isDark
              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border-amber-500/30 hover:border-amber-500/50 cursor-pointer shadow-xs'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200 shadow-xs cursor-pointer'
          }`}
          title={
            isPreviewMode
              ? 'Time machine disabled in Preview mode'
              : isSimulationMode
              ? 'Exit Time Machine Simulation mode'
              : 'Start Step-by-Step Workflow Simulation (Safe In-Memory Execution)'
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

        {/* Save Draft Button (Part 3) */}
        <button
          type="button"
          onClick={saveDraft}
          disabled={isPreviewMode || isSimulationMode || isSavingDraft}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isPreviewMode || isSimulationMode || isSavingDraft
              ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-400'
              : hasUnsavedChanges
              ? isDark
                ? 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border-purple-500/50 cursor-pointer shadow-xs font-semibold'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300 cursor-pointer shadow-xs font-semibold'
              : isDark
              ? 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-slate-700 cursor-pointer'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs cursor-pointer'
          }`}
          title={
            isSimulationMode
              ? 'Save draft disabled during simulation'
              : isPreviewMode
              ? 'Save draft disabled in Preview mode'
              : hasUnsavedChanges
              ? 'Save in-progress changes to isolated facility draft storage'
              : 'Draft is up to date'
          }
        >
          {isSavingDraft ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Save Draft</span>
              {hasUnsavedChanges && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              )}
            </>
          )}
        </button>

        {/* Publish SOP Button (Part 3) */}
        <button
          type="button"
          onClick={() => setPublishModalOpen(true)}
          disabled={isPreviewMode || isSimulationMode}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors ${
            isPreviewMode || isSimulationMode
              ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-400'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-600/20'
          }`}
          title={
            isSimulationMode
              ? 'Publishing disabled during simulation'
              : isPreviewMode
              ? 'Publishing disabled in Preview mode'
              : 'Validate and publish new SOP version to operational dashboards'
          }
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Publish SOP</span>
        </button>
      </div>
    </header>
  )
}
