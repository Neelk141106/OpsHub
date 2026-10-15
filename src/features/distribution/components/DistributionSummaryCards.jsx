import { CheckCircle2, Clock, Package, Truck } from 'lucide-react'
import { useTheme } from '../context/useTheme'

export default function DistributionSummaryCards({ assignments }) {
  const { isDark } = useTheme()
  const total = assignments.length
  const pending = assignments.filter((a) => a.status === 'Pending').length
  const inTransit = assignments.filter((a) => a.status === 'In Transit').length
  const completed = assignments.filter((a) => a.status === 'Completed').length

  const cards = [
    {
      label: 'Total Assignments',
      value: total,
      subtext: `${total} active manifest records`,
      icon: Package,
      iconBg: isDark
        ? 'bg-[#1B1E2E] text-[#B9ADFF] border border-[#2E334D]'
        : 'bg-slate-100 text-slate-700',
    },
    {
      label: 'Pending Movements',
      value: pending,
      subtext: pending === 1 ? '1 awaiting dispatch' : `${pending} awaiting dispatch`,
      icon: Clock,
      iconBg: isDark
        ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
        : 'bg-amber-50 text-amber-600',
    },
    {
      label: 'In Transit',
      value: inTransit,
      subtext: inTransit === 1 ? '1 active on road' : `${inTransit} active on road`,
      icon: Truck,
      iconBg: isDark
        ? 'bg-sky-950/40 text-sky-400 border border-sky-800/40'
        : 'bg-sky-50 text-sky-600',
    },
    {
      label: 'Completed Deliveries',
      value: completed,
      subtext: `${total > 0 ? Math.round((completed / total) * 100) : 0}% fulfillment rate`,
      icon: CheckCircle2,
      iconBg: isDark
        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
        : 'bg-emerald-50 text-emerald-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={`flex items-center justify-between rounded-xl border p-4 shadow-sm transition-colors duration-200 ${
              isDark
                ? 'border-[#2E334D] bg-[#222538] hover:border-[#3B4263]'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <p
                className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                  isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
                }`}
              >
                {card.label}
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span
                  className={`text-2xl font-bold tracking-tight transition-colors ${
                    isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'
                  }`}
                >
                  {card.value}
                </span>
              </div>
              <p
                className={`mt-1 text-xs transition-colors ${
                  isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
                }`}
              >
                {card.subtext}
              </p>
            </div>
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${card.iconBg}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
