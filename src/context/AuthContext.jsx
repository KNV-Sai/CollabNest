import { createContext, useContext, useMemo, useState } from 'react'
import { mockUsers } from '../data/mockData'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (email, role) => {
    // In a real app, this would be a backend call.
    // Here we look up a mock user and enforce the selected role.
    const existingUser =
      mockUsers.find((u) => u.email === email && u.role === role) ?? null

    const resolvedUser =
      existingUser ??
      {
        id: 'temp-' + role,
        name: role === 'admin' ? 'Admin User' : 'Student User',
        email,
        role,
      }

    setUser(resolvedUser)
  }

  const logout = () => {
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
