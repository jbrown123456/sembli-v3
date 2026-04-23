import { Logo } from './Logo'
import { SignOutButton } from './SignOutButton'

interface AppHeaderProps {
  homeName?: string
  userInitials?: string
}

export function AppHeader({ homeName = 'Your home', userInitials }: AppHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 w-full"
      style={{
        background: 'var(--almanac-bg)',
        borderBottom: '1px solid var(--almanac-border-soft)',
      }}
    >
      <Logo size={28} />
      <div className="flex-1 min-w-0">
        <div
          className="text-[11px] font-medium tracking-widest uppercase truncate"
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            color: 'var(--almanac-muted)',
          }}
        >
          sembli
        </div>
        <div
          className="text-[15px] font-semibold leading-tight truncate"
          style={{
            fontFamily: 'var(--font-inter)',
            color: 'var(--almanac-ink)',
          }}
        >
          {homeName}
        </div>
      </div>

      <SignOutButton initials={userInitials} />
    </header>
  )
}
