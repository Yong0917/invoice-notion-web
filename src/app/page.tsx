import Link from 'next/link'
import { ArrowRight, Github, Layers, Palette, Zap, Code2, BookOpen, Puzzle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SITE_CONFIG } from '@/lib/constants'

const features = [
  {
    icon: Zap,
    title: 'Next.js 15 App Router',
    description: 'React Server Components, Turbopack, 중첩 레이아웃을 완벽 지원합니다.',
    badge: 'v15',
  },
  {
    icon: Palette,
    title: 'TailwindCSS v4',
    description: 'CSS-first 방식의 최신 Tailwind. @theme 인라인 변수와 다크모드가 완전히 설정되어 있습니다.',
    badge: 'v4',
  },
  {
    icon: Layers,
    title: 'shadcn/ui',
    description: 'New York 스타일, Neutral 컬러로 구성된 컴포넌트 라이브러리. 16개 컴포넌트가 설치되어 있습니다.',
    badge: 'new-york',
  },
  {
    icon: Code2,
    title: 'TypeScript',
    description: 'strict 모드, 경로 별칭(@/*), 공통 타입 정의(NavItem, SiteConfig 등)가 포함됩니다.',
    badge: 'strict',
  },
  {
    icon: BookOpen,
    title: '커스텀 훅',
    description: 'useMediaQuery, useLocalStorage, useDebounce, useMounted 훅이 준비되어 있습니다.',
    badge: '4 hooks',
  },
  {
    icon: Puzzle,
    title: '레이아웃 시스템',
    description: 'Header, Footer, MobileNav, ThemeToggle 컴포넌트와 다크모드 토글이 구현되어 있습니다.',
    badge: 'ready',
  },
] as const

const TECH_STACK = [
  'Next.js 15',
  'React 19',
  'TypeScript',
  'TailwindCSS v4',
  'shadcn/ui',
  'lucide-react',
  'next-themes',
  'Radix UI',
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-32">
        <Badge variant="secondary" className="mb-4">
          Next.js + shadcn/ui + TailwindCSS v4
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          {SITE_CONFIG.name}
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground mb-10">
          다크모드, 커스텀 훅, 레이아웃 컴포넌트가 모두 포함된
          <br className="hidden sm:block" />
          즉시 사용 가능한 Next.js 스타터킷입니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/docs">
              시작하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link
              href={SITE_CONFIG.links.github ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">포함된 기능</h2>
          <p className="text-muted-foreground text-center mb-12">
            프로젝트를 바로 시작할 수 있는 모든 것이 준비되어 있습니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* 기술 스택 */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-8">기술 스택</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm py-1 px-3">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
