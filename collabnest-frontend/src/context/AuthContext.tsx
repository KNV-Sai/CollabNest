import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, UserRole } from '../types/domain'
import { mockUsers } from '../data/mockData'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, role: UserRole) => {
    // In a real app, this would be a backend call.
    // Here we look up a mock user and enforce the selected role.
    const existingUser =
      mockUsers.find((u) => u.email === email && u.role === role) ?? null

    const resolvedUser: User =
      existingUser ??
      ({
        id: 'temp-' + role,
        name: role === 'admin' ? 'Admin User' : 'Student User',
        email,
        role,
      } as User)

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

