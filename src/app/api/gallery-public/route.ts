import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data)
}
