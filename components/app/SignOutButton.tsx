'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SignOutButtonProps {
  initials?: string
}

export function SignOutButton({ initials = '?' }: SignOutButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/signin')
    router.refresh()
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Account menu"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'var(--almanac-surface-alt)',
          color: 'var(--almanac-ink-soft)',
          border: '1px solid var(--almanac-border)',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'var(--font-inter)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {initials}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 38,
              right: 0,
              zIndex: 50,
              background: 'var(--almanac-surface)',
              border: '1px solid var(--almanac-border)',
              borderRadius: 12,
              padding: '6px',
              minWidth: 160,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            <button
              onClick={handleSignOut}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: 0,
                background: 'transparent',
                color: loading ? 'var(--almanac-muted)' : 'var(--almanac-ink)',
                fontSize: 14,
                fontFamily: 'var(--font-inter)',
                cursor: loading ? 'not-allowed' : 'pointer',
                textAlign: 'left',
              }}
            >
              {loading ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
