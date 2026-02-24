import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-center text-slate-100">
      <div className="mb-4 text-5xl font-bold text-primary-500">404</div>
      <h1 className="text-lg font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist. Use the button below
        to return to the login screen.
      </p>
      <div className="mt-4">
        <Link to="/login">
          <Button>Back to Login</Button>
        </Link>
      </div>
    </div>
  )
}

