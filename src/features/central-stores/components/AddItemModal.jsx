import React, { useState, useEffect } from 'react'
import { X, Plus, AlertCircle, PackagePlus, Sparkles } from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { INVENTORY_CATEGORIES } from '../data/mockCentralStoresData'

export function AddItemModal() {
  const isOpen = useCentralStoresStore((state) => state.isAddItemModalOpen)
  const setOpen = useCentralStoresStore((state) => state.setAddItemModalOpen)
  const addItem = useCentralStoresStore((state) => state.addItem)

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electrical & Sensors',
    quantity: '10',
    minStock: '5',
    unitPrice: '45.00',
    location: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setOpen])

  if (!isOpen) return null

  const categories = INVENTORY_CATEGORIES.filter((c) => c !== 'All Categories')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleGenerateSku = () => {
    const prefix = formData.category.includes('Elect')
      ? 'CS-ELC'
      : formData.category.includes('Mech')
      ? 'CS-MEC'
      : formData.category.includes('Hyd')
      ? 'CS-HYD'
      : formData.category.includes('Fast')
      ? 'CS-FST'
      : 'CS-MOD'
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const generated = `${prefix}-${randomNum}`
    setFormData((prev) => ({ ...prev, sku: generated }))
    if (errors.sku) {
      setErrors((prev) => ({ ...prev, sku: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = addItem(formData)

    if (result.success) {
      // Reset form and close
      setFormData({
        name: '',
        sku: '',
        category: 'Electrical & Sensors',
        quantity: '10',
        minStock: '5',
        unitPrice: '45.00',
        location: '',
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
      aria-labelledby="add-item-modal-title"
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
                backgroundColor: 'rgba(101, 84, 192, 0.12)',
                color: 'var(--cs-purple-primary)',
              }}
            >
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 id="add-item-modal-title" className="text-lg font-bold">
                Register New Inventory Item
              </h2>
              <p className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
                Intake new material or assembly into Central Stores depot
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
          {/* Item Name */}
          <div>
            <label htmlFor="item-name" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="item-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Optical Rotary Encoder 24V"
              className="w-full px-3.5 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
              style={{
                backgroundColor: 'var(--cs-input-bg)',
                border: `1px solid ${errors.name ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                color: 'var(--cs-text-primary)',
              }}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* SKU & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SKU */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="item-sku" className="block text-xs font-semibold uppercase tracking-wider">
                  SKU Code <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  className="text-[11px] font-medium inline-flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--cs-purple-primary)' }}
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-Gen
                </button>
              </div>
              <input
                type="text"
                id="item-sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. CS-ENC-1024"
                className="w-full px-3.5 py-2 text-sm font-mono rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)] uppercase"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.sku ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              />
              {errors.sku && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.sku}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="item-category" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="item-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.category ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* Quantities & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Initial Quantity */}
            <div>
              <label htmlFor="item-quantity" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Initial Qty <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="item-quantity"
                name="quantity"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)] font-mono"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.quantity ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              />
              {errors.quantity && (
                <p className="mt-1 text-[11px] text-red-500">{errors.quantity}</p>
              )}
            </div>

            {/* Min Stock */}
            <div>
              <label htmlFor="item-min-stock" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Min. Threshold <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="item-min-stock"
                name="minStock"
                min="0"
                step="1"
                value={formData.minStock}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)] font-mono"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.minStock ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              />
              {errors.minStock && (
                <p className="mt-1 text-[11px] text-red-500">{errors.minStock}</p>
              )}
            </div>

            {/* Unit Price */}
            <div>
              <label htmlFor="item-unit-price" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Unit Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="item-unit-price"
                name="unitPrice"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)] font-mono"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: `1px solid ${errors.unitPrice ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                  color: 'var(--cs-text-primary)',
                }}
              />
              {errors.unitPrice && (
                <p className="mt-1 text-[11px] text-red-500">{errors.unitPrice}</p>
              )}
            </div>
          </div>

          {/* Location / Storage Bin */}
          <div>
            <label htmlFor="item-location" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Depot Storage Location (Optional)
            </label>
            <input
              type="text"
              id="item-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bay 02-B1, High-Density Rack A"
              className="w-full px-3.5 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
              style={{
                backgroundColor: 'var(--cs-input-bg)',
                border: '1px solid var(--cs-border)',
                color: 'var(--cs-text-primary)',
              }}
            />
          </div>

          {/* Actions Footer */}
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
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-all hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-deep)]"
              style={{ backgroundColor: 'var(--cs-purple-primary)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Register Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
