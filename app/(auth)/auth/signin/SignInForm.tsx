'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    const supabase = createClient()

    if (password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setState('error')
        setErrorMsg(error.message)
      } else {
        router.push('/dashboard')
      }
      return
    }

    const redirectTo = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    })

    if (error) {
      setState('error')
      setErrorMsg(error.message)
    } else {
      setState('sent')
    }
  }

  if (state === 'sent') {
    return (
      <div
        style={{
          padding: '20px 24px',
          borderRadius: 16,
          background: 'var(--almanac-surface)',
          border: '1px solid var(--almanac-border)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 12 }}>✉️</div>
        <p
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 20,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            marginBottom: 8,
            color: 'var(--almanac-ink)',
          }}
        >
          Check your inbox.
        </p>
        <p style={{ fontSize: 14, color: 'var(--almanac-ink-soft)', lineHeight: 1.55 }}>
          We sent a magic link to <strong>{email}</strong>. Click it to sign in — it expires in 1 hour.
        </p>
        <button
          onClick={() => { setState('idle'); setEmail('') }}
          style={{
            marginTop: 20,
            background: 'transparent',
            border: 0,
            fontSize: 13,
            color: 'var(--almanac-muted)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label
        htmlFor="email"
        style={{
          fontSize: 12,
          fontFamily: 'var(--font-jetbrains-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--almanac-muted)',
        }}
      >
        Email address
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        autoFocus
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 12,
          border: '1px solid var(--almanac-border)',
          background: 'var(--almanac-surface)',
          color: 'var(--almanac-ink)',
          fontSize: 16,
          fontFamily: 'var(--font-inter)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      <label
        htmlFor="password"
        style={{
          fontSize: 12,
          fontFamily: 'var(--font-jetbrains-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--almanac-muted)',
          marginTop: 4,
        }}
      >
        Password <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional — leave blank for magic link)</span>
      </label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 12,
          border: '1px solid var(--almanac-border)',
          background: 'var(--almanac-surface)',
          color: 'var(--almanac-ink)',
          fontSize: 16,
          fontFamily: 'var(--font-inter)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {state === 'error' && (
        <p style={{ fontSize: 13, color: 'var(--almanac-danger)', margin: 0 }}>
          {errorMsg || 'Something went wrong — try again.'}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        style={{
          marginTop: 4,
          width: '100%',
          padding: '15px',
          borderRadius: 999,
          border: 0,
          background: 'var(--almanac-ink)',
          color: 'var(--almanac-bg)',
          fontSize: 16,
          fontWeight: 600,
          fontFamily: 'var(--font-inter)',
          cursor: state === 'loading' ? 'not-allowed' : 'pointer',
          opacity: state === 'loading' ? 0.6 : 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        {state === 'loading' ? (password ? 'Signing in…' : 'Sending…') : (password ? 'Sign in →' : 'Send magic link →')}
      </button>
    </form>
  )
}
