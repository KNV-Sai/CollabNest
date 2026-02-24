import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/domain'
import { Button } from '../components/Button'
import { SelectInput, TextInput } from '../components/FormControls'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('student1@example.edu')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login(email, role)
    navigate(role === 'admin' ? '/admin' : '/student', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/60">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold">
            CN
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-50">CollabNest</h1>
            <p className="text-xs text-slate-400">
              Role-based student project collaboration
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Institution Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.edu"
          />

          <TextInput
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <SelectInput
            label="Login as"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="student">Student</option>
            <option value="admin">Admin / Teacher</option>
          </SelectInput>

          <Button
            type="submit"
            fullWidth
            className="mt-2 bg-accent-500 text-slate-950 hover:bg-accent-600"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}

