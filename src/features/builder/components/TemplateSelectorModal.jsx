import { useState } from 'react'
import {
  X,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  FilePlus2,
  Shield,
  Eye,
} from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { WORKFLOW_TEMPLATES } from '../templates/workflowTemplates'
import { SITES } from '../registry/siteModules'
import { Permissions } from '../services/authService'

export function TemplateSelectorModal() {
  const isOpen = useWorkflowStore((s) => s.templateModalOpen)
  const setOpen = useWorkflowStore((s) => s.setTemplateModalOpen)
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate)
  const currentUser = useWorkflowStore((s) => s.currentUser)
  const theme = useWorkflowStore((s) => s.theme)
  const isDark = theme === 'dark'

  const [previewTemplateId, setPreviewTemplateId] = useState(null)
  const [filterSite, setFilterSite] = useState('ALL')

  if (!isOpen) return null

  const canEdit = Permissions.canEditWorkflow(currentUser)
  const siteTemplates =
    filterSite === 'ALL'
      ? WORKFLOW_TEMPLATES
      : WORKFLOW_TEMPLATES.filter((t) => t.siteId === filterSite)
  const previewedTemplate = WORKFLOW_TEMPLATES.find((t) => t.id === previewTemplateId)

  const handleApply = (templateId) => {
    loadTemplate(templateId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Operational Workflow Templates</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Predefined SOPs
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Browse and select a validated facility template or build from scratch.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                : 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Facility Filter Tabs */}
        <div
          className={`px-6 py-2.5 border-b flex items-center justify-between gap-4 flex-wrap text-xs ${
            isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-100/60 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider mr-1">
              Filter Site:
            </span>
            <button
              type="button"
              onClick={() => setFilterSite('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                filterSite === 'ALL'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              All Facilities ({WORKFLOW_TEMPLATES.length})
            </button>
            {SITES.map((site) => {
              const count = WORKFLOW_TEMPLATES.filter((t) => t.siteId === site.id).length
              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => setFilterSite(site.id)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    filterSite === site.id
                      ? `${site.badgeColor} border font-bold shadow-xs`
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {site.name} ({count})
                </button>
              )
            })}
          </div>

          {!canEdit && (
            <span className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Read-Only Preview (Admin role required to apply)</span>
            </span>
          )}
        </div>

        {/* Templates Grid & Preview */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteTemplates.map((template) => {
              const isSelected = previewTemplateId === template.id
              const siteMeta = SITES.find((s) => s.id === template.siteId)

              return (
                <div
                  key={template.id}
                  className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-purple-500 ring-2 ring-purple-500/30 bg-purple-950/20 shadow-lg'
                      : isDark
                      ? 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${siteMeta?.badgeColor}`}>
                        {siteMeta?.name || 'All Sites'} • {template.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {template.nodesCount} Steps
                      </span>
                    </div>

                    <h3 className="font-bold text-sm leading-snug">
                      {template.name}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {template.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplateId(isSelected ? null : template.id)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-500'
                          : isDark
                          ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                          : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Hide Steps' : 'Preview Steps'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApply(template.id)}
                      disabled={!canEdit}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                        canEdit
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30 hover:scale-[1.02] cursor-pointer'
                          : 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                      }`}
                      title={canEdit ? 'Load template into workflow canvas draft' : 'Admin role required'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use This Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Create From Scratch Card */}
            <div
              className={`rounded-xl border p-4.5 border-dashed flex flex-col justify-between ${
                isDark
                  ? 'bg-slate-950/20 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50/50 border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-800 text-slate-300 border-slate-700">
                    Blank Slate
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">0 Nodes</span>
                </div>
                <h3 className="font-bold text-sm">Create from Scratch</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Clears the canvas for {SITES.find((s) => s.id === filterSite)?.name} and allows constructing a completely custom workflow using palette modules.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleApply('blank')}
                  disabled={!canEdit}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    canEdit
                      ? isDark
                        ? 'border-slate-700 hover:bg-slate-800 text-slate-200 cursor-pointer'
                        : 'border-slate-300 hover:bg-slate-100 text-slate-800 cursor-pointer'
                      : 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                  }`}
                >
                  <FilePlus2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Start with Blank Canvas</span>
                </button>
              </div>
            </div>
          </div>

          {/* Template Step Inspection Drawer */}
          {previewedTemplate && (
            <div
              className={`p-4 rounded-xl border space-y-3 animate-fade-in ${
                isDark ? 'bg-slate-950/80 border-purple-500/40' : 'bg-purple-50/40 border-purple-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-xs">
                    Step Sequence Preview: {previewedTemplate.name}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pre-Validated Topology (0 Errors)</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {previewedTemplate.getGraph().nodes.map((node, index) => (
                  <div
                    key={node.id}
                    className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Step {index + 1}</span>
                        <span className="uppercase text-purple-400 font-bold">{node.data?.category}</span>
                      </div>
                      <span className="font-semibold text-xs text-slate-100 dark:text-slate-100 truncate block">
                        {node.data?.label || node.data?.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2 block truncate">
                      {node.data?.summary}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
            isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <span>
            Templates load as an independent editable draft without altering currently published production SOPs.
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`px-3 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer ${
              isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
