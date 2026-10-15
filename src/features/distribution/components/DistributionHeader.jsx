import { Plus, RefreshCw, Truck } from 'lucide-react'

export default function DistributionHeader({ onNewAssignment, onRefresh, lastUpdated }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Truck className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Distribution</h1>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            Live Ops
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Monitor material assignments, movements, and consumption.
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {lastUpdated && (
          <span className="hidden lg:inline-flex text-xs text-slate-400">
            Updated {lastUpdated}
          </span>
        )}
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh assignment feed"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          onClick={onNewAssignment}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Assignment</span>
        </button>
      </div>
    </div>
  )
}
