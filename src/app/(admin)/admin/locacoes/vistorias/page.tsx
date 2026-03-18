'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, ClipboardCheck, Calendar, Camera, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

type StatusVistoria = 'agendada' | 'realizada' | 'pendente_laudo'
type TipoVistoria = 'entrada' | 'saida' | 'periodica'

const statusCfg: Record<StatusVistoria, { label: string; color: string }> = {
    agendada: { label: 'Agendada', color: 'bg-blue-500/15 text-blue-400' },
    realizada: { label: 'Realizada', color: 'bg-emerald-500/15 text-emerald-400' },
    pendente_laudo: { label: 'Laudo Pendente', color: 'bg-amber-500/15 text-amber-400' },
}

const tipoCfg: Record<TipoVistoria, { label: string; color: string }> = {
    entrada: { label: 'Entrada', color: 'text-blue-400' },
    saida: { label: 'Saída', color: 'text-purple-400' },
    periodica: { label: 'Periódica', color: 'text-zinc-400' },
}

interface VistoriaMock {
    id: string
    imovel: string
    tipo: TipoVistoria
    data: string
    responsavel: string
    status: StatusVistoria
    fotos: number
    observacoes: string | null
}

const mockVistorias: VistoriaMock[] = [
    { id: 'v1', imovel: 'Apt. Moderno — Bela Vista', tipo: 'entrada', data: '2024-01-14', responsavel: 'Ana', status: 'realizada', fotos: 42, observacoes: 'Imóvel em bom estado geral' },
    { id: 'v2', imovel: 'Laje Corp. — Itaim Bibi', tipo: 'periodica', data: '2024-03-20', responsavel: 'João', status: 'agendada', fotos: 0, observacoes: null },
    { id: 'v3', imovel: 'Apt. Moderno — Bela Vista', tipo: 'periodica', data: '2024-03-10', responsavel: 'Ana', status: 'pendente_laudo', fotos: 28, observacoes: 'Identificado desgaste no piso da sala' },
    { id: 'v4', imovel: 'Laje Corp. — Itaim Bibi', tipo: 'entrada', data: '2023-06-01', responsavel: 'Ana', status: 'realizada', fotos: 56, observacoes: 'Instalações e acabamentos OK' },
]

export default function VistoriasPage() {
    const [filterStatus, setFilterStatus] = useState<StatusVistoria | 'todos'>('todos')

    const filtered = mockVistorias.filter(v => filterStatus === 'todos' || v.status === filterStatus)

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{mockVistorias.length} vistorias registradas</p>
                <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
                    <Plus className="h-4 w-4" />Nova Vistoria
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/5 overflow-hidden w-fit">
                {(['todos', 'agendada', 'realizada', 'pendente_laudo'] as const).map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-2 text-xs font-medium transition-colors', filterStatus === s ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}>
                        {s === 'todos' ? 'Todos' : s === 'pendente_laudo' ? 'Laudo Pendente' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                {filtered.map((v, i) => (
                    <div key={v.id} className="flex gap-4">
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center pt-1.5">
                            <div className={cn('w-3 h-3 rounded-full shrink-0', v.status === 'realizada' ? 'bg-emerald-400' : v.status === 'agendada' ? 'bg-blue-400' : 'bg-amber-400')} />
                            {i < filtered.length - 1 && <div className="w-px flex-1 bg-white/5 mt-2" />}
                        </div>

                        {/* Card */}
                        <div className="flex-1 bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-accent/15 transition-colors mb-1">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-semibold text-white">{v.imovel}</h3>
                                        <span className={cn('text-[10px] font-bold', tipoCfg[v.tipo].color)}>• {tipoCfg[v.tipo].label}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[11px] text-zinc-500 mt-2">
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(v.data).toLocaleDateString('pt-BR')}</span>
                                        <span>Responsável: {v.responsavel}</span>
                                        {v.fotos > 0 && <span className="flex items-center gap-1"><Camera className="h-3 w-3" />{v.fotos} fotos</span>}
                                    </div>
                                    {v.observacoes && <p className="text-xs text-zinc-500 mt-2 italic">{v.observacoes}</p>}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md', statusCfg[v.status].color)}>{statusCfg[v.status].label}</span>
                                    {v.status === 'realizada' && (
                                        <button className="flex items-center gap-1 bg-white/5 text-zinc-300 px-2 py-1 rounded text-[10px] hover:bg-white/10 transition-colors">
                                            <FileText className="h-3 w-3" />Laudo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
