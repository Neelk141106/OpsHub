import React from 'react'
import {
  History,
  Search,
  X,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  PackagePlus,
  Boxes,
  Download,
  RotateCcw,
} from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { MOVEMENT_TYPES } from '../data/mockCentralStoresData'
import { formatDateTime, formatNumber } from '../utils/formatters'
import { exportMovementsToCsv, downloadCsvFile } from '../utils/csvExport'

export function StockMovementsTable() {
  const movements = useCentralStoresStore((state) => state.movements)
  const searchQuery = useCentralStoresStore((state) => state.movementSearchQuery)
  const setSearchQuery = useCentralStoresStore((state) => state.setMovementSearchQuery)
  const filterType = useCentralStoresStore((state) => state.movementFilterType)
  const setFilterType = useCentralStoresStore((state) => state.setMovementFilterType)
  const clearFilters = useCentralStoresStore((state) => state.clearMovementFilters)

  // Memoize filtered movements to ensure stable React 19 / Zustand references
  const filteredMovements = React.useMemo(() => {
    void movements
    void searchQuery
    void filterType

    const query = searchQuery.trim().toLowerCase()
    return movements.filter((mov) => {
      const matchesSearch =
        !query ||
        mov.id.toLowerCase().includes(query) ||
        mov.itemName.toLowerCase().includes(query) ||
        mov.itemSku.toLowerCase().includes(query) ||
        (mov.reference && mov.reference.toLowerCase().includes(query)) ||
        (mov.operator && mov.operator.toLowerCase().includes(query)) ||
        (mov.site && mov.site.toLowerCase().includes(query))

      const matchesType =
        filterType === 'All Types' || mov.type === filterType

      return matchesSearch && matchesType
    })
  }, [movements, searchQuery, filterType])

  const handleExportCsv = () => {
    const csv = exportMovementsToCsv(filteredMovements)
    const dateStr = new Date().toISOString().split('T')[0]
    downloadCsvFile(`opshub-central-stores-movements-${dateStr}.csv`, csv)
  }

  const renderTypeBadge = (type) => {
    switch (type) {
      case 'INBOUND_RESTOCK':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'rgba(22, 163, 74, 0.12)',
              color: '#15803D',
              border: '1px solid rgba(22, 163, 74, 0.25)',
            }}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Inbound Restock
          </span>
        )
      case 'OUTBOUND_DISPATCH':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: '#2563EB',
              border: '1px solid rgba(59, 130, 246, 0.25)',
            }}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Outbound Dispatch
          </span>
        )
      case 'ITEM_CREATED':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'rgba(101, 84, 192, 0.12)',
              color: 'var(--cs-purple-deep)',
              border: '1px solid rgba(101, 84, 192, 0.25)',
            }}
          >
            <PackagePlus className="w-3.5 h-3.5" />
            Item Created
          </span>
        )
      case 'INITIAL_BASELINE':
      default:
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'var(--cs-bg-elevated)',
              color: 'var(--cs-text-secondary)',
              border: '1px solid var(--cs-border)',
            }}
          >
            <Boxes className="w-3.5 h-3.5" />
            Baseline Audit
          </span>
        )
    }
  }

  const hasActiveFilters = Boolean(searchQuery) || filterType !== 'All Types'

  return (
    <div className="space-y-4">
      {/* Search and Filter Sub-toolbar */}
      <div
        className="p-3.5 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-all"
        style={{
          backgroundColor: 'var(--cs-bg-card)',
          border: '1px solid var(--cs-border)',
          boxShadow: 'var(--cs-shadow-sm)',
        }}
      >
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--cs-text-muted)' }}
          />
          <input
            type="text"
            id="movements-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movement audit log by item, SKU, reference, operator..."
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
            style={{
              backgroundColor: 'var(--cs-input-bg)',
              border: '1px solid var(--cs-border)',
              color: 'var(--cs-text-primary)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: 'var(--cs-text-muted)' }}
              aria-label="Clear movement search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Movement Type Filter */}
          <div className="relative">
            <select
              id="movements-type-select"
              aria-label="Filter by Movement Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
              style={{
                backgroundColor: 'var(--cs-input-bg)',
                border: '1px solid var(--cs-border)',
                color: 'var(--cs-text-primary)',
              }}
            >
              {MOVEMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === 'All Types' ? 'All Movement Types' : type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <Filter
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: 'var(--cs-text-muted)' }}
            />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              id="btn-clear-movement-filters"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                color: 'var(--cs-purple-deep)',
                border: '1px dashed var(--cs-border)',
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Export CSV Button */}
          <button
            type="button"
            id="btn-export-movements-csv"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
            style={{
              backgroundColor: 'var(--cs-bg-elevated)',
              border: '1px solid var(--cs-border)',
              color: 'var(--cs-text-secondary)',
            }}
            title="Export filtered movement log to CSV"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Movement Table */}
      <div
        className="rounded-xl overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--cs-bg-card)',
          border: '1px solid var(--cs-border)',
          boxShadow: 'var(--cs-shadow-sm)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse" role="table">
            <thead>
              <tr
                className="border-b text-xs font-semibold uppercase tracking-wider select-none"
                style={{
                  backgroundColor: 'var(--cs-table-header-bg)',
                  borderColor: 'var(--cs-border)',
                  color: 'var(--cs-text-secondary)',
                }}
              >
                <th scope="col" className="px-5 py-3.5">
                  Timestamp &amp; ID
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Item Details
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Type
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  Quantity Delta
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  Depot Balance
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Reference &amp; Target
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Operator
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--cs-border-subtle)' }}>
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="max-w-xs mx-auto flex flex-col items-center justify-center text-center">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: 'var(--cs-bg-elevated)' }}
                      >
                        <History className="w-6 h-6" style={{ color: 'var(--cs-text-muted)' }} />
                      </div>
                      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--cs-text-primary)' }}>
                        No Movement Records Found
                      </h3>
                      <p className="text-xs mb-3" style={{ color: 'var(--cs-text-secondary)' }}>
                        {hasActiveFilters
                          ? 'No inventory transactions matched your search or type filter.'
                          : 'No stock movements have occurred yet.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: 'var(--cs-purple-primary)' }}
                        >
                          Clear Active Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMovements.map((mov) => {
                  const isPositive = mov.quantityChange > 0
                  return (
                    <tr
                      key={mov.id}
                      className="transition-colors hover:bg-[var(--cs-table-row-hover)]"
                    >
                      {/* Timestamp & ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold block" style={{ color: 'var(--cs-text-primary)' }}>
                          {mov.id}
                        </span>
                        <span className="text-[11px]" style={{ color: 'var(--cs-text-muted)' }}>
                          {formatDateTime(mov.timestamp)}
                        </span>
                      </td>

                      {/* Item Details */}
                      <td className="px-4 py-4">
                        <span className="font-medium text-sm block" style={{ color: 'var(--cs-text-primary)' }}>
                          {mov.itemName}
                        </span>
                        <span
                          className="inline-block mt-0.5 text-[11px] font-mono px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: 'var(--cs-bg-elevated)',
                            color: 'var(--cs-text-secondary)',
                            border: '1px solid var(--cs-border)',
                          }}
                        >
                          {mov.itemSku}
                        </span>
                      </td>

                      {/* Type Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {renderTypeBadge(mov.type)}
                      </td>

                      {/* Quantity Delta */}
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <span
                          className={`font-mono text-sm font-bold ${
                            isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {isPositive ? `+${formatNumber(mov.quantityChange)}` : formatNumber(mov.quantityChange)}
                        </span>
                      </td>

                      {/* Resulting Balance */}
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <span className="font-mono text-sm font-bold" style={{ color: 'var(--cs-text-primary)' }}>
                          {formatNumber(mov.resultingBalance)}
                        </span>
                        <span className="text-[11px] block" style={{ color: 'var(--cs-text-muted)' }}>
                          units in depot
                        </span>
                      </td>

                      {/* Reference & Target */}
                      <td className="px-4 py-4 text-xs">
                        <span className="font-mono font-medium block" style={{ color: 'var(--cs-text-primary)' }}>
                          {mov.reference || 'N/A'}
                        </span>
                        <span style={{ color: 'var(--cs-text-muted)' }}>
                          {mov.site || 'Central Depot'}
                        </span>
                      </td>

                      {/* Operator */}
                      <td className="px-4 py-4 text-xs whitespace-nowrap" style={{ color: 'var(--cs-text-secondary)' }}>
                        <span>{mov.operator || 'System'}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
