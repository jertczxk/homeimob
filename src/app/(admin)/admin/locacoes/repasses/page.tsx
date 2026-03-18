'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Search, DollarSign, ArrowRight, CheckCircle, Clock, Calendar, Download } from 'lucide-react'

interface RepasseMock {
    id: string
    referencia: string
    proprietario: string
    imovel: string
    aluguel: number
    comissao: number
    valorRepasse: number
    dataRepasse: string | null
    status: 'pendente' | 'repassado'
}

const mockRepasses: RepasseMock[] = [
    { id: 'r1', referencia: '03/2024', proprietario: 'Roberto Silva', imovel: 'Apt. Moderno — Bela Vista', aluguel: 6500, comissao: 650, valorRepasse: 5850, dataRepasse: '2024-03-12', status: 'repassado' },
    { id: 'r2', referencia: '02/2024', proprietario: 'Roberto Silva', imovel: 'Apt. Moderno — Bela Vista', aluguel: 6500, comissao: 650, valorRepasse: 5850, dataRepasse: '2024-02-12', status: 'repassado' },
    { id: 'r3', referencia: '03/2024', proprietario: 'Investimentos Globo', imovel: 'Laje Corp. — Itaim Bibi', aluguel: 25000, comissao: 2000, valorRepasse: 23000, dataRepasse: null, status: 'pendente' },
    { id: 'r4', referencia: '01/2024', proprietario: 'Roberto Silva', imovel: 'Apt. Moderno — Bela Vista', aluguel: 6500, comissao: 650, valorRepasse: 5850, dataRepasse: '2024-01-12', status: 'repassado' },
]

export default function RepassesPage() {
    const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'repassado'>('todos')

    const filtered = mockRepasses.filter(r => filterStatus === 'todos' || r.status === filterStatus)
    const totalPendente = mockRepasses.filter(r => r.status === 'pendente').reduce((s, r) => s + r.valorRepasse, 0)
    const totalComissao = mockRepasses.reduce((s, r) => s + r.comissao, 0)

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Repasses Pendentes</p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">R$ {totalPendente.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Comissão Acumulada</p>
                    <p className="text-2xl font-bold text-accent mt-1">R$ {totalComissao.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Repasses no mês</p>
                    <p className="text-2xl font-bold text-white mt-1">{mockRepasses.filter(r => r.referencia === '03/2024').length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/5 overflow-hidden">
                    {(['todos', 'pendente', 'repassado'] as const).map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-2 text-xs font-medium transition-colors capitalize', filterStatus === s ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}>{s}</button>
                    ))}
                </div>
                <button className="flex items-center gap-2 bg-white/5 text-zinc-300 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors border border-white/5 ml-auto">
                    <Download className="h-4 w-4" />Exportar
                </button>
            </div>

            {/* Cards */}
            <div className="space-y-3">
                {filtered.map(r => (
                    <div key={r.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-accent/15 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <p className="text-xs text-zinc-500 font-mono">{r.referencia}</p>
                                </div>
                                <div className="w-px h-10 bg-white/5" />
                                <div>
                                    <p className="text-sm font-semibold text-white">{r.proprietario}</p>
                                    <p className="text-xs text-zinc-500">{r.imovel}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] text-zinc-600 uppercase">Aluguel</p>
                                    <p className="text-sm text-zinc-400">R$ {r.aluguel.toLocaleString('pt-BR')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-zinc-600 uppercase">Comissão</p>
                                    <p className="text-sm text-accent font-semibold">- R$ {r.comissao.toLocaleString('pt-BR')}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-zinc-600" />
                                <div className="text-right">
                                    <p className="text-[10px] text-zinc-600 uppercase">Repasse</p>
                                    <p className="text-base text-white font-bold">R$ {r.valorRepasse.toLocaleString('pt-BR')}</p>
                                </div>
                                <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1', r.status === 'repassado' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400')}>
                                    {r.status === 'repassado' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                    {r.status === 'repassado' ? 'Repassado' : 'Pendente'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
