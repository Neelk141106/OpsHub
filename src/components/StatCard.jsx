import React, { forwardRef } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * OpsHub StatCard Component
 * 
 * Reusable KPI and telemetry metric card designed for Central Stores, Service Centre,
 * Distribution, and the Workflow Builder.
 * 
 * Props:
 * @param {React.ReactNode} props.title - Metric title or descriptive label.
 * @param {React.ReactNode} [props.value] - Primary numeric or text value to display.
 * @param {React.ReactNode} [props.metric] - Alias for value.
 * @param {React.ElementType|React.ReactNode} [props.icon] - Icon component or element (rendered with purple branding accent).
 * @param {Object|string|number|React.ReactNode} [props.trend] - Trend object ({ direction, value, label, sentiment }) or summary string.
 * @param {React.ReactNode} [props.subtext] - Supporting context or explanatory text.
 * @param {React.ReactNode} [props.helperText] - Alias for subtext.
 * @param {boolean} [props.loading=false] - Optional loading skeleton state.
 * @param {string} [props.className=''] - Additional CSS classes for outer container.
 * @param {string} [props.iconClassName=''] - Additional CSS classes for icon wrapper.
 * @param {Function} [props.onClick] - Optional click handler (enables interactive styles).
 * 
 * Design Features:
 * - Purple global branding accent on icon container.
 * - Subtle neutral card surface with rounded corners and fine borders.
 * - Full Dark Mode compatibility via Tailwind's dark: variant.
 */

const TREND_SENTIMENT_STYLES = {
  positive:
    'text-emerald-700 bg-emerald-50 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
  negative:
    'text-rose-700 bg-rose-50 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60',
  neutral:
    'text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

function normalizeTrend(trend) {
  if (!trend) return null;
  if (React.isValidElement(trend)) {
    return { isCustomElement: true, element: trend };
  }

  let value = '';
  let label = '';
  let direction = 'neutral';
  let sentiment = null;

  if (typeof trend === 'object') {
    value = trend.value ?? trend.text ?? trend.change ?? '';
    label = trend.label ?? trend.timeframe ?? trend.description ?? '';

    if (trend.direction) {
      const d = String(trend.direction).toLowerCase();
      if (d === 'up' || d === 'positive' || d === 'increase' || d === 'upward') {
        direction = 'up';
      } else if (d === 'down' || d === 'negative' || d === 'decrease' || d === 'downward') {
        direction = 'down';
      } else {
        direction = 'neutral';
      }
    } else if (typeof value === 'number') {
      if (value > 0) direction = 'up';
      else if (value < 0) direction = 'down';
      else direction = 'neutral';
    } else if (typeof value === 'string') {
      if (value.startsWith('+') || value.includes('↑')) direction = 'up';
      else if (value.startsWith('-') || value.includes('↓')) direction = 'down';
      else direction = 'neutral';
    }

    if (trend.sentiment) {
      const s = String(trend.sentiment).toLowerCase();
      if (s === 'positive' || s === 'good') sentiment = 'positive';
      else if (s === 'negative' || s === 'bad') sentiment = 'negative';
      else sentiment = 'neutral';
    } else if (typeof trend.isPositive === 'boolean') {
      sentiment = trend.isPositive ? 'positive' : 'negative';
    }
  } else if (typeof trend === 'string' || typeof trend === 'number') {
    value = String(trend);
    if (value.startsWith('+') || value.includes('↑')) direction = 'up';
    else if (value.startsWith('-') || value.includes('↓')) direction = 'down';
    else direction = 'neutral';
  }

  const resolvedSentiment =
    sentiment ??
    (direction === 'up'
      ? 'positive'
      : direction === 'down'
      ? 'negative'
      : 'neutral');

  return {
    value,
    label,
    direction,
    sentiment: resolvedSentiment,
  };
}

function renderTrendIcon(direction) {
  if (direction === 'up') {
    return <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />;
  }
  if (direction === 'down') {
    return <TrendingDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />;
  }
  return <Minus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />;
}

export const StatCard = forwardRef(function StatCard(
  {
    title,
    value,
    metric,
    icon,
    trend,
    subtext,
    helperText,
    loading = false,
    className = '',
    iconClassName = '',
    onClick,
    ...props
  },
  ref
) {
  if (loading) {
    return (
      <div
        ref={ref}
        className={`p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse ${className}`.trim()}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" />
          <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-36" />
      </div>
    );
  }

  const displayValue = value ?? metric;
  const subtextContent = subtext ?? helperText;
  const parsedTrend = normalizeTrend(trend);

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'function' || typeof icon === 'object') {
      const IconComponent = icon;
      return <IconComponent className="h-5 w-5" aria-hidden="true" />;
    }
    return null;
  };

  const iconElement = renderIcon();

  const containerClasses = [
    'relative p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-150',
    onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={containerClasses} onClick={onClick} {...props}>
      {/* Header: Title & Branded Icon */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
          {title}
        </span>
        {iconElement && (
          <div
            className={`flex items-center justify-center shrink-0 p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50 ${iconClassName}`.trim()}
            aria-hidden="true"
          >
            {iconElement}
          </div>
        )}
      </div>

      {/* Primary Value / Metric */}
      <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">
        {displayValue ?? '—'}
      </div>

      {/* Footer: Trend Indicator & Supporting Subtext */}
      {(parsedTrend || subtextContent) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {parsedTrend && (
            parsedTrend.isCustomElement ? (
              parsedTrend.element
            ) : (
              <span
                className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md border ${
                  TREND_SENTIMENT_STYLES[parsedTrend.sentiment] ||
                  TREND_SENTIMENT_STYLES.neutral
                }`}
              >
                {renderTrendIcon(parsedTrend.direction)}
                {parsedTrend.value && <span>{parsedTrend.value}</span>}
              </span>
            )
          )}
          {parsedTrend?.label && (
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {parsedTrend.label}
            </span>
          )}
          {subtextContent && (
            <span className="text-slate-500 dark:text-slate-400">
              {subtextContent}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
