import React, { useState, useEffect } from 'react'
import { X, Save, AlertCircle, Pencil } from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { INVENTORY_CATEGORIES } from '../data/mockCentralStoresData'

function EditItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: item.name || '',
    sku: item.sku || '',
    category: item.category || 'Electrical & Sensors',
    quantity: String(item.quantity ?? '0'),
    minStock: String(item.minStock ?? '5'),
    unitPrice: String(item.unitPrice ?? '0.00'),
    location: item.location || '',
    leadTimeDays: String(item.leadTimeDays ?? '7'),
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = INVENTORY_CATEGORIES.filter((c) => c !== 'All Categories')

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

    const result = onSave(item.id, formData)

    if (result && !result.success) {
      setErrors(result.errors || {})
    }
    setIsSubmitting(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-item-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-modal-backdrop"
      style={{ backgroundColor: 'rgba(13, 16, 32, 0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 relative animate-modal-content"
        style={{
          backgroundColor: 'var(--cs-bg-card)',
          border: '1px solid var(--cs-border)',
          boxShadow: 'var(--cs-shadow-lg)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--cs-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: 'rgba(101, 84, 192, 0.12)',
                color: 'var(--cs-purple-primary)',
              }}
            >
              <Pencil className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2
                id="edit-item-modal-title"
                className="text-lg font-bold leading-tight"
                style={{ color: 'var(--cs-text-primary)' }}
              >
                Edit Catalog Item
              </h2>
              <p className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
                Modify specifications and inventory thresholds for {item.sku}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            style={{ color: 'var(--cs-text-muted)' }}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Item Name */}
          <div>
            <label
              htmlFor="edit-item-name"
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--cs-text-secondary)' }}
            >
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit-item-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Optical Rotary Encoder 1024-PPR"
              className="w-full px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
              style={{
                backgroundColor: 'var(--cs-input-bg)',
                border: `1px solid ${errors.name ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                color: 'var(--cs-text-primary)',
              }}
            />
            {errors.name && (
              <p className="mt-1 text-xs flex items-center gap-1 text-red-500">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* SKU and Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="edit-item-sku"
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--cs-text-secondary)' }}
              >
                SKU Identifier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="edit-item-sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. CS-ENC-1024"
                className="w-full px-3 py-2 text-sm rounded-lg font-mono uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.sku ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              />
              {errors.sku && (
                <p className="mt-1 text-xs flex items-center gap-1 text-red-500">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.sku}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-item-category"
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--cs-text-secondary)' }}
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="edit-item-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.category ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity, Min Stock, Unit Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="edit-item-quantity"
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--cs-text-secondary)' }}
              >
                On-Hand Qty <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="edit-item-quantity"
                name="quantity"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.quantity ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-item-min-stock"
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--cs-text-secondary)' }}
              >
                Min. Threshold <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="edit-item-min-stock"
                name="minStock"
                min="0"
                step="1"
                value={formData.minStock}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.minStock ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              />
              {errors.minStock && (
                <p className="mt-1 text-xs text-red-500">{errors.minStock}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-item-unit-price"
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--cs-text-secondary)' }}
              >
                Unit Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="edit-item-unit-price"
                name="unitPrice"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.unitPrice ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              />
              {errors.unitPrice && (
                <p className="mt-1 text-xs text-red-500">{errors.unitPrice}</p>
              )}
            </div>
          </div>

          {/* Location and Lead Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="edit-item-location"
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--cs-text-secondary)' }}
              >
                Storage Bay Location
              </label>
              <input
                type="text"
                id="edit-item-location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Aisle 03 • Shelf B2"
                className="w-full px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: '1px solid var(--cs-border)',
                  color: 'var(--cs-text-primary)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="edit-item-lead-time"
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--cs-text-secondary)' }}
              >
                Lead Time (Days)
              </label>
              <input
                type="number"
                id="edit-item-lead-time"
                name="leadTimeDays"
                min="1"
                value={formData.leadTimeDays}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: '1px solid var(--cs-border)',
                  color: 'var(--cs-text-primary)',
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--cs-border)' }}>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                backgroundColor: 'var(--cs-bg-elevated)',
                border: '1px solid var(--cs-border)',
                color: 'var(--cs-text-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg text-white shadow-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--cs-purple-primary)',
              }}
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EditItemModal() {
  const editingItem = useCentralStoresStore((state) => state.editingItem)
  const setEditingItem = useCentralStoresStore((state) => state.setEditingItem)
  const updateItem = useCentralStoresStore((state) => state.updateItem)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && editingItem) {
        setEditingItem(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingItem, setEditingItem])

  if (!editingItem) return null

  return (
    <EditItemForm
      key={editingItem.id}
      item={editingItem}
      onSave={updateItem}
      onCancel={() => setEditingItem(null)}
    />
  )
}
