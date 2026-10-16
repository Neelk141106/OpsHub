import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
} from 'react-router-dom';

import {
  Boxes,
  Wrench,
  Truck,
  GitBranch,
  Moon,
  Sun,
  Activity,
} from 'lucide-react';

import { CentralStoresDashboard } from './features/central-stores';
import { ServiceCentreDashboard } from './features/service-centre';
import DistributionDashboard from './features/distribution';

function OpsHubLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);

    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [isDarkMode]);

  const navigation = [
    {
      label: 'Central Stores',
      path: '/central-stores',
      icon: Boxes,
      accent: 'blue',
    },
    {
      label: 'Service Centre',
      path: '/service-centre',
      icon: Wrench,
      accent: 'teal',
    },
    {
      label: 'Distribution',
      path: '/distribution',
      icon: Truck,
      accent: 'purple',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F5F6FA] text-[#20243A] transition-colors duration-200 dark:bg-[#0D1020] dark:text-[#F3F4F6]">

      {/* Global OpsHub header */}
      <header className="sticky top-0 z-50 border-b border-[#E4E7EC] bg-white/95 backdrop-blur-xl dark:border-[#30374C] dark:bg-[#111525]/95">
        <div className="flex min-h-[72px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6554C0] text-white shadow-sm">
              <GitBranch size={21} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">
                  OpsHub
                </h1>

                <span className="rounded-md border border-[#D9D2FF] bg-[#EEEBFF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#4F46A5] dark:border-[#51458A] dark:bg-[#292444] dark:text-[#C4B5FD]">
                  Genesis 2.0
                </span>
              </div>

              <p className="hidden text-xs text-[#667085] dark:text-[#A1A8BC] sm:block">
                Operational Orchestration Platform
              </p>
            </div>
          </div>

          {/* Site navigation */}
          <nav
            aria-label="Operational sites"
            className="order-3 flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-[#E4E7EC] bg-[#F5F6FA] p-1 sm:order-2 sm:w-auto dark:border-[#30374C] dark:bg-[#191E30]"
          >
            {navigation.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${isActive
                    ? 'bg-white text-[#4F46A5] shadow-sm ring-1 ring-[#E4E7EC] dark:bg-[#22283C] dark:text-[#C4B5FD] dark:ring-[#30374C]'
                    : 'text-[#475467] hover:bg-white/70 hover:text-[#20243A] dark:text-[#C1C7D5] dark:hover:bg-[#22283C]'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Platform status and theme */}
          <div className="order-2 flex items-center gap-3 sm:order-3">
            <div className="hidden items-center gap-2 rounded-full border border-[#BBE8CC] bg-[#EAF8EF] px-3 py-1.5 text-xs font-medium text-[#15803D] lg:flex dark:border-[#285B40] dark:bg-[#142D23] dark:text-[#86EFAC]">
              <Activity size={14} />
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              Platform Active
            </div>

            <button
              type="button"
              onClick={() => setIsDarkMode((previous) => !previous)}
              aria-label={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E4E7EC] bg-white text-[#4F46A5] transition hover:bg-[#EEEBFF] focus:outline-none focus:ring-2 focus:ring-[#6554C0] dark:border-[#30374C] dark:bg-[#191E30] dark:text-[#C4B5FD] dark:hover:bg-[#292444]"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Current route information */}
      <div className="border-b border-[#E4E7EC] bg-white px-4 py-3 dark:border-[#30374C] dark:bg-[#111525] sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#667085] dark:text-[#A1A8BC]">
              OpsHub
            </span>
            <span className="text-[#98A2B3]">/</span>
            <span className="font-semibold text-[#20243A] dark:text-[#F3F4F6]">
              {navigation.find((item) => item.path === location.pathname)?.label
                || 'Operations'}
            </span>
          </div>

          <span className="text-xs text-[#667085] dark:text-[#A1A8BC]">
            Track EVA 03 · PS03
          </span>
        </div>
      </div>

      {/* Dashboard routes */}
      <main className="min-h-[calc(100vh-130px)] w-full min-w-0 p-3 sm:p-5 lg:p-6">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/central-stores" replace />}
          />

          <Route
            path="/central-stores"
            element={
              <CentralStoresDashboard
                theme={isDarkMode ? 'dark' : 'light'}
              />
            }
          />

          <Route
            path="/service-centre"
            element={<ServiceCentreDashboard />}
          />

          <Route
            path="/distribution"
            element={<DistributionDashboard />}
          />

          <Route
            path="*"
            element={<Navigate to="/central-stores" replace />}
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4E7EC] bg-white px-4 py-4 dark:border-[#30374C] dark:bg-[#111525] sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#667085] dark:text-[#A1A8BC]">
          <span>OpsHub · Genesis 2.0</span>
          <span>Central Stores · Service Centre · Distribution</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <OpsHubLayout />
    </BrowserRouter>
  );
}

export default App;