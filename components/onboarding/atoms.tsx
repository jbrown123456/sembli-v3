// Atomic UI primitives for the Chat-first Onboarding flow.
// All styled via CSS variables from the Almanac light palette.

import { Logo } from '@/components/app/Logo';

// ─── Typography ──────────────────────────────────────────────

export function MonoLabel({
  children,
  color = 'var(--almanac-muted)',
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-jetbrains-mono)',
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color,
      }}
    >
      {children}
    </div>
  );
}

export function Cite({ n }: { n: number }) {
  return (
    <sup
      style={{
        fontFamily: 'var(--font-jetbrains-mono)',
        fontSize: 9,
        color: 'var(--almanac-accent)',
        fontWeight: 600,
        padding: '0 1px 0 2px',
      }}
    >
      [{n}]
    </sup>
  );
}

// ─── Source card ─────────────────────────────────────────────

export function SourceCard({
  n,
  title,
  snippet,
  source,
}: {
  n: number;
  title: string;
  snippet?: string;
  source: string;
}) {
  return (
    <div
      style={{
        marginTop: 8,
        padding: '9px 11px',
        border: '1px dashed var(--almanac-border)',
        borderRadius: 10,
        display: 'flex',
        gap: 9,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: 10,
          color: 'var(--almanac-accent)',
          fontWeight: 600,
          paddingTop: 2,
          flexShrink: 0,
        }}
      >
        [{n}]
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--almanac-ink)' }}>{title}</div>
        {snippet && (
          <div
            style={{
              fontSize: 11,
              color: 'var(--almanac-muted)',
              marginTop: 2,
              lineHeight: 1.4,
            }}
          >
            &ldquo;{snippet}&rdquo;
          </div>
        )}
        <div
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 9.5,
            color: 'var(--almanac-muted)',
            marginTop: 3,
            letterSpacing: '0.03em',
          }}
        >
          {source}
        </div>
      </div>
    </div>
  );
}

// ─── Chat avatars ────────────────────────────────────────────

export function SembliAvatar() {
  return (
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'var(--almanac-surface-alt)',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <Logo size={18} />
    </div>
  );
}

// ─── Chat bubbles ────────────────────────────────────────────

export function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ alignSelf: 'flex-end', maxWidth: '82%' }}>
      <div
        style={{
          background: 'var(--almanac-ink)',
          color: 'var(--almanac-bg)',
          borderRadius: '18px 18px 4px 18px',
          padding: '10px 14px',
          fontSize: 14.5,
          lineHeight: 1.45,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 8, maxWidth: '88%' }}>
      <SembliAvatar />
      <div
        style={{
          background: 'var(--almanac-surface)',
          border: '1px solid var(--almanac-border)',
          borderRadius: '4px 18px 18px 18px',
          padding: '11px 14px',
          fontSize: 14.5,
          lineHeight: 1.52,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          flex: 1,
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 9,
        padding: '9px 12px',
        background: 'var(--almanac-brand-soft)',
        borderRadius: 10,
        fontFamily: 'var(--font-fraunces)',
        fontStyle: 'italic',
        fontSize: 14.5,
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
}

export function ThinkChip({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        paddingLeft: 34,
      }}
    >
      <div style={{ display: 'flex', gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--almanac-brand-deep)',
              opacity: 0.5 + i * 0.2,
            }}
          />
        ))}
      </div>
      <MonoLabel>{children}</MonoLabel>
    </div>
  );
}

// ─── Quick-reply chip ─────────────────────────────────────────

interface QuickChipProps {
  children: React.ReactNode;
  accent?: boolean;
  onClick?: () => void;
}

export function QuickChip({ children, accent = false, onClick }: QuickChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: accent ? 'var(--almanac-ink)' : 'var(--almanac-surface)',
        color: accent ? 'var(--almanac-bg)' : 'var(--almanac-ink)',
        border: `1px solid ${accent ? 'var(--almanac-ink)' : 'var(--almanac-border)'}`,
        padding: '8px 13px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'var(--font-inter)',
        cursor: 'pointer',
        transition: 'opacity 0.15s',
      }}
    >
      {children}
    </button>
  );
}

// ─── Composer ────────────────────────────────────────────────

interface ComposerProps {
  value?: string;
  voice?: boolean;
  placeholder?: string;
  onChange?: (v: string) => void;
  onSubmit?: () => void;
}

export function Composer({
  value = '',
  voice = false,
  placeholder = 'Ask Sembli…',
  onChange,
  onSubmit,
}: ComposerProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        background: 'var(--almanac-bg)',
        borderTop: '1px solid var(--almanac-border-soft)',
        flexShrink: 0,
      }}
    >
      <button
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: 'var(--almanac-surface-alt)',
          border: '1px solid var(--almanac-border)',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          color: 'var(--almanac-ink-soft)',
          fontSize: 18,
          flexShrink: 0,
        }}
        aria-label="Attach"
      >
        +
      </button>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: 'var(--almanac-surface)',
          border: '1px solid var(--almanac-border)',
          borderRadius: 22,
          padding: '10px 14px',
          fontSize: 14.5,
          color: 'var(--almanac-ink)',
          outline: 'none',
          fontFamily: 'var(--font-inter)',
        }}
      />
      {voice ? (
        <button
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'var(--almanac-danger)',
            color: '#fff',
            border: 0,
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label="Stop recording"
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="4" y="4" width="6" height="6" rx="1" fill="#fff" />
          </svg>
        </button>
      ) : (
        <button
          onClick={onSubmit}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: value ? 'var(--almanac-ink)' : 'var(--almanac-border)',
            color: 'var(--almanac-bg)',
            border: 0,
            display: 'grid',
            placeItems: 'center',
            cursor: value ? 'pointer' : 'default',
            fontSize: 16,
            transition: 'background 0.15s',
            flexShrink: 0,
          }}
          aria-label="Send"
        >
          ↑
        </button>
      )}
    </div>
  );
}

// ─── Chat header ─────────────────────────────────────────────

export function ChatHeader({ step, badge }: { step?: string; badge?: string }) {
  return (
    <div
      style={{
        padding: '16px 18px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: '1px solid var(--almanac-border-soft)',
        flexShrink: 0,
      }}
    >
      <Logo size={32} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--almanac-ink)',
          }}
        >
          Sembli
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: 'var(--almanac-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {step ?? (
            <>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--almanac-success)',
                  display: 'inline-block',
                }}
              />
              your home&apos;s almanac
            </>
          )}
        </div>
      </div>
      {badge && (
        <div
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 10,
            color: 'var(--almanac-brand-deep)',
            background: 'var(--almanac-brand-soft)',
            padding: '4px 10px',
            borderRadius: 999,
            letterSpacing: '0.04em',
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
}
