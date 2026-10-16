import React from 'react'
import {
  Search,
  X,
  Filter,
  Plus,
  ArrowRightLeft,
  Boxes,
  FileText,
  RotateCcw,
  History,
  Upload,
  Download,
  BarChart3,
} from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { INVENTORY_CATEGORIES } from '../data/mockCentralStoresData'
import { exportInventoryToCsv, downloadCsvFile } from '../utils/csvExport'

export function TableToolbar() {
  const searchQuery = useCentralStoresStore((state) => state.searchQuery)
  const setSearchQuery = useCentralStoresStore((state) => state.setSearchQuery)

  const selectedCategory = useCentralStoresStore((state) => state.selectedCategory)
  const setSelectedCategory = useCentralStoresStore((state) => state.setSelectedCategory)

  const selectedStatus = useCentralStoresStore((state) => state.selectedStatus)
  const setSelectedStatus = useCentralStoresStore((state) => state.setSelectedStatus)

  const clearFilters = useCentralStoresStore((state) => state.clearFilters)

  const activeView = useCentralStoresStore((state) => state.activeView)
  const setActiveView = useCentralStoresStore((state) => state.setActiveView)

  const setAddItemModalOpen = useCentralStoresStore((state) => state.setAddItemModalOpen)
  const setNewRequestModalOpen = useCentralStoresStore((state) => state.setNewRequestModalOpen)
  const setImportModalOpen = useCentralStoresStore((state) => state.setImportModalOpen)
  const items = useCentralStoresStore((state) => state.items)

  const pendingRequestsCount = useCentralStoresStore(
    (state) => state.requests.filter((r) => r.status === 'Pending').length
  )
  const movementsCount = useCentralStoresStore(
    (state) => state.movements.length
  )

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategory !== 'All Categories' ||
    selectedStatus !== 'all'

  const handleExportInventoryCsv = () => {
    const csv = exportInventoryToCsv(items)
    const dateStr = new Date().toISOString().split('T')[0]
    downloadCsvFile(`opshub-inventory-catalog-${dateStr}.csv`, csv)
  }

  return (
    <div className="space-y-4 mb-4">
      {/* Top Bar: View Tabs and Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Central Stores Views"
          className="inline-flex p-1 rounded-xl self-start overflow-x-auto max-w-full"
          style={{
            backgroundColor: 'var(--cs-bg-elevated)',
            border: '1px solid var(--cs-border)',
          }}
        >
          <button
            role="tab"
            aria-selected={activeView === 'inventory'}
            onClick={() => setActiveView('inventory')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'inventory' ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: activeView === 'inventory' ? 'var(--cs-bg-card)' : 'transparent',
              color: activeView === 'inventory' ? 'var(--cs-purple-deep)' : 'var(--cs-text-secondary)',
              fontWeight: activeView === 'inventory' ? '600' : '500',
            }}
          >
            <Boxes className="w-4 h-4" />
            <span>Inventory Catalog</span>
          </button>

          <button
            role="tab"
            aria-selected={activeView === 'requests'}
            onClick={() => setActiveView('requests')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'requests' ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: activeView === 'requests' ? 'var(--cs-bg-card)' : 'transparent',
              color: activeView === 'requests' ? 'var(--cs-purple-deep)' : 'var(--cs-text-secondary)',
              fontWeight: activeView === 'requests' ? '600' : '500',
            }}
          >
            <FileText className="w-4 h-4" />
            <span>Material Requests</span>
            {pendingRequestsCount > 0 && (
              <span
                className="ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full"
                style={{
                  backgroundColor: 'var(--cs-purple-primary)',
                  color: '#FFFFFF',
                }}
              >
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            role="tab"
            aria-selected={activeView === 'movements'}
            onClick={() => setActiveView('movements')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'movements' ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: activeView === 'movements' ? 'var(--cs-bg-card)' : 'transparent',
              color: activeView === 'movements' ? 'var(--cs-purple-deep)' : 'var(--cs-text-secondary)',
              fontWeight: activeView === 'movements' ? '600' : '500',
            }}
          >
            <History className="w-4 h-4" />
            <span>Movement History</span>
            <span
              className="ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full"
              style={{
                backgroundColor: 'var(--cs-bg-elevated)',
                color: 'var(--cs-text-muted)',
                border: '1px solid var(--cs-border)',
              }}
            >
              {movementsCount}
            </span>
          </button>

          <button
            role="tab"
            aria-selected={activeView === 'analytics'}
            onClick={() => setActiveView('analytics')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'analytics' ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: activeView === 'analytics' ? 'var(--cs-bg-card)' : 'transparent',
              color: activeView === 'analytics' ? 'var(--cs-purple-deep)' : 'var(--cs-text-secondary)',
              fontWeight: activeView === 'analytics' ? '600' : '500',
            }}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics &amp; Trends</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {activeView === 'inventory' && (
            <>
              <button
                type="button"
                id="btn-import-csv"
                onClick={() => setImportModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-bg-elevated)',
                  border: '1px solid var(--cs-border)',
                  color: 'var(--cs-text-secondary)',
                }}
                title="Batch import inventory items from CSV"
              >
                <Upload className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Import CSV</span>
              </button>

              <button
                type="button"
                id="btn-export-inventory-csv"
                onClick={handleExportInventoryCsv}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-bg-elevated)',
                  border: '1px solid var(--cs-border)',
                  color: 'var(--cs-text-secondary)',
                }}
                title="Export catalog inventory to CSV"
              >
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </>
          )}

          <button
            type="button"
            id="btn-new-request"
            onClick={() => setNewRequestModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all hover:brightness-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent-blue)]"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: 'var(--cs-accent-blue)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>New Request</span>
          </button>

          <button
            type="button"
            id="btn-add-item"
            onClick={() => setAddItemModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-deep)]"
            style={{
              backgroundColor: 'var(--cs-purple-primary)',
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Shown prominently when in Inventory view) */}
      {activeView === 'inventory' && (
        <div
          className="p-3 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"
          style={{
            backgroundColor: 'var(--cs-bg-card)',
            border: '1px solid var(--cs-border)',
            boxShadow: 'var(--cs-shadow-sm)',
          }}
        >
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--cs-text-muted)' }}
            />
            <input
              type="text"
              id="inventory-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name or SKU (e.g. CS-ENC-1024)..."
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
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns and Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <div className="relative">
              <select
                id="inventory-category-select"
                aria-label="Filter by Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-3 pr-8 py-2 text-sm rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                style={{
                  backgroundColor: 'var(--cs-input-bg)',
                  border: '1px solid var(--cs-border)',
                  color: 'var(--cs-text-primary)',
                }}
              >
                {INVENTORY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Filter
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                style={{ color: 'var(--cs-text-muted)' }}
              />
            </div>

            {/* Status Filter */}
            <select
              id="inventory-status-select"
              aria-label="Filter by Stock Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
              style={{
                backgroundColor: 'var(--cs-input-bg)',
                border: '1px solid var(--cs-border)',
                color: 'var(--cs-text-primary)',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                id="btn-clear-filters"
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
          </div>
        </div>
      )}
    </div>
  )
}
