import { Skeleton } from '@/components/ui/skeleton'

/**
 * 견적서 페이지 로딩 스켈레톤
 *
 * InvoiceView와 동일한 컨테이너 구조(mx-auto max-w-4xl space-y-8 px-4 py-8)로
 * 각 섹션을 스켈레톤으로 대체합니다.
 */
export default function InvoiceLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* 버튼 영역 — PDF 다운로드 버튼 스켈레톤 */}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* 헤더 영역 — 제목, 뱃지, 날짜 정보 스켈레톤 */}
      <div className="space-y-4">
        {/* 제목 + 상태 뱃지 행 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* 날짜 3열 그리드 — 발행일, 유효기간, 납기일 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* 테이블 영역 — 항목 목록 스켈레톤 (5행) */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ))}
      </div>

      {/* 요약 영역 — 소계, 부가세, 합계 스켈레톤 (3행) */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
          </div>
        ))}
      </div>
    </div>
  )
}
