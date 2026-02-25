import clsx from 'clsx'
import { Fragment } from 'react'

export const Button = ({
  children,
  variant = 'primary',
  fullWidth,
  className,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  ...props
}) => {
  const variantClasses = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
    secondary:
      'bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-500',
    ghost:
      'bg-transparent text-slate-200 border border-slate-600 hover:bg-slate-800',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  }

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed',
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>{children}</span>
        </span>
      ) : (
        <Fragment>
          {leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
        </Fragment>
      )}
    </button>
  )
}
