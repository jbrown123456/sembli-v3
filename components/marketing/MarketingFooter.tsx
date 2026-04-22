export function MarketingFooter() {
  return (
    <footer
      className="px-6 py-8"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-mono text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Sembli
        </p>
        <nav className="flex gap-6">
          {['Privacy', 'Terms', 'Contact'].map(item => (
            <a
              key={item}
              href="#"
              className="font-mono text-[11px] transition-colors"
              style={{ color: 'rgba(255,255,255,0.2)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
