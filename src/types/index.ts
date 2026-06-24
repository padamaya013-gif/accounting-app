export interface Company {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  logo_url?: string
  tax_number?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  position?: string
  role: 'admin' | 'manager' | 'staff'
  company_id?: string
  is_active: boolean
  phone?: string
  digital_signature_url?: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  company_id: string
  client_name?: string
  client_address?: string
  client_email?: string
  invoice_date: string
  due_date: string
  subtotal: number
  discount_percentage: number
  discount_amount: number
  tax_percentage: number
  tax_amount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'unpaid' | 'overdue'
  notes?: string
  created_by: string
  signed_by?: string
  items?: InvoiceItem[]
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
}

export interface PurchaseOrder {
  id: string
  po_number: string
  company_id: string
  vendor_name?: string
  vendor_address?: string
  vendor_email?: string
  po_date: string
  project_id?: string
  subtotal: number
  discount_percentage: number
  discount_amount: number
  tax_percentage: number
  tax_amount: number
  total: number
  status: 'draft' | 'sent' | 'approved' | 'paid' | 'pending'
  notes?: string
  created_by: string
  approved_by?: string
  signed_by?: string
  items?: POItem[]
  created_at: string
  updated_at: string
}

export interface POItem {
  id: string
  po_id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
}

export interface Project {
  id: string
  company_id: string
  project_name: string
  project_code?: string
  description?: string
  start_date: string
  end_date?: string
  budget?: number
  status: 'ongoing' | 'completed' | 'on_hold'
  manager_id?: string
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  expense_number: string
  company_id: string
  project_id?: string
  amount: number
  category: string
  expense_date: string
  notes?: string
  reference_po_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Income {
  id: string
  income_number: string
  company_id: string
  amount: number
  source: string
  income_date: string
  notes?: string
  reference_invoice_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  company_id: string
  document_type: string
  document_id?: string
  document_number?: string
  action: string
  old_data?: any
  new_data?: any
  reason?: string
  ip_address?: string
  created_at: string
}
