import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({ ok: true, posts: count ?? 0, ts: new Date().toISOString() })
}
