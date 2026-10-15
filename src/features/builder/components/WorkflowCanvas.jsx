import { useCallback, useMemo, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import {
  Workflow,
  Sparkles,
  Compass,
  StepForward,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  GitFork,
  ArrowRight,
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { WorkflowNode } from '../nodes/WorkflowNode'
import { SITES } from '../registry/siteModules'

export function WorkflowCanvas() {
  const reactFlowWrapper = useRef(null)
  const { screenToFlowPosition } = useReactFlow()

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
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId)

  const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [], zoom: 100 }
  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]
  const nodes = currentDraft.nodes || []
  const edges = currentDraft.edges || []

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

      addNode(newNode)
    },
    [screenToFlowPosition, addNode, isPreviewMode, isSimulationMode]
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
        <Controls
          className={`!rounded-lg !shadow-xl ${
            isDark
              ? '!bg-slate-900 !border-slate-800 !text-slate-200 [&>button]:!border-slate-800 [&>button]:!fill-slate-300 hover:[&>button]:!bg-slate-800'
              : '!bg-white !border-slate-200 !text-slate-700 [&>button]:!border-slate-200 [&>button]:!fill-slate-600 hover:[&>button]:!bg-slate-100'
          }`}
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

      {/* Empty State Overlay */}
      {nodes.length === 0 && (
        <div
          className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10 p-6"
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
                className="pointer-events-auto px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-colors"
              >
                Return to Editor
              </button>
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center flex flex-col items-center">
              {/* Visual Glyph */}
              <div className="relative mb-5 group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-950/30">
                  <Workflow className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-purple-600 border border-white/40 flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Heading & Subtitle */}
              <h1 className={`text-lg font-bold tracking-tight mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Drag modules here to build your workflow
              </h1>
              <p className={`text-xs max-w-md leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                You are editing the operational canvas for{' '}
                <span className="text-purple-600 dark:text-purple-300 font-semibold">{currentSiteMeta.name}</span>.
                Choose from 13 Approved Core Modules or 20 Operational Triggers/Actions in the left palette.
              </p>

              {/* 3 Quick-Start Step Cards */}
              <div className="grid grid-cols-3 gap-3 w-full text-left mb-6">
                <div className={`p-3 rounded-lg border ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="w-5 h-5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[11px] font-bold flex items-center justify-center mb-2 font-mono">
                    1
                  </div>
                  <h2 className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Pick a Module
                  </h2>
                  <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Drag any core system, trigger, or action card onto the canvas.
                  </p>
                </div>

                <div className={`p-3 rounded-lg border ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="w-5 h-5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[11px] font-bold flex items-center justify-center mb-2 font-mono">
                    2
                  </div>
                  <h2 className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Connect Handles
                  </h2>
                  <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Drag between output and input handles to wire execution paths.
                  </p>
                </div>

                <div className={`p-3 rounded-lg border ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="w-5 h-5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[11px] font-bold flex items-center justify-center mb-2 font-mono">
                    3
                  </div>
                  <h2 className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Configure & Validate
                  </h2>
                  <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Select placed nodes to edit actual parameters and check validation health.
                  </p>
                </div>
              </div>

              {/* Status note */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-medium ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Canvas Ready</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">Drop cards or click + in palette to begin</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Canvas HUD Overlays */}
      {/* Bottom-Left: Site & Counts */}
      <div className={`absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-md border text-[11px] backdrop-blur shadow-md pointer-events-none ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-700'
      }`}>
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="font-semibold">{currentSiteMeta.name}</span>
        <span className="text-slate-400">|</span>
        <span className="font-mono text-[10px]">
          {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'} • {edges.length}{' '}
          {edges.length === 1 ? 'edge' : 'edges'}
        </span>
        {isPreviewMode && (
          <>
            <span className="text-slate-400">|</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold uppercase text-[9px] border border-purple-500/30">
              Read-Only Preview
            </span>
          </>
        )}
      </div>

      {/* Bottom-Right: Shortcuts & Multi-Select info */}
      <div className={`absolute bottom-4 right-16 z-10 flex items-center gap-2 px-3 py-1.5 rounded-md border text-[11px] backdrop-blur shadow-md pointer-events-none ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-white/90 border-slate-200 text-slate-600'
      }`}>
        <Compass className="w-3.5 h-3.5 text-purple-500" />
        {isPreviewMode ? (
          <>
            <span className="font-medium text-purple-400">Read-Only</span>
            <span className="text-slate-400">|</span>
            <span className="text-[10px]">Click nodes to inspect details • Zoom & Pan active</span>
          </>
        ) : (
          <>
            <span className="font-medium">Del to Remove</span>
            <span className="text-slate-400">|</span>
            <span className="text-[10px] font-mono">Shift/Ctrl for Multi-Select</span>
          </>
        )}
      </div>
    </div>
  )
}
