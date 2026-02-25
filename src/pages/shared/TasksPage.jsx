import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/Card'
import { TaskCard } from '../../components/TaskCard'
import { mockUsers } from '../../data/mockData'

export const TasksPage = () => {
  const { user } = useAuth()
  const { projects, updateTaskStatus } = useData()

  const project =
    projects.find((p) => (user ? p.studentIds.includes(user.id) : false)) ??
    projects[0]

  const myTasks = project.tasks.filter((t) => t.assigneeId === user?.id)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">My Tasks</h1>
        <p className="text-base text-slate-300">Update your task status as you make progress on your assignments.</p>
      </div>

      {myTasks.length === 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-12 text-center">
          <div className="text-5xl mb-3">✓</div>
          <p className="text-lg text-slate-400">You don't have any tasks assigned yet.</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-300">
              <span className="inline-block rounded-full bg-primary-600/20 px-3 py-1 text-primary-300">{myTasks.length} Tasks</span>
            </div>
            <div className="flex gap-2">
              {[{ label: 'To Do', count: myTasks.filter(t => t.status === 'todo').length, color: 'text-slate-400' },
                { label: 'In Progress', count: myTasks.filter(t => t.status === 'in_progress').length, color: 'text-amber-300' },
                { label: 'Completed', count: myTasks.filter(t => t.status === 'completed').length, color: 'text-emerald-300' }].map(stat => (
                <div key={stat.label} className="text-xs font-semibold">
                  <span className={stat.color}>{stat.count}</span> <span className="text-slate-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assignee={mockUsers.find((u) => u.id === task.assigneeId)}
                onStatusChange={(status) =>
                  updateTaskStatus(project.id, task.id, status)
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
