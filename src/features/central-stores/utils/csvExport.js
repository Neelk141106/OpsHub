/**
 * OpsHub Central Stores — CSV Export and Import Utilities
 * 
 * Uses standard Web Browser APIs (Blob, URL.createObjectURL, FileReader)
 * to ensure reliable, zero-dependency client-side file operations.
 */

/**
 * Escapes and quotes a field for RFC 4180 CSV compliance.
 */
function escapeCsvCell(value) {
  if (value === null || value === undefined) return '""'
  const stringValue = String(value)
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return `"${stringValue}"`
}

/**
 * Triggers a browser download of a CSV file.
 */
export function downloadCsvFile(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Exports inventory items array to formatted CSV string.
 */
export function exportInventoryToCsv(items) {
  const headers = [
    'Item ID',
    'Item Name',
    'SKU',
    'Category',
    'Quantity',
    'Min Stock Threshold',
    'Unit Price (USD)',
    'Total Valuation (USD)',
    'Location',
    'Lead Time (Days)',
  ]

  const rows = items.map((item) => [
    escapeCsvCell(item.id),
    escapeCsvCell(item.name),
    escapeCsvCell(item.sku),
    escapeCsvCell(item.category),
    escapeCsvCell(item.quantity),
    escapeCsvCell(item.minStock),
    escapeCsvCell(Number(item.unitPrice).toFixed(2)),
    escapeCsvCell((item.quantity * item.unitPrice).toFixed(2)),
    escapeCsvCell(item.location || 'Unassigned'),
    escapeCsvCell(item.leadTimeDays || 7),
  ])

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
}

/**
 * Exports material requests array to formatted CSV string.
 */
export function exportRequestsToCsv(requests) {
  const headers = [
    'Request ID',
    'Status',
    'Item Name',
    'SKU',
    'Requested Quantity',
    'Requesting Site',
    'Requester',
    'Created At',
    'Fulfilled At',
    'Rejection Reason',
    'Notes',
  ]

  const rows = requests.map((req) => [
    escapeCsvCell(req.id),
    escapeCsvCell(req.status),
    escapeCsvCell(req.itemName),
    escapeCsvCell(req.itemSku),
    escapeCsvCell(req.requestedQuantity),
    escapeCsvCell(req.requestingSite),
    escapeCsvCell(req.requester),
    escapeCsvCell(req.createdAt),
    escapeCsvCell(req.fulfilledAt || 'N/A'),
    escapeCsvCell(req.rejectionReason || 'N/A'),
    escapeCsvCell(req.notes || ''),
  ])

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
}

/**
 * Exports stock movements array to formatted CSV string.
 */
export function exportMovementsToCsv(movements) {
  const headers = [
    'Movement ID',
    'Timestamp',
    'Item Name',
    'SKU',
    'Movement Type',
    'Quantity Change',
    'Resulting Balance',
    'Reference / Req ID',
    'Site / Location',
    'Operator',
    'Notes',
  ]

  const rows = movements.map((mov) => [
    escapeCsvCell(mov.id),
    escapeCsvCell(mov.timestamp),
    escapeCsvCell(mov.itemName),
    escapeCsvCell(mov.itemSku),
    escapeCsvCell(mov.type),
    escapeCsvCell(mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange),
    escapeCsvCell(mov.resultingBalance),
    escapeCsvCell(mov.reference || 'N/A'),
    escapeCsvCell(mov.site || 'Central Stores Depot'),
    escapeCsvCell(mov.operator || 'System Operator'),
    escapeCsvCell(mov.notes || ''),
  ])

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
}

/**
 * Generates sample CSV template for inventory intake.
 */
export function getSampleInventoryCsv() {
  const sampleHeaders = 'Name,SKU,Category,Quantity,MinStock,UnitPrice,Location,LeadTimeDays'
  const sampleRows = [
    '"Laser Distance Sensor 50m","CS-SEN-0050","Electrical & Sensors",25,8,165.00,"Bay 03-D2",5',
    '"Stainless Steel Ball Valve 1/2\\"","CS-VAL-0012","Hydraulics & Pneumatics",40,15,48.50,"Bay 05-A1",4',
  ]
  return [sampleHeaders, ...sampleRows].join('\r\n')
}

/**
 * Parse CSV text into records with basic RFC 4180 parsing.
 */
export function parseInventoryCsv(text) {
  if (!text || !text.trim()) {
    return { success: false, error: 'CSV file is empty.' }
  }

  const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) {
    return { success: false, error: 'CSV file must contain a header row and at least one data row.' }
  }

  // Helper to split a CSV line into cells respecting quotes
  function parseCsvLine(line) {
    const cells = []
    let currentCell = ''
    let insideQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          currentCell += '"'
          i++
        } else {
          insideQuotes = !insideQuotes
        }
      } else if (char === ',' && !insideQuotes) {
        cells.push(currentCell.trim())
        currentCell = ''
      } else {
        currentCell += char
      }
    }
    cells.push(currentCell.trim())
    return cells
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''))
  
  // Verify required column headers
  const requiredFields = ['name', 'sku', 'category', 'quantity', 'minstock', 'unitprice']
  const missingFields = requiredFields.filter((f) => !headers.includes(f))
  if (missingFields.length > 0) {
    return {
      success: false,
      error: `Missing required column headers: ${missingFields.join(', ')}. Found: ${headers.join(', ')}`,
    }
  }

  const nameIdx = headers.indexOf('name')
  const skuIdx = headers.indexOf('sku')
  const categoryIdx = headers.indexOf('category')
  const quantityIdx = headers.indexOf('quantity')
  const minStockIdx = headers.indexOf('minstock')
  const unitPriceIdx = headers.indexOf('unitprice')
  const locationIdx = headers.indexOf('location')
  const leadTimeIdx = headers.indexOf('leadtimedays')

  const parsedRecords = []

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i])
    if (cells.length < 3) continue // Skip empty/malformed lines

    const record = {
      rowNumber: i + 1,
      name: cells[nameIdx] || '',
      sku: (cells[skuIdx] || '').toUpperCase(),
      category: cells[categoryIdx] || 'Assemblies & Modules',
      quantity: Number(cells[quantityIdx]),
      minStock: Number(cells[minStockIdx]),
      unitPrice: Number(cells[unitPriceIdx]),
      location: locationIdx !== -1 ? cells[locationIdx] || 'Bay Unassigned' : 'Bay Unassigned',
      leadTimeDays: leadTimeIdx !== -1 ? Number(cells[leadTimeIdx]) || 7 : 7,
    }

    parsedRecords.push(record)
  }

  return { success: true, records: parsedRecords }
}
