'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  BarChart3,
  Settings,
  Menu,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  {
    label: 'Dokumen',
    icon: FileText,
    submenu: [
      { label: 'Invoice', href: '/dashboard/invoices' },
      { label: 'Purchase Order', href: '/dashboard/purchase-orders' },
      { label: 'Quotation', href: '/dashboard/quotations' },
      { label: 'Inquiry', href: '/dashboard/inquiries' },
    ],
  },
  {
    label: 'Akuntansi',
    icon: DollarSign,
    submenu: [
      { label: 'Pemasukan', href: '/dashboard/income' },
      { label: 'Pengeluaran', href: '/dashboard/expenses' },
      { label: 'Request Dana', href: '/dashboard/fund-requests' },
      { label: 'Sisa Dana', href: '/dashboard/remaining-funds' },
    ],
  },
  {
    label: 'Laporan',
    icon: BarChart3,
    submenu: [
      { label: 'Laba Rugi', href: '/dashboard/reports/income-statement' },
      { label: 'Neraca', href: '/dashboard/reports/balance-sheet' },
      { label: 'Arus Kas', href: '/dashboard/reports/cash-flow' },
      { label: 'Dashboard', href: '/dashboard/reports/dashboard' },
    ],
  },
  {
    label: 'Aktivitas',
    icon: TrendingUp,
    href: '/dashboard/activity-logs',
  },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>

      <nav className="space-y-2 px-3">
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {item.submenu ? (
              <>
                <button
                  onClick={() =>
                    setExpandedMenu(
                      expandedMenu === item.label ? null : item.label
                    )
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span
                    className={`ml-auto transition-transform ${
                      expandedMenu === item.label ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {expandedMenu === item.label && (
                  <div className="ml-4 space-y-1">
                    {item.submenu.map((sub, subIdx) => (
                      <Link
                        key={subIdx}
                        href={sub.href}
                        className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                          pathname === sub.href
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800'
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href || '#'}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
