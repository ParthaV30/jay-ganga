'use client'

import { useEffect, useState } from 'react'

// Global toast system via custom events
export type ToastType = 'success' | 'error'

export function showToast(message: string, type: ToastType = 'success') {
  const event = new CustomEvent('show-toast', { detail: { message, type } })
  window.dispatchEvent(event)
}

export default function Toast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail
      setToast({ message, type })
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
    window.addEventListener('show-toast', handler)
    return () => window.removeEventListener('show-toast', handler)
  }, [])

  if (!toast) return null

  return (
    <div className={`toast ${toast.type === 'error' ? 'error' : ''}`} role="alert">
      {toast.message}
    </div>
  )
}
