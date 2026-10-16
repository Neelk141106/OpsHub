import React, { useState, useEffect } from 'react'
import { X, PackageCheck, AlertCircle, ArrowUp } from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { formatNumber } from '../utils/formatters'

function RestockModalDialog({ item }) {
  const setRestockingItem = useCentralStoresStore((state) => state.setRestockingItem)
  const restockItem = useCentralStoresStore((state) => state.restockItem)

  const [quantity, setQuantity] = useState('10')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setRestockingItem(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setRestockingItem])

  const currentQty = item.quantity
  const addedQty = Number(quantity) || 0
  const projectedQty = currentQty + addedQty

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = Number(quantity)
    if (!Number.isInteger(num) || num <= 0) {
      setError('Please enter a valid positive whole number of units.')
      return
    }

    const result = restockItem(item.id, num)
    if (!result.success) {
      setError(result.message || 'Restock operation failed.')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="restock-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-modal-backdrop"
      style={{ backgroundColor: 'rgba(13, 16, 32, 0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative animate-modal-content"
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
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                color: 'var(--cs-success)',
              }}
            >
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="restock-modal-title" className="text-lg font-bold">
                Restock Inventory Material
              </h2>
              <p className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
                Intake new inbound shipment into Central Stores depot
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRestockingItem(null)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Info Card */}
        <div
          className="mt-4 p-3.5 rounded-xl flex flex-col gap-1 text-xs"
          style={{
            backgroundColor: 'var(--cs-bg-elevated)',
            border: '1px solid var(--cs-border-subtle)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm" style={{ color: 'var(--cs-text-primary)' }}>
              {item.name}
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--cs-bg-card)', border: '1px solid var(--cs-border)' }}>
              {item.sku}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: 'var(--cs-border-subtle)' }}>
            <span style={{ color: 'var(--cs-text-muted)' }}>Current Available Stock:</span>
            <strong className="font-mono text-sm" style={{ color: 'var(--cs-text-primary)' }}>
              {formatNumber(currentQty)} units
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--cs-text-muted)' }}>Minimum Safety Threshold:</span>
            <span className="font-mono text-xs" style={{ color: 'var(--cs-text-muted)' }}>
              {formatNumber(item.minStock)} units
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="restock-quantity" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Units to Intake <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="restock-quantity"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value)
                  if (error) setError('')
                }}
                className="w-full px-3.5 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-success)] font-mono font-semibold"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${error ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              />
            </div>
            {error && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px]" style={{ color: 'var(--cs-text-muted)' }}>Quick add:</span>
              {[5, 10, 25, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setQuantity(preset.toString())
                    if (error) setError('')
                  }}
                  className="px-2 py-0.5 text-xs rounded transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  style={{
                    backgroundColor: 'var(--cs-bg-elevated)',
                    border: '1px solid var(--cs-border-subtle)',
                    color: 'var(--cs-text-secondary)',
                  }}
                >
                  +{preset}
                </button>
              ))}
            </div>

            {/* Projected Stock Preview */}
            <div
              className="mt-3 p-2.5 rounded-lg flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: 'rgba(22, 163, 74, 0.08)',
                color: '#15803D',
              }}
            >
              <span className="flex items-center gap-1.5">
                <ArrowUp className="w-3.5 h-3.5" />
                Projected Available Balance:
              </span>
              <strong className="font-mono text-sm">{formatNumber(projectedQty)} units</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--cs-border)' }}>
            <button
              type="button"
              onClick={() => setRestockingItem(null)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: 'var(--cs-text-secondary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-all hover:brightness-110 active:scale-95"
              style={{ backgroundColor: 'var(--cs-success)' }}
            >
              <PackageCheck className="w-4 h-4" />
              <span>Confirm Intake</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function RestockModal() {
  const restockingItem = useCentralStoresStore((state) => state.restockingItem)
  if (!restockingItem) return null
  return <RestockModalDialog key={restockingItem.id} item={restockingItem} />
}
