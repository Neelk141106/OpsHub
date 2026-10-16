import React, { useState, useEffect } from 'react'
import { X, ArrowRightLeft, AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { REQUESTING_SITES } from '../data/mockCentralStoresData'
import { formatNumber } from '../utils/formatters'

function NewRequestModalDialog() {
  const setOpen = useCentralStoresStore((state) => state.setNewRequestModalOpen)
  const preselectedItemId = useCentralStoresStore((state) => state.preselectedItemId)
  const items = useCentralStoresStore((state) => state.items)
  const submitMaterialRequest = useCentralStoresStore((state) => state.submitMaterialRequest)

  const [formData, setFormData] = useState({
    itemId: preselectedItemId || items[0]?.id || '',
    requestingSite: 'Service Centre',
    requester: '',
    requestedQuantity: '1',
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen])

  const selectedItem = items.find((i) => i.id === formData.itemId)
  const availableStock = selectedItem ? selectedItem.quantity : 0
  const requestedQty = Number(formData.requestedQuantity) || 0
  const isStockDeficient = requestedQty > availableStock

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = submitMaterialRequest(formData)

    if (result.success) {
      setFormData({
        itemId: items[0]?.id || '',
        requestingSite: 'Service Centre',
        requester: '',
        requestedQuantity: '1',
        notes: '',
      })
      setErrors({})
    } else {
      setErrors(result.errors || {})
    }
    setIsSubmitting(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-request-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-modal-backdrop"
      style={{ backgroundColor: 'rgba(13, 16, 32, 0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 relative animate-modal-content"
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
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                color: 'var(--cs-accent-blue)',
              }}
            >
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 id="new-request-modal-title" className="text-lg font-bold">
                Submit Material Requisition
              </h2>
              <p className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
                Request inventory dispatch for Service Centre repair or Distribution outbound
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Select Item */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="request-item-id" className="block text-xs font-semibold uppercase tracking-wider">
                Select Material / SKU <span className="text-red-500">*</span>
              </label>
              {selectedItem && (
                <span className="text-xs font-medium flex items-center gap-1">
                  Available in depot:
                  <strong
                    className={`font-mono ${
                      availableStock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatNumber(availableStock)} units
                  </strong>
                </span>
              )}
            </div>

            <select
              id="request-item-id"
              name="itemId"
              value={formData.itemId}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent-blue)]"
              style={{
                backgroundColor: 'var(--cs-input-bg)',
                border: `1px solid ${errors.itemId ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                color: 'var(--cs-text-primary)',
              }}
            >
              <option value="">-- Choose an Inventory Item --</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.sku}) — {item.quantity} in stock
                </option>
              ))}
            </select>
            {errors.itemId && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.itemId}
              </p>
            )}
          </div>

          {/* Site & Requester Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Requesting Site */}
            <div>
              <label htmlFor="request-site" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Destination Site <span className="text-red-500">*</span>
              </label>
              <select
                id="request-site"
                name="requestingSite"
                value={formData.requestingSite}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent-blue)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.requestingSite ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              >
                {REQUESTING_SITES.map((site) => (
                  <option key={site} value={site}>
                    {site}
                  </option>
                ))}
              </select>
              {errors.requestingSite && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.requestingSite}
                </p>
              )}
            </div>

            {/* Requester Name */}
            <div>
              <label htmlFor="request-requester" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Requester Name / Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="request-requester"
                name="requester"
                value={formData.requester}
                onChange={handleChange}
                placeholder="e.g. Sarah Connor (Lead Tech)"
                className="w-full px-3.5 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent-blue)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.requester ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              />
              {errors.requester && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.requester}
                </p>
              )}
            </div>
          </div>

          {/* Requested Quantity */}
          <div>
            <label htmlFor="request-quantity" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Requested Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="request-quantity"
              name="requestedQuantity"
              min="1"
              step="1"
              value={formData.requestedQuantity}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent-blue)] font-mono"
              style={{
                backgroundColor: 'var(--cs-input-bg)',
                border: `1px solid ${errors.requestedQuantity ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                color: 'var(--cs-text-primary)',
              }}
            />
            {errors.requestedQuantity && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.requestedQuantity}
              </p>
            )}

            {/* Live Stock Comparison Notice */}
            {selectedItem && (
              <div className="mt-2">
                {isStockDeficient ? (
                  <div
                    className="p-2.5 rounded-lg flex items-center gap-2 text-xs"
                    style={{
                      backgroundColor: 'rgba(217, 119, 6, 0.1)',
                      color: '#B45309',
                      border: '1px solid rgba(217, 119, 6, 0.25)',
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Notice: Requested {requestedQty} exceeds available stock ({availableStock}). The request can be logged as Pending, but replenishment is needed before fulfilment.
                    </span>
                  </div>
                ) : (
                  <div
                    className="p-2 rounded-lg flex items-center gap-2 text-xs"
                    style={{
                      backgroundColor: 'rgba(22, 163, 74, 0.08)',
                      color: '#15803D',
                    }}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Stock verified: {availableStock} units available for allocation.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes / Operational Justification */}
          <div>
            <label htmlFor="request-notes" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Operational Justification / Ticket Ref (Optional)
            </label>
            <textarea
              id="request-notes"
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Work Order #WO-4091, immediate line replacement..."
              className="w-full px-3.5 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent-blue)] resize-none"
              style={{
                backgroundColor: 'var(--cs-input-bg)',
                border: '1px solid var(--cs-border)',
                color: 'var(--cs-text-primary)',
              }}
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--cs-border)' }}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: 'var(--cs-text-secondary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-all hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent-blue)]"
              style={{ backgroundColor: 'var(--cs-accent-blue)' }}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Submit Requisition</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function NewRequestModal() {
  const isOpen = useCentralStoresStore((state) => state.isNewRequestModalOpen)
  const preselectedItemId = useCentralStoresStore((state) => state.preselectedItemId)

  if (!isOpen) return null
  return <NewRequestModalDialog key={preselectedItemId || 'default'} />
}
