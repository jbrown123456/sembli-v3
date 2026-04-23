'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';

// Floating "Ask Sembli" pill — fixed above the bottom nav on all (app) pages.
// Hidden on /chat itself since the full chat is already open.

export function AskSembli() {
  const pathname = usePathname();
  if (pathname === '/chat') return null;

  return (
    <div className="fixed bottom-[76px] left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-[430px] flex justify-center px-6">
      <Link
        href="/chat?new=1"
        className="pointer-events-auto flex items-center gap-2.5 px-5 py-3 rounded-full shadow-lg transition-opacity hover:opacity-90 active:scale-95"
        style={{
          background: 'var(--almanac-ink)',
          color: 'var(--almanac-bg)',
          boxShadow: '0 4px 20px rgba(28, 26, 22, 0.18), 0 1px 4px rgba(28, 26, 22, 0.12)',
        }}
      >
        <Logo size={16} color="var(--almanac-bg)" />
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Ask Sembli
        </span>
        <span className="text-xs opacity-50 ml-0.5">↑</span>
      </Link>
    </div>
  );
}
