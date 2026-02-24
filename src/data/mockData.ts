import type { Project, TaskStatus, User } from '../types/domain'

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Professor 1',
    email: 'professor1@example.edu',
    role: 'admin',
  },
  {
    id: 'u2',
    name: 'Student 1',
    email: 'student1@example.edu',
    role: 'student',
  },
  {
    id: 'u3',
    name: 'Student 2',
    email: 'student2@example.edu',
    role: 'student',
  },
  {
    id: 'u4',
    name: 'Student 3',
    email: 'student3@example.edu',
    role: 'student',
  },
]

const baseTasks: {
  id: string
  title: string
  description: string
  assigneeId: string
  status: TaskStatus
}[] = [
  {
    id: 't1',
    title: 'Define problem statement',
    description: 'Agree on scope and objectives with mentor.',
    assigneeId: 'u2',
    status: 'completed',
  },
  {
    id: 't2',
    title: 'Design system architecture',
    description: 'Draw component diagram and data flow.',
    assigneeId: 'u3',
    status: 'in_progress',
  },
  {
    id: 't3',
    title: 'Implement frontend UI',
    description: 'Build core dashboard screens.',
    assigneeId: 'u4',
    status: 'todo',
  },
]

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Smart Attendance Tracker',
    course: 'FSAD 302',
    description:
      'Build a web-based attendance tracking system with QR-based check-in for students.',
    mentorId: 'u1',
    studentIds: ['u2', 'u3', 'u4'],
    milestones: [
      {
        id: 'm1',
        title: 'Proposal Submission',
        description: 'Submit project proposal and problem statement.',
        dueDate: '2026-03-15',
      },
      {
        id: 'm2',
        title: 'Mid-Sem Demo',
        description: 'Demonstrate core features to mentor.',
        dueDate: '2026-04-10',
      },
      {
        id: 'm3',
        title: 'Final Submission',
        description: 'Submit full report and code repository.',
        dueDate: '2026-05-05',
      },
    ],
    tasks: baseTasks,
    submissionUrl: '',
  },
]

