import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Download,
  Boxes,
} from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { parseInventoryCsv, getSampleInventoryCsv, downloadCsvFile } from '../utils/csvExport'
import { formatCurrency } from '../utils/formatters'

export function ImportInventoryModal() {
  const isOpen = useCentralStoresStore((state) => state.isImportModalOpen)
  const setOpen = useCentralStoresStore((state) => state.setImportModalOpen)
  const items = useCentralStoresStore((state) => state.items)
  const importInventoryItems = useCentralStoresStore((state) => state.importInventoryItems)

  const [fileName, setFileName] = useState('')
  const [parseError, setParseError] = useState('')
  const [parsedRows, setParsedRows] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setOpen(false)
        setFileName('')
        setParseError('')
        setParsedRows([])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setOpen])

  if (!isOpen) return null

  const handleClose = () => {
    setOpen(false)
    setFileName('')
    setParseError('')
    setParsedRows([])
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setParseError('')

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text === 'string') {
        setCsvContent(text)
        processCsvText(text)
      }
    }
    reader.onerror = () => {
      setParseError('Failed to read file. Please ensure it is a valid text/csv file.')
    }
    reader.readAsText(file)
  }

  const processCsvText = (text) => {
    const result = parseInventoryCsv(text)
    if (!result.success) {
      setParseError(result.error)
      setParsedRows([])
      return
    }

    const existingSkus = new Set(items.map((i) => i.sku.toLowerCase()))
    const seenBatchSkus = new Set()

    const evaluated = result.records.map((rec) => {
      const sku = (rec.sku || '').trim().toLowerCase()
      let status = 'valid'
      let message = 'Ready to import'

      if (!sku) {
        status = 'error'
        message = 'Missing SKU'
      } else if (existingSkus.has(sku)) {
        status = 'duplicate'
        message = 'SKU already exists in catalog'
      } else if (seenBatchSkus.has(sku)) {
        status = 'duplicate'
        message = 'Duplicate SKU within batch'
      } else if (!rec.name) {
        status = 'error'
        message = 'Missing item name'
      } else if (Number.isNaN(rec.quantity) || rec.quantity < 0) {
        status = 'error'
        message = 'Invalid quantity'
      } else if (Number.isNaN(rec.unitPrice) || rec.unitPrice < 0) {
        status = 'error'
        message = 'Invalid price'
      }

      if (status === 'valid') {
        seenBatchSkus.add(sku)
      }

      return {
        ...rec,
        validationStatus: status,
        validationMessage: message,
      }
    })

    setParsedRows(evaluated)
    setParseError('')
  }

  const handleDownloadSample = () => {
    const sample = getSampleInventoryCsv()
    downloadCsvFile('opshub-sample-inventory-template.csv', sample)
  }

  const handleCommitImport = () => {
    const validRecords = parsedRows.filter((r) => r.validationStatus === 'valid')
    if (validRecords.length === 0) {
      setParseError('No valid rows available to import.')
      return
    }

    setIsSubmitting(true)
    importInventoryItems(validRecords)
    setIsSubmitting(false)
    handleClose()
  }

  const validCount = parsedRows.filter((r) => r.validationStatus === 'valid').length
  const issueCount = parsedRows.filter((r) => r.validationStatus !== 'valid').length

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-modal-backdrop"
      style={{ backgroundColor: 'rgba(13, 16, 32, 0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-3xl rounded-2xl p-6 relative animate-modal-content max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: 'var(--cs-bg-card)',
          border: '1px solid var(--cs-border)',
          boxShadow: 'var(--cs-shadow-lg)',
          color: 'var(--cs-text-primary)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--cs-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'rgba(101, 84, 192, 0.12)',
                color: 'var(--cs-purple-primary)',
              }}
            >
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 id="import-modal-title" className="text-lg font-bold tracking-tight">
                Batch Import Inventory Catalog
              </h2>
              <p className="text-xs" style={{ color: 'var(--cs-text-secondary)' }}>
                Upload an RFC 4180 CSV file to register multiple SKUs into Central Stores depot.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {/* File Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors hover:border-[var(--cs-purple-primary)]"
            style={{
              borderColor: 'var(--cs-border)',
              backgroundColor: 'var(--cs-bg-elevated)',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="max-w-xs mx-auto flex flex-col items-center">
              <FileText className="w-8 h-8 mb-2" style={{ color: 'var(--cs-purple-primary)' }} />
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--cs-text-primary)' }}>
                {fileName ? `Selected: ${fileName}` : 'Click to browse or drag & drop CSV'}
              </p>
              <p className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
                Requires Name, SKU, Category, Quantity, MinStock, UnitPrice columns.
              </p>
            </div>
          </div>

          {/* Template helper action */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span style={{ color: 'var(--cs-text-muted)' }}>Need a formatted template?</span>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 font-medium hover:underline"
              style={{ color: 'var(--cs-accent-blue)' }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample CSV Template</span>
            </button>
          </div>

          {/* Parse Error Alert */}
          {parseError && (
            <div
              role="alert"
              className="p-3.5 rounded-lg text-xs flex items-start gap-2.5"
              style={{
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                border: '1px solid rgba(220, 38, 38, 0.25)',
                color: 'var(--cs-error)',
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">CSV Parsing Error</span>
                <p>{parseError}</p>
              </div>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold" style={{ color: 'var(--cs-text-primary)' }}>
                  Batch Validation Preview ({parsedRows.length} rows detected)
                </span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {validCount} valid
                  </span>
                  {issueCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {issueCount} skipped / errors
                    </span>
                  )}
                </div>
              </div>

              <div
                className="rounded-lg overflow-hidden border max-h-56 overflow-y-auto text-xs"
                style={{ borderColor: 'var(--cs-border)' }}
              >
                <table className="w-full border-collapse">
                  <thead>
                    <tr
                      className="border-b uppercase font-semibold text-[11px]"
                      style={{
                        backgroundColor: 'var(--cs-table-header-bg)',
                        borderColor: 'var(--cs-border)',
                        color: 'var(--cs-text-muted)',
                      }}
                    >
                      <th className="px-3 py-2 text-left">Row</th>
                      <th className="px-3 py-2 text-left">Item Name</th>
                      <th className="px-3 py-2 text-left">SKU</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-right">Unit Price</th>
                      <th className="px-3 py-2 text-left">Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--cs-border-subtle)' }}>
                    {parsedRows.map((r, idx) => (
                      <tr
                        key={idx}
                        className={
                          r.validationStatus === 'valid'
                            ? 'hover:bg-black/5 dark:hover:bg-white/5'
                            : 'bg-amber-500/5'
                        }
                      >
                        <td className="px-3 py-2 font-mono" style={{ color: 'var(--cs-text-muted)' }}>
                          #{r.rowNumber}
                        </td>
                        <td className="px-3 py-2 font-medium" style={{ color: 'var(--cs-text-primary)' }}>
                          {r.name || '<empty>'}
                        </td>
                        <td className="px-3 py-2 font-mono" style={{ color: 'var(--cs-text-secondary)' }}>
                          {r.sku || '<empty>'}
                        </td>
                        <td className="px-3 py-2 text-right font-mono" style={{ color: 'var(--cs-text-primary)' }}>
                          {r.quantity}
                        </td>
                        <td className="px-3 py-2 text-right font-mono" style={{ color: 'var(--cs-text-primary)' }}>
                          {formatCurrency(r.unitPrice || 0)}
                        </td>
                        <td className="px-3 py-2">
                          {r.validationStatus === 'valid' ? (
                            <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium inline-flex items-center gap-1" title={r.validationMessage}>
                              <AlertTriangle className="w-3 h-3" /> {r.validationMessage}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--cs-border)' }}>
          <span className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
            Duplicates and invalid rows are automatically skipped during intake.
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ color: 'var(--cs-text-secondary)' }}
            >
              Cancel
            </button>
            <button
              type="button"
              id="btn-confirm-import"
              disabled={validCount === 0 || isSubmitting}
              onClick={handleCommitImport}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-deep)]"
              style={{ backgroundColor: 'var(--cs-purple-primary)' }}
            >
              <Boxes className="w-4 h-4" />
              <span>Import {validCount > 0 ? `${validCount} Valid Items` : 'Items'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
