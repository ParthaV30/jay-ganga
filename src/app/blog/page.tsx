import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on architecture, exhibition design, and minimalism from the Jay Ganga Associates team.',
}



function BlogCard({ post }: {
  post: {
    id: string; title: string; slug: string; cover_image: string | null;
    author: string; created_at: string; content: string | null
  }
}) {
  const excerpt = post.content
    ? post.content.replace(/<[^>]+>/g, '').slice(0, 140) + '…'
    : 'Read the full article →'
  const date = new Date(post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <article className="blog-card">
      <Link href={`/blog/${post.slug}`} className="blog-card__link">
        <div className="blog-card__img-wrap">
          {post.cover_image ? (
            <Image src={post.cover_image} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="blog-card__img" />
          ) : (
            <div className="blog-card__img-placeholder" />
          )}
        </div>
        <div className="blog-card__body">
          <div className="blog-card__meta">
            <span><Calendar size={12} /> {date}</span>
            <span><User size={12} /> {post.author}</span>
          </div>
          <h2 className="blog-card__title">{post.title}</h2>
          <p className="blog-card__excerpt">{excerpt}</p>
          <span className="blog-card__read">Read More <ArrowRight size={12} /></span>
        </div>
      </Link>
    </article>
  )
}

type PostRow = {
  id: string; title: string; slug: string; cover_image: string | null;
  author: string; created_at: string; content: string | null
}

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, cover_image, author, created_at, content')
    .eq('published', true)
    .order('created_at', { ascending: false }) as { data: PostRow[] | null }

  return (
    <>
      <section className="blog-hero page-enter">
        <div className="container">
          <p className="section-label">Insights</p>
          <h1 className="blog-hero__title">Our Blog</h1>
          <p className="blog-hero__sub">Perspectives on design, space, and simplicity.</p>
        </div>
      </section>

      <section className="blog-body">
        <div className="container">
          {!posts || posts.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              <h3>No posts yet</h3>
              <p>We&apos;re working on some great content. Check back soon.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map(post => <BlogCard key={post.id} post={post} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
