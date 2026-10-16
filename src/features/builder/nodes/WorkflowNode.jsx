import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import {
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
  Trash2,
  AlertCircle,
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { SITES, MODULE_CATEGORIES } from '../registry/siteModules'

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

function WorkflowNodeComponent({ id, data, selected }) {
  const theme = useWorkflowStore((s) => s.theme)
  const isDark = theme === 'dark'

  const isPreviewMode = useWorkflowStore((s) => s.isPreviewMode)
  const isSimulationMode = useWorkflowStore((s) => s.isSimulationMode)
  const simulation = useWorkflowStore((s) => s.simulation)
  const deleteNode = useWorkflowStore((s) => s.deleteNode)
  const getActiveValidationReport = useWorkflowStore((s) => s.getActiveValidationReport)

  const validation = getActiveValidationReport()
  const nodeIssues = validation?.nodeIssuesMap?.[id] || []
  const hasErrors = nodeIssues.some((i) => i.type === 'error')
  const hasWarnings = nodeIssues.some((i) => i.type === 'warning')

  // Simulation state derivation
  const isCurrentNode = isSimulationMode && simulation?.currentNodeId === id
  const visitedIndex = isSimulationMode && Array.isArray(simulation?.visitedNodeIds)
    ? simulation.visitedNodeIds.indexOf(id)
    : -1
  const isVisitedNode = visitedIndex !== -1 && !isCurrentNode
  const stepNumber = isCurrentNode
    ? simulation?.currentStep
    : visitedIndex !== -1
    ? visitedIndex + 1
    : null

  const IconComponent = (data?.icon && ICON_MAP[data.icon]) || Boxes
  const siteMeta = SITES.find((s) => s.id === data?.siteId)
  const isStart = data?.category === MODULE_CATEGORIES.START || (data?.inputs ?? 1) === 0
  const isEnd = data?.category === MODULE_CATEGORIES.END || (data?.outputs ?? 1) === 0
  const isGateway = data?.category === MODULE_CATEGORIES.GATEWAY
  const isApproval = data?.category === MODULE_CATEGORIES.APPROVAL
  const isSystem = data?.category === MODULE_CATEGORIES.SYSTEM || data?.isCore

  const getBorderColor = () => {
    // 1. Simulation Highlights (Highest visual priority)
    if (isCurrentNode) {
      return 'border-amber-400 ring-4 ring-amber-400/50 shadow-2xl shadow-amber-500/30'
    }
    if (isVisitedNode) {
      return isDark
        ? 'border-emerald-500/80 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/40'
        : 'border-emerald-500 ring-2 ring-emerald-400/50 shadow-md shadow-emerald-100'
    }

    if (selected) {
      return 'border-purple-600 ring-2 ring-purple-500/40 shadow-xl'
    }
    if (hasErrors) {
      return isDark
        ? 'border-rose-500/80 ring-1 ring-rose-500/40'
        : 'border-rose-400 ring-1 ring-rose-400/40'
    }
    if (hasWarnings) {
      return isDark ? 'border-amber-500/70' : 'border-amber-400'
    }
    if (isStart) {
      return isDark
        ? 'border-purple-500/40 hover:border-purple-400'
        : 'border-purple-200 hover:border-purple-300'
    }
    if (isGateway) {
      return isDark
        ? 'border-amber-500/40 hover:border-amber-400'
        : 'border-amber-200 hover:border-amber-300'
    }
    if (isApproval) {
      return isDark
        ? 'border-rose-500/40 hover:border-rose-400'
        : 'border-rose-200 hover:border-rose-300'
    }
    if (isEnd) {
      return isDark
        ? 'border-emerald-500/40 hover:border-emerald-400'
        : 'border-emerald-200 hover:border-emerald-300'
    }
    if (isSystem) {
      return isDark
        ? 'border-indigo-500/40 hover:border-indigo-400'
        : 'border-indigo-200 hover:border-indigo-300'
    }
    return isDark
      ? 'border-slate-800 hover:border-slate-700'
      : 'border-slate-200 hover:border-slate-300'
  }

  const getCategoryBadgeClass = () => {
    if (isStart) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    if (isGateway) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    if (isApproval) return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    if (isEnd) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    if (isSystem) return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  }

  const isLocked = isPreviewMode || isSimulationMode

  return (
    <div
      className={`min-w-[250px] max-w-[290px] rounded-xl border text-xs transition-all duration-150 relative ${
        isDark ? 'bg-slate-900 text-slate-100 shadow-xl' : 'bg-white text-slate-800 shadow-sm'
      } ${getBorderColor()}`}
    >
      {/* Target Connection Handle (Inbound) */}
      {(data?.inputs ?? 1) > 0 && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="in"
            isConnectable={!isLocked}
            title={
              isLocked
                ? isSimulationMode
                  ? 'Input handle (read-only in simulation)'
                  : 'Input handle (read-only in preview)'
                : 'Input handle: Drag an edge from an upstream step to connect here'
            }
            className={`!w-3.5 !h-3.5 !bg-purple-600 !border-2 ${
              isDark ? '!border-slate-900' : '!border-white'
            } ${
              isLocked
                ? '!cursor-default opacity-75'
                : 'hover:!scale-150 !transition-transform !cursor-crosshair'
            } shadow-md`}
          />
          <span
            className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold tracking-tight select-none pointer-events-none transition-opacity ${
              selected ? 'opacity-100' : 'opacity-60'
            } ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            ← In
          </span>
        </>
      )}

      {/* Starting Trigger Banner */}
      {isStart && (
        <div className="px-3 py-1 bg-purple-500/10 border-b border-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] font-semibold flex items-center justify-between rounded-t-xl">
          <span>● Starting Trigger (Entry Node)</span>
          <span className="text-[9px] text-slate-400 font-mono">0 inputs</span>
        </div>
      )}

      {/* Terminal Outcome Banner */}
      {isEnd && (
        <div className="px-3 py-1 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold flex items-center justify-between rounded-t-xl">
          <span>■ Terminal Outcome (Final Step)</span>
          <span className="text-[9px] text-slate-400 font-mono">0 outputs</span>
        </div>
      )}

      {/* Node Header */}
      <div
        className={`px-3 py-2 rounded-t-xl border-b flex items-center justify-between gap-2 ${
          isCurrentNode
            ? 'bg-amber-500/15 border-amber-500/40'
            : isVisitedNode
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : isDark
            ? 'bg-slate-950/70 border-slate-800'
            : 'bg-slate-50 border-slate-100'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`p-1.5 rounded-lg border flex-shrink-0 ${
              isCurrentNode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 dark:text-amber-300'
                : isVisitedNode
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500 dark:text-emerald-300'
                : isStart
                ? 'bg-purple-950/40 border-purple-500/30 text-purple-400'
                : isGateway
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
                : isApproval
                ? 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                : isEnd
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : isSystem
                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-400'
                : 'bg-blue-950/40 border-blue-500/30 text-blue-400'
            }`}
          >
            <IconComponent className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs truncate">
            {data?.label || data?.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Simulation Step Badges */}
          {isCurrentNode && (
            <span
              className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs animate-pulse"
              title="Currently executing step in Time Machine simulation"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              <span>Step {stepNumber}</span>
            </span>
          )}

          {isVisitedNode && (
            <span
              className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              title={`Previously executed step ${stepNumber} in simulation`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
              <span>Step {stepNumber}</span>
            </span>
          )}

          {/* Validation Warning / Error Icon */}
          {!isSimulationMode && hasErrors && (
            <span title={`${nodeIssues.length} validation issue(s)`}>
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            </span>
          )}

          {/* Delete Action Button (Hidden in Preview & Simulation Modes) */}
          {!isLocked && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                deleteNode(id)
              }}
              className="p-1 rounded hover:bg-rose-500/15 text-slate-400 hover:text-rose-500 transition-colors"
              title="Delete node from canvas"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Node Body */}
      <div className="p-3 space-y-2">
        <p className={`text-[11px] line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {data?.summary}
        </p>

        {/* Badges */}
        <div
          className={`flex items-center justify-between pt-1 border-t text-[10px] ${
            isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`px-1.5 py-0.5 rounded border font-medium truncate ${getCategoryBadgeClass()}`}>
              {data?.category || 'Module'}
            </span>
            {siteMeta && (
              <span className={`px-1.5 py-0.5 rounded border font-medium ${siteMeta.badgeColor}`}>
                {siteMeta.shortName}
              </span>
            )}
            {data?.siteId === 'all' && (
              <span
                className={`px-1.5 py-0.5 rounded border ${
                  isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                Universal
              </span>
            )}
          </div>

          <span className={`font-mono flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {(data?.inputs ?? 1) > 0 ? `${data.inputs} in` : 'entry'} • {data?.outputs ?? 1} out
          </span>
        </div>
      </div>

      {/* Source Connection Handle(s) (Outbound) */}
      {(data?.outputs ?? 1) === 1 && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="out"
            isConnectable={!isLocked}
            title={
              isLocked
                ? isSimulationMode
                  ? 'Output handle (read-only in simulation)'
                  : 'Output handle (read-only in preview)'
                : 'Drag from this handle to the next step'
            }
            className={`!w-3.5 !h-3.5 !bg-purple-600 !border-2 ${
              isDark ? '!border-slate-900' : '!border-white'
            } ${
              isLocked
                ? '!cursor-default opacity-75'
                : 'hover:!scale-150 !transition-transform !cursor-crosshair'
            } shadow-md`}
          />
          <span
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold tracking-tight select-none pointer-events-none transition-opacity ${
              selected ? 'opacity-100' : 'opacity-60'
            } ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Next →
          </span>
        </>
      )}

      {(data?.outputs ?? 1) === 2 && (
        <>
          {/* True Branch */}
          <Handle
            type="source"
            position={Position.Right}
            id="out-true"
            isConnectable={!isLocked}
            style={{ top: '35%' }}
            title={
              isLocked
                ? isSimulationMode
                  ? 'True branch (read-only in simulation)'
                  : 'True branch (read-only in preview)'
                : 'True (Condition Met) path: Drag from here to next step'
            }
            className={`!w-3.5 !h-3.5 !bg-emerald-500 !border-2 ${
              isDark ? '!border-slate-900' : '!border-white'
            } ${
              isLocked
                ? '!cursor-default opacity-75'
                : 'hover:!scale-150 !transition-transform !cursor-crosshair'
            } shadow-md`}
          />
          <span
            className="absolute right-2.5 top-[35%] -translate-y-1/2 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 select-none pointer-events-none"
            title="When condition evaluates to True"
          >
            True →
          </span>

          {/* False Branch */}
          <Handle
            type="source"
            position={Position.Right}
            id="out-false"
            isConnectable={!isLocked}
            style={{ top: '65%' }}
            title={
              isLocked
                ? isSimulationMode
                  ? 'False branch (read-only in simulation)'
                  : 'False branch (read-only in preview)'
                : 'False (Fallback) path: Drag from here to fallback step'
            }
            className={`!w-3.5 !h-3.5 !bg-rose-500 !border-2 ${
              isDark ? '!border-slate-900' : '!border-white'
            } ${
              isLocked
                ? '!cursor-default opacity-75'
                : 'hover:!scale-150 !transition-transform !cursor-crosshair'
            } shadow-md`}
          />
          <span
            className="absolute right-2.5 top-[65%] -translate-y-1/2 text-[9px] font-mono font-bold text-rose-600 dark:text-rose-400 select-none pointer-events-none"
            title="When condition evaluates to False"
          >
            False →
          </span>
        </>
      )}
    </div>
  )
}

export const WorkflowNode = memo(WorkflowNodeComponent)
