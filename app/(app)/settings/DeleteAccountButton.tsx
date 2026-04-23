'use client'

import { useState, useTransition } from 'react'
import { deleteAccount } from './actions'

export function DeleteAccountButton() {
  const [showModal, setShowModal] = useState(false)
  const [confirmed, setConfirmed] = useState('')
  const [isPending, startTransition] = useTransition()

  const canDelete = confirmed.toLowerCase() === 'delete'

  function handleDelete() {
    if (!canDelete) return
    startTransition(async () => {
      await deleteAccount()
    })
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '12px 16px',
          borderRadius: 12,
          border: '1px solid var(--almanac-danger)',
          background: 'transparent',
          color: 'var(--almanac-danger)',
          fontSize: 14,
          fontFamily: 'var(--font-inter)',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
        }}
      >
        Delete my account…
      </button>

      {showModal && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => !isPending && setShowModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(28,26,22,0.5)',
              zIndex: 60,
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'calc(100% - 48px)',
              maxWidth: 380,
              background: 'var(--almanac-surface)',
              border: '1px solid var(--almanac-border)',
              borderRadius: 20,
              padding: '28px 24px',
              zIndex: 70,
              boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(220,60,60,0.1)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: 16,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L2 17h16L10 2z" stroke="var(--almanac-danger)" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M10 8v4M10 14.5v.5" stroke="var(--almanac-danger)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: 22,
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: 'var(--almanac-ink)',
                margin: '0 0 10px',
              }}
            >
              Delete your account
            </h3>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: 'var(--almanac-ink-soft)',
                margin: '0 0 20px',
              }}
            >
              This permanently deletes your account, all homes, assets, and maintenance history.{' '}
              <strong style={{ color: 'var(--almanac-ink)' }}>This cannot be undone.</strong>
            </p>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontFamily: 'var(--font-jetbrains-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--almanac-muted)',
                  marginBottom: 8,
                }}
              >
                Type <strong>delete</strong> to confirm
              </label>
              <input
                type="text"
                value={confirmed}
                onChange={e => setConfirmed(e.target.value)}
                placeholder="delete"
                autoFocus
                disabled={isPending}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: `1px solid ${canDelete ? 'var(--almanac-danger)' : 'var(--almanac-border)'}`,
                  background: 'var(--almanac-bg)',
                  color: 'var(--almanac-ink)',
                  fontSize: 15,
                  fontFamily: 'var(--font-inter)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleDelete}
                disabled={!canDelete || isPending}
                style={{
                  flex: 1,
                  padding: '13px',
                  borderRadius: 12,
                  border: 0,
                  background: canDelete ? 'var(--almanac-danger)' : 'var(--almanac-border)',
                  color: canDelete ? '#fff' : 'var(--almanac-muted)',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'var(--font-inter)',
                  cursor: canDelete && !isPending ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s',
                }}
              >
                {isPending ? 'Deleting…' : 'Delete account'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                disabled={isPending}
                style={{
                  padding: '13px 18px',
                  borderRadius: 12,
                  border: '1px solid var(--almanac-border)',
                  background: 'transparent',
                  color: 'var(--almanac-ink-soft)',
                  fontSize: 14,
                  fontFamily: 'var(--font-inter)',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
