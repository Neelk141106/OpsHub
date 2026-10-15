import { create } from 'zustand'

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
  // Active selected operational site
  activeSite: 'central-stores',

  // Isolated drafts keyed by siteId to prevent accidental draft sharing
  siteDrafts: INITIAL_SITE_DRAFTS,

  // Selected module from the palette or canvas
  selectedModule: null,
  selectedNodeId: null,

  // UI modes & status
  isSimulationMode: false,
  notification: null,

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

  // Update current site's workflow name
  setWorkflowName: (name) => {
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

  // Select module to inspect
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

  // Simulation Mode toggle
  toggleSimulationMode: () => {
    set((state) => ({ isSimulationMode: !state.isSimulationMode }))
  },

  // Undo / Redo controls
  undo: () => {
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

  // Save draft locally (honest messaging: Part 1 in-memory only)
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
        message: `Draft saved to local memory for ${siteDrafts[activeSite].workflowName}. Backend persistence will be connected in Part 6.`,
      },
    })
  },

  // Publish workflow (honest messaging: locked until Part 6)
  triggerPublish: () => {
    set({
      notification: {
        type: 'warning',
        message:
          'Publishing requires Graph Validation (Part 4) and Integration Export (Part 6). Currently running Part 1 UI Foundation.',
      },
    })
  },

  // Dismiss notification banner
  clearNotification: () => {
    set({ notification: null })
  },
}))
