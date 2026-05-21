'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Mail, 
  LogOut, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react'

const navItems = [
  { href: '/admin/blog',     icon: FileText,        label: 'Blog Posts' },
  { href: '/admin/gallery',  icon: ImageIcon,       label: 'Projects Gallery' },
  { href: '/admin/comments', icon: MessageSquare,   label: 'Pending Comments' },
  { href: '/admin/contacts', icon: Mail,            label: 'Contact Submissions' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

  // Dynamic Filtering: If we are in one of the 4 sections, show the other 3.
  // If we are on the Root Dashboard, show all 4.
  const filteredNavItems = !pathname || pathname === '/admin' 
    ? navItems 
    : navItems.filter(item => !isActive(item.href))

  return (
    <div className="admin-shell">
      {/* Mobile Header Toggle */}
      <div className="admin-mobile-header">
        <button onClick={() => setIsMobileMenuOpen(true)} className="admin-hamburger">
          <Menu size={24} />
        </button>
        <div className="admin-mobile-logo">JAY GANGA ADMIN</div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <Link href="/admin" className="admin-sidebar__logo-main">JAY GANGA</Link>
            <span className="admin-sidebar__logo-sub">Admin Panel</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="admin-sidebar-close">
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-group-label">Quick Switch Navigation</div>
          {filteredNavItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="admin-nav__item"
            >
              <Icon size={17} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
          
          {pathname !== '/admin' && (
             <Link href="/admin" className="admin-nav__item admin-nav__item--back">
                <LayoutDashboard size={16} /> Dashboard Home
             </Link>
          )}
        </nav>

        <div className="admin-nav-bottom">
          <Link href="/" target="_blank" className="admin-view-site-btn">
            <ExternalLink size={16} strokeWidth={1.5} /> View Live Site
          </Link>
          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={16} strokeWidth={1.5} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>

    </div>
  )
}
