import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CommentForm from './CommentForm'
import { ArrowLeft, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react'
import type { BlogComment } from '@/lib/supabase'

export const revalidate = 0

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const { data } = await supabase.from('blog_posts').select('title, content').eq('slug', slug).eq('published', true).single()
  if (!data) return { title: 'Post Not Found' }
  const desc = data.content ? data.content.replace(/<[^>]+>/g, '').slice(0, 160) : ''
  return { title: data.title, description: desc }
}



export default async function BlogPostPage({ params }: Props) {
  const { slug } = params

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const { data: comments } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('post_id', post.id)
    .eq('approved', true)
    .order('created_at', { ascending: true })

  const date = new Date(post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // Fetch Next and Previous posts
  const [{ data: nextPost }, { data: prevPost }] = await Promise.all([
    supabase.from('blog_posts').select('title, slug').eq('published', true).gt('created_at', post.created_at).order('created_at', { ascending: true }).limit(1).maybeSingle(),
    supabase.from('blog_posts').select('title, slug').eq('published', true).lt('created_at', post.created_at).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  // Fix: If we have 2 posts but dates are identical, gt/lt fails. Let's find "other" post if both null.
  let fallbackPost = null
  if (!nextPost && !prevPost) {
    const { data: others } = await supabase.from('blog_posts').select('title, slug, created_at').eq('published', true).neq('id', post.id).limit(1).maybeSingle()
    fallbackPost = others
  }

  return (
    <>
      <article className="post page-enter">
        <div className="post-layout">
          {/* Left Sidebar: Image */}
          <aside className="post-sidebar">
            {post.cover_image ? (
              <div className="post-sidebar__img-wrap">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 40vw"
                  priority
                  className="post-sidebar__img"
                />
              </div>
            ) : (
              <div className="post-sidebar__placeholder" />
            )}

          </aside>

          {/* Right Content */}
          <div className="post-content-wrap">
            <div className="post__body">
              <header className="post__header">
                <div className="post__meta">
                  <span><Calendar size={13} /> {date}</span>
                  <span><User size={13} /> {post.author}</span>
                </div>
                <h1 className="post__title">{post.title}</h1>
                <div className="post__divider" />
              </header>

            <div
                className="post__content"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />

            </div>

          {/* Comments */}
          <section className="comments-section">
            <h2 className="comments-section__title">
              Comments ({comments?.length ?? 0})
            </h2>

            {!comments || comments.length === 0 ? (
              <p className="comments-empty">Be the first to leave a comment.</p>
            ) : (
              <div className="comments-list">
                {(comments as BlogComment[]).map(c => {
                  const initial = c.name.charAt(0).toUpperCase()
                  const cDate = new Date(c.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })
                  return (
                    <div key={c.id} className="comment">
                      <div className="comment__avatar">{initial}</div>
                      <div className="comment__body">
                        <div className="comment__meta">
                          <strong>{c.name}</strong>
                          <span>{cDate}</span>
                        </div>
                        <p className="comment__text">{c.comment}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="comment-form-wrap">
              <h3 className="comment-form-wrap__title">Leave a Comment</h3>
              <CommentForm postId={post.id} />
            </div>
          </section>

          {/* New Horizontal Navigation - Moved under comments */}
          <nav className="post-nav-inline">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="post-nav-inline__link">
                <span className="post-nav-inline__label"><ChevronLeft size={16} /> Previous</span>
                <span className="post-nav-inline__title">{prevPost.title}</span>
              </Link>
            ) : <div className="post-nav-inline__empty" />}

            <Link href="/blog" className="post-nav-inline__center">
              <div className="post-nav-inline__dot" />
              <span>Blog Gallery</span>
            </Link>

            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`} className="post-nav-inline__link post-nav-inline__link--right">
                <span className="post-nav-inline__label">Next <ChevronRight size={16} /></span>
                <span className="post-nav-inline__title">{nextPost.title}</span>
              </Link>
            ) : fallbackPost ? (
              <Link href={`/blog/${fallbackPost.slug}`} className="post-nav-inline__link post-nav-inline__link--right">
                <span className="post-nav-inline__label">Read Next <ChevronRight size={16} /></span>
                <span className="post-nav-inline__title">{fallbackPost.title}</span>
              </Link>
            ) : <div className="post-nav-inline__empty" />}
          </nav>
        </div>
      </div>
    </article>

    </>
  )
}
