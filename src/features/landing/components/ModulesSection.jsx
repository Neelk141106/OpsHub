import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Boxes,
  Layers,
  Truck,
  Wrench,
  ArrowRight,
} from 'lucide-react'
import { useLandingTheme } from '../context/useLandingTheme'

export default function ModulesSection() {
  const { isDark } = useLandingTheme()
  const [hoveredCard, setHoveredCard] = useState(null)

  const modules = [
    {
      id: 'central-stores',
      code: 'MODULE // CS-100',
      title: 'Central Stores',
      subtitle: 'Inventory Depot & Material Allocation',
      description:
        'Manage inventory, stock availability, buffer staging and material allocation with lot-level traceability across demand channels.',
      icon: Boxes,
      specs: [
        { label: 'Storage Optimization', value: 'Dynamic Binning' },
        { label: 'Stock Buffering', value: 'Multi-Echelon' },
        { label: 'Intake Velocity', value: 'Real-time FIFO' },
      ],
      tags: ['Intake Logistics', 'Lot Traceability', 'Buffer Staging', 'Allocation Engine'],
      svgVisual: (
        /* Blueprint Warehouse & Storage Racks Schematic */
        <svg
          viewBox="0 0 320 180"
          className="w-full h-full text-[#52D7FF]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Warehouse Isometric Foundation */}
          <path
            d="M 160 20 L 290 85 L 160 150 L 30 85 Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          {/* Storage Racks Bay 1 */}
          <path
            d="M 70 80 L 120 55 L 120 105 L 70 130 Z"
            stroke="#2997FF"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
          <line x1="70" y1="95" x2="120" y2="70" stroke="#2997FF" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="70" y1="112" x2="120" y2="87" stroke="#2997FF" strokeWidth="1" strokeOpacity="0.6" />

          {/* Storage Racks Bay 2 */}
          <path
            d="M 150 40 L 200 15 L 200 65 L 150 90 Z"
            stroke="#52D7FF"
            strokeWidth="1.5"
          />
          <line x1="150" y1="55" x2="200" y2="30" stroke="#52D7FF" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="150" y1="72" x2="200" y2="47" stroke="#52D7FF" strokeWidth="1" strokeOpacity="0.6" />

          {/* Storage Racks Bay 3 */}
          <path
            d="M 200 65 L 250 40 L 250 90 L 200 115 Z"
            stroke="#2997FF"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
          <line x1="200" y1="80" x2="250" y2="55" stroke="#2997FF" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="200" y1="97" x2="250" y2="72" stroke="#2997FF" strokeWidth="1" strokeOpacity="0.6" />

          {/* Staging AGV Flow Path */}
          <path
            d="M 80 125 Q 160 145 240 105"
            stroke="#52D7FF"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <circle cx="160" cy="140" r="3" fill="#52D7FF" />
          <text x="160" y="165" fill="#8CA8BC" fontSize="8" fontFamily="monospace" textAnchor="middle">
            DEPOT ALPHA // BIN-RACK 14-48
          </text>
        </svg>
      ),
    },
    {
      id: 'service-centre',
      code: 'MODULE // SC-200',
      title: 'Service Centre',
      subtitle: 'Maintenance & Technician Overhaul',
      description:
        'Coordinate maintenance, service requests and work orders. Track technician diagnostics, component overhaul, and strict return-to-service QA gates.',
      icon: Wrench,
      specs: [
        { label: 'Work Order Routing', value: 'Skill-Weighted' },
        { label: 'Component Triage', value: 'Step-by-Step' },
        { label: 'Inspection Protocol', value: 'Zero-Defect Gate' },
      ],
      tags: ['Work Orders', 'Diagnostic Triage', 'Component Overhaul', 'QA Inspection'],
      svgVisual: (
        /* Technical Machinery & Equipment Calibration Schematic */
        <svg
          viewBox="0 0 320 180"
          className="w-full h-full text-[#52D7FF]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric Calibration Circles */}
          <circle cx="160" cy="85" r="55" stroke="currentColor" strokeWidth="1" strokeDasharray="5 3" strokeOpacity="0.4" />
          <circle cx="160" cy="85" r="40" stroke="#2997FF" strokeWidth="1.2" strokeOpacity="0.7" />
          <circle cx="160" cy="85" r="22" stroke="#52D7FF" strokeWidth="1.5" />

          {/* Crosshairs & Dimension Radial Ticks */}
          <line x1="90" y1="85" x2="230" y2="85" stroke="#2997FF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="160" y1="20" x2="160" y2="150" stroke="#2997FF" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Isometric Service Bay & Robotic Arm Assembly Line */}
          <path d="M 60 140 L 120 110 L 200 110 L 260 140" stroke="#52D7FF" strokeWidth="1.5" />
          <rect x="145" y="70" width="30" height="30" stroke="#52D7FF" strokeWidth="1.5" fill="#0B263A" fillOpacity="0.6" />
          <circle cx="160" cy="85" r="4" fill="#52D7FF" />

          {/* Tolerance Callout Text */}
          <text x="160" y="165" fill="#8CA8BC" fontSize="8" fontFamily="monospace" textAnchor="middle">
            CALIBRATION BAY B // TOLERANCE ±0.02MM
          </text>
        </svg>
      ),
    },
    {
      id: 'distribution',
      code: 'MODULE // DB-300',
      title: 'Distribution',
      subtitle: 'Outbound Dispatch & Movement Tracking',
      description:
        'Manage assignments, dispatch, material movement and consumption. Monitor carrier handoffs, waybills and real-time lifecycle milestones.',
      icon: Truck,
      specs: [
        { label: 'Carrier Integration', value: 'Multi-Modal' },
        { label: 'Movement Timeline', value: 'End-to-End' },
        { label: 'Consumption Audit', value: 'Point-of-Use' },
      ],
      tags: ['Dispatch Manifests', 'Movement Tracking', 'Carrier Handoff', 'Consumption Audit'],
      svgVisual: (
        /* Logistics Route Diagram & Transport Nodes Schematic */
        <svg
          viewBox="0 0 320 180"
          className="w-full h-full text-[#52D7FF]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Waypoint Connection Route Mesh */}
          <path
            d="M 50 110 C 90 60, 140 130, 180 80 S 240 100, 275 60"
            stroke="#2997FF"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Depot Alpha Origin Node */}
          <g transform="translate(50, 110)">
            <circle cx="0" cy="0" r="10" stroke="#52D7FF" strokeWidth="1.5" fill="#0B263A" />
            <circle cx="0" cy="0" r="4" fill="#52D7FF" />
            <text x="0" y="22" fill="#8CA8BC" fontSize="8" fontFamily="monospace" textAnchor="middle">
              ORIGIN
            </text>
          </g>

          {/* Midpoint In-Transit Node */}
          <g transform="translate(180, 80)">
            <circle cx="0" cy="0" r="12" stroke="#2997FF" strokeWidth="1.5" fill="#0B263A" />
            <circle cx="0" cy="0" r="5" fill="#2997FF" className="animate-ping" />
            <circle cx="0" cy="0" r="5" fill="#2997FF" />
            <text x="0" y="24" fill="#52D7FF" fontSize="8" fontFamily="monospace" textAnchor="middle">
              IN TRANSIT
            </text>
          </g>

          {/* Destination Receiving Hub Node */}
          <g transform="translate(275, 60)">
            <circle cx="0" cy="0" r="10" stroke="#52D7FF" strokeWidth="1.5" fill="#0B263A" />
            <circle cx="0" cy="0" r="4" fill="#52D7FF" />
            <text x="0" y="22" fill="#8CA8BC" fontSize="8" fontFamily="monospace" textAnchor="middle">
              DESTINATION
            </text>
          </g>

          <text x="160" y="165" fill="#8CA8BC" fontSize="8" fontFamily="monospace" textAnchor="middle">
            ACTIVE ROUTE APX-774921-TR // HIGHWAY CORRIDOR 9
          </text>
        </svg>
      ),
    },
  ]

  return (
    <section id="modules" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#153D57]/50">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2997FF]/40 bg-[#0B263A]/80 text-[11px] font-mono text-[#52D7FF]">
              <Layers className="h-3.5 w-3.5" />
              <span>CORE PLATFORM MODULES // DEPLOYMENT SUITE</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors ${
                isDark ? 'text-white' : 'text-[#102536]'
              }`}
            >
              Engineered for Every Stage of the Lifecycle
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed transition-colors ${
                isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
              }`}
            >
              Three core modules designed with blueprint precision to coordinate inventory,
              maintenance, and fulfillment into a seamless operational flow.
            </p>
          </div>

          <div className="text-[11px] font-mono text-[#8CA8BC] self-start md:self-end">
            <span className="text-[#52D7FF] font-semibold">SUITE SPECS:</span> MODULAR ·
            REACTIVE · ROLE-ISOLATED
          </div>
        </div>

        {/* 3 Module Cards Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {modules.map((mod) => {
            const Icon = mod.icon
            const isHovered = hoveredCard === mod.id
            return (
              <div
                key={mod.id}
                onMouseEnter={() => setHoveredCard(mod.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden group ${
                  isHovered
                    ? isDark
                      ? 'border-[#2997FF] bg-[#0B263A] shadow-[0_0_30px_rgba(41,151,255,0.2)] -translate-y-1'
                      : 'border-[#2997FF] bg-white shadow-xl -translate-y-1'
                    : isDark
                    ? 'border-[#153D57] bg-[#0B263A]/70'
                    : 'border-[#D9EAF5] bg-white shadow-sm'
                }`}
              >
                {/* Blueprint Drawing Area */}
                <div
                  className={`relative aspect-[16/10] border-b p-4 transition-colors ${
                    isDark
                      ? 'border-[#153D57] bg-[#071B2B]/90'
                      : 'border-[#D9EAF5] bg-slate-50/80'
                  }`}
                >
                  {/* Technical Badge Header */}
                  <div className="flex items-center justify-between mb-2 text-[10px] font-mono">
                    <span className="text-[#52D7FF] font-semibold">{mod.code}</span>
                    <span className={isDark ? 'text-[#8CA8BC]' : 'text-slate-500'}>
                      SCHEMATIC REF
                    </span>
                  </div>

                  {/* SVG Blueprint Illustration */}
                  <div className="h-[140px] flex items-center justify-center">
                    {mod.svgVisual}
                  </div>
                </div>

                {/* Card Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#2997FF]/15 text-[#52D7FF] border border-[#2997FF]/30">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-bold transition-colors ${
                            isDark ? 'text-white' : 'text-[#102536]'
                          }`}
                        >
                          {mod.title}
                        </h3>
                        <p className="text-[11px] font-mono text-[#2997FF]">
                          {mod.subtitle}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`text-xs leading-relaxed transition-colors ${
                        isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
                      }`}
                    >
                      {mod.description}
                    </p>
                  </div>

                  {/* Technical Specification Rows */}
                  <div className="space-y-2 pt-3 border-t border-[#153D57]/40 text-xs">
                    {mod.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-[11px] font-mono"
                      >
                        <span className={isDark ? 'text-[#8CA8BC]' : 'text-slate-500'}>
                          {spec.label}
                        </span>
                        <span
                          className={`font-semibold ${
                            isDark ? 'text-[#D9EAF5]' : 'text-[#102536]'
                          }`}
                        >
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {mod.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          isDark
                            ? 'border-[#153D57] bg-[#071B2B] text-[#8CA8BC]'
                            : 'border-slate-200 bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Direct Workspace Launcher */}
                  <Link
                    to={`/${mod.id}`}
                    className="w-full mt-3 py-2 px-3 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 bg-[#2997FF]/15 hover:bg-[#2997FF]/25 text-[#2997FF] dark:text-[#52D7FF] border border-[#2997FF]/30 transition-colors"
                  >
                    <span>Launch {mod.title} Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
