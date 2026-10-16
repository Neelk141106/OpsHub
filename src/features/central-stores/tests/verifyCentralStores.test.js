/**
 * OpsHub Central Stores — Comprehensive Feature Verification Suite
 * 
 * Verifies all business rules, edge cases, KPI calculations, form validations,
 * and request approval/fulfilment lifecycles.
 */

import { useCentralStoresStore } from '../store/useCentralStoresStore.js'
import { validateItemForm, validateRequestForm } from '../utils/validation.js'
import {
  exportInventoryToCsv,
  exportRequestsToCsv,
  exportMovementsToCsv,
  parseInventoryCsv,
} from '../utils/csvExport.js'

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`)
    throw new Error(message)
  }
  console.log(`  ✓ ${message}`)
}

console.log('=== OpsHub Central Stores Feature Verification ===\n')

// ---------------------------------------------------------------------------
// 1. Initial State & Baseline KPIs
// ---------------------------------------------------------------------------
console.log('1. Testing Initial State & KPI Calculations:')
const store = useCentralStoresStore.getState()
store.resetToMockData()

const initialKpis = store.getKpis()
console.log('  Initial KPIs:', initialKpis)

assert(initialKpis.totalItems === 10, 'Initial items count is 10')
assert(initialKpis.lowStockCount === 3, 'Initial low-stock count is 3 (item-103: 6<=12, item-104: 3<=8, item-107: 2<=10)')
assert(initialKpis.outOfStockCount === 2, 'Initial out-of-stock count is 2 (item-105: 0, item-108: 0)')
assert(initialKpis.pendingRequestsCount === 3, 'Initial pending requests count is 3 (REQ-001, REQ-002, REQ-003)')
assert(initialKpis.totalValuation > 10000, `Stock valuation calculated properly ($${initialKpis.totalValuation.toFixed(2)})`)

// ---------------------------------------------------------------------------
// 2. Search & Filter Queries
// ---------------------------------------------------------------------------
console.log('\n2. Testing Search and Filtering:')

// Search by item name
store.setSearchQuery('Encoder')
let filtered = store.getFilteredItems()
assert(filtered.length === 1 && filtered[0].sku === 'CS-ENC-1024', 'Search by name "Encoder" finds 1 matching item')

// Search by SKU
store.setSearchQuery('CS-ACT')
filtered = store.getFilteredItems()
assert(filtered.length === 1 && filtered[0].sku === 'CS-ACT-0500', 'Search by SKU "CS-ACT" finds 1 matching item')

// Clear search and filter by category
store.setSearchQuery('')
store.setSelectedCategory('Electrical & Sensors')
filtered = store.getFilteredItems()
assert(filtered.length === 3, 'Category filter "Electrical & Sensors" returns 3 items')

// Filter by stock status: out_of_stock
store.setSelectedCategory('All Categories')
store.setSelectedStatus('out_of_stock')
filtered = store.getFilteredItems()
assert(filtered.length === 2, 'Status filter "out_of_stock" returns 2 items')

// Clear filters
store.clearFilters()
assert(store.getFilteredItems().length === 10, 'clearFilters resets to all 10 items')

// ---------------------------------------------------------------------------
// 3. Add Item Form Validation & Unique SKU Enforcement
// ---------------------------------------------------------------------------
console.log('\n3. Testing Add Item Form Validation:')

// Required fields missing
let itemVal = validateItemForm({}, store.items)
assert(!itemVal.isValid, 'Empty form is rejected')
assert(Boolean(itemVal.errors.name), 'Name required error triggered')
assert(Boolean(itemVal.errors.sku), 'SKU required error triggered')
assert(Boolean(itemVal.errors.category), 'Category required error triggered')
assert(Boolean(itemVal.errors.quantity), 'Quantity required error triggered')
assert(Boolean(itemVal.errors.minStock), 'Min stock required error triggered')
assert(Boolean(itemVal.errors.unitPrice), 'Unit price required error triggered')

// Duplicate SKU rejection (case-insensitive)
itemVal = validateItemForm({
  name: 'Duplicate Sensor Test',
  sku: 'cs-enc-1024', // duplicate of existing CS-ENC-1024
  category: 'Electrical & Sensors',
  quantity: '5',
  minStock: '2',
  unitPrice: '50.00',
}, store.items)
assert(!itemVal.isValid, 'Duplicate SKU is rejected')
assert(itemVal.errors.sku.includes('already assigned'), 'Duplicate SKU error message displayed')

// Negative quantity and price
itemVal = validateItemForm({
  name: 'Negative Check Part',
  sku: 'CS-NEG-0001',
  category: 'Fasteners & Hardware',
  quantity: '-5',
  minStock: '-2',
  unitPrice: '-10.50',
}, store.items)
assert(!itemVal.isValid, 'Negative values are rejected')

// Valid item addition
const addResult = store.addItem({
  name: 'Precision Harmonic Drive Gearbox',
  sku: 'CS-HAR-9000',
  category: 'Mechanical & Structural',
  quantity: '15',
  minStock: '5',
  unitPrice: '450.00',
  location: 'Bay 01-E2',
})
assert(addResult.success === true, 'Valid item added successfully')

const updatedKpis = store.getKpis()
assert(updatedKpis.totalItems === 11, 'Total items KPI updated to 11')
assert(updatedKpis.totalValuation === initialKpis.totalValuation + (15 * 450), 'Total valuation KPI updated with added stock')

// ---------------------------------------------------------------------------
// 4. Material Request Form Validation & Creation
// ---------------------------------------------------------------------------
console.log('\n4. Testing Material Request Form Validation:')

// Invalid request
let reqVal = validateRequestForm({}, store.items)
assert(!reqVal.isValid, 'Empty request form rejected')

// Invalid site
reqVal = validateRequestForm({
  itemId: 'item-101',
  requestingSite: 'Unknown Depot',
  requester: 'John Doe',
  requestedQuantity: '2',
}, store.items)
assert(!reqVal.isValid && Boolean(reqVal.errors.requestingSite), 'Invalid requesting site rejected')

// Zero or negative quantity
reqVal = validateRequestForm({
  itemId: 'item-101',
  requestingSite: 'Service Centre',
  requester: 'John Doe',
  requestedQuantity: '0',
}, store.items)
assert(!reqVal.isValid && Boolean(reqVal.errors.requestedQuantity), 'Zero quantity rejected')

// Valid request submission
const initialPendingCount = store.getKpis().pendingRequestsCount
const submitResult = store.submitMaterialRequest({
  itemId: 'item-101', // Optical Rotary Encoder, currently 42 in stock
  requestingSite: 'Service Centre',
  requester: 'Automated Test Runner',
  requestedQuantity: '5',
  notes: 'Testing pending queue increment',
})
assert(submitResult.success === true, 'Valid material request submitted')
assert(submitResult.request.status === 'Pending', 'New request status initialized to "Pending"')
assert(store.getKpis().pendingRequestsCount === initialPendingCount + 1, 'Pending requests KPI incremented by 1')

// Verify inventory NOT modified upon request creation
const item101Before = store.items.find(i => i.id === 'item-101')
assert(item101Before.quantity === 42, 'Inventory stock unchanged upon request creation (42 units)')

// ---------------------------------------------------------------------------
// 5. Request Lifecycle Rules: Approval, Rejection & Insufficient Stock Handling
// ---------------------------------------------------------------------------
console.log('\n5. Testing Approval, Rejection, and Fulfilment Rules:')

const testRequestId = submitResult.request.id

// RULE: Approval alone must NOT deduct stock
const approveResult = store.approveRequest(testRequestId)
assert(approveResult.success === true, 'Request approved successfully')

const currentStore = useCentralStoresStore.getState()
const reqAfterApproval = currentStore.requests.find(r => r.id === testRequestId)
assert(reqAfterApproval.status === 'Approved', 'Request status transitioned to "Approved"')

const item101AfterApproval = currentStore.items.find(i => i.id === 'item-101')
assert(item101AfterApproval.quantity === 42, 'RULE VERIFIED: Approval alone DOES NOT deduct stock (still 42 units)')

// RULE: Rejection requires a reason and does NOT change inventory
const rejectResult = currentStore.rejectRequest('REQ-2026-002', 'Defective tooling issue on destination cell')
assert(rejectResult.success === true, 'Request REQ-2026-002 rejected successfully with reason')
const storeAfterReject = useCentralStoresStore.getState()
const req002 = storeAfterReject.requests.find(r => r.id === 'REQ-2026-002')
assert(req002.status === 'Rejected', 'Status is now "Rejected"')
assert(req002.rejectionReason.includes('Defective tooling'), 'Rejection reason stored')

const item104 = storeAfterReject.items.find(i => i.id === 'item-104')
assert(item104.quantity === 3, 'RULE VERIFIED: Rejection does not modify stock (still 3 units)')

// RULE: Insufficient Stock Check before Fulfilment
// REQ-2026-003 requested 3 units of item-105 (DIN Rail Power Supply), which currently has 0 stock!
storeAfterReject.approveRequest('REQ-2026-003') // approve allocation intent
const fulfillFailResult = useCentralStoresStore.getState().fulfillRequest('REQ-2026-003')
assert(fulfillFailResult.success === false, 'RULE VERIFIED: Fulfilment blocked when stock is insufficient')
assert(fulfillFailResult.reason === 'insufficient_stock', 'Reason reported as "insufficient_stock"')
assert(useCentralStoresStore.getState().items.find(i => i.id === 'item-105').quantity === 0, 'No negative inventory created (remains 0)')

// RULE: Fulfilment succeeds when stock is available and deducts inventory
const fulfillSuccessResult = useCentralStoresStore.getState().fulfillRequest(testRequestId)
assert(fulfillSuccessResult.success === true, 'Fulfilment succeeds for request with sufficient stock')
assert(fulfillSuccessResult.remainingStock === 37, 'Remaining stock correctly deducted: 42 - 5 = 37')

const item101Final = useCentralStoresStore.getState().items.find(i => i.id === 'item-101')
assert(item101Final.quantity === 37, 'RULE VERIFIED: Stock deducted only upon successful fulfilment (37 units)')

// RULE: Duplicate Fulfilment is prevented
const duplicateFulfillResult = useCentralStoresStore.getState().fulfillRequest(testRequestId)
assert(duplicateFulfillResult.success === false, 'RULE VERIFIED: Duplicate fulfilment is blocked')
assert(duplicateFulfillResult.message.includes('already been fulfilled'), 'Duplicate fulfilment error message returned')

// ---------------------------------------------------------------------------
// 6. Interactive Column Sorting & Stock Replenishment (Polish Features)
// ---------------------------------------------------------------------------
console.log('\n6. Testing Interactive Sorting & Stock Replenishment:')

// Test Column Sorting
useCentralStoresStore.getState().setSorting('unitPrice') // asc
let sortedItems = useCentralStoresStore.getState().getFilteredItems()
assert(sortedItems[0].unitPrice <= sortedItems[1].unitPrice, 'Sort by unitPrice ascending works')

useCentralStoresStore.getState().setSorting('unitPrice') // toggle to desc
sortedItems = useCentralStoresStore.getState().getFilteredItems()
assert(sortedItems[0].unitPrice >= sortedItems[1].unitPrice, 'Sort by unitPrice descending works')

// Test Stock Replenishment (Restock)
const item105Before = useCentralStoresStore.getState().items.find(i => i.id === 'item-105')
assert(item105Before.quantity === 0, 'Item-105 is initially out of stock (0 units)')

const restockResult = useCentralStoresStore.getState().restockItem('item-105', 20)
assert(restockResult.success === true, 'Restock operation succeeded')
assert(restockResult.newQuantity === 20, 'Item-105 replenished with +20 units')

const item105After = useCentralStoresStore.getState().items.find(i => i.id === 'item-105')
assert(item105After.quantity === 20, 'Item-105 now has 20 units in depot')

// Verify that out-of-stock count decreased
const kpisAfterRestock = useCentralStoresStore.getState().getKpis()
assert(kpisAfterRestock.outOfStockCount === 1, 'Out of stock count decreased from 2 to 1 (item-108 remains 0)')

// Test Preselected Item in New Request Modal
useCentralStoresStore.getState().openNewRequestWithItem('item-102')
assert(useCentralStoresStore.getState().isNewRequestModalOpen === true, 'New request modal opened via action')
assert(useCentralStoresStore.getState().preselectedItemId === 'item-102', 'Item-102 preselected for requisition')

// ---------------------------------------------------------------------------
// 7. Stock Integrity & Movement History Audit Trail
// ---------------------------------------------------------------------------
console.log('\n7. Testing Stock Integrity & Movement Audit Trail:')

const initialMovements = useCentralStoresStore.getState().movements
assert(initialMovements.length >= 4, 'Initial seeded movements present')

// Verify that a previous restock or fulfilment logged a movement record
const latestMovement = useCentralStoresStore.getState().movements[0]
assert(Boolean(latestMovement.id), 'Movement record contains a unique ID')
assert(Boolean(latestMovement.timestamp), 'Movement record contains ISO timestamp')
assert(typeof latestMovement.quantityChange === 'number', 'Quantity delta recorded as number')
assert(typeof latestMovement.resultingBalance === 'number', 'Resulting balance recorded as number')

// Verify that restock logs an INBOUND_RESTOCK movement
const preRestockMovementsCount = useCentralStoresStore.getState().movements.length
useCentralStoresStore.getState().restockItem('item-101', 10)
const postRestockMovements = useCentralStoresStore.getState().movements
assert(postRestockMovements.length === preRestockMovementsCount + 1, 'Restock operation created a new movement record')
assert(postRestockMovements[0].type === 'INBOUND_RESTOCK', 'Movement type is INBOUND_RESTOCK')
assert(postRestockMovements[0].quantityChange === 10, 'Quantity delta is +10')
assert(postRestockMovements[0].resultingBalance === 47, 'Resulting balance correctly calculated (37 + 10 = 47)')

// Verify that filtered movements query works
useCentralStoresStore.getState().setMovementFilterType('INBOUND_RESTOCK')
const inboundOnly = useCentralStoresStore.getState().getFilteredMovements()
assert(inboundOnly.every(m => m.type === 'INBOUND_RESTOCK'), 'Filter by INBOUND_RESTOCK returns only inbound movements')

useCentralStoresStore.getState().clearMovementFilters()
assert(useCentralStoresStore.getState().getFilteredMovements().length === postRestockMovements.length, 'clearMovementFilters resets to all movements')

// ---------------------------------------------------------------------------
// 8. Requisition Search & Originating Site Filtering
// ---------------------------------------------------------------------------
console.log('\n8. Testing Material Request Search & Site Filtering:')

// Filter by Requesting Site: Service Centre
useCentralStoresStore.getState().setRequestSiteFilter('Service Centre')
let siteFiltered = useCentralStoresStore.getState().getFilteredRequests()
assert(siteFiltered.every(r => r.requestingSite === 'Service Centre'), 'Site filter "Service Centre" returns only Service Centre requests')

// Filter by Requesting Site: Distribution
useCentralStoresStore.getState().setRequestSiteFilter('Distribution')
siteFiltered = useCentralStoresStore.getState().getFilteredRequests()
assert(siteFiltered.every(r => r.requestingSite === 'Distribution'), 'Site filter "Distribution" returns only Distribution requests')

// Search by Requester name
useCentralStoresStore.getState().setRequestSiteFilter('All Sites')
useCentralStoresStore.getState().setRequestSearchQuery('Marcus')
let searchFiltered = useCentralStoresStore.getState().getFilteredRequests()
assert(searchFiltered.length === 1 && searchFiltered[0].requester.includes('Marcus'), 'Search by requester "Marcus" matches REQ-2026-001')

// Search by SKU
useCentralStoresStore.getState().setRequestSearchQuery('CS-PWR')
searchFiltered = useCentralStoresStore.getState().getFilteredRequests()
assert(searchFiltered.length === 1 && searchFiltered[0].itemSku === 'CS-PWR-2410', 'Search by SKU "CS-PWR" finds matching requisition')

useCentralStoresStore.getState().clearRequestFilters()
assert(useCentralStoresStore.getState().getFilteredRequests().length === useCentralStoresStore.getState().requests.length, 'clearRequestFilters resets to all requests')

// ---------------------------------------------------------------------------
// 9. CSV Export Formatting & Batch Import Validation
// ---------------------------------------------------------------------------
console.log('\n9. Testing CSV Export & Batch Import:')

// Test CSV Export Generators
const invCsv = exportInventoryToCsv(useCentralStoresStore.getState().items)
assert(invCsv.includes('Item ID,Item Name,SKU,Category'), 'Inventory CSV includes standard column headers')
assert(invCsv.includes('CS-ENC-1024'), 'Inventory CSV contains catalog SKU data')

const reqCsv = exportRequestsToCsv(useCentralStoresStore.getState().requests)
assert(reqCsv.includes('Request ID,Status,Item Name'), 'Requests CSV includes standard column headers')
assert(reqCsv.includes('REQ-2026-001'), 'Requests CSV contains requisition ID')

const movCsv = exportMovementsToCsv(useCentralStoresStore.getState().movements)
assert(movCsv.includes('Movement ID,Timestamp,Item Name,SKU,Movement Type'), 'Movements CSV includes audit column headers')

// Test CSV Parsing
const rawCsvSample = `Name,SKU,Category,Quantity,MinStock,UnitPrice,Location,LeadTimeDays
"Digital Caliper 150mm","CS-CAL-0150","Fasteners & Hardware",15,5,55.00,"Bay 06-B2",4
"Duplicate SKU Sensor","CS-ENC-1024","Electrical & Sensors",10,5,100.00,"Bay 01-A1",7
"Duplicate Batch Item 1","CS-BAT-0001","Assemblies & Modules",5,2,20.00,"Bay 02-A1",3
"Duplicate Batch Item 2","CS-BAT-0001","Assemblies & Modules",5,2,20.00,"Bay 02-A1",3
"Invalid Qty Part","CS-INV-0099","Mechanical & Structural",-10,5,25.00,"Bay 01-B1",5`

const parseResult = parseInventoryCsv(rawCsvSample)
assert(parseResult.success === true, 'CSV parsed successfully')
assert(parseResult.records.length === 5, '5 records parsed from CSV')

// Test Batch Import with Duplicate and Error Prevention
const preImportItemCount = useCentralStoresStore.getState().items.length
const importResult = useCentralStoresStore.getState().importInventoryItems(parseResult.records)
assert(importResult.success === true, 'Batch import processed')
assert(importResult.importedCount === 2, 'Exactly 2 valid items imported (CS-CAL-0150 and first CS-BAT-0001)')
assert(importResult.skippedCount === 3, 'Exactly 3 invalid/duplicate items skipped')

// Check that catalog item count increased by exactly 2
const postImportItemCount = useCentralStoresStore.getState().items.length
assert(postImportItemCount === preImportItemCount + 2, 'Catalog items increased by 2')

// Verify newly imported item exists in state
const importedItem = useCentralStoresStore.getState().items.find(i => i.sku === 'CS-CAL-0150')
assert(Boolean(importedItem) && importedItem.name === 'Digital Caliper 150mm', 'Imported SKU CS-CAL-0150 active in store')

// ---------------------------------------------------------------------------
// 10. Testing Edit / Update Item Invariants
// ---------------------------------------------------------------------------
console.log('\n10. Testing Edit / Update Item Invariants:')

// Try to update with empty name
const emptyUpdate = useCentralStoresStore.getState().updateItem('item-101', {
  name: '',
  sku: 'CS-ENC-1024',
  category: 'Electrical & Sensors',
  quantity: '47',
  minStock: '10',
  unitPrice: '120.00',
})
assert(emptyUpdate.success === false, 'Empty item name update is rejected')
assert(Boolean(emptyUpdate.errors.name), 'Validation error for name returned')

// Try to update with duplicate SKU of another item
const duplicateSkuUpdate = useCentralStoresStore.getState().updateItem('item-101', {
  name: 'Optical Rotary Encoder 1024-PPR',
  sku: 'CS-MOT-0023', // Belongs to item-102
  category: 'Electrical & Sensors',
  quantity: '47',
  minStock: '10',
  unitPrice: '120.00',
})
assert(duplicateSkuUpdate.success === false, 'Duplicate SKU update is rejected')
assert(Boolean(duplicateSkuUpdate.errors.sku), 'Duplicate SKU error message returned')

// Valid update (updating item-101 price and location, keeping same SKU)
const validUpdate = useCentralStoresStore.getState().updateItem('item-101', {
  name: 'Optical Rotary Encoder 1024-PPR (Rev B)',
  sku: 'CS-ENC-1024',
  category: 'Electrical & Sensors',
  quantity: '47',
  minStock: '10',
  unitPrice: '125.00', // Price increased by $5
  location: 'Bay 01-A2',
})
assert(validUpdate.success === true, 'Valid item update succeeds')
assert(validUpdate.item.name === 'Optical Rotary Encoder 1024-PPR (Rev B)', 'Updated name saved')
assert(validUpdate.item.unitPrice === 125, 'Updated unit price saved')
assert(validUpdate.item.location === 'Bay 01-A2', 'Updated location saved')

// Verify editingItem modal state helper
useCentralStoresStore.getState().setEditingItem(validUpdate.item)
assert(useCentralStoresStore.getState().editingItem !== null, 'setEditingItem sets editingItem state')
useCentralStoresStore.getState().setEditingItem(null)
assert(useCentralStoresStore.getState().editingItem === null, 'setEditingItem(null) clears editing state')

console.log('\n✅ ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!')


