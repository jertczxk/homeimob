'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAdminStore } from '@/store/admin-store'
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  HandCoins,
  TrendingUp,
  PenTool,
  Settings,
  ChevronLeft,
  Kanban,
  Home,
  Wrench,
  ClipboardCheck,
  Receipt,
  KeyRound,
  CalendarCheck,
  BarChart3,
  MessageSquare,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Geral',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'CRM', href: '/admin/crm', icon: Kanban },
    ],
  },
  {
    title: 'Imóveis',
    items: [
      { label: 'Imóveis', href: '/admin/imoveis', icon: Building2 },
      { label: 'Clientes', href: '/admin/clientes', icon: Users },
    ],
  },
  {
    title: 'Locações',
    items: [
      { label: 'Contratos', href: '/admin/locacoes/contratos', icon: FileText },
      { label: 'Aluguéis', href: '/admin/locacoes/alugueis', icon: HandCoins },
      { label: 'Repasses', href: '/admin/locacoes/repasses', icon: Receipt },
      { label: 'Manutenções', href: '/admin/locacoes/manutencoes', icon: Wrench },
      { label: 'Vistorias', href: '/admin/locacoes/vistorias', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Vendas',
    items: [
      { label: 'Pipeline', href: '/admin/vendas', icon: TrendingUp },
      { label: 'Captação', href: '/admin/vendas/captacao', icon: KeyRound },
      { label: 'Visitas', href: '/admin/vendas/visitas', icon: CalendarCheck },
      { label: 'Propostas', href: '/admin/vendas/propostas', icon: MessageSquare },
      { label: 'Relatórios', href: '/admin/vendas/relatorios', icon: BarChart3 },
    ],
  },
  {
    title: 'Conteúdo',
    items: [
      { label: 'Blog', href: '/admin/blog', icon: PenTool },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useAdminStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen flex flex-col border-r border-white/5 bg-zinc-950 transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-[72px]',
          // mobile: slide in/out
          'max-lg:translate-x-0',
          !sidebarOpen && 'max-lg:-translate-x-full',
        )}
      >
        {/* Logo + Collapse */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/5 shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
            {sidebarOpen ? (
              <Image
                src="/logoimob.svg"
                alt="Logo"
                width={120}
                height={32}
                className="h-7 w-auto brightness-0 invert"
              />
            ) : (
              <Image
                src="/logomob.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-7 w-7 object-contain brightness-0 invert"
              />
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform duration-300', !sidebarOpen && 'rotate-180')}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.title}>
              {sidebarOpen && (
                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-zinc-600 mb-2 px-2">
                  {group.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                          isActive
                            ? 'bg-accent/15 text-accent'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        )}
                        title={!sidebarOpen ? item.label : undefined}
                      >
                        <item.icon
                          className={cn(
                            'h-[18px] w-[18px] shrink-0',
                            isActive ? 'text-accent' : 'text-zinc-500 group-hover:text-white'
                          )}
                        />
                        {sidebarOpen && <span className="truncate">{item.label}</span>}
                        {isActive && sidebarOpen && (
                          <div className="ml-auto w-1.5 h-1.5 bg-accent rounded-full" />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/5 shrink-0">
            <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-accent transition-colors">
              <Home className="h-3.5 w-3.5" />
              Ver site público
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
