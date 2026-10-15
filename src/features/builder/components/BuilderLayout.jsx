import {
  Info,
  AlertTriangle,
  X,
  Keyboard,
} from 'lucide-react'
import { BuilderToolbar } from './BuilderToolbar'
import { ModulePalette } from './ModulePalette'
import { WorkflowCanvas } from './WorkflowCanvas'
import { InspectorPanel } from './InspectorPanel'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { SITES } from '../registry/siteModules'

export function BuilderLayout() {
  const activeSite = useWorkflowStore((s) => s.activeSite)
  const notification = useWorkflowStore((s) => s.notification)
  const clearNotification = useWorkflowStore((s) => s.clearNotification)

  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Toolbar */}
      <BuilderToolbar />

      {/* Top Notification Toast (if triggered) */}
      {notification && (
        <div
          className={`px-4 py-2 flex items-center justify-between text-xs z-30 transition-all border-b ${
            notification.type === 'warning'
              ? 'bg-amber-950/90 text-amber-200 border-amber-800'
              : 'bg-purple-950/90 text-purple-200 border-purple-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-purple-400 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={clearNotification}
            className="p-1 rounded hover:bg-black/30 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3-Column Studio Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Module Palette */}
        <ModulePalette />

        {/* Center: Canvas Workspace */}
        <WorkflowCanvas />

        {/* Right: Contextual Inspector */}
        <InspectorPanel />
      </div>

      {/* Bottom Status Line */}
      <footer className="h-7 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-400 select-none z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-slate-300">Ready</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Site: {currentSiteMeta.name}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Part 1 UI Foundation Connected</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500 font-mono text-[10px]">
          <div className="flex items-center gap-1 text-slate-400">
            <Keyboard className="w-3 h-3 text-slate-500" />
            <span>Ctrl+Z Undo • Ctrl+Y Redo</span>
          </div>
          <span>•</span>
          <span>OpsHub v0.1.0</span>
        </div>
      </footer>
    </div>
  )
}
