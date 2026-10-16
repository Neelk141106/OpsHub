import React, { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Truck,
  ShieldAlert,
  ArrowRightLeft,
  FileQuestion,
  Search,
  X,
  Filter,
  Download,
  RotateCcw,
} from 'lucide-react'
import { useCentralStoresStore } from '../store/useCentralStoresStore'
import { REQUESTING_SITES } from '../data/mockCentralStoresData'
import { StatusBadge, SiteBadge } from './StatusBadge'
import { formatDateTime, formatNumber } from '../utils/formatters'
import { exportRequestsToCsv, downloadCsvFile } from '../utils/csvExport'

export function RequestManagementView() {
  const requests = useCentralStoresStore((state) => state.requests)
  const items = useCentralStoresStore((state) => state.items)
  const approveRequest = useCentralStoresStore((state) => state.approveRequest)
  const fulfillRequest = useCentralStoresStore((state) => state.fulfillRequest)
  const setRejectingRequestId = useCentralStoresStore((state) => state.setRejectingRequestId)
  const setNewRequestModalOpen = useCentralStoresStore((state) => state.setNewRequestModalOpen)

  const searchQuery = useCentralStoresStore((state) => state.requestSearchQuery)
  const setSearchQuery = useCentralStoresStore((state) => state.setRequestSearchQuery)
  const siteFilter = useCentralStoresStore((state) => state.requestSiteFilter)
  const setSiteFilter = useCentralStoresStore((state) => state.setRequestSiteFilter)
  const clearRequestFilters = useCentralStoresStore((state) => state.clearRequestFilters)

  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRequests = React.useMemo(() => {
    void requests
    void searchQuery
    void siteFilter
    void statusFilter

    const query = searchQuery.trim().toLowerCase()
    return requests.filter((req) => {
      const matchesStatus =
        statusFilter === 'all' || req.status.toLowerCase() === statusFilter.toLowerCase()

      const matchesSearch =
        !query ||
        req.id.toLowerCase().includes(query) ||
        req.itemName.toLowerCase().includes(query) ||
        req.itemSku.toLowerCase().includes(query) ||
        req.requester.toLowerCase().includes(query)

      const matchesSite =
        siteFilter === 'All Sites' || req.requestingSite === siteFilter

      return matchesStatus && matchesSearch && matchesSite
    })
  }, [requests, searchQuery, siteFilter, statusFilter])

  // Detect any requests where current stock is below requested quantity
  const tightRequests = requests.filter((req) => {
    if (req.status === 'Fulfilled' || req.status === 'Rejected') return false
    const item = items.find((i) => i.id === req.itemId)
    return item && item.quantity < req.requestedQuantity
  })

  const hasActiveFilters = Boolean(searchQuery) || siteFilter !== 'All Sites' || statusFilter !== 'all'

  const handleClearAllFilters = () => {
    clearRequestFilters()
    setStatusFilter('all')
  }

  const handleExportCsv = () => {
    const csv = exportRequestsToCsv(filteredRequests)
    const dateStr = new Date().toISOString().split('T')[0]
    downloadCsvFile(`opshub-material-requests-${dateStr}.csv`, csv)
  }

  return (
    <div className="space-y-4">
      {/* Insufficient Stock Advisory Banner */}
      {tightRequests.length > 0 && (
        <div
          role="alert"
          className="p-4 rounded-xl flex items-start gap-3 text-xs"
          style={{
            backgroundColor: 'rgba(217, 119, 6, 0.08)',
            border: '1px solid rgba(217, 119, 6, 0.25)',
            color: '#B45309',
          }}
        >
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <div className="flex-1">
            <span className="font-bold text-sm block mb-0.5">
              Stock Sufficiency Advisory ({tightRequests.length} requisition{tightRequests.length > 1 ? 's' : ''})
            </span>
            <p>
              Current available depot stock is insufficient to fulfill {tightRequests.map((r) => r.id).join(', ')}.
              Per standard operating procedure, approval indicates allocation intent, but physical fulfilment will be blocked
              until stock is replenished to prevent negative inventory.
            </p>
          </div>
        </div>
      )}

      {/* Sub-toolbar: Search, Filters & Export */}
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
            id="requests-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requests by ID, requester, or material name..."
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent-blue)]"
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
              aria-label="Clear request search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Site Filter */}
          <div className="relative">
            <select
              id="requests-site-select"
              aria-label="Filter by Requesting Site"
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent-blue)]"
              style={{
                backgroundColor: 'var(--cs-input-bg)',
                border: '1px solid var(--cs-border)',
                color: 'var(--cs-text-primary)',
              }}
            >
              <option value="All Sites">All Requesting Sites</option>
              {REQUESTING_SITES.map((site) => (
                <option key={site} value={site}>
                  {site}
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
              id="btn-clear-request-filters"
              onClick={handleClearAllFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                color: 'var(--cs-accent-blue)',
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
            id="btn-export-requests-csv"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent-blue)]"
            style={{
              backgroundColor: 'var(--cs-bg-elevated)',
              border: '1px solid var(--cs-border)',
              color: 'var(--cs-text-secondary)',
            }}
            title="Export filtered requisitions to CSV"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Sub-toolbar: Request Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex p-1 rounded-lg text-xs font-medium"
          style={{
            backgroundColor: 'var(--cs-bg-card)',
            border: '1px solid var(--cs-border)',
          }}
        >
          {['all', 'Pending', 'Approved', 'Fulfilled', 'Rejected'].map((status) => {
            const count = requests.filter(
              (r) => status === 'all' || r.status.toLowerCase() === status.toLowerCase()
            ).length
            const isActive = statusFilter === status

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  isActive ? 'shadow-sm font-semibold' : ''
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--cs-bg-elevated)' : 'transparent',
                  color: isActive ? 'var(--cs-purple-deep)' : 'var(--cs-text-secondary)',
                }}
              >
                <span>{status === 'all' ? 'All Requests' : status}</span>
                <span
                  className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px]"
                  style={{
                    backgroundColor: isActive
                      ? 'var(--cs-purple-primary)'
                      : 'var(--cs-bg-elevated)',
                    color: isActive ? '#FFFFFF' : 'var(--cs-text-muted)',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="text-xs" style={{ color: 'var(--cs-text-muted)' }}>
          Showing <strong>{filteredRequests.length}</strong> of <strong>{requests.length}</strong> total requisitions
        </div>
      </div>

      {/* Requests Table */}
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
                  Req ID &amp; Created
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Requested Material
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Originating Site
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Requester
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  Requested Qty
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  Depot Stock
                </th>
                <th scope="col" className="px-4 py-3.5 text-center">
                  Status
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Workflow Action
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: 'var(--cs-border-subtle)' }}
            >
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => {
                  const item = items.find((i) => i.id === req.itemId)
                  const currentStock = item ? item.quantity : 0
                  const hasStock = currentStock >= req.requestedQuantity

                  return (
                    <tr
                      key={req.id}
                      id={`request-row-${req.id}`}
                      className="transition-colors hover:bg-[var(--cs-table-row-hover)]"
                    >
                      {/* Req ID & Date */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span
                            className="font-mono font-bold text-xs"
                            style={{ color: 'var(--cs-purple-deep)' }}
                          >
                            {req.id}
                          </span>
                          <span
                            className="text-[11px] mt-0.5"
                            style={{ color: 'var(--cs-text-muted)' }}
                          >
                            {formatDateTime(req.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Material Name & SKU */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span
                            className="font-semibold text-sm leading-snug"
                            style={{ color: 'var(--cs-text-primary)' }}
                          >
                            {req.itemName}
                          </span>
                          <span
                            className="font-mono text-xs mt-0.5"
                            style={{ color: 'var(--cs-text-muted)' }}
                          >
                            {req.itemSku}
                          </span>
                          {req.notes && (
                            <span
                              className="text-[11px] italic mt-1 line-clamp-1"
                              style={{ color: 'var(--cs-text-secondary)' }}
                              title={req.notes}
                            >
                              "{req.notes}"
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Originating Site */}
                      <td className="px-4 py-3.5">
                        <SiteBadge site={req.requestingSite} />
                      </td>

                      {/* Requester */}
                      <td className="px-4 py-3.5">
                        <span
                          className="text-xs font-medium"
                          style={{ color: 'var(--cs-text-primary)' }}
                        >
                          {req.requester}
                        </span>
                      </td>

                      {/* Requested Qty */}
                      <td className="px-4 py-3.5 text-right font-bold font-mono">
                        <span style={{ color: 'var(--cs-text-primary)' }}>
                          {formatNumber(req.requestedQuantity)}
                        </span>
                      </td>

                      {/* Current Available Depot Stock */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex flex-col items-end">
                          <span
                            className={`font-mono text-xs font-bold ${
                              hasStock
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {formatNumber(currentStock)} avail
                          </span>
                          {!hasStock && req.status !== 'Fulfilled' && (
                            <span className="text-[10px] text-red-500 font-medium">
                              Deficit: -{req.requestedQuantity - currentStock}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <StatusBadge status={req.status} />
                        {req.rejectionReason && (
                          <div
                            className="mt-1 text-[11px] text-red-600 dark:text-red-400 italic max-w-xs text-left mx-auto"
                            title={req.rejectionReason}
                          >
                            Reason: {req.rejectionReason}
                          </div>
                        )}
                        {req.fulfilledAt && (
                          <div
                            className="mt-0.5 text-[10px]"
                            style={{ color: 'var(--cs-text-muted)' }}
                          >
                            {formatDateTime(req.fulfilledAt)}
                          </div>
                        )}
                      </td>

                      {/* Workflow Actions */}
                      <td className="px-5 py-3.5 text-right">
                        {req.status === 'Pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => approveRequest(req.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-white transition-all hover:brightness-110 active:scale-95"
                              style={{ backgroundColor: 'var(--cs-accent-blue)' }}
                              title="Approve request (does not deduct stock yet)"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRejectingRequestId(req.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/10"
                              style={{
                                color: 'var(--cs-error)',
                                border: '1px solid rgba(220, 38, 38, 0.3)',
                              }}
                              title="Reject request with formal reason"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}

                        {req.status === 'Approved' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => fulfillRequest(req.id)}
                              disabled={!hasStock}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-all ${
                                !hasStock
                                  ? 'opacity-40 cursor-not-allowed'
                                  : 'hover:brightness-110 active:scale-95 shadow-sm'
                              }`}
                              style={{
                                backgroundColor: hasStock
                                  ? 'var(--cs-teal)'
                                  : 'var(--cs-text-muted)',
                              }}
                              title={
                                hasStock
                                  ? 'Fulfill and issue physical inventory'
                                  : `Blocked: Insufficient stock (${currentStock} available, ${req.requestedQuantity} requested)`
                              }
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Fulfill &amp; Issue</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRejectingRequestId(req.id)}
                              className="p-1 text-xs rounded hover:bg-black/5 text-gray-400 hover:text-red-500"
                              title="Cancel or revoke approval"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {req.status === 'Fulfilled' && (
                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium"
                            style={{ color: 'var(--cs-teal)' }}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Issued
                          </span>
                        )}

                        {req.status === 'Rejected' && (
                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium"
                            style={{ color: 'var(--cs-error)' }}
                          >
                            <XCircle className="w-4 h-4" />
                            Declined
                          </span>
                        )}
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
                        <FileQuestion className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <h3
                        className="text-base font-semibold mb-1"
                        style={{ color: 'var(--cs-text-primary)' }}
                      >
                        No Requisitions Found
                      </h3>
                      <p
                        className="text-xs mb-4 max-w-sm"
                        style={{ color: 'var(--cs-text-muted)' }}
                      >
                        There are currently no material requests matching the "{statusFilter}" status filter.
                      </p>
                      <button
                        type="button"
                        onClick={() => setNewRequestModalOpen(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg transition-all"
                        style={{ backgroundColor: 'var(--cs-accent-blue)' }}
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Log New Requisition</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
