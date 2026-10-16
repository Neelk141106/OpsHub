import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Boxes,
  Compass,
  Truck,
  Wrench,
} from 'lucide-react'
import { useLandingTheme } from '../context/useLandingTheme'
import blueprintHeroImg from '../assets/blueprint-hero-facility.jpg'
import cinematicFacilityImg from '../assets/cinematic-industrial-facility.jpg'

export default function HeroSection() {
  const { isDark } = useLandingTheme()
  const [activeCallout, setActiveCallout] = useState('distribution')
  const [viewMode, setViewMode] = useState('blueprint') // 'blueprint' | 'cinematic' | 'hybrid'

  const callouts = [
    {
      id: 'stores',
      title: 'Central Stores',
      code: 'DEPOT.01',
      spec: 'INVENTORY & BUFFER STAGING',
      desc: 'Centralized warehousing, lot intake, automated bin allocation & material buffer.',
      icon: Boxes,
      metric: '48,000 m² Staged Capacity',
      coords: 'LAT 42.36° // LNG -71.05°',
      x: '24%',
      y: '38%',
    },
    {
      id: 'service',
      title: 'Service Centre',
      code: 'MAINT.02',
      spec: 'REFURBISHMENT & QA GATES',
      desc: 'Diagnostic triage, technician dispatch, part overhaul and return-to-service validation.',
      icon: Wrench,
      metric: '99.4% QA Gate Clearance',
      coords: 'BAY 14 // REPAIR LINE 01',
      x: '52%',
      y: '68%',
    },
    {
      id: 'distribution',
      title: 'Distribution',
      code: 'FULFILL.03',
      spec: 'OUTBOUND FREIGHT & TRANSIT',
      desc: 'Manifest dispatch verification, carrier telemetry routing and material consumption tracking.',
      icon: Truck,
      metric: 'Real-time Movement Telemetry',
      coords: 'GATE 04 // DOCK INTAKE',
      x: '78%',
      y: '32%',
    },
  ]

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const elem = document.getElementById(targetId)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-[92vh] pt-28 sm:pt-36 pb-20 flex items-center overflow-hidden">
      {/* Decorative Blueprint Corner Annotation Marks */}
      <div className="absolute top-24 left-6 sm:left-12 hidden lg:flex flex-col text-[10px] font-mono text-[#8CA8BC]/60 select-none space-y-1">
        <span>PROJECT // OPSHUB-CORE</span>
        <span>SYS.ARCH // SPEC-2026.4</span>
        <span>SCALE // 1:500 METRIC</span>
      </div>

      <div className="absolute top-24 right-6 sm:right-12 hidden lg:flex flex-col text-right text-[10px] font-mono text-[#8CA8BC]/60 select-none space-y-1">
        <span>STATUS // TELEMETRY ACTIVE</span>
        <span>SECURITY // ENCRYPTED MESH</span>
        <span>LATENCY // &lt;14MS DETERMINISTIC</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Narrative & CTAs */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            {/* Engineering Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2997FF]/40 bg-[#0B263A]/80 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52D7FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52D7FF]" />
              </span>
              <span
                className={`text-[11px] font-mono font-semibold tracking-wider uppercase ${
                  isDark ? 'text-[#52D7FF]' : 'text-[#2997FF]'
                }`}
              >
                ENGINEERED FOR OPERATIONAL EXCELLENCE
              </span>
              <span className="text-[10px] font-mono text-[#8CA8BC] border-l border-[#153D57] pl-2 hidden sm:inline">
                DWG-001
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] transition-colors ${
                isDark ? 'text-white' : 'text-[#102536]'
              }`}
            >
              Every Operation.{' '}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#2997FF] via-[#52D7FF] to-[#D9EAF5] drop-shadow-[0_0_35px_rgba(41,151,255,0.45)]">
                Connected by Design.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              className={`text-base sm:text-lg leading-relaxed max-w-xl transition-colors font-sans ${
                isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
              }`}
            >
              OpsHub connects inventory, service operations and distribution
              through intelligent workflows, operational visibility and
              data-driven decisions.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/signup?plan=professional"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-white bg-[#2997FF] hover:bg-[#1f84e3] rounded-xl shadow-[0_0_25px_rgba(41,151,255,0.4)] hover:shadow-[0_0_35px_rgba(82,215,255,0.6)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52D7FF]"
              >
                <span>Start 7-Day Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#modules"
                onClick={(e) => handleSmoothScroll(e, 'modules')}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2997FF] ${
                  isDark
                    ? 'border-[#153D57] bg-[#0B263A]/80 text-[#D9EAF5] hover:border-[#52D7FF] hover:bg-[#153D57]/60'
                    : 'border-slate-300 bg-white text-[#102536] hover:border-[#2997FF] hover:bg-slate-50'
                }`}
              >
                <span>Explore Architecture</span>
                <Compass className="h-4 w-4 text-[#2997FF]" />
              </a>
            </div>

            {/* 3 Interconnected Site Metrics Chips */}
            <div className="pt-4 border-t border-[#153D57]/60 grid grid-cols-3 gap-3">
              {callouts.map((c) => {
                const Icon = c.icon
                const isActive = activeCallout === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCallout(c.id)}
                    className={`text-left p-2.5 rounded-lg border transition-all duration-200 focus:outline-none ${
                      isActive
                        ? isDark
                          ? 'border-[#2997FF] bg-[#0B263A] shadow-[0_0_15px_rgba(41,151,255,0.25)]'
                          : 'border-[#2997FF] bg-blue-50/80 shadow-sm'
                        : isDark
                        ? 'border-[#153D57]/50 bg-[#071B2B]/60 hover:border-[#153D57]'
                        : 'border-slate-200 bg-white/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#2997FF] font-semibold">
                      <Icon className="h-3 w-3 shrink-0" />
                      <span>{c.code}</span>
                    </div>
                    <div
                      className={`text-xs font-semibold mt-1 truncate ${
                        isDark ? 'text-white' : 'text-[#102536]'
                      }`}
                    >
                      {c.title}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column: Architectural Blueprint Visual Stage */}
          <div className="lg:col-span-6 relative">
            <div
              className={`relative rounded-2xl border p-2 sm:p-3 transition-all duration-300 ${
                isDark
                  ? 'border-[#153D57] bg-[#0B263A]/70 shadow-2xl shadow-[#071B2B]'
                  : 'border-[#D9EAF5] bg-white/80 shadow-xl'
              }`}
            >
              {/* Technical Drawing Header Bar */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#153D57]/40 px-2 text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#52D7FF]" />
                  <span className={isDark ? 'text-[#8CA8BC]' : 'text-slate-600'}>
                    ARCHITECTURAL CAD MODEL // ISOMETRIC VIEW
                  </span>
                </div>
                {/* Visual View Mode Selector */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('blueprint')}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono transition-colors ${
                      viewMode === 'blueprint'
                        ? 'bg-[#2997FF] text-white'
                        : isDark
                        ? 'text-[#8CA8BC] hover:text-white'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    CAD Blueprint
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('cinematic')}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono transition-colors ${
                      viewMode === 'cinematic'
                        ? 'bg-[#2997FF] text-white'
                        : isDark
                        ? 'text-[#8CA8BC] hover:text-white'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Atmospheric
                  </button>
                </div>
              </div>

              {/* Main Blueprint & Cinematic Imagery Canvas */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#153D57]/60 group">
                {/* Visual Reference 1: Architectural Blueprint CAD */}
                <img
                  src={blueprintHeroImg}
                  alt="Architectural blueprint of OpsHub connected industrial operations facility"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    viewMode === 'blueprint' ? 'opacity-95' : 'opacity-25 mix-blend-screen'
                  }`}
                />

                {/* Visual Reference 2: Blue-lit Cinematic Industrial Facility */}
                <img
                  src={cinematicFacilityImg}
                  alt="Cinematic interior of blue-lit automated industrial facility"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    viewMode === 'cinematic'
                      ? 'opacity-90'
                      : 'opacity-30 mix-blend-overlay'
                  }`}
                />

                {/* Blueprint Dimension & Measurement Lines Overlay */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Dimension lines */}
                  <line
                    x1="20"
                    y1="25"
                    x2="95%"
                    y2="25"
                    stroke="#52D7FF"
                    strokeWidth="0.8"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                  <line
                    x1="20"
                    y1="20"
                    x2="20"
                    y2="30"
                    stroke="#52D7FF"
                    strokeWidth="1.2"
                  />
                  <line
                    x1="95%"
                    y1="20"
                    x2="95%"
                    y2="30"
                    stroke="#52D7FF"
                    strokeWidth="1.2"
                  />
                  <text
                    x="50%"
                    y="18"
                    fill="#52D7FF"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    opacity="0.85"
                  >
                    DIM: 240.00 METRIC METERS // INTEGRATED FACILITY RUN
                  </text>

                  {/* Inter-facility routing vectors */}
                  <path
                    d="M 120 180 Q 240 120 380 160 T 520 220"
                    fill="none"
                    stroke="#2997FF"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                    className="animate-pulse"
                    opacity="0.75"
                  />
                </svg>

                {/* Interactive Blueprint Callout Nodes */}
                {callouts.map((callout) => {
                  const isSelected = activeCallout === callout.id
                  const Icon = callout.icon
                  return (
                    <div
                      key={callout.id}
                      style={{ top: callout.y, left: callout.x }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/node"
                      onClick={() => setActiveCallout(callout.id)}
                    >
                      {/* Pulsing Target Ring */}
                      <div className="relative flex items-center justify-center">
                        <span
                          className={`absolute inline-flex h-8 w-8 rounded-full opacity-75 transition-all duration-300 ${
                            isSelected
                              ? 'bg-[#52D7FF] animate-ping'
                              : 'bg-[#2997FF]/30 group-hover/node:scale-125'
                          }`}
                        />
                        <div
                          className={`relative flex items-center justify-center h-6 w-6 rounded-full border-2 transition-transform duration-200 ${
                            isSelected
                              ? 'bg-[#071B2B] border-[#52D7FF] text-[#52D7FF] scale-110 shadow-[0_0_15px_#52D7FF]'
                              : 'bg-[#0B263A] border-[#2997FF] text-[#2997FF] hover:scale-105'
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                      </div>

                      {/* Technical Annotation Tag */}
                      <div
                        className={`absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-0.5 rounded border text-[10px] font-mono transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#071B2B]/90 border-[#52D7FF] text-white shadow-lg'
                            : 'bg-[#071B2B]/75 border-[#153D57] text-[#8CA8BC] hidden sm:block'
                        }`}
                      >
                        <span className="text-[#52D7FF] font-bold">
                          {callout.code}
                        </span>{' '}
                        · {callout.title}
                      </div>
                    </div>
                  )
                })}

                {/* Active Callout Technical Blueprint Drawer */}
                {activeCallout && (
                  <div
                    className={`absolute bottom-3 left-3 right-3 p-3 rounded-lg border backdrop-blur-md transition-all duration-200 z-30 ${
                      isDark
                        ? 'border-[#2997FF]/60 bg-[#071B2B]/90 text-white'
                        : 'border-[#2997FF] bg-white/95 text-[#102536]'
                    }`}
                  >
                    {(() => {
                      const sel = callouts.find((c) => c.id === activeCallout)
                      if (!sel) return null
                      const Icon = sel.icon
                      return (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="flex items-start gap-2.5">
                            <div className="p-1.5 rounded bg-[#2997FF]/20 text-[#52D7FF] border border-[#2997FF]/40 shrink-0">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#52D7FF]">
                                  [{sel.code}]
                                </span>
                                <span className="font-semibold">{sel.title}</span>
                                <span className="text-[10px] font-mono text-[#8CA8BC]">
                                  // {sel.spec}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#8CA8BC] mt-0.5 line-clamp-1">
                                {sel.desc}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 font-mono text-[10px] text-[#52D7FF]">
                            <span className="px-2 py-0.5 rounded bg-[#153D57]/60 border border-[#2997FF]/30">
                              {sel.metric}
                            </span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* Technical Drawing Footer Legend */}
              <div className="flex items-center justify-between pt-2 mt-1 px-2 text-[9px] font-mono text-[#8CA8BC]/70 border-t border-[#153D57]/30">
                <span>COORD // REF.SYSTEM: INTER-SITE LOGISTICS MESH</span>
                <span>STATUS: OPERATIONAL PROTOCOL ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
