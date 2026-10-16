import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Clock,
  Cpu,
  GitCommit,
  GitCompare,
  Network,
  Play,
  RotateCcw,
} from 'lucide-react'
import { useLandingTheme } from '../context/useLandingTheme'

export default function USPSection() {
  const { isDark } = useLandingTheme()
  const [selectedCap, setSelectedCap] = useState('builder')

  const capabilities = [
    {
      id: 'builder',
      title: 'Visual Workflow Builder',
      badge: 'INTEGRATED & LIVE',
      badgeColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
      icon: Network,
      tagline: 'Drag-and-Drop Node Graph Architecture atop @xyflow/react',
      description:
        'Empower operations engineers to visually design, connect, and publish standard operating procedures (SOPs). Define automated triggers, manual approval gates, and multi-site handoff connectors without deploying backend code.',
      techStack: 'Powered by @xyflow/react & reactive state machines',
      previewComponent: (
        /* Visual Workflow Builder Node Blueprint Preview */
        <div className="relative w-full h-full min-h-[280px] p-4 font-mono text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#153D57]/40 text-[10px] text-[#8CA8BC]">
            <span>CANVAS // WORKFLOW: REPAIR_CYCLE_V3</span>
            <span className="text-[#52D7FF]">4 NODES CONNECTED</span>
          </div>

          {/* Node Graph Mockup */}
          <div className="relative flex-1 flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            {/* Node 1: Trigger */}
            <div className="p-3 rounded-xl border border-emerald-500/60 bg-[#071B2B] w-full sm:w-44 shadow-lg text-left">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                <span>TRIGGER</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-semibold text-white mt-1">Intake Work Order</div>
              <div className="text-[10px] text-[#8CA8BC] mt-0.5">Defect triage confirmed</div>
            </div>

            {/* Connecting Vector */}
            <div className="hidden sm:flex items-center text-[#52D7FF]">
              <div className="w-8 h-0.5 bg-[#2997FF]" />
              <ArrowRight className="h-3.5 w-3.5 -ml-1 text-[#52D7FF]" />
            </div>

            {/* Node 2: Decision Gate */}
            <div className="p-3 rounded-xl border border-[#2997FF] bg-[#071B2B] w-full sm:w-48 shadow-lg text-left ring-2 ring-[#2997FF]/20">
              <div className="flex items-center justify-between text-[10px] text-[#52D7FF] font-bold">
                <span>CONDITIONAL GATE</span>
                <span className="h-2 w-2 rounded-full bg-[#52D7FF] animate-pulse" />
              </div>
              <div className="text-xs font-semibold text-white mt-1">Requires Spare Part?</div>
              <div className="text-[10px] text-[#8CA8BC] mt-0.5">Route to Central Stores</div>
            </div>

            {/* Connecting Vector */}
            <div className="hidden sm:flex items-center text-[#52D7FF]">
              <div className="w-8 h-0.5 bg-[#2997FF]" />
              <ArrowRight className="h-3.5 w-3.5 -ml-1 text-[#52D7FF]" />
            </div>

            {/* Node 3: Action */}
            <div className="p-3 rounded-xl border border-[#52D7FF]/60 bg-[#071B2B] w-full sm:w-44 shadow-lg text-left">
              <div className="flex items-center justify-between text-[10px] text-[#52D7FF] font-bold">
                <span>ACTION STEP</span>
                <span className="h-2 w-2 rounded-full bg-[#2997FF]" />
              </div>
              <div className="text-xs font-semibold text-white mt-1">QA Validation Stamp</div>
              <div className="text-[10px] text-[#8CA8BC] mt-0.5">Gate 3 inspection pass</div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#153D57]/40 flex items-center justify-between text-[10px] text-[#8CA8BC]">
            <span>NODE_SCHEMA: SOP-ROUTER-V4</span>
            <span className="text-emerald-400">● DETERMINISTIC GRAPH</span>
          </div>
        </div>
      ),
    },
    {
      id: 'timemachine',
      title: 'OpsHub Time Machine',
      badge: 'PLANNED MILESTONE',
      badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-500/10',
      icon: Clock,
      tagline: 'Deterministic Historical Playback & Predictive What-If Simulation',
      description:
        'Scrub forward and backward across operational timelines. Replay past bottlenecks, investigate anomaly events, and test "what-if" parameter shifts (such as freight surges or technician absences) before deploying changes.',
      techStack: 'State machine checkpointing & event delta simulation',
      previewComponent: (
        /* Time Machine Simulation Scrubber Preview */
        <div className="relative w-full h-full min-h-[280px] p-4 font-mono text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#153D57]/40 text-[10px] text-[#8CA8BC]">
            <span>SIMULATION ENGINE // TIME SCRUBBER</span>
            <span className="text-amber-300">PLAYBACK: T-4h 15m</span>
          </div>

          <div className="my-auto space-y-4">
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-[#52D7FF] fill-[#52D7FF]" />
                <span className="font-bold">Event Timeline Playback: ASN-8421 Dispatch Surge</span>
              </div>
              <span className="text-[#52D7FF] font-mono">1.5x Scrub Speed</span>
            </div>

            {/* Scrubbing Track */}
            <div className="relative w-full h-3 bg-[#071B2B] rounded-full border border-[#153D57] overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-3/5 bg-gradient-to-r from-[#2997FF] to-[#52D7FF]" />
              <div className="absolute top-0 bottom-0 left-[60%] w-1.5 bg-white shadow-[0_0_10px_white]" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded bg-[#071B2B] border border-[#153D57] text-[#8CA8BC]">
                <div className="text-white font-bold">T - 08:00 AM</div>
                <div>Allocation Normal</div>
              </div>
              <div className="p-2 rounded bg-[#071B2B] border border-[#2997FF] text-[#52D7FF]">
                <div className="text-white font-bold">T - 12:15 PM</div>
                <div>Queue Surge (+34%)</div>
              </div>
              <div className="p-2 rounded bg-[#071B2B] border border-[#153D57] text-[#8CA8BC]">
                <div className="text-white font-bold">T + 04:00 PM (Forecast)</div>
                <div>Line Cleared</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#153D57]/40 flex items-center justify-between text-[10px] text-[#8CA8BC]">
            <span>ENGINE: EVENT_RECORDER_REPLAY</span>
            <span className="text-amber-300">SANDBOX MODE ACTIVE</span>
          </div>
        </div>
      ),
    },
    {
      id: 'configdiff',
      title: 'Config Diff',
      badge: 'IN ACTIVE DEVELOPMENT',
      badgeColor: 'border-[#2997FF]/50 text-[#52D7FF] bg-[#2997FF]/10',
      icon: GitCompare,
      tagline: 'Visual Graph Comparison & Revision Governance',
      description:
        'Inspect operational changes side-by-side between SOP revisions. Visually highlight changed nodes, altered cycle-time thresholds, and modified routing logic to prevent configuration drift across regional operational hubs.',
      techStack: 'Graph topology diffing & parameter schema validation',
      previewComponent: (
        /* Config Diff Side-by-Side Blueprint */
        <div className="relative w-full h-full min-h-[280px] p-4 font-mono text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#153D57]/40 text-[10px] text-[#8CA8BC]">
            <span>DIFF // RELEASE_V4.1 vs RELEASE_V4.2</span>
            <span className="text-rose-400">-1 DELETED</span>
            <span className="text-emerald-400">+2 ADDED</span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-auto text-left text-[11px]">
            {/* Revision A */}
            <div className="p-3 rounded-lg border border-rose-500/40 bg-[#071B2B]/90 space-y-2">
              <div className="text-[10px] font-bold text-rose-400 flex items-center justify-between">
                <span>REV-4.1 (PREVIOUS)</span>
                <span>DEPOT-EAST</span>
              </div>
              <div className="p-2 rounded bg-rose-950/20 text-rose-300 border border-rose-900/50 text-[10px]">
                - Dispatch Approval: Manual (Supervisor Signature)
              </div>
              <div className="text-[#8CA8BC] text-[10px]">
                SLA Cycle Threshold: 4.5 hrs
              </div>
            </div>

            {/* Revision B */}
            <div className="p-3 rounded-lg border border-emerald-500/40 bg-[#071B2B]/90 space-y-2">
              <div className="text-[10px] font-bold text-emerald-400 flex items-center justify-between">
                <span>REV-4.2 (PROPOSED)</span>
                <span>DEPOT-EAST</span>
              </div>
              <div className="p-2 rounded bg-emerald-950/20 text-emerald-300 border border-emerald-900/50 text-[10px]">
                + Dispatch Approval: Automated Telemetry Check
              </div>
              <div className="text-[#52D7FF] text-[10px]">
                + Fallback Supervisor Escalation at 3.0 hrs
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#153D57]/40 flex items-center justify-between text-[10px] text-[#8CA8BC]">
            <span>AUDIT STAMP: ENG-OFFICER-092</span>
            <span className="text-[#52D7FF]">CHANGE REVIEW READY</span>
          </div>
        </div>
      ),
    },
    {
      id: 'pulse',
      title: 'OpsHub Pulse',
      badge: 'PRODUCTION TELEMETRY',
      badgeColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
      icon: Activity,
      tagline: 'Real-Time Operational Health & Bottleneck Detection',
      description:
        'Continuous cross-facility operational telemetry. Monitor queue depths, active carriage transits, technician cycle times, and SLA thresholds. Powered by Recharts for instantaneous situational awareness.',
      techStack: 'Real-time telemetry feeds, Recharts analytics, SLA monitors',
      previewComponent: (
        /* OpsHub Pulse Real-time Telemetry Preview */
        <div className="relative w-full h-full min-h-[280px] p-4 font-mono text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#153D57]/40 text-[10px] text-[#8CA8BC]">
            <span>PULSE // CROSS-FACILITY TELEMETRY</span>
            <span className="text-emerald-400">● LIVE FEED ACTIVE</span>
          </div>

          <div className="my-auto space-y-3">
            <div className="grid grid-cols-3 gap-2 text-left">
              <div className="p-2.5 rounded-lg border border-[#153D57] bg-[#071B2B]">
                <div className="text-[9px] text-[#8CA8BC]">THROUGHPUT RATE</div>
                <div className="text-base font-bold text-white mt-0.5">384 Units/hr</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">+14% vs baseline</div>
              </div>
              <div className="p-2.5 rounded-lg border border-[#2997FF]/50 bg-[#071B2B]">
                <div className="text-[9px] text-[#8CA8BC]">TRANSIT INVENTORY</div>
                <div className="text-base font-bold text-[#52D7FF] mt-0.5">92 Consignments</div>
                <div className="text-[9px] text-[#52D7FF] mt-0.5">0 delayed milestones</div>
              </div>
              <div className="p-2.5 rounded-lg border border-[#153D57] bg-[#071B2B]">
                <div className="text-[9px] text-[#8CA8BC]">SLA COMPLIANCE</div>
                <div className="text-base font-bold text-white mt-0.5">99.1%</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">Within tolerance</div>
              </div>
            </div>

            {/* Sparkline Visual Simulation */}
            <div className="p-3 rounded-lg border border-[#153D57]/60 bg-[#071B2B]/80">
              <div className="flex items-center justify-between text-[10px] text-[#8CA8BC] mb-1">
                <span>HOURLY DEMAND VS INTAKE RUN</span>
                <span className="text-[#52D7FF]">7-DAY PEAK</span>
              </div>
              <div className="flex items-end gap-1.5 h-12 pt-2">
                {[45, 60, 55, 80, 95, 85, 90, 110, 100, 120, 105, 95].map((val, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${(val / 120) * 100}%` }}
                    className={`flex-1 rounded-t transition-all ${
                      idx === 9 ? 'bg-[#52D7FF] shadow-[0_0_8px_#52D7FF]' : 'bg-[#2997FF]/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#153D57]/40 flex items-center justify-between text-[10px] text-[#8CA8BC]">
            <span>TELEMETRY_REFRESH: 1,000MS</span>
            <span className="text-emerald-400">STATUS: OPTIMAL</span>
          </div>
        </div>
      ),
    },
    {
      id: 'rollback',
      title: 'Version History & Rollback',
      badge: 'PLANNED MILESTONE',
      badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-500/10',
      icon: RotateCcw,
      tagline: 'Audit Governance, Immutable Release Stamps & Instant Recovery',
      description:
        'Every published workflow configuration is tagged with an immutable cryptographic release stamp. If an operational anomaly occurs in production, instantly revert to a known stable operating profile with zero downtime.',
      techStack: 'Versioned DAG snapshots & audit log immutability',
      previewComponent: (
        /* Version History Tree Blueprint Preview */
        <div className="relative w-full h-full min-h-[280px] p-4 font-mono text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#153D57]/40 text-[10px] text-[#8CA8BC]">
            <span>RELEASE REPOSITORY // IMMUTABLE AUDIT LOG</span>
            <span className="text-[#52D7FF]">HEAD -&gt; v2.4.0</span>
          </div>

          <div className="my-auto space-y-2 text-left">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#52D7FF] bg-[#071B2B] text-white">
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-[#52D7FF]" />
                <div>
                  <div className="font-bold text-xs">v2.4.0 (ACTIVE PRODUCTION)</div>
                  <div className="text-[10px] text-[#8CA8BC]">Author: Operations Lead S. Chen</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2997FF]/20 text-[#52D7FF] border border-[#2997FF]/40">
                CURRENT STABLE
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg border border-[#153D57] bg-[#071B2B]/60 text-[#8CA8BC]">
              <div className="flex items-center gap-2">
                <GitCommit className="h-3.5 w-3.5 text-[#8CA8BC]" />
                <div>
                  <div className="font-semibold text-xs text-slate-300">v2.3.9 (ROLLED BACK)</div>
                  <div className="text-[10px]">Sub-assembly routing timeout issue resolved</div>
                </div>
              </div>
              <span className="text-[10px] text-[#8CA8BC]">2026-10-12</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg border border-[#153D57] bg-[#071B2B]/40 text-[#8CA8BC]">
              <div className="flex items-center gap-2">
                <GitCommit className="h-3.5 w-3.5 text-[#8CA8BC]" />
                <div>
                  <div className="font-semibold text-xs text-slate-300">v2.3.8 (HISTORICAL BASELINE)</div>
                  <div className="text-[10px]">Initial multi-echelon buffer rules</div>
                </div>
              </div>
              <span className="text-[10px] text-[#8CA8BC]">2026-10-01</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#153D57]/40 flex items-center justify-between text-[10px] text-[#8CA8BC]">
            <span>AUDIT TRAIL // 100% TRACEABLE</span>
            <span className="text-emerald-400">ONE-CLICK ROLLBACK ENABLED</span>
          </div>
        </div>
      ),
    },
  ]

  const activeCapability =
    capabilities.find((c) => c.id === selectedCap) || capabilities[0]

  return (
    <section id="capabilities" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2997FF]/40 bg-[#0B263A]/80 text-[11px] font-mono text-[#52D7FF]">
            <Cpu className="h-3.5 w-3.5" />
            <span>CORE OPSHUB CAPABILITIES // ENGINEERING DIFFERENTIATORS</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-[#102536]'
            }`}
          >
            Intelligent Systems Beyond Generic Tools
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
            }`}
          >
            Engineered specifically for complex industrial lifecycles. Explore the
            planned and active capabilities that make OpsHub the operating system
            for high-throughput operations.
          </p>
        </div>

        {/* 2-Column Interactive Capabilities Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Capability Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              const isSelected = selectedCap === cap.id
              return (
                <div
                  key={cap.id}
                  onClick={() => setSelectedCap(cap.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 text-left ${
                    isSelected
                      ? isDark
                        ? 'border-[#2997FF] bg-[#0B263A] shadow-[0_0_20px_rgba(41,151,255,0.25)] translate-x-1'
                        : 'border-[#2997FF] bg-white shadow-md translate-x-1'
                      : isDark
                      ? 'border-[#153D57] bg-[#0B263A]/50 hover:border-[#153D57] hover:bg-[#0B263A]/80'
                      : 'border-slate-200 bg-white/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg border ${
                          isSelected
                            ? 'bg-[#2997FF]/20 border-[#2997FF] text-[#52D7FF]'
                            : 'bg-[#153D57]/40 border-[#153D57] text-[#8CA8BC]'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={`font-bold text-sm transition-colors ${
                          isSelected
                            ? isDark
                              ? 'text-white'
                              : 'text-[#102536]'
                            : isDark
                            ? 'text-[#D9EAF5]'
                            : 'text-slate-700'
                        }`}
                      >
                        {cap.title}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border ${cap.badgeColor}`}
                    >
                      {cap.badge}
                    </span>
                  </div>

                  <p
                    className={`text-xs line-clamp-2 mt-2 leading-relaxed ${
                      isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
                    }`}
                  >
                    {cap.tagline}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Right Column: Active Interactive Blueprint / UI Preview Stage */}
          <div className="lg:col-span-7 flex flex-col">
            <div
              className={`flex-1 rounded-2xl border p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
                isDark
                  ? 'border-[#153D57] bg-[#0B263A]/90 shadow-2xl'
                  : 'border-[#D9EAF5] bg-white shadow-lg'
              }`}
            >
              {/* Stage Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#153D57]/50 gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3
                      className={`text-lg sm:text-xl font-bold transition-colors ${
                        isDark ? 'text-white' : 'text-[#102536]'
                      }`}
                    >
                      {activeCapability.title}
                    </h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${activeCapability.badgeColor}`}
                    >
                      {activeCapability.badge}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#2997FF] mt-1">
                    {activeCapability.tagline}
                  </p>
                </div>
              </div>

              {/* Detailed Narrative */}
              <p
                className={`text-xs sm:text-sm leading-relaxed my-4 transition-colors ${
                  isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
                }`}
              >
                {activeCapability.description}
              </p>

              {/* Blueprint Interface Preview Box */}
              <div
                className={`rounded-xl border overflow-hidden my-2 transition-colors ${
                  isDark
                    ? 'border-[#153D57] bg-[#071B2B]'
                    : 'border-slate-200 bg-slate-900 text-white'
                }`}
              >
                {activeCapability.previewComponent}
              </div>

              {/* Tech Stack Indicator Footer */}
              <div className="pt-3 border-t border-[#153D57]/40 flex items-center justify-between text-[11px] font-mono text-[#8CA8BC]">
                <span>ARCH: {activeCapability.techStack}</span>
                <span className="text-[#52D7FF]">OPSHUB-SPEC // 2026</span>
              </div>

              {activeCapability.id === 'builder' && (
                <div className="mt-4 pt-3 border-t border-[#153D57]/40 flex justify-end">
                  <Link
                    to="/builder"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-[#2997FF] hover:bg-[#1f84e3] text-white shadow-md transition-all"
                  >
                    <span>Launch Workflow Builder Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
