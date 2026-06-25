'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Settings, Bell, Building2 } from 'lucide-react'
import { useState } from 'react'
import { authService } from '@/services/auth.service'
import { Company } from '@/types'

interface DashboardHeaderProps {
  userName: string
  companyName: string
  companies: Company[]
  currentCompanyId: string
  onCompanySwitch: (companyId: string) => void
}

export default function DashboardHeader({
  userName,
  companyName,
  companies,
  currentCompanyId,
  onCompanySwitch,
}: DashboardHeaderProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)

  const handleLogout = async () => {
    await authService.signOut()
    localStorage.removeItem('user_id')
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo & Company Selector */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-xl font-bold text-white">📊</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">PERUSAHAAN</p>
              <p className="text-sm font-bold text-gray-900">{companyName}</p>
            </div>
          </div>

          {/* Company Dropdown */}
          {companies.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Building2 className="w-4 h-4" />
                Pilih Perusahaan
              </button>

              {showCompanyDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {companies.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => {
                        onCompanySwitch(comp.id)
                        setShowCompanyDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        comp.id === currentCompanyId
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {comp.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                  <Settings className="w-4 h-4" />
                  Pengaturan Akun
                </button>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
