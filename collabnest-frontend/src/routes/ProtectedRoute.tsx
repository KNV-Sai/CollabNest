import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/domain'

interface ProtectedRouteProps {
  requiredRole?: UserRole
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect users attempting to access routes outside their role scope.
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/student'} replace />
  }

  return <Outlet />
}

