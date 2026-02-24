import type { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
  footer?: ReactNode
}

export const Card = ({ title, children, className, footer }: CardProps) => {
  return (
    <div
      className={clsx(
        'rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40',
        className,
      )}
    >
      {title && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        </div>
      )}
      <div className="text-sm text-slate-300">{children}</div>
      {footer && <div className="mt-4 border-t border-slate-800 pt-3">{footer}</div>}
    </div>
  )
}

