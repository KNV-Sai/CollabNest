import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/Card'

export const MilestonesPage = ({ scope }) => {
  const { user } = useAuth()
  const { projects } = useData()

  const project =
    scope === 'admin'
      ? projects[0]
      : projects.find((p) => (user ? p.studentIds.includes(user.id) : false)) ??
        projects[0]

  const totalTasks = project.tasks.length

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Milestones</h1>
        <p className="text-base text-slate-300">Track proposal, mid-semester, and final submission checkpoints.</p>
      </div>

      <div className="space-y-4">
        {project.milestones.map((m, index) => (
          <div
            key={m.id}
            className="group relative rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary-500/50"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 font-bold text-white">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-100">{m.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{m.description}</p>
                <div className="mt-3 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Due Date</span>
                    <span className="text-base font-bold text-accent-300">{m.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Related Tasks</span>
                    <span className="rounded-full bg-primary-600/20 px-3 py-1 text-sm font-semibold text-primary-200">
                      {totalTasks > 0 ? Math.max(1, Math.round(totalTasks / 3)) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
