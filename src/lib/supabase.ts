import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your_supabase_url_here.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here'

const isPlaceholder = supabaseUrl.includes('your_supabase_url_here')

// Helper to create a chainable mock that won't throw errors
let localGalleryDB = Array.from({ length: 7 }).map((_, i) => ({
  id: `mock-img-${i + 1}`,
  cloudinary_url: `/images/gallery_${i + 1}.jpg`,
  cloudinary_public_id: `gallery_${i + 1}`,
  thumbnail_url: null,
  title: i >= 4 ? `Architecture Project ${i + 1 - 4}` : `Stall Fabrication Project ${i + 1}`,
  category: i >= 4 ? 'Architecture' : 'Exhibition',
  media_type: 'photo',
  year: '2024',
  created_at: new Date().toISOString(),
}))

const createMockClient = () => {
  let currentTable = ''
  let payload: any = null
  
  const mock: any = {
    from: (t: string) => { currentTable = t; return mock },
    select: () => mock,
    insert: (data: any) => { payload = data; return mock },
    update: () => mock,
    delete: () => mock,
    eq: () => mock,
    neq: () => mock,
    order: () => mock,
    match: () => mock,
    single: () => {
       const res = { data: null, error: null }
       return { then: (resolve: any) => resolve(res), catch: (cb: any) => cb(null) }
    },
    maybeSingle: () => mock,
    limit: () => mock,
    range: () => mock,
    then: (resolve: any) => {
      if (currentTable === 'gallery_items') {
        if (payload) {
           const newItem = {
             id: `mock-img-${Date.now()}`,
             created_at: new Date().toISOString(),
             ...payload
           }
           localGalleryDB = [newItem, ...localGalleryDB]
           payload = null
           return resolve({ data: [newItem], error: null })
        }
        return resolve({ data: localGalleryDB, error: null, count: localGalleryDB.length })
      }
      return resolve({ data: [], error: null, count: 0 })
    },
    catch: (callback: any) => callback(null),
  }
  return mock
}

// Public client — uses anon key, respects RLS
export const supabase = isPlaceholder 
  ? createMockClient()
  : createClient(supabaseUrl, supabaseAnonKey)

// Admin client — uses service role key, bypasses RLS (server-side only)
export const supabaseAdmin = isPlaceholder
  ? createMockClient()
  : createClient(supabaseUrl, supabaseServiceKey)

export type BlogPost = {
  id: string
  title: string
  slug: string
  cover_image: string | null
  content: string | null
  author: string
  published: boolean
  created_at: string
  updated_at: string
}

export type BlogComment = {
  id: string
  post_id: string
  name: string
  email: string
  comment: string
  approved: boolean
  created_at: string
}

export type GalleryItem = {
  id: string
  cloudinary_url: string
  cloudinary_public_id: string
  thumbnail_url: string | null
  title: string
  category: 'Exhibition' | 'Architecture' | 'Interior' | 'Other'
  media_type: 'photo' | 'video'
  year: string | null
  created_at: string
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}
