'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Modal from '@/components/Modal/Modal'
import { calculateInvoice } from '@/utils/calculations'
import { formatRupiah } from '@/utils/formatters'

interface InvoiceItem {
  id?: string
  description: string
  quantity: number
  unit_price: number
  amount: number
}

interface InvoiceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  loading?: boolean
}

export default function InvoiceForm({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_address: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: '',
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 0, unit_price: 0, amount: 0 },
  ])

  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const calculations = calculateInvoice(subtotal, discount, tax)

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: '', quantity: 0, unit_price: 0, amount: 0 },
    ])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleItemChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Auto-calculate amount
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].amount =
        newItems[index].quantity * newItems[index].unit_price
    }

    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const invoiceData = {
      ...formData,
      items,
      subtotal: calculations.subtotal,
      discount_percentage: discount,
      discount_amount: calculations.discountAmount,
      tax_percentage: tax,
      tax_amount: calculations.taxAmount,
      total: calculations.total,
    }

    await onSubmit(invoiceData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Invoice Baru" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Data Klien</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Klien"
              value={formData.client_name}
              onChange={(e) =>
                setFormData({ ...formData, client_name: e.target.value })
              }
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="email"
              placeholder="Email Klien"
              value={formData.client_email}
              onChange={(e) =>
                setFormData({ ...formData, client_email: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Alamat Klien"
              value={formData.client_address}
              onChange={(e) =>
                setFormData({ ...formData, client_address: e.target.value })
              }
              className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              rows={2}
            />
          </div>
        </div>

        {/* Invoice Dates */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Tanggal Invoice</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600">Tanggal Invoice</label>
              <input
                type="date"
                value={formData.invoice_date}
                onChange={(e) =>
                  setFormData({ ...formData, invoice_date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Jatuh Tempo</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">Item Invoice</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Tambah Item
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-end">
                <input
                  type="text"
                  placeholder="Deskripsi"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, 'description', e.target.value)
                  }
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, 'quantity', parseFloat(e.target.value))
                  }
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Harga"
                  value={item.unit_price}
                  onChange={(e) =>
                    handleItemChange(index, 'unit_price', parseFloat(e.target.value))
                  }
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <div className="w-24 px-3 py-2 text-sm bg-gray-50 rounded-lg font-medium">
                  {formatRupiah(item.amount)}
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Calculations */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatRupiah(calculations.subtotal)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Diskon (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Diskon</span>
            <span className="font-medium">{formatRupiah(calculations.discountAmount)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Pajak (%)</span>
            <select
              value={tax}
              onChange={(e) => setTax(parseFloat(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={0}>0%</option>
              <option value={11}>11%</option>
              <option value={12}>12%</option>
            </select>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pajak</span>
            <span className="font-medium">{formatRupiah(calculations.taxAmount)}</span>
          </div>

          <hr className="border-gray-200" />

          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-blue-600">{formatRupiah(calculations.total)}</span>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Catatan</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Tambahkan catatan atau syarat pembayaran"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
