import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  const validUser = process.env.ADMIN_USERNAME
  const validPass = process.env.ADMIN_PASSWORD

  if (username === validUser && password === validPass) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
    return response
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
