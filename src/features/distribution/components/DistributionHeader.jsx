import { Moon, Plus, RefreshCw, Sun, Truck } from 'lucide-react'
import { useTheme } from '../context/useTheme'

export default function DistributionHeader({ onNewAssignment, onRefresh, lastUpdated }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5 transition-colors duration-200 ${
        isDark ? 'border-[#2E334D]' : 'border-slate-200'
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
              isDark
                ? 'bg-[#5B4BE8]/15 text-[#B9ADFF] border-[#5B4BE8]/30'
                : 'bg-indigo-50 text-[#5B4BE8] border-indigo-100'
            }`}
          >
            <Truck className="h-5 w-5" />
          </div>
          <h1
            className={`text-2xl font-semibold tracking-tight transition-colors ${
              isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'
            }`}
          >
            Distribution
          </h1>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            Live Ops
          </span>
        </div>
        <p
          className={`mt-1 text-sm transition-colors ${
            isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
          }`}
        >
          Monitor material assignments, movements, and consumption.
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {lastUpdated && (
          <span
            className={`hidden lg:inline-flex text-xs transition-colors ${
              isDark ? 'text-[#A6ADC4]/70' : 'text-slate-400'
            }`}
          >
            Updated {lastUpdated}
          </span>
        )}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`inline-flex items-center justify-center h-8.5 w-8.5 rounded-lg border p-2 text-xs font-medium shadow-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] focus-visible:ring-offset-2 ${
            isDark
              ? 'border-[#2E334D] bg-[#222538] text-[#B9ADFF] hover:bg-[#2A2E44] hover:text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-[#17213A]'
          }`}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Refresh Feed Button */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh assignment feed"
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium shadow-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] focus-visible:ring-offset-2 ${
            isDark
              ? 'border-[#2E334D] bg-[#222538] text-[#F2F3FA] hover:bg-[#2A2E44]'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-[#17213A]'
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={onNewAssignment}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#5B4BE8] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#4D3DC9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] focus-visible:ring-offset-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>New Assignment</span>
        </button>
      </div>
    </div>
  )
}
