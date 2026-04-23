import { AppHeader } from '@/components/app/AppHeader'
import { BottomNav } from '@/components/app/BottomNav'
import { AskSembli } from '@/components/app/AskSembli'
import { PostHogIdentify } from '@/components/app/PostHogIdentify'
import { createClient } from '@/lib/supabase/server'

// App shell — wraps all authenticated app pages.
// Middleware (middleware.ts) handles the auth redirect before this renders.

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Read session + first home name to pass to AppHeader
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let homeName = 'Your home'
  let userInitials = '?'
  let homeId: string | undefined
  let homeYearBuilt: number | null = null
  let plan = 'free'
  let assetsCount = 0

  if (user) {
    // Load profile, home, subscription, and asset count in parallel
    const [profileRes, homeRes, subRes] = await Promise.all([
      supabase.from('profiles').select('display_name').eq('id', user.id).single(),
      supabase.from('homes').select('id, name, year_built').eq('owner_id', user.id).order('created_at').limit(1).single(),
      supabase.from('subscriptions').select('plan, status').eq('owner_id', user.id).single(),
    ])

    const name = profileRes.data?.display_name ?? user.email ?? ''
    userInitials = name
      .split(/[\s@]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s: string) => s[0].toUpperCase())
      .join('') || '?'

    if (homeRes.data) {
      homeName = homeRes.data.name
      homeId = homeRes.data.id
      homeYearBuilt = homeRes.data.year_built

      // Asset count for PostHog traits
      const { count } = await supabase
        .from('assets')
        .select('id', { count: 'exact', head: true })
        .eq('home_id', homeRes.data.id)
      assetsCount = count ?? 0
    }

    if (subRes.data?.status === 'active') {
      plan = subRes.data.plan
    }
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
        {user && (
          <PostHogIdentify
            userId={user.id}
            plan={plan}
            homesCount={homeId ? 1 : 0}
            assetsCount={assetsCount}
            homeId={homeId}
            homeName={homeName}
            homeYearBuilt={homeYearBuilt}
          />
        )}

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
