import { NextResponse } from 'next/server'
import { markInvoiceViewed } from '@/lib/notion'
import type { ApiResponse } from '@/types'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * POST /api/invoice/[id]/view
 *
 * 클라이언트가 견적서를 최초 열람할 때 호출됩니다. (인증 불필요)
 * 실패해도 항상 200을 반환하여 페이지 렌더링에 영향을 주지 않습니다.
 */
export async function POST(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<ApiResponse<null>>> {
  const { id } = await params

  try {
    await markInvoiceViewed(id)
  } catch (error) {
    // 조용한 실패 — 열람 기록 오류가 사용자 경험에 영향 없도록 처리
    console.error('[API] 열람 기록 실패:', error)
  }

  return NextResponse.json({ success: true, data: null })
}
