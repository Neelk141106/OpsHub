import React, { useState } from 'react';
import {
  X,
  History,
  RotateCcw,
  CheckCircle2,
  Calendar,
  User,
  AlertTriangle,
  GitCommit,
  ArrowRight
} from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { SITES } from '../registry/siteModules';
import { Permissions } from '../services/authService';

export const VersionHistoryModal = () => {
  const isOpen = useWorkflowStore((s) => s.versionHistoryModalOpen);
  const onClose = () => useWorkflowStore.getState().setVersionHistoryModalOpen(false);

  const activeSite = useWorkflowStore((s) => s.activeSite);
  const versionHistory = useWorkflowStore((s) => s.versionHistory);
  const publishedWorkflows = useWorkflowStore((s) => s.publishedWorkflows);
  const rollbackWorkflow = useWorkflowStore((s) => s.rollbackWorkflow);
  const isRollingBack = useWorkflowStore((s) => s.isRollingBack);
  const currentUser = useWorkflowStore((s) => s.currentUser);

  const [selectedVersion, setSelectedVersion] = useState(null);
  const [rollbackReason, setRollbackReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const siteInfo = SITES.find((s) => s.id === activeSite) || { name: activeSite };
  const history = versionHistory[activeSite] || [];
  const currentPublished = publishedWorkflows[activeSite];
  const canRollback = Permissions.canRollbackWorkflow(currentUser);

  const handleRollback = async () => {
    if (!selectedVersion) return;
    if (!canRollback) {
      setErrorMsg('You do not have permission to rollback workflows. Admin role required.');
      return;
    }
    if (!rollbackReason.trim()) {
      setErrorMsg('Please state a reason for rolling back for audit logging.');
      return;
    }

    setErrorMsg('');
    try {
      await rollbackWorkflow(selectedVersion.versionId);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to rollback version');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[85vh]"
        role="dialog"
        aria-labelledby="version-history-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 id="version-history-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Version History & SOP Audit Trail
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Site: <span className="font-medium text-slate-700 dark:text-slate-300">{siteInfo.name}</span> · {history.length} recorded versions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* RBAC check warning if not admin */}
          {!canRollback && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start space-x-2.5 text-amber-800 dark:text-amber-200 text-xs">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold">Rollback Restricted</p>
                <p className="mt-0.5">
                  Your current role ({currentUser.role}) does not have permission to rollback operational versions. Only authorized Admins can trigger rollbacks.
                </p>
              </div>
            </div>
          )}

          {/* Timeline of versions */}
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No historical versions found for this facility.
              </div>
            ) : (
              history.map((item, idx) => {
                const isCurrent = currentPublished && (currentPublished.versionId === item.versionId || currentPublished.versionTag === item.versionTag);
                const isSelected = selectedVersion && selectedVersion.versionId === item.versionId;

                return (
                  <div
                    key={item.versionId || idx}
                    onClick={() => setSelectedVersion(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                        : isCurrent
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <GitCommit className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                              {item.versionTag || `v${item.version || '1.0.0'}`}
                            </span>
                            {isCurrent && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Active Live SOP
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                            {item.workflowName || `${siteInfo.name} Workflow`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400 dark:text-slate-500 space-y-0.5">
                        <div className="flex items-center space-x-1 justify-end">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Baseline'} {item.publishedAt ? new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 justify-end">
                          <User className="w-3 h-3" />
                          <span>{item.publishedBy || 'System Baseline'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Changelog */}
                    <div className="mt-3 text-xs bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Release Notes: </span>
                      {item.changelog || 'Routine workflow release.'}
                    </div>

                    {/* Node & edge count */}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>
                        {item.nodes?.length || 0} nodes · {item.edges?.length || 0} connections
                      </span>
                      {!isCurrent && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                          Select for rollback
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Rollback action panel if non-current version selected */}
          {selectedVersion && selectedVersion.versionTag !== currentPublished?.versionTag && (
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                  <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Rollback to {selectedVersion.versionTag}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Current: {currentPublished?.versionTag} <ArrowRight className="inline w-3 h-3 mx-1" /> Target: {selectedVersion.versionTag}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Reason for Rollback <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={rollbackReason}
                  onChange={(e) => setRollbackReason(e.target.value)}
                  placeholder="e.g., Reverting unapproved routing change in diagnostic triage"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleRollback}
                  disabled={!canRollback || isRollingBack || !rollbackReason.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  {isRollingBack ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Rolling back...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Confirm Safe Rollback</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Rollback automatically records a new audit event and updates active SOP for all operators.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
