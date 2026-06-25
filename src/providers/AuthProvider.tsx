import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { authService } from '@/lib/authService'

type AuthContextValue = {
  userProfile: any | null
  selectedCompanyId: string
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const selectedCompanyId = userProfile?.company_id ?? ''

  async function refreshProfile() {
    const profile = await authService.getCurrentUser()
    setUserProfile(profile)
  }

  useEffect(() => {
    let mounted = true

    async function bootstrap() {
      try {
        await refreshProfile()
      } finally {
        if (mounted) setLoading(false)
      }
    }

    bootstrap()

    const { data: subscription } = supabase.auth.onAuthStateChange(async () => {
      // SIGNED_IN / SIGNED_OUT / USER_UPDATED
      await refreshProfile()
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      userProfile,
      selectedCompanyId,
      loading,
      signUp: authService.signUp,
      signIn: authService.signIn,
      signOut: authService.signOut,
      refreshProfile,
    }),
    [userProfile, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
