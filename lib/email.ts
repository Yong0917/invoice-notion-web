/**
 * 이메일 발송 헬퍼
 *
 * Resend SDK를 사용하여 견적서 발송 및 만료 알림 이메일을 발송합니다.
 *
 * 필수 환경 변수:
 * - RESEND_API_KEY: Resend API 키
 * - EMAIL_FROM: 발신자 이메일 (Resend에서 인증된 도메인)
 * - NEXT_PUBLIC_APP_URL: 앱 기본 URL (이메일 내 링크용)
 */

import { Resend } from 'resend'
import { render } from '@react-email/render'
import { InvoiceEmailTemplate } from '@/components/email/InvoiceEmailTemplate'
import { ExpiryReminderEmailTemplate } from '@/components/email/ExpiryReminderEmailTemplate'
import type { Invoice } from '@/types/invoice'

// ─── Resend 클라이언트 싱글톤 ─────────────────────────────────────────
let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('환경 변수가 설정되지 않았습니다: RESEND_API_KEY')
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

// ─── 공개 API ────────────────────────────────────────────────────────

/**
 * 견적서 이메일을 클라이언트에게 발송합니다.
 * @param invoice 견적서 데이터 (client_email 필수)
 * @param senderCompany 발신자 회사명 (이메일 본문에 표시)
 */
export async function sendInvoiceEmail(
  invoice: Invoice,
  senderCompany: string
): Promise<void> {
  if (!invoice.client_email) {
    throw new Error('클라이언트 이메일이 설정되지 않았습니다.')
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const html = await render(
    InvoiceEmailTemplate({ invoice, senderCompany, appUrl })
  )

  const resend = getResendClient()
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: invoice.client_email,
    subject: `[견적서] ${invoice.invoice_number} - ${invoice.client_name} 앞`,
    html,
  })

  if (error) {
    throw new Error(`이메일 발송 실패: ${error.message}`)
  }
}

/**
 * 견적서 유효기간 만료 알림 이메일을 클라이언트에게 발송합니다.
 * @param invoice 견적서 데이터 (client_email 필수)
 * @param daysLeft 만료까지 남은 일수 (3 또는 1)
 */
export async function sendExpiryReminderEmail(
  invoice: Invoice,
  daysLeft: 3 | 1
): Promise<void> {
  if (!invoice.client_email) {
    throw new Error('클라이언트 이메일이 설정되지 않았습니다.')
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const html = await render(
    ExpiryReminderEmailTemplate({ invoice, daysLeft, appUrl })
  )

  const resend = getResendClient()
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: invoice.client_email,
    subject: `[만료 예정] 견적서 ${invoice.invoice_number}이 D-${daysLeft} 만료됩니다`,
    html,
  })

  if (error) {
    throw new Error(`만료 알림 이메일 발송 실패: ${error.message}`)
  }
}
