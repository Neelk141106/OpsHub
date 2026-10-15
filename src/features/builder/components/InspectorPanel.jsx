import {
  Settings2,
  X,
  FileCode2,
  Layers,
  Info,
  Shield,
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { SITES } from '../registry/siteModules'

export function InspectorPanel() {
  const activeSite = useWorkflowStore((s) => s.activeSite)
  const siteDrafts = useWorkflowStore((s) => s.siteDrafts)
  const selectedModule = useWorkflowStore((s) => s.selectedModule)
  const setSelectedModule = useWorkflowStore((s) => s.setSelectedModule)

  const currentDraft = siteDrafts[activeSite] || {}
  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]

  return (
    <aside className="w-80 h-full bg-slate-900/95 border-l border-slate-800 flex flex-col select-none z-10">
      {/* Panel Header */}
      <div className="h-12 px-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
            {selectedModule ? 'Module Inspector' : 'Workflow Properties'}
          </h2>
        </div>
        {selectedModule && (
          <button
            type="button"
            onClick={() => setSelectedModule(null)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Deselect module"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {selectedModule ? (
          /* Contextual Module Settings */
          <div className="space-y-4 text-xs">
            {/* Module Header Card */}
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                  {selectedModule.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {selectedModule.id}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">{selectedModule.name}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {selectedModule.summary}
              </p>
            </div>

            {/* Operational Configuration Fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Configuration</span>
                <span className="text-[10px] text-purple-400 font-mono">Part 3 Model</span>
              </div>

              {/* Display Label */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Node Display Label
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedModule.name}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 cursor-not-allowed"
                />
              </div>

              {/* Site Assignment */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Site Facility Target
                </label>
                <div className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 flex items-center justify-between">
                  <span>
                    {selectedModule.siteId === 'all'
                      ? 'Universal (Cross-Site)'
                      : SITES.find((s) => s.id === selectedModule.siteId)?.name || 'Custom'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Fixed</span>
                </div>
              </div>

              {/* Retry / Execution Timeout */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    SLA Timeout
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="15m"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-400 font-mono cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Max Retries
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="3"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-400 font-mono cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Integration Contract Schema */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                  Integration Contract
                </span>
                <span className="text-[10px] font-mono text-slate-500">JSON Schema</span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
                {selectedModule.contract.payload && (
                  <div>
                    <span className="text-purple-400 font-semibold">payload: </span>
                    <span className="text-slate-400">
                      [{selectedModule.contract.payload.join(', ')}]
                    </span>
                  </div>
                )}
                {selectedModule.contract.input && (
                  <div>
                    <span className="text-emerald-400 font-semibold">input: </span>
                    <span className="text-slate-400">
                      [{selectedModule.contract.input.join(', ')}]
                    </span>
                  </div>
                )}
                {selectedModule.contract.output && (
                  <div>
                    <span className="text-cyan-400 font-semibold">output: </span>
                    <span className="text-slate-400">
                      [{selectedModule.contract.output.join(', ')}]
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="p-2.5 rounded bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300 leading-normal flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <span>
                Form controls will become interactive when Module Settings & Dynamic Schema validation is integrated in Part 3.
              </span>
            </div>
          </div>
        ) : (
          /* Empty State: Workflow Properties */
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-2.5">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-200 mb-1">No Module Selected</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Click any module card in the left palette to inspect its configuration and payload schema.
              </p>
            </div>

            {/* Site Overview Details */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                Active Facility Details
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Site:</span>
                  <span className="font-semibold text-slate-200">{currentSiteMeta.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Workflow:</span>
                  <span className="text-purple-300 font-medium truncate max-w-[140px]">
                    {currentDraft.workflowName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Draft Status:</span>
                  <span className="text-emerald-400 font-mono text-[10px]">
                    {currentDraft.lastSaved || 'In Memory'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Isolation:</span>
                  <span className="text-slate-300 text-[10px] font-mono">Dedicated draft</span>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Integration State</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Draft state is strictly isolated per site. Switching to another operational site preserves this draft without cross-facility leakage.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-slate-950/70 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Properties Drawer</span>
        <span className="font-mono text-purple-400">v0.1.0</span>
      </div>
    </aside>
  )
}
