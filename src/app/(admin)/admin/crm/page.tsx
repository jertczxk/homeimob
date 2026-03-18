'use client'

import { KanbanBoard } from '@/components/admin/crm/KanbanBoard'
import { useAdminStore } from '@/store/admin-store'
import { Filter, Plus, Search } from 'lucide-react'
import { useState } from 'react'

export default function CRMPage() {
    const { leads } = useAdminStore()
    const [search, setSearch] = useState('')

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-zinc-500">{leads.length} leads no pipeline</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 focus-within:border-accent/30 transition-colors">
                        <Search className="h-4 w-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Buscar lead..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-40"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-white/5 text-zinc-300 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors border border-white/5">
                        <Filter className="h-4 w-4" />
                        Filtros
                    </button>
                    <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors">
                        <Plus className="h-4 w-4" />
                        Novo Lead
                    </button>
                </div>
            </div>

            {/* Kanban */}
            <div className="flex-1 min-h-0">
                <KanbanBoard />
            </div>
        </div>
    )
}
