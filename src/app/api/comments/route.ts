import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { post_id, name, email, comment } = body

  if (!post_id || !name || !email || !comment) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  const { error } = await supabase.from('blog_comments').insert([{
    post_id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    comment: comment.trim(),
    approved: false,
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
