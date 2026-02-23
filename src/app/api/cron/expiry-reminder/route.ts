import { NextResponse } from 'next/server'
import { getInvoiceList } from '@/lib/notion'
import { sendExpiryReminderEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/expiry-reminder
 *
 * 매일 자정(KST) Vercel Cron Job이 호출합니다.
 * 유효기간 D-3, D-1에 해당하는 견적서의 클라이언트에게 만료 알림 이메일을 발송합니다.
 *
 * - Authorization: Bearer {CRON_SECRET} 헤더 검증 필수
 * - Vercel Hobby 플랜: 하루 1개 Cron만 허용 → D-3, D-1을 단일 핸들러에서 처리
 */
export async function GET(request: Request): Promise<NextResponse> {
  // CRON_SECRET 헤더 검증
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // 오늘 날짜 (KST 기준 자정으로 정규화)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function getDaysUntil(dateStr: string): number {
    const target = new Date(dateStr)
    target.setHours(0, 0, 0, 0)
    return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  try {
    const invoices = await getInvoiceList()

    // D-3, D-1 해당 && client_email 있는 견적서 필터링
    const targets = invoices.filter((inv) => {
      if (!inv.client_email || !inv.valid_until) return false
      const days = getDaysUntil(inv.valid_until)
      return days === 3 || days === 1
    })

    let sent = 0
    let skipped = 0

    // 개별 발송 — 실패 시 스킵하고 계속 진행
    await Promise.allSettled(
      targets.map(async (inv) => {
        const daysLeft = getDaysUntil(inv.valid_until!) as 3 | 1
        try {
          await sendExpiryReminderEmail(inv, daysLeft)
          sent++
        } catch (error) {
          console.error(
            `[Cron] 만료 알림 발송 실패 — 견적서: ${inv.invoice_number}`,
            error
          )
          skipped++
        }
      })
    )

    console.log(`[Cron] 만료 알림 완료 — 발송: ${sent}건, 실패: ${skipped}건`)

    return NextResponse.json({
      success: true,
      data: { sent, skipped, total: targets.length },
    })
  } catch (error) {
    console.error('[Cron] 만료 알림 처리 실패:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
