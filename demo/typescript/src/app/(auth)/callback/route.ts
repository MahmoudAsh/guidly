import { NextResponse } from 'next/server'
import { createClientServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  const supabase = createClientServer()
  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
    }
  } catch (e) {
    return NextResponse.redirect(new URL(`/login?error=auth`, request.url))
  }
  return NextResponse.redirect(new URL(next, request.url))
}


