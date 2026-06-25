'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  TrendingUp,
  DollarSign,
  FileText,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'
import { formatRupiah } from '@/utils/formatters'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

const chartData = [
  { month: 'Jan', pemasukan: 40000000, pengeluaran: 24000000 },
  { month: 'Feb', pemasukan: 30000000, pengeluaran: 13980000 },
  { month: 'Mar', pemasukan: 20000000, pengeluaran: 9800000 },
  { month: 'Apr', pemasukan: 27800000, pengeluaran: 39080000 },
  { month: 'May', pemasukan: 18900000, pengeluaran: 48000000 },
  { month: 'Jun', pemasukan: 39080000, pengeluaran: 38000000 },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      router.push('/login')
      return
    }
    
    setUser({ id: userId, name: 'Admin' })
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard Keuangan</h1>
        <p className="text-gray-600">Selamat datang kembali! Berikut ringkasan keuangan Anda.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Pemasukan */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Total Pemasukan</p>
              <p className="text-2xl font-bold text-gray-900">Rp 175.8M</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3 h-3" />
                +12.5% dari bulan lalu
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-gray-900">Rp 128.5M</p>
              <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
                <ArrowDownLeft className="w-3 h-3" />
                +8.2% dari bulan lalu
              </p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-red-600" />
            </div>
          </div>
        </div>

        {/* Sisa Dana */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Sisa Dana</p>
              <p className="text-2xl font-bold text-gray-900">Rp 47.3M</p>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3 h-3" />
                Tersedia untuk penggunaan
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        {/* Invoice Pending */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Invoice Pending</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-orange-600 flex items-center gap-1 mt-2">
                Menunggu pembayaran
              </p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-7 h-7 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pemasukan vs Pengeluaran */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pemasukan vs Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="pemasukan" fill="#3b82f6" name="Pemasukan" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pengeluaran" fill="#ef4444" name="Pengeluaran" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tren Laba Bersih */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Tren Laba Bersih</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="pemasukan"
                stroke="#10b981"
                strokeWidth={3}
                name="Laba Bersih"
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-yellow-900">Perhatian: Invoice Belum Dibayar</h3>
          <p className="text-sm text-yellow-800 mt-1">
            Ada 12 invoice dengan total Rp 8.5M yang belum dibayar dan akan jatuh tempo dalam 7 hari ke depan.
          </p>
        </div>
      </div>

      {/* Activity Recent */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          {[
            { type: 'Invoice', desc: 'INV-202401-0001 dibuat', time: '2 jam lalu', user: 'Admin' },
            { type: 'PO', desc: 'PO-202401-0015 disetujui', time: '5 jam lalu', user: 'Manager' },
            { type: 'Expense', desc: 'Pengeluaran operasional direkam', time: '1 hari lalu', user: 'Staff' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📝</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.type}</p>
                <p className="text-sm text-gray-600 mt-0.5">{activity.desc}</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>{activity.time}</p>
                <p className="text-gray-400 mt-1">oleh {activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
