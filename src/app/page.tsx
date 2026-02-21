import { FileText, Search, Download } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SITE_CONFIG } from '@/lib/constants'

// 서비스 주요 기능 안내 카드 데이터
const features = [
  {
    icon: FileText,
    title: '견적서 조회',
    description: '고유 URL을 통해 언제 어디서나 견적서를 확인할 수 있습니다.',
  },
  {
    icon: Search,
    title: '노션 연동',
    description: '노션 데이터베이스와 실시간으로 연동되어 항상 최신 정보를 제공합니다.',
  },
  {
    icon: Download,
    title: 'PDF 다운로드',
    description: '견적서를 PDF 파일로 저장해 필요할 때 활용할 수 있습니다.',
  },
] as const

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          {SITE_CONFIG.name}
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          {SITE_CONFIG.description}
        </p>
      </section>

      {/* 기능 안내 섹션 */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
