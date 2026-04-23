// Chat — full-screen Sembli conversation. Stub for Task 07.

export const metadata = { title: 'Ask Sembli' };

export default function ChatPage() {
  return (
    <div
      style={{
        height: 'calc(100dvh - 120px)', // subtract header
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 18px',
        color: 'var(--almanac-ink)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--almanac-surface-alt)',
          display: 'grid',
          placeItems: 'center',
          marginBottom: 16,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M4 4h14a1 1 0 011 1v9a1 1 0 01-1 1H7l-4 3V5a1 1 0 011-1z"
            stroke="var(--almanac-ink)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--almanac-muted)',
          marginBottom: 8,
        }}
      >
        Coming in Task 07
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 24,
          fontWeight: 400,
          letterSpacing: '-0.03em',
          margin: 0,
        }}
      >
        Ask Sembli anything
        <br />
        <span style={{ fontStyle: 'italic', color: 'var(--almanac-brand-deep)' }}>
          about the house.
        </span>
      </h2>
      <p
        style={{
          marginTop: 12,
          fontSize: 14,
          lineHeight: 1.55,
          color: 'var(--almanac-ink-soft)',
          maxWidth: 280,
        }}
      >
        Full AI chat wires in once auth + data model + Claude API are connected.
      </p>
    </div>
  );
}
