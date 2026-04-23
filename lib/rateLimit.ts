/**
 * In-memory rate limiter.
 *
 * Uses a simple sliding-window counter keyed by an arbitrary string (userId,
 * email, IP, etc.).  Resets per-key when the window expires.
 *
 * ⚠️  In-memory means state is lost on Vercel function cold-start.  That's
 * acceptable for beta — upgrade to Upstash Redis post-launch if needed.
 */

interface Bucket {
  count: number
  /** epoch ms when the current window expires */
  expiresAt: number
}

const store = new Map<string, Bucket>()

/**
 * Check whether `key` has exceeded `limit` calls within `windowMs`.
 *
 * @returns `{ allowed: boolean; remaining: number; resetAt: number }`
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  let bucket = store.get(key)

  // Create or reset expired bucket
  if (!bucket || now >= bucket.expiresAt) {
    bucket = { count: 0, expiresAt: now + windowMs }
    store.set(key, bucket)
  }

  bucket.count++
  const allowed = bucket.count <= limit
  const remaining = Math.max(0, limit - bucket.count)

  return { allowed, remaining, resetAt: bucket.expiresAt }
}

// ─── Pre-configured limiters ──────────────────────────────────────────────────

const HOUR_MS = 60 * 60 * 1000

/**
 * Waitlist signup: 5 per hour per IP.
 * (Already called in the waitlist server action from Task 10.)
 */
export function waitlistRateLimit(ip: string) {
  return rateLimit(`waitlist:${ip}`, 5, HOUR_MS)
}

/**
 * Auth sign-in: 10 attempts per hour per email address.
 */
export function authRateLimit(email: string) {
  return rateLimit(`auth:${email.toLowerCase()}`, 10, HOUR_MS)
}

/**
 * Asset AI extraction: 10 per hour per user.
 * (Already enforced inline in the extraction route from Task 05.)
 */
export function extractionRateLimit(userId: string) {
  return rateLimit(`extract:${userId}`, 10, HOUR_MS)
}

/**
 * Chat messages: 30 per hour per user (Pro).
 * (Already enforced inline in the chat route from Task 07.)
 */
export function chatRateLimit(userId: string) {
  return rateLimit(`chat:${userId}`, 30, HOUR_MS)
}
