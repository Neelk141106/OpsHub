import { Layers } from 'lucide-react'
import { useLandingTheme } from '../context/useLandingTheme'

export default function Footer() {
  const { isDark } = useLandingTheme()

  const handleScroll = (e, id) => {
    e.preventDefault()
    const target = document.querySelector(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer
      className={`border-t transition-colors py-12 sm:py-16 ${
        isDark
          ? 'border-[#153D57] bg-[#071B2B] text-[#8CA8BC]'
          : 'border-[#D9EAF5] bg-white text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#153D57]/40">
          {/* Col 1: Brand & Blueprint Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center h-9 w-9 rounded-lg border ${
                  isDark
                    ? 'border-[#2997FF] bg-[#0B263A] text-[#52D7FF]'
                    : 'border-[#2997FF] bg-blue-50 text-[#2997FF]'
                }`}
              >
                <Layers className="h-5 w-5" />
              </div>
              <span
                className={`font-mono text-base font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-[#102536]'
                }`}
              >
                OpsHub<span className="text-[#2997FF]">.io</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed max-w-sm">
              The operational workflow and intelligence platform engineered to streamline,
              monitor, simulate, and optimize complex operational lifecycles across distributed
              industrial facilities.
            </p>

            <div className="text-[10px] font-mono text-[#52D7FF] space-y-0.5">
              <div>ARCHITECTURE SPEC: OPSHUB-CORE // 2026.4</div>
              <div>COORDINATING: CENTRAL STORES · SERVICE CENTRE · DISTRIBUTION</div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#52D7FF]">
              Platform Architecture
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href="#overview"
                  onClick={(e) => handleScroll(e, '#overview')}
                  className="hover:text-white transition-colors"
                >
                  Unified Topology
                </a>
              </li>
              <li>
                <a
                  href="#modules"
                  onClick={(e) => handleScroll(e, '#modules')}
                  className="hover:text-white transition-colors"
                >
                  Core Operational Modules
                </a>
              </li>
              <li>
                <a
                  href="#capabilities"
                  onClick={(e) => handleScroll(e, '#capabilities')}
                  className="hover:text-white transition-colors"
                >
                  Engineering Capabilities
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  onClick={(e) => handleScroll(e, '#workflow')}
                  className="hover:text-white transition-colors"
                >
                  Lifecycle Execution Flow
                </a>
              </li>
              <li>
                <a
                  href="#showcase"
                  onClick={(e) => handleScroll(e, '#showcase')}
                  className="hover:text-white transition-colors"
                >
                  Product UI Showcase
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Modules & Direct Navigation */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#52D7FF]">
              Operational Sites
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <span className="text-slate-400">CS-100:</span> Central Stores Depot
              </li>
              <li>
                <span className="text-slate-400">SC-200:</span> Service Centre Bay
              </li>
              <li>
                <a
                  href="/distribution"
                  className="text-[#2997FF] hover:text-[#52D7FF] flex items-center gap-1"
                >
                  <span>DB-300: Distribution Workspace</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2997FF]/20">
                    Live
                  </span>
                </a>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-[#8CA8BC]">
              Built with React 19, Tailwind CSS, Recharts, and Lucide Icons.
            </div>
          </div>
        </div>

        {/* Bottom Technical Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono gap-4 text-[#8CA8BC]">
          <div>
            © 2026 OpsHub Operations Platform. Engineered for Operational Excellence.
          </div>
          <div className="flex items-center gap-4">
            <span>CAD REF // IH-PNO-01</span>
            <span>SCALE: 1:500</span>
            <span>STATUS: ALL SITES CONNECTED</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
