import React, { useState } from 'react';
import { X, CheckCircle2, History } from 'lucide-react';
import { Button } from '../../components/Button.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { WORKFLOW_STAGES, TECHNICIANS, WORK_BAYS } from './mockData.js';

function WorkflowForm({ ticket, onClose, onSave }) {
  const [selectedStatus, setSelectedStatus] = useState(ticket.status || 'Pending');
  const [selectedTech, setSelectedTech] = useState(ticket.technician || 'Unassigned');
  const [selectedBay, setSelectedBay] = useState(ticket.bay || 'Bay 1 (Mechanical)');
  const [transitionNote, setTransitionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStageIndex = (status) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'On Hold':
        return 1;
      case 'In Repair':
        return 2;
      case 'QA Testing':
        return 3;
      case 'Approved':
      case 'Completed':
        return 4;
      case 'Rejected':
      case 'SLA Breach':
        return 2;
      default:
        return 0;
    }
  };

  const activeStageIndex = getStageIndex(selectedStatus);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const updatedTicket = {
        ...ticket,
        status: selectedStatus,
        technician: selectedTech,
        bay: selectedBay,
        history: [
          {
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: selectedStatus,
            note: transitionNote || `Status updated to ${selectedStatus} at ${selectedBay}.`,
            author: 'Operations Lead (Shravani P.)',
          },
          ...(ticket.history || []),
        ],
      };

      setIsSubmitting(false);
      onSave(updatedTicket);
      onClose();
    }, 400);
  };

  return (
    <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col font-sans">
      {/* Modal Header */}
      <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Service Centre Workflow
            </span>
            <StatusBadge status={ticket.status} size="sm" />
            {ticket.priority === 'Critical' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                Critical SLA
              </span>
            )}
          </div>
          <h2 id="workflow-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
            {ticket.id} — {ticket.device}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Serial No: <span className="font-mono text-slate-700 dark:text-slate-300">{ticket.serialNumber}</span> • SLA Window: {ticket.slaRemaining}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Lifecycle Stepper */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Return-to-Service Lifecycle Pipeline
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {WORKFLOW_STAGES.map((stage, idx) => {
              const isPassed = idx < activeStageIndex;
              const isCurrent = idx === activeStageIndex;

              return (
                <div key={stage.id} className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-150 mb-1.5 ${
                      isCurrent
                        ? 'bg-teal-600 text-white ring-4 ring-teal-500/20 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-medium leading-tight line-clamp-1 ${
                      isCurrent
                        ? 'text-teal-600 dark:text-teal-400 font-semibold'
                        : isPassed
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {stage.label.replace(/^\d+\.\s*/, '')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Status Transition Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Target Operational Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
            >
              <option value="Pending">Pending (Intake / Triage Queue)</option>
              <option value="In Repair">In Repair (Diagnostics & Active Work)</option>
              <option value="QA Testing">QA Testing (Inspection & Calibration)</option>
              <option value="On Hold">On Hold (Awaiting Central Stores Parts)</option>
              <option value="Completed">Completed (Return-to-Service Ready)</option>
              <option value="Approved">Approved (Validated Return)</option>
              <option value="Rejected">Rejected (BER / Scrapped)</option>
              <option value="SLA Breach">SLA Breach (Escalated)</option>
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Changing status triggers automated audit log timestamps.
            </p>
          </div>

          {/* Work Bay Assignment */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Work Bay Allocation
            </label>
            <select
              value={selectedBay}
              onChange={(e) => setSelectedBay(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
            >
              {WORK_BAYS.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} (Occupancy: {b.occupied}/{b.capacity})
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Technician */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Assigned Specialist
            </label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
            >
              <option value="Unassigned">Unassigned (Triage Pool)</option>
              {TECHNICIANS.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} — {t.bay} ({t.activeTickets} active)
                </option>
              ))}
            </select>
          </div>

          {/* Central Stores Parts Summary */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Parts Requisition (Central Stores)
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white block">
                {ticket.partsRequired || 'No parts currently required'}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Supply Line: <span className="text-slate-700 dark:text-slate-300 font-medium">{ticket.partsSource || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Workflow Notes / Triage Remarks */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Triage Remarks & Diagnostic Notes
          </label>
          <textarea
            rows={2}
            value={transitionNote}
            onChange={(e) => setTransitionNote(e.target.value)}
            placeholder="e.g., Completed optical bench alignment; sensor tolerance is within 0.02% of standard spec..."
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
          />
        </div>

        {/* Audit History Timeline */}
        {ticket.history && ticket.history.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Audit Trail Timeline
            </h4>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {ticket.history.map((h, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 text-xs border border-slate-200/60 dark:border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">
                      [{h.status}]
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">{h.note}</span>
                  </div>
                  <span className="text-slate-400 whitespace-nowrap text-[11px] shrink-0">
                    {h.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white focus-visible:ring-teal-500"
          >
            Commit Status Workflow
          </Button>
        </div>
      </form>
    </div>
  );
}

export function StatusWorkflowModal({ ticket, isOpen, onClose, onSave }) {
  if (!isOpen || !ticket) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="workflow-modal-title"
    >
      <WorkflowForm
        key={ticket.id}
        ticket={ticket}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
}

export default StatusWorkflowModal;
