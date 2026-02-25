import clsx from 'clsx'

export const Card = ({ title, subtitle, children, className, footer }) => {
  return (
    <div
      className={clsx(
        'rounded-xl border border-slate-700 bg-slate-900/60 p-5 shadow-md shadow-slate-950/50 transition-all duration-200 hover:shadow-lg hover:border-slate-600 hover:bg-slate-900/80',
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-50">{title}</h3>
            </div>
          )}
          {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
        </div>
      )}
      <div className="text-sm text-slate-300">{children}</div>
      {footer && <div className="mt-4 border-t border-slate-700 pt-3">{footer}</div>}
    </div>
  )
}
