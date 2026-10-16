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
  ChevronDown,
  ChevronRight,
  Info,
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
  const isSimulationMode = useWorkflowStore((s) => s.isSimulationMode)
  const exitSimulation = useWorkflowStore((s) => s.exitSimulation)
  const selectedModule = useWorkflowStore((s) => s.selectedModule)
  const setSelectedModule = useWorkflowStore((s) => s.setSelectedModule)
  const addNode = useWorkflowStore((s) => s.addNode)

  const [searchQuery, setSearchQuery] = useState('')
  const [scopeTab, setScopeTab] = useState('ALL') // 'ALL' | 'CORE' | 'OPERATIONAL'
  const [subFilter, setSubFilter] = useState('ALL')
  const [collapsedCategories, setCollapsedCategories] = useState({})
  const [expandedInfoModuleId, setExpandedInfoModuleId] = useState(null)

  const toggleCategoryCollapse = (category) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const toggleModuleInfo = (e, modId) => {
    e.stopPropagation()
    setExpandedInfoModuleId((prev) => (prev === modId ? null : modId))
  }

  const currentSiteMeta = SITES.find((s) => s.id === activeSite) || SITES[0]
  const isLocked = isPreviewMode || isSimulationMode

  // Dynamic module counts from actual registry
  const totalRegisteredCount = WORKFLOW_MODULES.length
  const totalCoreCount = useMemo(() => WORKFLOW_MODULES.filter((m) => m.isCore).length, [])
  const totalOpsCount = useMemo(() => WORKFLOW_MODULES.filter((m) => !m.isCore).length, [])

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
      if (subFilter === 'START') {
        return mod.category === MODULE_CATEGORIES.START
      }
      if (subFilter === 'OPERATION') {
        return mod.category === MODULE_CATEGORIES.OPERATION
      }
      if (subFilter === 'GATEWAY') {
        return mod.category === MODULE_CATEGORIES.GATEWAY
      }
      if (subFilter === 'APPROVAL') {
        return mod.category === MODULE_CATEGORIES.APPROVAL
      }
      if (subFilter === 'END') {
        return mod.category === MODULE_CATEGORIES.END
      }
      if (subFilter === 'SYSTEM') {
        return mod.category === MODULE_CATEGORIES.SYSTEM
      }

      return true
    })
  }, [searchQuery, scopeTab, subFilter, activeSite])

  // Group modules by Category across all 6 standard categories
  const groupedModules = useMemo(() => {
    const groups = {
      [MODULE_CATEGORIES.START]: [],
      [MODULE_CATEGORIES.OPERATION]: [],
      [MODULE_CATEGORIES.GATEWAY]: [],
      [MODULE_CATEGORIES.APPROVAL]: [],
      [MODULE_CATEGORIES.END]: [],
      [MODULE_CATEGORIES.SYSTEM]: [],
    }

    filteredModules.forEach((mod) => {
      const cat = mod.category
      if (!groups[cat]) {
        groups[cat] = []
      }
      groups[cat].push(mod)
    })

    return groups
  }, [filteredModules])

  const renderIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || Boxes
    return <IconComponent className="w-3.5 h-3.5" />
  }

  // Category metadata according to domain specifications
  const CATEGORY_INFO = {
    [MODULE_CATEGORIES.START]: {
      name: 'Start & Triggers',
      description: 'How the workflow begins.',
      typeLabel: 'Trigger',
    },
    [MODULE_CATEGORIES.OPERATION]: {
      name: 'Operations',
      description: 'Actions performed during the workflow.',
      typeLabel: 'Action',
    },
    [MODULE_CATEGORIES.GATEWAY]: {
      name: 'Decisions',
      description: 'Checks that determine what happens next.',
      typeLabel: 'Decision',
    },
    [MODULE_CATEGORIES.APPROVAL]: {
      name: 'Approvals',
      description: 'Steps that require authorization.',
      typeLabel: 'Approval',
    },
    [MODULE_CATEGORIES.END]: {
      name: 'End & Outcomes',
      description: 'How a workflow finishes.',
      typeLabel: 'Outcome',
    },
    [MODULE_CATEGORIES.SYSTEM]: {
      name: 'Integrations',
      description: 'Connections to external systems, where supported.',
      typeLabel: 'Integration',
    },
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
        isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Palette Header */}
      <div className={`p-3.5 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xs font-bold tracking-wide uppercase text-slate-900 dark:text-slate-100">
              Workflow Modules
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
            {filteredModules.length} available
          </span>
        </div>

        {/* Clear Beginner-Friendly Instruction */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
          Drag a module onto the canvas to add a step.
        </p>

        {/* Search Bar with exact placeholder: Search modules... */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-7 py-1.5 border rounded-lg text-xs focus:outline-none transition-colors ${
              isDark
                ? 'bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-800 placeholder-slate-400'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              aria-label="Clear search"
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

        {/* Simulation Mode Locked Banner */}
        {isSimulationMode && (
          <div className="mb-2 p-2 rounded-lg bg-amber-950/50 border border-amber-500/40 text-[11px] text-amber-200 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Palette locked in Sim</span>
            </span>
            <button
              type="button"
              onClick={exitSimulation}
              className="text-[10px] underline hover:text-white font-semibold flex-shrink-0 cursor-pointer"
            >
              Exit Simulation
            </button>
          </div>
        )}

        {/* Scope Tabs: Dynamic counts from actual registry */}
        <div className={`grid grid-cols-3 gap-1 p-0.5 rounded-lg border mb-2 text-[11px] text-center ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => setScopeTab('ALL')}
            className={`py-1 rounded font-medium transition-colors cursor-pointer ${
              scopeTab === 'ALL'
                ? 'bg-purple-600 text-white shadow-xs'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalRegisteredCount})
          </button>
          <button
            type="button"
            onClick={() => setScopeTab('CORE')}
            className={`py-1 rounded font-medium transition-colors cursor-pointer ${
              scopeTab === 'CORE'
                ? 'bg-purple-600 text-white shadow-xs'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Core ({totalCoreCount})
          </button>
          <button
            type="button"
            onClick={() => setScopeTab('OPERATIONAL')}
            className={`py-1 rounded font-medium transition-colors cursor-pointer ${
              scopeTab === 'OPERATIONAL'
                ? 'bg-purple-600 text-white shadow-xs'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ops ({totalOpsCount})
          </button>
        </div>

        {/* Category Filter Selector */}
        <div className="flex items-center gap-2">
          <select
            value={subFilter}
            onChange={(e) => setSubFilter(e.target.value)}
            className={`w-full py-1.5 px-2 rounded-lg border text-xs focus:outline-none transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500'
            }`}
            aria-label="Filter by Category"
          >
            <option value="ALL">All Categories ({filteredModules.length})</option>
            <option value="START">Start & Triggers</option>
            <option value="OPERATION">Operations</option>
            <option value="GATEWAY">Decisions</option>
            <option value="APPROVAL">Approvals</option>
            <option value="END">End & Outcomes</option>
            <option value="SYSTEM">Integrations</option>
            <option value="CURRENT_SITE">{currentSiteMeta.name} Specific</option>
          </select>
        </div>
      </div>

      {/* Modules List by Group */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {Object.entries(groupedModules).map(([category, modules]) => {
          if (modules.length === 0) return null
          const isCollapsed = Boolean(collapsedCategories[category])
          const catMeta = CATEGORY_INFO[category] || {
            name: category,
            description: '',
            typeLabel: 'Module',
          }

          return (
            <div key={category} className="space-y-1.5">
              {/* Collapsible Category Header with Title & Sub-description */}
              <button
                type="button"
                onClick={() => toggleCategoryCollapse(category)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100'
                }`}
                title={isCollapsed ? `Expand ${catMeta.name}` : `Collapse ${catMeta.name}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {catMeta.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {catMeta.description}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                  } flex-shrink-0 ml-2`}
                >
                  {modules.length}
                </span>
              </button>

              {/* Module Cards in Group */}
              {!isCollapsed && (
                <div className="space-y-1.5">
                  {modules.map((mod) => {
                    const isSelected = selectedModule?.id === mod.id
                    const isInfoExpanded = expandedInfoModuleId === mod.id

                    return (
                      <div
                        key={mod.id}
                        draggable={!isLocked}
                        onDragStart={(e) => onDragStart(e, mod)}
                        onClick={() => setSelectedModule(mod)}
                        className={`group p-2.5 rounded-lg border text-left transition-colors flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-400 dark:border-purple-600'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                        } ${isLocked ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
                        title={
                          isSimulationMode
                            ? 'Simulation active — drag locked'
                            : isPreviewMode
                            ? 'Preview mode — drag locked'
                            : 'Drag to canvas or click + to add'
                        }
                      >
                        {/* Top Row: Drag Grip, Icon, Name, Type Badge, Info & Quick Add */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {!isLocked && (
                              <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 flex-shrink-0" />
                            )}
                            <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {renderIcon(mod.icon)}
                            </div>
                            <div className="min-w-0 flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {mod.name}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium border flex-shrink-0 ${
                                isDark
                                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {catMeta.typeLabel}
                              </span>
                            </div>
                          </div>

                          {/* Action Controls: Info & Quick Add */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={(e) => toggleModuleInfo(e, mod.id)}
                              className={`w-6 h-6 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                                isInfoExpanded
                                  ? 'bg-purple-600 text-white border-purple-500'
                                  : isDark
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border-slate-700'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border-slate-200'
                              }`}
                              title={isInfoExpanded ? 'Hide description' : 'View explanation'}
                              aria-label="Toggle module info"
                            >
                              <Info className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              disabled={isLocked}
                              onClick={(e) => handleQuickAdd(e, mod)}
                              className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${
                                isLocked
                                  ? 'bg-slate-800/40 text-slate-500 opacity-40 cursor-not-allowed border-slate-800'
                                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 dark:hover:bg-purple-600 text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white border-slate-200 dark:border-slate-700 cursor-pointer'
                              }`}
                              title="Click to add to canvas"
                              aria-label="Add module to canvas"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* One-Line Plain-English Explanation */}
                        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 truncate pl-5">
                          {mod.summary}
                        </p>

                        {/* Expandable Explanation Drawer */}
                        {isInfoExpanded && mod.explanation && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className={`mt-1 p-2.5 rounded-lg border text-[11px] leading-relaxed space-y-1.5 cursor-default ${
                              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div>
                              <span className="font-semibold text-purple-600 dark:text-purple-400">What it does: </span>
                              <span>{mod.explanation.whatItDoes}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-purple-600 dark:text-purple-400">When to use: </span>
                              <span>{mod.explanation.whenToUse}</span>
                            </div>
                            {mod.explanation.example && (
                              <div className="text-[10.5px] italic text-slate-500 dark:text-slate-400">
                                Example: {mod.explanation.example}
                              </div>
                            )}
                            {mod.explanation.connectionRequirements && (
                              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                                Connections: {mod.explanation.connectionRequirements}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Clear Empty State When No Modules Match */}
        {filteredModules.length === 0 && (
          <div className="text-center py-8 px-4 text-slate-500 dark:text-slate-400 text-xs space-y-2">
            <p className="font-semibold text-slate-700 dark:text-slate-300">No modules found</p>
            <p className="text-[11px]">
              {searchQuery ? `No modules match "${searchQuery}"` : 'No modules available for current filters.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 px-3 py-1 rounded-md text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Palette Footer Note */}
      <div className={`p-2.5 border-t text-[10px] flex items-center justify-between ${
        isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <span>Drag module or click + to add</span>
        <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">
          {totalCoreCount} Core • {totalOpsCount} Ops ({totalRegisteredCount} Total)
        </span>
      </div>
    </aside>
  )
}
