import { useState } from 'react'
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
  Info,
  Compass,
  ChevronDown,
  ChevronUp,
  Workflow,
} from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { useWorkflowStore } from '../store/useWorkflowStore'

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
  const [showAdvanced, setShowAdvanced] = useState(false)

  const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [] }

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
          /* Placed Node Inspection & Settings (Structured in 8 Clear Steps) */
          <div className="space-y-3.5 text-xs">
            {/* 1. Node Name and Icon */}
            <div className={`p-3 rounded-xl border space-y-2.5 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
                    <Workflow className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 font-semibold border border-purple-500/30">
                    {activePlacedNode.data?.category || 'Operational Step'}
                  </span>
                </div>
                {activePlacedNode.data?.inputs === 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                    Starting Trigger
                  </span>
                )}
              </div>

              {/* Node Title (Read-Only in Preview Mode) */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <Edit3 className="w-3 h-3 text-purple-500" />
                  <span>Step Name</span>
                </label>
                {isPreviewMode ? (
                  <div className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold ${
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
                    className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-medium focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 focus:border-purple-500 text-slate-100'
                        : 'bg-white border-slate-300 focus:border-purple-500 text-slate-800'
                    }`}
                    placeholder="Enter plain English step title..."
                  />
                )}
              </div>

              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {activePlacedNode.data?.summary}
              </p>
            </div>

            {/* Validation Health Alert (Immediate plain-English visibility) */}
            {hasNodeErrors ? (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>
                    Action Required ({activeNodeIssues.filter((i) => i.type === 'error').length} Error{activeNodeIssues.filter((i) => i.type === 'error').length > 1 ? 's' : ''})
                  </span>
                </div>
                <ul className="space-y-1 text-[11px] pl-5 list-disc leading-relaxed">
                  {activeNodeIssues
                    .filter((i) => i.type === 'error')
                    .map((issue) => (
                      <li key={issue.id}>{issue.message}</li>
                    ))}
                </ul>
              </div>
            ) : hasNodeWarnings ? (
              <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>
                    Notice ({activeNodeIssues.filter((i) => i.type === 'warning').length})
                  </span>
                </div>
                <ul className="space-y-1 text-[11px] pl-5 list-disc leading-relaxed">
                  {activeNodeIssues
                    .filter((i) => i.type === 'warning')
                    .map((issue) => (
                      <li key={issue.id}>{issue.message}</li>
                    ))}
                </ul>
              </div>
            ) : (
              <div className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Configuration Valid & Verified</span>
              </div>
            )}

            {/* 2. What this step does */}
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                <span>What this step does</span>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {activePlacedNode.data?.explanation?.whatItDoes || activePlacedNode.data?.summary || 'Executes this operational action in the facility workflow.'}
              </p>
            </div>

            {/* 3. When to use it */}
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>When to use it</span>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {activePlacedNode.data?.explanation?.whenToUse || 'Include this step when this operational phase must be completed before continuing.'}
              </p>
            </div>

            {/* 4. Example */}
            <div className={`p-3 rounded-xl border space-y-2 ${
              isDark ? 'bg-purple-950/20 border-purple-800/40' : 'bg-purple-50/70 border-purple-200'
            }`}>
              <div className="text-[11px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                Practical Example
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {activePlacedNode.data?.explanation?.example || 'A team member executes this step during daily operations.'}
              </p>
              {activePlacedNode.data?.explanation?.nextStep && (
                <div className="pt-2 border-t border-purple-200/50 dark:border-purple-800/30 text-[11px]">
                  <strong className="text-purple-600 dark:text-purple-300 font-semibold">Suggested next step: </strong>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{activePlacedNode.data.explanation.nextStep}</span>
                </div>
              )}
            </div>

            {/* 5. Required Configuration */}
            <div className={`p-3 rounded-xl border space-y-3 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-500" />
                  <span>Required Configuration</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500 dark:text-rose-400 font-bold border border-rose-500/30">
                  {supportedSettings.filter((s) => s.required).length} Required
                </span>
              </div>

              {supportedSettings.filter((s) => s.required).length > 0 ? (
                <div className="space-y-3">
                  {supportedSettings
                    .filter((s) => s.required)
                    .map((setting) => {
                      const currentValue = nodeConfig[setting.key] ?? setting.defaultValue ?? ''
                      const fieldIssue = activeNodeIssues.find((i) => i.fieldKey === setting.key)

                      return (
                        <div key={setting.key} className="space-y-1">
                          <label className="flex items-center justify-between text-[11px] font-semibold">
                            <span className={fieldIssue ? 'text-rose-600 dark:text-rose-400 font-bold' : isDark ? 'text-slate-200' : 'text-slate-800'}>
                              {setting.label} <span className="text-rose-500">*</span>
                            </span>
                            {setting.help && (
                              <span title={setting.help} className="cursor-help text-slate-400">
                                <HelpCircle className="w-3 h-3" />
                              </span>
                            )}
                          </label>

                          {setting.description && (
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
                              {setting.description}
                            </p>
                          )}

                          {isPreviewMode ? (
                            <div className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-medium flex items-center justify-between ${
                              fieldIssue
                                ? 'border-rose-500/50 bg-rose-500/10 text-rose-300'
                                : isDark
                                ? 'bg-slate-900 border-slate-800 text-slate-200'
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}>
                              <span>{String(currentValue) || <span className="text-rose-500 italic">Missing</span>}</span>
                              <span className="text-[10px] font-mono text-purple-400">{setting.type}</span>
                            </div>
                          ) : (
                            <>
                              {setting.type === 'text' && (
                                <input
                                  type="text"
                                  value={currentValue}
                                  placeholder={setting.placeholder || `Enter ${setting.label.toLowerCase()}...`}
                                  onChange={(e) => updateNodeConfig(activePlacedNode.id, setting.key, e.target.value)}
                                  className={`w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none transition-colors ${
                                    fieldIssue
                                      ? 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-100'
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
                                  placeholder={setting.placeholder || '0'}
                                  onChange={(e) =>
                                    updateNodeConfig(
                                      activePlacedNode.id,
                                      setting.key,
                                      e.target.value === '' ? '' : Number(e.target.value)
                                    )
                                  }
                                  className={`w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none transition-colors ${
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
                                  className={`w-full px-2 py-1.5 border rounded-lg text-xs focus:outline-none transition-colors ${
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
                            </>
                          )}

                          {fieldIssue && (
                            <p className="text-[10.5px] text-rose-500 font-semibold flex items-center gap-1 pt-0.5">
                              <AlertCircle className="w-3 h-3 flex-shrink-0" />
                              <span>{fieldIssue.message}</span>
                            </p>
                          )}
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className={`text-[11px] italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  No mandatory settings for this module. Standard operational defaults will be applied automatically.
                </p>
              )}
            </div>

            {/* 6. Optional Configuration */}
            <div className={`p-3 rounded-xl border space-y-3 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <span>Optional Configuration</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {supportedSettings.filter((s) => !s.required).length} Optional
                </span>
              </div>

              {supportedSettings.filter((s) => !s.required).length > 0 ? (
                <div className="space-y-3">
                  {supportedSettings
                    .filter((s) => !s.required)
                    .map((setting) => {
                      const currentValue = nodeConfig[setting.key] ?? setting.defaultValue ?? ''

                      return (
                        <div key={setting.key} className="space-y-1">
                          <label className="flex items-center justify-between text-[11px] font-medium">
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                              {setting.label} <span className="text-[10px] text-slate-400 font-normal">(optional)</span>
                            </span>
                            {setting.help && (
                              <span title={setting.help} className="cursor-help text-slate-400">
                                <HelpCircle className="w-3 h-3" />
                              </span>
                            )}
                          </label>

                          {setting.description && (
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
                              {setting.description}
                            </p>
                          )}

                          {isPreviewMode ? (
                            <div className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-medium flex items-center justify-between ${
                              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                            }`}>
                              <span>
                                {setting.type === 'boolean'
                                  ? currentValue ? 'Enabled' : 'Disabled'
                                  : String(currentValue) || 'Default'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">{setting.type}</span>
                            </div>
                          ) : (
                            <>
                              {setting.type === 'text' && (
                                <input
                                  type="text"
                                  value={currentValue}
                                  placeholder={setting.placeholder || `Enter ${setting.label.toLowerCase()}...`}
                                  onChange={(e) => updateNodeConfig(activePlacedNode.id, setting.key, e.target.value)}
                                  className={`w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none transition-colors ${
                                    isDark
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
                                  placeholder={setting.placeholder || '0'}
                                  onChange={(e) =>
                                    updateNodeConfig(
                                      activePlacedNode.id,
                                      setting.key,
                                      e.target.value === '' ? '' : Number(e.target.value)
                                    )
                                  }
                                  className={`w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none transition-colors ${
                                    isDark
                                      ? 'bg-slate-900 border-slate-700 focus:border-purple-500 text-slate-100'
                                      : 'bg-white border-slate-300 focus:border-purple-500 text-slate-800'
                                  }`}
                                />
                              )}

                              {setting.type === 'select' && (
                                <select
                                  value={currentValue}
                                  onChange={(e) => updateNodeConfig(activePlacedNode.id, setting.key, e.target.value)}
                                  className={`w-full px-2 py-1.5 border rounded-lg text-xs focus:outline-none transition-colors ${
                                    isDark
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
                                  <span className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Enable / Enforce parameter
                                  </span>
                                </label>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className={`text-[11px] italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  No optional settings defined for this module.
                </p>
              )}
            </div>

            {/* 7. Incoming and Outgoing Connections */}
            <div className={`p-3 rounded-xl border space-y-2.5 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-purple-500" />
                  <span>Connections</span>
                </span>
                <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                  {inboundEdges.length} In • {outboundEdges.length} Out
                </span>
              </div>

              {/* Actionable Connection Guidance Callouts */}
              {!isPreviewMode && (
                <>
                  {(activePlacedNode.data?.inputs ?? 1) > 0 && inboundEdges.length === 0 && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
                        <span>Step is not connected to a previous step</span>
                      </div>
                      <p className="text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                        Connect a compatible output: Drag from an earlier step&apos;s right handle (<strong className="font-semibold text-slate-900 dark:text-slate-100">Next →</strong>) to this node&apos;s left handle (<strong className="font-semibold text-slate-900 dark:text-slate-100">← In</strong>).
                      </p>
                    </div>
                  )}

                  {(activePlacedNode.data?.outputs ?? 1) === 1 && outboundEdges.length === 0 && (
                    <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-[11px] text-purple-700 dark:text-purple-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-purple-500" />
                        <span>Connect the next operational step</span>
                      </div>
                      <p className="text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                        Drag from this step&apos;s right handle (<strong className="font-semibold text-slate-900 dark:text-slate-100">Next →</strong>) to the input handle of the next module.
                      </p>
                    </div>
                  )}

                  {(activePlacedNode.data?.outputs ?? 1) === 2 && (outboundEdges.length < 2 || !outboundEdges.some(e => e.sourceHandle === 'out-true') || !outboundEdges.some(e => e.sourceHandle === 'out-false')) && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <GitFork className="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
                        <span>Both True and False paths must be connected</span>
                      </div>
                      <p className="text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                        Connect green (<strong className="font-semibold text-emerald-600 dark:text-emerald-400">True →</strong>) for the approved path, and red (<strong className="font-semibold text-rose-600 dark:text-rose-400">False →</strong>) for the alternate path.
                      </p>
                    </div>
                  )}
                </>
              )}

              {inboundEdges.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Incoming Steps:</span>
                  {inboundEdges.map((e) => {
                    const sourceNode = currentDraft.nodes.find((n) => n.id === e.source)
                    return (
                      <div
                        key={e.id}
                        onClick={() => handleNavigateToNode(e.source)}
                        className={`p-1.5 rounded-lg flex items-center justify-between text-[11px] border cursor-pointer transition-colors ${
                          isDark
                            ? 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 hover:border-purple-500/40 text-slate-200'
                            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-800'
                        }`}
                        title="Click to focus incoming node on canvas"
                      >
                        <span className="truncate max-w-[170px] text-purple-600 dark:text-purple-400 font-medium">
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
                            className="text-slate-400 hover:text-rose-500 p-0.5"
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
                  <span className="text-[10px] uppercase font-bold text-slate-400">Outgoing Steps:</span>
                  {outboundEdges.map((e) => {
                    const targetNode = currentDraft.nodes.find((n) => n.id === e.target)
                    return (
                      <div
                        key={e.id}
                        onClick={() => handleNavigateToNode(e.target)}
                        className={`p-1.5 rounded-lg flex items-center justify-between text-[11px] border cursor-pointer transition-colors ${
                          isDark
                            ? 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 hover:border-purple-500/40 text-slate-200'
                            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-800'
                        }`}
                        title="Click to focus target node on canvas"
                      >
                        <span className="truncate max-w-[170px] text-cyan-600 dark:text-cyan-400 font-medium">
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
                            className="text-slate-400 hover:text-rose-500 p-0.5"
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
                <p className={`text-[11px] italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Node is currently unlinked. Connect input/output handles to integrate into workflow.
                </p>
              )}
            </div>

            {/* 8. Advanced Settings (Collapsible Accordion) */}
            <div className={`rounded-xl border overflow-hidden ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`w-full px-3 py-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Advanced Settings</span>
                </span>
                {showAdvanced ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {showAdvanced && (
                <div className="p-3 pt-1 space-y-2.5 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Node Identifier:</span>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                      {activePlacedNode.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Module ID:</span>
                    <span className="font-mono text-[10px] text-purple-500 dark:text-purple-400">
                      {activePlacedNode.data?.id}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Raw Parameters JSON:</span>
                    <pre className={`p-2 rounded-lg font-mono text-[10px] overflow-x-auto border ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      {JSON.stringify(nodeConfig, null, 2)}
                    </pre>
                  </div>

                  {!isPreviewMode && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => deleteNode(activePlacedNode.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-600 dark:text-rose-300 transition-colors text-xs font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Placed Node</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
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
          <div className="space-y-3.5 text-xs">
            {/* WORKFLOW VALIDATION SUMMARY */}
            <div className={`p-3.5 rounded-xl border space-y-3 ${
              currentDraft.nodes.length === 0
                ? isDark
                  ? 'bg-slate-950/60 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
                : validationReport.hasErrors
                ? isDark
                  ? 'bg-rose-950/30 border-rose-800/60'
                  : 'bg-rose-50/80 border-rose-200'
                : validationReport.hasWarnings
                ? isDark
                  ? 'bg-amber-950/30 border-amber-800/60'
                  : 'bg-amber-50/80 border-amber-200'
                : isDark
                ? 'bg-emerald-950/30 border-emerald-800/60'
                : 'bg-emerald-50/80 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {currentDraft.nodes.length === 0 ? (
                    <>
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500 dark:text-slate-400">Canvas Empty</span>
                    </>
                  ) : validationReport.hasErrors ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span className="text-rose-600 dark:text-rose-400">
                        {validationReport.errorsCount} Error{validationReport.errorsCount === 1 ? '' : 's'}
                      </span>
                    </>
                  ) : validationReport.hasWarnings ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-600 dark:text-amber-400">
                        {validationReport.warningsCount} Notice{validationReport.warningsCount === 1 ? '' : 's'}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Graph Valid &amp; Complete
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
                <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {isPreviewMode ? 'Detected Validation Issues:' : 'Actionable Issues:'}
                  </span>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {validationReport.issues.map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => {
                          if (issue.nodeId) {
                            handleNavigateToNode(issue.nodeId)
                          }
                        }}
                        className={`p-2 rounded-lg border text-[11px] leading-snug flex items-start gap-1.5 transition-colors ${
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
                        title={issue.nodeId ? 'Click to navigate to this node on canvas' : undefined}
                      >
                        {issue.type === 'error' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{issue.message}</p>
                          {issue.actionHint && (
                            <p className="mt-1 text-[10.5px] text-slate-600 dark:text-slate-400">
                              <span className="font-semibold text-purple-600 dark:text-purple-300">Action: </span>
                              {issue.actionHint}
                            </p>
                          )}
                          {issue.nodeId && (
                            <span className="text-[10px] text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1 font-medium">
                              <span>Jump to affected step</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : currentDraft.nodes.length === 0 ? (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select &quot;Use a Template&quot; on the canvas to load a validated facility sequence, or &quot;Build from Scratch&quot; to add an initiating trigger.
                </p>
              ) : (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  All placed modules are connected with valid required settings and complete input/output wiring.
                </p>
              )}
            </div>

            {/* Contextual inspector hint */}
            <div className={`p-3 rounded-xl border text-[11px] text-slate-500 dark:text-slate-400 ${
              isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <Info className="w-3.5 h-3.5 text-purple-500" />
                <span>Node Inspector</span>
              </div>
              <p className="leading-relaxed">
                Click any placed node on the canvas to inspect its operational purpose, practical examples, configure required parameters, and view connection wiring.
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
            ? 'Time Machine Simulation'
            : isPreviewMode
            ? 'Workflow Preview'
            : 'Inspector & Validation'}
        </span>
        <span
          className={`font-mono font-bold ${
            isSimulationMode
              ? 'text-amber-500'
              : isPreviewMode
              ? 'text-purple-500'
              : 'text-purple-600 dark:text-purple-400'
          }`}
        >
          {isSimulationMode ? 'Simulation Active' : isPreviewMode ? 'Read-Only' : 'Ready'}
        </span>
      </div>
    </aside>
  )
}
