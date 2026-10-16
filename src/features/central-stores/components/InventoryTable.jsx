import React from 'react'
import {
  PackageOpen,
  ArrowRightLeft,
  PackagePlus,
  Pencil,
  MapPin,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { StatusBadge } from './StatusBadge'
import { formatCurrency, formatNumber, getStockStatus } from '../utils/formatters'

export function InventoryTable() {
  const items = useCentralStoresStore((state) => state.items)
  const getFilteredItems = useCentralStoresStore((state) => state.getFilteredItems)
  const clearFilters = useCentralStoresStore((state) => state.clearFilters)
  const openNewRequestWithItem = useCentralStoresStore((state) => state.openNewRequestWithItem)
  const setRestockingItem = useCentralStoresStore((state) => state.setRestockingItem)
  const setEditingItem = useCentralStoresStore((state) => state.setEditingItem)
  const setAddItemModalOpen = useCentralStoresStore((state) => state.setAddItemModalOpen)
  const searchQuery = useCentralStoresStore((state) => state.searchQuery)
  const selectedCategory = useCentralStoresStore((state) => state.selectedCategory)
  const selectedStatus = useCentralStoresStore((state) => state.selectedStatus)
  const sortColumn = useCentralStoresStore((state) => state.sortColumn)
  const sortDirection = useCentralStoresStore((state) => state.sortDirection)
  const setSorting = useCentralStoresStore((state) => state.setSorting)

  const filteredItems = React.useMemo(() => {
    void items
    void searchQuery
    void selectedCategory
    void selectedStatus
    void sortColumn
    void sortDirection
    return getFilteredItems()
  }, [items, searchQuery, selectedCategory, selectedStatus, sortColumn, sortDirection, getFilteredItems])

  const isFiltered =
    Boolean(searchQuery) ||
    selectedCategory !== 'All Categories' ||
    selectedStatus !== 'all'

  const renderSortIndicator = (column) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 ml-1 inline-block" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[var(--cs-purple-primary)] ml-1 inline-block" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[var(--cs-purple-primary)] ml-1 inline-block" />
    )
  }

  return (
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
              <th
                scope="col"
                onClick={() => setSorting('name')}
                className="px-5 py-3.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Sort by Item Name"
              >
                <div className="flex items-center gap-1">
                  <span>Item &amp; SKU</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => setSorting('category')}
                className="px-4 py-3.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Sort by Category"
              >
                <div className="flex items-center gap-1">
                  <span>Category</span>
                  {renderSortIndicator('category')}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => setSorting('quantity')}
                className="px-4 py-3.5 text-right cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Sort by Available Quantity"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Available Qty</span>
                  {renderSortIndicator('quantity')}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => setSorting('minStock')}
                className="px-4 py-3.5 text-right cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Sort by Minimum Threshold"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Min. Threshold</span>
                  {renderSortIndicator('minStock')}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => setSorting('unitPrice')}
                className="px-4 py-3.5 text-right cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Sort by Unit Price"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Unit Price</span>
                  {renderSortIndicator('unitPrice')}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => setSorting('totalValuation')}
                className="px-4 py-3.5 text-right cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Sort by Total Valuation"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Value</span>
                  {renderSortIndicator('totalValuation')}
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5 text-center">
                Stock Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: 'var(--cs-border-subtle)' }}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const status = getStockStatus(item.quantity, item.minStock)
                const totalItemValuation = item.quantity * item.unitPrice
                const isOut = item.quantity === 0
                const isLow = item.quantity > 0 && item.quantity <= item.minStock

                return (
                  <tr
                    key={item.id}
                    id={`inventory-row-${item.id}`}
                    className="transition-colors hover:bg-[var(--cs-table-row-hover)]"
                    style={{
                      backgroundColor: isOut
                        ? 'rgba(220, 38, 38, 0.02)'
                        : isLow
                        ? 'rgba(217, 119, 6, 0.02)'
                        : 'transparent',
                    }}
                  >
                    {/* Item Details */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span
                          className="font-semibold text-sm leading-snug"
                          style={{ color: 'var(--cs-text-primary)' }}
                        >
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="font-mono text-xs font-medium px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: 'var(--cs-bg-elevated)',
                              color: 'var(--cs-purple-deep)',
                              border: '1px solid var(--cs-border)',
                            }}
                          >
                            {item.sku}
                          </span>
                          {item.location && (
                            <span
                              className="inline-flex items-center gap-1 text-[11px]"
                              style={{ color: 'var(--cs-text-muted)' }}
                            >
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-block px-2.5 py-1 text-xs rounded-md font-medium"
                        style={{
                          backgroundColor: 'var(--cs-bg-elevated)',
                          color: 'var(--cs-text-secondary)',
                          border: '1px solid var(--cs-border-subtle)',
                        }}
                      >
                        {item.category}
                      </span>
                    </td>

                    {/* Available Quantity */}
                    <td className="px-4 py-3.5 text-right font-medium">
                      <span
                        className={`text-sm ${
                          isOut
                            ? 'font-bold text-red-600 dark:text-red-400'
                            : isLow
                            ? 'font-bold text-amber-600 dark:text-amber-400'
                            : ''
                        }`}
                        style={{
                          color: !isOut && !isLow ? 'var(--cs-text-primary)' : undefined,
                        }}
                      >
                        {formatNumber(item.quantity)}
                      </span>
                    </td>

                    {/* Minimum Stock Threshold */}
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className="text-xs font-mono font-medium"
                        style={{ color: 'var(--cs-text-muted)' }}
                      >
                        {formatNumber(item.minStock)}
                      </span>
                    </td>

                    {/* Unit Price */}
                    <td className="px-4 py-3.5 text-right font-mono text-sm">
                      <span style={{ color: 'var(--cs-text-primary)' }}>
                        {formatCurrency(item.unitPrice)}
                      </span>
                    </td>

                    {/* Total Valuation */}
                    <td className="px-4 py-3.5 text-right font-mono text-sm font-semibold">
                      <span style={{ color: 'var(--cs-text-primary)' }}>
                        {formatCurrency(totalItemValuation)}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5 text-center">
                      <StatusBadge status={status.label} variant={status.variant} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/10"
                          style={{
                            color: 'var(--cs-purple-deep)',
                            border: '1px solid rgba(101, 84, 192, 0.3)',
                          }}
                          title={`Edit item specifications for ${item.name}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRestockingItem(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/10"
                          style={{
                            color: 'var(--cs-teal)',
                            border: '1px solid rgba(13, 148, 136, 0.3)',
                          }}
                          title={`Intake inbound shipment for ${item.name}`}
                        >
                          <PackagePlus className="w-3.5 h-3.5" />
                          <span>Restock</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openNewRequestWithItem(item.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/10"
                          style={{
                            color: 'var(--cs-accent-blue)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                          }}
                          title={`Create requisition for ${item.name}`}
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Request</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 px-6 text-center">
                  <div className="max-w-md mx-auto flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: 'var(--cs-bg-elevated)',
                        color: 'var(--cs-text-muted)',
                      }}
                    >
                      <PackageOpen className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3
                      className="text-base font-semibold mb-1"
                      style={{ color: 'var(--cs-text-primary)' }}
                    >
                      {isFiltered
                        ? 'No Matching Inventory Items'
                        : 'Central Stores Catalog is Empty'}
                    </h3>
                    <p
                      className="text-xs mb-4 max-w-sm"
                      style={{ color: 'var(--cs-text-muted)' }}
                    >
                      {isFiltered
                        ? 'No items match your active search terms or filters. Try adjusting your query or resetting all filters.'
                        : 'No inventory items have been registered in Central Stores depot yet. Add your first item to begin tracking.'}
                    </p>
                    {isFiltered ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all"
                        style={{
                          backgroundColor: 'var(--cs-bg-elevated)',
                          color: 'var(--cs-purple-deep)',
                          border: '1px solid var(--cs-border)',
                        }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset All Filters</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAddItemModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all"
                        style={{ backgroundColor: 'var(--cs-purple-primary)' }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Add First Item</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div
        className="px-5 py-3 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-2"
        style={{
          borderColor: 'var(--cs-border)',
          backgroundColor: 'var(--cs-table-header-bg)',
          color: 'var(--cs-text-secondary)',
        }}
      >
        <span>
          Showing <strong>{filteredItems.length}</strong> catalog items
        </span>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            In Stock
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Low Stock (&le; threshold)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Out of Stock
          </span>
        </div>
      </div>
    </div>
  )
}
