'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, Search, KeyRound, Building2, User, Calendar, MapPin, DollarSign, Eye, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react'

type StatusCaptacao = 'prospectando' | 'em_avaliacao' | 'autorizado' | 'recusado'

const statusCfg: Record<StatusCaptacao, { label: string; color: string }> = {
    prospectando: { label: 'Prospectando', color: 'bg-blue-500/15 text-blue-400' },
    em_avaliacao: { label: 'Em Avaliação', color: 'bg-amber-500/15 text-amber-400' },
    autorizado: { label: 'Autorizado', color: 'bg-emerald-500/15 text-emerald-400' },
    recusado: { label: 'Recusado', color: 'bg-red-500/15 text-red-400' },
}

interface CaptacaoMock {
    id: string
    endereco: string
    proprietario: string
    telefone: string
    tipo: string
    valor_estimado: number
    status: StatusCaptacao
    corretor: string
    data: string
}

const mockCaptacoes: CaptacaoMock[] = [
    { id: 'cp1', endereco: 'Rua Oscar Freire, 1200 — Jardins', proprietario: 'Pedro Mendes', telefone: '(11) 99111-2233', tipo: 'Casa', valor_estimado: 4500000, status: 'em_avaliacao', corretor: 'Ana', data: '2024-03-14' },
    { id: 'cp2', endereco: 'Av. Atlântica, 800 — Copacabana', proprietario: 'Márcia Souza', telefone: '(21) 98877-6655', tipo: 'Apartamento', valor_estimado: 6200000, status: 'prospectando', corretor: 'João', data: '2024-03-12' },
    { id: 'cp3', endereco: 'Al. Santos, 500 — Paraíso', proprietario: 'Roberto Silva', telefone: '(11) 97766-5544', tipo: 'Sala Comercial', valor_estimado: 2800000, status: 'autorizado', corretor: 'Ana', data: '2024-03-08' },
    { id: 'cp4', endereco: 'Rua Artur de Azevedo, 300 — Pinheiros', proprietario: 'Carla Monteiro', telefone: '(11) 96655-4433', tipo: 'Apartamento', valor_estimado: 1100000, status: 'recusado', corretor: 'João', data: '2024-03-05' },
]

export default function CaptacaoPage() {
    const [filterStatus, setFilterStatus] = useState<StatusCaptacao | 'todos'>('todos')

    const filtered = mockCaptacoes.filter(c => filterStatus === 'todos' || c.status === filterStatus)

    return (
        <div className="space-y-6 max-w-[1400px]">
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{mockCaptacoes.length} captações</p>
                <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
                    <Plus className="h-4 w-4" />Nova Captação
                </button>
            </div>

            <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/5 overflow-hidden w-fit">
                {(['todos', 'prospectando', 'em_avaliacao', 'autorizado', 'recusado'] as const).map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-2 text-xs font-medium transition-colors', filterStatus === s ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}>
                        {s === 'todos' ? 'Todos' : s === 'em_avaliacao' ? 'Avaliação' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
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
                            <div className="flex items-center gap-2 text-zinc-400"><MapPin className="h-3.5 w-3.5 text-zinc-600" />{c.endereco}</div>
                            <div className="flex items-center gap-2 text-zinc-400"><User className="h-3.5 w-3.5 text-zinc-600" />{c.proprietario} · {c.telefone}</div>
                            <div className="flex items-center gap-2 text-accent font-semibold"><DollarSign className="h-3.5 w-3.5" />R$ {c.valor_estimado.toLocaleString('pt-BR')}</div>
                        </div>
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[11px] text-zinc-600">
                            <span>Corretor: {c.corretor} · {new Date(c.data).toLocaleDateString('pt-BR')}</span>
                            <button className="text-zinc-500 hover:text-white transition-colors"><Eye className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
