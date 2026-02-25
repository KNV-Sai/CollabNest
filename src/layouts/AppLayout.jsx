import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'

const navItemsByRole = {
  admin: [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Projects', to: '/admin/projects' },
    { label: 'Milestones', to: '/admin/milestones' },
    { label: 'Submissions', to: '/admin/submissions' },
  ],
  student: [
    { label: 'Dashboard', to: '/student' },
    { label: 'My Project', to: '/student/project' },
    { label: 'Tasks', to: '/student/tasks' },
    { label: 'Milestones', to: '/student/milestones' },
    { label: 'Submission', to: '/student/submission' },
  ],
}

export const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const role = user?.role ?? 'student'
  const navItems = navItemsByRole[role]

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 px-4 py-5 transform transition-transform duration-200 md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Link to={role === 'admin' ? '/admin' : '/student'} className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold">
            CN
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">CollabNest</div>
            <div className="text-xs text-slate-400">Student Projects</div>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center rounded-lg px-3 py-2 text-slate-300 transition-colors',
                  isActive
                    ? 'bg-primary-600/20 text-primary-100'
                    : 'hover:bg-slate-800/60 hover:text-slate-100',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 border-t border-slate-800 pt-4 text-xs text-slate-400">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <div className="font-medium text-slate-100">{user?.name}</div>
              <div className="text-[11px] uppercase tracking-wide text-primary-300">
                {role === 'admin' ? 'Admin / Mentor' : 'Student'}
              </div>
            </div>
            <Button variant="ghost" className="px-2 py-1 text-xs" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <header className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-slate-800/60 text-slate-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="ml-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold">CN</div>
              <span className="text-sm font-semibold">CollabNest</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              {role === 'admin' ? 'Teacher Dashboard' : 'Student Workspace'}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <div className="hidden sm:flex sm:items-center sm:gap-3">
              <input
                type="search"
                placeholder="Search projects, tasks..."
                className="rounded-md bg-slate-900/60 px-3 py-1 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-200 hidden sm:block">{user?.email}</div>
              <Button variant="ghost" className="px-3 py-1 text-xs" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 px-4 py-5 md:px-6 md:py-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
