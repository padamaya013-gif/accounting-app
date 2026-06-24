import { supabase } from '@/lib/supabase'
import nodemailer from 'nodemailer'

const emailTransporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_SMTP_HOST,
  port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER,
    pass: process.env.NEXT_PUBLIC_SMTP_PASS,
  },
})

export const activityLogService = {
  async createActivityLog(
    userId: string,
    companyId: string,
    documentType: string,
    documentId: string | null,
    documentNumber: string | null,
    action: string,
    oldData: any = null,
    newData: any = null,
    reason: string | null = null
  ) {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        company_id: companyId,
        document_type: documentType,
        document_id: documentId,
        document_number: documentNumber,
        action,
        old_data: oldData,
        new_data: newData,
        reason,
        created_at: new Date().toISOString(),
      })
      .select()

    if (!error) {
      await this.sendLogNotification(userId, companyId, documentType, documentNumber, action, reason)
    }

    return { data, error }
  },

  async createAuditTrail(
    userId: string,
    companyId: string,
    tableName: string,
    recordId: string,
    action: string,
    oldValues: any = null,
    newValues: any = null,
    revisionReason: string | null = null
  ) {
    // Get previous revision number
    const { data: previousAudit } = await supabase
      .from('audit_trail')
      .select('revision_number')
      .eq('record_id', recordId)
      .eq('table_name', tableName)
      .order('revision_number', { ascending: false })
      .limit(1)
      .single()

    const nextRevisionNumber = (previousAudit?.revision_number || 0) + 1

    const { data, error } = await supabase
      .from('audit_trail')
      .insert({
        user_id: userId,
        company_id: companyId,
        table_name: tableName,
        record_id: recordId,
        action,
        revision_number: nextRevisionNumber,
        old_values: oldValues,
        new_values: newValues,
        revision_reason: revisionReason,
        created_at: new Date().toISOString(),
      })
      .select()

    return { data, error }
  },

  async sendLogNotification(
    userId: string,
    companyId: string,
    documentType: string,
    documentNumber: string | null,
    action: string,
    reason: string | null
  ) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', userId)
        .single()

      const { data: managers } = await supabase
        .from('users')
        .select('email')
        .eq('company_id', companyId)
        .eq('role', 'manager')

      const managerEmails = managers?.map(m => m.email).join(', ') || ''
      const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || ''

      const emailBody = `
        <h2>Notifikasi Aktivitas Dokumen</h2>
        <p><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</p>
        <p><strong>User:</strong> ${user?.full_name} (${user?.email})</p>
        <p><strong>Tipe Dokumen:</strong> ${documentType}</p>
        <p><strong>Nomor Dokumen:</strong> ${documentNumber}</p>
        <p><strong>Aksi:</strong> ${action}</p>
        ${reason ? `<p><strong>Alasan:</strong> ${reason}</p>` : ''}
      `

      await emailTransporter.sendMail({
        from: process.env.NEXT_PUBLIC_SMTP_USER,
        to: `${managerEmails}, ${companyEmail}`,
        subject: `[LOG] ${action} - ${documentType} #${documentNumber}`,
        html: emailBody,
      })
    } catch (error) {
      console.error('Failed to send notification email:', error)
    }
  },

  async getActivityLogs(companyId: string, limit = 50) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        users:user_id (full_name, email)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit)

    return { data, error }
  },

  async getAuditTrail(recordId: string, tableName: string) {
    const { data, error } = await supabase
      .from('audit_trail')
      .select(`
        *,
        users:user_id (full_name, email)
      `)
      .eq('record_id', recordId)
      .eq('table_name', tableName)
      .order('revision_number', { ascending: true })

    return { data, error }
  },
}
