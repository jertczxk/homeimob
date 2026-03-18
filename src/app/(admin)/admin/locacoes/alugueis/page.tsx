'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { StatusPagamento } from '@/types'
import {
    Search, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, XCircle,
    Download, Filter, Building2,
} from 'lucide-react'

const statusConfig: Record<StatusPagamento, { label: string; color: string; icon: React.ElementType }> = {
    pendente: { label: 'Pendente', color: 'bg-amber-500/15 text-amber-400', icon: Clock },
    pago: { label: 'Pago', color: 'bg-emerald-500/15 text-emerald-400', icon: CheckCircle },
    atrasado: { label: 'Atrasado', color: 'bg-red-500/15 text-red-400', icon: AlertTriangle },
    cancelado: { label: 'Cancelado', color: 'bg-zinc-500/15 text-zinc-400', icon: XCircle },
}

interface AluguelMock {
    id: string
    referencia: string
    imovel: string
    inquilino: string
    valor: number
    vencimento: string
    pagamento: string | null
    status: StatusPagamento
}

const mockAlugueis: AluguelMock[] = [
    { id: 'a1', referencia: '03/2024', imovel: 'Apt. Moderno — Bela Vista', inquilino: 'Maria Fernanda', valor: 6500, vencimento: '2024-03-10', pagamento: '2024-03-08', status: 'pago' },
    { id: 'a2', referencia: '03/2024', imovel: 'Laje Corp. — Itaim Bibi', inquilino: 'Carlos Alberto', valor: 25000, vencimento: '2024-03-05', pagamento: null, status: 'atrasado' },
    { id: 'a3', referencia: '04/2024', imovel: 'Apt. Moderno — Bela Vista', inquilino: 'Maria Fernanda', valor: 6500, vencimento: '2024-04-10', pagamento: null, status: 'pendente' },
    { id: 'a4', referencia: '02/2024', imovel: 'Apt. Moderno — Bela Vista', inquilino: 'Maria Fernanda', valor: 6500, vencimento: '2024-02-10', pagamento: '2024-02-10', status: 'pago' },
    { id: 'a5', referencia: '02/2024', imovel: 'Laje Corp. — Itaim Bibi', inquilino: 'Carlos Alberto', valor: 25000, vencimento: '2024-02-05', pagamento: '2024-02-04', status: 'pago' },
    { id: 'a6', referencia: '01/2024', imovel: 'Apt. Moderno — Bela Vista', inquilino: 'Maria Fernanda', valor: 6500, vencimento: '2024-01-10', pagamento: '2024-01-09', status: 'pago' },
]

export default function AlugueisPage() {
    const [filterStatus, setFilterStatus] = useState<StatusPagamento | 'todos'>('todos')
    const [search, setSearch] = useState('')

    const filtered = mockAlugueis.filter(a => {
        const matchSearch = a.imovel.toLowerCase().includes(search.toLowerCase()) || a.inquilino.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === 'todos' || a.status === filterStatus
        return matchSearch && matchStatus
    })

    const totalReceber = mockAlugueis.filter(a => a.status === 'pendente').reduce((s, a) => s + a.valor, 0)
    const totalAtrasado = mockAlugueis.filter(a => a.status === 'atrasado').reduce((s, a) => s + a.valor, 0)
    const totalRecebido = mockAlugueis.filter(a => a.status === 'pago').reduce((s, a) => s + a.valor, 0)

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">A Receber</p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">R$ {totalReceber.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Em Atraso</p>
                    <p className="text-2xl font-bold text-red-400 mt-1">R$ {totalAtrasado.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Recebido (período)</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">R$ {totalRecebido.toLocaleString('pt-BR')}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 focus-within:border-accent/30 transition-colors flex-1 min-w-[200px] max-w-md">
                    <Search className="h-4 w-4 text-zinc-500" />
                    <input type="text" placeholder="Buscar por imóvel ou inquilino..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full" />
                </div>
                <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/5 overflow-hidden">
                    {(['todos', 'pendente', 'pago', 'atrasado'] as const).map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-2 text-xs font-medium transition-colors capitalize', filterStatus === s ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}>{s}</button>
                    ))}
                </div>
                <button className="flex items-center gap-2 bg-white/5 text-zinc-300 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors border border-white/5 ml-auto">
                    <Download className="h-4 w-4" />Exportar
                </button>
            </div>

            {/* Table */}
            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Ref.</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Imóvel</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Inquilino</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Valor</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Vencimento</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Pagamento</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => {
                                const cfg = statusConfig[a.status]
                                const Ico = cfg.icon
                                return (
                                    <tr key={a.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3 text-xs text-zinc-500 font-mono">{a.referencia}</td>
                                        <td className="px-4 py-3 text-sm text-white">{a.imovel}</td>
                                        <td className="px-4 py-3 text-sm text-zinc-400">{a.inquilino}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-white">R$ {a.valor.toLocaleString('pt-BR')}</td>
                                        <td className="px-4 py-3 text-xs text-zinc-500">{new Date(a.vencimento).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-4 py-3 text-xs text-zinc-500">{a.pagamento ? new Date(a.pagamento).toLocaleDateString('pt-BR') : '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 w-fit', cfg.color)}>
                                                <Ico className="h-3 w-3" />{cfg.label}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
