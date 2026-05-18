'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { showToast } from '@/components/Toast'
import { CldUploadWidget } from 'next-cloudinary'
import { Upload } from 'lucide-react'

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}



export default function EditBlogPostPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [form, setForm] = useState({
    title: '', slug: '', cover_image: '', content: '',
    author: '', published: false,
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then((posts: { id: string; title: string; slug: string; cover_image: string; content: string; author: string; published: boolean }[]) => {
        const post = posts.find(p => p.id === id)
        if (post) setForm({
          title: post.title,
          slug: post.slug,
          cover_image: post.cover_image || '',
          content: post.content || '',
          author: post.author,
          published: post.published,
        })
      })
      .finally(() => setFetching(false))
  }, [id])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value
    setForm(f => ({
      ...f,
      [k]: val,
      ...(k === 'title' ? { slug: slugify(val) } : {})
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.slug) { showToast('Title is required.', 'error'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        showToast('✓ Post updated.')
        router.push('/admin/blog')
      } else {
        const d = await res.json()
        showToast(d.error || 'Failed to update.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="admin-loading">Loading post…</div>

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Edit Post</h1>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-row">
          <div className="admin-form-group" style={{ flex: 2 }}>
            <label className="admin-label" htmlFor="be-title">Title *</label>
            <input id="be-title" className="admin-input" value={form.title} onChange={set('title')} />
          </div>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label className="admin-label" htmlFor="be-slug">Slug *</label>
            <input id="be-slug" className="admin-input" value={form.slug} onChange={set('slug')} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label className="admin-label" htmlFor="be-author">Author</label>
            <input id="be-author" className="admin-input" value={form.author} onChange={set('author')} />
          </div>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label className="admin-label" htmlFor="be-cover">Cover Image</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input id="be-cover" className="admin-input" value={form.cover_image} onChange={set('cover_image')} placeholder="https://…" style={{ flex: 1 }} />
              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary-params"
                onSuccess={(result) => {
                  const info = result.info as any
                  if (info && info.secure_url) {
                    setForm(f => ({ ...f, cover_image: info.secure_url }))
                    showToast('✓ Image uploaded to Cloudinary.')
                  }
                }}
              >
                {({ open }) => (
                  <button type="button" className="action-btn action-btn--edit" onClick={() => open()} style={{ whiteSpace: 'nowrap', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Upload size={14} /> Upload
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-label" htmlFor="be-content">Content (HTML)</label>
          <textarea
            id="be-content"
            className="admin-textarea"
            value={form.content}
            onChange={set('content')}
            rows={15}
            style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
          />
        </div>
        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={form.published}
              onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
              style={{ accentColor: 'var(--color-accent)', width: '16px', height: '16px' }}
            />
            <span>Published</span>
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className="action-btn" onClick={() => router.back()}>Cancel</button>
            <button type="submit" className="action-btn action-btn--edit" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
