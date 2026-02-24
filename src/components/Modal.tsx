import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export const Modal = ({ open, title, children, onClose }: ModalProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="text-sm text-slate-200">{children}</div>
      </div>
    </div>
  )
}

