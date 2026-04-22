import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-2">Sembli</h1>
      <p className="text-sm text-muted-foreground mb-6">Phase 0 — foundations check</p>

      <div className="w-full rounded-lg border p-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Supabase</span>
          <span className={error ? 'text-red-500' : 'text-green-500'}>
            {error ? `error: ${error.message}` : '✓ connected'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Session</span>
          <span className="text-muted-foreground">
            {session ? session.user.email : 'no session (expected)'}
          </span>
        </div>
      </div>
    </main>
  )
}
