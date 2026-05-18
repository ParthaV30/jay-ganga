'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel])

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-modal__icon">
          <AlertTriangle size={22} />
        </div>
        <p className="confirm-modal__message">{message}</p>
        <div className="confirm-modal__actions">
          <button className="btn btn-ghost confirm-modal__cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-modal__delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
