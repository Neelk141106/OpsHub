import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import { useLandingTheme } from '../context/useLandingTheme'
import panoramaBg from '../assets/blueprint-panorama-connected-sites.jpg'

export default function CTASection() {
  const { isDark } = useLandingTheme()
  const [inquirySubmitted, setInquirySubmitted] = useState(false)
  const [email, setEmail] = useState('')

  const handleWalkthroughSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setInquirySubmitted(true)
    setTimeout(() => {
      setInquirySubmitted(false)
      setEmail('')
    }, 4000)
  }

  return (
    <section id="cta" className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background Architectural Blueprint with Ambient Gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen">
        <img
          src={panoramaBg}
          alt="Connected industrial facility blueprint schematic background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div
        className={`absolute inset-0 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-b from-[#071B2B] via-[#071B2B]/90 to-[#071B2B]'
            : 'bg-gradient-to-b from-[#F4F8FB] via-[#F4F8FB]/95 to-[#F4F8FB]'
        }`}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Technical Blueprint Callout Frame */}
        <div
          className={`relative rounded-3xl border p-8 sm:p-14 transition-all duration-300 ${
            isDark
              ? 'border-[#2997FF]/50 bg-[#0B263A]/90 shadow-[0_0_50px_rgba(7,27,43,0.9)]'
              : 'border-[#2997FF]/40 bg-white/95 shadow-2xl'
          }`}
        >
          {/* Engineering Registration Crosshairs */}
          <span className="absolute top-3 left-4 text-[9px] font-mono text-[#52D7FF]/60 select-none">
            ┌ SPEC-2026.FINAL
          </span>
          <span className="absolute top-3 right-4 text-[9px] font-mono text-[#52D7FF]/60 select-none">
            SEC-RELEASE ┐
          </span>
          <span className="absolute bottom-3 left-4 text-[9px] font-mono text-[#52D7FF]/60 select-none">
            └ DWG: OPS-ALL-SYNC
          </span>
          <span className="absolute bottom-3 right-4 text-[9px] font-mono text-[#52D7FF]/60 select-none">
            REVISION 04 ┘
          </span>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2997FF]/50 bg-[#071B2B] text-[11px] font-mono text-[#52D7FF]">
              <Compass className="h-3.5 w-3.5" />
              <span>THE ARCHITECTURAL BLUEPRINT FOR OPERATIONS</span>
            </div>

            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight transition-colors ${
                isDark ? 'text-white' : 'text-[#102536]'
              }`}
            >
              Bring Every Operation Into Sync.
            </h2>

            <p
              className={`text-base sm:text-lg leading-relaxed transition-colors ${
                isDark ? 'text-[#8CA8BC]' : 'text-slate-600'
              }`}
            >
              One connected platform for more coordinated, visible and intelligent operations.
              Step into the new standard of industrial operations management.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/signup?plan=professional"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-white bg-[#2997FF] hover:bg-[#1f84e3] rounded-xl shadow-[0_0_25px_rgba(41,151,255,0.4)] hover:shadow-[0_0_35px_rgba(82,215,255,0.6)] transition-all duration-200"
              >
                <span>Start 7-Day Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/distribution"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider rounded-xl border transition-all duration-200 ${
                  isDark
                    ? 'border-[#153D57] bg-[#071B2B] text-[#D9EAF5] hover:border-[#52D7FF]'
                    : 'border-slate-300 bg-white text-[#102536] hover:border-[#2997FF]'
                }`}
              >
                <span>Launch Distribution Workspace</span>
              </Link>
            </div>

            {/* Engineering Consultation Input Form */}
            <form onSubmit={handleWalkthroughSubmit} className="pt-6 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter engineering work email..."
                  className={`w-full px-3.5 py-2 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 transition-colors ${
                    isDark
                      ? 'border-[#153D57] bg-[#071B2B] text-white placeholder-[#8CA8BC]/50 focus:border-[#52D7FF]'
                      : 'border-slate-300 bg-white text-[#102536] placeholder-slate-400 focus:border-[#2997FF]'
                  }`}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto whitespace-nowrap px-4 py-2 text-xs font-mono font-medium rounded-lg bg-[#153D57] hover:bg-[#1a4a6b] text-[#52D7FF] border border-[#2997FF]/40 transition-colors"
                >
                  Request Walkthrough
                </button>
              </div>

              {inquirySubmitted && (
                <p className="mt-2 text-xs font-mono text-emerald-400">
                  ✓ Request logged in OpsHub engineering registry.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
