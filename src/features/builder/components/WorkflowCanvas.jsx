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

  // Drag and drop handlers (disabled in preview mode)
  const onDragOver = useCallback(
    (event) => {
      if (isPreviewMode) return
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    [isPreviewMode]
  )

  const onDrop = useCallback(
    (event) => {
      if (isPreviewMode) return
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
    [screenToFlowPosition, addNode, isPreviewMode]
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

      {/* Simulation Banner */}
      {!isPreviewMode && isSimulationMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-500 dark:text-amber-300 shadow-lg shadow-black/30 backdrop-blur-md pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide">
            OpsHub Time Machine Simulation Active
          </span>
          <span className="text-[10px] text-amber-500 dark:text-amber-400 font-mono">
            (Event execution & timeline scrubbing: Part 5)
          </span>
        </div>
      )}

      {/* Interactive @xyflow/react Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView={nodes.length > 0}
        minZoom={0.25}
        maxZoom={2.0}
        nodesDraggable={!isPreviewMode}
        nodesConnectable={!isPreviewMode}
        elementsSelectable={true}
        deleteKeyCode={isPreviewMode ? null : ['Backspace', 'Delete']}
        multiSelectionKeyCode={isPreviewMode ? null : ['Meta', 'Control', 'Shift']}
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
