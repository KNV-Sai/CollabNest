import { Card } from '../../components/Card'
import { ProgressBar } from '../../components/ProgressBar'
import { useData } from '../../context/DataContext'
import { mockUsers } from '../../data/mockData'

export const AdminDashboardPage = () => {
  const { projects } = useData()
  const project = projects[0]
  const students = mockUsers.filter((u) => project.studentIds.includes(u.id))

  const totalTasks = project.tasks.length
  const completedTasks = project.tasks.filter((t) => t.status === 'completed').length
  const inProgressTasks = project.tasks.filter(
    (t) => t.status === 'in_progress',
  ).length
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Teacher Dashboard</h1>
        <p className="text-base text-slate-300">Assign group projects, monitor task progress, and review student submissions.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card title="Overall Progress" subtitle={`${completedTasks}/${totalTasks} completed`}>
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-primary-300">{progress}%</div>
                <div className="text-xs text-slate-400">project complete</div>
              </div>
              <div className="text-right text-xs text-slate-400">{completedTasks} of {totalTasks}</div>
            </div>
            <ProgressBar value={progress} />
          </div>
        </Card>

        <Card title="Tasks by Status">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-800/40 p-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-400"></div>
                <span className="text-sm text-slate-300">To Do</span>
              </div>
              <span className="font-bold text-slate-100">{project.tasks.filter((t) => t.status === 'todo').length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-amber-500/20 p-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <span className="text-sm text-slate-300">In Progress</span>
              </div>
              <span className="font-bold text-amber-300">{inProgressTasks}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-emerald-500/20 p-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                <span className="text-sm text-slate-300">Completed</span>
              </div>
              <span className="font-bold text-emerald-300">{completedTasks}</span>
            </div>
          </div>
        </Card>

        <Card title="Group Members">
          <div className="space-y-2">
            {students.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-3 rounded-lg bg-slate-800/30 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-100">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.email}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
