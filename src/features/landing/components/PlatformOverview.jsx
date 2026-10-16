import { useState } from 'react'
import {
  Boxes,
  Compass,
  Cpu,
  Network,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react'
import { useLandingTheme } from '../context/useLandingTheme'
import panoramaSitesImg from '../assets/blueprint-panorama-connected-sites.jpg'

export default function PlatformOverview() {
  const { isDark } = useLandingTheme()
  const [activeSite, setActiveSite] = useState('stores')

  const sites = [
    {
      id: 'stores',
      title: 'Central Stores Depot',
      refCode: 'CS-DEPOT-ALPHA',
      role: 'Upstream Material Intake & Stock Buffer',
      capabilities: [
        'Automated receiving logistics & bin indexing',
        'Lot, batch & serialized item allocation',
        'Staging bay buffers for outbound fulfillment',
      ],
      flow: 'Feeds raw parts to Service Centre; stages goods for Distribution.',
      icon: Boxes,
    },
    {
      id: 'service',
      title: 'Service Centre',
      refCode: 'SC-MAINT-BETA',
      role: 'Maintenance, Overhaul & QA Inspection',
      capabilities: [
        'Ticket-driven triage & technician job queues',
        'Diagnostic execution & precision calibration',
        'Rigorous QA gates and return-to-service validation',
      ],
      flow: 'Requests replacement assemblies from Central Stores; routes certified equipment to Distribution.',
      icon: Wrench,
    },
    {
      id: 'distribution',
      title: 'Distribution Terminal',
      refCode: 'DB-LOGISTICS-HUB',
      role: 'Outbound Fulfillment & Movement Telemetry',
      capabilities: [
        'Dynamic carrier manifest and waybill routing',
        'Live tracking milestones across transport corridors',
        'End-point intake verification and consumption logging',
      ],
      flow: 'Receives ready inventory from Central Stores & Service Centre; fulfills regional depot demands.',
      icon: Truck,
    },
  ]

  const pillars = [
    {
      icon: Network,
      title: 'Deterministic Orchestration',
      desc: 'Eliminates departmental guesswork by executing standard operating procedures (SOPs) through state-validated visual workflows.',
      code: 'PROTOCOL // SOP-SYNC',
    },
    {
      icon: Cpu,
      title: 'End-to-End Material Traceability',
      desc: 'Maintains custody integrity from raw component intake to repair bay calibration, freight carrier transit, and final consumption.',
      code: 'AUDIT // 100% CUSTODY',
    },
    {
      icon: Zap,
      title: 'Cross-Site Situational Awareness',
      desc: 'Centralized telemetry reveals queue backlogs, transit delays, and inventory shortages before physical lines experience downtime.',
      code: 'TELEMETRY // CROSS-HUB',
    },
  ]

  return (
    <section id="overview" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2997FF]/40 bg-[#0B263A]/80 text-[11px] font-mono text-[#52D7FF]">
            <Compass className="h-3.5 w-3.5" />
            <span>ARCHITECTURE BLUEPRINT // PLATFORM TOPOLOGY</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-[#102536]'
            }`}
          >
            One Coordinated System.{' '}
            <span className="text-[#2997FF]">Three Operational Hubs.</span>
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
            }`}
          >
            Traditional industrial operations suffer from disjointed tools and communication silos.
            OpsHub coordinates Central Stores, the Service Centre, and Distribution into a single
            synchronized operations mesh.
          </p>
        </div>

        {/* Reference 3: Wide Architectural Blueprint Panorama of Connected Sites */}
        <div className="mt-12 sm:mt-16 relative">
          <div
            className={`relative rounded-2xl border p-2 sm:p-4 transition-all duration-300 ${
              isDark
                ? 'border-[#153D57] bg-[#0B263A]/80 shadow-2xl shadow-[#071B2B]'
                : 'border-[#D9EAF5] bg-white shadow-lg'
            }`}
          >
            {/* Engineering Drawing Stamp Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#153D57]/40 px-2 text-[10px] font-mono text-[#8CA8BC] gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#52D7FF] font-bold">DWG NO: IH-PNO-01</span>
                <span>// INDUSTRIAL HUB COMPLEX SCHEMATIC (SCALE 1:500)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">● 3/3 SITES SYNCHRONIZED</span>
                <span>MESH: ATL-1 &amp; ATL-2 TRANSIT LANES</span>
              </div>
            </div>

            {/* Panorama Image Container */}
            <div className="relative aspect-[21/9] min-h-[260px] sm:min-h-[340px] rounded-xl overflow-hidden border border-[#153D57]/60 group">
              <img
                src={panoramaSitesImg}
                alt="Wide architectural blueprint panorama of connected Service Centre, Stores Depot, and Distribution Logistics Terminal"
                className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
              />

              {/* Blueprint Grid Vignette & Color Grading */}
              <div
                className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
                  isDark
                    ? 'bg-gradient-to-t from-[#071B2B] via-transparent to-[#071B2B]/40'
                    : 'bg-gradient-to-t from-white/70 via-transparent to-white/30'
                }`}
              />

              {/* Site Quick Selectors across the Panorama */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-center gap-2.5 z-20">
                {sites.map((site) => {
                  const isCurrent = activeSite === site.id
                  const Icon = site.icon
                  return (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => setActiveSite(site.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 backdrop-blur-md ${
                        isCurrent
                          ? 'border-[#52D7FF] bg-[#071B2B]/95 text-white shadow-[0_0_15px_rgba(82,215,255,0.4)] scale-105'
                          : 'border-[#153D57] bg-[#071B2B]/80 text-[#8CA8BC] hover:border-[#2997FF] hover:text-white'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 text-[#52D7FF]" />
                      <span className="font-semibold">{site.title}</span>
                      <span className="text-[10px] text-[#2997FF] hidden sm:inline">
                        [{site.refCode}]
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Active Site Specifications Panel */}
            <div className="mt-4 p-4 rounded-xl border border-[#153D57]/60 bg-[#071B2B]/70">
              {(() => {
                const current = sites.find((s) => s.id === activeSite) || sites[0]
                const Icon = current.icon
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-[#2997FF]/20 border border-[#2997FF]/40 text-[#52D7FF] shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {current.title}
                          </h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#153D57] text-[#52D7FF]">
                            {current.refCode}
                          </span>
                        </div>
                        <p className="text-xs text-[#8CA8BC] mt-0.5">
                          {current.role}
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-5 text-xs text-[#D9EAF5] space-y-1">
                      <div className="text-[10px] font-mono uppercase text-[#52D7FF] tracking-wider">
                        Core Capabilities
                      </div>
                      <ul className="space-y-0.5 text-[#8CA8BC]">
                        {current.capabilities.map((cap, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-[#52D7FF]" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:col-span-3 text-xs border-l border-[#153D57]/60 pl-3 font-mono text-[#8CA8BC]">
                      <div className="text-[10px] uppercase text-[#2997FF]">
                        Inter-Site Handoff
                      </div>
                      <p className="mt-1 text-[11px] leading-tight text-[#D9EAF5]">
                        {current.flow}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* 3 Engineering Architecture Pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className={`relative rounded-xl border p-6 transition-all duration-200 group ${
                  isDark
                    ? 'border-[#153D57] bg-[#0B263A]/60 hover:border-[#2997FF]/60 hover:bg-[#0B263A]'
                    : 'border-[#D9EAF5] bg-white hover:border-[#2997FF] shadow-sm'
                }`}
              >
                {/* Technical Corner Brackets */}
                <span className="absolute top-2 left-2 text-[8px] font-mono text-[#52D7FF]/40">
                  ┌
                </span>
                <span className="absolute top-2 right-2 text-[8px] font-mono text-[#52D7FF]/40">
                  ┐
                </span>

                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-[#2997FF]/10 text-[#2997FF] border border-[#2997FF]/30 group-hover:bg-[#2997FF]/20 transition-colors">
                    <Icon className="h-5 w-5 text-[#52D7FF]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#8CA8BC]">
                    {pillar.code}
                  </span>
                </div>

                <h3
                  className={`text-base font-bold mb-2 transition-colors ${
                    isDark ? 'text-white' : 'text-[#102536]'
                  }`}
                >
                  {pillar.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed transition-colors ${
                    isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
                  }`}
                >
                  {pillar.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
