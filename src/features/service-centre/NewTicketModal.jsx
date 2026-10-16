import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../components/Button.jsx';
import { WORK_BAYS, TECHNICIANS } from './mockData.js';

export function NewTicketModal({ isOpen, onClose, onCreate }) {
  const [device, setDevice] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState('Mechanical');
  const [bay, setBay] = useState('Bay 1 (Mechanical)');
  const [priority, setPriority] = useState('High');
  const [technician, setTechnician] = useState('Unassigned');
  const [issueDescription, setIssueDescription] = useState('');
  const [partsRequired, setPartsRequired] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!device.trim()) return;

    setIsSubmitting(true);
    const newId = `TCK-2026-${String(Math.floor(Math.random() * 900) + 100)}`;

    setTimeout(() => {
      const newTicket = {
        id: newId,
        device: device.trim(),
        serialNumber: serialNumber.trim() || `DEV-${Math.floor(Math.random() * 9000) + 1000}`,
        category,
        bay,
        priority,
        status: 'Pending',
        technician,
        technicianAvatar: technician !== 'Unassigned' ? technician.split(' ').map((n) => n[0]).join('') : '—',
        issueDescription: issueDescription.trim() || 'Intake diagnostic pending triage inspection.',
        partsRequired: partsRequired.trim() || 'Under evaluation',
        partsSource: 'Central Stores Requisition Pending',
        createdDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        slaDeadline: 'In 24h',
        slaRemaining: '24h remaining',
        slaStatus: 'within-sla',
        completionPercentage: 0,
        history: [
          {
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'Pending',
            note: 'Ticket created via manual Service Centre intake desk.',
            author: 'Intake Specialist (Shravani P.)',
          },
        ],
      };

      setIsSubmitting(false);
      onCreate(newTicket);
      onClose();
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-ticket-title"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-mono">
              Intake Desk
            </span>
            <h2 id="new-ticket-title" className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Create New Repair Ticket
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Equipment / Device Name *
              </label>
              <input
                type="text"
                required
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                placeholder="e.g. High-Speed Diverter Motor #3"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. MOT-8812-K"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Mechanical">Mechanical</option>
                <option value="Electronics">Electronics</option>
                <option value="Robotics">Robotics</option>
                <option value="Optics">Optics</option>
                <option value="Hydraulics">Hydraulics & Pneumatics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Critical">Critical (4-hour SLA Window)</option>
                <option value="High">High (24-hour SLA)</option>
                <option value="Medium">Medium (48-hour SLA)</option>
                <option value="Low">Low (Routine Backlog)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Work Bay Allocation
              </label>
              <select
                value={bay}
                onChange={(e) => setBay(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {WORK_BAYS.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Assign Specialist
              </label>
              <select
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Unassigned">Leave Unassigned in Triage Pool</option>
                {TECHNICIANS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} ({t.bay})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Issue Symptoms & Operator Report
            </label>
            <textarea
              rows={2}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Describe symptoms, error codes, abnormal acoustic sounds or optical failures..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Anticipated Parts (Central Stores Requisition)
            </label>
            <input
              type="text"
              value={partsRequired}
              onChange={(e) => setPartsRequired(e.target.value)}
              placeholder="e.g. Drive Belt Set #DB-104 (or leave blank if diagnostics needed first)"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

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
              Log Intake Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTicketModal;
