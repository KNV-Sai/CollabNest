import type { Project, TaskStatus, User } from '../types/domain'

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Prof. Rajesh Kumar',
    email: 'professor1@example.edu',
    role: 'admin',
  },
  {
    id: 'u2',
    name: 'Arjun Singh',
    email: 'student1@example.edu',
    role: 'student',
  },
  {
    id: 'u3',
    name: 'Priya Sharma',
    email: 'student2@example.edu',
    role: 'student',
  },
  {
    id: 'u4',
    name: 'Rahul Patel',
    email: 'student3@example.edu',
    role: 'student',
  },
  {
    id: 'u5',
    name: 'Prof. Aisha Mohammed',
    email: 'professor2@example.edu',
    role: 'admin',
  },
  {
    id: 'u6',
    name: 'Zara Khan',
    email: 'student4@example.edu',
    role: 'student',
  },
  {
    id: 'u7',
    name: 'Vikram Desai',
    email: 'student5@example.edu',
    role: 'student',
  },
  {
    id: 'u8',
    name: 'Neha Gupta',
    email: 'student6@example.edu',
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
  {
    id: 't4',
    title: 'Setup database schema',
    description: 'Design and create PostgreSQL schemas.',
    assigneeId: 'u2',
    status: 'in_progress',
  },
  {
    id: 't5',
    title: 'Implement authentication',
    description: 'Add JWT-based login functionality.',
    assigneeId: 'u3',
    status: 'todo',
  },
  {
    id: 't6',
    title: 'Create QR code generator',
    description: 'Integrate QR library and generate attendance codes.',
    assigneeId: 'u4',
    status: 'completed',
  },
]

const iotTasks: {
  id: string
  title: string
  description: string
  assigneeId: string
  status: TaskStatus
}[] = [
  {
    id: 't7',
    title: 'Gather sensor requirements',
    description: 'List all IoT sensors needed for smart home.',
    assigneeId: 'u6',
    status: 'completed',
  },
  {
    id: 't8',
    title: 'Configure MQTT broker',
    description: 'Setup Eclipse Mosquitto for device communication.',
    assigneeId: 'u7',
    status: 'in_progress',
  },
  {
    id: 't9',
    title: 'Write sensor integration code',
    description: 'Code to read temperature, humidity, and motion sensors.',
    assigneeId: 'u8',
    status: 'in_progress',
  },
  {
    id: 't10',
    title: 'Build mobile app dashboard',
    description: 'Create React Native UI for monitoring.',
    assigneeId: 'u6',
    status: 'todo',
  },
  {
    id: 't11',
    title: 'Implement automation rules',
    description: 'Add if-then rules for device automation.',
    assigneeId: 'u7',
    status: 'todo',
  },
]

const aiTasks: {
  id: string
  title: string
  description: string
  assigneeId: string
  status: TaskStatus
}[] = [
  {
    id: 't12',
    title: 'Collect training dataset',
    description: 'Gather 5000+ images for model training.',
    assigneeId: 'u2',
    status: 'in_progress',
  },
  {
    id: 't13',
    title: 'Implement CNN architecture',
    description: 'Build and train convolutional neural network.',
    assigneeId: 'u3',
    status: 'in_progress',
  },
  {
    id: 't14',
    title: 'Model optimization',
    description: 'Reduce model size for faster inference.',
    assigneeId: 'u4',
    status: 'todo',
  },
  {
    id: 't15',
    title: 'API integration with Flask',
    description: 'Create REST API endpoints for predictions.',
    assigneeId: 'u2',
    status: 'completed',
  },
]

const webTasks: {
  id: string
  title: string
  description: string
  assigneeId: string
  status: TaskStatus
}[] = [
  {
    id: 't16',
    title: 'Design UI mockups',
    description: 'Create Figma designs for all pages.',
    assigneeId: 'u7',
    status: 'completed',
  },
  {
    id: 't17',
    title: 'Develop header and navigation',
    description: 'Build responsive navbar with dark mode support.',
    assigneeId: 'u8',
    status: 'in_progress',
  },
  {
    id: 't18',
    title: 'Create product listing page',
    description: 'Display products with filters and sorting.',
    assigneeId: 'u6',
    status: 'in_progress',
  },
  {
    id: 't19',
    title: 'Implement shopping cart',
    description: 'Add to cart, remove, and update quantity.',
    assigneeId: 'u7',
    status: 'todo',
  },
  {
    id: 't20',
    title: 'Setup payment gateway',
    description: 'Integrate Stripe for payment processing.',
    assigneeId: 'u8',
    status: 'todo',
  },
  {
    id: 't21',
    title: 'Deploy on AWS',
    description: 'Setup EC2 and deploy website.',
    assigneeId: 'u6',
    status: 'todo',
  },
]

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Smart Attendance Tracker',
    course: 'FSAD 302',
    description:
      'Build a web-based attendance tracking system with QR-based check-in for students and real-time analytics dashboard.',
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
  {
    id: 'p2',
    name: 'IoT-Based Smart Home System',
    course: 'IoT 404',
    description:
      'Develop a home automation system using IoT sensors and Arduino microcontrollers with mobile app control.',
    mentorId: 'u5',
    studentIds: ['u6', 'u7', 'u8'],
    milestones: [
      {
        id: 'm4',
        title: 'Hardware Setup',
        description: 'Connect and configure all IoT sensors.',
        dueDate: '2026-03-20',
      },
      {
        id: 'm5',
        title: 'Software Integration',
        description: 'Integrate MQTT protocol and database.',
        dueDate: '2026-04-15',
      },
      {
        id: 'm6',
        title: 'Testing & Deployment',
        description: 'Complete testing and final deployment.',
        dueDate: '2026-05-10',
      },
    ],
    tasks: iotTasks,
    submissionUrl: '',
  },
  {
    id: 'p3',
    name: 'AI Image Classification Model',
    course: 'ML 305',
    description:
      'Create a machine learning model using CNN for plant disease detection with high accuracy.',
    mentorId: 'u1',
    studentIds: ['u2', 'u3', 'u4'],
    milestones: [
      {
        id: 'm7',
        title: 'Data Collection',
        description: 'Gather and label training dataset.',
        dueDate: '2026-03-25',
      },
      {
        id: 'm8',
        title: 'Model Training',
        description: 'Train and validate the CNN model.',
        dueDate: '2026-04-20',
      },
      {
        id: 'm9',
        title: 'Deployment',
        description: 'Deploy model as web service.',
        dueDate: '2026-05-15',
      },
    ],
    tasks: aiTasks,
    submissionUrl: '',
  },
  {
    id: 'p4',
    name: 'E-Commerce Platform',
    course: 'FSAD 302',
    description:
      'Build a full-stack e-commerce application with product catalog, shopping cart, and secure payment processing.',
    mentorId: 'u5',
    studentIds: ['u6', 'u7', 'u8'],
    milestones: [
      {
        id: 'm10',
        title: 'UI/UX Design',
        description: 'Complete design and create mockups.',
        dueDate: '2026-03-18',
      },
      {
        id: 'm11',
        title: 'Frontend Development',
        description: 'Build all frontend pages and components.',
        dueDate: '2026-04-12',
      },
      {
        id: 'm12',
        title: 'Backend & Deployment',
        description: 'Setup backend and deploy to production.',
        dueDate: '2026-05-08',
      },
    ],
    tasks: webTasks,
    submissionUrl: '',
  },
]

