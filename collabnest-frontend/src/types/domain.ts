export type UserRole = 'admin' | 'student'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  assigneeId: string
  milestoneId?: string
}

export interface Milestone {
  id: string
  title: string
  description?: string
  dueDate: string
}

export interface Project {
  id: string
  name: string
  course: string
  description: string
  mentorId: string
  studentIds: string[]
  milestones: Milestone[]
  tasks: Task[]
  submissionUrl?: string
}

