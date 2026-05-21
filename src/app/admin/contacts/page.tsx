'use client'

import { useState, useEffect, Fragment } from 'react'
import { ChevronRight, ChevronDown, Trash2 } from 'lucide-react'
import { showToast } from '@/components/Toast'

import { ConfirmModal } from '@/components/ConfirmModal'

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/admin/contacts-list')
    if (res.ok) {
      const data = await res.json()
      setContacts(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id)

  async function deleteContact(id: string) {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setContacts(c => c.filter(x => x.id !== id))
        showToast('✓ Contact deleted.')
      } else {
        const d = await res.json().catch(() => ({}))
        showToast(d.error || 'Failed to delete contact.', 'error')
      }
    } catch (err: any) {
      showToast('Network error: ' + err.message, 'error')
    }
  }

  return (
    <>
      {confirmId && (
        <ConfirmModal
          message={`Delete this contact submission permanently?`}
          onConfirm={() => { setConfirmId(null); deleteContact(confirmId) }}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Contact Submissions</h1>
        <p className="admin-page-sub">{(contacts || []).length} submissions total</p>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading submissions…</div>
        ) : (contacts || []).length === 0 ? (
          <div className="admin-empty">No contact submissions yet.</div>
        ) : (
          <table className="admin-table admin-table--expandable">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Name</th>
                <th>Subject</th>
                <th>Snippet</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(contacts || []).map(c => {
                const isExpanded = expandedId === c.id
                const subjectMatch = c.message.match(/^\[([\s\S]*?)\]\s*([\s\S]*)/)
                const parsedSubject = subjectMatch ? subjectMatch[1] : (c.subject || 'General Enquiry')
                const cleanMessage = subjectMatch ? subjectMatch[2] : c.message

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
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong>{c.name}</strong>
                          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{c.email}</span>
                        </div>
                      </td>
                      <td>
                        <small className="badge badge--gray" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--color-text-secondary)', fontSize: '0.65rem' }}>
                           {parsedSubject}
                        </small>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: 200 }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                          {cleanMessage.slice(0, 50)}...
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <small>{c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</small>
                      </td>
                      <td className="admin-table__actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="action-btn action-btn--delete" onClick={(e) => { e.stopPropagation(); setConfirmId(c.id); }} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="admin-table__expand-row">
                        <td colSpan={6}>
                          <div className="admin-detail-card">
                            <div className="admin-detail-card__grid">
                              <div className="admin-detail-item">
                                <span className="admin-detail-label">Email</span>
                                <a href={`mailto:${c.email}`} className="admin-detail-value">{c.email}</a>
                              </div>
                              <div className="admin-detail-item">
                                <span className="admin-detail-label">Phone</span>
                                <span className="admin-detail-value">{c.phone || 'Not provided'}</span>
                              </div>
                              <div className="admin-detail-item">
                                <span className="admin-detail-label">Subject</span>
                                <span className="admin-detail-value">{parsedSubject}</span>
                              </div>
                            </div>
                            <div className="admin-detail-card__heading" style={{ marginTop: '1.5rem' }}>Full Message Body</div>
                            <div className="admin-detail-card__body">
                              {cleanMessage}
                            </div>
                            <div className="admin-detail-card__meta">
                               Received via Website Contact Form {c.created_at ? 'on ' + new Date(c.created_at).toLocaleString('en-IN') : ''}
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
