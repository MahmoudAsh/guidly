import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as { email?: string; password?: string; name?: string }
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    // TODO: Replace with real user creation
    return NextResponse.json({ ok: true, id: Math.random().toString(36).slice(2) }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}


