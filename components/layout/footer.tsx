import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'

/**
 * 사이트 푸터 컴포넌트 (Server Component)
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {SITE_CONFIG.links.github && (
            <Link
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}
