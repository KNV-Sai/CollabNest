import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { TextInput } from '../../components/FormControls'

interface SubmissionPageProps {
  scope: 'admin' | 'student'
}

export const SubmissionPage = ({ scope }: SubmissionPageProps) => {
  const { user } = useAuth()
  const { projects, updateSubmissionUrl } = useData()

  const project =
    scope === 'admin'
      ? projects[0]
      : projects.find((p) => (user ? p.studentIds.includes(user.id) : false)) ??
        projects[0]

  const [url, setUrl] = useState(project.submissionUrl ?? '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateSubmissionUrl(project.id, url)
  }

  if (scope === 'admin') {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Final Submission</h1>
          <p className="text-base text-slate-300">Review the group&apos;s final report or repository link.</p>
        </div>
        <Card title="Submitted Link">
          {project.submissionUrl ? (
            <a
              href={project.submissionUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary-300 underline"
            >
              {project.submissionUrl}
            </a>
          ) : (
            <p className="text-sm text-slate-400">
              The group has not submitted a final link yet.
            </p>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Final Submission</h1>
        <p className="text-base text-slate-300">Paste your GitHub repo, report link, or mock file URL.</p>
      </div>

      <Card title="Upload (Mock)">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Submission URL"
            placeholder="https://github.com/your-group/collabnest"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button type="submit">Save Submission</Button>
          <p className="text-xs text-slate-500">
            This is a mock upload. No real files are stored; the URL is just kept
            in local in-memory state.
          </p>
        </form>
      </Card>
    </div>
  )
}

