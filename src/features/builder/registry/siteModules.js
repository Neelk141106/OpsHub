/**
 * OpsHub Visual Workflow Builder - Approved Module Registry
 *
 * Defines the operational modules available to operators across
 * Central Stores, Service Centre, Distribution, and general Flow Control.
 */

export const SITES = [
  {
    id: 'central-stores',
    name: 'Central Stores',
    shortName: 'Stores',
    description: 'Inventory depot, warehousing, and material intake',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    accentColor: 'emerald',
  },
  {
    id: 'service-centre',
    name: 'Service Centre',
    shortName: 'Service',
    description: 'Maintenance, repair, testing, and refurbishment operations',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    accentColor: 'amber',
  },
  {
    id: 'distribution',
    name: 'Distribution',
    shortName: 'Logistics',
    description: 'Outbound order fulfillment, freight, and carrier handoff',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    accentColor: 'cyan',
  },
]

export const MODULE_CATEGORIES = {
  TRIGGER: 'Trigger',
  ACTION: 'Action',
  GATEWAY: 'Flow Control',
}

export const WORKFLOW_MODULES = [
  // --- Central Stores Modules ---
  {
    id: 'stores-stock-arrival',
    siteId: 'central-stores',
    category: MODULE_CATEGORIES.TRIGGER,
    name: 'Stock Arrival Trigger',
    summary: 'Fires when new shipment or raw materials arrive at loading dock.',
    inputs: 0,
    outputs: 1,
    icon: 'PackagePlus',
    contract: {
      payload: ['sku', 'batchId', 'quantity', 'dockBay', 'timestamp'],
    },
  },
  {
    id: 'stores-reorder-alert',
    siteId: 'central-stores',
    category: MODULE_CATEGORIES.TRIGGER,
    name: 'Min Stock Reorder Alert',
    summary: 'Triggers when inventory level drops below safety buffer threshold.',
    inputs: 0,
    outputs: 1,
    icon: 'AlertTriangle',
    contract: {
      payload: ['sku', 'currentStock', 'thresholdLevel', 'alertTimestamp'],
    },
  },
  {
    id: 'stores-requisition-intake',
    siteId: 'central-stores',
    category: MODULE_CATEGORIES.TRIGGER,
    name: 'Requisition Intake',
    summary: 'Receives part requisition request dispatched from Service Centre.',
    inputs: 0,
    outputs: 1,
    icon: 'FileInput',
    contract: {
      payload: ['requisitionId', 'targetTicketId', 'requestedSkus', 'priority'],
    },
  },
  {
    id: 'stores-allocate-inventory',
    siteId: 'central-stores',
    category: MODULE_CATEGORIES.ACTION,
    name: 'Allocate Inventory',
    summary: 'Deducts and reserves stock quantities from active bins.',
    inputs: 1,
    outputs: 1,
    icon: 'Boxes',
    contract: {
      input: ['sku', 'quantity'],
      output: ['allocationId', 'binLocation', 'status'],
    },
  },
  {
    id: 'stores-dispatch-service',
    siteId: 'central-stores',
    category: MODULE_CATEGORIES.ACTION,
    name: 'Dispatch to Service',
    summary: 'Stages parts and routes transfer batch to Service Centre bay.',
    inputs: 1,
    outputs: 1,
    icon: 'SendHorizontal',
    contract: {
      input: ['allocationId', 'targetTicketId'],
      output: ['dispatchId', 'transitTimestamp'],
    },
  },
  {
    id: 'stores-quarantine-batch',
    siteId: 'central-stores',
    category: MODULE_CATEGORIES.ACTION,
    name: 'Quarantine Batch',
    summary: 'Locks non-conforming or damaged batches in designated inspection pen.',
    inputs: 1,
    outputs: 1,
    icon: 'ShieldAlert',
    contract: {
      input: ['batchId', 'reasonCode'],
      output: ['quarantineId', 'isolationLocation'],
    },
  },

  // --- Service Centre Modules ---
  {
    id: 'service-ticket-intake',
    siteId: 'service-centre',
    category: MODULE_CATEGORIES.TRIGGER,
    name: 'Repair Ticket Intake',
    summary: 'Triggers when equipment is checked in for triage or scheduled maintenance.',
    inputs: 0,
    outputs: 1,
    icon: 'Wrench',
    contract: {
      payload: ['ticketId', 'serialNumber', 'defectCategory', 'priority'],
    },
  },
  {
    id: 'service-diagnostics-fail',
    siteId: 'service-centre',
    category: MODULE_CATEGORIES.TRIGGER,
    name: 'Diagnostic Failure',
    summary: 'Fires when automated diagnostic sweep returns critical fault codes.',
    inputs: 0,
    outputs: 1,
    icon: 'Flame',
    contract: {
      payload: ['ticketId', 'faultCode', 'subsystemId'],
    },
  },
  {
    id: 'service-assign-technician',
    siteId: 'service-centre',
    category: MODULE_CATEGORIES.ACTION,
    name: 'Assign Technician',
    summary: 'Assigns work order to qualified technician based on queue depth & skill tier.',
    inputs: 1,
    outputs: 1,
    icon: 'UserCheck',
    contract: {
      input: ['ticketId', 'requiredTier'],
      output: ['technicianId', 'workstationId', 'assignedAt'],
    },
  },
  {
    id: 'service-request-parts',
    siteId: 'service-centre',
    category: MODULE_CATEGORIES.ACTION,
    name: 'Request Parts',
    summary: 'Submits electronic part requisition order to Central Stores.',
    inputs: 1,
    outputs: 1,
    icon: 'FileQuestion',
    contract: {
      input: ['ticketId', 'partSku', 'quantity'],
      output: ['requisitionId', 'fulfillmentStatus'],
    },
  },
  {
    id: 'service-qa-signoff',
    siteId: 'service-centre',
    category: MODULE_CATEGORIES.ACTION,
    name: 'QA Inspection Gate',
    summary: 'Quality assurance checklist and certificate issuance before return-to-service.',
    inputs: 1,
    outputs: 2,
    icon: 'CheckCircle2',
    contract: {
      input: ['ticketId', 'inspectionScore'],
      output: ['qaSignOffToken', 'passed'],
    },
  },
  {
    id: 'service-release-distribution',
    siteId: 'service-centre',
    category: MODULE_CATEGORIES.ACTION,
    name: 'Release to Distribution',
    summary: 'Hands off refurbished equipment to Distribution packing facility.',
    inputs: 1,
    outputs: 1,
    icon: 'ArrowRightCircle',
    contract: {
      input: ['ticketId', 'qaSignOffToken'],
      output: ['transitTransferId', 'releasedAt'],
    },
  },

  // --- Distribution Modules ---
  {
    id: 'dist-order-queued',
    siteId: 'distribution',
    category: MODULE_CATEGORIES.TRIGGER,
    name: 'Fulfillment Order Queued',
    summary: 'Fires when high-priority requisition or delivery schedule is confirmed.',
    inputs: 0,
    outputs: 1,
    icon: 'ShoppingBag',
    contract: {
      payload: ['orderId', 'destinationDepot', 'priorityTier'],
    },
  },
  {
    id: 'dist-carrier-window',
    siteId: 'distribution',
    category: MODULE_CATEGORIES.TRIGGER,
    name: 'Carrier Window Opened',
    summary: 'Triggers freight staging for scheduled carrier freight dispatch window.',
    inputs: 0,
    outputs: 1,
    icon: 'Clock',
    contract: {
      payload: ['carrierId', 'pickupWindowUtc', 'bayAssigned'],
    },
  },
  {
    id: 'dist-pick-pack',
    siteId: 'distribution',
    category: MODULE_CATEGORIES.ACTION,
    name: 'Pick & Pack Verification',
    summary: 'Scans unit barcodes, measures package weight, and prints packing slips.',
    inputs: 1,
    outputs: 1,
    icon: 'Barcode',
    contract: {
      input: ['orderId'],
      output: ['packageWeightKg', 'dimensions', 'packedTimestamp'],
    },
  },
  {
    id: 'dist-generate-manifest',
    siteId: 'distribution',
    category: MODULE_CATEGORIES.ACTION,
    name: 'Generate Manifest',
    summary: 'Produces carrier bill of lading, export compliance stamps, and tracking label.',
    inputs: 1,
    outputs: 1,
    icon: 'FileText',
    contract: {
      input: ['orderId', 'carrierCode'],
      output: ['waybillNumber', 'manifestId', 'trackingUrl'],
    },
  },
  {
    id: 'dist-carrier-handoff',
    siteId: 'distribution',
    category: MODULE_CATEGORIES.ACTION,
    name: 'Carrier Custody Handoff',
    summary: 'Confirms driver signature, loading milestone, and departure scan.',
    inputs: 1,
    outputs: 1,
    icon: 'Truck',
    contract: {
      input: ['manifestId', 'driverToken'],
      output: ['handoffTimestamp', 'sealNumber'],
    },
  },

  // --- Flow Control Modules (Common) ---
  {
    id: 'common-condition-branch',
    siteId: 'all',
    category: MODULE_CATEGORIES.GATEWAY,
    name: 'Conditional Router',
    summary: 'Evaluates logical conditions to split workflow into alternate execution paths.',
    inputs: 1,
    outputs: 2,
    icon: 'GitFork',
    contract: {
      input: ['expression', 'sourceValue'],
      output: ['branchTrue', 'branchFalse'],
    },
  },
  {
    id: 'common-approval-gate',
    siteId: 'all',
    category: MODULE_CATEGORIES.GATEWAY,
    name: 'Supervisor Approval Gate',
    summary: 'Pauses automated execution until operations manager signs authorization.',
    inputs: 1,
    outputs: 1,
    icon: 'KeyRound',
    contract: {
      input: ['authorizationTier', 'justification'],
      output: ['authorizedBy', 'approvalTimestamp'],
    },
  },
  {
    id: 'common-inter-site-transit',
    siteId: 'all',
    category: MODULE_CATEGORIES.GATEWAY,
    name: 'Inter-Site Transit Connector',
    summary: 'Models cross-facility transport delay, handoff receipt, and chain of custody.',
    inputs: 1,
    outputs: 1,
    icon: 'ArrowLeftRight',
    contract: {
      input: ['originSite', 'targetSite', 'estTransitMinutes'],
      output: ['custodyTransferId', 'transitStatus'],
    },
  },
]
