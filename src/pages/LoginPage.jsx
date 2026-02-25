import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { SelectInput, TextInput } from '../components/FormControls'
import bgImg from '../assets/bgdfordashboard.jpeg'
import logo from '../assets/react.svg'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, role)
    navigate(role === 'admin' ? '/admin' : '/student', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 -z-10">
        <img src={bgImg} alt="dashboard background" className="w-full h-full object-cover blur-md opacity-70" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/60 backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-3">
          <img src={logo} alt="CollabNest logo" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-base font-semibold text-slate-50">CollabNest</h1>
            <p className="text-xs text-slate-400">Role-based student project collaboration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <TextInput
            label="Institution Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.edu"
            autoComplete="off"
          />

          <TextInput
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="off"
          />

          <SelectInput
            label="Login as"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="admin">Admin / Teacher</option>
          </SelectInput>

          <Button
            type="submit"
            fullWidth
            variant="primary"
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}
