import { useState, useMemo } from 'react'
import {
  Search,
  X,
  PackagePlus,
  AlertTriangle,
  FileInput,
  Boxes,
  SendHorizontal,
  ShieldAlert,
  Wrench,
  Flame,
  UserCheck,
  FileQuestion,
  CheckCircle2,
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
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { WORKFLOW_MODULES, SITES, MODULE_CATEGORIES } from '../registry/siteModules'

const ICON_MAP = {
  PackagePlus,
  AlertTriangle,
  FileInput,
  Boxes,
  SendHorizontal,
  ShieldAlert,
  Wrench,
  Flame,
  UserCheck,
  FileQuestion,
  CheckCircle2,
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

export function ModulePalette() {
  const activeSite = useWorkflowStore((s) => s.activeSite)
  const selectedModule = useWorkflowStore((s) => s.selectedModule)
  const setSelectedModule = useWorkflowStore((s) => s.setSelectedModule)

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL')

  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]

  // Filter modules
  const filteredModules = useMemo(() => {
    return WORKFLOW_MODULES.filter((mod) => {
      // Search match
      const matchesSearch =
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.summary.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      // Category filter
      if (activeCategoryFilter === 'CURRENT_SITE') {
        return mod.siteId === activeSite || mod.siteId === 'all'
      }
      if (activeCategoryFilter === 'TRIGGER') {
        return mod.category === MODULE_CATEGORIES.TRIGGER
      }
      if (activeCategoryFilter === 'ACTION') {
        return mod.category === MODULE_CATEGORIES.ACTION
      }
      if (activeCategoryFilter === 'GATEWAY') {
        return mod.category === MODULE_CATEGORIES.GATEWAY
      }

      return true
    })
  }, [searchQuery, activeCategoryFilter, activeSite])

  // Group modules by Category
  const groupedModules = useMemo(() => {
    const groups = {
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
    return <IconComponent className="w-4 h-4 text-slate-300" />
  }

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case MODULE_CATEGORIES.TRIGGER:
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30'
      case MODULE_CATEGORIES.ACTION:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30'
      case MODULE_CATEGORIES.GATEWAY:
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600'
    }
  }

  const getSiteBadge = (siteId) => {
    if (siteId === 'all') {
      return (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
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

  return (
    <aside className="w-80 h-full bg-slate-900/95 border-r border-slate-800 flex flex-col select-none z-10">
      {/* Palette Header */}
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            <h2 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
              Module Palette
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {filteredModules.length} items
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search operational modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500/60 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('ALL')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'ALL'
                ? 'bg-purple-600 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('CURRENT_SITE')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'CURRENT_SITE'
                ? 'bg-purple-600 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {currentSiteMeta.shortName} Only
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('TRIGGER')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'TRIGGER'
                ? 'bg-purple-600 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Triggers
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('ACTION')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'ACTION'
                ? 'bg-purple-600 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Actions
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('GATEWAY')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              activeCategoryFilter === 'GATEWAY'
                ? 'bg-purple-600 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
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
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {modules.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {modules.map((mod) => {
                  const isSelected = selectedModule?.id === mod.id

                  return (
                    <div
                      key={mod.id}
                      onClick={() => setSelectedModule(mod)}
                      className={`group p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500/60 shadow-sm shadow-purple-950'
                          : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 group-hover:border-purple-500/40 group-hover:text-purple-300 transition-colors">
                            {renderIcon(mod.icon)}
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold text-slate-100 group-hover:text-purple-200 transition-colors leading-tight">
                              {mod.name}
                            </h3>
                          </div>
                        </div>
                        <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-0.5" />
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                        {mod.summary}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded border ${getCategoryBadgeClass(mod.category)} font-medium`}>
                            {mod.category}
                          </span>
                          {getSiteBadge(mod.siteId)}
                        </div>
                        <span className="text-slate-500 font-mono">
                          {mod.inputs > 0 ? `${mod.inputs} in` : 'trigger'} • {mod.outputs} out
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
          <div className="text-center py-8 px-4 text-slate-500 text-xs">
            <p className="font-semibold text-slate-400">No modules match your filter</p>
            <p className="text-[11px] mt-1">Try clearing your search or switching categories.</p>
          </div>
        )}
      </div>

      {/* Footer Helper Note */}
      <div className="p-2.5 bg-slate-950/70 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Part 1 Preview • Click card to inspect</span>
        <span className="font-mono text-purple-400">D&D: Part 2</span>
      </div>
    </aside>
  )
}
