'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Captacao } from '@/types'
import { Plus, Search, KeyRound, User, MapPin, DollarSign, Eye } from 'lucide-react'

type StatusCaptacao = 'prospectando' | 'em_avaliacao' | 'autorizado' | 'recusado'

const statusCfg: Record<StatusCaptacao, { label: string; color: string }> = {
  prospectando: { label: 'Prospectando', color: 'bg-blue-500/15 text-blue-400' },
  em_avaliacao: { label: 'Em Avaliação', color: 'bg-amber-500/15 text-amber-400' },
  autorizado: { label: 'Autorizado', color: 'bg-emerald-500/15 text-emerald-400' },
  recusado: { label: 'Recusado', color: 'bg-red-500/15 text-red-400' },
}

export function CaptacaoClient({ captacoes }: { captacoes: Captacao[] }) {
  const [filterStatus, setFilterStatus] = useState<StatusCaptacao | 'todos'>('todos')
  const [search, setSearch] = useState('')

  const filtered = captacoes.filter(c => {
    const matchSearch = c.endereco.toLowerCase().includes(search.toLowerCase()) ||
      c.proprietario.toLowerCase().includes(search.toLowerCase()) ||
      c.tipo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">{captacoes.length} captações</p>
        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
          <Plus className="h-4 w-4" />Nova Captação
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 focus-within:border-accent/30 flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-zinc-500" />
          <input type="text" placeholder="Buscar por endereço, proprietário ou tipo..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full" />
        </div>
        <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/5 overflow-hidden">
          {(['todos', 'prospectando', 'em_avaliacao', 'autorizado', 'recusado'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-2 text-xs font-medium transition-colors', filterStatus === s ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}>
              {s === 'todos' ? 'Todos' : s === 'em_avaliacao' ? 'Avaliação' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-accent/15 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <KeyRound className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{c.tipo}</p>
                  <p className="text-[10px] text-zinc-500 uppercase">Captação</p>
                </div>
              </div>
              <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md', statusCfg[c.status].color)}>{statusCfg[c.status].label}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-zinc-400"><MapPin className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" /><span className="truncate">{c.endereco}</span></div>
              <div className="flex items-center gap-2 text-zinc-400"><User className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" />{c.proprietario} · {c.telefone}</div>
              <div className="flex items-center gap-2 text-accent font-semibold"><DollarSign className="h-3.5 w-3.5" />R$ {c.valor_estimado.toLocaleString('pt-BR')}</div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[11px] text-zinc-600">
              <span>{c.corretor ? `Corretor: ${c.corretor} · ` : ''}{new Date(c.data).toLocaleDateString('pt-BR')}</span>
              <button className="text-zinc-500 hover:text-white transition-colors"><Eye className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-10 text-zinc-500 text-sm bg-zinc-800/30 rounded-2xl border border-white/5">
          Nenhuma captação encontrada.
        </div>
      )}
    </div>
  )
}
