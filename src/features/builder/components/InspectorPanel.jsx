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
  Lock,
  Eye,
  StepForward,
  RotateCcw,
  GitFork,
  ArrowRight,
} from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { SITES } from '../registry/siteModules'

export function InspectorPanel() {
  const { getNode, setCenter } = useReactFlow()

  const theme = useWorkflowStore((s) => s.theme)
  const isDark = theme === 'dark'

  const activeSite = useWorkflowStore((s) => s.activeSite)
  const siteDrafts = useWorkflowStore((s) => s.siteDrafts)
  const isPreviewMode = useWorkflowStore((s) => s.isPreviewMode)
  const isSimulationMode = useWorkflowStore((s) => s.isSimulationMode)
  const simulation = useWorkflowStore((s) => s.simulation)
  const stepForward = useWorkflowStore((s) => s.stepForward)
  const chooseBranch = useWorkflowStore((s) => s.chooseBranch)
  const restartSimulation = useWorkflowStore((s) => s.restartSimulation)
  const exitSimulation = useWorkflowStore((s) => s.exitSimulation)
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
  const hasNodeErrors = activeNodeIssues.some((i) => i.type === 'error')
  const hasNodeWarnings = activeNodeIssues.some((i) => i.type === 'warning')

  // Connected edges
  const inboundEdges = activePlacedNode
    ? currentDraft.edges.filter((e) => e.target === activePlacedNode.id)
    : []

  const outboundEdges = activePlacedNode
    ? currentDraft.edges.filter((e) => e.source === activePlacedNode.id)
    : []

  const supportedSettings = activePlacedNode?.data?.supportedSettings || []
  const nodeConfig = activePlacedNode?.data?.config || {}

  // Smooth navigation to affected node on canvas
  const handleNavigateToNode = (nodeId) => {
    if (!nodeId) return
    setSelectedNodeId(nodeId)
    setSelectedModule(null)
    const node = getNode(nodeId)
    if (node && node.position) {
      setCenter(node.position.x + 130, node.position.y + 60, {
        zoom: 1.15,
        duration: 300,
      })
    }
  }

  // Active node for simulation inspection
  const simulationCurrentNode = isSimulationMode && simulation?.currentNodeId
    ? currentDraft.nodes.find((n) => n.id === simulation.currentNodeId)
    : activePlacedNode

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
        <div className="flex items-center gap-2 min-w-0">
          {isSimulationMode ? (
            <RotateCcw className="w-4 h-4 text-amber-500 flex-shrink-0" />
          ) : isPreviewMode ? (
            <Eye className="w-4 h-4 text-purple-400 flex-shrink-0" />
          ) : (
            <Settings2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
          )}
          <h2 className="text-xs font-bold tracking-wide uppercase truncate">
            {isSimulationMode
              ? 'Simulation Inspector'
              : isPreviewMode
              ? activePlacedNode
                ? 'Preview: Node Details'
                : 'Preview: Summary'
              : activePlacedNode
              ? 'Node Settings'
              : selectedModule
              ? 'Module Preview'
              : 'Workflow & Validation'}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isSimulationMode ? (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Simulation</span>
            </span>
          ) : isPreviewMode ? (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
              <Lock className="w-2.5 h-2.5" />
              <span>Read-Only</span>
            </span>
          ) : null}

          {(activePlacedNode || selectedModule) && (
            <button
              type="button"
              onClick={() => {
                setSelectedNodeId(null)
                setSelectedModule(null)
              }}
              className={`p-1 rounded transition-colors ${
                isDark
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
              title="Deselect"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {isSimulationMode ? (
          /* Part 5: Time Machine Simulation Inspector */
          <div className="space-y-4 text-xs">
            {/* Simulation Status & Control Card */}
            <div
              className={`p-3 rounded-xl border space-y-3 ${
                isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Simulation Status
                </span>
                {simulation?.status === 'running' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>Running</span>
                  </span>
                )}
                {simulation?.status === 'branching' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 animate-pulse">
                    <GitFork className="w-3 h-3" />
                    <span>Branch Choice</span>
                  </span>
                )}
                {simulation?.status === 'completed' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </span>
                )}
                {simulation?.status === 'blocked' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    <AlertCircle className="w-3 h-3" />
                    <span>Blocked</span>
                  </span>
                )}
                {simulation?.status === 'invalid' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Invalid</span>
                  </span>
                )}
                {simulation?.status === 'empty' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <span>Empty</span>
                  </span>
                )}
              </div>

              {/* Progress Stepper & Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">Execution Progress</span>
                  <span className="font-mono text-amber-400 font-bold">
                    Step {simulation?.currentStep || 0} / {Math.max(simulation?.totalSteps || 0, 1)}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      simulation?.status === 'completed'
                        ? 'bg-emerald-500'
                        : simulation?.status === 'blocked' || simulation?.status === 'invalid'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${
                        simulation?.totalSteps > 0
                          ? Math.min(
                              100,
                              Math.round(((simulation?.currentStep || 0) / simulation.totalSteps) * 100)
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Simulation Action Controls */}
              <div className="space-y-1.5 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={stepForward}
                    disabled={simulation?.status !== 'running'}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      simulation?.status === 'running'
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer'
                        : 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                    }`}
                    title={
                      simulation?.status === 'running'
                        ? 'Advance to next workflow step'
                        : 'Step forward unavailable'
                    }
                  >
                    <StepForward className="w-3.5 h-3.5" />
                    <span>Step Forward</span>
                  </button>

                  <button
                    type="button"
                    onClick={restartSimulation}
                    disabled={simulation?.status === 'empty' || simulation?.status === 'invalid'}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                      simulation?.status !== 'empty' && simulation?.status !== 'invalid'
                        ? isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 cursor-pointer'
                        : 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                    }`}
                    title="Restart simulation from initial node"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restart</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={exitSimulation}
                  className={`w-full flex items-center justify-center gap-1.5 py-1 px-3 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900'
                  }`}
                  title="Exit simulation mode and return to canvas editor"
                >
                  <X className="w-3 h-3 text-slate-400" />
                  <span>Exit Simulation</span>
                </button>
              </div>

              {/* Status Message */}
              {simulation?.message && (
                <div
                  className={`p-2 rounded-lg border text-[11px] leading-relaxed ${
                    simulation.status === 'completed'
                      ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
                      : simulation.status === 'blocked' || simulation.status === 'invalid'
                      ? 'bg-rose-950/30 border-rose-800/40 text-rose-400'
                      : isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <p>{simulation.message}</p>
                  {simulation.blockedReason && (
                    <p className="mt-1 font-mono text-[10px] text-rose-300 opacity-90">
                      Error details: {simulation.blockedReason}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Branch Choice Selection (when multiple outgoing connections exist) */}
            {simulation?.status === 'branching' && (simulation?.pendingBranches?.length ?? 0) > 0 && (
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-200">
                  <GitFork className="w-3.5 h-3.5 text-purple-400" />
                  <span>Choose Connection Path</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Branching rules are not defined for this step. Select which valid connection to advance through:
                </p>
                <div className="space-y-1.5 pt-1">
                  {simulation.pendingBranches.map((branch) => (
                    <button
                      key={branch.edgeId}
                      type="button"
                      onClick={() => chooseBranch(branch.edgeId, branch.targetNodeId)}
                      className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all hover:scale-[1.01] cursor-pointer ${
                        isDark
                          ? 'bg-slate-900 hover:bg-purple-900/40 border-purple-500/40 text-purple-200 hover:border-purple-400'
                          : 'bg-white hover:bg-purple-50 border-purple-200 text-purple-900 hover:border-purple-400 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                          {branch.branchLabel}
                        </span>
                        <span className="text-xs font-semibold truncate text-slate-100 dark:text-slate-100">
                          {branch.targetNodeName}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Active Node Details */}
            {simulationCurrentNode ? (
              <div
                className={`p-3 rounded-xl border space-y-3 ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Step Details
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                    {simulationCurrentNode.data?.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100">
                    {simulationCurrentNode.data?.label || simulationCurrentNode.data?.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {simulationCurrentNode.data?.summary}
                  </p>
                </div>

                {/* Configured Values Table */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-300">
                      Configured Parameters
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {simulationCurrentNode.data?.supportedSettings?.length || 0} fields
                    </span>
                  </div>

                  {(simulationCurrentNode.data?.supportedSettings || []).length > 0 ? (
                    <div className="space-y-1.5">
                      {simulationCurrentNode.data.supportedSettings.map((setting) => {
                        const val = simulationCurrentNode.data?.config?.[setting.key]
                        const isSet = val !== undefined && val !== null && val !== ''
                        return (
                          <div
                            key={setting.key}
                            className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-[11px] ${
                              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-slate-200 truncate">
                                {setting.label}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 truncate">
                                {setting.key} ({setting.type})
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${
                                isSet
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {isSet ? String(val) : 'default'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] italic text-slate-500">
                      This module requires no custom parameters.
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            {/* Execution Timeline / Progress History */}
            <div
              className={`p-3 rounded-xl border space-y-2.5 ${
                isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Execution Timeline
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {simulation?.executionLog?.length || 0} logged
                </span>
              </div>

              {(simulation?.executionLog || []).length > 0 ? (
                <div className="space-y-2">
                  {simulation.executionLog.map((log) => {
                    const isLogActive = log.nodeId === simulation?.currentNodeId
                    return (
                      <div
                        key={log.step}
                        onClick={() => handleNavigateToNode(log.nodeId)}
                        className={`p-2 rounded-lg border flex items-start justify-between gap-2 transition-all cursor-pointer ${
                          isLogActive
                            ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                        title="Click to focus node on canvas"
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                              isLogActive
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {log.step}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold truncate">
                              {log.nodeName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {log.category} • {log.timestamp}
                            </span>
                            {log.branchTaken && (
                              <span className="text-[10px] text-purple-400 font-medium mt-0.5">
                                Path: {log.branchTaken}
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase flex-shrink-0 ${
                            isLogActive
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {isLogActive ? 'Active' : 'Passed'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-[11px] italic text-slate-500">
                  No execution steps recorded yet. Click 'Step Forward' to begin.
                </p>
              )}
            </div>

            {/* Validation Pre-flight Re-use */}
            <div
              className={`p-3 rounded-xl border space-y-2 ${
                validationReport.hasErrors
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : isDark
                  ? 'bg-slate-950/70 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pre-Flight Topology Health
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    validationReport.hasErrors
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}
                >
                  {validationReport.hasErrors ? 'Validation Issues' : 'Graph Valid'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {validationReport.hasErrors
                  ? `${validationReport.errorsCount} pre-flight validation error(s) detected. Resolve these in the editor to simulate:`
                  : 'Workflow connections and required parameter fields are validated.'}
              </p>

              {validationReport.hasErrors && (
                <div className="space-y-1.5 pt-1 border-t border-rose-500/20">
                  {validationReport.issues
                    .filter((i) => i.type === 'error')
                    .map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => {
                          if (issue.nodeId) {
                            handleNavigateToNode(issue.nodeId)
                          }
                        }}
                        className={`p-2 rounded border text-[11px] leading-snug flex items-start gap-1.5 transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-rose-950/50 border-rose-800/60 hover:border-rose-600 text-rose-300'
                            : 'bg-rose-50 border-rose-200 hover:border-rose-400 text-rose-900'
                        }`}
                        title="Click to focus node on canvas"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{issue.message}</p>
                          {issue.nodeId && (
                            <span className="text-[10px] text-purple-400 flex items-center gap-1 mt-0.5 font-medium">
                              <span>Locate node</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                  <button
                    type="button"
                    onClick={exitSimulation}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Exit Simulation to Connect Nodes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activePlacedNode ? (
          /* Placed Node Inspection & Settings */
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

              {/* Node Title (Read-Only in Preview Mode) */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
                  <Edit3 className="w-3 h-3 text-purple-500" />
                  <span>Node Title</span>
                </label>
                {isPreviewMode ? (
                  <div className={`w-full px-2.5 py-1.5 border rounded text-xs font-bold ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    {activePlacedNode.data?.label || activePlacedNode.data?.name}
                  </div>
                ) : (
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
                )}
              </div>

              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {activePlacedNode.data?.summary}
              </p>
            </div>

            {/* Validation Health Status for this Node */}
            {hasNodeErrors ? (
              <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-500 dark:text-rose-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>
                    Validation Errors ({activeNodeIssues.filter((i) => i.type === 'error').length})
                  </span>
                </div>
                <ul className="space-y-1 text-[11px] pl-5 list-disc">
                  {activeNodeIssues
                    .filter((i) => i.type === 'error')
                    .map((issue) => (
                      <li key={issue.id}>{issue.message}</li>
                    ))}
                </ul>
              </div>
            ) : hasNodeWarnings ? (
              <div className="p-3 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>
                    Notices & Warnings ({activeNodeIssues.filter((i) => i.type === 'warning').length})
                  </span>
                </div>
                <ul className="space-y-1 text-[11px] pl-5 list-disc">
                  {activeNodeIssues
                    .filter((i) => i.type === 'warning')
                    .map((issue) => (
                      <li key={issue.id}>{issue.message}</li>
                    ))}
                </ul>
              </div>
            ) : (
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 text-xs font-medium ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Configuration Valid & Verified</span>
              </div>
            )}

            {/* Configured Settings (Read-Only in Preview Mode) */}
            <div className={`p-3 rounded-lg border space-y-3 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-500" />
                  {isPreviewMode ? 'Configured Parameters' : 'Supported Settings'}
                </span>
                <span className="text-[10px] font-mono text-purple-500 font-bold">
                  {isPreviewMode ? 'Read-Only' : 'Part 3 Active'}
                </span>
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

                        {/* Read-Only Parameter Display in Preview Mode */}
                        {isPreviewMode ? (
                          <div
                            className={`w-full px-2.5 py-1.5 border rounded text-xs font-medium flex items-center justify-between ${
                              fieldIssue
                                ? 'border-rose-500/50 bg-rose-500/10 text-rose-300'
                                : isDark
                                ? 'bg-slate-900 border-slate-800 text-slate-200'
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            {setting.type === 'boolean' ? (
                              currentValue ? (
                                <span className="text-emerald-500 font-semibold flex items-center gap-1 text-[11px]">
                                  <CheckCircle2 className="w-3 h-3" /> Enabled
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Disabled</span>
                              )
                            ) : currentValue !== '' && currentValue !== undefined && currentValue !== null ? (
                              <span className="truncate">{String(currentValue)}</span>
                            ) : setting.required ? (
                              <span className="text-rose-500 font-semibold text-[11px] flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Missing required value
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">Default</span>
                            )}

                            <span className="text-[10px] font-mono text-purple-400 ml-2">
                              {setting.type}
                            </span>
                          </div>
                        ) : (
                          /* Editable Form Inputs in Editor Mode */
                          <>
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
                          </>
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
                        onClick={() => handleNavigateToNode(e.source)}
                        className={`p-1.5 rounded flex items-center justify-between text-[11px] border cursor-pointer transition-colors ${
                          isDark
                            ? 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 hover:border-purple-500/40'
                            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300'
                        }`}
                        title="Click to focus connected source node"
                      >
                        <span className="truncate max-w-[170px] text-emerald-500 dark:text-emerald-400">
                          ← {sourceNode?.data?.label || e.source}
                        </span>
                        {isPreviewMode ? (
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        ) : (
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation()
                              deleteEdge(e.id)
                            }}
                            className="text-slate-400 hover:text-rose-400 p-0.5"
                            title="Disconnect edge"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
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
                        onClick={() => handleNavigateToNode(e.target)}
                        className={`p-1.5 rounded flex items-center justify-between text-[11px] border cursor-pointer transition-colors ${
                          isDark
                            ? 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 hover:border-purple-500/40'
                            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300'
                        }`}
                        title="Click to focus connected target node"
                      >
                        <span className="truncate max-w-[170px] text-cyan-600 dark:text-cyan-400">
                          → {targetNode?.data?.label || e.target}
                        </span>
                        {isPreviewMode ? (
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        ) : (
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation()
                              deleteEdge(e.id)
                            }}
                            className="text-slate-400 hover:text-rose-400 p-0.5"
                            title="Disconnect edge"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {inboundEdges.length === 0 && outboundEdges.length === 0 && (
                <p className="text-[11px] text-slate-400">
                  Node is currently unlinked.
                </p>
              )}
            </div>

            {/* Remove Node Action (Hidden in Preview Mode) */}
            {!isPreviewMode && (
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
            )}
          </div>
        ) : selectedModule && !isPreviewMode ? (
          /* Palette Module Preview (Editor Mode Only) */
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
              {isPreviewMode && (
                <div className="mt-2 text-[11px] text-purple-500 dark:text-purple-300 font-medium">
                  Select any node on the canvas to inspect its configuration and connections in read-only mode.
                </div>
              )}
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
                        {validationReport.errorsCount} Error(s)
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
                        Graph Valid & Complete
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
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {isPreviewMode ? 'Detected Validation Issues:' : 'Issues to Resolve:'}
                  </span>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {validationReport.issues.map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => {
                          if (issue.nodeId) {
                            handleNavigateToNode(issue.nodeId)
                          }
                        }}
                        className={`p-2 rounded border text-[11px] leading-snug flex items-start gap-1.5 transition-colors ${
                          issue.nodeId ? 'cursor-pointer hover:border-purple-500 shadow-xs' : ''
                        } ${
                          issue.type === 'error'
                            ? isDark
                              ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                            : isDark
                            ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                        title={issue.nodeId ? 'Click to navigate to this node' : undefined}
                      >
                        {issue.type === 'error' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p>{issue.message}</p>
                          {issue.nodeId && (
                            <span className="text-[10px] text-purple-400 flex items-center gap-1 mt-0.5 font-medium">
                              <span>Click to inspect node</span>
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
                {isPreviewMode
                  ? `You are previewing the isolated draft for ${currentSiteMeta.name}. Exiting Preview returns you to the active editor with all changes preserved.`
                  : `Draft graphs and configurations are preserved independently for ${currentSiteMeta.name}. Switching sites will not bleed or overwrite drafts.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className={`p-2.5 border-t text-[10px] flex items-center justify-between ${
        isDark ? 'bg-slate-950/70 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}>
        <span>
          {isSimulationMode
            ? 'Part 5: Time Machine Simulation'
            : isPreviewMode
            ? 'Part 4: Workflow Preview'
            : 'Part 3: Configuration & Validation'}
        </span>
        <span
          className={`font-mono font-bold ${
            isSimulationMode
              ? 'text-amber-500'
              : isPreviewMode
              ? 'text-purple-500'
              : 'text-purple-500'
          }`}
        >
          {isSimulationMode ? 'Simulation Active' : isPreviewMode ? 'Preview Mode' : 'Active'}
        </span>
      </div>
    </aside>
  )
}
