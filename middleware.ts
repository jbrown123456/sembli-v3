import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication (/chat is intentionally excluded — guests can try it)
const PROTECTED_PREFIXES = ['/dashboard', '/assets', '/timeline', '/settings', '/upgrade', '/onboarding']

// Routes that authenticated users shouldn't see
const AUTH_ONLY_PREFIXES = ['/auth/signin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
  const isAuthOnly = AUTH_ONLY_PREFIXES.some(p => pathname.startsWith(p))

  if (!isProtected && !isAuthOnly) {
    return NextResponse.next()
  }

  // Check for a Supabase session cookie (any sb-*-auth-token cookie)
  const hasSession = request.cookies.getAll().some(
    c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )

  if (!hasSession && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/signin'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (hasSession && isAuthOnly) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
