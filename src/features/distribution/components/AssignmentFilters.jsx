import { RotateCcw, Search, X } from 'lucide-react'
import { STATUS_OPTIONS } from '../data/distributionMockData'

export default function AssignmentFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) {
  const isFiltered = searchTerm.trim().length > 0 || statusFilter !== 'All'

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* Search Bar */}
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by ID, material, source, or destination..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs / Select & Reset */}
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        {/* Status Pills */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
          {STATUS_OPTIONS.map((status) => {
            const active = statusFilter === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            )
          })}
        </div>

        {/* Reset Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            title="Reset search and filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* Count Badge */}
        <div className="whitespace-nowrap rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          Showing <span className="font-semibold text-slate-900">{filteredCount}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalCount}</span>
        </div>
      </div>
    </div>
  )
}
