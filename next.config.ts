import type { NextConfig } from 'next'

const CSP = [
  "default-src 'self'",
  // Next.js needs unsafe-inline for styles; unsafe-eval for React DevTools in dev
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://us.i.posthog.com",
  "style-src 'self' 'unsafe-inline'",
  // Supabase storage + avatars; data: for inline SVG
  "img-src 'self' data: blob: https://*.supabase.co",
  // Supabase Realtime (wss), PostHog ingestion, Sentry
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://us.i.posthog.com https://o*.ingest.sentry.io https://o*.ingest.us.sentry.io",
  // Stripe payment iframe
  "frame-src https://js.stripe.com",
  // Google Fonts served via self (next/font downloads at build time)
  "font-src 'self'",
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
    ]
  },
}

export default nextConfig
