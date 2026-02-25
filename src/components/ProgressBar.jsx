import clsx from 'clsx'

export const ProgressBar = ({ value = 0 }) => {
  const percentage = Math.min(Math.max(value, 0), 100)

  return (
    <div className="w-full">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/50">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            'bg-gradient-to-r from-primary-400 to-accent-400 shadow-md'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-slate-400">{percentage}% complete</div>
    </div>
  )
}
