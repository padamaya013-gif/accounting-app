import { supabase } from '@/lib/supabase'
import { Invoice, InvoiceItem } from '@/types'

export const invoiceService = {
  async generateInvoiceNumber(companyId: string): Promise<string> {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    
    const { data } = await supabase
      .from('invoices')
      .select('invoice_number', { count: 'exact' })
      .eq('company_id', companyId)
      .gte('created_at', `${year}-${month}-01`)
      .lt('created_at', `${year}-${String(month).padStart(2, '0')}-32`)

    const count = (data?.length || 0) + 1
    return `INV-${year}${month}-${String(count).padStart(4, '0')}`
  },

  async createInvoice(
    invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<InvoiceItem, 'id'>[]
  ) {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
      .single()

    if (invoiceError) return { data: null, error: invoiceError }

    const itemsWithInvoiceId = items.map(item => ({
      ...item,
      invoice_id: invoiceData.id
    }))

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId)

    return { data: invoiceData, error: itemsError }
  },

  async getInvoices(companyId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async getInvoiceById(invoiceId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (*)
      `)
      .eq('id', invoiceId)
      .single()

    return { data, error }
  },

  async updateInvoice(invoiceId: string, updates: Partial<Invoice>) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', invoiceId)
      .select()
      .single()

    return { data, error }
  },

  async updateInvoiceStatus(invoiceId: string, status: 'paid' | 'unpaid' | 'overdue' | 'sent' | 'draft') {
    return await this.updateInvoice(invoiceId, { 
      status,
      updated_at: new Date().toISOString()
    })
  },

  async deleteInvoice(invoiceId: string) {
    return await supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId)
  },
}
