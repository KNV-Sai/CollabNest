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
        <p className="text-base text-slate-300">Track your tasks, milestones, and submissions for {project.name}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card title="Current Project">
          <div className="space-y-3">
            <div className="rounded-lg bg-primary-600/20 p-4">
              <div className="text-2xl font-bold text-primary-300">{project.name}</div>
              <div className="mt-2 text-sm text-slate-400">{project.course}</div>
            </div>
          </div>
        </Card>
        <Card title="My Task Progress">
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-accent-300">{progress}%</div>
                <div className="text-xs text-slate-400">completed</div>
              </div>
              <div className="text-right text-xs text-slate-400">{completed} of {myTasks.length || 0}</div>
            </div>
            <ProgressBar value={progress} />
          </div>
        </Card>
        <Card title="Upcoming Milestone">
          <div className="rounded-lg bg-amber-500/20 p-4">
            <div className="text-lg font-bold text-amber-300">{project.milestones[0]?.title}</div>
            <div className="mt-2 text-sm text-slate-400">Due: {project.milestones[0]?.dueDate}</div>
            <div className="mt-3 text-xs text-slate-500">{project.milestones[0]?.description}</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
