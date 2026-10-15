import { useState } from 'react'
import { AlertCircle, CheckCircle2, Plus, X } from 'lucide-react'
import {
  DESTINATION_OPTIONS,
  SOURCE_OPTIONS,
  UNIT_OPTIONS,
} from '../data/distributionMockData'
import { useTheme } from '../context/useTheme'

export default function NewAssignmentModal({ isOpen, onClose, onAddAssignment }) {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    material: '',
    quantity: '',
    unit: 'Units',
    source: SOURCE_OPTIONS[0],
    destination: DESTINATION_OPTIONS[0],
    assignedDate: '2026-10-15',
    priority: 'Normal',
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.material.trim()) {
      newErrors.material = 'Material name is required.'
    }
    const qty = Number(formData.quantity)
    if (!formData.quantity || isNaN(qty) || qty <= 0) {
      newErrors.quantity = 'Please enter a positive quantity greater than 0.'
    }
    if (!formData.source) {
      newErrors.source = 'Source site is required.'
    }
    if (!formData.destination) {
      newErrors.destination = 'Destination hub is required.'
    }
    if (!formData.assignedDate) {
      newErrors.assignedDate = 'Assignment date is required.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const newAssignment = {
      id: `ASN-${Math.floor(1000 + Math.random() * 9000)}`,
      material: formData.material.trim(),
      category: 'General Supply',
      quantity: Number(formData.quantity),
      unit: formData.unit,
      issuedQuantity: Number(formData.quantity),
      consumedQuantity: 0,
      source: formData.source,
      destination: formData.destination,
      assignedDate: formData.assignedDate,
      status: 'Pending',
      carrier: 'Internal Shunting Ops',
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      priority: formData.priority,
      notes: formData.notes.trim() || 'Logged via Distribution Operations Dashboard.',
    }

    onAddAssignment(newAssignment)
    setIsSuccess(true)

    setTimeout(() => {
      setIsSuccess(false)
      onClose()
      // Reset form
      setFormData({
        material: '',
        quantity: '',
        unit: 'Units',
        source: SOURCE_OPTIONS[0],
        destination: DESTINATION_OPTIONS[0],
        assignedDate: '2026-10-15',
        priority: 'Normal',
        notes: '',
      })
      setErrors({})
    }, 700)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-xl transition-all ${
          isDark
            ? 'border-[#2E334D] bg-[#222538] text-[#F2F3FA]'
            : 'border-slate-200 bg-white text-[#17213A]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between border-b pb-4 transition-colors ${
            isDark ? 'border-[#2E334D]' : 'border-slate-100'
          }`}
        >
          <div>
            <h2
              className={`text-base font-semibold transition-colors ${
                isDark ? 'text-[#F2F3FA]' : 'text-slate-900'
              }`}
            >
              Create Material Assignment
            </h2>
            <p
              className={`mt-0.5 text-xs transition-colors ${
                isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
              }`}
            >
              Assign materials from inventory depots to operational destinations.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] ${
              isDark
                ? 'text-[#A6ADC4] hover:bg-[#1B1E2E] hover:text-[#F2F3FA]'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Feedback */}
        {isSuccess && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Assignment created successfully! Updating manifest records...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Material Name */}
          <div>
            <label
              className={`block font-medium transition-colors ${
                isDark ? 'text-[#F2F3FA]' : 'text-slate-700'
              }`}
            >
              Material / Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="e.g. Servo Motor Assemblies (3kW)"
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 transition-colors duration-200 ${
                errors.material
                  ? 'border-rose-400 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500'
                  : isDark
                  ? 'border-[#2E334D] bg-[#1B1E2E] text-[#F2F3FA] placeholder:text-[#A6ADC4]/60 focus:border-[#B9ADFF] focus:ring-[#B9ADFF]'
                  : 'border-slate-200 bg-white text-[#17213A] placeholder:text-slate-400 focus:border-[#5B4BE8] focus:ring-[#5B4BE8]'
              }`}
            />
            {errors.material && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-500">
                <AlertCircle className="h-3 w-3" />
                {errors.material}
              </p>
            )}
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className={`block font-medium transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-slate-700'
                }`}
              >
                Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 50"
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 transition-colors duration-200 ${
                  errors.quantity
                    ? 'border-rose-400 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500'
                    : isDark
                    ? 'border-[#2E334D] bg-[#1B1E2E] text-[#F2F3FA] placeholder:text-[#A6ADC4]/60 focus:border-[#B9ADFF] focus:ring-[#B9ADFF]'
                    : 'border-slate-200 bg-white text-[#17213A] placeholder:text-slate-400 focus:border-[#5B4BE8] focus:ring-[#5B4BE8]'
                }`}
              />
              {errors.quantity && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block font-medium transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-slate-700'
                }`}
              >
                Unit of Measure
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 ${
                  isDark
                    ? 'border-[#2E334D] bg-[#1B1E2E] text-[#F2F3FA] focus:border-[#B9ADFF] focus:ring-[#B9ADFF]'
                    : 'border-slate-200 bg-white text-[#17213A] focus:border-[#5B4BE8] focus:ring-[#5B4BE8]'
                }`}
              >
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit} className={isDark ? 'bg-[#1B1E2E]' : 'bg-white'}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Source & Destination */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                className={`block font-medium transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-slate-700'
                }`}
              >
                Source Site <span className="text-rose-500">*</span>
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 ${
                  isDark
                    ? 'border-[#2E334D] bg-[#1B1E2E] text-[#F2F3FA] focus:border-[#B9ADFF] focus:ring-[#B9ADFF]'
                    : 'border-slate-200 bg-white text-[#17213A] focus:border-[#5B4BE8] focus:ring-[#5B4BE8]'
                }`}
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className={isDark ? 'bg-[#1B1E2E]' : 'bg-white'}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block font-medium transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-slate-700'
                }`}
              >
                Destination Hub <span className="text-rose-500">*</span>
              </label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 ${
                  isDark
                    ? 'border-[#2E334D] bg-[#1B1E2E] text-[#F2F3FA] focus:border-[#B9ADFF] focus:ring-[#B9ADFF]'
                    : 'border-slate-200 bg-white text-[#17213A] focus:border-[#5B4BE8] focus:ring-[#5B4BE8]'
                }`}
              >
                {DESTINATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className={isDark ? 'bg-[#1B1E2E]' : 'bg-white'}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className={`block font-medium transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-slate-700'
                }`}
              >
                Assignment Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="assignedDate"
                value={formData.assignedDate}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 ${
                  isDark
                    ? 'border-[#2E334D] bg-[#1B1E2E] text-[#F2F3FA] focus:border-[#B9ADFF] focus:ring-[#B9ADFF]'
                    : 'border-slate-200 bg-white text-[#17213A] focus:border-[#5B4BE8] focus:ring-[#5B4BE8]'
                }`}
              />
            </div>

            <div>
              <label
                className={`block font-medium transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-slate-700'
                }`}
              >
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 ${
                  isDark
                    ? 'border-[#2E334D] bg-[#1B1E2E] text-[#F2F3FA] focus:border-[#B9ADFF] focus:ring-[#B9ADFF]'
                    : 'border-slate-200 bg-white text-[#17213A] focus:border-[#5B4BE8] focus:ring-[#5B4BE8]'
                }`}
              >
                <option value="Normal" className={isDark ? 'bg-[#1B1E2E]' : 'bg-white'}>Normal</option>
                <option value="High" className={isDark ? 'bg-[#1B1E2E]' : 'bg-white'}>High</option>
                <option value="Urgent" className={isDark ? 'bg-[#1B1E2E]' : 'bg-white'}>Urgent</option>
              </select>
            </div>
          </div>

          {/* Operational Notes */}
          <div>
            <label
              className={`block font-medium transition-colors ${
                isDark ? 'text-[#A6ADC4]' : 'text-slate-700'
              }`}
            >
              Operational Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add handling requirements, batch numbers, or special instructions..."
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 ${
                isDark
                  ? 'border-[#2E334D] bg-[#1B1E2E] text-[#F2F3FA] placeholder:text-[#A6ADC4]/60 focus:border-[#B9ADFF] focus:ring-[#B9ADFF]'
                  : 'border-slate-200 bg-white text-[#17213A] placeholder:text-slate-400 focus:border-[#5B4BE8] focus:ring-[#5B4BE8]'
              }`}
            />
          </div>

          {/* Footer Actions */}
          <div
            className={`mt-5 flex items-center justify-end gap-2 border-t pt-4 transition-colors ${
              isDark ? 'border-[#2E334D]' : 'border-slate-100'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSuccess}
              className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] ${
                isDark
                  ? 'border-[#2E334D] text-[#A6ADC4] hover:bg-[#1B1E2E] hover:text-[#F2F3FA]'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSuccess}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#5B4BE8] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#4D3DC9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] focus-visible:ring-offset-2 transition-colors duration-150 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>Create Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
