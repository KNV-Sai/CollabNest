import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: Variant
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
  secondary:
    'bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-500',
  ghost:
    'bg-transparent text-slate-200 border border-slate-600 hover:bg-slate-800',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
}

export const Button = ({
  children,
  variant = 'primary',
  fullWidth,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed',
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

