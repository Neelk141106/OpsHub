import { useState } from 'react'
import {
  Activity,
  Boxes,
  CheckCircle2,
  Clock,
  Compass,
  Network,
  Sliders,
} from 'lucide-react'
import { useLandingTheme } from '../context/useLandingTheme'

export default function WorkflowSection() {
  const { isDark } = useLandingTheme()
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      step: '01',
      nodeCode: 'NODE.MAP',
      title: 'Connect Operational Sites',
      shortLabel: 'Site Mapping',
      icon: Boxes,
      summary: 'Register and network all physical facilities into the operational mesh.',
      details:
        'Model physical infrastructure topology: Central Stores storage racks, Service Centre repair bays, and Distribution fulfillment docks with unified identifiers and transit lanes.',
      output: 'Operational Site Graph Built',
    },
    {
      step: '02',
      nodeCode: 'NODE.GRAPH',
      title: 'Configure Workflows',
      shortLabel: 'Workflow Design',
      icon: Network,
      summary: 'Assemble standard operating procedures using visual drag-and-drop nodes.',
      details:
        'Chain intake triggers, automated validation checks, technician skills triage, and inter-site transit connectors without writing custom software deployments.',
      output: 'Published Executable SOP',
    },
    {
      step: '03',
      nodeCode: 'NODE.EXEC',
      title: 'Execute Operations',
      shortLabel: 'Execution & Dispatch',
      icon: Sliders,
      summary: 'Orchestrate material movement, maintenance work orders and carrier dispatch.',
      details:
        'Live operators allocate batches, sign manifests, confirm intake inspections, and log material consumption with guaranteed state determinism and audit trails.',
      output: 'Active Manifests & Orders Running',
    },
    {
      step: '04',
      nodeCode: 'NODE.SIM',
      title: 'Simulate Improvements',
      shortLabel: 'Simulation & What-If',
      icon: Clock,
      summary: 'Test what-if parameter variations in the OpsHub Time Machine before release.',
      details:
        'Evaluate supply chain disruptions, machine maintenance down-time, or seasonal freight surges against historical baselines to predict bottlenecks.',
      output: 'Bottleneck Risk Forecasted',
    },
    {
      step: '05',
      nodeCode: 'NODE.PULSE',
      title: 'Monitor Performance',
      shortLabel: 'Continuous Telemetry',
      icon: Activity,
      summary: 'Track real-time cross-site metrics, queue depths, and SLA thresholds.',
      details:
        'Interactive dashboards powered by OpsHub Pulse provide actionable visibility into cycle times, fulfillment milestones, and cross-depot material movements.',
      output: 'Real-Time Operational Situational Awareness',
    },
  ]

  return (
    <section id="workflow" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2997FF]/40 bg-[#0B263A]/80 text-[11px] font-mono text-[#52D7FF]">
            <Compass className="h-3.5 w-3.5" />
            <span>OPERATIONAL PROCESS ARCHITECTURE</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-[#102536]'
            }`}
          >
            How OpsHub Connects the Lifecycle
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
            }`}
          >
            From physical site onboarding to visual workflow configuration and continuous
            telemetry, OpsHub structures every operational event with blueprint precision.
          </p>
        </div>

        {/* Process Flow: Desktop Horizontal Stepper with Connecting Vector Lines */}
        <div className="hidden lg:block relative mb-12">
          {/* Continuous Blueprint Connecting Line */}
          <div className="absolute top-[38px] left-[6%] right-[6%] h-0.5 bg-[#153D57]" />
          <div
            className="absolute top-[38px] left-[6%] h-0.5 bg-gradient-to-r from-[#2997FF] to-[#52D7FF] transition-all duration-500"
            style={{ width: `${(activeStep / (steps.length - 1)) * 88}%` }}
          />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((st, idx) => {
              const Icon = st.icon
              const isPassed = idx <= activeStep
              const isCurrent = idx === activeStep
              return (
                <div
                  key={st.step}
                  onClick={() => setActiveStep(idx)}
                  className="cursor-pointer group flex flex-col items-center text-center"
                >
                  {/* Step Node Marker */}
                  <div
                    className={`relative flex items-center justify-center h-18 w-18 rounded-2xl border-2 transition-all duration-300 p-4 ${
                      isCurrent
                        ? 'border-[#52D7FF] bg-[#071B2B] text-[#52D7FF] shadow-[0_0_20px_rgba(82,215,255,0.4)] scale-110'
                        : isPassed
                        ? 'border-[#2997FF] bg-[#0B263A] text-white'
                        : isDark
                        ? 'border-[#153D57] bg-[#071B2B] text-[#8CA8BC] group-hover:border-[#2997FF]/60'
                        : 'border-slate-300 bg-white text-slate-500 group-hover:border-[#2997FF]'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    {/* Step Number Badge */}
                    <span
                      className={`absolute -bottom-2 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        isCurrent
                          ? 'bg-[#52D7FF] text-[#071B2B]'
                          : 'bg-[#153D57] text-[#D9EAF5]'
                      }`}
                    >
                      {st.step}
                    </span>
                  </div>

                  {/* Title & Short Tag */}
                  <div className="mt-5 space-y-1">
                    <div className="text-[10px] font-mono text-[#52D7FF]">
                      {st.nodeCode}
                    </div>
                    <div
                      className={`text-xs font-bold transition-colors ${
                        isCurrent
                          ? isDark
                            ? 'text-white'
                            : 'text-[#102536]'
                          : isDark
                          ? 'text-[#8CA8BC]'
                          : 'text-slate-600'
                      }`}
                    >
                      {st.title}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active Step Detailed Blueprint Inspection Box */}
        <div
          className={`rounded-2xl border p-6 sm:p-8 transition-all duration-300 ${
            isDark
              ? 'border-[#153D57] bg-[#0B263A]/90 shadow-2xl'
              : 'border-[#D9EAF5] bg-white shadow-lg'
          }`}
        >
          {(() => {
            const current = steps[activeStep]
            const Icon = current.icon
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#2997FF]/20 border border-[#2997FF]/40 text-[#52D7FF]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-mono font-bold text-[#52D7FF]">
                      PHASE // {current.step}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#2997FF]/15 text-[#2997FF] border border-[#2997FF]/30">
                      {current.nodeCode}
                    </span>
                  </div>

                  <h3
                    className={`text-2xl font-bold transition-colors ${
                      isDark ? 'text-white' : 'text-[#102536]'
                    }`}
                  >
                    {current.title}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed transition-colors ${
                      isDark ? 'text-[#D9EAF5]' : 'text-slate-700'
                    }`}
                  >
                    {current.summary}
                  </p>

                  <p
                    className={`text-xs leading-relaxed transition-colors ${
                      isDark ? 'text-[#8CA8BC]' : 'text-slate-500'
                    }`}
                  >
                    {current.details}
                  </p>

                  <div className="pt-3 border-t border-[#153D57]/40 flex items-center gap-2 text-xs font-mono text-[#52D7FF]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>GATE DELIVERABLE: {current.output}</span>
                  </div>
                </div>

                {/* Right Interactive Preview Card for this Step */}
                <div className="lg:col-span-5 rounded-xl border border-[#153D57] bg-[#071B2B] p-5 text-left font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-[#8CA8BC] pb-2 border-b border-[#153D57]/40">
                    <span>STEP_PROTOCOL // {current.nodeCode}</span>
                    <span className="text-emerald-400">STATUS: VALIDATED</span>
                  </div>

                  <div className="space-y-2 py-2">
                    <div className="text-[11px] text-[#8CA8BC]">
                      EXECUTION TARGET:
                    </div>
                    <div className="p-2.5 rounded bg-[#0B263A] border border-[#153D57] text-[#D9EAF5] text-xs">
                      {current.output}
                    </div>

                    <div className="text-[11px] text-[#8CA8BC] pt-2">
                      AUTOMATED VALIDATION:
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Zero schema discrepancies detected</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#153D57]/40 flex items-center justify-between text-[10px] text-[#8CA8BC]">
                    <span>STEP PROGRESS: {activeStep + 1} OF 5</span>
                    <div className="flex gap-1">
                      {steps.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 w-3 rounded-full ${
                            i === activeStep
                              ? 'bg-[#52D7FF]'
                              : i < activeStep
                              ? 'bg-[#2997FF]'
                              : 'bg-[#153D57]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>

        {/* Mobile Vertical Stepper View */}
        <div className="lg:hidden mt-8 space-y-3">
          {steps.map((st, idx) => (
            <button
              key={st.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                activeStep === idx
                  ? 'border-[#2997FF] bg-[#0B263A] text-white shadow-md'
                  : 'border-[#153D57] bg-[#071B2B]/60 text-[#8CA8BC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#52D7FF] font-bold">
                  {st.step}
                </span>
                <span className="text-xs font-semibold">{st.title}</span>
              </div>
              <span className="text-[10px] font-mono text-[#8CA8BC]">
                {st.nodeCode}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
