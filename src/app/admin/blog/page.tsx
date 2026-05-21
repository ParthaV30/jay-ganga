'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Eye, EyeOff, Plus } from 'lucide-react'
import type { BlogPost } from '@/lib/supabase'
import { showToast } from '@/components/Toast'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [confirmTitle, setConfirmTitle] = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/blog')
    if (res.ok) {
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function deletePost(id: string) {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(p => p.filter(x => x.id !== id))
        showToast('✓ Post deleted.')
      } else {
        try {
          const d = await res.json()
          showToast(d.error || 'Failed to delete post.', 'error')
        } catch {
          showToast(`Server error: ${res.status}`, 'error')
        }
      }
    } catch (err: any) {
      showToast('Network error: ' + err.message, 'error')
    }
  }

  async function togglePublished(post: BlogPost) {
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published })
    })
    if (res.ok) setPosts(ps => ps.map(p => p.id === post.id ? { ...p, published: !p.published } : p))
  }

  return (
    <>
      {confirmId && (
        <ConfirmModal
          message={`Delete "${confirmTitle}"? This cannot be undone.`}
          onConfirm={() => { setConfirmId(null); deletePost(confirmId) }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blog Management</h1>
          <p className="admin-page-sub">{(posts || []).length} posts total</p>
        </div>
        <Link href="/admin/blog/new" className="btn btn-dark">
          <Plus size={15} /> New Post
        </Link>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading posts…</div>
        ) : (posts || []).length === 0 ? (
          <div className="admin-empty">
            <p>No posts yet.</p>
            <Link href="/admin/blog/new" className="btn btn-ghost">Create your first post →</Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(posts || []).map(post => (
                <tr key={post.id}>
                  <td><strong>{post.title}</strong></td>
                  <td>{post.author}</td>
                  <td>
                    <span className={`badge ${post.published ? 'badge--green' : 'badge--gray'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{post.created_at ? new Date(post.created_at).toLocaleDateString('en-IN') : 'N/A'}</td>
                  <td className="admin-table__actions">
                    <button
                      onClick={() => togglePublished(post)}
                      title={post.published ? 'Unpublish' : 'Publish'}
                      className="action-btn"
                    >
                      {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <Link href={`/admin/blog/${post.id}/edit`} className="action-btn action-btn--edit">
                      Edit
                    </Link>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => { setConfirmId(post.id); setConfirmTitle(post.title) }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
