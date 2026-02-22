import { auth } from '@/auth'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Toaster } from '@/components/ui/sonner'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const adminEmail = session?.user?.email ?? ''

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AdminHeader email={adminEmail} />
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
