import { CheckCircle2, Clock, Eye, PackageX, Truck } from 'lucide-react'

export default function AssignmentTable({
  assignments,
  onViewDetails,
  onResetFilters,
  isFiltered,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        )
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 border border-sky-200">
            <Truck className="h-3 w-3" />
            In Transit
          </span>
        )
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        )
      case 'Cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
            Cancelled
          </span>
        )
    }
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <PackageX className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-900">
          No assignments found
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          {isFiltered
            ? 'No movement records matched your search query or selected status filter.'
            : 'No distribution assignments have been logged in the system yet.'}
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition"
          >
            Clear Search & Filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
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
          <tbody className="divide-y divide-slate-100">
            {assignments.map((assignment) => (
              <tr
                key={assignment.id}
                className="hover:bg-slate-50/75 transition-colors"
              >
                <td className="whitespace-nowrap px-4 py-3.5 font-mono font-medium text-indigo-600">
                  {assignment.id}
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-900">
                  <div>
                    <span>{assignment.material}</span>
                    {assignment.priority === 'Urgent' && (
                      <span className="ml-2 inline-flex items-center rounded bg-rose-50 px-1.5 py-0.2 text-[10px] font-medium text-rose-600 border border-rose-200">
                        Urgent
                      </span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right font-medium text-slate-800">
                  {assignment.quantity.toLocaleString()} {assignment.unit}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                  {assignment.source}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                  {assignment.destination}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">
                  {assignment.assignedDate}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  {getStatusBadge(assignment.status)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails(assignment)}
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition"
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
