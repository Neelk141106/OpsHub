import { useState, useMemo } from 'react'
import {
  Search,
  X,
  Shield,
  Users,
  Boxes,
  LayoutDashboard,
  FileInput,
  CheckCircle2,
  PackageCheck,
  Monitor,
  TrendingDown,
  RotateCcw,
  Cpu,
  BarChart3,
  FileSpreadsheet,
  PackagePlus,
  AlertTriangle,
  SendHorizontal,
  ShieldAlert,
  Wrench,
  Flame,
  UserCheck,
  FileQuestion,
  ArrowRightCircle,
  ShoppingBag,
  Clock,
  Barcode,
  FileText,
  Truck,
  GitFork,
  KeyRound,
  ArrowLeftRight,
  GripVertical,
  SlidersHorizontal,
  Plus,
  Lock,
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { WORKFLOW_MODULES, SITES, MODULE_CATEGORIES } from '../registry/siteModules'

const ICON_MAP = {
  Shield,
  Users,
  Boxes,
  LayoutDashboard,
  FileInput,
  CheckCircle2,
  PackageCheck,
  Monitor,
  TrendingDown,
  RotateCcw,
  Cpu,
  BarChart3,
  FileSpreadsheet,
  PackagePlus,
  AlertTriangle,
  SendHorizontal,
  ShieldAlert,
  Wrench,
  Flame,
  UserCheck,
  FileQuestion,
  ArrowRightCircle,
  ShoppingBag,
  Clock,
  Barcode,
  FileText,
  Truck,
  GitFork,
  KeyRound,
  ArrowLeftRight,
}

function createQuickNode(mod) {
  const initialConfig = {}
  if (mod.supportedSettings) {
    mod.supportedSettings.forEach((setting) => {
      initialConfig[setting.key] = setting.defaultValue ?? ''
    })
  }

  return {
    id: `node_${mod.id}_${Date.now()}`,
    type: 'workflowNode',
    position: {
      x: 220 + Math.floor(Math.random() * 80),
      y: 140 + Math.floor(Math.random() * 80),
    },
    data: {
      ...mod,
      label: mod.name,
      config: initialConfig,
    },
  }
}

export function ModulePalette() {
  const theme = useWorkflowStore((s) => s.theme)
  const isDark = theme === 'dark'

  const activeSite = useWorkflowStore((s) => s.activeSite)
  const isPreviewMode = useWorkflowStore((s) => s.isPreviewMode)
  const togglePreviewMode = useWorkflowStore((s) => s.togglePreviewMode)
  const selectedModule = useWorkflowStore((s) => s.selectedModule)
  const setSelectedModule = useWorkflowStore((s) => s.setSelectedModule)
  const addNode = useWorkflowStore((s) => s.addNode)

  const [searchQuery, setSearchQuery] = useState('')
  const [scopeTab, setScopeTab] = useState('ALL') // 'ALL' | 'CORE' | 'OPERATIONAL'
  const [subFilter, setSubFilter] = useState('ALL')

  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]

  // Filter modules by search, scopeTab (Core vs Operational), and subFilter
  const filteredModules = useMemo(() => {
    return WORKFLOW_MODULES.filter((mod) => {
      // Search match
      const matchesSearch =
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.summary.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      // Scope Tab filter
      if (scopeTab === 'CORE' && !mod.isCore) return false
      if (scopeTab === 'OPERATIONAL' && mod.isCore) return false

      // Subfilter
      if (subFilter === 'CURRENT_SITE') {
        return mod.siteId === activeSite || mod.siteId === 'all'
      }
      if (subFilter === 'TRIGGER') {
        return mod.category === MODULE_CATEGORIES.TRIGGER
      }
      if (subFilter === 'ACTION') {
        return mod.category === MODULE_CATEGORIES.ACTION
      }
      if (subFilter === 'GATEWAY') {
        return mod.category === MODULE_CATEGORIES.GATEWAY
      }

      return true
    })
  }, [searchQuery, scopeTab, subFilter, activeSite])

  // Group modules by Category
  const groupedModules = useMemo(() => {
    const groups = {
      [MODULE_CATEGORIES.CORE]: [],
      [MODULE_CATEGORIES.TRIGGER]: [],
      [MODULE_CATEGORIES.ACTION]: [],
      [MODULE_CATEGORIES.GATEWAY]: [],
    }

    filteredModules.forEach((mod) => {
      if (groups[mod.category]) {
        groups[mod.category].push(mod)
      }
    })

    return groups
  }, [filteredModules])

  const renderIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || Boxes
    return <IconComponent className="w-4 h-4" />
  }

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case MODULE_CATEGORIES.CORE:
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
      case MODULE_CATEGORIES.TRIGGER:
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30'
      case MODULE_CATEGORIES.ACTION:
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
      case MODULE_CATEGORIES.GATEWAY:
        return 'bg-amber-500/15 text-amber-500 border-amber-500/30'
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600'
    }
  }

  const getSiteBadge = (siteId) => {
    if (siteId === 'all') {
      return (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded border ${
            isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          Universal
        </span>
      )
    }
    const site = SITES.find((s) => s.id === siteId)
    if (!site) return null
    return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${site.badgeColor}`}>
        {site.shortName}
      </span>
    )
  }

  // Drag start handler for @xyflow/react canvas
  const onDragStart = (event, mod) => {
    if (isPreviewMode) {
      event.preventDefault()
      return
    }
    event.dataTransfer.setData('application/reactflow', JSON.stringify(mod))
    event.dataTransfer.effectAllowed = 'move'
  }

  // Quick-add module directly onto the canvas
  const handleQuickAdd = (e, mod) => {
    e.stopPropagation()
    if (isPreviewMode) return
    const node = createQuickNode(mod)
    addNode(node)
  }

  return (
    <aside
      className={`w-80 h-full border-r flex flex-col select-none z-10 transition-colors ${
        isDark ? 'bg-slate-900/95 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Palette Header */}
      <div className={`p-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-500" />
            <h2 className="text-xs font-bold tracking-wide uppercase">
              Module Palette
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {filteredModules.length} available
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search modules & settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-7 py-1.5 border rounded text-xs focus:outline-none transition-colors ${
              isDark
                ? 'bg-slate-950/80 border-slate-800 focus:border-purple-500 text-slate-200 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-800 placeholder-slate-400'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Preview Mode Locked Banner */}
        {isPreviewMode && (
          <div className="mb-2 p-2 rounded-lg bg-purple-950/50 border border-purple-500/40 text-[11px] text-purple-200 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span>Palette locked in Preview</span>
            </span>
            <button
              type="button"
              onClick={togglePreviewMode}
              className="text-[10px] underline hover:text-white font-semibold flex-shrink-0 cursor-pointer"
            >
              Return to Editor
            </button>
          </div>
        )}

        {/* Scope Tabs: Core (13) vs Operational (20) vs All (33) */}
        <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-slate-950/40 border border-slate-800/80 mb-2 text-[11px] text-center">
          <button
            type="button"
            onClick={() => setScopeTab('ALL')}
            className={`py-1 rounded font-medium transition-colors ${
              scopeTab === 'ALL'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All (33)
          </button>
          <button
            type="button"
            onClick={() => setScopeTab('CORE')}
            className={`py-1 rounded font-medium transition-colors ${
              scopeTab === 'CORE'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Core (13)
          </button>
          <button
            type="button"
            onClick={() => setScopeTab('OPERATIONAL')}
            className={`py-1 rounded font-medium transition-colors ${
              scopeTab === 'OPERATIONAL'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ops (20)
          </button>
        </div>

        {/* Subfilter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-[10px]">
          <button
            type="button"
            onClick={() => setSubFilter('ALL')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              subFilter === 'ALL'
                ? 'bg-purple-600/80 text-white font-medium'
                : isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Types
          </button>
          <button
            type="button"
            onClick={() => setSubFilter('CURRENT_SITE')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              subFilter === 'CURRENT_SITE'
                ? 'bg-purple-600/80 text-white font-medium'
                : isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            {currentSiteMeta.shortName} Only
          </button>
          <button
            type="button"
            onClick={() => setSubFilter('TRIGGER')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              subFilter === 'TRIGGER'
                ? 'bg-purple-600/80 text-white font-medium'
                : isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Triggers
          </button>
          <button
            type="button"
            onClick={() => setSubFilter('ACTION')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              subFilter === 'ACTION'
                ? 'bg-purple-600/80 text-white font-medium'
                : isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Actions
          </button>
          <button
            type="button"
            onClick={() => setSubFilter('GATEWAY')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              subFilter === 'GATEWAY'
                ? 'bg-purple-600/80 text-white font-medium'
                : isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Gateways
          </button>
        </div>
      </div>

      {/* Modules List by Group */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.entries(groupedModules).map(([category, modules]) => {
          if (modules.length === 0) return null

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                <span>{category}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                  {modules.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {modules.map((mod) => {
                  const isSelected = selectedModule?.id === mod.id

                  return (
                    <div
                      key={mod.id}
                      draggable={!isPreviewMode}
                      onDragStart={(e) => onDragStart(e, mod)}
                      onClick={() => setSelectedModule(mod)}
                      className={`group p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500/70 shadow-sm shadow-purple-950 ring-1 ring-purple-500/30'
                          : isDark
                          ? 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 hover:border-slate-300'
                      } ${isPreviewMode ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
                      title={
                        isPreviewMode
                          ? 'Module editing locked in Preview mode'
                          : 'Drag to canvas or click + to add'
                      }
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`p-1 rounded border flex-shrink-0 ${
                              mod.isCore
                                ? 'bg-indigo-950/50 border-indigo-500/30 text-indigo-400'
                                : 'bg-slate-800 border-slate-700 text-slate-300'
                            }`}
                          >
                            {renderIcon(mod.icon)}
                          </div>
                          <h3 className="text-xs font-semibold leading-tight truncate">
                            {mod.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={isPreviewMode}
                            onClick={(e) => handleQuickAdd(e, mod)}
                            className={`p-1 rounded border transition-colors ${
                              isPreviewMode
                                ? 'bg-slate-800/40 text-slate-500 opacity-40 cursor-not-allowed border-slate-800'
                                : 'bg-slate-800/80 hover:bg-purple-600 text-slate-400 hover:text-white border-slate-700'
                            }`}
                            title={
                              isPreviewMode
                                ? 'Adding modules disabled in Preview mode'
                                : 'Add directly to canvas'
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          {!isPreviewMode && (
                            <GripVertical className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 flex-shrink-0 mt-0.5" />
                          )}
                        </div>
                      </div>

                      <p className={`text-[11px] line-clamp-2 leading-relaxed mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {mod.summary}
                      </p>

                      <div className={`flex items-center justify-between pt-1 border-t text-[10px] ${
                        isDark ? 'border-slate-800/60' : 'border-slate-200'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded border ${getCategoryBadgeClass(
                              mod.category
                            )} font-medium`}
                          >
                            {mod.category}
                          </span>
                          {getSiteBadge(mod.siteId)}
                        </div>
                        <span className="text-slate-400 font-mono">
                          {mod.inputs > 0 ? `${mod.inputs} in` : 'entry'} • {mod.outputs} out
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filteredModules.length === 0 && (
          <div className="text-center py-8 px-4 text-slate-400 text-xs">
            <p className="font-semibold">No modules match your filter</p>
            <p className="text-[11px] mt-1">Try switching to &quot;All&quot; or clearing your search.</p>
          </div>
        )}
      </div>

      {/* Footer Helper Note */}
      <div className={`p-2.5 border-t text-[10px] flex items-center justify-between ${
        isDark ? 'bg-slate-950/70 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <span>Drag card or click + to instantiate</span>
        <span className="font-mono text-purple-500 font-semibold">13 Core • 20 Ops</span>
      </div>
    </aside>
  )
}
