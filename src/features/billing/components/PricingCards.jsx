import React from 'react'
import { Check, Zap, Building2, ShieldCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PricingCards({ isDark }) {
  const tiers = [
    {
      id: 'facility',
      name: 'Single Facility',
      badge: 'DEPOT LEVEL',
      price: '$490',
      period: '/ month',
      description: 'Ideal for independent logistics depots or standalone maintenance hubs.',
      icon: Zap,
      popular: false,
      features: [
        'Central Stores OR Service Centre module',
        'Visual Workflow Builder (Standard edition)',
        'Up to 25 site operator seats',
        'Standard inventory & ticket telemetry',
        'Community & email support (24h SLA)',
      ],
      ctaText: 'Start 7-Day Trial',
      ctaHref: '/central-stores',
    },
    {
      id: 'multi-site',
      name: 'Multi-Site Fleet',
      badge: 'RECOMMENDED',
      price: '$1,250',
      period: '/ month',
      description: 'Full tri-site orchestration connecting Stores, Service, and Distribution.',
      icon: Building2,
      popular: true,
      features: [
        'All 3 Operational Sites included',
        'OpsHub Time Machine workflow simulation',
        'Unlimited workflow definitions & versions',
        'Real-time inter-site transit connectors',
        'Custom RBAC & operator role definitions',
        'Dedicated success engineer (4h SLA)',
      ],
      ctaText: 'Launch Operational Fleet',
      ctaHref: '/builder',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Mesh',
      badge: 'CUSTOM SCALE',
      price: 'Custom',
      period: 'tailored SLA',
      description: 'For mission-critical aerospace, defense, and high-volume industrial networks.',
      icon: ShieldCheck,
      popular: false,
      features: [
        'Unlimited facilities and distribution hubs',
        'Air-gapped on-premises or VPC deployment',
        'Custom ERP & automated PLC connectors',
        'Audit trail hashing & FDA/ISO compliance',
        '24/7/365 dedicated operational hotline',
        'Custom workflow template development',
      ],
      ctaText: 'Contact Enterprise Team',
      ctaHref: '/landing',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {tiers.map((tier) => {
        const Icon = tier.icon
        return (
          <div
            key={tier.id}
            className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              tier.popular
                ? isDark
                  ? 'bg-[#0B263A] border-2 border-[#2997FF] shadow-[0_0_30px_rgba(41,151,255,0.25)]'
                  : 'bg-white border-2 border-[#2997FF] shadow-xl'
                : isDark
                ? 'bg-[#071B2B]/80 border border-[#153D57] hover:border-[#2997FF]/50'
                : 'bg-white/80 border border-slate-200 hover:border-[#2997FF]/50 shadow-sm'
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#2997FF] text-white shadow-sm">
                {tier.badge}
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tier.popular
                      ? 'bg-[#2997FF] text-white'
                      : isDark
                      ? 'bg-[#0B263A] text-[#52D7FF] border border-[#153D57]'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {!tier.popular && (
                  <span
                    className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border ${
                      isDark
                        ? 'border-[#153D57] text-[#8CA8BC]'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {tier.badge}
                  </span>
                )}
              </div>

              <h3
                className={`text-xl font-bold tracking-tight mb-2 ${
                  isDark ? 'text-white' : 'text-[#102536]'
                }`}
              >
                {tier.name}
              </h3>

              <p
                className={`text-xs mb-6 leading-relaxed ${
                  isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
                }`}
              >
                {tier.description}
              </p>

              <div className="flex items-baseline gap-1.5 mb-6">
                <span
                  className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
                    isDark ? 'text-[#52D7FF]' : 'text-[#2997FF]'
                  }`}
                >
                  {tier.price}
                </span>
                <span
                  className={`text-xs font-mono ${
                    isDark ? 'text-[#8CA8BC]' : 'text-slate-500'
                  }`}
                >
                  {tier.period}
                </span>
              </div>

              <div
                className={`border-t pt-6 mb-6 space-y-3 ${
                  isDark ? 'border-[#153D57]' : 'border-slate-200'
                }`}
              >
                <div
                  className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                    isDark ? 'text-[#52D7FF]' : 'text-[#2997FF]'
                  }`}
                >
                  Capability Specifications:
                </div>
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        tier.popular
                          ? 'text-[#2997FF]'
                          : isDark
                          ? 'text-[#52D7FF]'
                          : 'text-emerald-600'
                      }`}
                    />
                    <span className={isDark ? 'text-[#D9EAF5]' : 'text-slate-700'}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to={tier.ctaHref}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center justify-center gap-2 transition-all ${
                tier.popular
                  ? 'bg-[#2997FF] hover:bg-[#1C84E3] text-white shadow-md hover:shadow-lg'
                  : isDark
                  ? 'bg-[#0B263A] hover:bg-[#153D57] text-[#52D7FF] border border-[#2997FF]/40'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#102536] border border-slate-300'
              }`}
            >
              <span>{tier.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
