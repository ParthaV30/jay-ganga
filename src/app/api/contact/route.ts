import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, subject, message } = body

  if (!name || !email || !message || !phone) {
    return NextResponse.json({ error: 'Name, email, phone and message are required' }, { status: 400 })
  }

  const { error } = await supabase.from('contact_submissions').insert([{
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    message: `${subject ? `[${subject}] ` : ''}${message.trim()}`,
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
