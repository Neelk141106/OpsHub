/**
 * OpsHub Visual Workflow Builder - Human-Friendly Node Explanations
 *
 * Provides beginner-friendly, plain-English guidance for all 39 workflow modules.
 * Structure per node:
 * - whatItDoes: Plain-English explanation of the module's role.
 * - whenToUse: Practical operational situation where the user chooses it.
 * - example: Short, realistic enterprise example.
 * - nextStep: Logically following step based on supported connections.
 * - connectionRequirements: Inbound and outbound connection rules.
 * - configurationNeeded: Summary of required and optional settings.
 */

export const NODE_EXPLANATIONS = {
  // -------------------------------------------------------------------------
  // START / TRIGGERS
  // -------------------------------------------------------------------------
  'stores-requisition-intake': {
    whatItDoes: 'Starts a workflow whenever a department or service bench submits a new material requisition.',
    whenToUse: 'Use this as the starting trigger for requisition processing and warehouse staging workflows.',
    example: 'Service Centre technician requests 4x flight navigation microcontrollers for an emergency avionics repair.',
    nextStep: 'Connect to Stock Availability Check to verify inventory before requesting approval or assigning parts.',
    connectionRequirements: 'Starting trigger: 0 incoming connections needed; 1 outgoing connection required.',
    configurationNeeded: 'Intake priority filter, auto-triage rules, and requisition channels.',
  },
  'stores-stock-arrival': {
    whatItDoes: 'Starts a workflow when an inbound shipment or freight delivery arrives at the Central Stores receiving dock.',
    whenToUse: 'Use this at the beginning of inventory intake, lot logging, and storage bin allocation workflows.',
    example: 'Carrier delivers 500 units of voltage regulators from an approved supplier.',
    nextStep: 'Connect to Inventory or Allocate Inventory to log lot numbers and assign warehouse storage bins.',
    connectionRequirements: 'Starting trigger: 0 incoming connections needed; 1 outgoing connection required.',
    configurationNeeded: 'Receiving dock location, batch barcode scanning requirements, and supplier ASN check.',
  },
  'stores-reorder-alert': {
    whatItDoes: 'Triggers automatically when warehouse stock drops below the configured safety threshold.',
    whenToUse: 'Use this to initiate automated parts reordering or alert warehouse managers to replenish bins.',
    example: 'Raw PCB substrates in Central Stores fall below 25 units, triggering a purchase requisition.',
    nextStep: 'Connect to Supervisor Approval Gate or Request Management to approve a replenishment purchase order.',
    connectionRequirements: 'Starting trigger: 0 incoming connections needed; 1 outgoing connection required.',
    configurationNeeded: 'Minimum threshold level, buffer percentage, and notification distribution list.',
  },
  'service-ticket-intake': {
    whatItDoes: 'Starts a maintenance workflow when an item is checked into the Service Centre for inspection or repair.',
    whenToUse: 'Use this as the initial trigger for all equipment maintenance, diagnosis, and rework lifecycles.',
    example: 'A customer brings in a malfunctioning cockpit flight display unit with intermittent power loss.',
    nextStep: 'Connect to Diagnostic Inspection & Triage to evaluate the fault and determine required repairs.',
    connectionRequirements: 'Starting trigger: 0 incoming connections needed; 1 outgoing connection required.',
    configurationNeeded: 'Intake category, default priority tier, and equipment warranty lookup.',
  },
  'service-diagnostics-fail': {
    whatItDoes: 'Triggers an escalation workflow when automated test equipment or bench diagnostics detect a hardware failure.',
    whenToUse: 'Use this when a unit fails bench tests (e.g., thermal imaging, oscilloscope, or JTAG boundary scan).',
    example: 'An avionics board fails high-voltage isolation testing during automated test bay screening.',
    nextStep: 'Connect to Supervisor Approval Gate or Assign Technician to triage the failed unit.',
    connectionRequirements: 'Starting trigger: 0 incoming connections needed; 1 outgoing connection required.',
    configurationNeeded: 'Test station identifier, failure severity threshold, and auto-quarantine flag.',
  },
  'dist-order-queued': {
    whatItDoes: 'Starts a distribution workflow when a verified customer order or site transfer is queued for fulfillment.',
    whenToUse: 'Use this as the entry trigger for pick, pack, and freight dispatch operations.',
    example: 'An order for 20 avionics displays is queued for shipment to the Pacific Rim regional hub.',
    nextStep: 'Connect to Pick & Pack Verification to confirm correct items and weights before generating a manifest.',
    connectionRequirements: 'Starting trigger: 0 incoming connections needed; 1 outgoing connection required.',
    configurationNeeded: 'Fulfillment queue SLA window, destination region, and shipping priority.',
  },
  'dist-carrier-window': {
    whatItDoes: 'Triggers when a freight carrier (e.g., FedEx Freight or DHL Aviation) arrives for scheduled cargo pick-up.',
    whenToUse: 'Use this to initiate final dock staging and carrier custody transfer handoffs.',
    example: 'DHL courier arrives for the daily 18:00 outbound international air cargo run.',
    nextStep: 'Connect to Carrier Custody Handoff to obtain driver signatures and close the shipment manifest.',
    connectionRequirements: 'Starting trigger: 0 incoming connections needed; 1 outgoing connection required.',
    configurationNeeded: 'Carrier code, freight dock bay number, and departure cutoff schedule.',
  },

  // -------------------------------------------------------------------------
  // OPERATIONS
  // -------------------------------------------------------------------------
  'stores-stock-check': {
    whatItDoes: 'Checks whether the requested parts or components are currently available in warehouse inventory.',
    whenToUse: 'Use this after a requisition intake to confirm sufficient stock exists before proceeding.',
    example: 'Checks whether Central Stores has 4x MCU-STM32H7 microcontrollers in bin Aisle 3, Shelf B2.',
    nextStep: 'Connect to Supervisor Approval Gate for authorization, or Conditional Router to handle backorders.',
    connectionRequirements: 'Requires 1 incoming connection from an upstream step; 1 outgoing connection to next step.',
    configurationNeeded: 'Part SKU lookup mode, backorder allowance, and warehouse location preference.',
  },
  'stores-allocate-inventory': {
    whatItDoes: 'Reserves and locks specific quantities of warehouse inventory so other requests cannot claim them.',
    whenToUse: 'Use this once stock availability and any required approvals are confirmed.',
    example: 'Locks 4 microcontrollers in inventory and marks them as allocated for Service Ticket #104.',
    nextStep: 'Connect to Dispatch to Service or Completed & Archived to finalize warehouse staging.',
    connectionRequirements: 'Requires 1 incoming connection from an upstream step; 1 outgoing connection to next step.',
    configurationNeeded: 'Allocation strategy (FIFO/LIFO), bin reservation timeout, and auto-deduct flag.',
  },
  'stores-dispatch-service': {
    whatItDoes: 'Stages allocated materials in the outbound depot bay and transfers custody to the Service Centre.',
    whenToUse: 'Use this when requested components need to be physically transported to repair benches.',
    example: 'Prepares an internal transit package with components for Avionics Repair Bench 2.',
    nextStep: 'Connect to Inter-Site Transit Connector or Completed & Archived to track arrival.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Destination service bench, courier transit mode, and custody transfer receipt requirement.',
  },
  'stores-quarantine-batch': {
    whatItDoes: 'Quarantines a batch or lot of materials to prevent them from being allocated or shipped.',
    whenToUse: 'Use this when incoming material fails inspection, or a manufacturer safety recall is issued.',
    example: 'Moves 50 power regulators with suspected solder bridging into the secure quarantine vault.',
    nextStep: 'Connect to Quarantine / Scrap outcome node or Supervisor Approval Gate for disposition review.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Quarantine reason code, vault location, and hold duration.',
  },
  'service-inspection': {
    whatItDoes: 'Records technician diagnostic inspection findings, fault classification, and component triage.',
    whenToUse: 'Use this immediately following a repair request intake to evaluate the equipment condition.',
    example: 'Technician opens an avionics unit, identifying microcracks in the solder joints of the BGA chip.',
    nextStep: 'Connect to Conditional Router to branch critical defects to supervisor approval vs standard bench rework.',
    connectionRequirements: 'Requires 1 incoming connection from an intake step; 1 outgoing connection to next step.',
    configurationNeeded: 'Inspection checklist type, visual inspection criteria, and defect severity classification.',
  },
  'service-assign-technician': {
    whatItDoes: 'Assigns a qualified technician to a repair ticket based on required skill certifications.',
    whenToUse: 'Use this after diagnostic triage when specialist skills (e.g. IPC-A-610 soldering) are required.',
    example: 'Assigns Senior Avionics Tech Marcus Vance to rework a multi-layer flight control board.',
    nextStep: 'Connect to Request Parts or PCB Repair & Inspection.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Skill matrix requirement, technician tier, and estimated rework hours.',
  },
  'service-request-parts': {
    whatItDoes: 'Submits an automated part request to Central Stores for components required to complete a repair.',
    whenToUse: 'Use this when an inspection reveals broken components that must be replaced from inventory.',
    example: 'Technician requests a replacement 5V ultra-low-noise regulator from Central Stores.',
    nextStep: 'Connect to Stock Availability Check or Inter-Site Transit Connector to coordinate delivery.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Required part SKU, bill of materials reference, and delivery urgency.',
  },
  'service-release-distribution': {
    whatItDoes: 'Releases a repaired and QA-certified piece of equipment to Distribution for return shipping.',
    whenToUse: 'Use this after QA inspection passes to transfer the completed unit to outbound logistics.',
    example: 'Hands over a certified, recalibrated flight navigation computer to Distribution Hub 07.',
    nextStep: 'Connect to Inter-Site Transit Connector or Dispatched to Carrier.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Destination logistics hub, return packaging specification, and calibration certificate attachment.',
  },
  'dist-pick-pack': {
    whatItDoes: 'Verifies physical items, scans serial numbers, and confirms packing box weights for shipping.',
    whenToUse: 'Use this after an order is queued to ensure zero discrepancies between order and package.',
    example: 'Warehouse operator scans barcodes on 40 avionics displays and prints serialized pack slips.',
    nextStep: 'Connect to Generate Manifest or Carrier Custody Handoff.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Barcode scan verification mode, tare weight tolerance, and packing slip template.',
  },
  'dist-generate-manifest': {
    whatItDoes: 'Generates electronic freight waybills, carrier manifests, and shipping labels.',
    whenToUse: 'Use this once packing is complete and the shipment is ready for carrier pickup.',
    example: 'Generates a DHL air cargo manifest with tracking number DHL-991204812 and customs declarations.',
    nextStep: 'Connect to Carrier Custody Handoff to hand packages over to the transport driver.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Freight carrier code, service level (Overnight/Ground), and hazardous materials flags.',
  },
  'dist-carrier-handoff': {
    whatItDoes: 'Records final handoff of cargo to the carrier, captures driver signature, and marks manifest closed.',
    whenToUse: 'Use this at the outbound loading dock when packages physically leave the facility.',
    example: 'Courier driver signs handheld scanner for 2 freight pallets of flight computers.',
    nextStep: 'Connect to Dispatched to Carrier to archive and complete the fulfillment workflow.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Driver badge scan, trailer seal number, and electronic proof of delivery.',
  },
  'dist-returns-processing': {
    whatItDoes: 'Handles customer returns, RMA warranty verification, and reverse logistics intake.',
    whenToUse: 'Use this when customer-returned items or surplus inventory arrive at the distribution dock.',
    example: 'Processes RMA-901 for 50 unopened power regulators returned by a regional contractor.',
    nextStep: 'Connect to Stock Availability Check to restock, or Diagnostic Inspection to test returned equipment.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'RMA authorization verification, restocking fee rules, and quarantine inspection requirement.',
  },
  'core-inventory': {
    whatItDoes: 'Manages centralized stock valuation, bin allocation, and safety buffer tracking.',
    whenToUse: 'Use this for enterprise inventory calculations and warehouse-wide stock operations.',
    example: 'Applies FIFO cost accounting rules across all avionics inventory bins.',
    nextStep: 'Connect to Material Assignment or Stock Availability Check.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Valuation method (FIFO/LIFO), safety buffer thresholds, and inventory tracking mode.',
  },
  'core-request-mgmt': {
    whatItDoes: 'Coordinates multi-item requisitions, customer tickets, and service demands.',
    whenToUse: 'Use this when handling complex, multi-line order requisitions across facilities.',
    example: 'Consolidates 5 parts requests into a single expedited warehouse requisition batch.',
    nextStep: 'Connect to Supervisor Approval Gate or Stock Availability Check.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'SLA priority classification, auto-assignment criteria, and escalation thresholds.',
  },
  'core-material-assignment': {
    whatItDoes: 'Represents assigning approved materials or parts to a request or operational work order.',
    whenToUse: 'Use this after stock availability and supervisor approvals have been confirmed.',
    example: 'Assigns 10x Mil-Spec harnesses to Distribution Order #8802.',
    nextStep: 'Connect to Consumption Tracking or Completed & Archived.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Allocation mode, reservation hold time, and stock deduction confirmation.',
  },
  'core-assignment-frontend': {
    whatItDoes: 'Provides an interactive operator terminal interface for warehouse workers to pick and stage parts.',
    whenToUse: 'Use this when an operator needs a handheld or tablet view to pick parts off warehouse shelves.',
    example: 'Displays guided pick path on warehouse tablet: Bin A3 -> Shelf B2 -> Scan SKU.',
    nextStep: 'Connect to Material Assignment or Pick & Pack Verification.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Terminal device profile, pick-to-light integration, and barcode scanner settings.',
  },
  'core-consumption': {
    whatItDoes: 'Tracks and logs material consumption, lot numbers, and serials as items are used or installed.',
    whenToUse: 'Use this during repair or packing to maintain full regulatory traceability of used components.',
    example: 'Records that MCU Serial #99214 was soldered onto Navigation Board Mk IV.',
    nextStep: 'Connect to QA Inspection Gate or Completed & Archived.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Lot/serial tracking policy, scrap scrap tolerance, and ERP sync schedule.',
  },
  'core-returns': {
    whatItDoes: 'Coordinates enterprise reverse logistics, RMA validation, and surplus equipment intake.',
    whenToUse: 'Use this to manage warranty returns, customer repairs, and depot restocks.',
    example: 'Validates customer return authorization and issues credit memo upon warehouse intake.',
    nextStep: 'Connect to Quarantine Batch or Stock Availability Check.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'RMA approval rules, restocking policy, and inspection routing.',
  },
  'core-pcb-repair': {
    whatItDoes: 'Guides high-precision PCB component soldering, pad rework, and trace repair operations.',
    whenToUse: 'Use this during electronics bench rework when components must be de-soldered and replaced.',
    example: 'Technician replaces blown surface-mount filter capacitor C14 with hot-air rework station.',
    nextStep: 'Connect to QA Inspection Gate or Return-to-Service validation.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'IPC soldering standard, temperature profile, and microscope inspection requirement.',
  },

  // -------------------------------------------------------------------------
  // DECISIONS / GATEWAYS
  // -------------------------------------------------------------------------
  'common-condition-branch': {
    whatItDoes: 'Directs workflow execution along different paths based on a configured condition or test result.',
    whenToUse: 'Use this whenever a workflow needs to split (e.g., Critical vs Standard, Pass vs Fail, In Stock vs Backordered).',
    example: 'If defect is CRITICAL, route to Supervisor Approval; if STANDARD, route straight to Soldering Bench.',
    nextStep: 'Connect the True handle (green) to the condition-met path; connect the False handle (red) to the fallback path.',
    connectionRequirements: 'Requires 1 incoming connection and BOTH True and False outgoing connections.',
    configurationNeeded: 'Condition rule expression (e.g. priority === "CRITICAL"), evaluation variable, and fallback path.',
  },
  'common-inter-site-transit': {
    whatItDoes: 'Represents inter-facility logistics transfer between Central Stores, Service Centre, and Distribution.',
    whenToUse: 'Use this whenever materials or serviced equipment physically move from one facility to another.',
    example: 'Transfers repaired navigation computer from Service Centre to Distribution for customer shipment.',
    nextStep: 'Connect to the receiving site\'s operational steps (e.g. Pick & Pack Verification).',
    connectionRequirements: 'Requires 1 incoming connection from origin site; 1 outgoing connection to target site.',
    configurationNeeded: 'Origin facility, destination facility, transit duration, and courier service tier.',
  },

  // -------------------------------------------------------------------------
  // APPROVALS
  // -------------------------------------------------------------------------
  'common-approval-gate': {
    whatItDoes: 'Pauses the workflow until an authorized supervisor or manager explicitly reviews and approves the step.',
    whenToUse: 'Use this for high-value requisitions, critical repairs, safety overrides, or budget authorizations.',
    example: 'Supervisor reviews a $4,500 replacement avionics display request before Central Stores can allocate it.',
    nextStep: 'Connect to Material Assignment or the approved action path.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection. Cannot act as a standalone entry trigger.',
    configurationNeeded: 'Approver role required (Admin / Operations Lead), escalation timeout (hours), and bypass rules.',
  },
  'core-approval': {
    whatItDoes: 'Multi-tier enterprise approval engine supporting sequential, parallel, and conditional sign-offs.',
    whenToUse: 'Use this when a workflow requires multiple sign-offs across different departments or cost thresholds.',
    example: 'Requisitions over $10,000 require both Operations Lead sign-off and Finance approval.',
    nextStep: 'Connect to Material Assignment or Purchase Order Generation.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Approval hierarchy tiers, quorum requirements, and automated reminder intervals.',
  },
  'service-qa-signoff': {
    whatItDoes: 'Formal quality assurance inspection sign-off certifying that an equipment repair meets flight-readiness standards.',
    whenToUse: 'Use this at the end of a service or rework operation before releasing equipment back into operation.',
    example: 'QA Inspector validates high-voltage isolation test results and stamps the calibration certificate.',
    nextStep: 'Connect to Release to Distribution or Completed & Archived.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'QA inspector certification token, inspection checklist reference, and re-test tolerance.',
  },

  // -------------------------------------------------------------------------
  // END / OUTCOMES
  // -------------------------------------------------------------------------
  'common-success-outcome': {
    whatItDoes: 'Marks the workflow as successfully completed, closes the ticket, and archives the operational record.',
    whenToUse: 'Use this as the final terminal step for completed workflows where all requirements have been met.',
    example: 'Material requisition is fulfilled, parts staged, and request ticket archived with full audit history.',
    nextStep: 'Terminal step: No outgoing connection required.',
    connectionRequirements: 'Requires 1 incoming connection; 0 outgoing connections.',
    configurationNeeded: 'Archive retention policy, completion notification recipients, and SLA metrics logging.',
  },
  'common-quarantine-outcome': {
    whatItDoes: 'Marks the workflow as terminated due to material quarantine, safety failure, or scrapped components.',
    whenToUse: 'Use this as the terminal step when equipment cannot be repaired or materials are rejected by QA.',
    example: 'Avionics board with burnt inner PCB copper layers is declared unrecoverable and sent for certified recycling.',
    nextStep: 'Terminal step: No outgoing connection required.',
    connectionRequirements: 'Requires 1 incoming connection; 0 outgoing connections.',
    configurationNeeded: 'Scrap disposition code, hazardous waste handling cert, and accounting write-off ledger.',
  },
  'common-dispatch-outcome': {
    whatItDoes: 'Marks the workflow as successfully dispatched into carrier transit with tracking confirmation.',
    whenToUse: 'Use this as the final step for fulfillment and freight logistics workflows.',
    example: 'Package handed over to DHL Aviation, tracking activated, and customer shipping notice sent.',
    nextStep: 'Terminal step: No outgoing connection required.',
    connectionRequirements: 'Requires 1 incoming connection; 0 outgoing connections.',
    configurationNeeded: 'Carrier tracking integration, delivery milestone notifications, and customer receipt trigger.',
  },

  // -------------------------------------------------------------------------
  // SYSTEM INTEGRATIONS
  // -------------------------------------------------------------------------
  'core-auth-rbac': {
    whatItDoes: 'Validates operator identity, security credentials, and role-based access rights across facilities.',
    whenToUse: 'Use this to secure operations and verify operator authorization before critical gates.',
    example: 'Verifies technician has IPC soldering certification before permitting rework access.',
    nextStep: 'Connect to User Management or operational action steps.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Identity provider (OIDC/SAML), session timeout, and MFA requirement.',
  },
  'core-user-mgmt': {
    whatItDoes: 'Manages user accounts, facility badges, department assignments, and operational permissions.',
    whenToUse: 'Use this for onboarding staff, managing access badges, and configuring cross-facility work orders.',
    example: 'Assigns Central Stores staff badge to Warehouse Depot Bay 01.',
    nextStep: 'Connect to Authentication & RBAC or Dashboard Shell.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Default facility role, cross-site work order permissions, and training matrix.',
  },
  'core-dashboard-shell': {
    whatItDoes: 'Provides the responsive enterprise application layout, navigation bar, and form wrappers.',
    whenToUse: 'Use this as the architectural shell for rendering operator forms and dashboard views.',
    example: 'Renders the Central Stores inventory interface with dark/light theme support.',
    nextStep: 'Connect to Analytics Dashboard or operational dashboards.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Default landing view, theme preference, and navigation tab visibility.',
  },
  'core-analytics-dashboard': {
    whatItDoes: 'Aggregates real-time operational metrics, throughput indicators, and bottleneck alerts.',
    whenToUse: 'Use this to visualize workflow performance, cycle times, and queue depths across all three sites.',
    example: 'Displays live charts of daily repair turnaround times and warehouse requisition fulfillment rates.',
    nextStep: 'Connect to Reports/Excel Integration or operational dashboards.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Telemetry refresh interval, SLA breach thresholds, and metric aggregation period.',
  },
  'core-reports-excel': {
    whatItDoes: 'Generates regulatory compliance reports, inventory audits, and Excel data exports.',
    whenToUse: 'Use this when managers need downloadable spreadsheets or audit trails for compliance inspections.',
    example: 'Exports monthly FAA component traceability and lot consumption logs to Excel spreadsheet.',
    nextStep: 'Connect to Completed & Archived or Analytics Dashboard.',
    connectionRequirements: 'Requires 1 incoming connection; 1 outgoing connection.',
    configurationNeeded: 'Report template format (XLSX/CSV/PDF), automated schedule, and email recipients.',
  },
}
