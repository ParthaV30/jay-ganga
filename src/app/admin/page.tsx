import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { FileText, Image, MessageSquare, Mail } from 'lucide-react'

export const revalidate = 0

export default async function AdminDashboard() {
  const [{ count: posts }, { count: gallery }, { count: comments }, { count: contacts }] = await Promise.all([
    supabaseAdmin.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('gallery_items').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('blog_comments').select('*', { count: 'exact', head: true }).eq('approved', false),
    supabaseAdmin.from('contact_submissions').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Blog Posts', value: posts ?? 0, icon: FileText, href: '/admin/blog', accent: false },
    { label: 'Gallery Items', value: gallery ?? 0, icon: Image, href: '/admin/gallery', accent: false },
    { label: 'Pending Comments', value: comments ?? 0, icon: MessageSquare, href: '/admin/comments', accent: true },
    { label: 'Contact Submissions', value: contacts ?? 0, icon: Mail, href: '/admin/contacts', accent: false },
  ]

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Welcome back. Here&apos;s what&apos;s happening.</p>
        </div>
        <Link href="/" target="_blank" className="btn btn-dark">
          View Live Website
        </Link>
      </div>

      <div className="dash-grid">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <Link href={s.href} key={s.label} className={`dash-card ${s.accent && s.value > 0 ? 'dash-card--accent' : ''}`}>
              <div className="dash-card__icon"><Icon size={22} strokeWidth={1.5} /></div>
              <div className="dash-card__value">{s.value}</div>
              <div className="dash-card__label">{s.label}</div>
            </Link>
          )
        })}
      </div>

    </>
  )
}
