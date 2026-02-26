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
        <Card title="Overall Progress">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{completedTasks} tasks completed</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        </Card>

        <Card title="Tasks by Status">
          <dl className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <dt className="text-slate-300">To Do</dt>
              <dd className="font-semibold text-slate-100">
                {project.tasks.filter((t) => t.status === 'todo').length}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-300">In Progress</dt>
              <dd className="font-semibold text-amber-300">{inProgressTasks}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-300">Completed</dt>
              <dd className="font-semibold text-emerald-300">{completedTasks}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Group Members">
          <ul className="space-y-1 text-xs">
            {students.map((s) => (
              <li key={s.id} className="flex items-center justify-between">
                <span className="text-slate-200">{s.name}</span>
                <span className="text-slate-500">{s.email}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

