import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/Card'

interface MilestonesPageProps {
  scope: 'admin' | 'student'
}

export const MilestonesPage = ({ scope }: MilestonesPageProps) => {
  const { user } = useAuth()
  const { projects } = useData()

  const project =
    scope === 'admin'
      ? projects[0]
      : projects.find((p) => (user ? p.studentIds.includes(user.id) : false)) ??
        projects[0]

  const totalTasks = project.tasks.length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">Milestones</h1>
        <p className="text-sm text-slate-400">
          Track proposal, mid-sem, and final submission checkpoints.
        </p>
      </div>

      <div className="space-y-3">
        {project.milestones.map((m, index) => (
          <Card
            key={m.id}
            title={`${index + 1}. ${m.title}`}
            className="border-slate-800 bg-slate-900/70"
          >
            <div className="space-y-1 text-xs text-slate-300">
              <p>{m.description}</p>
              <p className="text-slate-400">Due: {m.dueDate}</p>
              <p className="text-slate-400">
                Related tasks:{' '}
                <span className="text-slate-100">
                  {totalTasks > 0 ? Math.max(1, Math.round(totalTasks / 3)) : 0}
                </span>
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

