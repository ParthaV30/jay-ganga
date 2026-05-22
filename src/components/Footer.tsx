'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

// Simple SVG social icons since brand icons were removed in newer Lucide versions
const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-main">JAY <span style={{ color: 'var(--color-accent)' }}>GANGA</span></span>
            </div>
            <p className="footer__tagline">
              Architects of Engagement. Builders of Trust.
            </p>
            <div className="footer__socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon size={17} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinIcon size={17} />
              </a>
              <a href="https://wa.me/919363333040" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              {[
                { href: '/',         label: 'Home' },
                { href: '/about',    label: 'About Us' },
                { href: '/projects', label: 'Projects' },
                { href: '/services', label: 'Services' },
                { href: '/blog',     label: 'Blog' },
                { href: '/contact',  label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__section">
            <h4 className="footer__heading">Get In Touch</h4>
            <ul className="footer__contact">
              <li>
                <span>Address</span>
                <p>Do.No 31, Nanjammal Illam, 3rd St, Pari Nagar, Edayarpalayam, Coimbatore — 641025</p>
              </li>
              <li>
                <span>Phone</span>
                <p><a href="tel:+919363333040">+91 93633 33040</a></p>
              </li>
              <li>
                <span>Email</span>
                <p><a href="mailto:info.jayganga@gmail.com">info.jayganga@gmail.com</a></p>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {year} Jay <span style={{ color: 'var(--color-accent)' }}>Ganga</span> Associates. All rights reserved.</p>
          <p>Developed by <a href="https://rturox.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>rturox.com</a></p>
        </div>
      </div>
    </footer>
  )
}
