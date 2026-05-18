'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Award, Users, Briefcase, Calendar } from 'lucide-react'
import type { GalleryItem } from '@/lib/supabase'

/* ── Animated counter hook ──────────────────── */
function useCounter(target: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, active])
  return count
}

/* ── Stats Item ─────────────────────────────── */
function StatItem({ icon: Icon, value, label, suffix = '+', active }: {
  icon: React.ElementType; value: number; label: string; suffix?: string; active: boolean
}) {
  const count = useCounter(value, 1800, active)
  return (
    <div className="stat-item">
      <Icon size={24} strokeWidth={1} className="stat-icon" />
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

/* ── Featured Work Card ─────────────────────── */
function WorkCard({ item }: { item: GalleryItem }) {
  const thumb = item.media_type === 'video'
    ? (item.thumbnail_url || item.cloudinary_url.replace(/\.[^.]+$/, '.jpg').replace('/upload/', '/upload/so_0/'))
    : item.cloudinary_url

  return (
    <Link href="/projects" className="work-card">
      <div className="work-card__img-wrap">
        <Image src={thumb} alt={item.title} fill sizes="(max-width:768px) 100vw, 33vw" className="work-card__img" />
        {item.media_type === 'video' && (
          <div className="work-card__play">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        )}
        <div className="work-card__overlay">
          <span className="work-card__cat">{item.category}</span>
          <h3 className="work-card__title">{item.title}</h3>
        </div>
      </div>
    </Link>
  )
}

/* ── Skeleton card ─── */
function SkeletonCard() {
  return <div className="work-card skeleton" style={{ height: 280 }} />
}



export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsActive, setStatsActive] = useState(false)
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  /* Intersection observer for stats */
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsActive(true); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* Fetch featured gallery */
  useEffect(() => {
    fetch('/api/gallery-public')
      .then(r => r.json())
      .then(d => { setItems(d.slice(0, 6)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      {/* ── HERO ───────────────────────────────── */}
      <section className="hero page-enter">
        <div className="hero__grid-bg" aria-hidden />
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="hero__eyebrow">Exhibition Stall Fabricators in Coimbatore</p>
            <h1 className="hero__title">
              Jay Ganga<br />
              <em>Associates</em>
            </h1>
            <div className="hero__line" aria-hidden />
            <p className="hero__sub">
              Turnkey Exhibition Solutions from Concept to Fabrication.<br />
              Architects of Engagement. Builders of Trust.
            </p>
            <div className="hero__ctas">
              <Link href="/projects" className="btn btn-dark">View Our Work <ArrowRight size={14} /></Link>
              <Link href="/contact" className="btn btn-ghost">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES STRIP ─────────────────────── */}
      <section className="services-strip">
        <div className="container">
          <div className="services-strip__grid">
            {[
              { icon: '◻', title: '3D Stall Design', desc: 'Photorealistic renders before a single bolt is tightened.' },
              { icon: '⬡', title: 'Custom Fabrication', desc: 'Wooden, Octanorm, and mezzanine stalls built in-house.' },
              { icon: '◈', title: 'Brand Activations', desc: 'Kiosks and pop-up counters that carry your brand everywhere.' },
              { icon: '◇', title: 'End-to-End Management', desc: 'Logistics, installation, and dismantling — we handle it all.' },
            ].map(s => (
              <div className="service-card" key={s.title}>
                <span className="service-card__icon">{s.icon}</span>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
                <div className="service-card__line" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────── */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            <StatItem icon={Briefcase} value={100} label="Stalls Delivered" active={statsActive} />
            <StatItem icon={Calendar} value={3} label="Years of Excellence" active={statsActive} />
            <StatItem icon={Users} value={50} label="Happy Clients" active={statsActive} />
            <StatItem icon={Award} value={4.9} label="Customer's Rating" suffix="/5" active={statsActive} />
          </div>
        </div>
      </section>

      {/* ── FEATURED WORK ──────────────────────── */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-section__head">
            <div>
              <p className="section-label">Portfolio</p>
              <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Featured Work</h2>
            </div>
            <Link href="/projects" className="btn btn-ghost">All Projects <ArrowRight size={13} /></Link>
          </div>
          <div className="work-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : items.length === 0
                ? <p style={{ color: 'var(--color-text-secondary)', gridColumn: '1/-1', padding: '3rem 0' }}>No projects yet — check back soon.</p>
                : items.map(item => <WorkCard key={item.id} item={item} />)
            }
          </div>
        </div>
      </section>

      {/* ── WHY JAY GANGA ──────────────────────── */}
      <section className="why-section">
        <div className="container">
          <div className="why-section__head">
            <p className="section-label">Why Us</p>
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>The Jay Ganga Difference</h2>
          </div>
          <div className="why-grid">
            {[
              { n: '01', title: 'End-to-End Turnkey', desc: 'From 3D photorealistic design to on-site fabrication and final dismantling.' },
              { n: '02', title: 'In-House Production', desc: 'Our dedicated workshop in Coimbatore ensures quality control and timely delivery.' },
              { n: '03', title: 'Rapid Growth', desc: 'Scaling from 6 stalls in 2023 to 40+ in 2025, we are the fastest-growing fabricator in the region.' },
              { n: '04', title: 'Architects of Trust', desc: 'A proven track record with a 4.9/5 rating for transparency and commitment to deadlines.' },
            ].map(w => (
              <div className="why-card" key={w.n}>
                <span className="why-card__num">{w.n}</span>
                <h3 className="why-card__title">{w.title}</h3>
                <p className="why-card__desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────── */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <p className="section-label" style={{ '--accent-override': 'rgba(201,168,76,0.7)' } as React.CSSProperties}>Get Started</p>
            <h2 className="cta-banner__title">Ready to Exhibit?</h2>
            <p className="cta-banner__sub">Let&apos;s build something extraordinary together.</p>
          </div>
          <Link href="/contact" className="btn btn-ghost-light">
            Start a Conversation <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </>
  )
}
