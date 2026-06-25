'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'
import { supabase } from '@/lib/supabase'
import { User, Company } from '@/types'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push('/login')
          return
        }

        // Get user profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userProfile) {
          setUser(userProfile)

          // Get companies
          const { data: companiesData } = await supabase
            .from('companies')
            .select('*')

          if (companiesData) {
            setCompanies(companiesData)

            // Set default company
            if (userProfile.company_id) {
              const defaultCompany = companiesData.find(
                (c) => c.id === userProfile.company_id
              )
              if (defaultCompany) {
                setCompany(defaultCompany)
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize user:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [router])

  const handleCompanySwitch = (companyId: string) => {
    const selected = companies.find((c) => c.id === companyId)
    if (selected) {
      setCompany(selected)
      localStorage.setItem('selected_company_id', companyId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat aplikasi...</p>
        </div>
      </div>
    )
  }

  if (!user || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-medium">Gagal memuat data user</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={user.full_name || 'User'}
          companyName={company.name}
          companies={companies}
          currentCompanyId={company.id}
          onCompanySwitch={handleCompanySwitch}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
