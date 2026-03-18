'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, Calendar, MapPin, Building2, User, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'

type StatusVisita = 'agendada' | 'realizada' | 'cancelada'

const statusCfg: Record<StatusVisita, { label: string; color: string; icon: React.ElementType }> = {
    agendada: { label: 'Agendada', color: 'bg-blue-500/15 text-blue-400', icon: Clock },
    realizada: { label: 'Realizada', color: 'bg-emerald-500/15 text-emerald-400', icon: CheckCircle },
    cancelada: { label: 'Cancelada', color: 'bg-red-500/15 text-red-400', icon: XCircle },
}

interface VisitaVendaMock {
    id: string
    imovel: string
    endereco: string
    comprador: string
    corretor: string
    data: string
    horario: string
    status: StatusVisita
    feedback: string | null
}

const mockVisitas: VisitaVendaMock[] = [
    { id: 'vv1', imovel: 'Casa Espetacular — Jardins', endereco: 'Rua das Flores, 123', comprador: 'Carlos Alberto', corretor: 'Ana', data: '2024-03-18', horario: '10:00', status: 'agendada', feedback: null },
    { id: 'vv2', imovel: 'Cobertura Duplex — Leblon', endereco: 'Av. Delfim Moreira, 500', comprador: 'Luciana Costa', corretor: 'João', data: '2024-03-17', horario: '14:30', status: 'agendada', feedback: null },
    { id: 'vv3', imovel: 'Casa Espetacular — Jardins', endereco: 'Rua das Flores, 123', comprador: 'Maria Fernanda', corretor: 'Ana', data: '2024-03-15', horario: '11:00', status: 'realizada', feedback: 'Gostou muito da área externa, vai conversar com cônjuge.' },
    { id: 'vv4', imovel: 'Cobertura Duplex — Leblon', endereco: 'Av. Delfim Moreira, 500', comprador: 'Roberto Silva', corretor: 'João', data: '2024-03-14', horario: '16:00', status: 'cancelada', feedback: 'Comprador desmarcou por compromisso.' },
    { id: 'vv5', imovel: 'Casa Espetacular — Jardins', endereco: 'Rua das Flores, 123', comprador: 'Carlos Alberto', corretor: 'Ana', data: '2024-03-10', horario: '09:30', status: 'realizada', feedback: 'Primeira visita, interessado em fazer proposta.' },
]

export default function VisitasVendasPage() {
    const [filterStatus, setFilterStatus] = useState<StatusVisita | 'todos'>('todos')

    const filtered = mockVisitas.filter(v => filterStatus === 'todos' || v.status === filterStatus)

    // Group by date
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
                <p className="text-sm text-zinc-500">{mockVisitas.filter(v => v.status === 'agendada').length} visitas agendadas</p>
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

            {/* Grouped by date */}
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
                                                <div className="flex items-start gap-3">
                                                    <div className="text-center pt-0.5">
                                                        <p className="text-lg font-bold text-white">{v.horario}</p>
                                                    </div>
                                                    <div className="w-px h-12 bg-white/5" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">{v.imovel}</p>
                                                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 mt-1">
                                                            <span className="flex items-center gap-1"><User className="h-3 w-3" />{v.comprador}</span>
                                                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{v.endereco}</span>
                                                            <span>Corretor: {v.corretor}</span>
                                                        </div>
                                                        {v.feedback && <p className="text-xs text-zinc-500 mt-2 italic bg-white/[0.02] rounded-lg px-3 py-1.5">{v.feedback}</p>}
                                                    </div>
                                                </div>
                                                <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shrink-0', cfg.color)}>
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
            </div>
        </div>
    )
}
