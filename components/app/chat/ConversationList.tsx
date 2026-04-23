'use client'

import { useRouter } from 'next/navigation'

export interface ConversationSummary {
  id: string
  title: string | null
  updated_at: string
}

interface ConversationListProps {
  conversations: ConversationSummary[]
  activeId: string | null
  onNew: () => void
}

export function ConversationList({ conversations, activeId, onNew }: ConversationListProps) {
  const router = useRouter()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        padding: '8px 0',
      }}
    >
      {/* New conversation button */}
      <button
        onClick={onNew}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          background: 'transparent',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          color: 'var(--almanac-accent)',
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
          fontWeight: 600,
          textAlign: 'left',
          transition: 'background 0.1s',
          margin: '0 8px',
          width: 'calc(100% - 16px)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--almanac-accent-soft)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        New conversation
      </button>

      {conversations.length > 0 && (
        <div
          style={{
            height: 1,
            background: 'var(--almanac-border-soft)',
            margin: '4px 16px',
          }}
        />
      )}

      {conversations.map(conv => {
        const isActive = conv.id === activeId
        const relativeTime = getRelativeTime(conv.updated_at)

        return (
          <button
            key={conv.id}
            onClick={() => router.push(`/chat?id=${conv.id}`)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
              padding: '10px 16px',
              background: isActive ? 'var(--almanac-brand-soft)' : 'transparent',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.1s',
              margin: '0 8px',
              width: 'calc(100% - 16px)',
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.background = 'var(--almanac-surface-alt)'
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.background = 'transparent'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: 'var(--almanac-ink)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {conv.title ?? 'Conversation'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 11,
                color: 'var(--almanac-muted)',
              }}
            >
              {relativeTime}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function getRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
