import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import {
  Workflow,
  Sparkles,
  StepForward,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  GitFork,
  ArrowRight,
  HelpCircle,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { WorkflowNode } from '../nodes/WorkflowNode'
import { SITES, WORKFLOW_MODULES } from '../registry/siteModules'
import { WORKFLOW_TEMPLATES } from '../templates/workflowTemplates'

export function WorkflowCanvas() {
  const reactFlowWrapper = useRef(null)
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = useReactFlow()
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate)
  const startFromScratch = useWorkflowStore((s) => s.startFromScratch)
  const openExistingWorkflow = useWorkflowStore((s) => s.openExistingWorkflow)
  const resetToCreationScreen = useWorkflowStore((s) => s.resetToCreationScreen)

  const theme = useWorkflowStore((s) => s.theme)
  const isDark = theme === 'dark'

  const activeSite = useWorkflowStore((s) => s.activeSite)
  const siteDrafts = useWorkflowStore((s) => s.siteDrafts)
  const isPreviewMode = useWorkflowStore((s) => s.isPreviewMode)
  const togglePreviewMode = useWorkflowStore((s) => s.togglePreviewMode)
  const isSimulationMode = useWorkflowStore((s) => s.isSimulationMode)
  const simulation = useWorkflowStore((s) => s.simulation)
  const stepForward = useWorkflowStore((s) => s.stepForward)
  const chooseBranch = useWorkflowStore((s) => s.chooseBranch)
  const restartSimulation = useWorkflowStore((s) => s.restartSimulation)
  const exitSimulation = useWorkflowStore((s) => s.exitSimulation)
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange)
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange)
  const onConnect = useWorkflowStore((s) => s.onConnect)
  const addNode = useWorkflowStore((s) => s.addNode)
  const insertNodeIntoConnection = useWorkflowStore((s) => s.insertNodeIntoConnection)
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId)
  const contextualHint = useWorkflowStore((s) => s.contextualHint)
  const clearContextualHint = useWorkflowStore((s) => s.clearContextualHint)
  const setTemplateModalOpen = useWorkflowStore((s) => s.setTemplateModalOpen)
  const isGuideOpen = useWorkflowStore((s) => s.isGuideOpen)
  const toggleGuide = useWorkflowStore((s) => s.toggleGuide)
  const setIsGuideOpen = useWorkflowStore((s) => s.setIsGuideOpen)
  const getActiveValidationReport = useWorkflowStore((s) => s.getActiveValidationReport)

  const [dismissedWelcome, setDismissedWelcome] = useState(false)
  const [pendingEdgeInsertion, setPendingEdgeInsertion] = useState(null)

  const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [], zoom: 100 }
  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]
  const nodes = useMemo(() => currentDraft.nodes || [], [currentDraft.nodes])
  const edges = useMemo(() => currentDraft.edges || [], [currentDraft.edges])

  const siteTemplate = useMemo(() => {
    return WORKFLOW_TEMPLATES.find((t) => t.siteId === activeSite) || WORKFLOW_TEMPLATES[0]
  }, [activeSite])

  const validationReport = getActiveValidationReport()

  // Recommended trigger node for active site onboarding
  const recommendedTriggerId = {
    'central-stores': 'stores-requisition-intake',
    'service-centre': 'service-ticket-intake',
    distribution: 'dist-order-queued',
  }[activeSite] || 'stores-requisition-intake'

  const recommendedTriggerMod = useMemo(() => {
    return (
      WORKFLOW_MODULES.find((m) => m.id === recommendedTriggerId) ||
      WORKFLOW_MODULES.find((m) => m.inputs === 0)
    )
  }, [recommendedTriggerId])

  const handleAddRecommendedTrigger = useCallback(() => {
    if (!recommendedTriggerMod) return
    const initialConfig = {}
    if (recommendedTriggerMod.supportedSettings) {
      recommendedTriggerMod.supportedSettings.forEach((setting) => {
        initialConfig[setting.key] = setting.defaultValue ?? ''
      })
    }

    addNode({
      id: `node_${recommendedTriggerMod.id}_${Date.now()}`,
      type: 'workflowNode',
      position: { x: 80, y: 160 },
      data: {
        ...recommendedTriggerMod,
        label: recommendedTriggerMod.name,
        config: initialConfig,
      },
    })
    setDismissedWelcome(true)
  }, [recommendedTriggerMod, addNode])

  const entryNodes = useMemo(() => nodes.filter((n) => (n.data?.inputs ?? 0) === 0), [nodes])

  const guidedStep = useMemo(() => {
    if (nodes.length === 0 || entryNodes.length === 0) {
      return {
        number: 1,
        title: 'Step 1 — Choose how the workflow starts',
        instruction: 'A starting step tells the workflow when or how the process begins.',
        detail: `Add a registered starting trigger (such as ${recommendedTriggerMod?.name || 'Requisition Intake'}) from the left palette.`,
      }
    }
    if (nodes.length === 1) {
      return {
        number: 2,
        title: 'Step 2 — Add the next step',
        instruction: 'Add the next operational module needed in the sequence.',
        detail: `Suggested next steps: ${recommendedTriggerMod?.data?.explanation?.nextStep || 'Stock Availability Check, Conditional Router, or Approval Gate'}.`,
      }
    }
    const hasUnconnectedInbound = nodes.some(
      (n) => (n.data?.inputs ?? 1) > 0 && !edges.some((e) => e.target === n.id)
    )
    if (hasUnconnectedInbound || edges.length < nodes.length - 1) {
      return {
        number: 3,
        title: 'Step 3 — Connect the steps',
        instruction: 'Connect upstream steps to downstream steps using directional handles.',
        detail: 'Drag from an upstream step\'s right handle ("Next →") to the downstream step\'s left handle ("← In").',
      }
    }
    if (validationReport.hasErrors) {
      return {
        number: 4,
        title: 'Step 4 — Configure the steps',
        instruction: 'Complete required configuration parameters in the Node Settings inspector.',
        detail: `${validationReport.errorsCount} required configuration issue(s) remaining.`,
      }
    }
    return {
      number: 5,
      title: 'Step 5 — Validate and test',
      instruction: 'All steps and connections are valid! Your workflow is ready.',
      detail: 'Run Time Machine simulation to test traversal, or Save Draft / Publish SOP.',
    }
  }, [nodes, entryNodes, edges, recommendedTriggerMod, validationReport])

  // Register custom node types
  const nodeTypes = useMemo(() => ({ workflowNode: WorkflowNode }), [])

  // Currently active simulation node
  const currentNode =
    isSimulationMode && simulation?.currentNodeId
      ? nodes.find((n) => n.id === simulation.currentNodeId)
      : null

  // Style edges dynamically: In simulation mode, highlight traversed edges with animated glowing stroke
  const displayEdges = useMemo(() => {
    const rawEdges = currentDraft.edges || []
    if (!isSimulationMode) return rawEdges

    const traversedIds = new Set(simulation?.traversedEdgeIds || [])
    return rawEdges.map((edge) => {
      const isTraversed = traversedIds.has(edge.id)
      if (isTraversed) {
        return {
          ...edge,
          animated: true,
          style: {
            ...edge.style,
            stroke: '#f59e0b', // amber-500
            strokeWidth: 3.5,
            filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.7))',
          },
          markerEnd: {
            ...edge.markerEnd,
            color: '#f59e0b',
          },
        }
      }
      return {
        ...edge,
        animated: false,
        style: {
          ...edge.style,
          opacity: 0.3,
          stroke: isDark ? '#475569' : '#cbd5e1',
        },
        markerEnd: {
          ...edge.markerEnd,
          color: isDark ? '#475569' : '#cbd5e1',
        },
      }
    })
  }, [currentDraft.edges, isSimulationMode, simulation?.traversedEdgeIds, isDark])

  // Drag and drop handlers (disabled in preview & simulation modes)
  const onDragOver = useCallback(
    (event) => {
      if (isPreviewMode || isSimulationMode) return
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    [isPreviewMode, isSimulationMode]
  )

  const onDrop = useCallback(
    (event) => {
      if (isPreviewMode || isSimulationMode) return
      event.preventDefault()

      const rawData = event.dataTransfer.getData('application/reactflow')
      if (!rawData) return

      let moduleData
      try {
        moduleData = JSON.parse(rawData)
      } catch {
        return
      }

      // Compute canvas-relative coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNodeId = `node_${moduleData.id}_${Date.now()}`

      const newNode = {
        id: newNodeId,
        type: 'workflowNode',
        position,
        data: {
          ...moduleData,
          label: moduleData.name,
        },
      }

      // Check if dropped near an existing connection between source and target nodes
      let candidateEdge = null
      let minDistance = Infinity

      if (currentDraft.edges?.length > 0 && (moduleData.inputs ?? 1) > 0 && (moduleData.outputs ?? 1) > 0) {
        currentDraft.edges.forEach((edge) => {
          const sNode = currentDraft.nodes.find((n) => n.id === edge.source)
          const tNode = currentDraft.nodes.find((n) => n.id === edge.target)
          if (!sNode || !tNode) return

          // Source handle is on right side of source node, target handle is on left side of target node
          const sx = sNode.position.x + 240
          const sy = sNode.position.y + 45
          const tx = tNode.position.x
          const ty = tNode.position.y + 45

          // Calculate point to segment distance
          const l2 = (tx - sx) * (tx - sx) + (ty - sy) * (ty - sy)
          let dist = Infinity
          if (l2 === 0) {
            dist = Math.hypot(position.x - sx, position.y - sy)
          } else {
            let t = ((position.x - sx) * (tx - sx) + (position.y - sy) * (ty - sy)) / l2
            t = Math.max(0, Math.min(1, t))
            dist = Math.hypot(position.x - (sx + t * (tx - sx)), position.y - (sy + t * (ty - sy)))
          }

          if (dist < 90 && dist < minDistance) {
            minDistance = dist
            candidateEdge = {
              edgeId: edge.id,
              sourceId: edge.source,
              targetId: edge.target,
              sourceHandle: edge.sourceHandle,
              targetHandle: edge.targetHandle,
              sourceName: sNode.data?.label || sNode.data?.name || 'Step',
              targetName: tNode.data?.label || tNode.data?.name || 'Step',
            }
          }
        })
      }

      addNode(newNode)

      if (candidateEdge) {
        setPendingEdgeInsertion({
          newNodeId,
          newNodeName: moduleData.name,
          ...candidateEdge,
        })
      } else {
        setPendingEdgeInsertion(null)
      }
    },
    [screenToFlowPosition, addNode, isPreviewMode, isSimulationMode, currentDraft.edges, currentDraft.nodes]
  )

  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedNodeId(node.id)
    },
    [setSelectedNodeId]
  )

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [setSelectedNodeId])

  return (
    <div
      ref={reactFlowWrapper}
      className={`flex-1 h-full w-full relative overflow-hidden transition-colors ${
        isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-100 text-slate-800'
      }`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Edge Insertion Helper when dropped near an existing connection */}
      {pendingEdgeInsertion && !isPreviewMode && !isSimulationMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple-950/95 text-white border border-purple-400/50 shadow-2xl backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-purple-300 flex-shrink-0" />
          <span className="text-xs">
            Insert <strong>{pendingEdgeInsertion.newNodeName}</strong> into connection between <strong>{pendingEdgeInsertion.sourceName}</strong> and <strong>{pendingEdgeInsertion.targetName}</strong>?
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <button
              type="button"
              onClick={() => {
                insertNodeIntoConnection(pendingEdgeInsertion.edgeId, pendingEdgeInsertion.newNodeId)
                setPendingEdgeInsertion(null)
              }}
              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Insert into Connection
            </button>
            <button
              type="button"
              onClick={() => setPendingEdgeInsertion(null)}
              className="px-2 py-1 rounded-lg hover:bg-purple-900/60 text-purple-200 text-xs transition-colors cursor-pointer"
            >
              Keep Connection as-is
            </button>
            <button
              type="button"
              onClick={() => setPendingEdgeInsertion(null)}
              className="text-purple-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              title="Dismiss"
              aria-label="Dismiss insertion prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Contextual Guidance Toast Banner */}
      {contextualHint && !pendingEdgeInsertion && !isSimulationMode && !isPreviewMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple-950/95 text-purple-100 border border-purple-500/50 shadow-2xl backdrop-blur-md max-w-lg transition-all">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping flex-shrink-0" />
          <p className="text-xs leading-snug flex-1">
            <span className="font-bold text-purple-300">Tip: </span>
            {contextualHint}
          </p>
          <button
            type="button"
            onClick={clearContextualHint}
            className="text-purple-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            title="Dismiss tip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Preview Mode Floating Banner (Part 4) */}
      {isPreviewMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/90 dark:bg-slate-900/95 border border-purple-500/50 text-slate-100 shadow-2xl shadow-purple-950/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wide text-purple-300">
              Preview Mode (Read-Only)
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-[11px] text-slate-300">
              {currentSiteMeta.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({nodes.length} {nodes.length === 1 ? 'node' : 'nodes'}, {edges.length}{' '}
              {edges.length === 1 ? 'connection' : 'connections'})
            </span>
          </div>
          <button
            type="button"
            onClick={togglePreviewMode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors"
            title="Return to canvas editor"
          >
            <span>Return to Editor</span>
          </button>
        </div>
      )}

      {/* Time Machine Simulation Control Deck (Part 5) */}
      {!isPreviewMode && isSimulationMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-3 pointer-events-none">
          <div
            className={`pointer-events-auto rounded-2xl border shadow-2xl backdrop-blur-md transition-all p-3 space-y-2.5 ${
              isDark
                ? 'bg-slate-900/95 border-amber-500/40 shadow-black/70 text-slate-100'
                : 'bg-white/95 border-amber-400 shadow-slate-300/80 text-slate-800'
            }`}
          >
            {/* Top Bar: Status Badge, Step Counter & Main Actions */}
            <div className="flex items-center justify-between gap-2.5 flex-wrap">
              <div className="flex items-center gap-2">
                {/* Status Indicator */}
                {simulation?.status === 'running' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/40">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Sim Running</span>
                  </span>
                )}
                {simulation?.status === 'branching' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40 animate-pulse">
                    <GitFork className="w-3.5 h-3.5 text-purple-400" />
                    <span>Choose Branch</span>
                  </span>
                )}
                {simulation?.status === 'completed' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Completed</span>
                  </span>
                )}
                {simulation?.status === 'blocked' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Blocked</span>
                  </span>
                )}
                {simulation?.status === 'invalid' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Workflow Invalid</span>
                  </span>
                )}
                {simulation?.status === 'empty' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Canvas Empty</span>
                  </span>
                )}

                {/* Step Counter */}
                <span className={`text-xs font-mono font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Step {simulation?.currentStep || 0} of {Math.max(simulation?.totalSteps || 0, 1)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Step Forward */}
                <button
                  type="button"
                  onClick={stepForward}
                  disabled={simulation?.status !== 'running'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    simulation?.status === 'running'
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-[1.02] cursor-pointer'
                      : 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                  }`}
                  title={
                    simulation?.status === 'running'
                      ? 'Advance to next workflow step'
                      : simulation?.status === 'branching'
                      ? 'Select an outgoing branch below to advance'
                      : 'Step forward unavailable'
                  }
                >
                  <StepForward className="w-3.5 h-3.5" />
                  <span>Step Forward</span>
                </button>

                {/* Restart */}
                <button
                  type="button"
                  onClick={restartSimulation}
                  disabled={simulation?.status === 'empty' || simulation?.status === 'invalid'}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    simulation?.status !== 'empty' && simulation?.status !== 'invalid'
                      ? isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 cursor-pointer'
                      : 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                  }`}
                  title="Restart simulation from entry node"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Restart</span>
                </button>

                {/* Exit Simulation */}
                <button
                  type="button"
                  onClick={exitSimulation}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-300'
                  }`}
                  title="Exit simulation mode and return to canvas editor"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>
              </div>
            </div>

            {/* Branch Selection Section (when multiple outgoing connections exist) */}
            {simulation?.status === 'branching' && (simulation?.pendingBranches?.length ?? 0) > 0 && (
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-200">
                  <GitFork className="w-3.5 h-3.5 text-purple-400" />
                  <span>Branching Rule Undefined: Please choose next connection to follow:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {simulation.pendingBranches.map((branch) => (
                    <button
                      key={branch.edgeId}
                      type="button"
                      onClick={() => chooseBranch(branch.edgeId, branch.targetNodeId)}
                      className={`text-left p-2 rounded-lg border flex items-center justify-between gap-2 transition-all hover:scale-[1.01] cursor-pointer ${
                        isDark
                          ? 'bg-slate-900/90 hover:bg-purple-900/40 border-purple-500/40 text-purple-200 hover:border-purple-400'
                          : 'bg-white hover:bg-purple-50 border-purple-200 text-purple-900 hover:border-purple-400 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] uppercase font-bold text-amber-500 dark:text-amber-400 tracking-wider">
                          {branch.branchLabel}
                        </span>
                        <span className="text-xs font-semibold truncate text-slate-900 dark:text-slate-100">
                          {branch.targetNodeName}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Node Detail Summary */}
            {currentNode && (
              <div
                className={`p-2 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-amber-500 flex-shrink-0">Active Node:</span>
                  <span className="font-semibold truncate text-slate-900 dark:text-slate-100">
                    {currentNode.data?.label || currentNode.data?.name}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border font-medium flex-shrink-0 ${
                      isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {currentNode.data?.category || 'Module'}
                  </span>
                </div>

                {/* Config Preview */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end text-[11px] text-slate-400">
                  {Object.entries(currentNode.data?.config || {}).length > 0 ? (
                    Object.entries(currentNode.data.config)
                      .slice(0, 3)
                      .map(([k, v]) => (
                        <span
                          key={k}
                          className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                            isDark
                              ? 'bg-slate-900 border-slate-800 text-slate-300'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          {k}: <strong className="text-amber-500">{String(v)}</strong>
                        </span>
                      ))
                  ) : (
                    <span className="text-[10px] italic text-slate-500">Default parameters</span>
                  )}
                </div>
              </div>
            )}

            {/* Informational / Status / Blocked Message */}
            {simulation?.message && (
              <p
                className={`text-[11px] leading-relaxed ${
                  simulation.status === 'completed'
                    ? 'text-emerald-500 dark:text-emerald-400 font-medium'
                    : simulation.status === 'blocked' || simulation.status === 'invalid'
                    ? 'text-rose-500 dark:text-rose-400 font-medium'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                {simulation.message}
                {simulation.blockedReason && (
                  <span className="block mt-0.5 font-mono text-[10px] opacity-80">
                    Reason: {simulation.blockedReason}
                  </span>
                )}
              </p>
            )}

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
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
                      ? Math.min(100, Math.round((simulation.currentStep / simulation.totalSteps) * 100))
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive @xyflow/react Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView={nodes.length > 0}
        minZoom={0.25}
        maxZoom={2.0}
        nodesDraggable={!isPreviewMode && !isSimulationMode}
        nodesConnectable={!isPreviewMode && !isSimulationMode}
        elementsSelectable={true}
        deleteKeyCode={isPreviewMode || isSimulationMode ? null : ['Backspace', 'Delete']}
        multiSelectionKeyCode={isPreviewMode || isSimulationMode ? null : ['Meta', 'Control', 'Shift']}
        connectionLineType="smoothstep"
        connectionLineStyle={{ stroke: '#a855f7', strokeWidth: 2.5 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#a855f7', strokeWidth: 2.5 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color={isDark ? '#334155' : '#cbd5e1'}
          gap={24}
          size={1.5}
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.data?.category === 'Core System' || node.data?.isCore) return '#6366f1'
            if (node.data?.category === 'Trigger') return '#a855f7'
            if (node.data?.category === 'Flow Control') return '#f59e0b'
            return '#3b82f6'
          }}
          maskColor={isDark ? 'rgba(2, 6, 23, 0.75)' : 'rgba(241, 245, 249, 0.75)'}
          className={`!rounded-lg !shadow-xl ${
            isDark ? '!bg-slate-900/90 !border-slate-800' : '!bg-white/95 !border-slate-200'
          }`}
        />
      </ReactFlow>

      {/* Creation Screen (Part 1 & Part 6) — Displayed when no draft is loaded */}
      {(!currentDraft.isDraftLoaded || (nodes.length === 0 && !dismissedWelcome)) && (
        <div
          className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-20 p-4 sm:p-6"
          style={{
            backgroundImage: `radial-gradient(${isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.15)'} 1px, transparent 1px)`,
            backgroundSize: `24px 24px`,
          }}
        >
          {isPreviewMode ? (
            <div className="max-w-md mx-auto text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-950/20">
                <Workflow className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className={`text-base font-bold tracking-tight mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                No Workflow Configured for {currentSiteMeta.name}
              </h1>
              <p className={`text-xs max-w-sm leading-relaxed mb-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                This operational facility draft currently has no nodes placed. Return to the editor to drag and connect modules from the palette.
              </p>
              <button
                type="button"
                onClick={togglePreviewMode}
                className="pointer-events-auto px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                Return to Editor
              </button>
            </div>
          ) : (
            <div className="max-w-2xl w-full mx-auto text-center flex flex-col items-center space-y-5">
              {/* Header: Title & Subtitle */}
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/30 text-white mb-0.5">
                  <Workflow className="w-5 h-5" />
                </div>
                <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Create a workflow
                </h1>
                <p className={`text-xs max-w-md leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Choose a template or build your own workflow, step by step.
                </p>
                <div className="flex items-center gap-2 pt-0.5 text-[11px]">
                  <span className="text-slate-400">Target Facility:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold border ${currentSiteMeta.badgeColor}`}>
                    {currentSiteMeta.name}
                  </span>
                </div>
              </div>

              {/* Two Balanced Equal Choices (Part 6): Card A (Use a Template) vs Card B (Build from Scratch) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch text-left">
                {/* Option A — Use a Template */}
                <div
                  className={`pointer-events-auto rounded-2xl border p-6 flex flex-col justify-between h-full transition-all shadow-xs ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        Predefined SOP
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-medium">
                        {siteTemplate.nodesCount} Steps
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className={`text-sm font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        Use a Template
                      </h2>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Start with a ready-made workflow and customize it.
                      </p>
                    </div>

                    {/* Site Template Preview Container */}
                    <div className={`p-3 rounded-xl border text-left space-y-1.5 min-h-[92px] ${
                      isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                    }`}>
                      <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 font-medium">
                        <span>Target: {currentSiteMeta.name}</span>
                        <span className="font-mono">{siteTemplate.badge}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {siteTemplate.name}
                      </div>
                      <p className={`text-[11px] leading-relaxed line-clamp-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {siteTemplate.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-auto space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        loadTemplate(siteTemplate.id)
                        setDismissedWelcome(true)
                      }}
                      className="w-full h-10 flex items-center justify-center gap-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use This Template</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateModalOpen(true)}
                      className="w-full text-center text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium py-1 transition-colors cursor-pointer"
                    >
                      Browse All Templates
                    </button>
                  </div>
                </div>

                {/* Option B — Build from Scratch */}
                <div
                  className={`pointer-events-auto rounded-2xl border p-6 flex flex-col justify-between h-full transition-all shadow-xs ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        Custom Workflow
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-medium">
                        Step-by-Step
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className={`text-sm font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        Build from Scratch
                      </h2>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Create your workflow one step at a time.
                      </p>
                    </div>

                    {/* Starter Helper Message Container - Balanced with Card A */}
                    <div className={`p-3 rounded-xl border text-left space-y-1.5 min-h-[92px] ${
                      isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                    }`}>
                      <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 font-medium">
                        <span>Assembly: {currentSiteMeta.name}</span>
                        <span className="font-mono">Blank Canvas</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Workflow Guidance
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Add a starting step, connect modules, and configure each step.
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-auto space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        startFromScratch(activeSite)
                        setDismissedWelcome(true)
                      }}
                      className="w-full h-10 flex items-center justify-center gap-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Build from Scratch</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        startFromScratch(activeSite)
                        setDismissedWelcome(true)
                      }}
                      className={`w-full text-center text-xs py-1 transition-colors cursor-pointer font-medium ${
                        isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Open Blank Canvas
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional: Resume Previously Saved Draft for this facility */}
              {currentDraft.hasExistingSavedDraft && currentDraft.nodes?.length > 0 && (
                <div className={`pointer-events-auto px-4 py-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 max-w-lg w-full ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50/90 border-slate-200 text-slate-700 shadow-xs'
                }`}>
                  <span className="truncate">
                    Saved draft available ({currentDraft.nodes.length} nodes, {currentDraft.lastSaved})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      openExistingWorkflow(activeSite)
                      setDismissedWelcome(true)
                    }}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-bold whitespace-nowrap cursor-pointer hover:underline"
                  >
                    Resume Saved Draft →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Friendly Empty Canvas State (Part 4) — When canvas is loaded from scratch with 0 nodes */}
      {currentDraft.isDraftLoaded && nodes.length === 0 && !isPreviewMode && (
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10 p-6">
          <div className={`pointer-events-auto max-w-md w-full rounded-2xl border p-6 text-center shadow-lg backdrop-blur-md space-y-4 ${
            isDark ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-xs">
              <Workflow className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-sm font-bold tracking-tight">Your workflow starts here</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Drag a module from the left panel to add your first step.
              </p>
            </div>

            {recommendedTriggerMod && (
              <div className={`p-3.5 rounded-xl border text-left space-y-2 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-purple-50/50 border-purple-100'
              }`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                    Recommended Starting Trigger:
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {currentSiteMeta.name}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {recommendedTriggerMod.name}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {recommendedTriggerMod.summary}
                </p>
                <button
                  type="button"
                  onClick={handleAddRecommendedTrigger}
                  className="w-full mt-1 h-8.5 flex items-center justify-center gap-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add {recommendedTriggerMod.name} to Canvas</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  resetToCreationScreen(activeSite)
                  setDismissedWelcome(false)
                }}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium hover:underline cursor-pointer"
              >
                ← Return to Template Options
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Canvas Zoom & Navigation Controls (Section 4 - Consolidated Single Location) */}
      <div className={`absolute bottom-4 left-4 z-20 flex items-center gap-1 p-1 rounded-xl border shadow-md backdrop-blur transition-all ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-700'
      }`}>
        <button
          type="button"
          onClick={() => zoomIn({ duration: 250 })}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Zoom In"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => zoomOut({ duration: 250 })}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className={`w-[1px] h-3.5 mx-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
        <button
          type="button"
          onClick={() => fitView({ padding: 0.25, duration: 300 })}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Fit All Nodes in View"
          aria-label="Fit view"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <div className={`w-[1px] h-3.5 mx-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
        <span className="text-[10px] font-mono px-1.5 text-slate-400 select-none">
          {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'} • {edges.length} {edges.length === 1 ? 'connection' : 'connections'}
        </span>
      </div>

      {/* Bottom-Center: On-Demand Guide Trigger */}
      {!isPreviewMode && !isSimulationMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <button
            type="button"
            onClick={() => {
              if (nodes.length === 0) {
                setDismissedWelcome(false)
                setScratchStep(false)
              } else {
                toggleGuide()
              }
            }}
            className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] cursor-pointer ${
              isDark
                ? 'bg-slate-900/90 hover:bg-slate-800 border-purple-500/30 text-purple-300 hover:text-white'
                : 'bg-white/95 hover:bg-purple-50 border-purple-200 text-purple-700 shadow-purple-50'
            }`}
            title="Open Contextual SOP Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
            <span>Help &amp; Guide</span>
          </button>
        </div>
      )}

      {/* Contextual Stepper Drawer (Only opened on-demand via Help & Guide, dismissible) */}
      {nodes.length > 0 && isGuideOpen && !isPreviewMode && !isSimulationMode && (
        <div className="absolute top-4 right-4 z-20 w-76 pointer-events-auto rounded-2xl border shadow-xl backdrop-blur-md transition-all p-3 space-y-2 bg-white/95 dark:bg-slate-900/95 border-purple-500/40 text-slate-800 dark:text-slate-100">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {guidedStep.number}
              </span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-300 truncate">
                {guidedStep.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsGuideOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md transition-colors cursor-pointer"
              title="Close guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] leading-snug">
              {guidedStep.instruction}
            </p>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {guidedStep.detail}
            </p>
          </div>

          {/* Stepper Dots */}
          <div className="pt-1.5 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <span
                  key={stepNum}
                  className={`h-1.5 rounded-full transition-all ${
                    stepNum === guidedStep.number
                      ? 'w-3.5 bg-purple-600'
                      : stepNum < guidedStep.number
                      ? 'w-1.5 bg-emerald-500'
                      : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono">Step {guidedStep.number}/5</span>
          </div>
        </div>
      )}
    </div>
  )
}
