import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Project, TaskStatus } from '../types/domain'
import { mockProjects } from '../data/mockData'

interface DataContextValue {
  projects: Project[]
  setProjects: (projects: Project[]) => void
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void
  updateSubmissionUrl: (projectId: string, url: string) => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjectsState] = useState<Project[]>(mockProjects)

  const setProjects = (next: Project[]) => {
    setProjectsState(next)
  }

  const updateTaskStatus = (
    projectId: string,
    taskId: string,
    status: TaskStatus,
  ) => {
    setProjectsState((prev) =>
      prev.map((project) =>
        project.id !== projectId
          ? project
          : {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, status } : task,
              ),
            },
      ),
    )
  }

  const updateSubmissionUrl = (projectId: string, url: string) => {
    setProjectsState((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, submissionUrl: url } : project,
      ),
    )
  }

  const value = useMemo(
    () => ({
      projects,
      setProjects,
      updateTaskStatus,
      updateSubmissionUrl,
    }),
    [projects],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) {
    throw new Error('useData must be used within DataProvider')
  }
  return ctx
}

