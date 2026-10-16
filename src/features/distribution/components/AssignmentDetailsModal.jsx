import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  Truck,
  X,
} from 'lucide-react'
import { useTheme } from '../context/useTheme'

export default function AssignmentDetailsModal({ assignment, onClose }) {
  const { isDark } = useTheme()
  if (!assignment) return null

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Pending Dispatch
          </span>
        )
      case 'In Transit':
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-sky-950/40 text-sky-300 border-sky-800/50'
                : 'bg-sky-50 text-sky-700 border-sky-200'
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            In Transit
          </span>
        )
      case 'Completed':
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </span>
        )
      case 'Cancelled':
      default:
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-slate-800 text-[#A6ADC4] border-slate-700'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            Cancelled
          </span>
        )
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-xl transition-all ${
          isDark
            ? 'border-[#2E334D] bg-[#222538] text-[#F2F3FA]'
            : 'border-slate-200 bg-white text-[#17213A]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between border-b pb-4 transition-colors ${
            isDark ? 'border-[#2E334D]' : 'border-slate-100'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-sm font-semibold transition-colors ${
                  isDark ? 'text-[#B9ADFF]' : 'text-[#5B4BE8]'
                }`}
              >
                {assignment.id}
              </span>
              {getStatusBadge(assignment.status)}
            </div>
            <h2
              className={`mt-1 text-base font-semibold transition-colors ${
                isDark ? 'text-[#F2F3FA]' : 'text-slate-900'
              }`}
            >
              {assignment.material}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] ${
              isDark
                ? 'text-[#A6ADC4] hover:bg-[#1B1E2E] hover:text-[#F2F3FA]'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
            title="Close details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`rounded-lg border p-3 transition-colors ${
                isDark
                  ? 'border-[#2E334D] bg-[#1B1E2E]'
                  : 'border-slate-100 bg-slate-50/70'
              }`}
            >
              <span
                className={`font-medium transition-colors ${
                  isDark ? 'text-[#A6ADC4]' : 'text-slate-400'
                }`}
              >
                Quantity Allocated
              </span>
              <p
                className={`mt-1 text-sm font-bold transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-slate-900'
                }`}
              >
                {assignment.quantity} {assignment.unit}
              </p>
            </div>
            <div
              className={`rounded-lg border p-3 transition-colors ${
                isDark
                  ? 'border-[#2E334D] bg-[#1B1E2E]'
                  : 'border-slate-100 bg-slate-50/70'
              }`}
            >
              <span
                className={`font-medium transition-colors ${
                  isDark ? 'text-[#A6ADC4]' : 'text-slate-400'
                }`}
              >
                Priority Rating
              </span>
              <p
                className={`mt-1 text-sm font-semibold transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-slate-800'
                }`}
              >
                {assignment.priority || 'Normal'}
              </p>
            </div>
          </div>

          <div
            className={`rounded-lg border p-3.5 space-y-2.5 transition-colors ${
              isDark
                ? 'border-[#2E334D] bg-[#1B1E2E]'
                : 'border-slate-100 bg-slate-50/70'
            }`}
          >
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className={isDark ? 'text-[#A6ADC4]' : 'text-slate-400'}>
                  Origin / Source Site:
                </span>
                <p className={`font-medium ${isDark ? 'text-[#F2F3FA]' : 'text-slate-800'}`}>
                  {assignment.source}
                </p>
              </div>
            </div>
            <div
              className={`flex items-start gap-2 border-t pt-2.5 transition-colors ${
                isDark ? 'border-[#2E334D]' : 'border-slate-100'
              }`}
            >
              <MapPin
                className={`h-4 w-4 mt-0.5 shrink-0 ${
                  isDark ? 'text-[#B9ADFF]' : 'text-[#5B4BE8]'
                }`}
              />
              <div>
                <span className={isDark ? 'text-[#A6ADC4]' : 'text-slate-400'}>
                  Destination Hub:
                </span>
                <p className={`font-medium ${isDark ? 'text-[#F2F3FA]' : 'text-slate-800'}`}>
                  {assignment.destination}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className={`h-4 w-4 ${isDark ? 'text-[#A6ADC4]' : 'text-slate-400'}`} />
              <div>
                <span className={`block ${isDark ? 'text-[#A6ADC4]' : 'text-slate-400'}`}>
                  Assigned Date
                </span>
                <span className={`font-medium ${isDark ? 'text-[#F2F3FA]' : 'text-slate-800'}`}>
                  {assignment.assignedDate}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className={`h-4 w-4 ${isDark ? 'text-[#A6ADC4]' : 'text-slate-400'}`} />
              <div>
                <span className={`block ${isDark ? 'text-[#A6ADC4]' : 'text-slate-400'}`}>
                  Assigned Carrier
                </span>
                <span className={`font-medium ${isDark ? 'text-[#F2F3FA]' : 'text-slate-800'}`}>
                  {assignment.carrier || 'Pending Assignment'}
                </span>
              </div>
            </div>
          </div>

          {assignment.trackingNumber && (
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-2 border transition-colors ${
                isDark
                  ? 'bg-[#1B1E2E] border-[#2E334D]'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <Tag className={`h-3.5 w-3.5 ${isDark ? 'text-[#A6ADC4]' : 'text-slate-400'}`} />
              <span className={isDark ? 'text-[#A6ADC4]' : 'text-slate-500'}>
                Tracking Reference:
              </span>
              <span
                className={`font-mono font-medium ${
                  isDark ? 'text-[#B9ADFF]' : 'text-slate-800'
                }`}
              >
                {assignment.trackingNumber}
              </span>
            </div>
          )}

          {assignment.notes && (
            <div
              className={`rounded-lg p-3 border transition-colors ${
                isDark
                  ? 'bg-[#1B1E2E] border-[#2E334D]'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <span
                className={`font-medium block mb-1 ${
                  isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
                }`}
              >
                Operational Notes:
              </span>
              <p
                className={`leading-relaxed ${
                  isDark ? 'text-[#F2F3FA]' : 'text-slate-700'
                }`}
              >
                {assignment.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`mt-6 flex justify-end border-t pt-4 transition-colors ${
            isDark ? 'border-[#2E334D]' : 'border-slate-100'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BE8] ${
              isDark
                ? 'bg-[#2A2E44] text-[#F2F3FA] hover:bg-[#343956]'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}
