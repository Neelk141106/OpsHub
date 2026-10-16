import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Tag,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { SITES } from '../registry/siteModules';
import { validateWorkflow } from '../validation/validateWorkflow';
import { Permissions } from '../services/authService';

export const PublishWorkflowModal = () => {
  const isOpen = useWorkflowStore((s) => s.publishModalOpen);
  const onClose = () => useWorkflowStore.getState().setPublishModalOpen(false);

  const activeSite = useWorkflowStore((s) => s.activeSite);
  const siteDrafts = useWorkflowStore((s) => s.siteDrafts);
  const publishedWorkflows = useWorkflowStore((s) => s.publishedWorkflows);
  const publishWorkflow = useWorkflowStore((s) => s.publishWorkflow);
  const isPublishing = useWorkflowStore((s) => s.isPublishing);
  const currentUser = useWorkflowStore((s) => s.currentUser);

  const currentDraft = siteDrafts[activeSite] || { nodes: [], edges: [], workflowName: '' };
  const { nodes, edges } = currentDraft;

  const [bumpType, setBumpType] = useState('patch');
  const [changelog, setChangelog] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const siteInfo = SITES.find((s) => s.id === activeSite) || { name: activeSite };
  const currentPublished = publishedWorkflows[activeSite];
  const currentVersionTag = currentPublished?.versionTag || 'v1.0.0';

  // Calculate next semver
  const calculateNextVersion = (currentTag, type) => {
    const parts = (currentTag || 'v1.0.0').replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
    while (parts.length < 3) parts.push(0);
    if (type === 'major') {
      return `v${parts[0] + 1}.0.0`;
    } else if (type === 'minor') {
      return `v${parts[0]}.${parts[1] + 1}.0`;
    } else {
      return `v${parts[0]}.${parts[1]}.${parts[2] + 1}`;
    }
  };

  const nextVersionTag = calculateNextVersion(currentVersionTag, bumpType);

  // Pre-flight validation
  const validationResult = validateWorkflow(nodes, edges);
  const isValid = !validationResult.hasErrors;
  const canPublish = Permissions.canPublishWorkflow(currentUser);

  const handlePublish = async () => {
    if (!canPublish) {
      setErrorMsg('You do not have permission to publish workflows. Admin role required.');
      return;
    }
    if (!isValid) {
      setErrorMsg('Cannot publish invalid workflow. Please resolve validation errors first.');
      return;
    }
    if (!changelog.trim()) {
      setErrorMsg('Please provide a brief changelog / release summary for audit compliance.');
      return;
    }

    setErrorMsg('');
    try {
      await publishWorkflow(bumpType, changelog.trim());
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to publish workflow');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="publish-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 id="publish-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Publish Operational SOP
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Site: <span className="font-medium text-slate-700 dark:text-slate-300">{siteInfo.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* RBAC check warning if not admin */}
          {!canPublish && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start space-x-2.5 text-amber-800 dark:text-amber-200 text-xs">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold">Publishing Restricted</p>
                <p className="mt-0.5">
                  Your current role ({currentUser.role}) does not have permission to publish operational workflows. Switch to an Admin account to publish.
                </p>
              </div>
            </div>
          )}

          {/* Pre-flight Validation Box */}
          <div
            className={`p-4 rounded-xl border ${
              isValid
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                )}
                <span className={`text-sm font-semibold ${isValid ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
                  {isValid ? 'Pre-flight Validation Passed' : 'Pre-flight Validation Failed'}
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {nodes.length} Nodes · {edges.length} Connections
              </span>
            </div>

            {!isValid && (
              <div className="mt-3 text-xs text-rose-700 dark:text-rose-300 space-y-1">
                <p className="font-medium">The following blocking issues prevent publishing:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {validationResult.errors.map((err, i) => (
                    <li key={i}>{err.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {isValid && validationResult.warnings.length > 0 && (
              <div className="mt-2 text-xs text-amber-700 dark:text-amber-300 space-y-0.5">
                <p className="font-medium">Non-blocking warnings ({validationResult.warnings.length}):</p>
                <ul className="list-disc list-inside">
                  {validationResult.warnings.slice(0, 3).map((w, i) => (
                    <li key={i}>{w.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Versioning options */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Semantic Version Increment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'patch', label: 'Patch', desc: 'Minor tweaks & fixes', ver: calculateNextVersion(currentVersionTag, 'patch') },
                { type: 'minor', label: 'Minor', desc: 'New operational steps', ver: calculateNextVersion(currentVersionTag, 'minor') },
                { type: 'major', label: 'Major', desc: 'Full SOP overhaul', ver: calculateNextVersion(currentVersionTag, 'major') }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setBumpType(item.type)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    bumpType === item.type
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase">{item.label}</span>
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-100">
                    {item.ver}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Current Active SOP:</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{currentVersionTag}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">Next Published:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{nextVersionTag}</span>
            </div>
          </div>

          {/* Release Notes / Changelog */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Audit Release Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              placeholder="e.g., Updated inspection criteria and routed PCB repairs through lead technician gate."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-400"
            />
          </div>

          {/* Impact Warning */}
          <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300 text-xs">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <p>
              Publishing will update the active operational SOP for{' '}
              <strong className="font-semibold text-blue-900 dark:text-blue-200">{siteInfo.name}</strong>. Operations staff dashboards will immediately execute against version {nextVersionTag}.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Author: {currentUser.name} ({currentUser.role})</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPublishing}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={!isValid || !canPublish || isPublishing || !changelog.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              {isPublishing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Publish SOP {nextVersionTag}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
