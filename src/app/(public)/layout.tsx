import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Toaster } from '@/components/ui/sonner'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </div>
  )
}
