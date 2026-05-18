'use client'

import { useState } from 'react'
import { showToast } from '@/components/Toast'

type CommentFormProps = { postId: string }

function validate(name: string, comment: string) {
  const errors: Record<string, string> = {}
  if (!name.trim()) errors.name = 'Name is required.'
  if (!comment.trim()) errors.comment = 'Comment is required.'
  else if (comment.trim().length < 10) errors.comment = 'Comment must be at least 10 characters.'
  return errors
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [name, setName]       = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(name, comment)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, name, email: 'no-email@jayganga.com', comment }),
      })
      if (res.ok) {
        setSubmitted(true)
        showToast('✓ Comment submitted and awaiting moderation.')
      } else {
        const data = await res.json()
        showToast(data.error || 'Failed to submit comment.', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="comment-success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/><polyline points="16 9 11 15 8 12"/>
        </svg>
        Your comment has been submitted and is awaiting moderation.
      </div>
    )
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit} noValidate>
      <div className="comment-form__row">
        <div className="form-group">
          <label className="form-label" htmlFor="comment-name">Full Name *</label>
          <input
            id="comment-name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="comment-body">Comment *</label>
        <textarea
          id="comment-body"
          className={`form-textarea ${errors.comment ? 'error' : ''}`}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your thoughts… (min. 10 characters)"
          rows={5}
        />
        {errors.comment && <span className="form-error">{errors.comment}</span>}
      </div>
      <button type="submit" className="btn btn-dark" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit Comment'}
      </button>
      <style jsx>{`
        .comment-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .comment-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .comment-success {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          background-color: var(--color-surface);
          border-left: 3px solid var(--color-accent);
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }
        @media (max-width: 600px) { .comment-form__row { grid-template-columns: 1fr; } }
      `}</style>
    </form>
  )
}
