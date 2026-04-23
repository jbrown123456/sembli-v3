import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatWindow } from '@/components/app/chat/ChatWindow'
import { UpgradePrompt } from '@/components/app/chat/UpgradePrompt'
import type { Message } from '@/components/app/chat/MessageBubble'

export const metadata = { title: 'Ask Sembli' }

interface ChatPageProps {
  searchParams: Promise<{ id?: string; new?: string }>
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const supabase = await createClient()
  const params = await searchParams

  const { data: { user } } = await supabase.auth.getUser()

  // Guest mode: let unauthenticated visitors try the chat (API enforces 5-message cap)
  if (!user) {
    return (
      <ChatWindow
        homeId={null}
        initialConversationId={null}
        initialMessages={[]}
        conversations={[]}
        isPro={false}
        isGuest={true}
      />
    )
  }

  // Load subscription to gate Free tier
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('owner_id', user.id)
    .single()

  const isPro =
    subscription?.status === 'active' &&
    (subscription.plan === 'pro_monthly' || subscription.plan === 'pro_yearly')

  // Free tier: show upgrade prompt
  if (!isPro) {
    return (
      <div style={{ height: 'calc(100dvh - 60px)', display: 'flex', flexDirection: 'column' }}>
        <UpgradePrompt />
      </div>
    )
  }

  // Load user's primary home
  const { data: home } = await supabase
    .from('homes')
    .select('id')
    .eq('owner_id', user.id)
    .order('created_at')
    .limit(1)
    .single()

  if (!home) {
    redirect('/onboarding')
  }

  // Load recent conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, updated_at')
    .eq('home_id', home.id)
    .order('updated_at', { ascending: false })
    .limit(20)

  // Load messages for active conversation (if ?id= param)
  let activeConversationId: string | null = null
  let initialMessages: Message[] = []

  const requestedId = params.id
  if (requestedId && requestedId !== 'new') {
    // Verify this conversation belongs to the user
    const { data: conv } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', requestedId)
      .eq('user_id', user.id)
      .single()

    if (conv) {
      activeConversationId = conv.id

      const { data: msgs } = await supabase
        .from('messages')
        .select('id, role, content, tool_name')
        .eq('conversation_id', conv.id)
        .in('role', ['user', 'assistant'])
        .order('created_at', { ascending: true })
        .limit(100)

      initialMessages = (msgs ?? []).map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))
    }
  } else if (!requestedId && conversations && conversations.length > 0) {
    // Default: load most recent conversation
    const latest = conversations[0]
    activeConversationId = latest.id

    const { data: msgs } = await supabase
      .from('messages')
      .select('id, role, content')
      .eq('conversation_id', latest.id)
      .in('role', ['user', 'assistant'])
      .order('created_at', { ascending: true })
      .limit(100)

    initialMessages = (msgs ?? []).map(m => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
  }

  return (
    <ChatWindow
      homeId={home.id}
      initialConversationId={activeConversationId}
      initialMessages={initialMessages}
      conversations={conversations ?? []}
      isPro={isPro}
    />
  )
}
