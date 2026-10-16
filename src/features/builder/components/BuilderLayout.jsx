import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ReactFlowProvider } from '@xyflow/react'
import {
  Info,
  AlertTriangle,
  X,
  Keyboard,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { BuilderToolbar } from './BuilderToolbar'
import { ModulePalette } from './ModulePalette'
import { WorkflowCanvas } from './WorkflowCanvas'
import { InspectorPanel } from './InspectorPanel'
import { TemplateSelectorModal } from './TemplateSelectorModal'
import { PublishWorkflowModal } from './PublishWorkflowModal'
import { VersionHistoryModal } from './VersionHistoryModal'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { SITES } from '../registry/siteModules'

export function BuilderLayout({ theme: propTheme }) {
  const [searchParams] = useSearchParams()
  const siteParam = searchParams.get('site')
  const setActiveSite = useWorkflowStore((s) => s.setActiveSite)
  const setTheme = useWorkflowStore((s) => s.setTheme)

  const storeTheme = useWorkflowStore((s) => s.theme)
  const theme = propTheme || storeTheme
  const isDark = theme === 'dark'

  const activeSite = useWorkflowStore((s) => s.activeSite)
  const isPreviewMode = useWorkflowStore((s) => s.isPreviewMode)
  const isSimulationMode = useWorkflowStore((s) => s.isSimulationMode)
  const notification = useWorkflowStore((s) => s.notification)
  const clearNotification = useWorkflowStore((s) => s.clearNotification)
  const getActiveValidationReport = useWorkflowStore((s) => s.getActiveValidationReport)

  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]
  const validation = getActiveValidationReport()
  const initializePublishedState = useWorkflowStore((s) => s.initializePublishedState)

  useEffect(() => {
    initializePublishedState()
  }, [initializePublishedState])

  useEffect(() => {
    if (propTheme && propTheme !== storeTheme) {
      setTheme(propTheme)
    }
  }, [propTheme, storeTheme, setTheme])

  useEffect(() => {
    if (siteParam && ['central-stores', 'service-centre', 'distribution'].includes(siteParam)) {
      setActiveSite(siteParam)
    }
  }, [siteParam, setActiveSite])

  return (
    <ReactFlowProvider>
      <div
        className={`h-[calc(100vh-140px)] min-h-[700px] w-full flex flex-col overflow-hidden rounded-xl border border-[#E4E7EC] dark:border-[#30374C] font-sans shadow-sm transition-colors duration-200 ${
          isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        {/* Top Application Toolbar */}
        <BuilderToolbar />

        {/* Top Notification Toast (if triggered) */}
        {notification && (
          <div
            className={`px-4 py-2 flex items-center justify-between text-xs z-30 transition-all border-b ${
              notification.type === 'warning'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-200 border-amber-500/30'
                : 'bg-purple-500/15 text-purple-600 dark:text-purple-200 border-purple-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-purple-500 flex-shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={clearNotification}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3-Column Studio Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left: Module Palette */}
          <ModulePalette />

          {/* Center: Interactive Workflow Canvas */}
          <WorkflowCanvas />

          {/* Right: Contextual Inspector & Validation Summary */}
          <InspectorPanel />
        </div>

        {/* Bottom Status Line */}
        <footer
          className={`h-7 border-t px-4 flex items-center justify-between text-[11px] select-none z-20 transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Validation Status Indicator */}
            <div className="flex items-center gap-1.5 font-medium">
              {validation.hasErrors ? (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-500" />
                  <span className="text-rose-500 font-semibold">{validation.errorsCount} Issue(s)</span>
                </>
              ) : validation.hasWarnings ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-amber-500 font-medium">Review Warnings</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Graph Valid</span>
                </>
              )}
            </div>
            <span className="text-slate-400">|</span>
            <span>Facility: {currentSiteMeta.name}</span>
            <span className="text-slate-400">|</span>
            {isSimulationMode ? (
              <span className="text-amber-500 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Time Machine Simulation Active</span>
              </span>
            ) : isPreviewMode ? (
              <span className="text-purple-600 dark:text-purple-400 font-medium">Preview Mode Active (Read-Only)</span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">Enterprise Workflow Studio • Ready</span>
            )}
          </div>

          <div className="flex items-center gap-4 font-mono text-[10px]">
            <div className="flex items-center gap-1">
              <Keyboard className="w-3 h-3 text-slate-400" />
              <span>
                {isSimulationMode
                  ? 'Step Forward / Restart in Deck • Click Node to Inspect'
                  : isPreviewMode
                  ? 'Click Node to Inspect • Zoom & Pan Canvas'
                  : 'Del Delete • Ctrl+Z Undo • Ctrl+Y Redo'}
              </span>
            </div>
            <span>•</span>
            <span className="uppercase text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">
              {theme} mode
            </span>
            <span>•</span>
            <span>OpsHub Workflow Editor</span>
          </div>
        </footer>

        {/* Workflow Modals */}
        <TemplateSelectorModal />
        <PublishWorkflowModal />
        <VersionHistoryModal />
      </div>
    </ReactFlowProvider>
  )
}
