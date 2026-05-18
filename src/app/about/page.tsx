import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Jay Ganga Associates — 15+ years of minimalist architecture and exhibition design excellence across global stages.',
}

const values = [
  {
    title: 'Precision over decoration',
    desc: 'We believe every element must earn its place. Our designs strip away the superfluous to reveal what truly matters — space, light, and human connection.',
    img: '/images/value-precision.png',
  },
  {
    title: 'Spaces that tell stories',
    desc: 'Each project begins with deep listening. We immerse ourselves in a client\'s world to craft environments that communicate their values without words.',
    img: '/images/value-story.png',
  },
  {
    title: 'Form follows function',
    desc: 'Beauty and utility are never in conflict in our philosophy. The most elegant solution is always the one that works perfectly for the people using it.',
    img: '/images/value-function.png',
  },
  {
    title: 'Global perspective, local wisdom',
    desc: 'Having exhibited on stages across Asia, Europe, and the Middle East, we bring international design intelligence tempered by deep local understanding.',
    img: '/images/value-global.png',
  },
]



const team = [
  { name: 'Ajith Balaji S', title: 'Founder & Principal Designer', initials: 'AB' },
  { name: 'Priya Sharma', title: 'Head of Exhibition Design', initials: 'PS' },
  { name: 'Arjun Mehta', title: 'Creative Director', initials: 'AM' },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────── */}
      <section className="about-hero page-enter">
        <div className="about-hero__img-wrap">
          <Image
            src="/images/about-hero.png"
            alt="Jay Ganga Associates exhibition hall"
            fill
            sizes="60vw"
            priority
            className="about-hero__img"
          />
        </div>
        <div className="about-hero__content">
          <p className="section-label">Our Story</p>
          <h1 className="about-hero__title">
            Transforming spaces with minimalist precision.
          </h1>
          <p className="about-hero__body">
            Jay Ganga Associates has been transforming exhibition experiences with photorealistic design and 
            quality fabrication since its inception. Founded in Coimbatore, we have grown rapidly into 
            a trusted turnkey solution provider — scaling from 6 stalls in 2023 to over 40 bespoke projects in 2025.
          </p>
          <p className="about-hero__body">
            We believe that a stall is more than just a structure; it's a bridge between your brand and your 
            audience. Our mission is to be the "Architects of Engagement," ensuring every client stands out 
            with a design that is both functional and visually stunning.
          </p>
          <Link href="/contact" className="btn btn-dark" style={{ marginTop: '1.5rem' }}>
            Work with Us <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Values ────────────────────────────── */}
      <section className="values-section">
        <div className="container">
          <p className="section-label">What We Stand For</p>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '4rem' }}>
            Our Core Values
          </h2>
        </div>
        {values.map((v, i) => (
          <div key={v.title} className={`value-block ${i % 2 === 1 ? 'value-block--reverse' : ''}`}>
            <div className="value-block__img-wrap">
              <Image src={v.img} alt={v.title} fill sizes="50vw" className="value-block__img" />
            </div>
            <div className="value-block__text">
              <span className="value-block__num">0{i + 1}</span>
              <h3 className="value-block__title">{v.title}</h3>
              <p className="value-block__desc">{v.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Team ──────────────────────────────── */}
      <section className="team-section">
        <div className="container">
          <p className="section-label">The People</p>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '3.5rem' }}>
            Our Team
          </h2>
          <div className="team-grid">
            {team.map(m => (
              <div className="team-card" key={m.name}>
                <div className="team-card__avatar">{m.initials}</div>
                <h3 className="team-card__name">{m.name}</h3>
                <p className="team-card__title">{m.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}
