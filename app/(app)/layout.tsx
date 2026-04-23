import { AppHeader } from '@/components/app/AppHeader'
import { BottomNav } from '@/components/app/BottomNav'
import { AskSembli } from '@/components/app/AskSembli'
import { createClient } from '@/lib/supabase/server'

// App shell — wraps all authenticated app pages.
// Middleware (middleware.ts) handles the auth redirect before this renders.

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Read session + first home name to pass to AppHeader
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let homeName = 'Your home'
  let userInitials = '?'

  if (user) {
    // Derive initials from display_name or email
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    const name = profile?.display_name ?? user.email ?? ''
    userInitials = name
      .split(/[\s@]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s: string) => s[0].toUpperCase())
      .join('') || '?'

    // First home name
    const { data: home } = await supabase
      .from('homes')
      .select('name')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (home?.name) homeName = home.name
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--almanac-ink)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          minHeight: '100dvh',
          background: 'var(--almanac-bg)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <AppHeader homeName={homeName} userInitials={userInitials} />

        {/* Scrollable page content — padded for bottom nav + FAB */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: 140, // bottom nav (76px) + FAB (48px) + gap
          }}
        >
          {children}
        </main>

        <AskSembli />
        <BottomNav />
      </div>
    </div>
  )
}
