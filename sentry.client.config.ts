import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,

    // Capture 10% of transactions in production for performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Replay: 10% of sessions, 100% on error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    integrations: [
      Sentry.replayIntegration({
        // Mask PII in replays
        maskAllText: false,
        blockAllMedia: false,
        maskAllInputs: true,
      }),
    ],

    // Scrub email and name from breadcrumbs
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.data) {
        if (typeof breadcrumb.data.url === 'string') {
          breadcrumb.data.url = breadcrumb.data.url.replace(/email=[^&]+/gi, 'email=[REDACTED]')
        }
      }
      return breadcrumb
    },
  })
}
