import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          logo_url: string | null
          tax_number: string | null
          created_at: string
          updated_at: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          position: string | null
          role: string
          company_id: string | null
          is_active: boolean
          phone: string | null
          digital_signature_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          company_id: string
          client_name: string | null
          client_address: string | null
          client_email: string | null
          invoice_date: string
          due_date: string
          subtotal: number
          discount_percentage: number
          discount_amount: number
          tax_percentage: number
          tax_amount: number
          total: number
          status: string
          notes: string | null
          created_by: string
          signed_by: string | null
          created_at: string
          updated_at: string
        }
      }
      purchase_orders: {
        Row: {
          id: string
          po_number: string
          company_id: string
          vendor_name: string | null
          vendor_address: string | null
          vendor_email: string | null
          po_date: string
          project_id: string | null
          subtotal: number
          discount_percentage: number
          discount_amount: number
          tax_percentage: number
          tax_amount: number
          total: number
          status: string
          notes: string | null
          created_by: string
          approved_by: string | null
          signed_by: string | null
          created_at: string
          updated_at: string
        }
      }
      projects: {
        Row: {
          id: string
          company_id: string
          project_name: string
          project_code: string | null
          description: string | null
          start_date: string
          end_date: string | null
          budget: number | null
          status: string
          manager_id: string | null
          created_at: string
          updated_at: string
        }
      }
      expenses: {
        Row: {
          id: string
          expense_number: string
          company_id: string
          project_id: string | null
          amount: number
          category: string
          expense_date: string
          notes: string | null
          reference_po_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
      }
      income: {
        Row: {
          id: string
          income_number: string
          company_id: string
          amount: number
          source: string
          income_date: string
          notes: string | null
          reference_invoice_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          company_id: string
          document_type: string
          document_id: string | null
          document_number: string | null
          action: string
          old_data: any
          new_data: any
          reason: string | null
          ip_address: string | null
          created_at: string
        }
      }
    }
  }
}
