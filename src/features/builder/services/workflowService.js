/**
 * OpsHub Visual Workflow Builder - Workflow Persistence & Publishing Service
 *
 * Implements:
 * 1. Independent Draft vs. Published configuration separation per site.
 * 2. Immutable Semantic Versioning (v1.0.0, v1.0.1, v1.1.0, v2.0.0).
 * 3. Version history log and safe rollback capabilities.
 * 4. Realistic asynchronous network simulation with error handling.
 * 5. Documented backend API integration contracts for production deployment.
 */

import { validateWorkflow } from '../validation/validateWorkflow.js'
import { WORKFLOW_TEMPLATES } from '../templates/workflowTemplates.js'

const STORAGE_PREFIX = 'opshub_wf_'

/**
 * Backend API Contract Specification:
 * In a multi-tenant production environment, this service delegates to these REST endpoints:
 * - GET  /api/v1/sites/:siteId/workflows/published -> Fetches live operational SOP
 * - POST /api/v1/sites/:siteId/workflows/draft     -> Saves in-progress editable draft
 * - POST /api/v1/sites/:siteId/workflows/publish   -> Validates, increments semver, and deploys SOP
 * - POST /api/v1/sites/:siteId/workflows/rollback  -> Reverts active SOP to historical version
 * - GET  /api/v1/sites/:siteId/workflows/versions  -> Retrieves immutable version audit trail
 */

function getStorageKey(type, siteId) {
  return `${STORAGE_PREFIX}${type}_${siteId}`
}

function computeNextVersion(currentTag = 'v1.0.0', bumpType = 'patch') {
  const match = currentTag.replace(/^v/, '').split('.').map(Number)
  let [major = 1, minor = 0, patch = 0] = match

  if (bumpType === 'major') {
    major += 1
    minor = 0
    patch = 0
  } else if (bumpType === 'minor') {
    minor += 1
    patch = 0
  } else {
    patch += 1
  }

  return `v${major}.${minor}.${patch}`
}

export const WorkflowService = {
  /**
   * Initializes default published SOP for each operational facility if not present.
   */
  initializeFacilityBaselines: () => {
    const facilities = ['central-stores', 'service-centre', 'distribution']

    facilities.forEach((siteId) => {
      const pubKey = getStorageKey('published', siteId)
      const existing = localStorage.getItem(pubKey)

      if (!existing) {
        const template = WORKFLOW_TEMPLATES.find((t) => t.siteId === siteId)
        if (template) {
          const { nodes, edges } = template.getGraph()
          const baselinePublished = {
            versionId: `ver_init_${siteId}_100`,
            versionTag: 'v1.0.0',
            siteId,
            workflowName: template.name,
            nodes,
            edges,
            publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago baseline
            publishedBy: 'System Baseline (OpsHub Provisioning)',
            changelog: 'Initial factory default operational SOP.',
            status: 'ACTIVE_PUBLISHED',
          }

          localStorage.setItem(pubKey, JSON.stringify(baselinePublished))

          const histKey = getStorageKey('versions', siteId)
          localStorage.setItem(histKey, JSON.stringify([baselinePublished]))
        }
      }
    })
  },

  /**
   * Fetches the active published workflow SOP for an operational facility.
   */
  getPublishedWorkflow: async (siteId) => {
    WorkflowService.initializeFacilityBaselines()
    // Simulated async network delay (150ms)
    await new Promise((r) => setTimeout(r, 150))

    try {
      const pubKey = getStorageKey('published', siteId)
      const data = localStorage.getItem(pubKey)
      if (data) {
        return JSON.parse(data)
      }
    } catch (err) {
      console.warn(`[WorkflowService] Error reading published workflow for ${siteId}:`, err)
    }

    // Fallback to template if storage read fails
    const template = WORKFLOW_TEMPLATES.find((t) => t.siteId === siteId)
    if (template) {
      const { nodes, edges } = template.getGraph()
      return {
        versionId: `ver_fallback_${siteId}`,
        versionTag: 'v1.0.0',
        siteId,
        workflowName: template.name,
        nodes,
        edges,
        publishedAt: new Date().toISOString(),
        publishedBy: 'System Fallback',
        changelog: 'Loaded from static fallback template.',
        status: 'ACTIVE_PUBLISHED',
      }
    }

    return null
  },

  /**
   * Retrieves the immutable version history list for a facility.
   */
  getVersionHistory: async (siteId) => {
    WorkflowService.initializeFacilityBaselines()
    await new Promise((r) => setTimeout(r, 100))

    try {
      const histKey = getStorageKey('versions', siteId)
      const data = localStorage.getItem(histKey)
      if (data) {
        return JSON.parse(data)
      }
    } catch (err) {
      console.warn(`[WorkflowService] Error reading version history for ${siteId}:`, err)
    }

    return []
  },

  /**
   * Saves in-progress editable draft to persistent storage.
   */
  saveDraft: async (siteId, draftData, user) => {
    // Simulated network transit delay (200ms)
    await new Promise((r) => setTimeout(r, 200))

    if (!siteId || !draftData) {
      throw new Error('Invalid draft payload: siteId and draftData are required.')
    }

    const payload = {
      siteId,
      workflowName: draftData.workflowName,
      nodes: draftData.nodes,
      edges: draftData.edges,
      savedAt: new Date().toISOString(),
      savedBy: user?.name || 'Administrator',
      version: 'DRAFT',
    }

    try {
      const draftKey = getStorageKey('draft', siteId)
      localStorage.setItem(draftKey, JSON.stringify(payload))
      return {
        success: true,
        savedAt: payload.savedAt,
        message: `Draft successfully saved for ${siteId}.`,
      }
    } catch (err) {
      throw new Error(`Failed to persist draft: ${err.message}`)
    }
  },

  /**
   * Loads saved draft from persistent storage, falling back to facility baseline template.
   */
  loadDraft: async (siteId) => {
    WorkflowService.initializeFacilityBaselines()
    await new Promise((r) => setTimeout(r, 100))

    try {
      const draftKey = getStorageKey('draft', siteId)
      const data = localStorage.getItem(draftKey)
      if (data) {
        return JSON.parse(data)
      }
    } catch (err) {
      console.warn(`[WorkflowService] Error reading draft for ${siteId}:`, err)
    }

    return null
  },

  /**
   * Validates and publishes a new workflow version.
   * Enforces strict validation, creates an immutable version entry, and updates published state.
   */
  publishWorkflow: async (siteId, workflowData, user, bumpType = 'patch', changelog = '') => {
    // Simulated network publishing latency (350ms)
    await new Promise((r) => setTimeout(r, 350))

    const { nodes, edges, workflowName } = workflowData

    // 1. Strict Pre-flight Validation
    const validation = validateWorkflow(nodes, edges)
    if (validation.hasErrors) {
      const errorMsg = validation.issues
        .filter((i) => i.type === 'error')
        .map((i) => i.message)
        .join('; ')
      throw new Error(`Cannot publish: Graph contains validation errors: ${errorMsg}`)
    }

    // 2. Fetch current active published version to calculate next semver
    const currentPublished = await WorkflowService.getPublishedWorkflow(siteId)
    const nextVersionTag = computeNextVersion(currentPublished?.versionTag || 'v1.0.0', bumpType)
    const versionId = `ver_${siteId}_${Date.now()}`

    const newPublishedVersion = {
      versionId,
      versionTag: nextVersionTag,
      siteId,
      workflowName: workflowName || `${siteId} Operational Flow`,
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      publishedAt: new Date().toISOString(),
      publishedBy: user?.name || 'Administrator',
      changelog: changelog || `Automated ${bumpType} increment release.`,
      status: 'ACTIVE_PUBLISHED',
      validationSummary: {
        nodesCount: nodes.length,
        edgesCount: edges.length,
        warningsCount: validation.warningsCount,
      },
    }

    // 3. Persist to Published slot
    const pubKey = getStorageKey('published', siteId)
    localStorage.setItem(pubKey, JSON.stringify(newPublishedVersion))

    // 4. Append to Immutable History
    const history = await WorkflowService.getVersionHistory(siteId)
    const updatedHistory = [newPublishedVersion, ...history]
    const histKey = getStorageKey('versions', siteId)
    localStorage.setItem(histKey, JSON.stringify(updatedHistory))

    return {
      success: true,
      publishedVersion: newPublishedVersion,
      message: `Successfully published version ${nextVersionTag} for ${siteId}.`,
    }
  },

  /**
   * Rolls back the active published configuration to a previously published historical version.
   */
  rollbackWorkflow: async (siteId, targetVersionId, user) => {
    await new Promise((r) => setTimeout(r, 250))

    const history = await WorkflowService.getVersionHistory(siteId)
    const targetVersion = history.find((v) => v.versionId === targetVersionId)

    if (!targetVersion) {
      throw new Error(`Target historical version "${targetVersionId}" not found for ${siteId}.`)
    }

    // Stamp rollback event
    const rolledBackVersion = {
      ...targetVersion,
      rolledBackAt: new Date().toISOString(),
      rolledBackBy: user?.name || 'Administrator',
      status: 'ACTIVE_PUBLISHED',
    }

    // Update published slot
    const pubKey = getStorageKey('published', siteId)
    localStorage.setItem(pubKey, JSON.stringify(rolledBackVersion))

    return {
      success: true,
      publishedVersion: rolledBackVersion,
      message: `Successfully rolled back ${siteId} SOP to ${targetVersion.versionTag}.`,
    }
  },
}
