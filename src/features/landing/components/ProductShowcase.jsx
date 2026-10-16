import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Network,
  Truck,
} from 'lucide-react'
import { useLandingTheme } from '../context/useLandingTheme'

export default function ProductShowcase() {
  const { isDark } = useLandingTheme()
  const [activeTab, setActiveTab] = useState('distribution')

  const tabs = [
    {
      id: 'distribution',
      name: 'Distribution Tracking & Manifests',
      badge: 'ACTIVE IMPLEMENTATION',
      badgeColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
      icon: Truck,
      desc: 'Operational dispatch grid and end-to-end movement lifecycle tracking.',
    },
    {
      id: 'builder',
      name: 'Visual Workflow Topology',
      badge: 'IN ACTIVE DEVELOPMENT',
      badgeColor: 'border-[#2997FF]/50 text-[#52D7FF] bg-[#2997FF]/10',
      icon: Network,
      desc: 'Node-based drag-and-drop canvas for SOP engineering.',
    },
    {
      id: 'telemetry',
      name: 'OpsHub Pulse Health HUD',
      badge: 'OPERATIONAL TELEMETRY',
      badgeColor: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
      icon: Activity,
      desc: 'Real-time throughput velocity and cross-facility SLA health.',
    },
  ]

  return (
    <section id="showcase" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2997FF]/40 bg-[#0B263A]/80 text-[11px] font-mono text-[#52D7FF]">
            <Compass className="h-3.5 w-3.5" />
            <span>AUTHENTIC INTERFACE SHOWCASE // PLATFORM IN USE</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-[#102536]'
            }`}
          >
            Built for High-Velocity Operations
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
            }`}
          >
            Explore live previews of OpsHub in action. Built with real React components
            and authentic domain models rather than static mock images.
          </p>
        </div>

        {/* Showcase Frame with Blueprint Container */}
        <div
          className={`rounded-2xl border p-3 sm:p-5 transition-all duration-300 ${
            isDark
              ? 'border-[#153D57] bg-[#0B263A]/80 shadow-2xl shadow-[#071B2B]'
              : 'border-[#D9EAF5] bg-white shadow-xl'
          }`}
        >
          {/* Top Bar with Tab Switches */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#153D57]/40 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isCurrent = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all duration-150 ${
                      isCurrent
                        ? 'border-[#52D7FF] bg-[#071B2B] text-white shadow-[0_0_15px_rgba(82,215,255,0.3)]'
                        : isDark
                        ? 'border-[#153D57] bg-[#071B2B]/40 text-[#8CA8BC] hover:border-[#2997FF] hover:text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#2997FF]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 text-[#52D7FF]" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </div>

            <div className="text-[10px] font-mono text-[#8CA8BC] self-end sm:self-auto">
              VIEWPORT: 1920x1080 // CANVAS 100%
            </div>
          </div>

          {/* Interactive Screen Display Area */}
          <div
            className={`rounded-xl border p-4 sm:p-6 transition-colors font-sans ${
              isDark
                ? 'border-[#153D57] bg-[#071B2B]'
                : 'border-slate-200 bg-slate-50/70'
            }`}
          >
            {/* Tab 1: Real Distribution Movement Tracking Table & Milestones */}
            {activeTab === 'distribution' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#153D57]/40 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Distribution Movement &amp; Manifest Registry</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                        Live Telemetry
                      </span>
                    </h4>
                    <p className="text-xs text-[#8CA8BC]">
                      Material consignments dispatched across Central Stores and Regional Depots.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#8CA8BC]">
                    <span className="px-2.5 py-1 rounded border border-[#153D57] bg-[#0B263A]">
                      TOTAL: 8 MANIFESTS
                    </span>
                  </div>
                </div>

                {/* Table Mockup */}
                <div className="overflow-x-auto rounded-lg border border-[#153D57]/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B263A] text-[11px] font-mono uppercase text-[#8CA8BC] border-b border-[#153D57]">
                      <tr>
                        <th className="px-4 py-2.5">ID</th>
                        <th className="px-4 py-2.5">Material</th>
                        <th className="px-4 py-2.5">Source</th>
                        <th className="px-4 py-2.5">Destination</th>
                        <th className="px-4 py-2.5">Carrier</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#153D57]/40 text-[#D9EAF5]">
                      <tr className="hover:bg-[#0B263A]/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#52D7FF]">ASN-8421</td>
                        <td className="px-4 py-3 font-medium">Lithium Power Modules (48V 100Ah)</td>
                        <td className="px-4 py-3 text-[#8CA8BC]">Central Stores - Depot Alpha</td>
                        <td className="px-4 py-3 text-[#8CA8BC]">Distribution Hub North</td>
                        <td className="px-4 py-3 text-[#8CA8BC]">Apex Logistics Freight</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-sky-950/60 text-sky-300 border border-sky-800/60">
                            <Truck className="h-3 w-3" /> In Transit
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#0B263A]/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#52D7FF]">ASN-8419</td>
                        <td className="px-4 py-3 font-medium">Industrial Bearing Sets 6205-2RS</td>
                        <td className="px-4 py-3 text-[#8CA8BC]">Central Stores - Depot Alpha</td>
                        <td className="px-4 py-3 text-[#8CA8BC]">Distribution Depot East</td>
                        <td className="px-4 py-3 text-[#8CA8BC]">SwiftTrans Express</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                            <CheckCircle2 className="h-3 w-3" /> Completed
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#0B263A]/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#52D7FF]">ASN-8418</td>
                        <td className="px-4 py-3 font-medium">High-Torque Servomotors (4.5kW)</td>
                        <td className="px-4 py-3 text-[#8CA8BC]">Service Centre - Testing Bay B</td>
                        <td className="px-4 py-3 text-[#8CA8BC]">Outbound Logistics Dock 4</td>
                        <td className="px-4 py-3 text-[#8CA8BC]">Apex Logistics Freight</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-sky-950/60 text-sky-300 border border-sky-800/60">
                            <Truck className="h-3 w-3" /> In Transit
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Real Movement Timeline Mini-Preview */}
                <div className="p-3 rounded-lg border border-[#153D57] bg-[#0B263A]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#52D7FF]" />
                    <span className="font-semibold text-white">Smart Movement Tracking Timeline:</span>
                    <span className="text-[#8CA8BC]">ASN-8421 (3 of 5 stages logged)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#52D7FF]">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
                      Created
                    </span>
                    <span>→</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
                      Allocated
                    </span>
                    <span>→</span>
                    <span className="px-2 py-0.5 rounded bg-[#2997FF]/20 text-[#52D7FF] border border-[#2997FF]/40">
                      Dispatched
                    </span>
                    <span>→</span>
                    <span className="text-slate-500">Delivered (Pending)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Visual Workflow Canvas */}
            {activeTab === 'builder' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#153D57]/40 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Drag-and-Drop Workflow Topology Designer</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2997FF]/20 text-[#52D7FF] border border-[#2997FF]/40">
                        @xyflow/react Engine
                      </span>
                    </h4>
                    <p className="text-xs text-[#8CA8BC]">
                      Visual standard operating procedure modeling for site operations engineers.
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-xl border border-dashed border-[#153D57] bg-[#071B2B] flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
                  <div className="p-4 rounded-xl border border-emerald-500/60 bg-[#0B263A] w-52 shadow-lg">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">NODE 01: TRIGGER</span>
                    <div className="text-xs font-bold text-white mt-1">Material Intake Request</div>
                    <div className="text-[10px] text-[#8CA8BC] mt-1">Central Stores Bay 3</div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-[#52D7FF]" />

                  <div className="p-4 rounded-xl border border-[#2997FF] bg-[#0B263A] w-56 shadow-lg ring-2 ring-[#2997FF]/30">
                    <span className="text-[10px] font-mono text-[#52D7FF] font-bold">NODE 02: TRIAGE ROUTER</span>
                    <div className="text-xs font-bold text-white mt-1">Inspection Gate Clearance</div>
                    <div className="text-[10px] text-[#8CA8BC] mt-1">Pass: Dispatch / Fail: Service</div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-[#52D7FF]" />

                  <div className="p-4 rounded-xl border border-sky-400/60 bg-[#0B263A] w-52 shadow-lg">
                    <span className="text-[10px] font-mono text-sky-400 font-bold">NODE 03: TRANSIT HANDOFF</span>
                    <div className="text-xs font-bold text-white mt-1">Distribution Freight Carrier</div>
                    <div className="text-[10px] text-[#8CA8BC] mt-1">Generate Waybill Ref</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Operational Telemetry HUD */}
            {activeTab === 'telemetry' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#153D57]/40 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>OpsHub Pulse Telemetry Dashboard</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                        Active Telemetry
                      </span>
                    </h4>
                    <p className="text-xs text-[#8CA8BC]">
                      Real-time cross-site metrics, queue depth indicators, and SLA thresholds.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-[#153D57] bg-[#0B263A]">
                    <div className="text-[10px] font-mono text-[#8CA8BC]">ACTIVE MANIFESTS</div>
                    <div className="text-2xl font-bold text-white mt-1">8 Records</div>
                    <div className="text-xs text-sky-400 mt-1">2 in transit, 4 completed, 2 pending</div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#153D57] bg-[#0B263A]">
                    <div className="text-[10px] font-mono text-[#8CA8BC]">CONSUMPTION RATIO</div>
                    <div className="text-2xl font-bold text-[#52D7FF] mt-1">87.4%</div>
                    <div className="text-xs text-emerald-400 mt-1">1,307 of 1,467 units consumed</div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#153D57] bg-[#0B263A]">
                    <div className="text-[10px] font-mono text-[#8CA8BC]">SYSTEM REFRESH RATE</div>
                    <div className="text-2xl font-bold text-white mt-1">1,000 ms</div>
                    <div className="text-xs text-[#8CA8BC] mt-1">Deterministic telemetry stream</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Blueprint Footer Notice */}
          <div className="mt-4 pt-3 border-t border-[#153D57]/40 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-[#8CA8BC] gap-2">
            <span>OPSHUB_VER: 2026.4 // CLIENT ENVIRONMENT: REACT 19 + VITE 8 + TAILWIND</span>
            <span className="text-[#52D7FF]">INTERFACES DRIVEN BY REAL DOMAIN SCHEMAS</span>
          </div>
        </div>
      </div>
    </section>
  )
}
