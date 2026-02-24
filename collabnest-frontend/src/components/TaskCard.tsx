import type { Task, TaskStatus, User } from '../types/domain'
import { Button } from './Button'

interface TaskCardProps {
  task: Task
  assignee?: User
  onStatusChange?: (status: TaskStatus) => void
}

const statusLabel: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
}

const badgeColor: Record<TaskStatus, string> = {
  todo: 'bg-slate-800 text-slate-200',
  in_progress: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
  completed: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
}

export const TaskCard = ({ task, assignee, onStatusChange }: TaskCardProps) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-100">
      <div className="mb-1 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">{task.title}</h4>
          {task.description && (
            <p className="mt-1 text-xs text-slate-300">{task.description}</p>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeColor[task.status]}`}
        >
          {statusLabel[task.status]}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        {assignee && (
          <span className="text-xs text-slate-400">
            Assigned to <span className="text-slate-200">{assignee.name}</span>
          </span>
        )}
        {onStatusChange && (
          <div className="flex gap-1">
            {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map(
              (status) => (
                <Button
                  key={status}
                  variant={status === task.status ? 'secondary' : 'ghost'}
                  className="px-2 py-1 text-[11px]"
                  onClick={() => onStatusChange(status)}
                >
                  {statusLabel[status]}
                </Button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}

