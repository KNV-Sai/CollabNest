import { Button } from './Button'

const statusLabel = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
}

const statusIcon = {
  todo: '○',
  in_progress: '◐',
  completed: '✓',
}

const badgeColor = {
  todo: 'bg-slate-800/60 text-slate-200 border border-slate-700',
  in_progress: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
  completed: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
}

export const TaskCard = ({ task, assignee, onStatusChange }) => {
  return (
    <div className="group rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary-500/50 hover:-translate-y-1">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg text-slate-400">{statusIcon[task.status]}</span>
            <h4 className="font-bold text-slate-100">{task.title}</h4>
          </div>
          {task.description && (
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">{task.description}</p>
          )}
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badgeColor[task.status]}`}
        >
          {statusLabel[task.status]}
        </span>
        {assignee && (
          <span className="text-xs text-slate-400">
            by <span className="font-semibold text-slate-300">{assignee.name}</span>
          </span>
        )}
      </div>

      {onStatusChange && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase">Change Status</div>
          <div className="flex flex-wrap gap-1">
            {(['todo', 'in_progress', 'completed']).map(
              (status) => (
                <Button
                  key={status}
                  variant={status === task.status ? 'secondary' : 'ghost'}
                  className="px-2 py-1 text-xs whitespace-nowrap"
                  onClick={() => onStatusChange(status)}
                >
                  {statusLabel[status]}
                </Button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
