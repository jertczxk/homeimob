'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ManutencaoComDetalhes } from '@/types'
import { Search, Plus, Building2, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react'

type StatusManutencao = 'aberta' | 'em_andamento' | 'concluida' | 'cancelada'

const statusConfig: Record<StatusManutencao, { label: string; color: string; icon: React.ElementType }> = {
  aberta: { label: 'Aberta', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', icon: Clock },
  em_andamento: { label: 'Em Andamento', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: AlertTriangle },
  concluida: { label: 'Concluída', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  cancelada: { label: 'Cancelada', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20', icon: XCircle },
}

export function ManutencoesClient({ manutencoes }: { manutencoes: ManutencaoComDetalhes[] }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<StatusManutencao | 'todos'>('todos')

  const filtered = manutencoes.filter(m => {
    const imovel = m.imovel?.titulo ?? ''
    const matchSearch = imovel.toLowerCase().includes(search.toLowerCase()) ||
      m.titulo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || m.status === filterStatus
    return matchSearch && matchStatus
  })

  const abertas = manutencoes.filter(m => m.status === 'aberta')
  const emAndamento = manutencoes.filter(m => m.status === 'em_andamento')
  const concluidas = manutencoes.filter(m => m.status === 'concluida')
  const custoTotal = concluidas.reduce((acc, m) => acc + (m.custo ?? 0), 0)

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Abertas</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{abertas.length}</p>
        </div>
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Em Andamento</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{emAndamento.length}</p>
        </div>
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Concluídas</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{concluidas.length}</p>
        </div>
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Custo Total</p>
          <p className="text-2xl font-bold text-white mt-1">R$ {custoTotal.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 focus-within:border-accent/30 flex-1 min-w-[200px] max-w-md">
            <Search className="h-4 w-4 text-zinc-500" />
            <input type="text" placeholder="Buscar por imóvel ou título..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as StatusManutencao | 'todos')} className="bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 text-sm text-zinc-300 outline-none cursor-pointer">
            <option value="todos">Todos status</option>
            <option value="aberta">Aberta</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
          <Plus className="h-4 w-4" />Nova Manutenção
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map(m => {
          const cfg = statusConfig[m.status]
          const StatusIcon = cfg.icon
          return (
            <div key={m.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{m.titulo}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{m.imovel?.titulo ?? '—'}</p>
                    {m.descricao && <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{m.descricao}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1', cfg.color)}>
                    <StatusIcon className="h-3 w-3" />{cfg.label}
                  </span>
                  {m.custo != null && (
                    <span className="text-xs font-semibold text-white">R$ {m.custo.toLocaleString('pt-BR')}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                <span className="text-[10px] text-zinc-600">Aberta em {new Date(m.data_abertura).toLocaleDateString('pt-BR')}</span>
                {m.data_conclusao && (
                  <span className="text-[10px] text-zinc-600">Concluída em {new Date(m.data_conclusao).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-zinc-500 text-sm bg-zinc-800/30 rounded-2xl border border-white/5">
            Nenhuma manutenção encontrada.
          </div>
        )}
      </div>
    </div>
  )
}
