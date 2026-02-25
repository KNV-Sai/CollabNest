import clsx from 'clsx'

export const TextInput = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-200">
      <span>{label}</span>
      <input
        className={clsx(
          'rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  )
}

export const SelectInput = ({
  label,
  error,
  className,
  children,
  ...props
}) => {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-200">
      <span>{label}</span>
      <select
        className={clsx(
          'rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  )
}

export const TextAreaInput = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-200">
      <span>{label}</span>
      <textarea
        className={clsx(
          'min-h-[80px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  )
}
