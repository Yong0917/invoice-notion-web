import { PageHeader } from '@/components/common/page-header'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FolderOpen, Settings, Layers, Code2, BookOpen, Puzzle } from 'lucide-react'

const sections = [
  {
    icon: FolderOpen,
    title: '프로젝트 구조',
    description: 'App Router 기반의 디렉토리 구조와 각 폴더의 역할을 설명합니다.',
    badge: '구조',
    content: [
      'app/ — Next.js App Router 페이지 및 레이아웃',
      'components/ui/ — shadcn/ui 컴포넌트',
      'components/common/ — 공통 레이아웃 컴포넌트',
      'hooks/ — 커스텀 React 훅',
      'lib/ — 유틸리티 함수 및 상수',
      'types/ — 공통 TypeScript 타입 정의',
    ],
  },
  {
    icon: Settings,
    title: '환경 설정',
    description: '프로젝트를 시작하기 위한 환경 변수 및 기본 설정 방법입니다.',
    badge: '설정',
    content: [
      'NEXT_PUBLIC_APP_URL — 앱 기본 URL 설정',
      'next.config.ts — Next.js 빌드 설정',
      'tailwind.config — TailwindCSS v4 테마 설정',
      'tsconfig.json — TypeScript strict 모드 및 경로 별칭',
    ],
  },
  {
    icon: Layers,
    title: '컴포넌트 사용법',
    description: 'shadcn/ui 컴포넌트와 공통 컴포넌트의 사용 방법을 안내합니다.',
    badge: '컴포넌트',
    content: [
      'Button — 다양한 variant(default, outline, ghost 등) 지원',
      'Card — 콘텐츠 카드 레이아웃',
      'Badge — 라벨 및 상태 표시',
      'PageHeader — 페이지 상단 헤더 공통 컴포넌트',
    ],
  },
  {
    icon: Code2,
    title: '커스텀 훅',
    description: '프로젝트에 포함된 커스텀 훅의 사용법을 설명합니다.',
    badge: '훅',
    content: [
      'useMediaQuery — 미디어 쿼리 반응형 감지',
      'useLocalStorage — 로컬 스토리지 상태 관리',
      'useDebounce — 입력 디바운스 처리',
      'useMounted — 클라이언트 마운트 여부 확인',
    ],
  },
  {
    icon: BookOpen,
    title: '다크모드',
    description: 'next-themes를 활용한 다크모드 구현 방식입니다.',
    badge: '테마',
    content: [
      'ThemeProvider — app/providers.tsx에서 전역 설정',
      'ThemeToggle — 헤더에서 토글 버튼 제공',
      'CSS 변수 — TailwindCSS v4 @theme 인라인 방식 사용',
    ],
  },
  {
    icon: Puzzle,
    title: '레이아웃 시스템',
    description: '헤더, 푸터, 모바일 네비게이션 구조를 설명합니다.',
    badge: '레이아웃',
    content: [
      'Header — 데스크탑 네비게이션 및 다크모드 토글',
      'MobileNav — 모바일 Sheet 기반 드로어 메뉴',
      'Footer — 사이트 하단 정보',
      'RootLayout — app/layout.tsx에서 전체 래핑',
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="flex flex-col">
      {/* 페이지 헤더 */}
      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <PageHeader
            title="문서"
            description="Claude Next Starters 스타터킷의 구조와 사용법을 확인하세요."
            className="mb-10"
          />

          <Separator className="mb-10" />

          {/* 섹션 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card key={section.title} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {section.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="mb-3">{section.description}</CardDescription>
                    {/* 상세 항목 목록 */}
                    <ul className="space-y-1 mt-2">
                      {section.content.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
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
