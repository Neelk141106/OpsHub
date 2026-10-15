import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  Truck,
  X,
} from 'lucide-react'

export default function AssignmentDetailsModal({ assignment, onClose }) {
  if (!assignment) return null

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5" />
            Pending Dispatch
          </span>
        )
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 border border-sky-200">
            <Truck className="h-3.5 w-3.5" />
            In Transit
          </span>
        )
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </span>
        )
      case 'Cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-300">
            Cancelled
          </span>
        )
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-indigo-600">
                {assignment.id}
              </span>
              {getStatusBadge(assignment.status)}
            </div>
            <h2 className="mt-1 text-base font-semibold text-slate-900">
              {assignment.material}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            title="Close details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-4 text-xs text-slate-600">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <span className="text-slate-400 font-medium">Quantity Allocated</span>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {assignment.quantity} {assignment.unit}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <span className="text-slate-400 font-medium">Priority Rating</span>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {assignment.priority || 'Normal'}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 p-3.5 space-y-2.5">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400">Origin / Source Site:</span>
                <p className="font-medium text-slate-800">{assignment.source}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 border-t border-slate-100 pt-2.5">
              <MapPin className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400">Destination Hub:</span>
                <p className="font-medium text-slate-800">{assignment.destination}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div>
                <span className="text-slate-400 block">Assigned Date</span>
                <span className="font-medium text-slate-800">{assignment.assignedDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-slate-400" />
              <div>
                <span className="text-slate-400 block">Assigned Carrier</span>
                <span className="font-medium text-slate-800">{assignment.carrier || 'Pending Assignment'}</span>
              </div>
            </div>
          </div>

          {assignment.trackingNumber && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-500">Tracking Reference:</span>
              <span className="font-mono font-medium text-slate-800">
                {assignment.trackingNumber}
              </span>
            </div>
          )}

          {assignment.notes && (
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="font-medium text-slate-500 block mb-1">Operational Notes:</span>
              <p className="text-slate-700 leading-relaxed">{assignment.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}
