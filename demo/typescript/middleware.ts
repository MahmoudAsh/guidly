import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = req.nextUrl
  const path = url.pathname

  const isPublic =
    ['/login', '/register', '/auth/callback', '/auth/reset-password'].some((p) => path.startsWith(p)) ||
    path.startsWith('/_next/static') ||
    path.startsWith('/_next/image') ||
    path.startsWith('/images') ||
    path === '/favicon.ico' ||
    path === '/robots.txt' ||
    path === '/sitemap.xml'

  if (!session && !isPublic) {
    const loginUrl = new URL('/login', url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  if (session && (path === '/login' || path === '/register')) {
    const dest = url.searchParams.get('redirect') || url.searchParams.get('next') || '/feed'
    return NextResponse.redirect(new URL(dest, url))
  }

  return res
}

export const config = {
  matcher: ['/(.*)'],
}


