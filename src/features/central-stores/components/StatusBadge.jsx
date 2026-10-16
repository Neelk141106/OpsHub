import React from 'react'

/**
 * StatusBadge Component
 * Displays semantic status pills conforming to OpsHub design specifications.
 */
export function StatusBadge({ status, variant, size = 'sm' }) {
  let badgeStyle = {
    background: 'rgba(102, 112, 133, 0.1)',
    color: 'var(--cs-text-secondary)',
    border: '1px solid rgba(102, 112, 133, 0.2)',
  }

  const normalized = (status || '').toLowerCase()

  if (normalized === 'in stock' || normalized === 'in_stock' || variant === 'success') {
    badgeStyle = {
      background: 'rgba(22, 163, 74, 0.12)',
      color: '#15803D',
      border: '1px solid rgba(22, 163, 74, 0.25)',
    }
  } else if (normalized === 'low stock' || normalized === 'low_stock' || variant === 'warning') {
    badgeStyle = {
      background: 'rgba(217, 119, 6, 0.12)',
      color: '#B45309',
      border: '1px solid rgba(217, 119, 6, 0.25)',
    }
  } else if (normalized === 'out of stock' || normalized === 'out_of_stock' || variant === 'error') {
    badgeStyle = {
      background: 'rgba(220, 38, 38, 0.12)',
      color: '#B91C1C',
      border: '1px solid rgba(220, 38, 38, 0.25)',
    }
  } else if (normalized === 'pending') {
    badgeStyle = {
      background: 'rgba(101, 84, 192, 0.14)',
      color: '#5542B2',
      border: '1px solid rgba(101, 84, 192, 0.3)',
    }
  } else if (normalized === 'approved') {
    badgeStyle = {
      background: 'rgba(59, 130, 246, 0.14)',
      color: '#2563EB',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    }
  } else if (normalized === 'fulfilled') {
    badgeStyle = {
      background: 'rgba(13, 148, 136, 0.14)',
      color: '#0F766E',
      border: '1px solid rgba(13, 148, 136, 0.3)',
    }
  } else if (normalized === 'rejected') {
    badgeStyle = {
      background: 'rgba(220, 38, 38, 0.1)',
      color: '#B91C1C',
      border: '1px solid rgba(220, 38, 38, 0.25)',
    }
  }

  const sizeClasses = size === 'xs'
    ? 'text-xs px-2 py-0.5'
    : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide transition-colors ${sizeClasses}`}
      style={badgeStyle}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: 'currentColor' }}
      />
      {status}
    </span>
  )
}

/**
 * SiteBadge Component
 * Differentiates Service Centre vs Distribution requisitions.
 */
export function SiteBadge({ site }) {
  const isService = site === 'Service Centre'

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded"
      style={{
        backgroundColor: isService ? 'rgba(101, 84, 192, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        color: isService ? 'var(--cs-purple-deep)' : 'var(--cs-accent-blue)',
        border: `1px solid ${isService ? 'rgba(101, 84, 192, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
      }}
    >
      {site}
    </span>
  )
}
