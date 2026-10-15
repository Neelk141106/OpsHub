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
  const deleteNode = useWorkflowStore((s) => s.deleteNode)
  const getActiveValidationReport = useWorkflowStore((s) => s.getActiveValidationReport)

  const validation = getActiveValidationReport()
  const nodeIssues = validation?.nodeIssuesMap?.[id] || []
  const hasErrors = nodeIssues.some((i) => i.type === 'error')
  const hasWarnings = nodeIssues.some((i) => i.type === 'warning')

  const IconComponent = (data?.icon && ICON_MAP[data.icon]) || Boxes
  const siteMeta = SITES.find((s) => s.id === data?.siteId)
  const isTrigger = data?.category === MODULE_CATEGORIES.TRIGGER
  const isGateway = data?.category === MODULE_CATEGORIES.GATEWAY
  const isCore = data?.category === MODULE_CATEGORIES.CORE || data?.isCore

  const getBorderColor = () => {
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
    if (isCore) {
      return isDark
        ? 'border-indigo-500/40 hover:border-indigo-400'
        : 'border-indigo-200 hover:border-indigo-300'
    }
    if (isTrigger) {
      return isDark
        ? 'border-purple-500/40 hover:border-purple-400'
        : 'border-purple-200 hover:border-purple-300'
    }
    if (isGateway) {
      return isDark
        ? 'border-amber-500/40 hover:border-amber-400'
        : 'border-amber-200 hover:border-amber-300'
    }
    return isDark
      ? 'border-slate-800 hover:border-slate-700'
      : 'border-slate-200 hover:border-slate-300'
  }

  const getCategoryBadgeClass = () => {
    if (isCore) return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    if (isTrigger) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    if (isGateway) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  }

  return (
    <div
      className={`min-w-[250px] max-w-[290px] rounded-xl border text-xs transition-all duration-150 relative ${
        isDark ? 'bg-slate-900 text-slate-100 shadow-xl' : 'bg-white text-slate-800 shadow-sm'
      } ${getBorderColor()}`}
    >
      {/* Target Connection Handle (Inbound) */}
      {(data?.inputs ?? 1) > 0 && (
        <Handle
          type="target"
          position={Position.Left}
          id="in"
          isConnectable={!isPreviewMode}
          title={
            isPreviewMode
              ? 'Input port (read-only in preview)'
              : 'Input connection port (Drag connection here)'
          }
          className={`!w-3.5 !h-3.5 !bg-purple-600 !border-2 ${
            isDark ? '!border-slate-900' : '!border-white'
          } ${
            isPreviewMode
              ? '!cursor-default opacity-75'
              : 'hover:!scale-150 !transition-transform !cursor-crosshair'
          } shadow-md`}
        />
      )}

      {/* Node Header */}
      <div
        className={`px-3 py-2 rounded-t-xl border-b flex items-center justify-between gap-2 ${
          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`p-1.5 rounded-lg border flex-shrink-0 ${
              isCore
                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-400'
                : isTrigger
                ? 'bg-purple-950/40 border-purple-500/30 text-purple-400'
                : isGateway
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
                : 'bg-blue-950/40 border-blue-500/30 text-blue-400'
            }`}
          >
            <IconComponent className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs truncate">
            {data?.label || data?.name}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Validation Warning / Error Icon */}
          {hasErrors && (
            <span title={`${nodeIssues.length} validation issue(s)`}>
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            </span>
          )}

          {/* Delete Action Button (Hidden in Preview Mode) */}
          {!isPreviewMode && (
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
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          isConnectable={!isPreviewMode}
          title={
            isPreviewMode
              ? 'Output port (read-only in preview)'
              : 'Output connection port (Drag from here to connect next step)'
          }
          className={`!w-3.5 !h-3.5 !bg-purple-600 !border-2 ${
            isDark ? '!border-slate-900' : '!border-white'
          } ${
            isPreviewMode
              ? '!cursor-default opacity-75'
              : 'hover:!scale-150 !transition-transform !cursor-crosshair'
          } shadow-md`}
        />
      )}

      {(data?.outputs ?? 1) === 2 && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="out-true"
            isConnectable={!isPreviewMode}
            style={{ top: '35%' }}
            title={
              isPreviewMode
                ? 'Success branch (read-only in preview)'
                : 'Success / True execution branch'
            }
            className={`!w-3.5 !h-3.5 !bg-emerald-500 !border-2 ${
              isDark ? '!border-slate-900' : '!border-white'
            } ${
              isPreviewMode
                ? '!cursor-default opacity-75'
                : 'hover:!scale-150 !transition-transform !cursor-crosshair'
            } shadow-md`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="out-false"
            isConnectable={!isPreviewMode}
            style={{ top: '65%' }}
            title={
              isPreviewMode
                ? 'Alternative branch (read-only in preview)'
                : 'Alternative / False execution branch'
            }
            className={`!w-3.5 !h-3.5 !bg-rose-500 !border-2 ${
              isDark ? '!border-slate-900' : '!border-white'
            } ${
              isPreviewMode
                ? '!cursor-default opacity-75'
                : 'hover:!scale-150 !transition-transform !cursor-crosshair'
            } shadow-md`}
          />
        </>
      )}
    </div>
  )
}

export const WorkflowNode = memo(WorkflowNodeComponent)
