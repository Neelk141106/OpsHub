import React from 'react'
import { Link } from 'react-router-dom'
import {
  Boxes,
  Wrench,
  Truck,
  Workflow,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react'

const WORKSPACES = [
  {
    id: 'central-stores',
    title: 'Central Stores Depot',
    siteCode: 'SITE 01 // DEPOT',
    category: 'Inventory & Intake',
    description:
      'Centralized warehouse inventory management, automated bin allocation, safety buffer tracking, and material requisition gateway.',
    icon: Boxes,
    path: '/central-stores',
    themeColor: 'blue',
    badge: 'Operational Depot',
    capabilities: [
      'Real-time bin level tracking & lot matching',
      'Cross-site requisition intake queue',
      'Automated stock movement audit trail',
      'CSV batch import/export catalog tools',
    ],
    accentBorder: 'border-blue-500/40 hover:border-blue-500',
    accentBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  {
    id: 'service-centre',
    title: 'Service Centre',
    siteCode: 'SITE 02 // REPAIR',
    category: 'Maintenance & Diagnostics',
    description:
      'Equipment maintenance triage, repair ticket queues, technician work bay dispatch, and QA return-to-service validation pipeline.',
    icon: Wrench,
    path: '/service-centre',
    themeColor: 'teal',
    badge: 'Triage Line Active',
    capabilities: [
      'Diagnostic defect triage & SLA tracking',
      'Work bay allocation (Bays 01-04)',
      'Critical defect branching workflow',
      'QA testing sign-off certification',
    ],
    accentBorder: 'border-teal-500/40 hover:border-teal-500',
    accentBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    btnBg: 'bg-teal-600 hover:bg-teal-700 text-white',
  },
  {
    id: 'distribution',
    title: 'Distribution Logistics',
    siteCode: 'SITE 03 // LOGISTICS',
    category: 'Fulfillment & Freight',
    description:
      'Outbound shipment fulfillment, dynamic carrier manifest routing, transport corridor tracking, and material consumption auditing.',
    icon: Truck,
    path: '/distribution',
    themeColor: 'purple',
    badge: 'Dispatch Gate Ready',
    capabilities: [
      'Material assignment & carrier routing',
      'Live transport movement milestones',
      'Consumption logs & scrap recording',
      'Custom filter & telemetry summary decks',
    ],
    accentBorder: 'border-purple-500/40 hover:border-purple-500',
    accentBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  {
    id: 'builder',
    title: 'Visual Workflow Builder',
    siteCode: 'STUDIO // ORCHESTRATION',
    category: 'Automation & Simulation',
    description:
      'Visual standard operating procedure (SOP) graph editor with 39 Core & Ops modules, pre-built templates, and Time Machine simulation.',
    icon: Workflow,
    path: '/builder',
    themeColor: 'violet',
    badge: 'Signature USP Studio',
    isSignature: true,
    capabilities: [
      'Predefined SOPs for all 3 operational sites',
      'Drag-and-drop canvas atop @xyflow/react',
      'OpsHub Time Machine dry-run simulation',
      'Semantic versioning & draft persistence',
    ],
    accentBorder: 'border-[#2997FF]/60 hover:border-[#2997FF]',
    accentBg: 'bg-[#2997FF]/15 text-[#2997FF] dark:text-[#52D7FF]',
    btnBg: 'bg-[#2997FF] hover:bg-[#1f84e3] text-white shadow-md',
  },
]

export default function WorkspaceSelectionView({ isDark, onSelect }) {
  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2997FF]/40 bg-[#0B263A]/80 text-[11px] font-mono text-[#52D7FF]">
          <Layers className="h-3.5 w-3.5" />
          <span>OPSHUB WORKSPACE REGISTRY // GENESIS 2.0</span>
        </div>

        <h1
          className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight transition-colors ${
            isDark ? 'text-white' : 'text-[#102536]'
          }`}
        >
          Choose an Operational Workspace
        </h1>

        <p
          className={`text-sm sm:text-base leading-relaxed transition-colors ${
            isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
          }`}
        >
          Select an active facility dashboard to monitor real-time operations, or launch
          the Visual Workflow Builder to create, customize, and simulate standard operating procedures.
        </p>
      </div>

      {/* Grid of Workspaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {WORKSPACES.map((ws) => {
          const Icon = ws.icon
          return (
            <div
              key={ws.id}
              className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 group ${
                ws.isSignature
                  ? isDark
                    ? 'border-[#2997FF]/70 bg-[#071B2B]/95 shadow-[0_0_35px_rgba(41,151,255,0.25)] ring-1 ring-[#2997FF]/40'
                    : 'border-[#2997FF] bg-white shadow-xl ring-2 ring-[#2997FF]/20'
                  : isDark
                  ? 'border-[#153D57] bg-[#071B2B]/75 hover:border-[#2997FF]/50 hover:bg-[#0B263A]'
                  : 'border-slate-200 bg-white hover:border-[#2997FF]/50 shadow-sm'
              }`}
            >
              {ws.isSignature && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#2997FF] text-white shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{ws.badge}</span>
                </span>
              )}

              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                      ws.isSignature
                        ? 'bg-[#2997FF] text-white border-transparent'
                        : `${ws.accentBg} border-current/20`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border ${
                      isDark
                        ? 'border-[#153D57] text-[#8CA8BC]'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {ws.siteCode}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#2997FF] font-semibold">
                    {ws.category}
                  </span>
                  <h3
                    className={`text-lg font-bold tracking-tight transition-colors ${
                      isDark ? 'text-white' : 'text-[#102536]'
                    }`}
                  >
                    {ws.title}
                  </h3>
                </div>

                <p
                  className={`text-xs leading-relaxed mb-5 transition-colors line-clamp-3 ${
                    isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
                  }`}
                >
                  {ws.description}
                </p>

                {/* Capabilities list */}
                <div
                  className={`border-t pt-4 mb-6 space-y-2 text-xs ${
                    isDark ? 'border-[#153D57]/60' : 'border-slate-100'
                  }`}
                >
                  <div
                    className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      isDark ? 'text-[#52D7FF]' : 'text-slate-700'
                    }`}
                  >
                    Key Operations:
                  </div>
                  {ws.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2997FF] mt-1.5 shrink-0" />
                      <span className={isDark ? 'text-[#D9EAF5]' : 'text-slate-600'}>
                        {cap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <Link
                to={ws.path}
                onClick={onSelect}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center justify-center gap-2 transition-all ${
                  ws.btnBg
                } ${
                  ws.isSignature
                    ? 'shadow-md hover:shadow-lg'
                    : 'shadow-2xs'
                }`}
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )
        })}
      </div>

      {/* Security & Access footer note */}
      <div className="mt-12 text-center text-xs font-mono text-slate-500 dark:text-[#8CA8BC] flex items-center justify-center gap-2">
        <Shield className="w-4 h-4 text-emerald-500" />
        <span>Role-Based Access Control (RBAC) Active · All Site Actions Timestamped &amp; Audited</span>
      </div>
    </div>
  )
}
