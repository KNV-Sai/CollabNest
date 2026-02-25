import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from '../layouts/AppLayout'
import { LoginPage } from '../pages/LoginPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage'
import { ProjectDetailsPage } from '../pages/shared/ProjectDetailsPage'
import { TasksPage } from '../pages/shared/TasksPage'
import { MilestonesPage } from '../pages/shared/MilestonesPage'
import { SubmissionPage } from '../pages/shared/SubmissionPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route
          element={
            <AppLayout>
              <AdminDashboardPage />
            </AppLayout>
          }
          path="/admin"
        />
        <Route
          element={
            <AppLayout>
              <ProjectDetailsPage scope="admin" />
            </AppLayout>
          }
          path="/admin/projects"
        />
        <Route
          element={
            <AppLayout>
              <MilestonesPage scope="admin" />
            </AppLayout>
          }
          path="/admin/milestones"
        />
        <Route
          element={
            <AppLayout>
              <SubmissionPage scope="admin" />
            </AppLayout>
          }
          path="/admin/submissions"
        />
      </Route>

      <Route element={<ProtectedRoute requiredRole="student" />}>
        <Route
          element={
            <AppLayout>
              <StudentDashboardPage />
            </AppLayout>
          }
          path="/student"
        />
        <Route
          element={
            <AppLayout>
              <ProjectDetailsPage scope="student" />
            </AppLayout>
          }
          path="/student/project"
        />
        <Route
          element={
            <AppLayout>
              <TasksPage />
            </AppLayout>
          }
          path="/student/tasks"
        />
        <Route
          element={
            <AppLayout>
              <MilestonesPage scope="student" />
            </AppLayout>
          }
          path="/student/milestones"
        />
        <Route
          element={
            <AppLayout>
              <SubmissionPage scope="student" />
            </AppLayout>
          }
          path="/student/submission"
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
