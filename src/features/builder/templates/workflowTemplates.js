/**
 * OpsHub Visual Workflow Builder - Predefined Operational Templates
 *
 * Provides official starting workflow templates for:
 * 1. Central Stores: Requisition -> Stock Check -> Approval -> Material Assignment -> Completed & Staged
 * 2. Service Centre: Repair Request -> Inspection -> Conditional Gate -> Approval / PCB Repair -> Return-to-Service
 * 3. Distribution: Order Intake -> Material Verification -> Consumption Tracking -> Returns RMA -> Carrier Dispatch
 * 4. Create from Scratch: Empty workspace
 */

import { MarkerType } from '@xyflow/react'
import { WORKFLOW_MODULES } from '../registry/siteModules.js'

function createTemplateNode(moduleId, instanceId, x, y, customConfig = {}) {
  const mod = WORKFLOW_MODULES.find((m) => m.id === moduleId)
  if (!mod) {
    throw new Error(`Module with ID "${moduleId}" not found in registry.`)
  }

  const initialConfig = {}
  if (mod.supportedSettings) {
    mod.supportedSettings.forEach((setting) => {
      initialConfig[setting.key] = setting.defaultValue ?? ''
    })
  }

  return {
    id: instanceId,
    type: 'workflowNode',
    position: { x, y },
    data: {
      ...mod,
      label: mod.name,
      config: {
        ...initialConfig,
        ...customConfig,
      },
    },
  }
}

function createTemplateEdge(id, source, target, sourceHandle = 'out', targetHandle = 'in', label = null) {
  return {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'smoothstep',
    animated: true,
    label,
    style: { stroke: '#a855f7', strokeWidth: 2.5 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#a855f7',
      width: 18,
      height: 18,
    },
  }
}

export const WORKFLOW_TEMPLATES = [
  {
    id: 'central-stores-standard',
    siteId: 'central-stores',
    name: 'Central Stores: Requisition & Staging SOP',
    badge: 'Standard Depot Flow',
    description:
      'Standard requisition lifecycle: intake request, verify warehouse stock, require supervisor signoff for high priority, allocate lot batch, and stage for pickup.',
    nodesCount: 5,
    getGraph: () => {
      const nodes = [
        createTemplateNode(
          'stores-requisition-intake',
          'cs_node_1_intake',
          60,
          160,
          { priorityChannel: 'Normal' }
        ),
        createTemplateNode(
          'stores-stock-check',
          'cs_node_2_stockcheck',
          380,
          160,
          { allowPartialFulfillment: true }
        ),
        createTemplateNode(
          'common-approval-gate',
          'cs_node_3_approval',
          700,
          160,
          { gateTimeoutHours: 8 }
        ),
        createTemplateNode(
          'core-material-assignment',
          'cs_node_4_assignment',
          1020,
          160,
          { reservationLockMinutes: 120, strictLotMatching: true }
        ),
        createTemplateNode(
          'common-success-outcome',
          'cs_node_5_outcome',
          1340,
          160,
          { archiveRetentionDays: 365 }
        ),
      ]

      const edges = [
        createTemplateEdge('cs_edge_1_2', 'cs_node_1_intake', 'cs_node_2_stockcheck'),
        createTemplateEdge('cs_edge_2_3', 'cs_node_2_stockcheck', 'cs_node_3_approval'),
        createTemplateEdge('cs_edge_3_4', 'cs_node_3_approval', 'cs_node_4_assignment'),
        createTemplateEdge('cs_edge_4_5', 'cs_node_4_assignment', 'cs_node_5_outcome'),
      ]

      return { nodes, edges }
    },
  },

  {
    id: 'service-centre-standard',
    siteId: 'service-centre',
    name: 'Service Centre: Diagnostics & Component Rework',
    badge: 'Dual-Path Triage Flow',
    description:
      'Handles repair check-in, bench optical inspection, conditional fault routing to supervisor escalation or direct micro-soldering PCB rework, and return-to-service certification.',
    nodesCount: 7,
    getGraph: () => {
      const nodes = [
        createTemplateNode(
          'service-ticket-intake',
          'sc_node_1_intake',
          60,
          200,
          { equipmentClass: 'Avionics / Circuitry' }
        ),
        createTemplateNode(
          'service-inspection',
          'sc_node_2_inspection',
          360,
          200,
          { inspectionStandard: 'IPC-A-610 Class 3' }
        ),
        createTemplateNode(
          'common-condition-branch',
          'sc_node_3_router',
          660,
          200,
          { evaluationExpression: 'diagnosticScore >= 80' }
        ),
        createTemplateNode(
          'common-approval-gate',
          'sc_node_4_approval',
          980,
          90,
          { gateTimeoutHours: 4 }
        ),
        createTemplateNode(
          'core-pcb-repair',
          'sc_node_5_repair',
          980,
          310,
          { esdCertificationCheck: true, maxReworkCycles: 3 }
        ),
        createTemplateNode(
          'common-quarantine-outcome',
          'sc_node_6_quarantine',
          1300,
          90,
          { notifyQualityTeam: true }
        ),
        createTemplateNode(
          'common-success-outcome',
          'sc_node_7_success',
          1300,
          310,
          { archiveRetentionDays: 730 }
        ),
      ]

      const edges = [
        createTemplateEdge('sc_edge_1_2', 'sc_node_1_intake', 'sc_node_2_inspection'),
        createTemplateEdge('sc_edge_2_3', 'sc_node_2_inspection', 'sc_node_3_router'),
        // Gateway branching: Top handle (out-true) goes to standard PCB repair
        createTemplateEdge('sc_edge_3_5', 'sc_node_3_router', 'sc_node_5_repair', 'out-true', 'in', 'Pass Diagnostic'),
        // Gateway branching: Bottom handle (out-false) goes to supervisor escalation
        createTemplateEdge('sc_edge_3_4', 'sc_node_3_router', 'sc_node_4_approval', 'out-false', 'in', 'Critical Defect'),
        createTemplateEdge('sc_edge_4_6', 'sc_node_4_approval', 'sc_node_6_quarantine'),
        createTemplateEdge('sc_edge_5_7', 'sc_node_5_repair', 'sc_node_7_success'),
      ]

      return { nodes, edges }
    },
  },

  {
    id: 'distribution-standard',
    siteId: 'distribution',
    name: 'Distribution: Fulfillment & Freight Logistics',
    badge: 'Logistics Manifest Flow',
    description:
      'Outbound order queuing, part reservation verification, consumption ledger depletion, returns processing, and freight carrier manifest dispatch.',
    nodesCount: 5,
    getGraph: () => {
      const nodes = [
        createTemplateNode(
          'dist-order-queued',
          'dist_node_1_order',
          60,
          160,
          { orderPriority: 'Express Next-Day' }
        ),
        createTemplateNode(
          'core-material-assignment',
          'dist_node_2_assignment',
          380,
          160,
          { reservationLockMinutes: 60, strictLotMatching: true }
        ),
        createTemplateNode(
          'core-consumption',
          'dist_node_3_consumption',
          700,
          160,
          { scrapAllowancePercent: 2 }
        ),
        createTemplateNode(
          'dist-returns-processing',
          'dist_node_4_returns',
          1020,
          160,
          { warrantyVerification: true }
        ),
        createTemplateNode(
          'common-dispatch-outcome',
          'dist_node_5_dispatch',
          1340,
          160,
          { sendCustomerTracking: true }
        ),
      ]

      const edges = [
        createTemplateEdge('dist_edge_1_2', 'dist_node_1_order', 'dist_node_2_assignment'),
        createTemplateEdge('dist_edge_2_3', 'dist_node_2_assignment', 'dist_node_3_consumption'),
        createTemplateEdge('dist_edge_3_4', 'dist_node_3_consumption', 'dist_node_4_returns'),
        createTemplateEdge('dist_edge_4_5', 'dist_node_4_returns', 'dist_node_5_dispatch'),
      ]

      return { nodes, edges }
    },
  },
]
