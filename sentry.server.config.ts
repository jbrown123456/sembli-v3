import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Tag Supabase and Stripe errors for easier filtering
    beforeSend(event) {
      // Strip PII from user context
      if (event.user) {
        delete event.user.email
        delete event.user.username
      }
      return event
    },
  })
}
