'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { VisitaVendaComDetalhes } from '@/types'
import { Plus, Calendar, Building2, User, Clock, CheckCircle, XCircle } from 'lucide-react'

type StatusVisita = 'agendada' | 'realizada' | 'cancelada'

const statusCfg: Record<StatusVisita, { label: string; color: string; icon: React.ElementType }> = {
  agendada: { label: 'Agendada', color: 'bg-blue-500/15 text-blue-400', icon: Clock },
  realizada: { label: 'Realizada', color: 'bg-emerald-500/15 text-emerald-400', icon: CheckCircle },
  cancelada: { label: 'Cancelada', color: 'bg-red-500/15 text-red-400', icon: XCircle },
}

export function VisitasVendasClient({ visitas }: { visitas: VisitaVendaComDetalhes[] }) {
  const [filterStatus, setFilterStatus] = useState<StatusVisita | 'todos'>('todos')

  const filtered = visitas.filter(v => filterStatus === 'todos' || v.status === filterStatus)

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, v) => {
    const dateStr = v.data
    if (!acc[dateStr]) acc[dateStr] = []
    acc[dateStr].push(v)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{visitas.filter(v => v.status === 'agendada').length} visitas agendadas</p>
        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
          <Plus className="h-4 w-4" />Agendar Visita
        </button>
      </div>

      <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/5 overflow-hidden w-fit">
        {(['todos', 'agendada', 'realizada', 'cancelada'] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-2 text-xs font-medium transition-colors capitalize', filterStatus === s ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}>
            {s === 'todos' ? 'Todas' : s.charAt(0).toUpperCase() + s.slice(1) + 's'}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {sortedDates.map(date => {
          const isToday = new Date(date).toDateString() === new Date().toDateString()
          const isPast = new Date(date) < new Date(new Date().toDateString())
          return (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('w-2 h-2 rounded-full', isToday ? 'bg-accent' : isPast ? 'bg-zinc-600' : 'bg-blue-400')} />
                <h3 className="text-sm font-semibold text-white">
                  {isToday ? 'Hoje' : new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                </h3>
              </div>
              <div className="space-y-2 ml-5">
                {grouped[date].map(v => {
                  const cfg = statusCfg[v.status]
                  const Ico = cfg.icon
                  return (
                    <div key={v.id} className="bg-zinc-800/30 rounded-xl border border-white/5 p-4 hover:border-accent/15 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {v.imovel?.titulo && (
                                <p className="text-sm font-semibold text-white truncate">{v.imovel.titulo}</p>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 mt-1">
                              {v.lead?.nome && <span className="flex items-center gap-1"><User className="h-3 w-3" />{v.lead.nome}</span>}
                              {v.corretor && <span>Corretor: {v.corretor}</span>}
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(v.data).toLocaleDateString('pt-BR')}</span>
                            </div>
                            {v.notas && <p className="text-xs text-zinc-500 mt-2 italic bg-white/[0.02] rounded-lg px-3 py-1.5">{v.notas}</p>}
                          </div>
                        </div>
                        <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shrink-0 ml-2', cfg.color)}>
                          <Ico className="h-3 w-3" />{cfg.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
        {sortedDates.length === 0 && (
          <div className="text-center py-10 text-zinc-500 text-sm bg-zinc-800/30 rounded-2xl border border-white/5">
            Nenhuma visita encontrada.
          </div>
        )}
      </div>
    </div>
  )
}
