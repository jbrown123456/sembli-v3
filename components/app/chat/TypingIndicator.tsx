'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 px-4">
      {/* Avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--almanac-accent)',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 9.5C2 6 4 3.5 6 3.5C8 3.5 10 6 10 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="6" cy="2.5" r="1" fill="white" />
        </svg>
      </div>
      {/* Dots */}
      <div
        style={{
          background: 'var(--almanac-surface-alt)',
          borderRadius: '18px 18px 18px 4px',
          padding: '10px 14px',
          display: 'flex',
          gap: 4,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--almanac-muted)',
              display: 'block',
              animation: 'sembliTyping 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes sembliTyping {
            0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
            30% { opacity: 1; transform: translateY(-3px); }
          }
        `}</style>
      </div>
    </div>
  )
}
