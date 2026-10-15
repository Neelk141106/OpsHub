import { RotateCcw, Search, X } from 'lucide-react'
import { STATUS_OPTIONS } from '../data/distributionMockData'
import { useTheme } from '../context/useTheme'

export default function AssignmentFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) {
  const { isDark } = useTheme()
  const isFiltered = searchTerm.trim().length > 0 || statusFilter !== 'All'

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-colors duration-200 md:flex-row md:items-center md:justify-between ${
        isDark
          ? 'border-[#2E334D] bg-[#222538]'
          : 'border-slate-200 bg-white'
      }`}
    >
      {/* Search Bar */}
      <div className="relative flex-1">
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors ${
            isDark ? 'text-[#A6ADC4]' : 'text-slate-400'
          }`}
        >
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by ID, material, source, or destination..."
          className={`w-full rounded-lg border py-2 pl-9 pr-9 text-xs shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 ${
            isDark
              ? 'border-[#2E334D] bg-[#1B1E2E] text-[#F2F3FA] placeholder:text-[#A6ADC4]/60 focus:border-[#B9ADFF] focus:ring-[#B9ADFF]'
              : 'border-slate-200 bg-slate-50/50 text-[#17213A] placeholder:text-slate-400 focus:border-[#5B4BE8] focus:bg-white focus:ring-[#5B4BE8]'
          }`}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className={`absolute inset-y-0 right-0 flex items-center pr-2.5 transition-colors ${
              isDark ? 'text-[#A6ADC4] hover:text-[#F2F3FA]' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs / Select & Reset */}
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        {/* Status Pills */}
        <div
          className={`flex items-center rounded-lg border p-1 text-xs transition-colors ${
            isDark ? 'border-[#2E334D] bg-[#1B1E2E]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          {STATUS_OPTIONS.map((status) => {
            const active = statusFilter === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors duration-150 ${
                  active
                    ? isDark
                      ? 'bg-[#222538] text-[#F2F3FA] shadow-sm border border-[#2E334D]'
                      : 'bg-white text-[#17213A] shadow-sm'
                    : isDark
                    ? 'text-[#A6ADC4] hover:text-[#F2F3FA]'
                    : 'text-slate-600 hover:text-[#17213A]'
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
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] ${
              isDark
                ? 'border-[#2E334D] bg-[#222538] text-[#A6ADC4] hover:bg-[#2A2E44] hover:text-[#F2F3FA]'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#17213A]'
            }`}
            title="Reset search and filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* Count Badge */}
        <div
          className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
            isDark ? 'bg-[#1B1E2E] text-[#A6ADC4]' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Showing{' '}
          <span className={`font-semibold ${isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'}`}>
            {filteredCount}
          </span>{' '}
          of{' '}
          <span className={`font-semibold ${isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'}`}>
            {totalCount}
          </span>
        </div>
      </div>
    </div>
  )
}
