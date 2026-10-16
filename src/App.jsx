import React, { useState } from 'react';
import {
  Boxes,
  Wrench,
  Truck,
  GitBranch,
  Sun,
  Moon,
} from 'lucide-react';
import { ServiceCentreDashboard } from './features/service-centre';

function App() {
  const [activeSite, setActiveSite] = useState('SERVICE_CENTRE');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      {/* OpsHub Platform Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Platform Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center text-white shadow-sm ring-2 ring-purple-600/30">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    OpsHub
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase tracking-wide">
                    Enterprise
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block -mt-0.5">
                  Operational Orchestration & Telemetry
                </span>
              </div>
            </div>

            {/* Operational Site Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setActiveSite('CENTRAL_STORES')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeSite === 'CENTRAL_STORES'
                    ? 'bg-white dark:bg-slate-750 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Central Stores</span>
                <span className="text-[9px] px-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-500">
                  Phase 1
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSite('SERVICE_CENTRE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeSite === 'SERVICE_CENTRE'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Service Centre</span>
                <span
                  className={`text-[9px] px-1.5 rounded-full font-bold ${
                    activeSite === 'SERVICE_CENTRE'
                      ? 'bg-teal-700 text-white'
                      : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                  }`}
                >
                  Active
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSite('DISTRIBUTION')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeSite === 'DISTRIBUTION'
                    ? 'bg-white dark:bg-slate-750 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Distribution</span>
                <span className="text-[9px] px-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-500">
                  Phase 1
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSite('BUILDER')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeSite === 'BUILDER'
                    ? 'bg-white dark:bg-slate-750 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Workflow Canvas</span>
                <span className="text-[9px] px-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-500">
                  Phase 1
                </span>
              </button>
            </nav>

            {/* Platform Controls */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Telemetry Live
              </div>

              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme mode"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSite === 'SERVICE_CENTRE' && <ServiceCentreDashboard />}

        {activeSite === 'CENTRAL_STORES' && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto">
            <Boxes className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Central Stores Inventory Module
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Inventory depot and intake workflows are designated for teammate assignment. Return to Service Centre to inspect active repair tickets.
            </p>
            <button
              type="button"
              onClick={() => setActiveSite('SERVICE_CENTRE')}
              className="text-xs font-semibold text-teal-600 hover:underline"
            >
              ← Back to Service Centre
            </button>
          </div>
        )}

        {activeSite === 'DISTRIBUTION' && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto">
            <Truck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Distribution & Fulfillment Module
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Outbound logistics and dispatch verification are designated for teammate assignment. Return to Service Centre to inspect active repair tickets.
            </p>
            <button
              type="button"
              onClick={() => setActiveSite('SERVICE_CENTRE')}
              className="text-xs font-semibold text-teal-600 hover:underline"
            >
              ← Back to Service Centre
            </button>
          </div>
        )}

        {activeSite === 'BUILDER' && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto">
            <GitBranch className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Visual Workflow Builder Module
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              The @xyflow/react node canvas is designated for teammate assignment. Return to Service Centre to inspect active repair tickets.
            </p>
            <button
              type="button"
              onClick={() => setActiveSite('SERVICE_CENTRE')}
              className="text-xs font-semibold text-teal-600 hover:underline"
            >
              ← Back to Service Centre
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
