import { useLandingTheme } from '../context/useLandingTheme'

export default function BlueprintBackground() {
  const { isDark } = useLandingTheme()

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-300"
      aria-hidden="true"
    >
      {/* Base Canvas Color */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          isDark ? 'bg-[#071B2B]' : 'bg-[#F4F8FB]'
        }`}
      />

      {/* SVG Major and Minor Blueprint Grid */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Minor Grid Pattern (20px) */}
          <pattern
            id="blueprint-minor-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke={isDark ? '#153D57' : '#D9EAF5'}
              strokeWidth="0.5"
              strokeOpacity={isDark ? '0.35' : '0.6'}
            />
          </pattern>

          {/* Major Grid Pattern (100px) with Crosshairs */}
          <pattern
            id="blueprint-major-grid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="url(#blueprint-minor-grid)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke={isDark ? '#52D7FF' : '#2997FF'}
              strokeWidth="1"
              strokeOpacity={isDark ? '0.2' : '0.25'}
            />
            {/* Crosshair ticks at intersection */}
            <path
              d="M -4 0 L 4 0 M 0 -4 L 0 4"
              fill="none"
              stroke={isDark ? '#52D7FF' : '#2997FF'}
              strokeWidth="1"
              strokeOpacity={isDark ? '0.5' : '0.4'}
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#blueprint-major-grid)" />
      </svg>

      {/* Atmospheric Luminous Lighting Gradients */}
      <div
        className={`absolute top-[-10%] right-[10%] w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-500 ${
          isDark
            ? 'bg-[#2997FF]/10 mix-blend-screen'
            : 'bg-[#52D7FF]/15 mix-blend-multiply'
        }`}
      />
      <div
        className={`absolute top-[40%] left-[-5%] w-[550px] h-[550px] rounded-full blur-[160px] pointer-events-none transition-opacity duration-500 ${
          isDark
            ? 'bg-[#153D57]/35 mix-blend-screen'
            : 'bg-[#2997FF]/10 mix-blend-multiply'
        }`}
      />
      <div
        className={`absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-500 ${
          isDark
            ? 'bg-[#52D7FF]/8 mix-blend-screen'
            : 'bg-[#D9EAF5]/40 mix-blend-multiply'
        }`}
      />

      {/* Technical Blueprint Margin Borders & Registration Marks */}
      <div className="absolute inset-4 sm:inset-6 border border-dashed pointer-events-none transition-colors duration-300 opacity-30 select-none border-cyan-500/30">
        {/* Corner registration brackets */}
        <span className="absolute -top-1.5 -left-1.5 text-[9px] font-mono text-cyan-400/70 font-semibold">
          ┌ GRID // 00.00
        </span>
        <span className="absolute -top-1.5 -right-1.5 text-[9px] font-mono text-cyan-400/70 font-semibold">
          REF: OPS-900 ┐
        </span>
        <span className="absolute -bottom-1.5 -left-1.5 text-[9px] font-mono text-cyan-400/70 font-semibold">
          └ LAT: 42°18'N
        </span>
        <span className="absolute -bottom-1.5 -right-1.5 text-[9px] font-mono text-cyan-400/70 font-semibold">
          LNG: 71°04'W ┘
        </span>
      </div>
    </div>
  )
}
