import React, { forwardRef } from 'react';

/**
 * Reusable Button component for OpsHub enterprise platform.
 * Supports standard enterprise variants, sizes, and states.
 * 
 * Note for Design System: Uses standard neutral enterprise Tailwind conventions.
 * Awaiting Neel's global design tokens & theme architecture in tailwind.config.js / index.css.
 */

const VARIANT_MAP = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 focus-visible:ring-slate-950 shadow-sm',
  secondary:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400',
  outline:
    'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 focus-visible:ring-slate-400 shadow-sm',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 shadow-sm',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-slate-400',
};

const SIZE_MAP = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
  small: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-3.5 py-2 text-sm rounded-md gap-2',
  medium: 'px-3.5 py-2 text-sm rounded-md gap-2',
  lg: 'px-4.5 py-2.5 text-base rounded-lg gap-2.5',
  large: 'px-4.5 py-2.5 text-base rounded-lg gap-2.5',
};

const SPINNER_SIZE_MAP = {
  sm: 'h-3.5 w-3.5',
  small: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  medium: 'h-4 w-4',
  lg: 'h-5 w-5',
  large: 'h-5 w-5',
};

const BASE_STYLES =
  'inline-flex items-center justify-center font-medium select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed';

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    isLoading = false,
    onClick,
    className = '',
    ...props
  },
  ref
) {
  const isBusy = Boolean(loading || isLoading);
  const isDisabled = Boolean(disabled || isBusy);

  const normalizedVariant = VARIANT_MAP[variant?.toLowerCase()]
    ? variant.toLowerCase()
    : 'primary';
  const variantClasses = VARIANT_MAP[normalizedVariant];

  const normalizedSize = SIZE_MAP[size?.toLowerCase()]
    ? size.toLowerCase()
    : 'md';
  const sizeClasses = SIZE_MAP[normalizedSize];
  const spinnerSizeClasses = SPINNER_SIZE_MAP[normalizedSize];

  const combinedClasses = [
    BASE_STYLES,
    variantClasses,
    sizeClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isBusy || undefined}
      aria-disabled={isDisabled || undefined}
      onClick={handleClick}
      className={combinedClasses}
      {...props}
    >
      {isBusy && (
        <svg
          className={`animate-spin ${spinnerSizeClasses} text-current shrink-0`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
