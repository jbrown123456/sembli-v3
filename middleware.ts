import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_PREFIXES = ['/dashboard', '/chat', '/assets', '/timeline', '/settings', '/upgrade', '/onboarding']

// Routes that authenticated users shouldn't see (e.g. sign-in page)
const AUTH_ONLY_PREFIXES = ['/auth/signin']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
  const isAuthOnly = AUTH_ONLY_PREFIXES.some(p => pathname.startsWith(p))

  // Only run auth check when needed
  if (isProtected || isAuthOnly) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: { user } } = await (supabase.auth as any).getUser()

      if (!user && isProtected) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/signin'
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
      }

      if (user && isAuthOnly) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    } catch (err) {
      console.error('[middleware] auth check failed:', err)
      // On auth failure, redirect protected routes to sign-in rather than crashing
      if (isProtected) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/signin'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder files
     * - marketing / auth / onboarding routes (handled above by explicit checks)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
