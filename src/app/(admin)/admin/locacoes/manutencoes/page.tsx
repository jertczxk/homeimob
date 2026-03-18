'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, Search, Wrench, Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react'

type StatusManutencao = 'solicitada' | 'em_andamento' | 'concluida' | 'cancelada'
type PrioridadeManutencao = 'urgente' | 'alta' | 'normal' | 'baixa'

const statusCfg: Record<StatusManutencao, { label: string; color: string }> = {
    solicitada: { label: 'Solicitada', color: 'bg-amber-500/15 text-amber-400' },
    em_andamento: { label: 'Em andamento', color: 'bg-blue-500/15 text-blue-400' },
    concluida: { label: 'Concluída', color: 'bg-emerald-500/15 text-emerald-400' },
    cancelada: { label: 'Cancelada', color: 'bg-zinc-500/15 text-zinc-400' },
}

const prioCfg: Record<PrioridadeManutencao, { label: string; color: string }> = {
    urgente: { label: 'Urgente', color: 'bg-red-500/15 text-red-400' },
    alta: { label: 'Alta', color: 'bg-orange-500/15 text-orange-400' },
    normal: { label: 'Normal', color: 'bg-blue-500/15 text-blue-400' },
    baixa: { label: 'Baixa', color: 'bg-zinc-500/15 text-zinc-400' },
}

interface ManutencaoMock {
    id: string
    imovel: string
    solicitante: string
    descricao: string
    prioridade: PrioridadeManutencao
    status: StatusManutencao
    custo: number | null
    data_abertura: string
    data_conclusao: string | null
}

const mockManutencoes: ManutencaoMock[] = [
    { id: 'm1', imovel: 'Apt. Moderno — Bela Vista', solicitante: 'Maria Fernanda', descricao: 'Vazamento na torneira da cozinha', prioridade: 'urgente', status: 'em_andamento', custo: 350, data_abertura: '2024-03-12', data_conclusao: null },
    { id: 'm2', imovel: 'Laje Corp. — Itaim Bibi', solicitante: 'Carlos Alberto', descricao: 'Ar condicionado central com defeito', prioridade: 'alta', status: 'solicitada', custo: null, data_abertura: '2024-03-15', data_conclusao: null },
    { id: 'm3', imovel: 'Apt. Moderno — Bela Vista', solicitante: 'Maria Fernanda', descricao: 'Pintura do quarto principal descascando', prioridade: 'normal', status: 'concluida', custo: 800, data_abertura: '2024-02-20', data_conclusao: '2024-03-01' },
    { id: 'm4', imovel: 'Laje Corp. — Itaim Bibi', solicitante: 'Carlos Alberto', descricao: 'Troca de lâmpadas — área comum', prioridade: 'baixa', status: 'concluida', custo: 120, data_abertura: '2024-02-10', data_conclusao: '2024-02-12' },
]

export default function ManutencoesPage() {
    const [filterStatus, setFilterStatus] = useState<StatusManutencao | 'todos'>('todos')

    const filtered = mockManutencoes.filter(m => filterStatus === 'todos' || m.status === filterStatus)
    const abertas = mockManutencoes.filter(m => m.status === 'solicitada' || m.status === 'em_andamento').length

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{abertas} manutenções em aberto</p>
                <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
                    <Plus className="h-4 w-4" />Nova Manutenção
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/5 overflow-hidden w-fit">
                {(['todos', 'solicitada', 'em_andamento', 'concluida'] as const).map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-2 text-xs font-medium transition-colors', filterStatus === s ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}>
                        {s === 'todos' ? 'Todos' : s === 'em_andamento' ? 'Em andamento' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {/* Cards */}
            <div className="space-y-3">
                {filtered.map(m => (
                    <div key={m.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-accent/15 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center shrink-0 mt-0.5">
                                    <Wrench className="h-5 w-5 text-zinc-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">{m.descricao}</h3>
                                    <p className="text-xs text-zinc-500 mt-1">{m.imovel}</p>
                                    <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-600">
                                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{m.solicitante}</span>
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(m.data_abertura).toLocaleDateString('pt-BR')}</span>
                                        {m.custo && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />R$ {m.custo.toLocaleString('pt-BR')}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md', prioCfg[m.prioridade].color)}>{prioCfg[m.prioridade].label}</span>
                                <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md', statusCfg[m.status].color)}>{statusCfg[m.status].label}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
