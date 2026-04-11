import { KanbanBoard } from '@/components/admin/crm/KanbanBoard'
import { getLeads, getAllLeadInteractions } from '@/lib/supabase/queries/leads'
import { Filter, Plus } from 'lucide-react'

export const revalidate = 0

export default async function CRMPage() {
  const [leads, interactions] = await Promise.all([
    getLeads(),
    getAllLeadInteractions(),
  ])

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">{leads.length} leads no pipeline</p>
        </div>
        <div className="flex items-center gap-3">
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
        <KanbanBoard initialLeads={leads} initialInteractions={interactions} />
      </div>
    </div>
  )
}
