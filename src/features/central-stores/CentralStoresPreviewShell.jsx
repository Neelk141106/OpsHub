import React, { useState, useEffect, useRef } from 'react'
import {
  Warehouse,
  Wrench,
  Truck,
  Workflow,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  LayoutDashboard,
  Check,
} from 'lucide-react'
import { useCentralStoresStore } from './store/useCentralStoresStore'
import { CentralStoresDashboard } from './CentralStoresDashboard'
import './styles/centralStores.css'

export function CentralStoresPreviewShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSiteSwitcherOpen, setIsSiteSwitcherOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [unintegratedSiteNotice, setUnintegratedSiteNotice] = useState(null)

  const isDarkMode = useCentralStoresStore((state) => state.isDarkMode)
  const toggleDarkMode = useCentralStoresStore((state) => state.toggleDarkMode)
  const activeView = useCentralStoresStore((state) => state.activeView)
  const setActiveView = useCentralStoresStore((state) => state.setActiveView)
  const resetToMockData = useCentralStoresStore((state) => state.resetToMockData)
  const items = useCentralStoresStore((state) => state.items)
  const requests = useCentralStoresStore((state) => state.requests)

  const siteSwitcherRef = useRef(null)
  const notificationsRef = useRef(null)
  const userMenuRef = useRef(null)

  // Calculate live notification items from store
  const lowStockItems = items.filter((i) => i.quantity <= i.minStock)
  const pendingRequests = requests.filter((r) => r.status === 'Pending')

  const notificationList = [
    ...(lowStockItems.length > 0
      ? [
          {
            id: 'notif-low-stock',
            type: 'warning',
            title: `${lowStockItems.length} Low-Stock Alert${lowStockItems.length > 1 ? 's' : ''}`,
            desc: `${lowStockItems.map((i) => i.sku).slice(0, 3).join(', ')}${lowStockItems.length > 3 ? '...' : ''} require replenishment.`,
            time: 'Active now',
          },
        ]
      : []),
    ...(pendingRequests.length > 0
      ? [
          {
            id: 'notif-pending-req',
            type: 'info',
            title: `${pendingRequests.length} Pending Requisition${pendingRequests.length > 1 ? 's' : ''}`,
            desc: `Awaiting review & approval gate from Service Centre / Distribution.`,
            time: 'In queue',
          },
        ]
      : []),
    {
      id: 'notif-depot-online',
      type: 'success',
      title: 'Central Depot Operational',
      desc: 'All 10 initial SKUs verified with in-memory deterministic state.',
      time: 'Phase 1 Ready',
    },
  ]

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (siteSwitcherRef.current && !siteSwitcherRef.current.contains(e.target)) {
        setIsSiteSwitcherOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsNotificationsOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSiteSwitcherOpen(false)
        setIsNotificationsOpen(false)
        setIsUserMenuOpen(false)
        setIsMobileMenuOpen(false)
        setUnintegratedSiteNotice(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleNavClick = (viewId, externalSiteNotice = null) => {
    setIsMobileMenuOpen(false)
    if (externalSiteNotice) {
      setUnintegratedSiteNotice(externalSiteNotice)
      return
    }
    setUnintegratedSiteNotice(null)
    setActiveView(viewId)
  }

  const SITES = [
    {
      id: 'central-stores',
      name: 'Site 01: Central Stores',
      tagline: 'Inventory, warehousing & intake depot',
      isReady: true,
      owner: 'Aditi Ekawade (Lead)',
    },
    {
      id: 'service-centre',
      name: 'Site 02: Service Centre',
      tagline: 'Technician triage, repair & return-to-service',
      isReady: false,
      owner: 'Shravani Patil (VESIT)',
    },
    {
      id: 'distribution',
      name: 'Site 03: Distribution',
      tagline: 'Outbound dispatch, freight & fulfillment',
      isReady: false,
      owner: 'Shravani Paygude (VESIT)',
    },
  ]

  return (
    <div
      className={`central-stores-scope ${isDarkMode ? 'dark-mode' : ''} min-h-screen flex flex-col font-sans transition-colors duration-200`}
      style={{
        backgroundColor: 'var(--cs-bg-app)',
        color: 'var(--cs-text-primary)',
      }}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* =========================================================================
            DESKTOP SIDEBAR
           ========================================================================= */}
        <aside
          className={`hidden md:flex flex-col transition-all duration-300 z-30 shrink-0 select-none ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
          style={{
            backgroundColor: 'var(--cs-bg-surface)',
            borderRight: '1px solid var(--cs-border)',
          }}
          aria-label="OpsHub Admin Sidebar"
        >
          {/* Brand Header */}
          <div
            className="h-16 flex items-center justify-between px-4 border-b shrink-0"
            style={{ borderColor: 'var(--cs-border)' }}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{
                  backgroundColor: 'var(--cs-purple-primary)',
                  color: '#FFFFFF',
                }}
              >
                <Layers className="w-5 h-5 stroke-[2.2]" />
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base tracking-tight" style={{ color: 'var(--cs-text-primary)' }}>
                      OpsHub
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase"
                      style={{
                        backgroundColor: 'rgba(101, 84, 192, 0.15)',
                        color: 'var(--cs-purple-deep)',
                      }}
                    >
                      v2.0
                    </span>
                  </div>
                  <p className="text-[11px] truncate" style={{ color: 'var(--cs-text-muted)' }}>
                    Operations Platform
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: 'var(--cs-text-muted)' }}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Toggle sidebar collapse"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {/* Main Operational Hubs */}
            <div>
              {!isSidebarCollapsed && (
                <p
                  className="px-3 text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--cs-text-muted)' }}
                >
                  Operational Sites
                </p>
              )}
              <nav className="space-y-1">
                {/* 1. Overview */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick('inventory', {
                      title: 'OpsHub Pulse / Overview',
                      owner: 'Team Lead (Neel)',
                      desc: 'Global multi-site situational awareness dashboard and throughput telemetry scheduled for tomorrow’s integration.',
                    })
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                  style={{
                    color: 'var(--cs-text-secondary)',
                  }}
                  title={isSidebarCollapsed ? 'System Overview' : undefined}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-purple-600 transition-colors" />
                  {!isSidebarCollapsed && <span>Overview</span>}
                </button>

                {/* 2. Central Stores (ACTIVE) */}
                <button
                  type="button"
                  onClick={() => handleNavClick('inventory')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  } ${
                    !unintegratedSiteNotice && (activeView === 'inventory' || activeView === 'movements')
                      ? 'shadow-sm'
                      : ''
                  }`}
                  style={{
                    backgroundColor:
                      !unintegratedSiteNotice && (activeView === 'inventory' || activeView === 'movements')
                        ? 'var(--cs-active-nav-bg)'
                        : 'transparent',
                    color:
                      !unintegratedSiteNotice && (activeView === 'inventory' || activeView === 'movements')
                        ? 'var(--cs-active-nav-text)'
                        : 'var(--cs-text-secondary)',
                    fontWeight:
                      !unintegratedSiteNotice && (activeView === 'inventory' || activeView === 'movements')
                        ? '600'
                        : '500',
                  }}
                  title={isSidebarCollapsed ? 'Central Stores (Active Depot)' : undefined}
                >
                  <Warehouse className="w-4 h-4 shrink-0 stroke-[2.2]" />
                  {!isSidebarCollapsed && (
                    <div className="flex-1 flex items-center justify-between text-left">
                      <span>Central Stores</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active Depot" />
                    </div>
                  )}
                </button>

                {/* 3. Service Centre (Teammate) */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick('inventory', {
                      title: 'Site 02: Service Centre',
                      owner: 'Shravani Patil (VESIT)',
                      desc: 'Ticket-driven intake, technician triage, diagnostic execution, and return-to-service validation. Phase 1 development ready for tomorrow’s hub integration.',
                    })
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                  style={{ color: 'var(--cs-text-secondary)' }}
                  title={isSidebarCollapsed ? 'Service Centre (Shravani Patil)' : undefined}
                >
                  <Wrench className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-blue-500 transition-colors" />
                  {!isSidebarCollapsed && (
                    <div className="flex-1 flex items-center justify-between text-left">
                      <span>Service Centre</span>
                      <span className="text-[10px] opacity-60">Site 02</span>
                    </div>
                  )}
                </button>

                {/* 4. Distribution (Teammate) */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick('inventory', {
                      title: 'Site 03: Distribution',
                      owner: 'Shravani Paygude (VESIT)',
                      desc: 'Outbound order fulfillment, picking, packing, manifest generation, and logistics transit handoff. Phase 1 development ready for tomorrow’s hub integration.',
                    })
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                  style={{ color: 'var(--cs-text-secondary)' }}
                  title={isSidebarCollapsed ? 'Distribution (Shravani Paygude)' : undefined}
                >
                  <Truck className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-teal-500 transition-colors" />
                  {!isSidebarCollapsed && (
                    <div className="flex-1 flex items-center justify-between text-left">
                      <span>Distribution</span>
                      <span className="text-[10px] opacity-60">Site 03</span>
                    </div>
                  )}
                </button>

                {/* 5. Visual Workflow Builder (Teammate) */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick('inventory', {
                      title: 'Visual Workflow Builder',
                      owner: 'Neel (VESIT)',
                      desc: 'Drag-and-drop node canvas powered by @xyflow/react for designing automated SOPs, approval gates, and multi-site transit connectors.',
                    })
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                  style={{ color: 'var(--cs-text-secondary)' }}
                  title={isSidebarCollapsed ? 'Workflow Builder (Neel)' : undefined}
                >
                  <Workflow className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-purple-500 transition-colors" />
                  {!isSidebarCollapsed && <span>Workflow Builder</span>}
                </button>
              </nav>
            </div>

            {/* Additional Operations Views */}
            <div>
              {!isSidebarCollapsed && (
                <p
                  className="px-3 text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--cs-text-muted)' }}
                >
                  Central Workflows
                </p>
              )}
              <nav className="space-y-1">
                {/* Requests */}
                <button
                  type="button"
                  onClick={() => handleNavClick('requests')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                  style={{
                    backgroundColor:
                      !unintegratedSiteNotice && activeView === 'requests'
                        ? 'var(--cs-active-nav-bg)'
                        : 'transparent',
                    color:
                      !unintegratedSiteNotice && activeView === 'requests'
                        ? 'var(--cs-active-nav-text)'
                        : 'var(--cs-text-secondary)',
                    fontWeight: !unintegratedSiteNotice && activeView === 'requests' ? '600' : '500',
                  }}
                  title={isSidebarCollapsed ? 'Material Requests' : undefined}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && (
                    <div className="flex-1 flex items-center justify-between text-left">
                      <span>Requests</span>
                      {pendingRequests.length > 0 && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.2 rounded-full"
                          style={{
                            backgroundColor: 'var(--cs-purple-primary)',
                            color: '#FFFFFF',
                          }}
                        >
                          {pendingRequests.length}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Analytics & Reports */}
                <button
                  type="button"
                  onClick={() => handleNavClick('analytics')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                  style={{
                    backgroundColor:
                      !unintegratedSiteNotice && activeView === 'analytics'
                        ? 'var(--cs-active-nav-bg)'
                        : 'transparent',
                    color:
                      !unintegratedSiteNotice && activeView === 'analytics'
                        ? 'var(--cs-active-nav-text)'
                        : 'var(--cs-text-secondary)',
                    fontWeight: !unintegratedSiteNotice && activeView === 'analytics' ? '600' : '500',
                  }}
                  title={isSidebarCollapsed ? 'Analytics & Reports' : undefined}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Analytics &amp; Reports</span>}
                </button>

                {/* Settings */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick('inventory', {
                      title: 'Depot & Hub Settings',
                      owner: 'OpsHub Platform Config',
                      desc: 'Global site configuration, role-based access control, and notification webhook dispatch rules scheduled for app-shell integration.',
                    })
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                  style={{ color: 'var(--cs-text-secondary)' }}
                  title={isSidebarCollapsed ? 'Settings' : undefined}
                >
                  <Settings className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-purple-600 transition-colors" />
                  {!isSidebarCollapsed && <span>Settings</span>}
                </button>
              </nav>
            </div>
          </div>

          {/* User Profile Mini Footer in Sidebar */}
          {!isSidebarCollapsed ? (
            <div
              className="p-3 m-3 rounded-xl border flex items-center gap-3"
              style={{
                backgroundColor: 'var(--cs-bg-elevated)',
                borderColor: 'var(--cs-border)',
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm"
                style={{
                  backgroundColor: 'var(--cs-purple-primary)',
                  color: '#FFFFFF',
                }}
              >
                AE
              </div>
              <div className="truncate">
                <span className="text-xs font-bold block truncate" style={{ color: 'var(--cs-text-primary)' }}>
                  Aditi Ekawade
                </span>
                <span className="text-[11px] block truncate" style={{ color: 'var(--cs-text-muted)' }}>
                  Central Stores Lead
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 flex justify-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer"
                style={{
                  backgroundColor: 'var(--cs-purple-primary)',
                  color: '#FFFFFF',
                }}
                title="Aditi Ekawade • Central Stores Lead"
              >
                AE
              </div>
            </div>
          )}
        </aside>

        {/* =========================================================================
            MAIN CONTENT WRAPPER WITH TOPBAR
           ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* TOPBAR */}
          <header
            className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shrink-0"
            style={{
              backgroundColor: 'var(--cs-bg-surface)',
              borderBottom: '1px solid var(--cs-border)',
            }}
          >
            {/* Left: Mobile Toggle & Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                style={{ color: 'var(--cs-text-secondary)' }}
                aria-label="Open mobile navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs truncate">
                <span className="font-semibold" style={{ color: 'var(--cs-text-muted)' }}>
                  OpsHub
                </span>
                <span style={{ color: 'var(--cs-border)' }}>/</span>
                <span className="font-semibold" style={{ color: 'var(--cs-text-muted)' }}>
                  Sites
                </span>
                <span style={{ color: 'var(--cs-border)' }}>/</span>
                <span className="font-bold flex items-center gap-1.5" style={{ color: 'var(--cs-purple-deep)' }}>
                  <Warehouse className="w-3.5 h-3.5" />
                  Site 01: Central Stores
                </span>
                <span style={{ color: 'var(--cs-border)' }}>/</span>
                <span className="capitalize font-medium truncate" style={{ color: 'var(--cs-text-secondary)' }}>
                  {activeView === 'inventory'
                    ? 'Catalog & Inventory'
                    : activeView === 'requests'
                    ? 'Cross-Site Requisitions'
                    : activeView === 'analytics'
                    ? 'Analytics & Trends'
                    : 'Movement Ledger'}
                </span>
              </nav>
            </div>

            {/* Right: Site Switcher, Notifications, Theme, User Profile */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Site Switcher Dropdown */}
              <div className="relative" ref={siteSwitcherRef}>
                <button
                  type="button"
                  id="site-switcher-btn"
                  onClick={() => setIsSiteSwitcherOpen(!isSiteSwitcherOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                  style={{
                    backgroundColor: 'var(--cs-bg-elevated)',
                    border: '1px solid var(--cs-border)',
                    color: 'var(--cs-text-primary)',
                  }}
                  aria-expanded={isSiteSwitcherOpen}
                  aria-haspopup="listbox"
                  aria-label="Select Active Operations Site"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="hidden sm:inline">Site 01: Central Stores</span>
                  <span className="sm:hidden">Site 01</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isSiteSwitcherOpen && (
                  <div
                    role="listbox"
                    aria-label="Operations Sites"
                    className="absolute right-0 mt-2 w-72 rounded-xl p-1.5 shadow-lg z-50 animate-modal-content"
                    style={{
                      backgroundColor: 'var(--cs-bg-card)',
                      border: '1px solid var(--cs-border)',
                      boxShadow: 'var(--cs-shadow-lg)',
                    }}
                  >
                    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--cs-border-subtle)' }}>
                      <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--cs-text-muted)' }}>
                        OpsHub Multi-Site Routing
                      </span>
                    </div>

                    <div className="py-1 space-y-1">
                      {SITES.map((site) => (
                        <button
                          key={site.id}
                          type="button"
                          role="option"
                          aria-selected={site.id === 'central-stores' && !unintegratedSiteNotice}
                          onClick={() => {
                            setIsSiteSwitcherOpen(false)
                            if (site.isReady) {
                              setUnintegratedSiteNotice(null)
                              setActiveView('inventory')
                            } else {
                              setUnintegratedSiteNotice({
                                title: site.name,
                                owner: site.owner,
                                desc: site.tagline,
                              })
                            }
                          }}
                          className="w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start justify-between gap-2 hover:bg-black/5 dark:hover:bg-white/5"
                          style={{
                            backgroundColor:
                              site.id === 'central-stores' && !unintegratedSiteNotice
                                ? 'var(--cs-active-nav-bg)'
                                : 'transparent',
                          }}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className="font-bold"
                                style={{
                                  color:
                                    site.id === 'central-stores' && !unintegratedSiteNotice
                                      ? 'var(--cs-active-nav-text)'
                                      : 'var(--cs-text-primary)',
                                }}
                              >
                                {site.name}
                              </span>
                              {site.isReady ? (
                                <span className="text-[10px] px-1 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                  Active
                                </span>
                              ) : (
                                <span className="text-[10px] px-1 py-0.2 rounded font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                  Teammate
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--cs-text-muted)' }}>
                              {site.owner}
                            </p>
                          </div>
                          {site.id === 'central-stores' && !unintegratedSiteNotice && (
                            <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleDarkMode}
                id="btn-global-theme-toggle"
                className="p-2 rounded-lg text-xs font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10"
                style={{
                  backgroundColor: 'var(--cs-bg-elevated)',
                  border: '1px solid var(--cs-border)',
                  color: 'var(--cs-text-secondary)',
                }}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle light or dark theme"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </button>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  id="notifications-bell-btn"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-lg relative transition-all hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                  style={{
                    backgroundColor: 'var(--cs-bg-elevated)',
                    border: '1px solid var(--cs-border)',
                    color: 'var(--cs-text-secondary)',
                  }}
                  title="Notifications"
                  aria-label="Open notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notificationList.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </button>

                {isNotificationsOpen && (
                  <div
                    className="absolute right-0 mt-2 w-80 sm:w-88 rounded-xl p-3 shadow-lg z-50 animate-modal-content"
                    style={{
                      backgroundColor: 'var(--cs-bg-card)',
                      border: '1px solid var(--cs-border)',
                      boxShadow: 'var(--cs-shadow-lg)',
                    }}
                  >
                    <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--cs-border-subtle)' }}>
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-bold" style={{ color: 'var(--cs-text-primary)' }}>
                          Operational Alerts
                        </span>
                      </div>
                      <span className="text-[11px] font-mono px-1.5 py-0.2 rounded" style={{ backgroundColor: 'var(--cs-bg-elevated)', color: 'var(--cs-text-muted)' }}>
                        {notificationList.length} updates
                      </span>
                    </div>

                    <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                      {notificationList.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-2.5 rounded-lg text-xs space-y-1 transition-colors"
                          style={{
                            backgroundColor: 'var(--cs-bg-elevated)',
                            border: '1px solid var(--cs-border-subtle)',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1.5" style={{ color: 'var(--cs-text-primary)' }}>
                              {notif.type === 'warning' ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              ) : notif.type === 'success' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              )}
                              {notif.title}
                            </span>
                            <span className="text-[10px]" style={{ color: 'var(--cs-text-muted)' }}>
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--cs-text-secondary)' }}>
                            {notif.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  id="user-profile-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--cs-purple-primary)]"
                  aria-label="User Profile Menu"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm"
                    style={{
                      backgroundColor: 'var(--cs-purple-primary)',
                      color: '#FFFFFF',
                    }}
                  >
                    AE
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl p-2 shadow-lg z-50 animate-modal-content"
                    style={{
                      backgroundColor: 'var(--cs-bg-card)',
                      border: '1px solid var(--cs-border)',
                      boxShadow: 'var(--cs-shadow-lg)',
                    }}
                  >
                    <div className="p-3 border-b" style={{ borderColor: 'var(--cs-border-subtle)' }}>
                      <p className="text-xs font-bold" style={{ color: 'var(--cs-text-primary)' }}>
                        Aditi Ekawade
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--cs-text-muted)' }}>
                        aditi.ekawade@ves.ac.in
                      </p>
                      <span
                        className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'rgba(101, 84, 192, 0.15)',
                          color: 'var(--cs-purple-deep)',
                        }}
                      >
                        Central Stores Lead • PS03
                      </span>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          resetToMockData()
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5"
                        style={{ color: 'var(--cs-text-secondary)' }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Baseline Demo Data</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* MAIN PAGE BODY */}
          <main className="flex-1">
            {unintegratedSiteNotice ? (
              /* Professional "Not Yet Integrated" Teammate Workstream Placeholder */
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <div
                  className="rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden"
                  style={{
                    backgroundColor: 'var(--cs-bg-card)',
                    border: '1px solid var(--cs-border)',
                    boxShadow: 'var(--cs-shadow-md)',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-sm"
                    style={{
                      backgroundColor: 'rgba(101, 84, 192, 0.12)',
                      color: 'var(--cs-purple-primary)',
                    }}
                  >
                    <Clock className="w-8 h-8 stroke-[2]" />
                  </div>

                  <span
                    className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block"
                    style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.12)',
                      color: 'var(--cs-accent-blue)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                    }}
                  >
                    Cross-Site Integration Pending
                  </span>

                  <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--cs-text-primary)' }}>
                    {unintegratedSiteNotice.title}
                  </h2>

                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--cs-purple-deep)' }}>
                    Workstream Lead: {unintegratedSiteNotice.owner}
                  </p>

                  <p className="text-sm max-w-lg mx-auto mb-8" style={{ color: 'var(--cs-text-secondary)' }}>
                    {unintegratedSiteNotice.desc}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setUnintegratedSiteNotice(null)
                        setActiveView('inventory')
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-95"
                      style={{
                        backgroundColor: 'var(--cs-purple-primary)',
                      }}
                    >
                      <Warehouse className="w-4 h-4" />
                      <span>Return to Central Stores (Active Depot)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* The standalone CentralStoresDashboard component */
              <CentralStoresDashboard theme={isDarkMode ? 'dark' : 'light'} showThemeToggle={false} />
            )}
          </main>
        </div>
      </div>

      {/* =========================================================================
          MOBILE SLIDE-OUT NAVIGATION DRAWER
         ========================================================================= */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex md:hidden animate-modal-backdrop"
          style={{ backgroundColor: 'rgba(13, 16, 32, 0.65)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="w-72 max-w-[80vw] h-full flex flex-col p-4 animate-modal-content"
            style={{
              backgroundColor: 'var(--cs-bg-surface)',
              borderRight: '1px solid var(--cs-border)',
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--cs-border)' }}>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: 'var(--cs-purple-primary)' }}
                >
                  <Layers className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">OpsHub v2.0</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg"
                style={{ color: 'var(--cs-text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-2 overflow-y-auto">
              <button
                type="button"
                onClick={() => handleNavClick('inventory')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--cs-active-nav-bg)',
                  color: 'var(--cs-active-nav-text)',
                }}
              >
                <Warehouse className="w-4 h-4" />
                <span>Central Stores (Active)</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('requests')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                style={{ color: 'var(--cs-text-secondary)' }}
              >
                <FileText className="w-4 h-4" />
                <span>Material Requests</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('analytics')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                style={{ color: 'var(--cs-text-secondary)' }}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics &amp; Trends</span>
              </button>

              <div className="pt-4 border-t" style={{ borderColor: 'var(--cs-border-subtle)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--cs-text-muted)' }}>
                  Teammate Workstreams
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick('inventory', {
                      title: 'Site 02: Service Centre',
                      owner: 'Shravani Patil (VESIT)',
                      desc: 'Ticket-driven intake, technician triage, diagnostic execution, and return-to-service validation.',
                    })
                  }
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  style={{ color: 'var(--cs-text-secondary)' }}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Service Centre (Site 02)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick('inventory', {
                      title: 'Site 03: Distribution',
                      owner: 'Shravani Paygude (VESIT)',
                      desc: 'Outbound order fulfillment, picking, packing, manifest generation, and logistics transit handoff.',
                    })
                  }
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  style={{ color: 'var(--cs-text-secondary)' }}
                >
                  <Truck className="w-4 h-4" />
                  <span>Distribution (Site 03)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CentralStoresPreviewShell
