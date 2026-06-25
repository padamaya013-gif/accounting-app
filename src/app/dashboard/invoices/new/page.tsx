'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InvoiceForm from '@/components/Invoice/InvoiceForm'
import { invoiceService } from '@/services/invoice.service'

export default function NewInvoicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    setError('')

    try {
      const userId = localStorage.getItem('user_id')
      const companyId = localStorage.getItem('selected_company_id') || 'e1234567-1234-1234-1234-123456789001'

      if (!userId) {
        throw new Error('User ID not found')
      }

      const invoiceNumber = await invoiceService.generateInvoiceNumber(companyId)

      const { data, error: createError } = await invoiceService.createInvoice(
        {
          invoice_number: invoiceNumber,
          company_id: companyId,
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_address: formData.client_address,
          invoice_date: formData.invoice_date,
          due_date: formData.due_date,
          subtotal: formData.subtotal,
          discount_percentage: formData.discount_percentage,
          discount_amount: formData.discount_amount,
          tax_percentage: formData.tax_percentage,
          tax_amount: formData.tax_amount,
          total: formData.total,
          status: 'draft',
          notes: formData.notes,
          created_by: userId,
        },
        formData.items
      )

      if (createError) throw createError

      router.push('/dashboard/invoices')
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice')
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Baru</h1>
        <p className="text-gray-600 mt-1">Buat invoice penjualan baru untuk klien Anda</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8">
        <InvoiceForm
          isOpen={true}
          onClose={() => router.push('/dashboard/invoices')}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}
