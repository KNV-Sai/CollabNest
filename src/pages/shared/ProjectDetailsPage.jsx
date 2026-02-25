import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/Card'
import { mockUsers } from '../../data/mockData'

export const ProjectDetailsPage = ({ scope }) => {
  const { user } = useAuth()
  const { projects } = useData()

  const project =
    scope === 'admin'
      ? projects[0]
      : projects.find((p) => (user ? p.studentIds.includes(user.id) : false)) ??
        projects[0]

  const students = mockUsers.filter((u) => project.studentIds.includes(u.id))
  const mentor = mockUsers.find((u) => u.id === project.mentorId)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Project Details</h1>
        <p className="text-base text-slate-300">Overview of the team, mentor, and project scope.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card title="Project Overview" className="md:col-span-2">
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-slate-100">{project.name}</div>
              <div className="mt-1 text-sm text-primary-300 font-semibold">{project.course}</div>
            </div>
            <div className="rounded-lg bg-slate-800/30 p-4">
              <p className="text-base text-slate-300 leading-relaxed">{project.description}</p>
            </div>
          </div>
        </Card>

        <Card title="Project Mentor">
          <div className="rounded-lg bg-primary-600/20 p-4 space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-lg font-bold text-white">M</div>
            <div className="text-lg font-bold text-slate-100">{mentor?.name}</div>
            <div className="text-sm text-slate-400">{mentor?.email}</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Group Members">
          <div className="space-y-2">
            {students.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-3 rounded-lg bg-slate-800/30 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-600 text-xs font-bold text-white">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-100">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.email}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Task Summary">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-800/30 p-3">
              <span className="text-slate-300">Total Tasks</span>
              <span className="text-2xl font-bold text-slate-100">{project.tasks.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-emerald-500/20 p-3">
              <span className="text-slate-300">Completed</span>
              <span className="text-2xl font-bold text-emerald-300">{project.tasks.filter((t) => t.status === 'completed').length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-amber-500/20 p-3">
              <span className="text-slate-300">In Progress</span>
              <span className="text-2xl font-bold text-amber-300">{project.tasks.filter((t) => t.status === 'in_progress').length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
