import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ArrowDownRight, ArrowUpRight, BarChart3, Layers } from 'lucide-react'
import { DAILY_MOVEMENT_CHART_DATA } from '../data/distributionMockData'

export default function DistributionInsights({ assignments }) {
  const { totalIssued, totalConsumed, remainingQty, consumptionRate } = useMemo(() => {
    const issued = assignments.reduce((acc, curr) => acc + (curr.issuedQuantity || curr.quantity || 0), 0)
    const consumed = assignments.reduce((acc, curr) => acc + (curr.consumedQuantity || 0), 0)
    const remaining = Math.max(0, issued - consumed)
    const rate = issued > 0 ? Math.round((consumed / issued) * 100) : 0
    return {
      totalIssued: issued,
      totalConsumed: consumed,
      remainingQty: remaining,
      consumptionRate: rate,
    }
  }, [assignments])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Metrics Cards */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Material Consumption Balance
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500">All Units</span>
          </div>

          <div className="mt-4 space-y-3.5">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Material Quantity Issued</span>
                <span className="inline-flex items-center text-indigo-600 font-medium gap-0.5">
                  <ArrowUpRight className="h-3 w-3" />
                  Staged & Sent
                </span>
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {totalIssued.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">units/items</span>
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Material Quantity Consumed</span>
                <span className="inline-flex items-center text-emerald-600 font-medium gap-0.5">
                  <ArrowDownRight className="h-3 w-3" />
                  Received & Used
                </span>
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {totalConsumed.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">units/items</span>
              </p>
            </div>

            <div className="rounded-lg bg-indigo-50/50 p-3 border border-indigo-100">
              <div className="flex items-center justify-between text-xs text-indigo-900">
                <span className="font-medium">Remaining Buffer / In Transit</span>
                <span className="text-xs font-semibold text-indigo-700">
                  {consumptionRate}% consumed
                </span>
              </div>
              <p className="mt-1 text-xl font-bold text-indigo-950">
                {remainingQty.toLocaleString()}{' '}
                <span className="text-xs font-normal text-indigo-700">pending consumption</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          Values dynamically calculated across {assignments.length} logged assignments.
        </div>
      </div>

      {/* Movement Velocity Chart */}
      <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Weekly Movement & Consumption Flow
            </h3>
          </div>
          <span className="text-xs text-slate-400">Past 7 Days (Aggregate Velocity)</span>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DAILY_MOVEMENT_CHART_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }}
                iconType="circle"
              />
              <Bar dataKey="issued" name="Issued" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="consumed" name="Consumed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inTransit" name="In Transit" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
