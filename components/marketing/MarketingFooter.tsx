import Link from 'next/link'

const LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
] as const

export function MarketingFooter() {
  return (
    <footer
      className="px-6 py-8"
      style={{ borderTop: '1px solid rgba(26,24,20,0.08)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-mono text-[11px]" style={{ color: 'rgba(26,24,20,0.3)' }}>
          © 2026 Sembli
        </p>
        <nav className="flex gap-6">
          {LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-mono text-[11px] transition-colors"
              style={{ color: 'rgba(26,24,20,0.3)', textDecoration: 'none' }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
