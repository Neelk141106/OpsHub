import React from 'react'
import {
  Warehouse,
  RotateCcw,
  Sun,
  Moon,
  Building2,
  Boxes,
} from 'lucide-react'
import { useCentralStoresStore } from './store/useCentralStoresStore'
import { KpiCardsGrid } from './components/KpiCardsGrid'
import { TableToolbar } from './components/TableToolbar'
import { InventoryTable } from './components/InventoryTable'
import { RequestManagementView } from './components/RequestManagementView'
import { StockMovementsTable } from './components/StockMovementsTable'
import { AddItemModal } from './components/AddItemModal'
import { EditItemModal } from './components/EditItemModal'
import { NewRequestModal } from './components/NewRequestModal'
import { RejectRequestModal } from './components/RejectRequestModal'
import { RestockModal } from './components/RestockModal'
import { ImportInventoryModal } from './components/ImportInventoryModal'
import { CentralStoresAnalyticsView } from './components/CentralStoresAnalyticsView'
import { ToastNotification } from './components/ToastNotification'
import './styles/centralStores.css'

/**
 * CentralStoresDashboard Component
 * 
 * Centralized depot, warehousing, and material intake dashboard for OpsHub
 * (GENESIS 2.0, Track EVA 03, Problem Statement PS03).
 * 
 * Integration Contract for Neel / App Shell:
 * @param {Object} props
 * @param {'light'|'dark'|'auto'} [props.theme] - Explicit theme mode passed from the global shell.
 * @param {boolean} [props.showThemeToggle=false] - Optional local toggle (defaults to false to respect global theme).
 * @param {string} [props.className=''] - Additional styling classes.
 */
export function CentralStoresDashboard({
  theme,
  showThemeToggle = false,
  className = '',
}) {
  const activeView = useCentralStoresStore((state) => state.activeView)
  const resetToMockData = useCentralStoresStore((state) => state.resetToMockData)
  const isLocalDarkMode = useCentralStoresStore((state) => state.isDarkMode)
  const toggleDarkMode = useCentralStoresStore((state) => state.toggleDarkMode)

  // Determine active dark mode: explicit prop takes precedence, otherwise fallback to local toggle or parent .dark class
  const isDarkActive =
    theme === 'dark'
      ? true
      : theme === 'light'
      ? false
      : isLocalDarkMode

  return (
    <div
      className={`central-stores-scope ${isDarkActive ? 'dark-mode' : ''} min-h-screen transition-colors duration-200 ${className}`}
      style={{
        backgroundColor: 'var(--cs-bg-app)',
        color: 'var(--cs-text-primary)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Header Bar */}
        <header
          className="rounded-2xl p-6 transition-all"
          style={{
            backgroundColor: 'var(--cs-bg-card)',
            border: '1px solid var(--cs-border)',
            boxShadow: 'var(--cs-shadow-sm)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Badges */}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{
                  backgroundColor: 'var(--cs-purple-primary)',
                  color: '#FFFFFF',
                }}
              >
                <Warehouse className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.12)',
                      color: 'var(--cs-accent-blue)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                    }}
                  >
                    Site 01 • Central Depot
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'rgba(22, 163, 74, 0.12)',
                      color: '#15803D',
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Depot Operational
                  </span>
                </div>

                <h1
                  className="text-2xl sm:text-[28px] font-bold tracking-tight"
                  style={{ color: 'var(--cs-text-primary)' }}
                >
                  Central Stores Dashboard
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--cs-text-secondary)' }}>
                  Warehouse inventory depot, material intake, and automated cross-site requisition gateway.
                </p>
              </div>
            </div>

            {/* Utility Controls (Theme Toggle & Reset Demo Data) */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              {/* Optional Theme Mode Toggle (only rendered when enabled via props for isolated testing) */}
              {showThemeToggle && (
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10"
                  style={{
                    backgroundColor: 'var(--cs-bg-elevated)',
                    border: '1px solid var(--cs-border)',
                    color: 'var(--cs-text-secondary)',
                  }}
                  title={isDarkActive ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                  aria-label="Toggle theme preview"
                >
                  {isDarkActive ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              )}

              {/* Reset to Mock Data */}
              <button
                type="button"
                onClick={resetToMockData}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10"
                style={{
                  backgroundColor: 'var(--cs-bg-elevated)',
                  border: '1px solid var(--cs-border)',
                  color: 'var(--cs-text-secondary)',
                }}
                title="Reset in-memory state to standard baseline fixture"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

          {/* Operational Context Banner */}
          <div
            className="mt-4 pt-3.5 border-t flex flex-wrap items-center justify-between text-xs gap-3"
            style={{
              borderColor: 'var(--cs-border-subtle)',
              color: 'var(--cs-text-muted)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                Feeds: <strong>Service Centre</strong> (Repairs) &amp; <strong>Distribution</strong> (Dispatch)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Boxes className="w-3.5 h-3.5 text-purple-500" />
                Track EVA 03 • PS03 OpsHub
              </span>
            </div>
            <span
              className="px-2 py-0.5 rounded text-[11px] font-mono"
              style={{
                backgroundColor: 'var(--cs-bg-elevated)',
                border: '1px solid var(--cs-border-subtle)',
              }}
            >
              Simulated Client State • In-Memory Store
            </span>
          </div>
        </header>

        {/* 1. KPI Cards Grid */}
        <KpiCardsGrid />

        {/* 2. Table Toolbar & Navigation */}
        <TableToolbar />

        {/* 3. Main Views: Inventory Catalog OR Material Requests OR Analytics OR Movement History */}
        <main>
          {activeView === 'inventory' ? (
            <InventoryTable />
          ) : activeView === 'requests' ? (
            <RequestManagementView />
          ) : activeView === 'analytics' ? (
            <CentralStoresAnalyticsView />
          ) : (
            <StockMovementsTable />
          )}
        </main>

        {/* 4. Modals and Dialogs */}
        <AddItemModal />
        <EditItemModal />
        <NewRequestModal />
        <RejectRequestModal />
        <RestockModal />
        <ImportInventoryModal />

        {/* 5. Live Toast Notification Banner */}
        <ToastNotification />
      </div>
    </div>
  )
}

export default CentralStoresDashboard
