import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Services',
  description: 'From 3D stall design to custom fabrication and end-to-end event management — explore Jay Ganga Associates\' complete exhibition solutions in Coimbatore.',
}

const services = [
  {
    number: '01',
    title: '3D Stall Design & Planning',
    desc: 'Before a single bolt is tightened, we present you with a photorealistic 3D render of your stall. Our design team works closely with clients to ensure every inch of space — from aisle pathways to product display zones — is optimised for maximum visitor engagement.',
    img: '/images/inter.jpg',
  },
  {
    number: '02',
    title: 'Custom Stall Fabrication',
    desc: 'From lightweight Octanorm systems to heavy-duty mezzanine structures, our in-house workshop in Coimbatore fabricates custom stalls of any scale. We specialise in wooden, metal, and modular systems crafted with precision and built to withstand the demands of any exhibition floor.',
    img: '/images/stall.jpeg',
  },
  {
    number: '03',
    title: 'Brand Activations & Kiosks',
    desc: 'Make an impact beyond the exhibition hall. We design and fabricate branded kiosks, pop-up counters, and retail activation zones that carry your brand identity consistently from the expo floor to the high street. Compact, bold, and built to convert.',
    img: '/images/gallery_3.jpg',
  },
  {
    number: '04',
    title: 'Graphic Printing & Branding',
    desc: 'A stall is only as powerful as its visual communication. We offer large-format digital printing for backdrops, flex boards, standees, and fascia panels. Our in-house graphics team ensures colour accuracy, brand consistency, and razor-sharp print quality on every element.',
    img: '/images/stall 8.png',
  },
  {
    number: '05',
    title: 'End-to-End Event Management',
    desc: 'We handle everything so you can focus on your clients. From logistics and transportation to on-site installation and post-event dismantling, our team is with you from the first sketch to the last panel packed. A single point of contact, zero headaches.',
    img: '/images/stall 7.png',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Page title */}
      <section className="services-hero page-enter">
        <div className="container">
          <p className="section-label">What We Do</p>
          <h1 className="services-hero__title">Our Services</h1>
          <p className="services-hero__sub">
            Five specialist disciplines, one promise:{' '}
            <em>your stall will stand out on any floor.</em>
          </p>
        </div>
      </section>

      {/* Alternating blocks */}
      {services.map((s, i) => (
        <section key={s.number} className={`svc-block ${i % 2 === 1 ? 'svc-block--reverse' : ''}`}>
          <div className="svc-block__img-wrap">
            <Image
              src={s.img}
              alt={s.title}
              fill
              sizes="50vw"
              className="svc-block__img"
            />
          </div>
          <div className="svc-block__text">
            <span className="svc-block__num">{s.number}</span>
            <h2 className="svc-block__title">{s.title}</h2>
            <p className="svc-block__desc">{s.desc}</p>
            <Link href="/contact" className="btn btn-ghost svc-block__cta">
              Enquire Now <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      ))}
    </>
  )
}
