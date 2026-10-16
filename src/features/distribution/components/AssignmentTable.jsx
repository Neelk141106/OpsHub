import { CheckCircle2, Clock, Eye, PackageX, Truck } from 'lucide-react'
import { useTheme } from '../context/useTheme'

export default function AssignmentTable({
  assignments,
  onViewDetails,
  onResetFilters,
  isFiltered,
}) {
  const { isDark } = useTheme()

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <Clock className="h-3 w-3" />
            Pending
          </span>
        )
      case 'In Transit':
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-sky-950/40 text-sky-300 border-sky-800/50'
                : 'bg-sky-50 text-sky-700 border-sky-200'
            }`}
          >
            <Truck className="h-3 w-3" />
            In Transit
          </span>
        )
      case 'Completed':
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        )
      case 'Cancelled':
      default:
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-slate-800 text-[#A6ADC4] border-slate-700'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            Cancelled
          </span>
        )
    }
  }

  if (assignments.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center shadow-sm transition-colors duration-200 ${
          isDark
            ? 'border-[#2E334D] bg-[#222538]'
            : 'border-slate-300 bg-white'
        }`}
      >
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
            isDark ? 'bg-[#1B1E2E] text-[#A6ADC4]' : 'bg-slate-100 text-slate-400'
          }`}
        >
          <PackageX className="h-6 w-6" />
        </div>
        <h3
          className={`mt-3 text-sm font-semibold transition-colors ${
            isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'
          }`}
        >
          No assignments found
        </h3>
        <p
          className={`mt-1 max-w-sm text-xs transition-colors ${
            isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
          }`}
        >
          {isFiltered
            ? 'No movement records matched your search query or selected status filter.'
            : 'No distribution assignments have been logged in the system yet.'}
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className={`mt-4 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] ${
              isDark
                ? 'bg-[#5B4BE8]/15 text-[#B9ADFF] hover:bg-[#5B4BE8]/25'
                : 'bg-indigo-50 text-[#5B4BE8] hover:bg-indigo-100'
            }`}
          >
            Clear Search & Filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-sm transition-colors duration-200 ${
        isDark
          ? 'border-[#2E334D] bg-[#222538]'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead
            className={`border-b text-[11px] font-semibold uppercase tracking-wider transition-colors ${
              isDark
                ? 'border-[#2E334D] bg-[#1B1E2E] text-[#A6ADC4]'
                : 'border-slate-200 bg-slate-50/75 text-slate-500'
            }`}
          >
            <tr>
              <th scope="col" className="px-4 py-3">Assignment ID</th>
              <th scope="col" className="px-4 py-3">Material / Item</th>
              <th scope="col" className="px-4 py-3 text-right">Quantity</th>
              <th scope="col" className="px-4 py-3">Source Site</th>
              <th scope="col" className="px-4 py-3">Destination Hub</th>
              <th scope="col" className="px-4 py-3">Assigned Date</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y transition-colors ${
              isDark ? 'divide-[#2E334D]' : 'divide-slate-100'
            }`}
          >
            {assignments.map((assignment) => (
              <tr
                key={assignment.id}
                className={`transition-colors duration-150 ${
                  isDark ? 'hover:bg-[#2A2E44]/60' : 'hover:bg-slate-50/75'
                }`}
              >
                <td
                  className={`whitespace-nowrap px-4 py-3.5 font-mono font-medium transition-colors ${
                    isDark ? 'text-[#B9ADFF]' : 'text-[#5B4BE8]'
                  }`}
                >
                  {assignment.id}
                </td>
                <td
                  className={`px-4 py-3.5 font-medium transition-colors ${
                    isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'
                  }`}
                >
                  <div>
                    <span>{assignment.material}</span>
                    {assignment.priority === 'Urgent' && (
                      <span className="ml-2 inline-flex items-center rounded bg-rose-50 px-1.5 py-0.2 text-[10px] font-medium text-rose-600 border border-rose-200">
                        Urgent
                      </span>
                    )}
                  </div>
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3.5 text-right font-medium transition-colors ${
                    isDark ? 'text-[#F2F3FA]' : 'text-slate-800'
                  }`}
                >
                  {assignment.quantity.toLocaleString()} {assignment.unit}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3.5 transition-colors ${
                    isDark ? 'text-[#A6ADC4]' : 'text-slate-600'
                  }`}
                >
                  {assignment.source}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3.5 transition-colors ${
                    isDark ? 'text-[#A6ADC4]' : 'text-slate-600'
                  }`}
                >
                  {assignment.destination}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3.5 transition-colors ${
                    isDark ? 'text-[#A6ADC4]/80' : 'text-slate-500'
                  }`}
                >
                  {assignment.assignedDate}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  {getStatusBadge(assignment.status)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails(assignment)}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] ${
                      isDark
                        ? 'text-[#A6ADC4] hover:bg-[#1B1E2E] hover:text-[#B9ADFF]'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#5B4BE8]'
                    }`}
                    title="View assignment details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
