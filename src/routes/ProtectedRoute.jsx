import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ requiredRole }) => {
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
