/**
 * OpsHub Visual Workflow Builder - Workflow Validation Engine
 *
 * Evaluates the active site's node topology and configuration fields
 * against platform rules, producing understandable errors and warnings.
 */

export function validateWorkflow(nodes = [], edges = []) {
  const issues = []
  const nodeIssuesMap = {}

  const addIssue = (issue) => {
    issues.push(issue)
    if (issue.nodeId) {
      if (!nodeIssuesMap[issue.nodeId]) {
        nodeIssuesMap[issue.nodeId] = []
      }
      nodeIssuesMap[issue.nodeId].push(issue)
    }
  }

  // 1. Empty Canvas Rule
  if (nodes.length === 0) {
    return {
      isValid: false,
      hasErrors: false,
      hasWarnings: true,
      errorsCount: 0,
      warningsCount: 1,
      issues: [
        {
          id: 'empty-canvas',
          type: 'warning',
          message: 'The canvas is empty. Drag modules from the palette to start building.',
        },
      ],
      nodeIssuesMap: {},
    }
  }

  // 2. Starting Trigger / Entry Rule
  const entryNodes = nodes.filter((n) => (n.data?.inputs ?? 0) === 0)
  if (entryNodes.length === 0) {
    addIssue({
      id: 'missing-entry-trigger',
      type: 'warning',
      message: 'No starting trigger found. Workflows require at least one trigger or entry module to initiate.',
    })
  }

  // 3. Node-Level Connection & Configuration Rules
  nodes.forEach((node) => {
    const nodeLabel = node.data?.label || node.data?.name || node.id
    const inputsRequired = node.data?.inputs ?? 1
    const outputsProvided = node.data?.outputs ?? 1

    // Check Inbound Connections
    const inboundEdges = edges.filter((e) => e.target === node.id)
    if (inputsRequired > 0 && inboundEdges.length === 0) {
      addIssue({
        id: `orphan-inbound-${node.id}`,
        nodeId: node.id,
        nodeLabel,
        type: 'error',
        message: `Node "${nodeLabel}" requires an inbound connection but has none.`,
      })
    }

    // Check Outbound Connections (only warning if non-terminal)
    const outboundEdges = edges.filter((e) => e.source === node.id)
    if (outputsProvided > 0 && outboundEdges.length === 0) {
      // If it's a gateway with 2 outputs (e.g. conditional branch)
      if (outputsProvided === 2) {
        addIssue({
          id: `unwired-gateway-${node.id}`,
          nodeId: node.id,
          nodeLabel,
          type: 'error',
          message: `Branch gateway "${nodeLabel}" must connect both true/false output paths.`,
        })
      } else {
        addIssue({
          id: `terminal-warning-${node.id}`,
          nodeId: node.id,
          nodeLabel,
          type: 'warning',
          message: `Node "${nodeLabel}" has no outgoing connection (acts as terminal step).`,
        })
      }
    }

    // Check Required Configuration Settings
    const supportedSettings = node.data?.supportedSettings || []
    const config = node.data?.config || {}

    supportedSettings.forEach((setting) => {
      const val = config[setting.key]

      if (setting.required) {
        const isEmpty = val === undefined || val === null || val === ''
        if (isEmpty) {
          addIssue({
            id: `missing-setting-${node.id}-${setting.key}`,
            nodeId: node.id,
            nodeLabel,
            fieldKey: setting.key,
            type: 'error',
            message: `Node "${nodeLabel}": Required setting "${setting.label}" is missing.`,
          })
        }
      }

      // Range check for numbers
      if (setting.type === 'number' && val !== undefined && val !== null && val !== '') {
        const num = Number(val)
        if (isNaN(num)) {
          addIssue({
            id: `invalid-number-${node.id}-${setting.key}`,
            nodeId: node.id,
            nodeLabel,
            fieldKey: setting.key,
            type: 'error',
            message: `Node "${nodeLabel}": Setting "${setting.label}" must be a valid number.`,
          })
        } else {
          if (setting.min !== undefined && num < setting.min) {
            addIssue({
              id: `min-bound-${node.id}-${setting.key}`,
              nodeId: node.id,
              nodeLabel,
              fieldKey: setting.key,
              type: 'error',
              message: `Node "${nodeLabel}": "${setting.label}" cannot be less than ${setting.min}.`,
            })
          }
          if (setting.max !== undefined && num > setting.max) {
            addIssue({
              id: `max-bound-${node.id}-${setting.key}`,
              nodeId: node.id,
              nodeLabel,
              fieldKey: setting.key,
              type: 'error',
              message: `Node "${nodeLabel}": "${setting.label}" cannot exceed ${setting.max}.`,
            })
          }
        }
      }
    })
  })

  const errors = issues.filter((i) => i.type === 'error')
  const warnings = issues.filter((i) => i.type === 'warning')

  return {
    isValid: errors.length === 0,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
    errorsCount: errors.length,
    warningsCount: warnings.length,
    issues,
    nodeIssuesMap,
  }
}
