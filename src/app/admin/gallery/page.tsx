'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Trash2, Upload } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import { showToast } from '@/components/Toast'
import type { GalleryItem } from '@/lib/supabase'

import { ConfirmModal } from '@/components/ConfirmModal'

type CloudinaryResult = {
  public_id: string
  secure_url: string
  resource_type: 'image' | 'video'
  thumbnail_url?: string
}

type PendingItem = {
  cloudinary_public_id: string
  cloudinary_url: string
  thumbnail_url: string | null
  resource_type: 'image' | 'video'
}



export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [pending, setPending] = useState<PendingItem | null>(null)
  const [meta, setMeta] = useState({ title: '', category: 'Exhibition', year: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [confirmTitle, setConfirmTitle] = useState('')

  const photos = (items || []).filter(i => i.media_type === 'photo').length
  const videos = (items || []).filter(i => i.media_type === 'video').length

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/gallery')
    if (res.ok) {
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    if (!pending || !meta.title) { showToast('Title is required.', 'error'); return }
    setSaving(true)
    const payload = {
      cloudinary_url: pending.cloudinary_url,
      cloudinary_public_id: pending.cloudinary_public_id,
      thumbnail_url: pending.thumbnail_url,
      title: meta.title,
      category: meta.category,
      year: meta.year || null,
      media_type: pending.resource_type === 'video' ? 'video' : 'photo',
    }
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      showToast('✓ Item saved to gallery.')
      setPending(null)
      setMeta({ title: '', category: 'Exhibition', year: '' })
      load()
    } else {
      const d = await res.json()
      showToast(d.error || 'Failed to save item.', 'error')
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
    if (res.ok) { setItems(i => i.filter(x => x.id !== id)); showToast('✓ Item deleted.') }
    else showToast('Failed to delete.', 'error')
  }

  return (
    <>
      {confirmId && (
        <ConfirmModal
          message={`Delete "${confirmTitle}" from gallery and Cloudinary?`}
          onConfirm={() => { setConfirmId(null); handleDelete(confirmId) }}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gallery Management</h1>
        <p className="admin-page-sub">
          {photos}/30 photos · {videos}/20 videos uploaded
          {photos >= 30 && <span style={{ color: '#e74c3c' }}> ⚠ Photo limit reached</span>}
          {videos >= 20 && <span style={{ color: '#e74c3c' }}> ⚠ Video limit reached</span>}
        </p>
      </div>

      {/* Upload Widget */}
      <div className="admin-form" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 300, marginBottom: '1.25rem' }}>Upload New Media</h2>
        <div style={{ padding: '2rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'center' }}>
          {(
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
            process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY &&
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.includes('your_') &&
            !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY.includes('your_')
          ) ? (
            <CldUploadWidget
            signatureEndpoint="/api/sign-cloudinary-params"
            onSuccess={(result) => {
              const info = result.info as CloudinaryResult
              if (!info) return
              const thumb = info.resource_type === 'video'
                ? info.secure_url.replace(/\.[^.]+$/, '.jpg').replace('/upload/', '/upload/so_0/')
                : null
              setPending({
                cloudinary_public_id: info.public_id,
                cloudinary_url: info.secure_url,
                thumbnail_url: thumb,
                resource_type: info.resource_type,
              })
            }}
          >
            {({ open }) => (
              <button className="action-btn action-btn--edit" onClick={() => open()} style={{ gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
                <Upload size={16} /> Upload Photo or Video
              </button>
            )}
          </CldUploadWidget>
          ) : (
            <div className="admin-empty" style={{ width: '100%', padding: '2rem' }}>
              <p style={{ color: '#e74c3c' }}>Cloudinary Integration Missing</p>
              <small>You must configure <b>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</b> and <b>NEXT_PUBLIC_CLOUDINARY_API_KEY</b> in your Vercel Environment Variables to upload media.</small>
            </div>
          )}
        </div>

        {pending && (
          <div style={{ display: 'flex', gap: '2rem', paddingTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {pending.resource_type === 'video' ? (
                <video src={pending.cloudinary_url} style={{ maxHeight: 180, maxWidth: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ position: 'relative', width: 200, height: 140 }}>
                  <Image src={pending.cloudinary_url} alt="Preview" fill style={{ objectFit: 'cover' }} />
                </div>
              )}
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)', fontWeight: 500 }}>{pending.resource_type}</span>
            </div>
            <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="g-title">Title *</label>
                <input id="g-title" className="admin-input" value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} placeholder="Enter a title" />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="g-cat">Category</label>
                  <select id="g-cat" className="admin-select" value={meta.category} onChange={e => setMeta(m => ({ ...m, category: e.target.value }))}>
                    {['Exhibition', 'Architecture', 'Interior', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="g-year">Year</label>
                  <input id="g-year" className="admin-input" value={meta.year} onChange={e => setMeta(m => ({ ...m, year: e.target.value }))} placeholder="2024" maxLength={4} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="action-btn action-btn--edit" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save to Gallery'}
                </button>
                <button className="action-btn" onClick={() => setPending(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="gallery-admin-grid">
        {loading
          ? <p style={{ color: 'var(--color-text-secondary)' }}>Loading gallery…</p>
          : (items || []).length === 0
            ? <p style={{ color: 'var(--color-text-secondary)' }}>No items yet. Upload your first photo or video above.</p>
            : (items || []).map(item => {
              const thumb = item.media_type === 'video'
                ? (item.thumbnail_url || item.cloudinary_url.replace(/\.[^.]+$/, '.jpg').replace('/upload/', '/upload/so_0/'))
                : item.cloudinary_url
              return (
                <div key={item.id} className="gallery-admin-card">
                  <div className="gallery-admin-card__img-wrap">
                    <Image src={thumb} alt={item.title} fill sizes="200px" style={{ objectFit: 'cover' }} />
                    <span className="gallery-admin-card__type">{item.media_type}</span>
                  </div>
                  <div className="gallery-admin-card__info">
                    <p className="gallery-admin-card__title">{item.title}</p>
                    <span className="badge badge--gray">{item.category}</span>
                  </div>
                  <button className="gallery-admin-card__delete" onClick={() => { setConfirmId(item.id); setConfirmTitle(item.title) }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })
        }
      </div>

      <style jsx>{`
        .gallery-admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .gallery-admin-card {
          position: relative;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          overflow: hidden;
        }
        .gallery-admin-card__img-wrap {
          position: relative; height: 140px; overflow: hidden;
        }
        .gallery-admin-card__type {
          position: absolute; top: 0.5rem; left: 0.5rem;
          font-size: 0.65rem; text-transform: uppercase;
          letter-spacing: 0.1em; font-weight: 500;
          background: rgba(28,28,28,0.7); color: var(--color-accent);
          padding: 0.2rem 0.5rem;
        }
        .gallery-admin-card__info {
          padding: 0.75rem;
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .gallery-admin-card__title { font-size: 0.85rem; font-weight: 500; }
        .gallery-admin-card__delete {
          position: absolute; top: 0.5rem; right: 0.5rem;
          background: rgba(28,28,28,0.7); color: rgba(255,255,255,0.7);
          padding: 0.35rem; transition: color 0.2s;
        }
        .gallery-admin-card__delete:hover { color: #e74c3c; }
      `}</style>
    </>
  )
}
