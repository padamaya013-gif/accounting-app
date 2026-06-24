import { supabase } from '@/lib/supabase'
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'

export const accountingService = {
  // Laporan Laba Rugi
  async getIncomeStatementReport(
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    // Total Pendapatan (Invoice Paid + Unpaid - Discount)
    const { data: invoices } = await supabase
      .from('invoices')
      .select('subtotal, discount_amount, tax_amount')
      .eq('company_id', companyId)
      .gte('invoice_date', startDate)
      .lte('invoice_date', endDate)

    const totalRevenue = invoices?.reduce((sum, inv) => {
      return sum + (inv.subtotal - inv.discount_amount)
    }, 0) || 0

    // Total Beban/Biaya (PO Approved)
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('company_id', companyId)
      .gte('expense_date', startDate)
      .lte('expense_date', endDate)

    const totalExpenses = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0

    const netProfit = totalRevenue - totalExpenses

    return {
      period: { startDate, endDate },
      revenue: totalRevenue,
      expenses: totalExpenses,
      netProfit,
      taxes: invoices?.reduce((sum, inv) => sum + inv.tax_amount, 0) || 0
    }
  },

  // Laporan Arus Kas
  async getCashFlowReport(
    companyId: string,
    startDate: string,
    endDate: string
  ) {
    // Uang Masuk (Invoice Paid)
    const { data: paidInvoices } = await supabase
      .from('invoices')
      .select('total')
      .eq('company_id', companyId)
      .eq('status', 'paid')
      .gte('updated_at', startDate)
      .lte('updated_at', endDate)

    const { data: income } = await supabase
      .from('income')
      .select('amount')
      .eq('company_id', companyId)
      .gte('income_date', startDate)
      .lte('income_date', endDate)

    // Uang Keluar (Expense Realized)
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('company_id', companyId)
      .gte('expense_date', startDate)
      .lte('expense_date', endDate)

    const totalIncome = (
      (paidInvoices?.reduce((sum, inv) => sum + inv.total, 0) || 0) +
      (income?.reduce((sum, inc) => sum + inc.amount, 0) || 0)
    )

    const totalOutflow = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0
    const netCashFlow = totalIncome - totalOutflow

    return {
      period: { startDate, endDate },
      inflow: totalIncome,
      outflow: totalOutflow,
      netCashFlow
    }
  },

  // Laporan Neraca (Balance Sheet)
  async getBalanceSheetReport(companyId: string) {
    // Assets
    const { data: invoices } = await supabase
      .from('invoices')
      .select('total, status')
      .eq('company_id', companyId)

    const receivables = invoices?.reduce((sum, inv) => {
      return inv.status === 'unpaid' || inv.status === 'overdue' 
        ? sum + inv.total 
        : sum
    }, 0) || 0

    const { data: incomeData } = await supabase
      .from('income')
      .select('amount')
      .eq('company_id', companyId)

    const cashOnHand = incomeData?.reduce((sum, inc) => sum + inc.amount, 0) || 0

    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('company_id', companyId)

    const totalExpenses = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0

    const totalAssets = receivables + (cashOnHand - totalExpenses)

    // Liabilities
    const { data: pos } = await supabase
      .from('purchase_orders')
      .select('total, status')
      .eq('company_id', companyId)

    const accountsPayable = pos?.reduce((sum, po) => {
      return po.status === 'pending' || po.status === 'sent'
        ? sum + po.total
        : sum
    }, 0) || 0

    const { data: taxData } = await supabase
      .from('invoices')
      .select('tax_amount')
      .eq('company_id', companyId)

    const taxPayable = taxData?.reduce((sum, inv) => sum + inv.tax_amount, 0) || 0

    const totalLiabilities = accountsPayable + taxPayable

    // Equity
    const totalEquity = totalAssets - totalLiabilities

    return {
      assets: {
        receivables,
        cashOnHand: cashOnHand - totalExpenses,
        total: totalAssets
      },
      liabilities: {
        accountsPayable,
        taxPayable,
        total: totalLiabilities
      },
      equity: totalEquity
    }
  },

  // Sisa Dana
  async getRemainingFunds(companyId: string) {
    const { data: income } = await supabase
      .from('income')
      .select('amount')
      .eq('company_id', companyId)

    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('company_id', companyId)

    const totalIncome = income?.reduce((sum, inc) => sum + inc.amount, 0) || 0
    const totalExpenses = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0

    return totalIncome - totalExpenses
  },
}
