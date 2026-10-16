/**
 * OpsHub Central Stores — Validation Utilities
 */

/**
 * Validates the Add Item form input.
 * @param {Object} values - { name, sku, category, quantity, minStock, unitPrice, location }
 * @param {Array} existingItems - Current inventory list for unique SKU verification
 * @param {string|null} currentItemId - Optional ID if updating existing item
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateItemForm(values, existingItems = [], currentItemId = null) {
  const errors = {}

  // Name validation
  if (!values.name || !values.name.trim()) {
    errors.name = 'Item name is required.'
  } else if (values.name.trim().length < 3) {
    errors.name = 'Item name must be at least 3 characters.'
  }

  // SKU validation
  if (!values.sku || !values.sku.trim()) {
    errors.sku = 'SKU is required.'
  } else {
    const trimmedSku = values.sku.trim().toUpperCase()
    if (!/^[A-Z0-9_-]{3,24}$/i.test(trimmedSku)) {
      errors.sku = 'SKU must be 3-24 alphanumeric characters (hyphens/underscores allowed).'
    } else {
      const isDuplicate = existingItems.some((item) => {
        if (currentItemId && item.id === currentItemId) return false
        return item.sku.trim().toUpperCase() === trimmedSku
      })
      if (isDuplicate) {
        errors.sku = `SKU "${trimmedSku}" is already assigned to another item.`
      }
    }
  }

  // Category validation
  if (!values.category || !values.category.trim() || values.category === 'All Categories') {
    errors.category = 'Please select a valid category.'
  }

  // Quantity validation (non-negative integer)
  if (values.quantity === undefined || values.quantity === '' || values.quantity === null) {
    errors.quantity = 'Initial quantity is required.'
  } else {
    const qty = Number(values.quantity)
    if (!Number.isInteger(qty) || qty < 0) {
      errors.quantity = 'Quantity must be a non-negative whole integer.'
    }
  }

  // Minimum stock threshold (non-negative integer)
  if (values.minStock === undefined || values.minStock === '' || values.minStock === null) {
    errors.minStock = 'Minimum stock threshold is required.'
  } else {
    const min = Number(values.minStock)
    if (!Number.isInteger(min) || min < 0) {
      errors.minStock = 'Minimum stock must be a non-negative whole integer.'
    }
  }

  // Unit price validation (non-negative number)
  if (values.unitPrice === undefined || values.unitPrice === '' || values.unitPrice === null) {
    errors.unitPrice = 'Unit price is required.'
  } else {
    const price = Number(values.unitPrice)
    if (Number.isNaN(price) || price < 0) {
      errors.unitPrice = 'Unit price must be a non-negative number.'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validates the New Material Request form input.
 * @param {Object} values - { itemId, requestingSite, requester, requestedQuantity, notes }
 * @param {Array} inventoryItems - Available inventory
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateRequestForm(values, inventoryItems = []) {
  const errors = {}

  // Item validation
  if (!values.itemId) {
    errors.itemId = 'Please select an inventory item.'
  } else {
    const itemExists = inventoryItems.some((item) => item.id === values.itemId)
    if (!itemExists) {
      errors.itemId = 'Selected item could not be found in active inventory.'
    }
  }

  // Requesting site validation
  if (!values.requestingSite) {
    errors.requestingSite = 'Requesting site is required.'
  } else if (!['Service Centre', 'Distribution'].includes(values.requestingSite)) {
    errors.requestingSite = 'Site must be either "Service Centre" or "Distribution".'
  }

  // Requester validation
  if (!values.requester || !values.requester.trim()) {
    errors.requester = 'Requester name or role is required.'
  } else if (values.requester.trim().length < 2) {
    errors.requester = 'Requester identifier must be at least 2 characters.'
  }

  // Requested quantity validation (positive integer > 0)
  if (values.requestedQuantity === undefined || values.requestedQuantity === '' || values.requestedQuantity === null) {
    errors.requestedQuantity = 'Requested quantity is required.'
  } else {
    const qty = Number(values.requestedQuantity)
    if (!Number.isInteger(qty) || qty <= 0) {
      errors.requestedQuantity = 'Requested quantity must be a positive integer greater than zero.'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
