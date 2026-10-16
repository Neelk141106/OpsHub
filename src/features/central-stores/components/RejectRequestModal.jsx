import React, { useState, useEffect } from 'react'
import { X, XCircle, AlertCircle, ShieldAlert } from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'

export function RejectRequestModal() {
  const rejectingRequestId = useCentralStoresStore((state) => state.rejectingRequestId)
  const setRejectingRequestId = useCentralStoresStore((state) => state.setRejectingRequestId)
  const rejectRequest = useCentralStoresStore((state) => state.rejectRequest)
  const requests = useCentralStoresStore((state) => state.requests)

  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && rejectingRequestId) {
        setRejectingRequestId(null)
        setReason('')
        setError('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [rejectingRequestId, setRejectingRequestId])

  if (!rejectingRequestId) return null

  const targetRequest = requests.find((r) => r.id === rejectingRequestId)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('A formal rejection reason is mandatory for operational auditing.')
      return
    }

    const result = rejectRequest(rejectingRequestId, reason)
    if (result.success) {
      setReason('')
      setError('')
    } else {
      setError(result.message || 'Failed to reject request.')
    }
  }

  const handleClose = () => {
    setRejectingRequestId(null)
    setReason('')
    setError('')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
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
                backgroundColor: 'rgba(220, 38, 38, 0.12)',
                color: 'var(--cs-error)',
              }}
            >
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="reject-modal-title" className="text-lg font-bold">
                Decline Material Requisition
              </h2>
              <p className="text-xs font-mono" style={{ color: 'var(--cs-text-muted)' }}>
                {targetRequest ? `${targetRequest.id} — ${targetRequest.itemName}` : 'Requisition Review'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advisory */}
        <div
          className="mt-4 p-3 rounded-lg flex items-center gap-2 text-xs"
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            color: '#B91C1C',
          }}
        >
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>
            Inventory will <strong>not</strong> be modified. Rejection reason is permanently logged in the operational audit trail.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="rejection-reason" className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejection-reason"
              rows="3"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              placeholder="e.g. Allocation reserved for emergency maintenance; or quota exceeded without authorization..."
              className="w-full px-3.5 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-error)] resize-none"
              style={{
                backgroundColor: 'var(--cs-input-bg)',
                border: `1px solid ${error ? 'var(--cs-error)' : 'var(--cs-border)'}`,
                color: 'var(--cs-text-primary)',
              }}
            />
            {error && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Quick preset suggestions */}
          <div>
            <span className="text-[11px] font-medium block mb-1.5" style={{ color: 'var(--cs-text-muted)' }}>
              Quick Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Insufficient safety stock buffer',
                'Exceeds departmental monthly quota',
                'Duplicate order detected',
                'Component earmarked for critical overhaul',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setReason(preset)
                    if (error) setError('')
                  }}
                  className="text-[11px] px-2 py-1 rounded transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  style={{
                    backgroundColor: 'var(--cs-bg-elevated)',
                    color: 'var(--cs-text-secondary)',
                    border: '1px solid var(--cs-border-subtle)',
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--cs-border)' }}>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: 'var(--cs-text-secondary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-all hover:brightness-110 active:scale-95"
              style={{ backgroundColor: 'var(--cs-error)' }}
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
