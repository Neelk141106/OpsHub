import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  Boxes,
  PieChart as PieIcon,
  Activity,
  PackageCheck,
} from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { formatCurrency } from '../utils/formatters'

const PALETTE = {
  purple: '#6554C0',
  deepPurple: '#4F46A5',
  blue: '#3B82F6',
  teal: '#0D9488',
  green: '#16A34A',
  amber: '#D97706',
  red: '#DC2626',
}

const CATEGORY_COLORS = [
  '#6554C0',
  '#3B82F6',
  '#0D9488',
  '#D97706',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
]

export function CentralStoresAnalyticsView() {
  const items = useCentralStoresStore((state) => state.items)
  const requests = useCentralStoresStore((state) => state.requests)
  const movements = useCentralStoresStore((state) => state.movements)

  // 1. Category Distribution (Valuation & Item Count)
  const categoryData = useMemo(() => {
    const map = {}
    items.forEach((item) => {
      const cat = item.category || 'Other'
      if (!map[cat]) {
        map[cat] = { category: cat, count: 0, totalValuation: 0, totalQuantity: 0 }
      }
      map[cat].count += 1
      map[cat].totalQuantity += item.quantity
      map[cat].totalValuation += item.quantity * item.unitPrice
    })
    return Object.values(map).sort((a, b) => b.totalValuation - a.totalValuation)
  }, [items])

  // 2. Inventory Health Breakdown (In Stock vs Low Stock vs Out of Stock)
  const stockHealthData = useMemo(() => {
    let inStock = 0
    let lowStock = 0
    let outOfStock = 0

    items.forEach((item) => {
      if (item.quantity === 0) {
        outOfStock += 1
      } else if (item.quantity <= item.minStock) {
        lowStock += 1
      } else {
        inStock += 1
      }
    })

    return [
      { name: 'Optimal Stock', value: inStock, color: PALETTE.green },
      { name: 'Low Stock Alert', value: lowStock, color: PALETTE.amber },
      { name: 'Critical Zero', value: outOfStock, color: PALETTE.red },
    ].filter((entry) => entry.value > 0)
  }, [items])

  // 3. Request Status Distribution
  const requestStatusData = useMemo(() => {
    const counts = { Pending: 0, Approved: 0, Fulfilled: 0, Rejected: 0 }
    requests.forEach((r) => {
      if (counts[r.status] !== undefined) {
        counts[r.status] += 1
      }
    })

    return [
      { name: 'Pending Review', value: counts.Pending, color: PALETTE.amber },
      { name: 'Approved', value: counts.Approved, color: PALETTE.blue },
      { name: 'Fulfilled', value: counts.Fulfilled, color: PALETTE.green },
      { name: 'Rejected', value: counts.Rejected, color: PALETTE.red },
    ]
  }, [requests])

  // 4. Movement Type Volume
  const movementVolumeData = useMemo(() => {
    const map = {}
    movements.forEach((m) => {
      const label =
        m.type === 'INITIAL_INTAKE'
          ? 'Depot Setup'
          : m.type === 'ITEM_CREATED'
          ? 'Catalog Add'
          : m.type === 'INBOUND_RESTOCK'
          ? 'Inbound Restock'
          : m.type === 'OUTBOUND_DISPATCH'
          ? 'Outbound Dispatch'
          : m.type
      map[label] = (map[label] || 0) + 1
    })

    return Object.entries(map).map(([name, count]) => ({
      name,
      operations: count,
    }))
  }, [movements])

  // 5. Executive Highlights
  const totalValuation = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
  }, [items])

  const fulfilledRatio = useMemo(() => {
    if (requests.length === 0) return 0
    const fulfilled = requests.filter((r) => r.status === 'Fulfilled').length
    return Math.round((fulfilled / requests.length) * 100)
  }, [requests])

  const highestValuationCategory = categoryData[0]?.category || 'N/A'

  return (
    <div className="space-y-6">
      {/* View Header Banner */}
      <div
        className="rounded-xl p-5 transition-all"
        style={{
          backgroundColor: 'var(--cs-bg-card)',
          border: '1px solid var(--cs-border)',
          boxShadow: 'var(--cs-shadow-sm)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: 'rgba(101, 84, 192, 0.12)',
                color: 'var(--cs-purple-primary)',
              }}
            >
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--cs-text-primary)' }}>
                Central Stores Operational Analytics &amp; Reporting
              </h2>
              <p className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
                Derived directly from current store catalog, audit movement ledger, and cross-site requisition queue.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium"
              style={{
                backgroundColor: 'rgba(13, 148, 136, 0.12)',
                color: 'var(--cs-teal)',
                border: '1px solid rgba(13, 148, 136, 0.25)',
              }}
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Dynamic In-Memory Computation
            </span>
          </div>
        </div>

        {/* 4 Executive Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t" style={{ borderColor: 'var(--cs-border-subtle)' }}>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--cs-bg-elevated)', border: '1px solid var(--cs-border-subtle)' }}>
            <span className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--cs-text-secondary)' }}>
              Total Capital Asset Worth
            </span>
            <span className="text-xl font-bold font-mono" style={{ color: 'var(--cs-text-primary)' }}>
              {formatCurrency(totalValuation)}
            </span>
            <span className="text-[11px] block mt-1" style={{ color: 'var(--cs-text-muted)' }}>
              Across {items.length} active inventory SKUs
            </span>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--cs-bg-elevated)', border: '1px solid var(--cs-border-subtle)' }}>
            <span className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--cs-text-secondary)' }}>
              Top Capital Category
            </span>
            <span className="text-sm font-bold truncate block" style={{ color: 'var(--cs-purple-deep)' }} title={highestValuationCategory}>
              {highestValuationCategory}
            </span>
            <span className="text-[11px] block mt-1" style={{ color: 'var(--cs-text-muted)' }}>
              Valued at {categoryData[0] ? formatCurrency(categoryData[0].totalValuation) : '$0'}
            </span>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--cs-bg-elevated)', border: '1px solid var(--cs-border-subtle)' }}>
            <span className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--cs-text-secondary)' }}>
              Requisition Clearance Rate
            </span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {fulfilledRatio}%
            </span>
            <span className="text-[11px] block mt-1" style={{ color: 'var(--cs-text-muted)' }}>
              {requests.filter((r) => r.status === 'Fulfilled').length} of {requests.length} requests fulfilled
            </span>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--cs-bg-elevated)', border: '1px solid var(--cs-border-subtle)' }}>
            <span className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--cs-text-secondary)' }}>
              Audit History Transactions
            </span>
            <span className="text-xl font-bold font-mono" style={{ color: 'var(--cs-accent-blue)' }}>
              {movements.length}
            </span>
            <span className="text-[11px] block mt-1" style={{ color: 'var(--cs-text-muted)' }}>
              Logged across intake and dispatches
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 1: Stock Distribution by Category & Stock Health Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Valuation Bar Chart */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: 'var(--cs-bg-card)',
            border: '1px solid var(--cs-border)',
            boxShadow: 'var(--cs-shadow-sm)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold" style={{ color: 'var(--cs-text-primary)' }}>
                Stock Valuation by Category ($)
              </h3>
            </div>
            <span className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
              {categoryData.length} categories
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
              >
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: 'var(--cs-text-secondary)' }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'var(--cs-text-secondary)' }}
                  tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), 'Valuation']}
                  contentStyle={{
                    backgroundColor: 'var(--cs-bg-card)',
                    borderColor: 'var(--cs-border)',
                    borderRadius: '8px',
                    color: 'var(--cs-text-primary)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="totalValuation" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Status Health Donut Chart */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: 'var(--cs-bg-card)',
            border: '1px solid var(--cs-border)',
            boxShadow: 'var(--cs-shadow-sm)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm font-bold" style={{ color: 'var(--cs-text-primary)' }}>
                Inventory Health Breakdown
              </h3>
            </div>
            <span className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
              {items.length} items evaluated
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stockHealthData.map((entry, index) => (
                    <Cell key={`cell-health-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} SKUs`, name]}
                  contentStyle={{
                    backgroundColor: 'var(--cs-bg-card)',
                    borderColor: 'var(--cs-border)',
                    borderRadius: '8px',
                    color: 'var(--cs-text-primary)',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => (
                    <span style={{ color: 'var(--cs-text-secondary)', fontSize: '11px', fontWeight: 500 }}>
                      {val}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: Request Status Distribution & Movement Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Status Distribution */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: 'var(--cs-bg-card)',
            border: '1px solid var(--cs-border)',
            boxShadow: 'var(--cs-shadow-sm)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold" style={{ color: 'var(--cs-text-primary)' }}>
                Cross-Site Request Pipeline
              </h3>
            </div>
            <span className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
              Service Centre &amp; Distribution
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={requestStatusData}
                margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--cs-text-secondary)' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: 'var(--cs-text-secondary)' }}
                />
                <Tooltip
                  formatter={(val) => [`${val} requests`, 'Volume']}
                  contentStyle={{
                    backgroundColor: 'var(--cs-bg-card)',
                    borderColor: 'var(--cs-border)',
                    borderRadius: '8px',
                    color: 'var(--cs-text-primary)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`cell-req-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Movement Operations Volume */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: 'var(--cs-bg-card)',
            border: '1px solid var(--cs-border)',
            boxShadow: 'var(--cs-shadow-sm)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold" style={{ color: 'var(--cs-text-primary)' }}>
                Audit Movement Ledger by Operation Type
              </h3>
            </div>
            <span className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
              {movements.length} total events
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={movementVolumeData}
                margin={{ top: 10, right: 20, left: 25, bottom: 10 }}
              >
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: 'var(--cs-text-secondary)' }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: 'var(--cs-text-secondary)' }}
                  width={90}
                />
                <Tooltip
                  formatter={(val) => [`${val} transactions`, 'Logged']}
                  contentStyle={{
                    backgroundColor: 'var(--cs-bg-card)',
                    borderColor: 'var(--cs-border)',
                    borderRadius: '8px',
                    color: 'var(--cs-text-primary)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="operations" fill="var(--cs-accent-blue)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
