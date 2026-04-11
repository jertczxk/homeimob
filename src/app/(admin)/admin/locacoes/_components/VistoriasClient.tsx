'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { VistoriaComDetalhes } from '@/types'
import { Search, Building2, LogIn, LogOut, RefreshCw } from 'lucide-react'

type TipoVistoria = 'entrada' | 'saida' | 'periodica'

const tipoConfig: Record<TipoVistoria, { label: string; color: string; icon: React.ElementType }> = {
  entrada: { label: 'Entrada', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: LogIn },
  saida: { label: 'Saída', color: 'bg-red-500/15 text-red-400 border-red-500/20', icon: LogOut },
  periodica: { label: 'Periódica', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', icon: RefreshCw },
}

export function VistoriasClient({ vistorias }: { vistorias: VistoriaComDetalhes[] }) {
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState<TipoVistoria | 'todos'>('todos')

  const filtered = vistorias.filter(v => {
    const imovel = v.contrato?.imovel?.titulo ?? ''
    const inquilino = v.contrato?.inquilino?.nome ?? ''
    const matchSearch = imovel.toLowerCase().includes(search.toLowerCase()) ||
      inquilino.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filterTipo === 'todos' || v.tipo === filterTipo
    return matchSearch && matchTipo
  })

  const entradas = vistorias.filter(v => v.tipo === 'entrada')
  const saidas = vistorias.filter(v => v.tipo === 'saida')
  const periodicas = vistorias.filter(v => v.tipo === 'periodica')

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Entradas</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{entradas.length}</p>
        </div>
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Saídas</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{saidas.length}</p>
        </div>
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Periódicas</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{periodicas.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 focus-within:border-accent/30 flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-zinc-500" />
          <input type="text" placeholder="Buscar por imóvel ou inquilino..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full" />
        </div>
        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value as TipoVistoria | 'todos')} className="bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 text-sm text-zinc-300 outline-none cursor-pointer">
          <option value="todos">Todos os tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="periodica">Periódica</option>
        </select>
        <p className="text-sm text-zinc-500">{filtered.length} registros</p>
      </div>

      <div className="space-y-3">
        {filtered.map(v => {
          const cfg = tipoConfig[v.tipo]
          const TipoIcon = cfg.icon
          return (
            <div key={v.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{v.contrato?.imovel?.titulo ?? '—'}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{v.contrato?.inquilino?.nome ?? '—'}</p>
                    {v.laudo && <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{v.laudo}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1', cfg.color)}>
                    <TipoIcon className="h-3 w-3" />{cfg.label}
                  </span>
                  <span className="text-xs text-zinc-500">{new Date(v.data).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-zinc-500 text-sm bg-zinc-800/30 rounded-2xl border border-white/5">
            Nenhuma vistoria encontrada.
          </div>
        )}
      </div>
    </div>
  )
}
