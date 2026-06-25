'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatRupiah, formatDate } from '@/utils/formatters'

interface Invoice {
  id: string
  invoice_number: string
  client_name: string
  client_email: string
  amount: number
  status: string
  created_at: string
  due_date: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: err } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false })

        if (err) throw err
        setInvoices(data || [])
      } catch (error) {
        console.error('Failed to load invoices:', error)
        setError('Gagal memuat invoices')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <a
          href="/dashboard/invoices/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Buat Invoice
        </a>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-600">Loading...</div>
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Belum ada invoice</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">No. Invoice</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Klien</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Jumlah</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tgl Invoice</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Jatuh Tempo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="text-gray-900">{invoice.client_name}</div>
                    <div className="text-xs text-gray-500">{invoice.client_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatRupiah(invoice.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.due_date)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <a
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Lihat
                      </a>
                      <button className="text-red-600 hover:underline">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
