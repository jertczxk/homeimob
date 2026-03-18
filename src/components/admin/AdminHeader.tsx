'use client'

import { usePathname } from 'next/navigation'
import { useAdminStore } from '@/store/admin-store'
import { Menu, Search } from 'lucide-react'
import { NotificationsDropdown } from './NotificationsDropdown'

const routeLabels: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/crm': 'CRM',
    '/admin/imoveis': 'Imóveis',
    '/admin/clientes': 'Clientes',
    '/admin/locacoes/contratos': 'Contratos',
    '/admin/locacoes/alugueis': 'Aluguéis',
    '/admin/locacoes/repasses': 'Repasses',
    '/admin/locacoes/manutencoes': 'Manutenções',
    '/admin/locacoes/vistorias': 'Vistorias',
    '/admin/vendas': 'Pipeline de Vendas',
    '/admin/vendas/captacao': 'Captação',
    '/admin/vendas/visitas': 'Visitas',
    '/admin/vendas/propostas': 'Propostas',
    '/admin/vendas/relatorios': 'Relatórios',
    '/admin/blog': 'Blog',
    '/admin/blog/novo': 'Novo Post',
    '/admin/configuracoes': 'Configurações',
}

export function AdminHeader() {
    const pathname = usePathname()
    const { toggleSidebar, sidebarOpen } = useAdminStore()

    // Build breadcrumb
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = segments.map((_, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/')
        return { path, label: routeLabels[path] || segments[i] }
    })

    const pageTitle = routeLabels[pathname] || breadcrumbs[breadcrumbs.length - 1]?.label || 'Admin'

    return (
        <header className="sticky top-0 z-30 h-16 bg-zinc-900/80 backdrop-blur-xl border-b border-white/5 flex items-center gap-4 px-6">
            {/* Mobile menu toggle */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Page Title + Breadcrumb */}
            <div className="flex-1 min-w-0">
                <h1 className="text-base font-semibold text-white truncate">{pageTitle}</h1>
                {breadcrumbs.length > 1 && (
                    <nav className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={crumb.path} className="flex items-center gap-1.5">
                                {i > 0 && <span>/</span>}
                                <span className={i === breadcrumbs.length - 1 ? 'text-zinc-300' : ''}>
                                    {crumb.label}
                                </span>
                            </span>
                        ))}
                    </nav>
                )}
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 w-64 border border-white/5 focus-within:border-accent/30 transition-colors">
                <Search className="h-4 w-4 text-zinc-500 shrink-0" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full"
                />
            </div>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                <span className="text-xs font-bold text-accent">JG</span>
            </div>
        </header>
    )
}
