import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: ['/dashboard', '/(protected)/(.*)'],
}

export async function middleware(req: NextRequest) {
  const hasSession = req.cookies.has('sb-access-token') || req.cookies.has('sb:token')
  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}


