import { supabase } from '@/lib/supabase'
import { User } from '@/types'

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    return await supabase.auth.signOut()
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getSession()
    return data?.session?.user
  },

  async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) return null
    return data
  },

  async createUser(
    email: string,
    password: string,
    fullName: string,
    position: string,
    companyId: string,
    role: string = 'staff'
  ) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) return { data: null, error }

    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email,
        full_name: fullName,
        position,
        company_id: companyId,
        role,
        is_active: true,
      })

    return { data, error: insertError }
  },

  async updateUserPassword(userId: string, newPassword: string) {
    return await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    })
  },
}
