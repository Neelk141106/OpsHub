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
  notification: null,

  // Toggle Light / Dark theme
  toggleTheme: () => {
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }))
  },

  // Toggle or set Preview Mode (Part 4)
  setPreviewMode: (isPreview) => {
    set({ isPreviewMode: Boolean(isPreview) })
  },
  togglePreviewMode: () => {
    set((state) => ({ isPreviewMode: !state.isPreviewMode }))
  },

  // Switch active site (preserves separate drafts per site)
  setActiveSite: (siteId) => {
    if (!INITIAL_SITE_DRAFTS[siteId]) return
    set({
      activeSite: siteId,
      selectedModule: null,
      selectedNodeId: null,
      notification: null,
    })
  },

  // Update current site's workflow name (read-only guarded in preview)
  setWorkflowName: (name) => {
    if (get().isPreviewMode) return
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
    const { activeSite, siteDrafts, isPreviewMode } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    // Preview Mode strictly prevents node movement and node deletion
    if (isPreviewMode) {
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
    const { activeSite, siteDrafts, isPreviewMode } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    // Preview Mode strictly prevents edge deletion
    if (isPreviewMode) {
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
    if (get().isPreviewMode) return
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
    if (get().isPreviewMode) return
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
    if (get().isPreviewMode) return
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
    if (get().isPreviewMode) return
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
    if (get().isPreviewMode) return
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
    if (get().isPreviewMode) return
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
    if (get().isPreviewMode) return
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

  // Simulation Mode toggle
  toggleSimulationMode: () => {
    set((state) => ({ isSimulationMode: !state.isSimulationMode }))
  },

  // Undo / Redo controls
  undo: () => {
    if (get().isPreviewMode) return
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
    if (get().isPreviewMode) return
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
