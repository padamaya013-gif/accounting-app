import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Accounting App - Sistem Manajemen Keuangan',
  description: 'Aplikasi web akuntansi untuk mengelola keuangan perusahaan',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
