'use client'

import { createContext, useContext, useState } from 'react'

type WaitlistState = 'idle' | 'loading' | 'success' | 'error'

interface WaitlistContextValue {
  state: WaitlistState
  message: string
  setState: (s: WaitlistState) => void
  setMessage: (m: string) => void
}

const WaitlistContext = createContext<WaitlistContextValue | null>(null)

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WaitlistState>('idle')
  const [message, setMessage] = useState('')

  return (
    <WaitlistContext.Provider value={{ state, message, setState, setMessage }}>
      {children}
    </WaitlistContext.Provider>
  )
}

export function useWaitlist() {
  const ctx = useContext(WaitlistContext)
  if (!ctx) throw new Error('useWaitlist must be used inside WaitlistProvider')
  return ctx
}
