import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/Card'
import { ProgressBar } from '../../components/ProgressBar'

export const StudentDashboardPage = () => {
  const { user } = useAuth()
  const { projects } = useData()

  const project =
    projects.find((p) => (user ? p.studentIds.includes(user.id) : false)) ??
    projects[0]

  const myTasks = project.tasks.filter((t) => t.assigneeId === user?.id)
  const completed = myTasks.filter((t) => t.status === 'completed').length
  const progress =
    myTasks.length === 0 ? 0 : Math.round((completed / myTasks.length) * 100)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">My Workspace</h1>
        <p className="text-base text-slate-300">
          Track your tasks, milestones, and final submission for this project.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card title="Project">
          <div className="space-y-1 text-xs">
            <div className="font-semibold text-slate-100">{project.name}</div>
            <div className="text-slate-400">{project.course}</div>
          </div>
        </Card>
        <Card title="My Task Progress">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>
                {completed}/{myTasks.length || 0} completed
              </span>
              <span>{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        </Card>
        <Card title="Upcoming Milestone">
          <div className="space-y-1 text-xs">
            <div className="font-semibold text-slate-100">
              {project.milestones[0]?.title}
            </div>
            <div className="text-slate-400">
              Due {project.milestones[0]?.dueDate}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

