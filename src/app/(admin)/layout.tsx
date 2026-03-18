'use client'

import { AdminSidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ToastContainer } from '@/components/ui/Toast'
import { useAdminStore } from '@/store/admin-store'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAdminStore()
  const pathname = usePathname()
  const isCRM = pathname === '/admin/crm'

  return (
    <div className="min-h-screen bg-zinc-900 text-white dark">
      <AdminSidebar />
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]'
        )}
      >
        <AdminHeader />
        <main className={cn("p-6", isCRM && "h-[calc(100vh-64px)] overflow-hidden")}>
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
