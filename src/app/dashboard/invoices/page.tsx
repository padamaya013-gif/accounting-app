'use client'

import { useState, useEffect } from 'react'
import { Plus, Download, Eye, Edit, Trash2, Filter } from 'lucide-react'
import Link from 'next/link'
import DataTable from '@/components/Table/DataTable'
import { supabase } from '@/lib/supabase'
import { formatRupiah, formatDate } from '@/utils/formatters'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadInvoices()
  }, [filterStatus])

  const loadInvoices = async () => {
    setLoading(true)
    try {
      const companyId = localStorage.getItem('selected_company_id') || 'e1234567-1234-1234-1234-123456789001'
      
      let query = supabase
        .from('invoices')
        .select('*')
        .eq('company_id', companyId)

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setInvoices(data || [])
    } catch (error) {
      console.error('Failed to load invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'invoice_number',
      label: 'No. Invoice',
      width: '120px',
    },
    {
      key: 'client_name',
      label: 'Klien',
      width: '180px',
    },
    {
      key: 'invoice_date',
      label: 'Tanggal',
      render: (date: string) => formatDate(date),
    },
    {
      key: 'total',
      label: 'Total',
      render: (total: number) => formatRupiah(total),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium badge ${
            status === 'paid'
              ? 'badge-success'
              : status === 'unpaid'
              ? 'badge-warning'
              : 'badge-danger'
          }`}
        >
          {status === 'paid' ? 'Dibayar' : status === 'unpaid' ? 'Belum Dibayar' : 'Lewat Jatuh Tempo'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      width: '120px',
      render: (_, row) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/invoices/${row.id}`}>
            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Lihat">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  const paidCount = invoices.filter((i: any) => i.status === 'paid').length
  const unpaidCount = invoices.filter((i: any) => i.status !== 'paid').length

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
          <p className="text-gray-600 mt-1">Kelola semua invoice penjualan</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-md">
            <Plus className="w-5 h-5" />
            Invoice Baru
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <div className="flex gap-2 flex-wrap">
          {['all', 'paid', 'unpaid', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all'
                ? 'Semua'
                : status === 'paid'
                ? 'Dibayar'
                : status === 'unpaid'
                ? 'Belum Dibayar'
                : 'Lewat Jatuh Tempo'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={invoices} loading={loading} />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Invoice</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Belum Dibayar</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{unpaidCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Sudah Dibayar</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{paidCount}</p>
        </div>
      </div>
    </div>
  )
}
