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
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">My Tasks</h1>
        <p className="text-sm text-slate-400">
          Update your task status as you make progress.
        </p>
      </div>

      <Card title="Task Board">
        {myTasks.length === 0 ? (
          <p className="text-sm text-slate-400">
            You don&apos;t have any tasks assigned yet.
          </p>
        ) : (
          <div className="space-y-3">
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
        )}
      </Card>
    </div>
  )
}

