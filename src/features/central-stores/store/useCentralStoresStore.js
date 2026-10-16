import { create } from 'zustand'
import {
  INITIAL_INVENTORY_ITEMS,
  INITIAL_MATERIAL_REQUESTS,
  INITIAL_STOCK_MOVEMENTS,
} from '../data/mockCentralStoresData.js'
import { calculateValuation, getStockStatus } from '../utils/formatters.js'
import { validateItemForm, validateRequestForm } from '../utils/validation.js'

/**
 * Isolated Zustand Store for Central Stores Dashboard.
 * 
 * Strictly manages in-memory client state for inventory, material requests,
 * filters, and request approval/fulfilment lifecycles.
 */
export const useCentralStoresStore = create((set, get) => ({
  // Core State
  items: INITIAL_INVENTORY_ITEMS,
  requests: INITIAL_MATERIAL_REQUESTS,
  movements: INITIAL_STOCK_MOVEMENTS,

  // Table Filters, Search & Sorting
  searchQuery: '',
  selectedCategory: 'All Categories',
  selectedStatus: 'all', // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  sortColumn: 'name', // 'name' | 'sku' | 'quantity' | 'minStock' | 'unitPrice' | 'totalValuation'
  sortDirection: 'asc', // 'asc' | 'desc'

  // Requisitions Filters & Search
  requestSearchQuery: '',
  requestSiteFilter: 'All Sites',

  // Stock Movement History Filters & Search
  movementSearchQuery: '',
  movementFilterType: 'All Types',

  // Navigation / View State
  activeView: 'inventory', // 'inventory' | 'requests' | 'movements'

  // Modals & Drawers
  isAddItemModalOpen: false,
  isNewRequestModalOpen: false,
  isImportModalOpen: false,
  editingItem: null, // Item currently being edited via modal
  preselectedItemId: null, // Pre-selected item when opening New Request from table row
  restockingItem: null, // Item currently being restocked via modal
  rejectingRequestId: null, // ID of request currently being rejected

  // Toast / Status Notifications
  notification: null, // { id, type: 'success' | 'error' | 'warning' | 'info', title, message }

  // Dark mode preview toggle (local to feature for demonstration without mutating global state)
  isDarkMode: false,

  // ---------------------------------------------------------------------------
  // Selectors / Computed Queries
  // ---------------------------------------------------------------------------
  getKpis: () => {
    const { items, requests } = get()
    const totalItems = items.length

    let lowStockCount = 0
    let outOfStockCount = 0

    items.forEach((item) => {
      const status = getStockStatus(item.quantity, item.minStock)
      if (status.key === 'low_stock') lowStockCount += 1
      if (status.key === 'out_of_stock') outOfStockCount += 1
    })

    const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length
    const totalValuation = calculateValuation(items)

    return {
      totalItems,
      lowStockCount,
      outOfStockCount,
      pendingRequestsCount,
      totalValuation,
    }
  },

  getFilteredItems: () => {
    const {
      items,
      searchQuery,
      selectedCategory,
      selectedStatus,
      sortColumn,
      sortDirection,
    } = get()
    const query = searchQuery.trim().toLowerCase()

    const filtered = items.filter((item) => {
      // Search matching (by name or SKU)
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query)

      // Category matching
      const matchesCategory =
        selectedCategory === 'All Categories' ||
        item.category === selectedCategory

      // Stock status matching
      const status = getStockStatus(item.quantity, item.minStock)
      const matchesStatus =
        selectedStatus === 'all' ||
        status.key === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })

    if (!sortColumn) return filtered

    return [...filtered].sort((a, b) => {
      let aVal = a[sortColumn]
      let bVal = b[sortColumn]

      if (sortColumn === 'totalValuation') {
        aVal = a.quantity * a.unitPrice
        bVal = b.quantity * b.unitPrice
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  },

  getFilteredRequests: () => {
    const { requests, requestSearchQuery, requestSiteFilter } = get()
    const query = requestSearchQuery.trim().toLowerCase()

    return requests.filter((req) => {
      const matchesSearch =
        !query ||
        req.id.toLowerCase().includes(query) ||
        req.itemName.toLowerCase().includes(query) ||
        req.itemSku.toLowerCase().includes(query) ||
        req.requester.toLowerCase().includes(query)

      const matchesSite =
        requestSiteFilter === 'All Sites' || req.requestingSite === requestSiteFilter

      return matchesSearch && matchesSite
    })
  },

  getFilteredMovements: () => {
    const { movements, movementSearchQuery, movementFilterType } = get()
    const query = movementSearchQuery.trim().toLowerCase()

    return movements.filter((mov) => {
      const matchesSearch =
        !query ||
        mov.id.toLowerCase().includes(query) ||
        mov.itemName.toLowerCase().includes(query) ||
        mov.itemSku.toLowerCase().includes(query) ||
        (mov.reference && mov.reference.toLowerCase().includes(query)) ||
        (mov.operator && mov.operator.toLowerCase().includes(query))

      const matchesType =
        movementFilterType === 'All Types' || mov.type === movementFilterType

      return matchesSearch && matchesType
    })
  },

  // ---------------------------------------------------------------------------
  // Filter & Navigation Actions
  // ---------------------------------------------------------------------------
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
  setRequestSearchQuery: (requestSearchQuery) => set({ requestSearchQuery }),
  setRequestSiteFilter: (requestSiteFilter) => set({ requestSiteFilter }),
  setMovementSearchQuery: (movementSearchQuery) => set({ movementSearchQuery }),
  setMovementFilterType: (movementFilterType) => set({ movementFilterType }),
  setActiveView: (activeView) => set({ activeView }),

  setSorting: (column) => {
    set((state) => {
      if (state.sortColumn === column) {
        return {
          sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
        }
      }
      return {
        sortColumn: column,
        sortDirection: 'asc',
      }
    })
  },

  clearFilters: () =>
    set({
      searchQuery: '',
      selectedCategory: 'All Categories',
      selectedStatus: 'all',
      sortColumn: 'name',
      sortDirection: 'asc',
    }),

  clearRequestFilters: () =>
    set({
      requestSearchQuery: '',
      requestSiteFilter: 'All Sites',
    }),

  clearMovementFilters: () =>
    set({
      movementSearchQuery: '',
      movementFilterType: 'All Types',
    }),

  // ---------------------------------------------------------------------------
  // Modal Actions
  // ---------------------------------------------------------------------------
  setAddItemModalOpen: (isAddItemModalOpen) => set({ isAddItemModalOpen }),
  setNewRequestModalOpen: (isNewRequestModalOpen) =>
    set({ isNewRequestModalOpen, preselectedItemId: null }),
  setImportModalOpen: (isImportModalOpen) => set({ isImportModalOpen }),
  setEditingItem: (editingItem) => set({ editingItem }),
  openNewRequestWithItem: (itemId) =>
    set({ isNewRequestModalOpen: true, preselectedItemId: itemId }),
  setRestockingItem: (restockingItem) => set({ restockingItem }),
  setRejectingRequestId: (rejectingRequestId) => set({ rejectingRequestId }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  // ---------------------------------------------------------------------------
  // Notification Management
  // ---------------------------------------------------------------------------
  setNotification: (notif) => {
    const id = Date.now().toString()
    set({ notification: notif ? { ...notif, id } : null })
  },
  clearNotification: () => set({ notification: null }),

  // ---------------------------------------------------------------------------
  // Feature Action: Add Item
  // ---------------------------------------------------------------------------
  addItem: (formValues) => {
    const { items } = get()
    const validation = validateItemForm(formValues, items)

    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    const newItem = {
      id: `item-${Date.now()}`,
      name: formValues.name.trim(),
      sku: formValues.sku.trim().toUpperCase(),
      category: formValues.category,
      quantity: Number(formValues.quantity),
      minStock: Number(formValues.minStock),
      unitPrice: Number(formValues.unitPrice),
      location: formValues.location ? formValues.location.trim() : 'Unassigned',
      leadTimeDays: formValues.leadTimeDays ? Number(formValues.leadTimeDays) : 7,
    }

    const newMovement = {
      id: `MOV-${Date.now()}`,
      itemId: newItem.id,
      itemName: newItem.name,
      itemSku: newItem.sku,
      type: 'ITEM_CREATED',
      quantityChange: newItem.quantity,
      resultingBalance: newItem.quantity,
      reference: 'Catalog Registration',
      site: newItem.location || 'Central Stores Depot',
      operator: 'Aditi (Central Stores Lead)',
      timestamp: new Date().toISOString(),
      notes: `Registered new catalog item in ${newItem.category}`,
    }

    set((state) => ({
      items: [newItem, ...state.items],
      movements: [newMovement, ...state.movements],
      isAddItemModalOpen: false,
      notification: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Item Added Successfully',
        message: `"${newItem.name}" (${newItem.sku}) is now active in Central Stores inventory.`,
      },
    }))

    return { success: true, item: newItem }
  },

  // ---------------------------------------------------------------------------
  // Feature Action: Edit / Update Item
  // ---------------------------------------------------------------------------
  updateItem: (itemId, formValues) => {
    const { items } = get()
    const targetItem = items.find((i) => i.id === itemId)
    if (!targetItem) {
      return { success: false, message: 'Item not found in inventory.' }
    }

    const validation = validateItemForm(formValues, items, itemId)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    const updatedQty = Number(formValues.quantity)
    const qtyDelta = updatedQty - targetItem.quantity

    const updatedItem = {
      ...targetItem,
      name: formValues.name.trim(),
      sku: formValues.sku.trim().toUpperCase(),
      category: formValues.category,
      quantity: updatedQty,
      minStock: Number(formValues.minStock),
      unitPrice: Number(formValues.unitPrice),
      location: formValues.location ? formValues.location.trim() : targetItem.location,
      leadTimeDays: formValues.leadTimeDays ? Number(formValues.leadTimeDays) : targetItem.leadTimeDays,
    }

    let movementsToAdd = []
    if (qtyDelta !== 0) {
      const movement = {
        id: `MOV-ADJ-${Date.now()}`,
        itemId: updatedItem.id,
        itemName: updatedItem.name,
        itemSku: updatedItem.sku,
        type: qtyDelta > 0 ? 'INBOUND_RESTOCK' : 'QUANTITY_ADJUSTED',
        quantityChange: qtyDelta,
        resultingBalance: updatedItem.quantity,
        reference: 'Inventory Adjustment',
        site: updatedItem.location || 'Central Stores Depot',
        operator: 'Aditi (Central Stores Lead)',
        timestamp: new Date().toISOString(),
        notes: `Manual stock level adjustment (${qtyDelta > 0 ? '+' : ''}${qtyDelta} units)`,
      }
      movementsToAdd = [movement]
    }

    set((state) => ({
      items: state.items.map((i) => (i.id === itemId ? updatedItem : i)),
      movements: [...movementsToAdd, ...state.movements],
      editingItem: null,
      notification: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Item Updated Successfully',
        message: `Changes to "${updatedItem.name}" (${updatedItem.sku}) saved successfully.`,
      },
    }))

    return { success: true, item: updatedItem }
  },

  // ---------------------------------------------------------------------------
  // Feature Action: Submit Material Request
  // ---------------------------------------------------------------------------
  submitMaterialRequest: (formValues) => {
    const { items } = get()
    const validation = validateRequestForm(formValues, items)

    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    const item = items.find((i) => i.id === formValues.itemId)
    const requestedQty = Number(formValues.requestedQuantity)

    const newRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      itemId: item.id,
      itemName: item.name,
      itemSku: item.sku,
      requestingSite: formValues.requestingSite,
      requester: formValues.requester.trim(),
      requestedQuantity: requestedQty,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes: formValues.notes ? formValues.notes.trim() : '',
      rejectionReason: null,
      fulfilledAt: null,
    }

    // Notice: if requestedQty > item.quantity, we still permit submitting the request
    // into the queue as Pending, but we trigger an informational notice if stock is already tight.
    const isStockTight = requestedQty > item.quantity

    set((state) => ({
      requests: [newRequest, ...state.requests],
      isNewRequestModalOpen: false,
      notification: {
        id: Date.now().toString(),
        type: isStockTight ? 'warning' : 'success',
        title: 'Material Request Created',
        message: isStockTight
          ? `Request ${newRequest.id} for ${requestedQty}x ${item.name} logged as Pending. Notice: Available stock (${item.quantity}) is less than requested quantity.`
          : `Request ${newRequest.id} for ${requestedQty}x ${item.name} logged as Pending for ${newRequest.requestingSite}.`,
      },
    }))

    return { success: true, request: newRequest }
  },

  // ---------------------------------------------------------------------------
  // Feature Action: Approve Request
  // Rules:
  // - Approval ALONE does not deduct stock.
  // - Verify stock availability.
  // - If stock is insufficient, notify the operator with a warning but allow approval (or warn).
  // ---------------------------------------------------------------------------
  approveRequest: (requestId) => {
    const { requests, items } = get()
    const targetRequest = requests.find((r) => r.id === requestId)

    if (!targetRequest) {
      return { success: false, message: 'Request not found.' }
    }

    if (targetRequest.status !== 'Pending') {
      return {
        success: false,
        message: `Only Pending requests can be approved. Current status: ${targetRequest.status}.`,
      }
    }

    const item = items.find((i) => i.id === targetRequest.itemId)
    const isStockAvailable = item && item.quantity >= targetRequest.requestedQuantity

    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId
          ? { ...r, status: 'Approved', approvedAt: new Date().toISOString() }
          : r
      ),
      notification: {
        id: Date.now().toString(),
        type: isStockAvailable ? 'success' : 'warning',
        title: isStockAvailable ? 'Request Approved' : 'Request Approved with Stock Advisory',
        message: isStockAvailable
          ? `Request ${targetRequest.id} for ${targetRequest.requestedQuantity}x ${targetRequest.itemName} approved. Ready for fulfilment.`
          : `Request ${targetRequest.id} approved, but current stock (${item ? item.quantity : 0}) is less than requested quantity (${targetRequest.requestedQuantity}). Stock must be replenished before fulfilment.`,
      },
    }))

    return { success: true, isStockAvailable }
  },

  // ---------------------------------------------------------------------------
  // Feature Action: Reject Request
  // Rules:
  // - Rejected requests must NOT change inventory.
  // - Rejection reason is mandatory.
  // ---------------------------------------------------------------------------
  rejectRequest: (requestId, reason) => {
    const { requests } = get()
    const targetRequest = requests.find((r) => r.id === requestId)

    if (!targetRequest) {
      return { success: false, message: 'Request not found.' }
    }

    if (targetRequest.status !== 'Pending' && targetRequest.status !== 'Approved') {
      return {
        success: false,
        message: `Cannot reject request with status "${targetRequest.status}".`,
      }
    }

    const trimmedReason = (reason || '').trim()
    if (!trimmedReason) {
      return { success: false, message: 'A rejection reason is required.' }
    }

    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Rejected',
              rejectionReason: trimmedReason,
              rejectedAt: new Date().toISOString(),
            }
          : r
      ),
      rejectingRequestId: null,
      notification: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Request Rejected',
        message: `Request ${targetRequest.id} rejected. Reason: "${trimmedReason}". Inventory unchanged.`,
      },
    }))

    return { success: true }
  },

  // ---------------------------------------------------------------------------
  // Feature Action: Fulfill Request
  // Rules:
  // - Deduct inventory ONLY when fulfilment succeeds.
  // - Re-check stock availability immediately before fulfilment.
  // - Block duplicate fulfilment.
  // - Prevent negative inventory.
  // - Show clear feedback for insufficient stock.
  // ---------------------------------------------------------------------------
  fulfillRequest: (requestId) => {
    const { requests, items } = get()
    const targetRequest = requests.find((r) => r.id === requestId)

    if (!targetRequest) {
      return { success: false, message: 'Request not found.' }
    }

    if (targetRequest.status === 'Fulfilled') {
      return {
        success: false,
        message: 'This request has already been fulfilled.',
      }
    }

    if (targetRequest.status !== 'Approved') {
      return {
        success: false,
        message: `Only Approved requests can be fulfilled. Current status: ${targetRequest.status}.`,
      }
    }

    const item = items.find((i) => i.id === targetRequest.itemId)

    if (!item) {
      set({
        notification: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Fulfilment Failed: Item Missing',
          message: `The item "${targetRequest.itemName}" (${targetRequest.itemSku}) is no longer in inventory.`,
        },
      })
      return { success: false, message: 'Item not found in inventory.' }
    }

    // Check stock availability strictly before fulfilment
    if (item.quantity < targetRequest.requestedQuantity) {
      set({
        notification: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Fulfilment Blocked: Insufficient Stock',
          message: `Cannot fulfill request ${targetRequest.id}. Required: ${targetRequest.requestedQuantity} units, but only ${item.quantity} available in ${item.location || 'Central Stores'}.`,
        },
      })
      return {
        success: false,
        reason: 'insufficient_stock',
        available: item.quantity,
        requested: targetRequest.requestedQuantity,
      }
    }

    // Atomic update: Deduct inventory and mark request fulfilled
    const updatedQuantity = item.quantity - targetRequest.requestedQuantity

    const newMovement = {
      id: `MOV-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      itemSku: item.sku,
      type: 'OUTBOUND_DISPATCH',
      quantityChange: -targetRequest.requestedQuantity,
      resultingBalance: updatedQuantity,
      reference: targetRequest.id,
      site: targetRequest.requestingSite,
      operator: 'Aditi (Central Stores Lead)',
      timestamp: new Date().toISOString(),
      notes: `Issued ${targetRequest.requestedQuantity}x units to ${targetRequest.requestingSite} (${targetRequest.requester})`,
    }

    set((state) => ({
      items: state.items.map((i) =>
        i.id === item.id ? { ...i, quantity: updatedQuantity } : i
      ),
      requests: state.requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Fulfilled',
              fulfilledAt: new Date().toISOString(),
            }
          : r
      ),
      movements: [newMovement, ...state.movements],
      notification: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Materials Dispatched & Fulfilled',
        message: `Successfully issued ${targetRequest.requestedQuantity}x ${item.name} to ${targetRequest.requestingSite}. Remaining stock: ${updatedQuantity} units.`,
      },
    }))

    return {
      success: true,
      remainingStock: updatedQuantity,
    }
  },

  // ---------------------------------------------------------------------------
  // Feature Action: Restock Item (Quick stock replenishment)
  // ---------------------------------------------------------------------------
  restockItem: (itemId, addedQuantity) => {
    const qty = Number(addedQuantity)
    if (!Number.isInteger(qty) || qty <= 0) {
      return { success: false, message: 'Restock quantity must be a positive integer.' }
    }

    const { items } = get()
    const targetItem = items.find((i) => i.id === itemId)
    if (!targetItem) {
      return { success: false, message: 'Item not found in inventory.' }
    }

    const newQty = targetItem.quantity + qty

    const newMovement = {
      id: `MOV-${Date.now()}`,
      itemId: targetItem.id,
      itemName: targetItem.name,
      itemSku: targetItem.sku,
      type: 'INBOUND_RESTOCK',
      quantityChange: qty,
      resultingBalance: newQty,
      reference: 'Depot Intake Replenishment',
      site: targetItem.location || 'Central Stores Depot',
      operator: 'Aditi (Central Stores Lead)',
      timestamp: new Date().toISOString(),
      notes: `Intake replenishment +${qty} units of ${targetItem.name}`,
    }

    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, quantity: newQty } : i
      ),
      movements: [newMovement, ...state.movements],
      restockingItem: null,
      notification: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Depot Stock Replenished',
        message: `Intake of +${qty} units of "${targetItem.name}" completed. New depot balance: ${newQty} units.`,
      },
    }))

    return { success: true, newQuantity: newQty }
  },

  // ---------------------------------------------------------------------------
  // Feature Action: Batch Import Inventory Items from CSV
  // ---------------------------------------------------------------------------
  importInventoryItems: (parsedRecords) => {
    const { items } = get()
    const existingSkus = new Set(items.map((i) => i.sku.toLowerCase()))
    const batchSkus = new Set()

    const validItems = []
    const newMovements = []
    const skippedRecords = []

    parsedRecords.forEach((record) => {
      const sku = (record.sku || '').trim().toLowerCase()
      if (!sku) {
        skippedRecords.push({ rowNumber: record.rowNumber, reason: 'Missing SKU' })
        return
      }

      if (existingSkus.has(sku)) {
        skippedRecords.push({ rowNumber: record.rowNumber, sku: record.sku, reason: `SKU "${record.sku}" already exists in catalog` })
        return
      }

      if (batchSkus.has(sku)) {
        skippedRecords.push({ rowNumber: record.rowNumber, sku: record.sku, reason: `Duplicate SKU "${record.sku}" within import batch` })
        return
      }

      if (!record.name || !record.name.trim()) {
        skippedRecords.push({ rowNumber: record.rowNumber, reason: 'Missing item name' })
        return
      }

      if (Number.isNaN(record.quantity) || record.quantity < 0) {
        skippedRecords.push({ rowNumber: record.rowNumber, reason: 'Invalid or negative quantity' })
        return
      }

      if (Number.isNaN(record.unitPrice) || record.unitPrice < 0) {
        skippedRecords.push({ rowNumber: record.rowNumber, reason: 'Invalid or negative unit price' })
        return
      }

      batchSkus.add(sku)
      const newItem = {
        id: `item-${Date.now()}-${validItems.length}`,
        name: record.name.trim(),
        sku: record.sku.trim().toUpperCase(),
        category: record.category || 'Assemblies & Modules',
        quantity: Math.floor(Number(record.quantity)),
        minStock: Math.floor(Number(record.minStock)) || 5,
        unitPrice: Number(record.unitPrice),
        location: record.location || 'Bay Unassigned',
        leadTimeDays: Number(record.leadTimeDays) || 7,
      }

      const movement = {
        id: `MOV-IMP-${Date.now()}-${validItems.length}`,
        itemId: newItem.id,
        itemName: newItem.name,
        itemSku: newItem.sku,
        type: 'ITEM_CREATED',
        quantityChange: newItem.quantity,
        resultingBalance: newItem.quantity,
        reference: 'CSV Batch Intake',
        site: newItem.location,
        operator: 'Aditi (Central Stores Lead)',
        timestamp: new Date().toISOString(),
        notes: `Imported via CSV file intake`,
      }

      validItems.push(newItem)
      newMovements.push(movement)
    })

    if (validItems.length > 0) {
      set((state) => ({
        items: [...validItems, ...state.items],
        movements: [...newMovements, ...state.movements],
        isImportModalOpen: false,
        notification: {
          id: Date.now().toString(),
          type: 'success',
          title: 'Inventory Imported',
          message: `Successfully imported ${validItems.length} item(s).${skippedRecords.length > 0 ? ` Skipped ${skippedRecords.length} invalid/duplicate rows.` : ''}`,
        },
      }))
    } else {
      set({
        notification: {
          id: Date.now().toString(),
          type: 'warning',
          title: 'Import Incomplete',
          message: `No records were imported. ${skippedRecords.length} row(s) had validation errors or duplicate SKUs.`,
        },
      })
    }

    return {
      success: validItems.length > 0,
      importedCount: validItems.length,
      skippedCount: skippedRecords.length,
      skipped: skippedRecords,
    }
  },

  // ---------------------------------------------------------------------------
  // Reset Store to Initial Mock State (for testing & demonstration)
  // ---------------------------------------------------------------------------
  resetToMockData: () => {
    set({
      items: INITIAL_INVENTORY_ITEMS,
      requests: INITIAL_MATERIAL_REQUESTS,
      movements: INITIAL_STOCK_MOVEMENTS,
      searchQuery: '',
      selectedCategory: 'All Categories',
      selectedStatus: 'all',
      sortColumn: 'name',
      sortDirection: 'asc',
      requestSearchQuery: '',
      requestSiteFilter: 'All Sites',
      movementSearchQuery: '',
      movementFilterType: 'All Types',
      preselectedItemId: null,
      restockingItem: null,
      rejectingRequestId: null,
      activeView: 'inventory',
      isAddItemModalOpen: false,
      isNewRequestModalOpen: false,
      isImportModalOpen: false,
      editingItem: null,
      notification: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Central Stores Reset',
        message: 'In-memory state reset to standard baseline demo fixture.',
      },
    })
  },
}))
