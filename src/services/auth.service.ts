import { supabase } from '@/lib/supabase'
import { User } from '@/types'

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Auth error:', error)
        return { data: null, error }
      }

      // Get user profile
      if (data.user) {
        const userProfile = await this.getUserProfile(data.user.id)
        return { data: { ...data, profile: userProfile }, error: null }
      }

      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err }
    }
  },

  async signOut() {
    try {
      return await supabase.auth.signOut()
    } catch (err: any) {
      console.error('Sign out error:', err)
      return { error: err }
    }
  },

  async getCurrentUser() {
    try {
      const { data } = await supabase.auth.getSession()
      return data?.session?.user
    } catch (err) {
      console.error('Get current user error:', err)
      return null
    }
  },

  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Get user profile error:', error)
        return null
      }
      return data
    } catch (err) {
      console.error('User profile error:', err)
      return null
    }
  },

  async createUser(
    email: string,
    password: string,
    fullName: string,
    position: string,
    companyId: string,
    role: string = 'staff'
  ) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (authError) {
        return { data: null, error: authError }
      }

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          position,
          company_id: companyId,
          role,
          is_active: true,
        })
        .select()
        .single()

      if (profileError) {
        // Rollback auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id)
        return { data: null, error: profileError }
      }

      return { data: profileData, error: null }
    } catch (err: any) {
      return { data: null, error: err }
    }
  },

  async updateUserPassword(userId: string, newPassword: string) {
    try {
      return await supabase.auth.admin.updateUserById(userId, {
        password: newPassword,
      })
    } catch (err: any) {
      return { error: err }
    }
  },

  async getCompanyUsers(companyId: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .order('full_name')

      if (error) {
        console.error('Get company users error:', error)
        return []
      }
      return data || []
    } catch (err) {
      console.error('Company users error:', err)
      return []
    }
  },
}
