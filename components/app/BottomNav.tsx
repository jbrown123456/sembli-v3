'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H6a1 1 0 01-1-1V9.5z"
          stroke="currentColor"
          strokeWidth={active ? 2 : 1.5}
          strokeLinejoin="round"
        />
        <path d="M8 20v-7h6v7" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/chat',
    label: 'Ask',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M4 4h14a1 1 0 011 1v9a1 1 0 01-1 1H7l-4 3V5a1 1 0 011-1z"
          stroke="currentColor"
          strokeWidth={active ? 2 : 1.5}
          strokeLinejoin="round"
        />
        <path d="M8 9h6M8 12h4" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/assets',
    label: 'Assets',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect
          x="3" y="3" width="7" height="7" rx="1.5"
          stroke="currentColor" strokeWidth={active ? 2 : 1.5}
        />
        <rect
          x="12" y="3" width="7" height="7" rx="1.5"
          stroke="currentColor" strokeWidth={active ? 2 : 1.5}
        />
        <rect
          x="3" y="12" width="7" height="7" rx="1.5"
          stroke="currentColor" strokeWidth={active ? 2 : 1.5}
        />
        <rect
          x="12" y="12" width="7" height="7" rx="1.5"
          stroke="currentColor" strokeWidth={active ? 2 : 1.5}
        />
      </svg>
    ),
  },
  {
    href: '/timeline',
    label: 'Timeline',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3v16M6 6h10M6 11h10M6 16h7" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{ background: 'var(--almanac-surface)', borderTop: '1px solid var(--almanac-border-soft)' }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 pb-safe"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-4">
        {TABS.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors"
              style={{ color: active ? 'var(--almanac-ink)' : 'var(--almanac-muted)' }}
            >
              {icon(active)}
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
