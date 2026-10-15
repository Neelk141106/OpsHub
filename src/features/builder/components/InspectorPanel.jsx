import {
  Settings2,
  X,
  Layers,
  Shield,
  Trash2,
  Link,
  Edit3,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { SITES } from '../registry/siteModules'

export function InspectorPanel() {
  const theme = useWorkflowStore((s) => s.theme)
  const isDark = theme === 'dark'

  const activeSite = useWorkflowStore((s) => s.activeSite)
  const siteDrafts = useWorkflowStore((s) => s.siteDrafts)
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId)
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId)
  const selectedModule = useWorkflowStore((s) => s.selectedModule)
  const setSelectedModule = useWorkflowStore((s) => s.setSelectedModule)
  const updateNodeLabel = useWorkflowStore((s) => s.updateNodeLabel)
  const updateNodeConfig = useWorkflowStore((s) => s.updateNodeConfig)
  const deleteNode = useWorkflowStore((s) => s.deleteNode)
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge)
  const getActiveValidationReport = useWorkflowStore((s) => s.getActiveValidationReport)

  const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [] }
  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]

  // Find currently selected placed node
  const activePlacedNode = selectedNodeId
    ? currentDraft.nodes.find((n) => n.id === selectedNodeId)
    : null

  // Active validation report
  const validationReport = getActiveValidationReport()
  const activeNodeIssues = activePlacedNode
    ? validationReport.nodeIssuesMap?.[activePlacedNode.id] || []
    : []

  // Connected edges
  const inboundEdges = activePlacedNode
    ? currentDraft.edges.filter((e) => e.target === activePlacedNode.id)
    : []

  const outboundEdges = activePlacedNode
    ? currentDraft.edges.filter((e) => e.source === activePlacedNode.id)
    : []

  const supportedSettings = activePlacedNode?.data?.supportedSettings || []
  const nodeConfig = activePlacedNode?.data?.config || {}

  return (
    <aside
      className={`w-80 h-full border-l flex flex-col select-none z-10 transition-colors ${
        isDark ? 'bg-slate-900/95 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Panel Header */}
      <div className={`h-12 px-3.5 border-b flex items-center justify-between ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-purple-500" />
          <h2 className="text-xs font-bold tracking-wide uppercase">
            {activePlacedNode
              ? 'Node Settings'
              : selectedModule
              ? 'Module Preview'
              : 'Workflow & Validation'}
          </h2>
        </div>

        {(activePlacedNode || selectedModule) && (
          <button
            type="button"
            onClick={() => {
              setSelectedNodeId(null)
              setSelectedModule(null)
            }}
            className={`p-1 rounded transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
            title="Deselect"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {activePlacedNode ? (
          /* Placed Node Configuration */
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className={`p-3 rounded-lg border space-y-2 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-500 dark:text-purple-300 font-semibold">
                  {activePlacedNode.data?.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                  {activePlacedNode.id}
                </span>
              </div>

              {/* Editable Label Input */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
                  <Edit3 className="w-3 h-3 text-purple-500" />
                  <span>Node Title</span>
                </label>
                <input
                  type="text"
                  value={activePlacedNode.data?.label || activePlacedNode.data?.name || ''}
                  onChange={(e) => updateNodeLabel(activePlacedNode.id, e.target.value)}
                  className={`w-full px-2.5 py-1.5 border rounded text-xs font-medium focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 focus:border-purple-500 text-slate-100'
                      : 'bg-white border-slate-300 focus:border-purple-500 text-slate-800'
                  }`}
                  placeholder="Enter node title..."
                />
              </div>

              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {activePlacedNode.data?.summary}
              </p>
            </div>

            {/* Validation Issues for this Node */}
            {activeNodeIssues.length > 0 && (
              <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-500 dark:text-rose-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>Configuration Issues ({activeNodeIssues.length})</span>
                </div>
                <ul className="space-y-1 text-[11px] pl-5 list-disc">
                  {activeNodeIssues.map((issue) => (
                    <li key={issue.id}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Supported Settings Form (Part 3) */}
            <div className={`p-3 rounded-lg border space-y-3 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-500" />
                  Supported Settings
                </span>
                <span className="text-[10px] font-mono text-purple-500 font-bold">Part 3 Active</span>
              </div>

              {supportedSettings.length > 0 ? (
                <div className="space-y-3">
                  {supportedSettings.map((setting) => {
                    const currentValue = nodeConfig[setting.key] ?? setting.defaultValue ?? ''
                    const fieldIssue = activeNodeIssues.find((i) => i.fieldKey === setting.key)

                    return (
                      <div key={setting.key} className="space-y-1">
                        <label className="flex items-center justify-between text-[11px] font-medium">
                          <span className={fieldIssue ? 'text-rose-500 font-semibold' : isDark ? 'text-slate-300' : 'text-slate-700'}>
                            {setting.label} {setting.required && <span className="text-rose-500">*</span>}
                          </span>
                          {setting.help && (
                            <span title={setting.help} className="cursor-help text-slate-400">
                              <HelpCircle className="w-3 h-3" />
                            </span>
                          )}
                        </label>

                        {/* Text Input */}
                        {setting.type === 'text' && (
                          <input
                            type="text"
                            value={currentValue}
                            placeholder={setting.placeholder || ''}
                            onChange={(e) => updateNodeConfig(activePlacedNode.id, setting.key, e.target.value)}
                            className={`w-full px-2.5 py-1.5 border rounded text-xs focus:outline-none transition-colors ${
                              fieldIssue
                                ? 'border-rose-500 bg-rose-500/10'
                                : isDark
                                ? 'bg-slate-900 border-slate-700 focus:border-purple-500 text-slate-100'
                                : 'bg-white border-slate-300 focus:border-purple-500 text-slate-800'
                            }`}
                          />
                        )}

                        {/* Number Input */}
                        {setting.type === 'number' && (
                          <input
                            type="number"
                            min={setting.min}
                            max={setting.max}
                            value={currentValue}
                            onChange={(e) =>
                              updateNodeConfig(
                                activePlacedNode.id,
                                setting.key,
                                e.target.value === '' ? '' : Number(e.target.value)
                              )
                            }
                            className={`w-full px-2.5 py-1.5 border rounded text-xs focus:outline-none transition-colors ${
                              fieldIssue
                                ? 'border-rose-500 bg-rose-500/10'
                                : isDark
                                ? 'bg-slate-900 border-slate-700 focus:border-purple-500 text-slate-100'
                                : 'bg-white border-slate-300 focus:border-purple-500 text-slate-800'
                            }`}
                          />
                        )}

                        {/* Select Input */}
                        {setting.type === 'select' && (
                          <select
                            value={currentValue}
                            onChange={(e) => updateNodeConfig(activePlacedNode.id, setting.key, e.target.value)}
                            className={`w-full px-2 py-1.5 border rounded text-xs focus:outline-none transition-colors ${
                              fieldIssue
                                ? 'border-rose-500 bg-rose-500/10'
                                : isDark
                                ? 'bg-slate-900 border-slate-700 focus:border-purple-500 text-slate-100'
                                : 'bg-white border-slate-300 focus:border-purple-500 text-slate-800'
                            }`}
                          >
                            {setting.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Boolean Toggle */}
                        {setting.type === 'boolean' && (
                          <label className="flex items-center gap-2 cursor-pointer pt-0.5">
                            <input
                              type="checkbox"
                              checked={Boolean(currentValue)}
                              onChange={(e) => updateNodeConfig(activePlacedNode.id, setting.key, e.target.checked)}
                              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                            <span className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              Enable / Enforce
                            </span>
                          </label>
                        )}

                        {fieldIssue && (
                          <p className="text-[10px] text-rose-500 font-medium">{fieldIssue.message}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  No adjustable settings defined for this step.
                </p>
              )}
            </div>

            {/* Connected Wiring Section */}
            <div className={`p-3 rounded-lg border space-y-2 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-purple-500" />
                  Connections
                </span>
                <span className="font-mono text-purple-500">
                  {inboundEdges.length} in • {outboundEdges.length} out
                </span>
              </div>

              {inboundEdges.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Inbound Steps:</span>
                  {inboundEdges.map((e) => {
                    const sourceNode = currentDraft.nodes.find((n) => n.id === e.source)
                    return (
                      <div
                        key={e.id}
                        className={`p-1.5 rounded flex items-center justify-between text-[11px] border ${
                          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <span className="truncate max-w-[170px] text-emerald-500 dark:text-emerald-400">
                          ← {sourceNode?.data?.label || e.source}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteEdge(e.id)}
                          className="text-slate-400 hover:text-rose-400 p-0.5"
                          title="Disconnect edge"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {outboundEdges.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Outbound Steps:</span>
                  {outboundEdges.map((e) => {
                    const targetNode = currentDraft.nodes.find((n) => n.id === e.target)
                    return (
                      <div
                        key={e.id}
                        className={`p-1.5 rounded flex items-center justify-between text-[11px] border ${
                          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <span className="truncate max-w-[170px] text-cyan-600 dark:text-cyan-400">
                          → {targetNode?.data?.label || e.target}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteEdge(e.id)}
                          className="text-slate-400 hover:text-rose-400 p-0.5"
                          title="Disconnect edge"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {inboundEdges.length === 0 && outboundEdges.length === 0 && (
                <p className="text-[11px] text-slate-400">
                  Node is currently unlinked. Drag from handle ports to wire into the workflow.
                </p>
              )}
            </div>

            {/* Remove Node Action */}
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => deleteNode(activePlacedNode.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 dark:text-rose-300 transition-colors text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Placed Node</span>
              </button>
            </div>
          </div>
        ) : selectedModule ? (
          /* Palette Module Preview */
          <div className="space-y-4 text-xs">
            <div className={`p-3 rounded-lg border space-y-2 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-500 dark:text-purple-300 font-semibold">
                  {selectedModule.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedModule.id}
                </span>
              </div>
              <h3 className="text-sm font-bold">{selectedModule.name}</h3>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedModule.summary}
              </p>
            </div>

            {/* Preview Supported Settings */}
            <div className={`p-3 rounded-lg border space-y-2 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Configurable Settings Schema:
              </div>
              <ul className="space-y-1.5 text-[11px]">
                {selectedModule.supportedSettings?.map((s) => (
                  <li key={s.key} className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-300 dark:text-slate-300">{s.label}:</span>
                    <span className="font-mono text-[10px] text-purple-500 dark:text-purple-400">{s.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* Empty State: Workflow Validation Summary */
          <div className="space-y-4 text-xs">
            {/* Top Status Card */}
            <div className={`p-4 rounded-lg border text-center flex flex-col items-center ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-2.5">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold mb-1">{currentSiteMeta.name}</h3>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {currentDraft.workflowName}
              </p>
            </div>

            {/* WORKFLOW VALIDATION SUMMARY */}
            <div className={`p-3.5 rounded-lg border space-y-3 ${
              validationReport.hasErrors
                ? 'bg-rose-500/10 border-rose-500/30'
                : validationReport.hasWarnings
                ? 'bg-amber-500/10 border-amber-500/30'
                : isDark
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {validationReport.hasErrors ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span className="text-rose-500 dark:text-rose-300">
                        {validationReport.errorsCount} Error(s) Detected
                      </span>
                    </>
                  ) : validationReport.hasWarnings ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-600 dark:text-amber-400">
                        {validationReport.warningsCount} Notice(s)
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Topology & Config Valid
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentDraft.nodes.length} nodes • {currentDraft.edges.length} edges
                </span>
              </div>

              {/* Issues List with Click-to-Focus */}
              {validationReport.issues.length > 0 ? (
                <div className="space-y-2 pt-1 border-t border-slate-700/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Issues to Resolve:</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {validationReport.issues.map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => {
                          if (issue.nodeId) {
                            setSelectedNodeId(issue.nodeId)
                          }
                        }}
                        className={`p-2 rounded border text-[11px] leading-snug flex items-start gap-1.5 transition-colors ${
                          issue.nodeId ? 'cursor-pointer hover:border-purple-500' : ''
                        } ${
                          issue.type === 'error'
                            ? isDark
                              ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                            : isDark
                            ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                        title={issue.nodeId ? 'Click to inspect this node' : undefined}
                      >
                        {issue.type === 'error' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p>{issue.message}</p>
                          {issue.nodeId && (
                            <span className="text-[10px] text-purple-400 flex items-center gap-1 mt-0.5">
                              <span>Click to inspect</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  All placed modules are connected with valid required settings and complete input/output wiring.
                </p>
              )}
            </div>

            {/* Facility Draft Isolation Note */}
            <div className={`p-3 rounded-lg border space-y-1.5 text-[11px] ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 font-semibold">
                <Shield className="w-3.5 h-3.5 text-purple-500" />
                <span>Isolated Draft Scope</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Draft graphs and configurations are preserved independently for {currentSiteMeta.name}. Switching sites will not bleed or overwrite drafts.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className={`p-2.5 border-t text-[10px] flex items-center justify-between ${
        isDark ? 'bg-slate-950/70 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}>
        <span>Part 3: Configuration & Validation</span>
        <span className="font-mono text-purple-500 font-bold">Active</span>
      </div>
    </aside>
  )
}
