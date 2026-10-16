/**
 * OpsHub Central Stores — Data Formatting & Display Helpers
 */

export function formatCurrency(amount) {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount) || 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric)
}

export function formatNumber(num) {
  const numeric = typeof num === 'number' ? num : parseInt(num, 10) || 0
  return new Intl.NumberFormat('en-US').format(numeric)
}

export function formatDateTime(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return isoString
  }
}

export function formatDate(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d)
  } catch {
    return isoString
  }
}

/**
 * Categorize stock level deterministically:
 * - Out of Stock: quantity === 0
 * - Low Stock: quantity > 0 && quantity <= minStock
 * - In Stock: quantity > minStock
 */
export function getStockStatus(quantity, minStock) {
  const qty = typeof quantity === 'number' ? quantity : parseInt(quantity, 10) || 0
  const min = typeof minStock === 'number' ? minStock : parseInt(minStock, 10) || 0

  if (qty <= 0) {
    return {
      key: 'out_of_stock',
      label: 'Out of Stock',
      variant: 'error',
    }
  }

  if (qty <= min) {
    return {
      key: 'low_stock',
      label: 'Low Stock',
      variant: 'warning',
    }
  }

  return {
    key: 'in_stock',
    label: 'In Stock',
    variant: 'success',
  }
}

/**
 * Calculates sum of (quantity * unitPrice) across items
 */
export function calculateValuation(items) {
  if (!Array.isArray(items)) return 0
  return items.reduce((total, item) => {
    const qty = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity, 10) || 0
    const price = typeof item.unitPrice === 'number' ? item.unitPrice : parseFloat(item.unitPrice) || 0
    return total + (qty * price)
  }, 0)
}
