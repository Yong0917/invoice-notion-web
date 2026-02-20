import { PageHeader } from '@/components/common/page-header'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Layers, Code2, BookOpen, Palette, Zap, Puzzle } from 'lucide-react'

const uiExamples = [
  {
    icon: Layers,
    title: 'Button',
    description: '다양한 스타일의 버튼 컴포넌트 예제입니다.',
    badge: 'UI',
    tags: ['default', 'outline', 'ghost', 'destructive', 'link'],
  },
  {
    icon: Palette,
    title: 'Card',
    description: '콘텐츠를 그룹화하는 카드 컴포넌트 예제입니다.',
    badge: 'UI',
    tags: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
  },
  {
    icon: Zap,
    title: 'Badge',
    description: '상태나 라벨을 표시하는 배지 컴포넌트 예제입니다.',
    badge: 'UI',
    tags: ['default', 'secondary', 'outline', 'destructive'],
  },
  {
    icon: Puzzle,
    title: 'Dialog',
    description: '모달 다이얼로그 컴포넌트 예제입니다.',
    badge: 'UI',
    tags: ['DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogFooter'],
  },
]

const hookExamples = [
  {
    icon: Code2,
    title: 'useMediaQuery',
    description: '미디어 쿼리를 감지해 반응형 UI를 구현하는 훅입니다.',
    badge: '훅',
    code: "const isMobile = useMediaQuery('(max-width: 768px)')",
  },
  {
    icon: Code2,
    title: 'useLocalStorage',
    description: '로컬 스토리지와 동기화된 상태를 관리하는 훅입니다.',
    badge: '훅',
    code: "const [theme, setTheme] = useLocalStorage('theme', 'light')",
  },
  {
    icon: Code2,
    title: 'useDebounce',
    description: '입력값을 지연 처리해 불필요한 렌더링을 줄이는 훅입니다.',
    badge: '훅',
    code: "const debouncedQuery = useDebounce(searchQuery, 300)",
  },
  {
    icon: BookOpen,
    title: 'useMounted',
    description: '컴포넌트가 클라이언트에 마운트됐는지 확인하는 훅입니다.',
    badge: '훅',
    code: "const mounted = useMounted()",
  },
]

export default function ExamplesPage() {
  return (
    <div className="flex flex-col">
      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <PageHeader
            title="예제"
            description="스타터킷에 포함된 컴포넌트와 훅의 사용 예제를 확인하세요."
            className="mb-10"
          />

          <Separator className="mb-10" />

          {/* UI 컴포넌트 예제 */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">UI 컴포넌트</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uiExamples.map((example) => {
                const Icon = example.icon
                return (
                  <Card key={example.title} className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="h-6 w-6 text-primary" />
                        <Badge variant="outline" className="text-xs">
                          {example.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <CardDescription className="mb-3">{example.description}</CardDescription>
                      {/* variant 태그 목록 */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {example.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs font-mono">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>

          <Separator className="mb-12" />

          {/* 커스텀 훅 예제 */}
          <div>
            <h2 className="text-xl font-semibold mb-6">커스텀 훅</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hookExamples.map((example) => {
                const Icon = example.icon
                return (
                  <Card key={example.title} className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="h-6 w-6 text-primary" />
                        <Badge variant="outline" className="text-xs">
                          {example.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <CardDescription className="mb-3">{example.description}</CardDescription>
                      {/* 코드 예시 */}
                      <code className="block text-xs bg-muted rounded-md px-3 py-2 font-mono text-muted-foreground">
                        {example.code}
                      </code>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
