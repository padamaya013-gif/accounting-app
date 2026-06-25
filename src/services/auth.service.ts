import { supabase } from '@/lib/supabase'

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    try {
      // Sign up dengan Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Store user_id in localStorage
      if (data.user) {
        localStorage.setItem('user_id', data.user.id)
        
        // Get user profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (userProfile) {
          localStorage.setItem('selected_company_id', userProfile.company_id || '')
        }
      }

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear localStorage
      localStorage.removeItem('user_id')
      localStorage.removeItem('selected_company_id')

      return { error: null }
    } catch (error: any) {
      return { error }
    }
  },

  async getCurrentUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return null

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      return userProfile
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  },

  async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  },

  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  },
}
