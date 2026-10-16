import React from 'react'
import {
  Package,
  AlertTriangle,
  Clock,
  CircleDollarSign,
  ArrowUpRight,
} from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { formatCurrency, formatNumber } from '../utils/formatters'

export function KpiCardsGrid() {
  const items = useCentralStoresStore((state) => state.items)
  const requests = useCentralStoresStore((state) => state.requests)
  const getKpis = useCentralStoresStore((state) => state.getKpis)
  const kpis = React.useMemo(() => {
    void items
    void requests
    return getKpis()
  }, [items, requests, getKpis])
  const setActiveView = useCentralStoresStore((state) => state.setActiveView)
  const setSelectedStatus = useCentralStoresStore((state) => state.setSelectedStatus)

  const cards = [
    {
      id: 'kpi-total-items',
      title: 'Total Inventory Items',
      value: formatNumber(kpis.totalItems),
      subtitle: `${kpis.totalItems} distinct catalog SKUs`,
      icon: Package,
      iconColor: 'var(--cs-purple-primary)',
      iconBg: 'rgba(101, 84, 192, 0.12)',
      badge: 'Depot Active',
      badgeColor: 'rgba(101, 84, 192, 0.15)',
      badgeText: 'var(--cs-purple-deep)',
      onClick: () => {
        setActiveView('inventory')
        setSelectedStatus('all')
      },
    },
    {
      id: 'kpi-low-stock',
      title: 'Low-Stock Alerts',
      value: formatNumber(kpis.lowStockCount),
      subtitle: kpis.outOfStockCount > 0
        ? `${kpis.outOfStockCount} critical out-of-stock items`
        : 'All items above critical zero',
      icon: AlertTriangle,
      iconColor: kpis.lowStockCount > 0 ? 'var(--cs-warning)' : 'var(--cs-success)',
      iconBg: kpis.lowStockCount > 0 ? 'rgba(217, 119, 6, 0.12)' : 'rgba(22, 163, 74, 0.12)',
      badge: kpis.lowStockCount > 0 ? 'Action Needed' : 'Healthy',
      badgeColor: kpis.lowStockCount > 0 ? 'rgba(217, 119, 6, 0.15)' : 'rgba(22, 163, 74, 0.15)',
      badgeText: kpis.lowStockCount > 0 ? '#B45309' : '#15803D',
      onClick: () => {
        setActiveView('inventory')
        setSelectedStatus('low_stock')
      },
    },
    {
      id: 'kpi-pending-requests',
      title: 'Pending Requisitions',
      value: formatNumber(kpis.pendingRequestsCount),
      subtitle: 'Awaiting review & approval gate',
      icon: Clock,
      iconColor: 'var(--cs-accent-blue)',
      iconBg: 'rgba(59, 130, 246, 0.12)',
      badge: kpis.pendingRequestsCount > 0 ? 'Queue Active' : 'Clear',
      badgeColor: 'rgba(59, 130, 246, 0.15)',
      badgeText: '#2563EB',
      onClick: () => {
        setActiveView('requests')
      },
    },
    {
      id: 'kpi-valuation',
      title: 'Total Stock Valuation',
      value: formatCurrency(kpis.totalValuation),
      subtitle: 'Cumulative on-hand asset worth',
      icon: CircleDollarSign,
      iconColor: 'var(--cs-teal)',
      iconBg: 'rgba(13, 148, 136, 0.12)',
      badge: 'Live Valuation',
      badgeColor: 'rgba(13, 148, 136, 0.15)',
      badgeText: '#0F766E',
      onClick: () => {
        setActiveView('inventory')
      },
    },
  ]

  return (
    <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            id={card.id}
            onClick={card.onClick}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                card.onClick()
              }
            }}
            className="group relative rounded-xl p-5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)] hover:-translate-y-0.5"
            style={{
              backgroundColor: 'var(--cs-bg-card)',
              border: '1px solid var(--cs-border)',
              boxShadow: 'var(--cs-shadow-sm)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{ backgroundColor: card.iconBg, color: card.iconColor }}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ backgroundColor: card.badgeColor, color: card.badgeText }}
              >
                {card.badge}
              </span>
            </div>

            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: 'var(--cs-text-secondary)' }}
              >
                {card.title}
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="text-2xl sm:text-[26px] font-bold tracking-tight"
                  style={{ color: 'var(--cs-text-primary)' }}
                >
                  {card.value}
                </span>
              </div>
              <p
                className="text-xs truncate flex items-center gap-1"
                style={{ color: 'var(--cs-text-muted)' }}
              >
                <span>{card.subtitle}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
