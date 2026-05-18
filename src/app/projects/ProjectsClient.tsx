'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { GalleryItem } from '@/lib/supabase'

const FILTERS = ['All', 'Exhibition', 'Architecture', 'Interior', 'Other'] as const

type Filter = typeof FILTERS[number]

function GalleryCard({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  const thumb = item.media_type === 'video'
    ? (item.thumbnail_url || item.cloudinary_url.replace(/\.[^.]+$/, '.jpg').replace('/upload/', '/upload/so_0/'))
    : item.cloudinary_url

  return (
    <button className="gallery-card" onClick={onClick} aria-label={`View ${item.title}`}>
      <div className="gallery-card__img-wrap">
        <Image src={thumb} alt={item.title} fill sizes="(max-width:768px) 100vw, 33vw" className="gallery-card__img" />
        {item.media_type === 'video' && (
          <div className="gallery-card__play-icon"><Play size={28} fill="white" color="white" /></div>
        )}
        <div className="gallery-card__overlay">
          <span className="gallery-card__cat">{item.category}</span>
          <h3 className="gallery-card__title">{item.title}</h3>
          {item.year && <span className="gallery-card__year">{item.year}</span>}
        </div>
      </div>
    </button>
  )
}

function Lightbox({
  items, index, onClose, onPrev, onNext
}: {
  items: GalleryItem[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  const item = items[index]

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return (
    <div className="lightbox" role="dialog" aria-modal="true">
      <div className="lightbox__backdrop" onClick={onClose} />
      <button className="lightbox__close" onClick={onClose} aria-label="Close"><X size={22} /></button>
      <button className="lightbox__nav lightbox__nav--prev" onClick={onPrev} aria-label="Previous"><ChevronLeft size={28} /></button>
      <button className="lightbox__nav lightbox__nav--next" onClick={onNext} aria-label="Next"><ChevronRight size={28} /></button>
      <div className="lightbox__content">
        {item.media_type === 'video' ? (
          <video controls autoPlay className="lightbox__video" src={item.cloudinary_url} />
        ) : (
          <div className="lightbox__img-wrap">
            <Image src={item.cloudinary_url} alt={item.title} fill sizes="90vw" className="lightbox__img" />
          </div>
        )}
        <div className="lightbox__info">
          <span className="lightbox__cat">{item.category}</span>
          <h2 className="lightbox__title">{item.title}</h2>
          {item.year && <span className="lightbox__year">{item.year}</span>}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>('All')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const filtered = filter === 'All' ? initialItems : initialItems.filter(i => i.category === filter)

  const openLightbox = (idx: number) => setLightboxIdx(idx)
  const closeLightbox = () => setLightboxIdx(null)
  const prevItem = () => setLightboxIdx(i => (i === null ? null : (i - 1 + filtered.length) % filtered.length))
  const nextItem = () => setLightboxIdx(i => (i === null ? null : (i + 1) % filtered.length))

  return (
    <>
      {/* Filter Tabs */}
      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 9h18M9 21V9" />
          </svg>
          <p>No projects in this category yet. Check back soon.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map((item, idx) => (
            <GalleryCard key={item.id} item={item} onClick={() => openLightbox(idx)} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
        />
      )}
    </>
  )
}
