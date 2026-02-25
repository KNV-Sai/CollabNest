import { createContext, useContext, useMemo, useState } from 'react'
import { mockProjects } from '../data/mockData'

const DataContext = createContext(undefined)

export const DataProvider = ({ children }) => {
  const [projects, setProjectsState] = useState(mockProjects)

  const setProjects = (next) => {
    setProjectsState(next)
  }

  const updateTaskStatus = (projectId, taskId, status) => {
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

  const updateSubmissionUrl = (projectId, url) => {
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
