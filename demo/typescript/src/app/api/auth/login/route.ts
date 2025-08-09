import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as { email?: string; password?: string }
    if (!body.email || !body.password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }
    // TODO: Replace with real auth backend
    const ok = body.password.length >= 4
    if (!ok) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}


