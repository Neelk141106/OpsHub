import React, { forwardRef } from 'react';

/**
 * OpsHub StatusBadge Component
 * 
 * Reusable operational status indicator designed for Central Stores, Service Centre,
 * Distribution, and Workflow Builder.
 * 
 * Props:
 * @param {string} [props.status='default'] - Status identifier (e.g. 'Pending', 'In Progress', 'Completed', 'Approved', 'Rejected', 'In Repair', 'Critical', 'SLA Breach').
 * @param {string} [props.label] - Custom text label to display. If omitted, derives label from status or children.
 * @param {React.ReactNode} [props.children] - Custom children to render instead of label.
 * @param {'sm'|'md'|'lg'|'small'|'medium'|'large'} [props.size='md'] - Visual size variant.
 * @param {boolean} [props.showDot=true] - Whether to render a colored status indicator dot.
 * @param {boolean} [props.pulse=false] - Force animated pulsing on the status dot.
 * @param {string} [props.className=''] - Additional CSS classes.
 * 
 * Note on Design System:
 * - Uses Tailwind CSS standard enterprise color tokens with dark mode support.
 * - Coordinates cleanly with Neel's upcoming theme architecture without introducing competing systems.
 */

const CANONICAL_LABELS = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
  approved: 'Approved',
  rejected: 'Rejected',
  'in-repair': 'In Repair',
  critical: 'Critical',
  'sla-breach': 'SLA Breach',
  'on-hold': 'On Hold',
  draft: 'Draft',
};

const STATUS_STYLES = {
  pending: {
    badge:
      'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  'in-progress': {
    badge:
      'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
  completed: {
    badge:
      'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  approved: {
    badge:
      'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  rejected: {
    badge:
      'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60',
    dot: 'bg-rose-500 dark:bg-rose-400',
  },
  'in-repair': {
    badge:
      'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800/60',
    dot: 'bg-sky-500 dark:bg-sky-400',
  },
  critical: {
    badge:
      'bg-red-50 text-red-700 border-red-300 font-semibold dark:bg-red-950/60 dark:text-red-400 dark:border-red-800',
    dot: 'bg-red-500 dark:bg-red-400 animate-pulse',
  },
  'sla-breach': {
    badge:
      'bg-purple-50 text-purple-700 border-purple-200/80 font-semibold dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60',
    dot: 'bg-purple-500 dark:bg-purple-400 animate-pulse',
  },
  'on-hold': {
    badge:
      'bg-amber-50/70 text-amber-800 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/40',
    dot: 'bg-amber-400 dark:bg-amber-500',
  },
  draft: {
    badge:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
    dot: 'bg-slate-400 dark:bg-slate-500',
  },
  default: {
    badge:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
    dot: 'bg-slate-400 dark:bg-slate-500',
  },
};

const SIZE_MAP = {
  sm: {
    badge: 'px-2 py-0.5 text-xs gap-1',
    dot: 'h-1.5 w-1.5',
  },
  small: {
    badge: 'px-2 py-0.5 text-xs gap-1',
    dot: 'h-1.5 w-1.5',
  },
  md: {
    badge: 'px-2.5 py-1 text-xs gap-1.5',
    dot: 'h-1.5 w-1.5',
  },
  medium: {
    badge: 'px-2.5 py-1 text-xs gap-1.5',
    dot: 'h-1.5 w-1.5',
  },
  lg: {
    badge: 'px-3 py-1.5 text-sm gap-2',
    dot: 'h-2 w-2',
  },
  large: {
    badge: 'px-3 py-1.5 text-sm gap-2',
    dot: 'h-2 w-2',
  },
};

const BASE_STYLES =
  'inline-flex items-center font-medium border rounded-full select-none whitespace-nowrap transition-colors duration-150';

function formatStatusLabel(str) {
  if (!str) return 'Unknown';
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeStatus(status) {
  if (!status || typeof status !== 'string') return 'default';
  const clean = status.trim().toLowerCase().replace(/[\s_-]+/g, '-');

  if (STATUS_STYLES[clean]) return clean;

  // Standard operational aliases
  if (clean === 'complete' || clean === 'done' || clean === 'resolved') return 'completed';
  if (clean === 'passed') return 'approved';
  if (clean === 'declined' || clean === 'failed' || clean === 'cancelled' || clean === 'canceled') return 'rejected';
  if (clean === 'repair' || clean === 'repairing' || clean === 'servicing') return 'in-repair';
  if (clean === 'urgent' || clean === 'blocker') return 'critical';
  if (clean === 'breached' || clean === 'sla' || clean === 'sla-breached') return 'sla-breach';
  if (clean === 'waiting' || clean === 'queued') return 'pending';
  if (clean === 'active' || clean === 'processing') return 'in-progress';
  if (clean === 'paused') return 'on-hold';

  return 'default';
}

export const StatusBadge = forwardRef(function StatusBadge(
  {
    status = 'default',
    label,
    children,
    size = 'md',
    showDot = true,
    pulse = false,
    className = '',
    ...props
  },
  ref
) {
  const normalizedKey = normalizeStatus(status);
  const styleConfig = STATUS_STYLES[normalizedKey] || STATUS_STYLES.default;

  const normalizedSizeKey = SIZE_MAP[size?.toLowerCase()] ? size.toLowerCase() : 'md';
  const sizeConfig = SIZE_MAP[normalizedSizeKey] || SIZE_MAP.md;

  const displayText =
    children ??
    label ??
    CANONICAL_LABELS[normalizedKey] ??
    formatStatusLabel(status);

  const combinedClasses = [
    BASE_STYLES,
    styleConfig.badge,
    sizeConfig.badge,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} className={combinedClasses} {...props}>
      {showDot && (
        <span
          aria-hidden="true"
          className={`inline-block shrink-0 rounded-full ${styleConfig.dot} ${sizeConfig.dot} ${
            pulse ? 'animate-pulse' : ''
          }`}
        />
      )}
      <span>{displayText}</span>
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;
