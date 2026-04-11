'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PagamentoComDetalhes, StatusPagamento } from '@/types'
import { Search, Building2, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react'

const statusConfig: Record<StatusPagamento, { label: string; color: string; icon: React.ElementType }> = {
  pago: { label: 'Pago', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  pendente: { label: 'Pendente', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: Clock },
  atrasado: { label: 'Atrasado', color: 'bg-red-500/15 text-red-400 border-red-500/20', icon: AlertTriangle },
  cancelado: { label: 'Cancelado', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20', icon: XCircle },
}

export function AlugueisClient({ pagamentos }: { pagamentos: PagamentoComDetalhes[] }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<StatusPagamento | 'todos'>('todos')

  const filtered = pagamentos.filter(p => {
    const imovel = p.contrato?.imovel?.titulo ?? ''
    const inquilino = p.contrato?.inquilino?.nome ?? ''
    const matchSearch = imovel.toLowerCase().includes(search.toLowerCase()) ||
      inquilino.toLowerCase().includes(search.toLowerCase()) ||
      p.referencia.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const pagos = pagamentos.filter(p => p.status === 'pago')
  const pendentes = pagamentos.filter(p => p.status === 'pendente')
  const atrasados = pagamentos.filter(p => p.status === 'atrasado')
  const totalRecebido = pagos.reduce((acc, p) => acc + p.valor, 0)

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Pagos</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{pagos.length}</p>
        </div>
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Pendentes</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{pendentes.length}</p>
        </div>
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Atrasados</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{atrasados.length}</p>
        </div>
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Total Recebido</p>
          <p className="text-2xl font-bold text-accent mt-1">R$ {totalRecebido.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 focus-within:border-accent/30 flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-zinc-500" />
          <input type="text" placeholder="Buscar por imóvel, inquilino ou referência..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as StatusPagamento | 'todos')} className="bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 text-sm text-zinc-300 outline-none cursor-pointer">
          <option value="todos">Todos status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="atrasado">Atrasado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <p className="text-sm text-zinc-500">{filtered.length} registros</p>
      </div>

      <div className="bg-zinc-800/30 rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Imóvel</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Inquilino</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Referência</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Valor</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Vencimento</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Pagamento</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const cfg = statusConfig[p.status]
                const StatusIcon = cfg.icon
                return (
                  <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-zinc-600" />
                        <span className="text-sm text-white font-medium truncate max-w-[160px]">{p.contrato?.imovel?.titulo ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">{p.contrato?.inquilino?.nome ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-400">{p.referencia}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-white">R$ {p.valor.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{new Date(p.data_vencimento).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{p.data_pagamento ? new Date(p.data_pagamento).toLocaleDateString('pt-BR') : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1 w-fit', cfg.color)}>
                        <StatusIcon className="h-3 w-3" />{cfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-10 text-zinc-500 text-sm">Nenhum pagamento encontrado.</div>}
      </div>
    </div>
  )
}
