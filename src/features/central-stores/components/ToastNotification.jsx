import React, { useEffect } from 'react'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'

export function ToastNotification() {
  const notification = useCentralStoresStore((state) => state.notification)
  const clearNotification = useCentralStoresStore((state) => state.clearNotification)

  useEffect(() => {
    if (!notification) return

    const timer = setTimeout(() => {
      clearNotification()
    }, 6000)

    return () => clearTimeout(timer)
  }, [notification, clearNotification])

  if (!notification) return null

  const { type = 'info', title, message } = notification

  let icon = <Info className="w-5 h-5 text-blue-500" />
  let borderClass = 'rgba(59, 130, 246, 0.3)'
  let bgClass = 'rgba(59, 130, 246, 0.08)'

  if (type === 'success') {
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    borderClass = 'rgba(22, 163, 74, 0.35)'
    bgClass = 'rgba(22, 163, 74, 0.08)'
  } else if (type === 'warning') {
    icon = <AlertTriangle className="w-5 h-5 text-amber-500" />
    borderClass = 'rgba(217, 119, 6, 0.35)'
    bgClass = 'rgba(217, 119, 6, 0.08)'
  } else if (type === 'error') {
    icon = <XCircle className="w-5 h-5 text-red-500" />
    borderClass = 'rgba(220, 38, 38, 0.35)'
    bgClass = 'rgba(220, 38, 38, 0.08)'
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 rounded-xl shadow-xl flex items-start gap-3 animate-fade-in"
      style={{
        backgroundColor: 'var(--cs-bg-card)',
        border: `1px solid ${borderClass}`,
        boxShadow: 'var(--cs-shadow-lg)',
        color: 'var(--cs-text-primary)',
        backgroundImage: `linear-gradient(${bgClass}, ${bgClass})`,
      }}
    >
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold leading-tight mb-0.5">
            {title}
          </h4>
        )}
        <p className="text-xs leading-relaxed" style={{ color: 'var(--cs-text-secondary)' }}>
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={clearNotification}
        className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
