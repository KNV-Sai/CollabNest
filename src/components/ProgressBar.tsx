import clsx from 'clsx'

interface ProgressBarProps {
  value: number
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
  const safe = Math.min(100, Math.max(0, value))

  return (
    <div className="w-full rounded-full bg-slate-800/80 p-1">
      <div
        className={clsx(
          'h-2 rounded-full bg-accent-500 transition-all',
          safe === 100 && 'bg-emerald-500',
        )}
        style={{ width: `${safe}%` }}
      />
    </div>
  )
}

