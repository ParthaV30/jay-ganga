'use client'

import { useEffect, useState, Fragment } from 'react'
import { Check, Trash2, ChevronRight, ChevronDown } from 'lucide-react'
import { showToast } from '@/components/Toast'

import { ConfirmModal } from '@/components/ConfirmModal'

type Comment = {
  id: string; post_id: string; name: string; email: string;
  comment: string; approved: boolean; created_at: string;
  blog_posts?: { title: string }
}

type FilterType = 'Pending' | 'Approved' | 'All'

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('Pending')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/comments-list')
    if (res.ok) setComments(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function approve(id: string, e: React.MouseEvent) {
    e.stopPropagation() // Prevent row expansion
    const res = await fetch(`/api/admin/comments/${id}`, { method: 'PATCH' })
    if (res.ok) {
      setComments(c => c.map(x => x.id === id ? { ...x, approved: true } : x))
      showToast('✓ Comment approved.')
    } else showToast('Failed to approve.', 'error')
  }

  async function deleteComment(id: string) {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setComments(c => c.filter(x => x.id !== id))
        showToast('✓ Comment deleted.')
      } else {
        const d = await res.json().catch(() => ({}))
        showToast(d.error || 'Failed to delete comment.', 'error')
      }
    } catch (err: any) {
      showToast('Network error: ' + err.message, 'error')
    }
  }

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id)

  const displayed = filter === 'Pending'
    ? comments.filter(c => !c.approved)
    : filter === 'Approved'
      ? comments.filter(c => c.approved)
      : comments

  return (
    <>
      {confirmId && (
        <ConfirmModal
          message={`Delete this comment permanently? This cannot be undone.`}
          onConfirm={() => { setConfirmId(null); deleteComment(confirmId) }}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Comments</h1>
        <p className="admin-page-sub">
          {comments.filter(c => !c.approved).length} pending · {comments.filter(c => c.approved).length} approved
        </p>
      </div>

      <div className="filter-tabs">
        {(['Pending', 'Approved', 'All'] as FilterType[]).map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >{f}</button>
        ))}
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading comments…</div>
        ) : displayed.length === 0 ? (
          <div className="admin-empty">No {filter.toLowerCase()} comments.</div>
        ) : (
          <table className="admin-table admin-table--expandable">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Post</th>
                <th>Author</th>
                <th>Snippet</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(c => {
                const isExpanded = expandedId === c.id
                return (
                  <Fragment key={c.id}>
                    <tr 
                      className={`admin-table__row ${isExpanded ? 'active' : ''}`}
                      onClick={() => toggleExpand(c.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </td>
                      <td style={{ maxWidth: 150 }} className="text-truncate">
                        <small>{c.blog_posts?.title || '—'}</small>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong>{c.name}</strong>
                          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{c.email}</span>
                        </div>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: 200 }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                          {c.comment.slice(0, 50)}...
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <small>{new Date(c.created_at).toLocaleDateString('en-IN')}</small>
                      </td>
                      <td>
                        <span className={`badge ${c.approved ? 'badge--green' : 'badge--orange'}`}>
                          {c.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="admin-table__actions" style={{ justifyContent: 'flex-end' }}>
                        {!c.approved && (
                          <button className="action-btn" onClick={(e) => approve(c.id, e)} title="Approve" style={{ borderColor: '#27ae60', color: '#27ae60' }}>
                            <Check size={14} />
                          </button>
                        )}
                        <button className="action-btn action-btn--delete" onClick={(e) => { e.stopPropagation(); setConfirmId(c.id); }} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="admin-table__expand-row">
                        <td colSpan={7}>
                          <div className="admin-detail-card">
                            <div className="admin-detail-card__heading">Full Comment Message</div>
                            <div className="admin-detail-card__body">
                              {c.comment}
                            </div>
                            <div className="admin-detail-card__meta">
                              Sent on {new Date(c.created_at).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
