import { CheckCircle2, Clock, Package, Truck } from 'lucide-react'

export default function DistributionSummaryCards({ assignments }) {
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
      iconBg: 'bg-slate-100 text-slate-700',
      borderAccent: 'border-slate-200',
    },
    {
      label: 'Pending Movements',
      value: pending,
      subtext: pending === 1 ? '1 awaiting dispatch' : `${pending} awaiting dispatch`,
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
      borderAccent: 'border-amber-200',
    },
    {
      label: 'In Transit',
      value: inTransit,
      subtext: inTransit === 1 ? '1 active on road' : `${inTransit} active on road`,
      icon: Truck,
      iconBg: 'bg-sky-50 text-sky-600',
      borderAccent: 'border-sky-200',
    },
    {
      label: 'Completed Deliveries',
      value: completed,
      subtext: `${total > 0 ? Math.round((completed / total) * 100) : 0}% fulfillment rate`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderAccent: 'border-emerald-200',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {card.label}
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{card.subtext}</p>
            </div>
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
