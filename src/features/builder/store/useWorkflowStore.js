import { create } from 'zustand'
import { applyNodeChanges, applyEdgeChanges, addEdge, MarkerType } from '@xyflow/react'
import { validateWorkflow } from '../validation/validateWorkflow.js'

const INITIAL_SITE_DRAFTS = {
  'central-stores': {
    workflowName: 'Central Stores Requisition & Intake Flow',
    nodes: [],
    edges: [],
    history: { past: [], future: [] },
    zoom: 100,
    lastSaved: 'Not saved yet',
  },
  'service-centre': {
    workflowName: 'Service Centre Diagnostics & Refurbishment Flow',
    nodes: [],
    edges: [],
    history: { past: [], future: [] },
    zoom: 100,
    lastSaved: 'Not saved yet',
  },
  'distribution': {
    workflowName: 'Distribution Outbound Logistics & Freight Flow',
    nodes: [],
    edges: [],
    history: { past: [], future: [] },
    zoom: 100,
    lastSaved: 'Not saved yet',
  },
}

export const INITIAL_SIMULATION_STATE = {
  status: 'idle', // 'idle' | 'running' | 'branching' | 'completed' | 'empty' | 'invalid' | 'blocked'
  currentNodeId: null,
  visitedNodeIds: [],
  traversedEdgeIds: [],
  currentStep: 0,
  totalSteps: 0,
  pendingBranches: null, // Array of { edgeId, targetNodeId, targetNodeName, targetNodeCategory, sourceHandle, branchLabel }
  message: null,
  blockedReason: null,
  executionLog: [], // Array of { step, nodeId, nodeName, category, config, timestamp, branchTaken, status }
}

function computeReachableNodesCount(startId, edges, nodes) {
  if (!startId) return 0
  const visited = new Set()
  const queue = [startId]
  while (queue.length > 0) {
    const curr = queue.shift()
    if (!visited.has(curr)) {
      visited.add(curr)
      const outgoingEdges = edges.filter((e) => e.source === curr)
      for (const e of outgoingEdges) {
        if (nodes.some((n) => n.id === e.target) && !visited.has(e.target)) {
          queue.push(e.target)
        }
      }
    }
  }
  return visited.size
}

function findWorkflowEntryNode(nodes, edges) {
  if (!nodes || nodes.length === 0) return null

  // 1. Look for explicit trigger/entry node (inputs === 0)
  const triggerNode = nodes.find((n) => (n.data?.inputs ?? 1) === 0)
  if (triggerNode) return triggerNode

  // 2. Look for node with 0 incoming connections
  const inDegreeZeroNode = nodes.find(
    (n) => !edges.some((e) => e.target === n.id)
  )
  if (inDegreeZeroNode) return inDegreeZeroNode

  // 3. Fallback to first node placed
  return nodes[0]
}

export const useWorkflowStore = create((set, get) => ({
  // Theme state: 'dark' (default) or 'light'
  theme: 'dark',

  // Active selected operational site
  activeSite: 'central-stores',

  // Isolated drafts keyed by siteId to prevent accidental draft sharing
  siteDrafts: INITIAL_SITE_DRAFTS,

  // Selected module from palette or placed node from canvas
  selectedModule: null,
  selectedNodeId: null,

  // UI modes & status
  isPreviewMode: false,
  isSimulationMode: false,
  simulation: INITIAL_SIMULATION_STATE,
  notification: null,

  // Toggle Light / Dark theme
  toggleTheme: () => {
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }))
  },

  // Toggle or set Preview Mode (Part 4)
  setPreviewMode: (isPreview) => {
    if (isPreview && get().isSimulationMode) {
      get().exitSimulation()
    }
    set({ isPreviewMode: Boolean(isPreview) })
  },
  togglePreviewMode: () => {
    if (!get().isPreviewMode && get().isSimulationMode) {
      get().exitSimulation()
    }
    set((state) => ({ isPreviewMode: !state.isPreviewMode }))
  },

  // Switch active site (preserves separate drafts per site)
  setActiveSite: (siteId) => {
    if (!INITIAL_SITE_DRAFTS[siteId]) return
    if (get().isSimulationMode) {
      get().exitSimulation()
    }
    set({
      activeSite: siteId,
      selectedModule: null,
      selectedNodeId: null,
      notification: null,
    })
  },

  // Update current site's workflow name (read-only guarded in preview and simulation)
  setWorkflowName: (name) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { activeSite, siteDrafts } = get()
    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...siteDrafts[activeSite],
          workflowName: name,
        },
      },
    })
  },

  // Record history snapshot helper
  recordHistory: () => {
    const { activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const newPast = [
      ...currentDraft.history.past.slice(-20), // Keep up to 20 past snapshots
      {
        nodes: JSON.parse(JSON.stringify(currentDraft.nodes)),
        edges: JSON.parse(JSON.stringify(currentDraft.edges)),
      },
    ]

    return {
      past: newPast,
      future: [],
    }
  },

  // --- Node & Edge Graph Actions ---

  // Handle changes dispatched by @xyflow/react (position, selection, removal)
  onNodesChange: (changes) => {
    const { activeSite, siteDrafts, isPreviewMode, isSimulationMode } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    // Preview Mode and Simulation Mode strictly prevent node movement and node deletion
    if (isPreviewMode || isSimulationMode) {
      const allowedChanges = changes.filter(
        (c) => c.type === 'select' || c.type === 'dimensions'
      )
      if (allowedChanges.length === 0) return

      const updatedNodes = applyNodeChanges(allowedChanges, currentDraft.nodes)
      const selectionChange = allowedChanges.find((c) => c.type === 'select')
      let newSelectedId = get().selectedNodeId

      if (selectionChange) {
        if (selectionChange.selected) {
          newSelectedId = selectionChange.id
        } else if (newSelectedId === selectionChange.id) {
          newSelectedId = null
        }
      }

      set({
        selectedNodeId: newSelectedId,
        siteDrafts: {
          ...siteDrafts,
          [activeSite]: {
            ...currentDraft,
            nodes: updatedNodes,
          },
        },
      })
      return
    }

    const updatedNodes = applyNodeChanges(changes, currentDraft.nodes)

    // Check if selection changed
    const selectionChange = changes.find((c) => c.type === 'select')
    let newSelectedId = get().selectedNodeId

    if (selectionChange) {
      if (selectionChange.selected) {
        newSelectedId = selectionChange.id
      } else if (newSelectedId === selectionChange.id) {
        newSelectedId = null
      }
    }

    set({
      selectedNodeId: newSelectedId,
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: updatedNodes,
        },
      },
    })
  },

  // Handle edge changes dispatched by @xyflow/react
  onEdgesChange: (changes) => {
    const { activeSite, siteDrafts, isPreviewMode, isSimulationMode } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    // Preview Mode and Simulation Mode strictly prevent edge deletion
    if (isPreviewMode || isSimulationMode) {
      const allowedChanges = changes.filter((c) => c.type === 'select')
      if (allowedChanges.length === 0) return
      const updatedEdges = applyEdgeChanges(allowedChanges, currentDraft.edges)
      set({
        siteDrafts: {
          ...siteDrafts,
          [activeSite]: {
            ...currentDraft,
            edges: updatedEdges,
          },
        },
      })
      return
    }

    const updatedEdges = applyEdgeChanges(changes, currentDraft.edges)

    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          edges: updatedEdges,
        },
      },
    })
  },

  // Handle new edge connection
  onConnect: (connection) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { activeSite, siteDrafts, recordHistory } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    // Prevent connecting node to itself
    if (connection.source === connection.target) {
      set({
        notification: {
          type: 'warning',
          message: 'Cannot connect a node to itself.',
        },
      })
      return
    }

    // Check if identical connection already exists
    const duplicate = currentDraft.edges.some(
      (e) =>
        e.source === connection.source &&
        e.target === connection.target &&
        e.sourceHandle === connection.sourceHandle &&
        e.targetHandle === connection.targetHandle
    )

    if (duplicate) {
      set({
        notification: {
          type: 'warning',
          message: 'Connection already exists between these handle ports.',
        },
      })
      return
    }

    const history = recordHistory()

    const edgeWithStyling = {
      ...connection,
      id: `edge_${connection.source}_${connection.target}_${Date.now()}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#a855f7', strokeWidth: 2.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#a855f7',
        width: 18,
        height: 18,
      },
    }

    const updatedEdges = addEdge(edgeWithStyling, currentDraft.edges)

    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          edges: updatedEdges,
          history,
        },
      },
      notification: {
        type: 'info',
        message: 'Connected step successfully.',
      },
    })
  },

  // Add a new node to the active canvas
  addNode: (node) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { activeSite, siteDrafts, recordHistory } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    // Prevent duplicate IDs
    if (currentDraft.nodes.some((n) => n.id === node.id)) {
      return
    }

    // Initialize initial default settings configuration
    const initialConfig = {}
    if (node.data?.supportedSettings) {
      node.data.supportedSettings.forEach((setting) => {
        initialConfig[setting.key] = setting.defaultValue ?? ''
      })
    }

    const nodeWithDefaults = {
      ...node,
      data: {
        ...node.data,
        config: initialConfig,
      },
    }

    const history = recordHistory()
    const updatedNodes = [...currentDraft.nodes, nodeWithDefaults]

    set({
      selectedNodeId: nodeWithDefaults.id,
      selectedModule: null,
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: updatedNodes,
          history,
        },
      },
    })
  },

  // Delete a specific node and its associated edges
  deleteNode: (nodeId) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { activeSite, siteDrafts, recordHistory } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const history = recordHistory()
    const updatedNodes = currentDraft.nodes.filter((n) => n.id !== nodeId)
    const updatedEdges = currentDraft.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    )

    set({
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: updatedNodes,
          edges: updatedEdges,
          history,
        },
      },
    })
  },

  // Delete a specific edge
  deleteEdge: (edgeId) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { activeSite, siteDrafts, recordHistory } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const history = recordHistory()
    const updatedEdges = currentDraft.edges.filter((e) => e.id !== edgeId)

    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          edges: updatedEdges,
          history,
        },
      },
    })
  },

  // Update a placed node's label
  updateNodeLabel: (nodeId, newLabel) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const updatedNodes = currentDraft.nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            label: newLabel,
          },
        }
      }
      return node
    })

    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: updatedNodes,
        },
      },
    })
  },

  // Update a placed node's configuration parameter
  updateNodeConfig: (nodeId, settingKey, value) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { activeSite, siteDrafts, recordHistory } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const history = recordHistory()
    const updatedNodes = currentDraft.nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            config: {
              ...(node.data.config || {}),
              [settingKey]: value,
            },
          },
        }
      }
      return node
    })

    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: updatedNodes,
          history,
        },
      },
    })
  },

  // Clear all nodes and edges for the active site
  clearGraph: () => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { activeSite, siteDrafts, recordHistory } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const history = recordHistory()

    set({
      selectedNodeId: null,
      selectedModule: null,
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: [],
          edges: [],
          history,
        },
      },
      notification: {
        type: 'info',
        message: `Cleared all nodes and edges from ${currentDraft.workflowName}.`,
      },
    })
  },

  // Select module from palette
  setSelectedModule: (mod) => {
    set({ selectedModule: mod, selectedNodeId: null })
  },

  // Select a placed node
  setSelectedNodeId: (nodeId) => {
    set({ selectedNodeId: nodeId, selectedModule: null })
  },

  // Zoom controls (applies to active site draft)
  zoomIn: () => {
    const { activeSite, siteDrafts } = get()
    const currentZoom = siteDrafts[activeSite]?.zoom || 100
    const newZoom = Math.min(currentZoom + 15, 200)
    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...siteDrafts[activeSite],
          zoom: newZoom,
        },
      },
    })
  },

  zoomOut: () => {
    const { activeSite, siteDrafts } = get()
    const currentZoom = siteDrafts[activeSite]?.zoom || 100
    const newZoom = Math.max(currentZoom - 15, 40)
    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...siteDrafts[activeSite],
          zoom: newZoom,
        },
      },
    })
  },

  resetZoom: () => {
    const { activeSite, siteDrafts } = get()
    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...siteDrafts[activeSite],
          zoom: 100,
        },
      },
    })
  },

  setZoom: (zoom) => {
    const { activeSite, siteDrafts } = get()
    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...siteDrafts[activeSite],
          zoom: Math.round(zoom),
        },
      },
    })
  },

  // --- Simulation Actions (Part 5: Time Machine Simulation) ---

  startSimulation: () => {
    // Exit preview mode if active
    if (get().isPreviewMode) {
      set({ isPreviewMode: false })
    }

    const { activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [] }
    const { nodes, edges } = currentDraft

    // Case 1: Empty Workflow
    if (nodes.length === 0) {
      set({
        isSimulationMode: true,
        selectedNodeId: null,
        simulation: {
          ...INITIAL_SIMULATION_STATE,
          status: 'empty',
          message: 'Cannot simulate an empty workflow. Add modules to the canvas to begin.',
          totalSteps: 0,
        },
      })
      return
    }

    // Case 2: Validation Check (reusing existing validateWorkflow logic)
    const validation = validateWorkflow(nodes, edges)
    if (validation.hasErrors) {
      const errorMessages = validation.issues
        .filter((i) => i.type === 'error')
        .map((i) => i.message)
      set({
        isSimulationMode: true,
        selectedNodeId: null,
        simulation: {
          ...INITIAL_SIMULATION_STATE,
          status: 'invalid',
          message: `Simulation blocked: ${validation.errorsCount} validation ${
            validation.errorsCount === 1 ? 'error' : 'errors'
          } must be resolved first.`,
          blockedReason: errorMessages.join(' • '),
          totalSteps: nodes.length,
        },
      })
      return
    }

    // Case 3: Identify Entry Node
    const startNode = findWorkflowEntryNode(nodes, edges)
    if (!startNode) {
      set({
        isSimulationMode: true,
        selectedNodeId: null,
        simulation: {
          ...INITIAL_SIMULATION_STATE,
          status: 'blocked',
          message: 'No valid starting entry node could be identified in the workflow.',
          totalSteps: nodes.length,
        },
      })
      return
    }

    const reachableCount = computeReachableNodesCount(startNode.id, edges, nodes)
    const outEdges = edges.filter((e) => e.source === startNode.id)
    const startNodeLabel = startNode.data?.label || startNode.data?.name || 'Start Node'

    const initialLog = [
      {
        step: 1,
        nodeId: startNode.id,
        nodeName: startNodeLabel,
        category: startNode.data?.category || 'Trigger',
        config: startNode.data?.config || {},
        timestamp: new Date().toLocaleTimeString(),
        branchTaken: null,
        status: outEdges.length === 0 ? 'completed' : 'active',
      },
    ]

    // Terminal start node (isolated 1-node flow)
    if (outEdges.length === 0) {
      set({
        isSimulationMode: true,
        selectedNodeId: startNode.id,
        simulation: {
          ...INITIAL_SIMULATION_STATE,
          status: 'completed',
          currentNodeId: startNode.id,
          visitedNodeIds: [startNode.id],
          traversedEdgeIds: [],
          currentStep: 1,
          totalSteps: Math.max(reachableCount, 1),
          message: `Simulation completed: Reached terminal step "${startNodeLabel}".`,
          executionLog: initialLog,
        },
      })
      return
    }

    // Single outgoing connection
    if (outEdges.length === 1) {
      set({
        isSimulationMode: true,
        selectedNodeId: startNode.id,
        simulation: {
          ...INITIAL_SIMULATION_STATE,
          status: 'running',
          currentNodeId: startNode.id,
          visitedNodeIds: [startNode.id],
          traversedEdgeIds: [],
          currentStep: 1,
          totalSteps: Math.max(reachableCount, 1),
          message: `Simulation active at Step 1: "${startNodeLabel}". Click 'Step Forward' to proceed.`,
          pendingBranches: null,
          executionLog: initialLog,
        },
      })
      return
    }

    // Multiple outgoing connections -> Ask user to choose valid connection
    const pendingBranches = outEdges.map((e, idx) => {
      const targetNode = nodes.find((n) => n.id === e.target)
      let branchLabel =
        e.label ||
        (e.sourceHandle === 'out-true'
          ? 'True / Success Branch'
          : e.sourceHandle === 'out-false'
          ? 'False / Fallback Branch'
          : `Connection ${idx + 1}`)
      return {
        edgeId: e.id,
        targetNodeId: e.target,
        targetNodeName: targetNode?.data?.label || targetNode?.data?.name || e.target,
        targetNodeCategory: targetNode?.data?.category || 'Module',
        sourceHandle: e.sourceHandle,
        branchLabel,
      }
    })

    set({
      isSimulationMode: true,
      selectedNodeId: startNode.id,
      simulation: {
        ...INITIAL_SIMULATION_STATE,
        status: 'branching',
        currentNodeId: startNode.id,
        visitedNodeIds: [startNode.id],
        traversedEdgeIds: [],
        currentStep: 1,
        totalSteps: Math.max(reachableCount, 1),
        message: `Multiple outgoing connections from "${startNodeLabel}". Please choose which connection to follow.`,
        pendingBranches,
        executionLog: initialLog,
      },
    })
  },

  stepForward: () => {
    const { activeSite, siteDrafts, simulation, isSimulationMode } = get()
    if (!isSimulationMode) return
    if (simulation.status !== 'running') return

    const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [] }
    const { nodes, edges } = currentDraft
    const { currentNodeId, visitedNodeIds, traversedEdgeIds, currentStep, totalSteps, executionLog } = simulation

    const outEdges = edges.filter((e) => e.source === currentNodeId)

    // Case: No outgoing edges (terminal node reached)
    if (outEdges.length === 0) {
      const currentNode = nodes.find((n) => n.id === currentNodeId)
      const nodeLabel = currentNode?.data?.label || currentNode?.data?.name || 'Final Node'
      set({
        simulation: {
          ...simulation,
          status: 'completed',
          message: `Simulation completed: Reached terminal step "${nodeLabel}".`,
        },
      })
      return
    }

    // Case: Multiple outgoing edges (user branching choice required)
    if (outEdges.length > 1) {
      const currentNode = nodes.find((n) => n.id === currentNodeId)
      const nodeLabel = currentNode?.data?.label || currentNode?.data?.name || 'Node'
      const pendingBranches = outEdges.map((e, idx) => {
        const targetNode = nodes.find((n) => n.id === e.target)
        let branchLabel =
          e.label ||
          (e.sourceHandle === 'out-true'
            ? 'True / Success Branch'
            : e.sourceHandle === 'out-false'
            ? 'False / Fallback Branch'
            : `Connection ${idx + 1}`)
        return {
          edgeId: e.id,
          targetNodeId: e.target,
          targetNodeName: targetNode?.data?.label || targetNode?.data?.name || e.target,
          targetNodeCategory: targetNode?.data?.category || 'Module',
          sourceHandle: e.sourceHandle,
          branchLabel,
        }
      })

      set({
        simulation: {
          ...simulation,
          status: 'branching',
          message: `Multiple outgoing connections from "${nodeLabel}". Please choose which connection to follow.`,
          pendingBranches,
        },
      })
      return
    }

    // Case: Exactly 1 outgoing connection
    const edge = outEdges[0]
    const nextNode = nodes.find((n) => n.id === edge.target)

    if (!nextNode) {
      set({
        simulation: {
          ...simulation,
          status: 'blocked',
          blockedReason: `Connection references target node "${edge.target}" which does not exist on the canvas.`,
          message: 'Simulation blocked: Broken connection detected.',
        },
      })
      return
    }

    const nextStep = currentStep + 1
    const newVisited = [...visitedNodeIds, nextNode.id]
    const newTraversed = [...traversedEdgeIds, edge.id]
    const nextNodeLabel = nextNode.data?.label || nextNode.data?.name || 'Next Node'

    const nextOutEdges = edges.filter((e) => e.source === nextNode.id)
    const isTerminal = nextOutEdges.length === 0

    const newLogEntry = {
      step: nextStep,
      nodeId: nextNode.id,
      nodeName: nextNodeLabel,
      category: nextNode.data?.category || 'Action',
      config: nextNode.data?.config || {},
      timestamp: new Date().toLocaleTimeString(),
      branchTaken:
        edge.label ||
        (edge.sourceHandle === 'out-true'
          ? 'True / Success'
          : edge.sourceHandle === 'out-false'
          ? 'False / Fallback'
          : null),
      status: isTerminal ? 'completed' : 'active',
    }

    if (isTerminal) {
      set({
        selectedNodeId: nextNode.id,
        simulation: {
          ...simulation,
          status: 'completed',
          currentNodeId: nextNode.id,
          visitedNodeIds: newVisited,
          traversedEdgeIds: newTraversed,
          currentStep: nextStep,
          totalSteps: Math.max(totalSteps, nextStep),
          message: `Simulation completed: Reached final step "${nextNodeLabel}".`,
          pendingBranches: null,
          executionLog: [...executionLog, newLogEntry],
        },
      })
      return
    }

    if (nextOutEdges.length === 1) {
      set({
        selectedNodeId: nextNode.id,
        simulation: {
          ...simulation,
          status: 'running',
          currentNodeId: nextNode.id,
          visitedNodeIds: newVisited,
          traversedEdgeIds: newTraversed,
          currentStep: nextStep,
          totalSteps: Math.max(totalSteps, nextStep),
          message: `Step ${nextStep}: Executing "${nextNodeLabel}". Click 'Step Forward' to proceed.`,
          pendingBranches: null,
          executionLog: [...executionLog, newLogEntry],
        },
      })
      return
    }

    // Target node has multiple outgoing edges -> branching prompt
    const nextPendingBranches = nextOutEdges.map((e, idx) => {
      const targetNode = nodes.find((n) => n.id === e.target)
      let branchLabel =
        e.label ||
        (e.sourceHandle === 'out-true'
          ? 'True / Success Branch'
          : e.sourceHandle === 'out-false'
          ? 'False / Fallback Branch'
          : `Connection ${idx + 1}`)
      return {
        edgeId: e.id,
        targetNodeId: e.target,
        targetNodeName: targetNode?.data?.label || targetNode?.data?.name || e.target,
        targetNodeCategory: targetNode?.data?.category || 'Module',
        sourceHandle: e.sourceHandle,
        branchLabel,
      }
    })

    set({
      selectedNodeId: nextNode.id,
      simulation: {
        ...simulation,
        status: 'branching',
        currentNodeId: nextNode.id,
        visitedNodeIds: newVisited,
        traversedEdgeIds: newTraversed,
        currentStep: nextStep,
        totalSteps: Math.max(totalSteps, nextStep),
        message: `Multiple outgoing connections from "${nextNodeLabel}". Please choose which connection to follow.`,
        pendingBranches: nextPendingBranches,
        executionLog: [...executionLog, newLogEntry],
      },
    })
  },

  chooseBranch: (edgeId, targetNodeId) => {
    const { activeSite, siteDrafts, simulation, isSimulationMode } = get()
    if (!isSimulationMode || simulation.status !== 'branching') return

    const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [] }
    const { nodes, edges } = currentDraft
    const { visitedNodeIds, traversedEdgeIds, currentStep, totalSteps, executionLog, pendingBranches } = simulation

    const chosenBranch = pendingBranches?.find((b) => b.edgeId === edgeId)
    const nextNode = nodes.find((n) => n.id === targetNodeId)

    if (!nextNode) {
      set({
        simulation: {
          ...simulation,
          status: 'blocked',
          blockedReason: `Target node "${targetNodeId}" does not exist on the canvas.`,
          message: 'Simulation blocked: Broken branch connection.',
        },
      })
      return
    }

    const nextStep = currentStep + 1
    const newVisited = [...visitedNodeIds, nextNode.id]
    const newTraversed = [...traversedEdgeIds, edgeId]
    const nextNodeLabel = nextNode.data?.label || nextNode.data?.name || 'Next Node'

    const nextOutEdges = edges.filter((e) => e.source === nextNode.id)
    const isTerminal = nextOutEdges.length === 0

    const newLogEntry = {
      step: nextStep,
      nodeId: nextNode.id,
      nodeName: nextNodeLabel,
      category: nextNode.data?.category || 'Action',
      config: nextNode.data?.config || {},
      timestamp: new Date().toLocaleTimeString(),
      branchTaken: chosenBranch?.branchLabel || 'Branch Selected',
      status: isTerminal ? 'completed' : 'active',
    }

    if (isTerminal) {
      set({
        selectedNodeId: nextNode.id,
        simulation: {
          ...simulation,
          status: 'completed',
          currentNodeId: nextNode.id,
          visitedNodeIds: newVisited,
          traversedEdgeIds: newTraversed,
          currentStep: nextStep,
          totalSteps: Math.max(totalSteps, nextStep),
          message: `Simulation completed: Reached final step "${nextNodeLabel}".`,
          pendingBranches: null,
          executionLog: [...executionLog, newLogEntry],
        },
      })
      return
    }

    if (nextOutEdges.length === 1) {
      set({
        selectedNodeId: nextNode.id,
        simulation: {
          ...simulation,
          status: 'running',
          currentNodeId: nextNode.id,
          visitedNodeIds: newVisited,
          traversedEdgeIds: newTraversed,
          currentStep: nextStep,
          totalSteps: Math.max(totalSteps, nextStep),
          message: `Step ${nextStep}: Executing "${nextNodeLabel}". Click 'Step Forward' to proceed.`,
          pendingBranches: null,
          executionLog: [...executionLog, newLogEntry],
        },
      })
      return
    }

    // Multiple outgoing edges again
    const nextPendingBranches = nextOutEdges.map((e, idx) => {
      const targetNode = nodes.find((n) => n.id === e.target)
      let branchLabel =
        e.label ||
        (e.sourceHandle === 'out-true'
          ? 'True / Success Branch'
          : e.sourceHandle === 'out-false'
          ? 'False / Fallback Branch'
          : `Connection ${idx + 1}`)
      return {
        edgeId: e.id,
        targetNodeId: e.target,
        targetNodeName: targetNode?.data?.label || targetNode?.data?.name || e.target,
        targetNodeCategory: targetNode?.data?.category || 'Module',
        sourceHandle: e.sourceHandle,
        branchLabel,
      }
    })

    set({
      selectedNodeId: nextNode.id,
      simulation: {
        ...simulation,
        status: 'branching',
        currentNodeId: nextNode.id,
        visitedNodeIds: newVisited,
        traversedEdgeIds: newTraversed,
        currentStep: nextStep,
        totalSteps: Math.max(totalSteps, nextStep),
        message: `Multiple outgoing connections from "${nextNodeLabel}". Please choose which connection to follow.`,
        pendingBranches: nextPendingBranches,
        executionLog: [...executionLog, newLogEntry],
      },
    })
  },

  restartSimulation: () => {
    get().startSimulation()
  },

  exitSimulation: () => {
    set({
      isSimulationMode: false,
      simulation: INITIAL_SIMULATION_STATE,
    })
  },

  toggleSimulationMode: () => {
    if (get().isSimulationMode) {
      get().exitSimulation()
    } else {
      get().startSimulation()
    }
  },

  // Undo / Redo controls (guarded in preview and simulation)
  undo: () => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft || currentDraft.history.past.length === 0) return

    const previousState = currentDraft.history.past[currentDraft.history.past.length - 1]
    const newPast = currentDraft.history.past.slice(0, -1)

    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: previousState.nodes,
          edges: previousState.edges,
          history: {
            past: newPast,
            future: [
              { nodes: currentDraft.nodes, edges: currentDraft.edges },
              ...currentDraft.history.future,
            ],
          },
        },
      },
    })
  },

  redo: () => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft || currentDraft.history.future.length === 0) return

    const nextState = currentDraft.history.future[0]
    const newFuture = currentDraft.history.future.slice(1)

    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: nextState.nodes,
          edges: nextState.edges,
          history: {
            past: [
              ...currentDraft.history.past,
              { nodes: currentDraft.nodes, edges: currentDraft.edges },
            ],
            future: newFuture,
          },
        },
      },
    })
  },

  // Get validation report for active draft
  getActiveValidationReport: () => {
    const { activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [] }
    return validateWorkflow(currentDraft.nodes, currentDraft.edges)
  },

  // Save draft locally (honest messaging)
  triggerSaveDraft: () => {
    const { activeSite, siteDrafts } = get()
    const timestamp = new Date().toLocaleTimeString()
    set({
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...siteDrafts[activeSite],
          lastSaved: `Saved locally at ${timestamp}`,
        },
      },
      notification: {
        type: 'info',
        message: `Draft stored in local memory (${siteDrafts[activeSite].nodes.length} nodes, ${siteDrafts[activeSite].edges.length} edges). Backend API persistence is scheduled for Part 6.`,
      },
    })
  },

  // Publish workflow (honest messaging)
  triggerPublish: () => {
    const { activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite]
    const validation = validateWorkflow(currentDraft.nodes, currentDraft.edges)

    if (currentDraft.nodes.length === 0) {
      set({
        notification: {
          type: 'warning',
          message: 'Cannot publish an empty workflow. Add modules from the palette first.',
        },
      })
      return
    }

    if (validation.hasErrors) {
      set({
        notification: {
          type: 'warning',
          message: `Cannot publish: ${validation.errorsCount} validation ${
            validation.errorsCount === 1 ? 'error' : 'errors'
          } found. Review the Inspector validation summary.`,
        },
      })
      return
    }

    set({
      notification: {
        type: 'warning',
        message:
          'Publishing is locked: Requires Production Site Integration & Version Tagging (Part 6). Validated draft remains in memory.',
      },
    })
  },

  // Dismiss notification banner
  clearNotification: () => {
    set({ notification: null })
  },
}))
