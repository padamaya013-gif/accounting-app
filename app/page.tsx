import Link from 'next/link'
import { ArrowRight, BarChart3, Lock, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">📊 Accounting App</div>
          <div className="flex gap-4">
            <Link href="/login">
              <button className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Login
              </button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Kelola Keuangan Bisnis Anda dengan <span className="text-blue-600">Mudah</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Platform akuntansi modern untuk mengelola invoice, pengeluaran, dan laporan keuangan dengan real-time analytics.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/login">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl">
                Mulai Sekarang
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
              title: 'Dashboard Analytics',
              desc: 'Monitor cash flow dan performa keuangan real-time dengan visualisasi data yang jelas',
            },
            {
              icon: <Lock className="w-8 h-8 text-blue-600" />,
              title: 'Keamanan Data',
              desc: 'Enkripsi end-to-end dan backup otomatis untuk melindungi data keuangan Anda',
            },
            {
              icon: <Zap className="w-8 h-8 text-blue-600" />,
              title: 'Otomasi Invoice',
              desc: 'Buat, kirim, dan kelola invoice secara otomatis dengan reminder pembayaran',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-20">
          {[
            { number: '1000+', label: 'Active Users' },
            { number: '50M+', label: 'Transactions' },
            { number: '99.9%', label: 'Uptime' },
            { number: '24/7', label: 'Support' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl font-bold text-blue-600">{stat.number}</p>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Accounting App. All rights reserved.</p>
          <p className="text-sm text-gray-500 mt-2">Made with ❤️ by Sayurbox Team</p>
        </div>
      </div>
    </div>
  )
}
