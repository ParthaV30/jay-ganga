'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react'
import { showToast } from '@/components/Toast'

function validate(fields: Record<string, string>) {
  const errors: Record<string, string> = {}
  if (!fields.name.trim()) errors.name = 'Name is required.'
  if (!fields.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email.'
  if (!fields.phone.trim()) errors.phone = 'Phone number is required.'
  if (!fields.message.trim()) errors.message = 'Message is required.'
  return errors
}



export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
        showToast('✓ Your message has been sent. We\'ll be in touch soon!')
        
        // WhatsApp redirection - using location.href to ensure it's not blocked by popup blockers
        const waText = `Hi Jay Ganga Associates, I'm ${form.name}. %0A%0AEmail: ${form.email}%0APhone: ${form.phone}%0ASubject: ${form.subject}%0A%0AMessage: ${form.message}`
        window.location.href = `https://wa.me/919363333040?text=${waText}`
      } else {
        const data = await res.json()
        showToast(data.error || 'Failed to send message.', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="contact-hero page-enter">
        <div className="container">
          <p className="section-label">Get In Touch</p>
          <h1 className="contact-title">Let&apos;s Build Something<br />Extraordinary</h1>
        </div>
      </section>

      <section className="contact-body">
        <div className="container contact-grid">
          {/* Form */}
          <div className="contact-form-wrap">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon">✓</div>
                <h2>Message Received</h2>
                <p>Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="contact-form__row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-name">Full Name *</label>
                    <input id="cf-name" className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={set('name')} placeholder="Your name" />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-email">Email Address *</label>
                    <input id="cf-email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={set('email')} placeholder="you@email.com" />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>
                <div className="contact-form__row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-phone">Phone Number *</label>
                    <input id="cf-phone" className={`form-input ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-subject">Subject</label>
                    <select id="cf-subject" className="form-select" value={form.subject} onChange={set('subject')}>
                      <option value="">Select a subject</option>
                      <option>Exhibition Stand Design</option>
                      <option>Architecture & Planning</option>
                      <option>Interior Design</option>
                      <option>Brand & Graphics</option>
                      <option>Expo Consulting</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cf-message">Message *</label>
                  <textarea id="cf-message" className={`form-textarea ${errors.message ? 'error' : ''}`} value={form.message} onChange={set('message')} rows={6} placeholder="Tell us about your project…" />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>
                <button type="submit" className="btn btn-dark" disabled={loading}>
                  {loading ? 'Sending…' : <>Send Message <ArrowRight size={14} /></>}
                </button>
              </form>
            )}
          </div>

          {/* Details */}
          <aside className="contact-details">
            <div className="contact-info">
              <h3 className="contact-info__heading">Contact Information</h3>
              <ul className="contact-info__list">
                <li>
                  <MapPin size={16} strokeWidth={1.5} />
                  <div>
                    <strong>Address</strong>
                    <p>Do.No 31, Nanjammal Illam, 3rd St,<br />Pari Nagar, Edayarpalayam,<br />Coimbatore, Tamil Nadu — 641025</p>
                  </div>
                </li>
                <li>
                  <Phone size={16} strokeWidth={1.5} />
                  <div>
                    <strong>Phone</strong>
                    <p><a href="tel:+919363333040">+91 93633 33040</a></p>
                  </div>
                </li>
                <li>
                  <Mail size={16} strokeWidth={1.5} />
                  <div>
                    <strong>Email</strong>
                    <p><a href="mailto:info.jayganga@gmail.com">info.jayganga@gmail.com</a></p>
                  </div>
                </li>
              </ul>
              <a
                href="https://wa.me/919363333040?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20stall%20fabrication%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="btn whatsapp-btn"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>

            {/* Map placeholder */}
            <div className="map-placeholder">
              <iframe
                title="Jay Ganga Associates location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15664.8465063462!2d76.9056!3d11.0256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85ed3b5555555%3A0x5555555555555555!2sEdayarpalayam%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1713370000000!5m2!1sen!2sin"
                width="100%"
                height="260"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </section>

    </>
  )
}
