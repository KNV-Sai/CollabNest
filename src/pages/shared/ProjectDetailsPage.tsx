import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/Card'
import { mockUsers } from '../../data/mockData'

interface ProjectDetailsPageProps {
  scope: 'admin' | 'student'
}

export const ProjectDetailsPage = ({ scope }: ProjectDetailsPageProps) => {
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
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">Project Details</h1>
        <p className="text-sm text-slate-400">
          Overview of the group, mentor, and project scope.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card title="Project Overview" className="md:col-span-2">
          <h2 className="text-sm font-semibold text-slate-100">{project.name}</h2>
          <p className="mt-1 text-xs text-primary-200">{project.course}</p>
          <p className="mt-3 text-sm text-slate-300">{project.description}</p>
        </Card>

        <Card title="Mentor">
          <div className="space-y-1 text-xs">
            <div className="font-semibold text-slate-100">{mentor?.name}</div>
            <div className="text-slate-400">{mentor?.email}</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Group Members">
          <ul className="space-y-1 text-xs">
            {students.map((s) => (
              <li key={s.id} className="flex items-center justify-between">
                <span className="text-slate-100">{s.name}</span>
                <span className="text-slate-500">{s.email}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Task Summary">
          <dl className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <dt className="text-slate-300">Total tasks</dt>
              <dd className="font-semibold text-slate-100">
                {project.tasks.length}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-300">Completed</dt>
              <dd className="font-semibold text-emerald-300">
                {project.tasks.filter((t) => t.status === 'completed').length}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-300">In Progress</dt>
              <dd className="font-semibold text-amber-300">
                {project.tasks.filter((t) => t.status === 'in_progress').length}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}

