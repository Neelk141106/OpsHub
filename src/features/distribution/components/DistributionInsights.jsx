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
import { useTheme } from '../context/useTheme'

export default function DistributionInsights({ assignments }) {
  const { isDark } = useTheme()

  const { totalIssued, totalConsumed, remainingQty, consumptionRate } = useMemo(() => {
    const issued = assignments.reduce(
      (acc, curr) => acc + (curr.issuedQuantity || curr.quantity || 0),
      0
    )
    const consumed = assignments.reduce(
      (acc, curr) => acc + (curr.consumedQuantity || 0),
      0
    )
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
      <div
        className={`flex flex-col justify-between rounded-xl border p-5 shadow-sm transition-colors duration-200 ${
          isDark
            ? 'border-[#2E334D] bg-[#222538]'
            : 'border-slate-200 bg-white'
        }`}
      >
        <div>
          <div
            className={`flex items-center justify-between border-b pb-3 transition-colors ${
              isDark ? 'border-[#2E334D]' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers
                className={`h-4 w-4 ${isDark ? 'text-[#B9ADFF]' : 'text-[#5B4BE8]'}`}
              />
              <h3
                className={`text-sm font-semibold transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'
                }`}
              >
                Material Consumption Balance
              </h3>
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
              }`}
            >
              All Units
            </span>
          </div>

          <div className="mt-4 space-y-3.5">
            <div
              className={`rounded-lg p-3 border transition-colors ${
                isDark
                  ? 'bg-[#1B1E2E] border-[#2E334D]'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div
                className={`flex items-center justify-between text-xs transition-colors ${
                  isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
                }`}
              >
                <span>Material Quantity Issued</span>
                <span
                  className={`inline-flex items-center font-medium gap-0.5 ${
                    isDark ? 'text-[#B9ADFF]' : 'text-[#5B4BE8]'
                  }`}
                >
                  <ArrowUpRight className="h-3 w-3" />
                  Staged & Sent
                </span>
              </div>
              <p
                className={`mt-1 text-xl font-bold transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'
                }`}
              >
                {totalIssued.toLocaleString()}{' '}
                <span
                  className={`text-xs font-normal ${
                    isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
                  }`}
                >
                  units/items
                </span>
              </p>
            </div>

            <div
              className={`rounded-lg p-3 border transition-colors ${
                isDark
                  ? 'bg-[#1B1E2E] border-[#2E334D]'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div
                className={`flex items-center justify-between text-xs transition-colors ${
                  isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
                }`}
              >
                <span>Material Quantity Consumed</span>
                <span className="inline-flex items-center text-emerald-500 font-medium gap-0.5">
                  <ArrowDownRight className="h-3 w-3" />
                  Received & Used
                </span>
              </div>
              <p
                className={`mt-1 text-xl font-bold transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'
                }`}
              >
                {totalConsumed.toLocaleString()}{' '}
                <span
                  className={`text-xs font-normal ${
                    isDark ? 'text-[#A6ADC4]' : 'text-slate-500'
                  }`}
                >
                  units/items
                </span>
              </p>
            </div>

            <div
              className={`rounded-lg p-3 border transition-colors ${
                isDark
                  ? 'bg-[#5B4BE8]/10 border-[#5B4BE8]/30'
                  : 'bg-indigo-50/50 border-indigo-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-medium transition-colors ${
                    isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'
                  }`}
                >
                  Remaining Buffer / In Transit
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isDark ? 'text-[#B9ADFF]' : 'text-[#5B4BE8]'
                  }`}
                >
                  {consumptionRate}% consumed
                </span>
              </div>
              <p
                className={`mt-1 text-xl font-bold transition-colors ${
                  isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'
                }`}
              >
                {remainingQty.toLocaleString()}{' '}
                <span
                  className={`text-xs font-normal ${
                    isDark ? 'text-[#B9ADFF]' : 'text-[#5B4BE8]'
                  }`}
                >
                  pending consumption
                </span>
              </p>
            </div>
          </div>
        </div>

        <div
          className={`mt-4 pt-3 border-t text-xs transition-colors ${
            isDark
              ? 'border-[#2E334D] text-[#A6ADC4]'
              : 'border-slate-100 text-slate-500'
          }`}
        >
          Values dynamically calculated across {assignments.length} logged assignments.
        </div>
      </div>

      {/* Movement Velocity Chart */}
      <div
        className={`flex flex-col rounded-xl border p-5 shadow-sm lg:col-span-2 transition-colors duration-200 ${
          isDark
            ? 'border-[#2E334D] bg-[#222538]'
            : 'border-slate-200 bg-white'
        }`}
      >
        <div
          className={`flex items-center justify-between border-b pb-3 transition-colors ${
            isDark ? 'border-[#2E334D]' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <BarChart3
              className={`h-4 w-4 ${isDark ? 'text-[#B9ADFF]' : 'text-[#5B4BE8]'}`}
            />
            <h3
              className={`text-sm font-semibold transition-colors ${
                isDark ? 'text-[#F2F3FA]' : 'text-[#17213A]'
              }`}
            >
              Weekly Movement & Consumption Flow
            </h3>
          </div>
          <span
            className={`text-xs transition-colors ${
              isDark ? 'text-[#A6ADC4]' : 'text-slate-400'
            }`}
          >
            Past 7 Days (Aggregate Velocity)
          </span>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DAILY_MOVEMENT_CHART_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? '#2E334D' : '#f1f5f9'}
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: isDark ? '#2E334D' : '#e2e8f0' }}
                tick={{ fill: isDark ? '#A6ADC4' : '#64748b', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: isDark ? '#2E334D' : '#e2e8f0' }}
                tick={{ fill: isDark ? '#A6ADC4' : '#64748b', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#222538' : '#ffffff',
                  borderColor: isDark ? '#2E334D' : '#e2e8f0',
                  color: isDark ? '#F2F3FA' : '#17213A',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  boxShadow: isDark
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.4)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                itemStyle={{ color: isDark ? '#F2F3FA' : '#17213A' }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '8px',
                  fontSize: '12px',
                  color: isDark ? '#A6ADC4' : '#64748b',
                }}
                iconType="circle"
              />
              <Bar dataKey="issued" name="Issued" fill="#5B4BE8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="consumed" name="Consumed" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inTransit" name="In Transit" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
