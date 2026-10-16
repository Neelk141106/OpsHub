import { create } from 'zustand'
import { applyNodeChanges, applyEdgeChanges, addEdge, MarkerType } from '@xyflow/react'
import { validateWorkflow } from '../validation/validateWorkflow.js'
import { WorkflowService } from '../services/workflowService.js'
import { DEMO_USERS, Permissions } from '../services/authService.js'
import { WORKFLOW_TEMPLATES } from '../templates/workflowTemplates.js'
import { SITES } from '../registry/siteModules.js'

// Initialize drafts: restore saved drafts from storage if available, else start empty
function buildInitialDrafts() {
  const drafts = {}
  const siteIds = ['central-stores', 'service-centre', 'distribution']

  siteIds.forEach((siteId) => {
    const site = SITES.find((s) => s.id === siteId)
    let saved = null
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(`opshub_workflow_draft_${siteId}`)
        if (raw) {
          saved = JSON.parse(raw)
        }
      }
    } catch {
      // fallback to clean empty draft
    }

    if (saved && saved.nodes && Array.isArray(saved.nodes) && saved.nodes.length > 0) {
      drafts[siteId] = {
        workflowName: saved.workflowName || `${site?.name || siteId} Workflow`,
        nodes: saved.nodes,
        edges: saved.edges || [],
        history: { past: [], future: [] },
        zoom: 100,
        lastSaved: saved.savedAt ? `Saved at ${new Date(saved.savedAt).toLocaleTimeString()}` : 'Saved',
        isDraftLoaded: false,
        hasExistingSavedDraft: true,
      }
    } else {
      drafts[siteId] = {
        workflowName: `${site?.name || siteId} Workflow`,
        nodes: [],
        edges: [],
        history: { past: [], future: [] },
        zoom: 100,
        lastSaved: 'Not saved yet',
        isDraftLoaded: false,
        hasExistingSavedDraft: false,
      }
    }
  })

  return drafts
}

const INITIAL_SITE_DRAFTS = buildInitialDrafts()

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
  executionLog: [], // Array of { step, nodeId, nodeName, category, config, timestamp, branchTaken, status, isSimulated }
  isSimulationDisclaimer: 'Virtual Time Machine Simulation. No live warehouse inventory, service tickets, or freight manifests were altered.',
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
  // Theme state: 'light' (primary default) or 'dark' (optional)
  theme: 'light',

  // Active top-level application view: 'builder' | 'central-stores' | 'service-centre' | 'distribution'
  activeView: 'builder',

  // Current authenticated user (RBAC)
  currentUser: DEMO_USERS[0], // Default: Alex Morgan (Admin)

  // Active selected operational site for Workflow Builder
  activeSite: 'central-stores',

  // Isolated editable drafts keyed by siteId
  siteDrafts: INITIAL_SITE_DRAFTS,

  // Published workflows per site (consumed by site operational dashboards)
  publishedWorkflows: {
    'central-stores': null,
    'service-centre': null,
    distribution: null,
  },

  // Version history records per site
  versionHistory: {
    'central-stores': [],
    'service-centre': [],
    distribution: [],
  },

  // State flags for persistence, publishing, and rollback
  hasUnsavedChanges: false,
  isSavingDraft: false,
  isPublishing: false,
  isRollingBack: false,

  // Selected module from palette or placed node from canvas
  selectedModule: null,
  selectedNodeId: null,

  // UI modal dialogs
  templateModalOpen: false,
  publishModalOpen: false,
  versionHistoryModalOpen: false,

  // UI modes & simulation
  isPreviewMode: false,
  isSimulationMode: false,
  simulation: INITIAL_SIMULATION_STATE,
  notification: null,
  contextualHint: null,
  isGuideOpen: true,
  setIsGuideOpen: (open) => set({ isGuideOpen: open }),
  toggleGuide: () => set((s) => ({ isGuideOpen: !s.isGuideOpen })),
  setContextualHint: (hint) => set({ contextualHint: hint }),
  clearContextualHint: () => set({ contextualHint: null }),

  // Initialize service baselines on startup
  initializePublishedState: async () => {
    WorkflowService.initializeFacilityBaselines()
    const sites = ['central-stores', 'service-centre', 'distribution']
    const publishedMap = {}
    const historyMap = {}
    const draftsUpdate = { ...get().siteDrafts }

    for (const siteId of sites) {
      const pub = await WorkflowService.getPublishedWorkflow(siteId)
      const hist = await WorkflowService.getVersionHistory(siteId)
      const savedDraft = await WorkflowService.loadDraft(siteId)
      publishedMap[siteId] = pub
      historyMap[siteId] = hist

      if (savedDraft && savedDraft.nodes && Array.isArray(savedDraft.nodes) && savedDraft.nodes.length > 0) {
        const current = draftsUpdate[siteId]
        if (!current || !current.nodes || current.nodes.length === 0) {
          draftsUpdate[siteId] = {
            workflowName: savedDraft.workflowName || `${siteId} Workflow`,
            nodes: savedDraft.nodes,
            edges: savedDraft.edges || [],
            history: { past: [], future: [] },
            zoom: 100,
            lastSaved: savedDraft.savedAt ? `Saved at ${new Date(savedDraft.savedAt).toLocaleTimeString()}` : 'Saved',
            isDraftLoaded: current?.isDraftLoaded ?? false,
            hasExistingSavedDraft: true,
          }
        } else {
          draftsUpdate[siteId] = {
            ...current,
            hasExistingSavedDraft: true,
          }
        }
      }
    }

    set({
      publishedWorkflows: publishedMap,
      versionHistory: historyMap,
      siteDrafts: draftsUpdate,
    })
  },

  // Switch top-level view
  setActiveView: (view) => {
    if (get().isSimulationMode) {
      get().exitSimulation()
    }
    set({ activeView: view })
  },

  // Switch demo user for RBAC testing
  switchUser: (userId) => {
    const user = DEMO_USERS.find((u) => u.id === userId) || DEMO_USERS[0]
    set({
      currentUser: user,
      notification: {
        type: 'info',
        message: `Switched user to ${user.name} (${user.role} - ${user.title}).`,
      },
    })
  },

  // Modals management
  setTemplateModalOpen: (isOpen) => set({ templateModalOpen: Boolean(isOpen) }),
  setPublishModalOpen: (isOpen) => set({ publishModalOpen: Boolean(isOpen) }),
  setVersionHistoryModalOpen: (isOpen) => set({ versionHistoryModalOpen: Boolean(isOpen) }),

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
    if (!SITES.some((s) => s.id === siteId)) return
    if (get().isSimulationMode) {
      get().exitSimulation()
    }
    set({
      activeSite: siteId,
      selectedModule: null,
      selectedNodeId: null,
      notification: null,
      hasUnsavedChanges: false,
    })
  },

  // Update current site's workflow name (read-only guarded in preview, simulation, and for non-admins)
  setWorkflowName: (name) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { currentUser, activeSite, siteDrafts } = get()
    if (!Permissions.canEditWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators can rename workflow drafts.',
        },
      })
      return
    }

    set({
      hasUnsavedChanges: true,
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
      ...currentDraft.history.past.slice(-20),
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

  setSelectedModule: (mod) => set({ selectedModule: mod, selectedNodeId: null }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId, selectedModule: null }),

  // Handle node position/dimension changes
  onNodesChange: (changes) => {
    const { isPreviewMode, isSimulationMode, activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    // In preview or simulation mode, reject movement or removal changes
    if (isPreviewMode || isSimulationMode) {
      const allowedChanges = changes.filter(
        (c) => c.type === 'select' || c.type === 'dimensions'
      )
      if (allowedChanges.length === 0) return

      const updatedNodes = applyNodeChanges(allowedChanges, currentDraft.nodes)
      set({
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
    const isStructuralChange = changes.some((c) => c.type === 'position' || c.type === 'remove')

    set({
      hasUnsavedChanges: isStructuralChange ? true : get().hasUnsavedChanges,
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: updatedNodes,
        },
      },
    })
  },

  // Handle edge selection or removal changes
  onEdgesChange: (changes) => {
    const { isPreviewMode, isSimulationMode, activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

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
    const isStructuralChange = changes.some((c) => c.type === 'remove')

    set({
      hasUnsavedChanges: isStructuralChange ? true : get().hasUnsavedChanges,
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
    const { currentUser, activeSite, siteDrafts, recordHistory } = get()

    if (!Permissions.canEditWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators can create connections.',
        },
      })
      return
    }

    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    // Prevent connecting node to itself
    if (connection.source === connection.target) {
      set({
        notification: {
          type: 'warning',
          message: 'These connection points cannot be connected. Choose a compatible output and input (cannot connect a node to itself).',
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
      hasUnsavedChanges: true,
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

  // Insert an existing placed node into an existing connection (between source and target)
  insertNodeIntoConnection: (edgeId, nodeId) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { currentUser, activeSite, siteDrafts, recordHistory } = get()

    if (!Permissions.canEditWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators can alter workflow connections.',
        },
      })
      return
    }

    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const targetEdge = currentDraft.edges.find((e) => e.id === edgeId)
    const insertedNode = currentDraft.nodes.find((n) => n.id === nodeId)
    if (!targetEdge || !insertedNode) return

    const sourceNode = currentDraft.nodes.find((n) => n.id === targetEdge.source)
    const targetNode = currentDraft.nodes.find((n) => n.id === targetEdge.target)

    const history = recordHistory()

    // 1. Remove the old edge
    const remainingEdges = currentDraft.edges.filter((e) => e.id !== edgeId)

    // 2. Create edge from sourceNode to insertedNode
    const edge1 = {
      id: `edge_${targetEdge.source}_${nodeId}_${Date.now()}`,
      source: targetEdge.source,
      target: nodeId,
      sourceHandle: targetEdge.sourceHandle || 'out',
      targetHandle: 'in',
      type: 'smoothstep',
      animated: true,
      label: targetEdge.label || null,
      style: { stroke: '#a855f7', strokeWidth: 2.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#a855f7',
        width: 18,
        height: 18,
      },
    }

    // 3. Create edge from insertedNode to targetNode
    const edge2 = {
      id: `edge_${nodeId}_${targetEdge.target}_${Date.now() + 1}`,
      source: nodeId,
      target: targetEdge.target,
      sourceHandle: (insertedNode.data?.outputs ?? 1) === 2 ? 'out-true' : 'out',
      targetHandle: targetEdge.targetHandle || 'in',
      type: 'smoothstep',
      animated: true,
      label: null,
      style: { stroke: '#a855f7', strokeWidth: 2.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#a855f7',
        width: 18,
        height: 18,
      },
    }

    const updatedEdges = [...remainingEdges, edge1, edge2]

    set({
      hasUnsavedChanges: true,
      selectedNodeId: nodeId,
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
        message: `Inserted step "${insertedNode.data?.label || insertedNode.data?.name}" between "${sourceNode?.data?.label || sourceNode?.data?.name || 'source'}" and "${targetNode?.data?.label || targetNode?.data?.name || 'target'}".`,
      },
    })
  },

  // Add a new node to the active canvas
  addNode: (node) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { currentUser, activeSite, siteDrafts, recordHistory } = get()

    if (!Permissions.canEditWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators can add nodes to the canvas.',
        },
      })
      return
    }

    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    if (currentDraft.nodes.some((n) => n.id === node.id)) {
      return
    }

    const initialConfig = {}
    if (node.data?.supportedSettings) {
      node.data.supportedSettings.forEach((setting) => {
        initialConfig[setting.key] = setting.defaultValue ?? ''
      })
    }

    // Smart non-overlapping position calculation
    const existingNodes = currentDraft.nodes
    let position = node.position ? { ...node.position } : null
    if (!position || (position.x === 0 && position.y === 0)) {
      if (existingNodes.length === 0) {
        position = { x: 80, y: 160 }
      } else {
        const lastNode = existingNodes[existingNodes.length - 1]
        const nextX = lastNode.position.x + 290
        if (nextX > 920) {
          const maxY = Math.max(...existingNodes.map((n) => n.position.y))
          position = { x: 80, y: maxY + 160 }
        } else {
          position = { x: nextX, y: lastNode.position.y }
        }
      }
    } else {
      const isOverlapping = existingNodes.some(
        (n) => Math.abs(n.position.x - position.x) < 30 && Math.abs(n.position.y - position.y) < 30
      )
      if (isOverlapping) {
        position = { x: position.x + 40, y: position.y + 40 }
      }
    }

    const nodeWithDefaults = {
      ...node,
      position,
      data: {
        ...node.data,
        config: {
          ...initialConfig,
          ...(node.data?.config || {}),
        },
      },
    }

    // Dynamic contextual hint for beginner guidance
    const category = nodeWithDefaults.data?.category
    const inputs = nodeWithDefaults.data?.inputs ?? 1
    const outputs = nodeWithDefaults.data?.outputs ?? 1
    const label = nodeWithDefaults.data?.label || nodeWithDefaults.data?.name || 'Node'

    let hint = null
    if (inputs === 0) {
      hint = `Starting trigger "${label}" placed. Next, drag an operational step onto the canvas and connect the trigger's right handle ("Next →") to it.`
    } else if (outputs === 2) {
      hint = `Conditional router "${label}" placed. Remember to connect both "True →" and "False →" handles to define separate execution paths.`
    } else if (outputs === 0) {
      hint = `Terminal outcome "${label}" placed. Connect an upstream operational step into its left handle ("← In") to complete the workflow.`
    } else if (category === 'Approvals') {
      hint = `Approval gate "${label}" placed. Connect an upstream step into its left handle, then select the node to configure required approver roles.`
    } else {
      hint = `Step "${label}" placed. Connect an upstream step to its left handle ("← In"), then drag from its right handle ("Next →") to the next step.`
    }

    const history = recordHistory()
    const updatedNodes = [...currentDraft.nodes, nodeWithDefaults]

    set({
      hasUnsavedChanges: true,
      selectedNodeId: nodeWithDefaults.id,
      selectedModule: null,
      contextualHint: hint,
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: updatedNodes,
          history,
          isDraftLoaded: true,
        },
      },
    })
  },

  // Load a predefined template into the active site's editable draft
  loadTemplate: (templateId) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { currentUser, activeSite, siteDrafts, recordHistory } = get()

    if (!Permissions.canEditWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators can load workflow templates.',
        },
      })
      return
    }

    // Handle "create from scratch" blank template
    if (templateId === 'blank') {
      const history = recordHistory()
      const siteMeta = SITES.find((s) => s.id === activeSite)
      set({
        hasUnsavedChanges: true,
        templateModalOpen: false,
        selectedNodeId: null,
        selectedModule: null,
        siteDrafts: {
          ...siteDrafts,
          [activeSite]: {
            ...siteDrafts[activeSite],
            workflowName: `${siteMeta?.name || activeSite} Custom Workflow`,
            nodes: [],
            edges: [],
            history,
            isDraftLoaded: true,
          },
        },
        notification: {
          type: 'info',
          message: 'Opened blank canvas. Drag modules from the left panel to build your workflow.',
        },
      })
      return
    }

    const template = WORKFLOW_TEMPLATES.find((t) => t.id === templateId)
    if (!template) {
      set({
        notification: {
          type: 'warning',
          message: `Template "${templateId}" not found.`,
        },
      })
      return
    }

    const { nodes, edges } = typeof template.getGraph === 'function' ? template.getGraph() : { nodes: [], edges: [] }

    if (!nodes || nodes.length === 0) {
      set({
        notification: {
          type: 'warning',
          message: `Template "${template.name}" could not be loaded because it contains no nodes. Existing draft preserved.`,
        },
      })
      return
    }

    const targetSite = template.siteId && template.siteId !== 'all' ? template.siteId : activeSite
    const history = recordHistory()
    const clonedNodes = JSON.parse(JSON.stringify(nodes))
    const clonedEdges = JSON.parse(JSON.stringify(edges))

    set({
      activeSite: targetSite,
      hasUnsavedChanges: true,
      templateModalOpen: false,
      selectedNodeId: null,
      selectedModule: null,
      siteDrafts: {
        ...siteDrafts,
        [targetSite]: {
          ...siteDrafts[targetSite],
          workflowName: template.name,
          nodes: clonedNodes,
          edges: clonedEdges,
          history,
          isDraftLoaded: true,
        },
      },
      notification: {
        type: 'info',
        message: `Loaded template "${template.name}" into editable draft for ${SITES.find((s) => s.id === targetSite)?.name || targetSite}.`,
      },
    })
  },

  // Start building a custom workflow from scratch on a blank canvas
  startFromScratch: (siteId) => {
    const targetSite = siteId || get().activeSite
    const site = SITES.find((s) => s.id === targetSite)
    const history = get().recordHistory()
    set({
      activeSite: targetSite,
      hasUnsavedChanges: true,
      selectedNodeId: null,
      selectedModule: null,
      siteDrafts: {
        ...get().siteDrafts,
        [targetSite]: {
          ...get().siteDrafts[targetSite],
          workflowName: `${site?.name || targetSite} Custom Workflow`,
          nodes: [],
          edges: [],
          history,
          isDraftLoaded: true,
        },
      },
      notification: {
        type: 'info',
        message: `Started blank custom workflow for ${site?.name || targetSite}. Drag a module from the palette to begin.`,
      },
    })
  },

  // Open an existing workflow draft directly onto the canvas
  openExistingWorkflow: (siteId) => {
    const targetSite = siteId || get().activeSite
    const current = get().siteDrafts[targetSite]
    set({
      activeSite: targetSite,
      siteDrafts: {
        ...get().siteDrafts,
        [targetSite]: {
          ...current,
          isDraftLoaded: true,
        },
      },
    })
  },

  // Return to the initial creation screen (choose template or scratch)
  resetToCreationScreen: (siteId) => {
    const targetSite = siteId || get().activeSite
    const current = get().siteDrafts[targetSite]
    set({
      activeSite: targetSite,
      selectedNodeId: null,
      selectedModule: null,
      siteDrafts: {
        ...get().siteDrafts,
        [targetSite]: {
          ...current,
          isDraftLoaded: false,
        },
      },
    })
  },

  // Trigger on-demand topology and parameter validation with user notification
  validateWorkflowActive: () => {
    const { activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [] }
    const report = validateWorkflow(currentDraft.nodes, currentDraft.edges)
    if (report.hasErrors) {
      set({
        notification: {
          type: 'warning',
          message: `Validation: ${report.errorsCount} issue(s) detected. Check the Inspector panel for details.`,
        },
      })
    } else if (report.hasWarnings) {
      set({
        notification: {
          type: 'info',
          message: `Validation Passed: Workflow topology is valid (${report.warningsCount} advisory notice(s)).`,
        },
      })
    } else {
      set({
        notification: {
          type: 'info',
          message: `Validation Passed: All ${currentDraft.nodes.length} steps and ${currentDraft.edges.length} connections are fully valid.`,
        },
      })
    }
    return report
  },

  // Delete a placed node
  deleteNode: (nodeId) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { currentUser, activeSite, siteDrafts, recordHistory } = get()

    if (!Permissions.canEditWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators can delete nodes.',
        },
      })
      return
    }

    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const history = recordHistory()
    const updatedNodes = currentDraft.nodes.filter((n) => n.id !== nodeId)
    const updatedEdges = currentDraft.edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    )

    set({
      hasUnsavedChanges: true,
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

  // Delete an edge connection
  deleteEdge: (edgeId) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { currentUser, activeSite, siteDrafts, recordHistory } = get()

    if (!Permissions.canEditWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators can remove connections.',
        },
      })
      return
    }

    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const history = recordHistory()
    const updatedEdges = currentDraft.edges.filter((e) => e.id !== edgeId)

    set({
      hasUnsavedChanges: true,
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

  // Update placed node label
  updateNodeLabel: (nodeId, newLabel) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { currentUser, activeSite, siteDrafts } = get()

    if (!Permissions.canEditWorkflow(currentUser)) return

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
      hasUnsavedChanges: true,
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: updatedNodes,
        },
      },
    })
  },

  // Update placed node configuration values
  updateNodeConfig: (nodeId, configKey, value) => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { currentUser, activeSite, siteDrafts } = get()

    if (!Permissions.canEditWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators can alter node configurations.',
        },
      })
      return
    }

    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const updatedNodes = currentDraft.nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            config: {
              ...(node.data.config || {}),
              [configKey]: value,
            },
          },
        }
      }
      return node
    })

    set({
      hasUnsavedChanges: true,
      siteDrafts: {
        ...siteDrafts,
        [activeSite]: {
          ...currentDraft,
          nodes: updatedNodes,
        },
      },
    })
  },

  // Clear entire active canvas
  clearGraph: () => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { currentUser, activeSite, siteDrafts, recordHistory } = get()

    if (!Permissions.canEditWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators can clear the canvas.',
        },
      })
      return
    }

    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    const history = recordHistory()

    set({
      hasUnsavedChanges: true,
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
        message: 'Canvas cleared.',
      },
    })
  },

  // Save draft asynchronously via WorkflowService
  saveDraft: async () => {
    const { activeSite, siteDrafts, currentUser } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    set({ isSavingDraft: true })

    try {
      const result = await WorkflowService.saveDraft(activeSite, currentDraft, currentUser)
      const timestamp = new Date().toLocaleTimeString()

      set({
        isSavingDraft: false,
        hasUnsavedChanges: false,
        siteDrafts: {
          ...siteDrafts,
          [activeSite]: {
            ...currentDraft,
            lastSaved: `Saved at ${timestamp}`,
          },
        },
        notification: {
          type: 'info',
          message: `${result.message} (${currentDraft.nodes.length} nodes, ${currentDraft.edges.length} connections).`,
        },
      })
    } catch (err) {
      set({
        isSavingDraft: false,
        notification: {
          type: 'warning',
          message: `Failed to save draft: ${err.message}`,
        },
      })
    }
  },

  // Publish workflow version via WorkflowService
  publishWorkflow: async (bumpType = 'patch', changelog = '') => {
    const { activeSite, siteDrafts, currentUser, publishedWorkflows, versionHistory } = get()
    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft) return

    if (!Permissions.canPublishWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators with Workflow Configurator credentials can publish to production.',
        },
      })
      return
    }

    if (currentDraft.nodes.length === 0) {
      set({
        notification: {
          type: 'warning',
          message: 'Cannot publish an empty workflow. Add modules to the canvas first.',
        },
      })
      return
    }

    const validation = validateWorkflow(currentDraft.nodes, currentDraft.edges)
    if (validation.hasErrors) {
      set({
        notification: {
          type: 'warning',
          message: `Cannot publish: ${validation.errorsCount} validation error(s) must be resolved first.`,
        },
      })
      return
    }

    set({ isPublishing: true })

    try {
      const result = await WorkflowService.publishWorkflow(
        activeSite,
        currentDraft,
        currentUser,
        bumpType,
        changelog
      )

      const newHistory = await WorkflowService.getVersionHistory(activeSite)

      set({
        isPublishing: false,
        hasUnsavedChanges: false,
        publishModalOpen: false,
        publishedWorkflows: {
          ...publishedWorkflows,
          [activeSite]: result.publishedVersion,
        },
        versionHistory: {
          ...versionHistory,
          [activeSite]: newHistory,
        },
        notification: {
          type: 'info',
          message: `Published ${result.publishedVersion.versionTag} for ${activeSite}. Live operational dashboards updated.`,
        },
      })
    } catch (err) {
      set({
        isPublishing: false,
        notification: {
          type: 'warning',
          message: `Publish failed: ${err.message}`,
        },
      })
    }
  },

  // Rollback active published workflow to historical version
  rollbackWorkflow: async (targetVersionId) => {
    const { activeSite, currentUser, publishedWorkflows, siteDrafts } = get()

    if (!Permissions.canRollbackWorkflow(currentUser)) {
      set({
        notification: {
          type: 'warning',
          message: 'Permission denied: Only Administrators can execute SOP rollback.',
        },
      })
      return
    }

    set({ isRollingBack: true })

    try {
      const result = await WorkflowService.rollbackWorkflow(activeSite, targetVersionId, currentUser)
      const rolledBack = result.publishedVersion

      set({
        isRollingBack: false,
        versionHistoryModalOpen: false,
        publishedWorkflows: {
          ...publishedWorkflows,
          [activeSite]: rolledBack,
        },
        // Optionally update editor draft to match rollback
        siteDrafts: {
          ...siteDrafts,
          [activeSite]: {
            ...siteDrafts[activeSite],
            workflowName: rolledBack.workflowName,
            nodes: JSON.parse(JSON.stringify(rolledBack.nodes)),
            edges: JSON.parse(JSON.stringify(rolledBack.edges)),
            lastSaved: `Restored from rollback (${rolledBack.versionTag})`,
          },
        },
        hasUnsavedChanges: false,
        notification: {
          type: 'info',
          message: `Rollback complete: Active SOP set to ${rolledBack.versionTag}.`,
        },
      })
    } catch (err) {
      set({
        isRollingBack: false,
        notification: {
          type: 'warning',
          message: `Rollback failed: ${err.message}`,
        },
      })
    }
  },

  // --- TIME MACHINE SIMULATION ENGINE (Part 5) ---
  startSimulation: () => {
    if (get().isPreviewMode) {
      set({ isPreviewMode: false })
    }

    const { activeSite, siteDrafts } = get()
    const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [] }
    const { nodes, edges } = currentDraft

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
        category: startNode.data?.category || 'Start / Triggers',
        config: startNode.data?.config || {},
        timestamp: new Date().toLocaleTimeString(),
        branchTaken: null,
        status: outEdges.length === 0 ? 'completed' : 'active',
        isSimulated: true,
      },
    ]

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
          message: `Simulation completed: Reached terminal step "${startNodeLabel}". (Virtual dry run: No real operations performed)`,
          executionLog: initialLog,
        },
      })
      return
    }

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
          message: `Simulation active at Step 1: "${startNodeLabel}". Click 'Step Forward' to proceed. (Simulated execution)`,
          pendingBranches: null,
          executionLog: initialLog,
        },
      })
      return
    }

    // Multiple outgoing branches -> Prompt operator
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
        message: `Multiple outgoing connections from "${startNodeLabel}". Choose branch to advance:`,
        pendingBranches,
        executionLog: initialLog,
      },
    })
  },

  stepForward: () => {
    const { activeSite, siteDrafts, simulation, isSimulationMode } = get()
    if (!isSimulationMode || simulation.status !== 'running') return

    const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [] }
    const { nodes, edges } = currentDraft
    const { currentNodeId, visitedNodeIds, traversedEdgeIds, currentStep, totalSteps, executionLog } = simulation

    const outEdges = edges.filter((e) => e.source === currentNodeId)

    if (outEdges.length === 0) {
      const currentNode = nodes.find((n) => n.id === currentNodeId)
      const nodeLabel = currentNode?.data?.label || currentNode?.data?.name || 'Final Node'
      set({
        simulation: {
          ...simulation,
          status: 'completed',
          message: `Simulation completed: Reached final outcome "${nodeLabel}". (Virtual dry run: No real operations performed)`,
        },
      })
      return
    }

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
          message: `Branching rule required for "${nodeLabel}". Select next connection:`,
          pendingBranches,
        },
      })
      return
    }

    // Exactly 1 outgoing connection
    const edge = outEdges[0]
    const nextNode = nodes.find((n) => n.id === edge.target)

    if (!nextNode) {
      set({
        simulation: {
          ...simulation,
          status: 'blocked',
          blockedReason: `Connection references non-existent target node "${edge.target}".`,
          message: 'Simulation blocked: Broken connection detected.',
        },
      })
      return
    }

    const nextStep = currentStep + 1
    const newVisited = [...visitedNodeIds, nextNode.id]
    const newTraversed = [...traversedEdgeIds, edge.id]
    const nextNodeLabel = nextNode.data?.label || nextNode.data?.name || 'Next Step'

    const nextOutEdges = edges.filter((e) => e.source === nextNode.id)
    const isTerminal = nextOutEdges.length === 0 || nextNode.data?.outputs === 0

    const newLogEntry = {
      step: nextStep,
      nodeId: nextNode.id,
      nodeName: nextNodeLabel,
      category: nextNode.data?.category || 'Operations',
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
      isSimulated: true,
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
          message: `Simulation completed: Reached final outcome "${nextNodeLabel}". (Virtual dry run: No real operations performed)`,
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
          message: `Step ${nextStep}: Executing "${nextNodeLabel}". Click 'Step Forward' to proceed. (Simulated execution)`,
          pendingBranches: null,
          executionLog: [...executionLog, newLogEntry],
        },
      })
      return
    }

    // Next node has multiple branches
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
        message: `Branching rule required for "${nextNodeLabel}". Select next connection:`,
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
    const nextNodeLabel = nextNode.data?.label || nextNode.data?.name || 'Next Step'

    const nextOutEdges = edges.filter((e) => e.source === nextNode.id)
    const isTerminal = nextOutEdges.length === 0 || nextNode.data?.outputs === 0

    const newLogEntry = {
      step: nextStep,
      nodeId: nextNode.id,
      nodeName: nextNodeLabel,
      category: nextNode.data?.category || 'Operations',
      config: nextNode.data?.config || {},
      timestamp: new Date().toLocaleTimeString(),
      branchTaken: chosenBranch?.branchLabel || 'Branch Selected',
      status: isTerminal ? 'completed' : 'active',
      isSimulated: true,
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
          message: `Simulation completed: Reached final outcome "${nextNodeLabel}". (Virtual dry run: No real operations performed)`,
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
          message: `Step ${nextStep}: Executing "${nextNodeLabel}". Click 'Step Forward' to proceed. (Simulated execution)`,
          pendingBranches: null,
          executionLog: [...executionLog, newLogEntry],
        },
      })
      return
    }

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
        message: `Branching rule required for "${nextNodeLabel}". Select next connection:`,
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

  // Undo / Redo controls (guarded in preview, simulation, and for non-admins)
  undo: () => {
    if (get().isPreviewMode || get().isSimulationMode) return
    const { currentUser, activeSite, siteDrafts } = get()

    if (!Permissions.canEditWorkflow(currentUser)) return

    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft || currentDraft.history.past.length === 0) return

    const previousState = currentDraft.history.past[currentDraft.history.past.length - 1]
    const newPast = currentDraft.history.past.slice(0, -1)

    set({
      hasUnsavedChanges: true,
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
    const { currentUser, activeSite, siteDrafts } = get()

    if (!Permissions.canEditWorkflow(currentUser)) return

    const currentDraft = siteDrafts[activeSite]
    if (!currentDraft || currentDraft.history.future.length === 0) return

    const nextState = currentDraft.history.future[0]
    const newFuture = currentDraft.history.future.slice(1)

    set({
      hasUnsavedChanges: true,
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

  // Dismiss notification banner
  clearNotification: () => {
    set({ notification: null })
  },
}))
