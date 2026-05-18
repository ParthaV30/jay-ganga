import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

export const revalidate = 0
import ProjectsClient from './ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Browse the full portfolio of Jay Ganga Associates — custom stall fabrication, 3D designs, and brand activations.',
}

export default async function ProjectsPage() {
  const { data } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <section className="projects-hero page-enter">
        <div className="container">
          <p className="section-label">Portfolio</p>
          <h1 className="projects-hero__title">Our Projects</h1>
          <p className="projects-hero__sub">
            Showcasing over 100+ successfully delivered stall fabrication projects.
          </p>
        </div>
      </section>
      <section className="projects-body">
        <div className="container">
          <ProjectsClient initialItems={data ?? []} />
        </div>
      </section>
    </>
  )
}
