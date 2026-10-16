import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import { useLandingTheme } from '../context/useLandingTheme'
import PricingCards from '../../billing/components/PricingCards'

export default function PricingSection() {
  const { isDark } = useLandingTheme()

  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2997FF]/40 bg-[#0B263A]/80 text-[11px] font-mono text-[#52D7FF]">
            <Compass className="h-3.5 w-3.5" />
            <span>PREDICTABLE INDUSTRIAL LICENSING // 7-DAY TRIAL</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-[#102536]'
            }`}
          >
            Predictable Pricing for Modern Operations
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
            }`}
          >
            Start with our 7-day unrestricted operational trial. No credit card required.
            Choose the subscription tier that matches your multi-site operational footprint.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <PricingCards isDark={isDark} />

        {/* Link to Dedicated Pricing Page for Detailed Matrix */}
        <div className="mt-12 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#52D7FF] hover:underline"
          >
            <span>View Full Detailed Architecture &amp; Capability Matrix</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
