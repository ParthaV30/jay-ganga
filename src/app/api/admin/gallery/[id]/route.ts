import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_: NextRequest, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params

  // Get item to find public_id
  const { data: item, error: fetchErr } = await supabaseAdmin
    .from('gallery_items')
    .select('cloudinary_public_id, media_type')
    .eq('id', id)
    .single()

  if (fetchErr || !item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(item.cloudinary_public_id, {
      resource_type: item.media_type === 'video' ? 'video' : 'image',
    })
  } catch (e) {
    console.error('Cloudinary deletion error:', e)
  }

  // Delete from DB
  const { error } = await supabaseAdmin.from('gallery_items').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
