import Link from 'next/link'
import {
  FileText,
  Database,
  Download,
  Mail,
  CheckCircle,
  Eye,
  Bell,
  Lock,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SITE_CONFIG } from '@/lib/constants'

// 서비스 주요 기능 카드 데이터 (6개)
const features = [
  {
    icon: FileText,
    title: '견적서 웹 조회',
    description: '고유 URL을 통해 고객이 언제 어디서나 웹 브라우저에서 견적서를 확인할 수 있습니다.',
  },
  {
    icon: Database,
    title: '노션 DB 연동',
    description: '노션 데이터베이스와 실시간으로 연동되어 견적 정보가 항상 최신 상태로 유지됩니다.',
  },
  {
    icon: Download,
    title: 'PDF 다운로드',
    description: '견적서를 PDF 파일로 바로 저장할 수 있어 오프라인에서도 활용하기 편리합니다.',
  },
  {
    icon: Mail,
    title: '이메일 발송',
    description: '관리자가 고객에게 견적서 URL을 이메일로 직접 발송하여 빠르게 공유할 수 있습니다.',
  },
  {
    icon: CheckCircle,
    title: '상태 관리',
    description: '견적서 승인·거절 상태를 관리자 대시보드에서 한눈에 확인하고 업데이트할 수 있습니다.',
  },
  {
    icon: Eye,
    title: '열람 일시 추적',
    description: '고객이 견적서를 언제 처음 열람했는지 자동으로 기록하여 영업 흐름을 파악할 수 있습니다.',
  },
  {
    icon: Bell,
    title: '만료 알림',
    description: '견적서 유효기간이 다가오면 고객에게 자동으로 이메일 알림을 발송합니다.',
  },
] as const

// 서비스 동작 흐름 3단계 데이터
const steps = [
  {
    step: '01',
    title: '노션에서 작성',
    description: '노션 데이터베이스에 견적 항목을 입력하면 시스템이 자동으로 견적서를 생성합니다.',
  },
  {
    step: '02',
    title: 'URL / 이메일로 공유',
    description: '관리자 대시보드에서 고객에게 고유 링크를 이메일로 발송하거나 직접 전달합니다.',
  },
  {
    step: '03',
    title: '고객 확인 및 PDF 저장',
    description: '고객이 링크를 통해 견적서를 웹에서 확인하고, 필요 시 PDF로 다운로드합니다.',
  },
] as const

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ─── Hero 섹션 ─────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-24 md:py-36 overflow-hidden">
        {/* 배경 그라데이션 — 다크모드 자동 대응 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10
            bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.92_0_0/0.4),transparent)]
            dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.3_0_0/0.5),transparent)]"
        />

        {/* 서비스 구분 배지 */}
        <Badge variant="outline" className="mb-6 px-3 py-1 text-xs tracking-wide">
          노션 연동 견적서 서비스
        </Badge>

        {/* 메인 타이틀 */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-5">
          {SITE_CONFIG.name}
        </h1>

        {/* 부제목 */}
        <p className="max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed">
          {SITE_CONFIG.description}
        </p>
      </section>

      <Separator />

      {/* ─── 주요 기능 섹션 ────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* 섹션 헤더 */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl mb-3">
              주요 기능
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              견적서 발송부터 고객 확인까지, 영업 사이클에 필요한 기능을 한곳에서 제공합니다.
            </p>
          </div>

          {/* 기능 카드 그리드: 모바일 1열 → 태블릿 2열 → 데스크탑 3열 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.title}
                  className="group transition-shadow hover:shadow-md dark:hover:shadow-none"
                >
                  <CardHeader className="gap-3">
                    {/* 아이콘 컨테이너 */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <Icon
                        className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* ─── 작동 흐름 섹션 ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto max-w-4xl">
          {/* 섹션 헤더 */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl mb-3">
              이런 흐름으로 동작해요
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              3단계로 간단하게 견적서를 고객에게 전달하세요.
            </p>
          </div>

          {/* 단계 리스트: 모바일 세로 → 데스크탑 가로 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-start">
            {steps.map((item, index) => (
              <div key={item.step} className="flex flex-col md:items-center md:text-center">
                {/* 단계 번호 + 화살표 (데스크탑에서 마지막 요소 제외) */}
                <div className="flex items-center gap-3 mb-4 md:flex-col md:gap-2">
                  {/* 단계 번호 배지 */}
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                      border border-border bg-background text-sm font-semibold tabular-nums
                      shadow-sm"
                    aria-label={`${index + 1}단계`}
                  >
                    {item.step}
                  </span>

                  {/* 모바일: 세로 화살표 구분선 / 데스크탑: 없음 */}
                  {index < steps.length - 1 && (
                    <ArrowRight
                      className="h-4 w-4 text-muted-foreground hidden md:block rotate-0"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* 단계 설명 텍스트 */}
                <div className="md:px-2">
                  <p className="text-sm font-medium mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 관리자 링크 섹션 ──────────────────────────────────────────── */}
      <section className="py-12 px-4 text-center">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/admin" aria-label="관리자 대시보드로 이동">
            <Lock className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            관리자 대시보드
          </Link>
        </Button>
      </section>
    </div>
  )
}
