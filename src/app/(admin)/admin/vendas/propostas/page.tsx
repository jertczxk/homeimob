'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, DollarSign, Building2, User, Calendar, ArrowUp, ArrowDown, MessageSquare, CheckCircle, Clock, XCircle, Eye, Edit } from 'lucide-react'

type StatusProposta = 'aguardando' | 'contraproposta' | 'aceita' | 'recusada' | 'expirada'

const statusCfg: Record<StatusProposta, { label: string; color: string; icon: React.ElementType }> = {
    aguardando: { label: 'Aguardando', color: 'bg-amber-500/15 text-amber-400', icon: Clock },
    contraproposta: { label: 'Contraproposta', color: 'bg-blue-500/15 text-blue-400', icon: MessageSquare },
    aceita: { label: 'Aceita', color: 'bg-emerald-500/15 text-emerald-400', icon: CheckCircle },
    recusada: { label: 'Recusada', color: 'bg-red-500/15 text-red-400', icon: XCircle },
    expirada: { label: 'Expirada', color: 'bg-zinc-500/15 text-zinc-400', icon: Clock },
}

interface PropostaMock {
    id: string
    imovel: string
    comprador: string
    proprietario: string
    valor_pedido: number
    valor_oferta: number
    contraproposta: number | null
    data: string
    validade: string
    status: StatusProposta
    corretor: string
}

const mockPropostas: PropostaMock[] = [
    { id: 'p1', imovel: 'Casa Espetacular — Jardins', comprador: 'Carlos Alberto', proprietario: 'Roberto Silva', valor_pedido: 3500000, valor_oferta: 3200000, contraproposta: 3350000, data: '2024-03-15', validade: '2024-03-22', status: 'contraproposta', corretor: 'Ana' },
    { id: 'p2', imovel: 'Cobertura Duplex — Leblon', comprador: 'Luciana Costa', proprietario: 'Investimentos Globo', valor_pedido: 8900000, valor_oferta: 8200000, contraproposta: null, data: '2024-03-16', validade: '2024-03-23', status: 'aguardando', corretor: 'João' },
    { id: 'p3', imovel: 'Apt. 3 qts — Vila Madalena', comprador: 'Maria Fernanda', proprietario: 'Ana Santos', valor_pedido: 950000, valor_oferta: 900000, contraproposta: null, data: '2024-03-01', validade: '2024-03-08', status: 'aceita', corretor: 'Ana' },
    { id: 'p4', imovel: 'Sala Comercial — Faria Lima', comprador: 'Carlos Alberto', proprietario: 'Inv. Globo', valor_pedido: 2800000, valor_oferta: 2200000, contraproposta: null, data: '2024-02-25', validade: '2024-03-04', status: 'recusada', corretor: 'João' },
]

export default function PropostasPage() {
    const [filterStatus, setFilterStatus] = useState<StatusProposta | 'todos'>('todos')
    const filtered = mockPropostas.filter(p => filterStatus === 'todos' || p.status === filterStatus)

    return (
        <div className="space-y-6 max-w-[1400px]">
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{mockPropostas.filter(p => p.status === 'aguardando' || p.status === 'contraproposta').length} propostas ativas</p>
                <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
                    <Plus className="h-4 w-4" />Nova Proposta
                </button>
            </div>

            <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/5 overflow-hidden w-fit">
                {(['todos', 'aguardando', 'contraproposta', 'aceita', 'recusada'] as const).map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-2 text-xs font-medium transition-colors', filterStatus === s ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}>
                        {s === 'todos' ? 'Todas' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filtered.map(p => {
                    const cfg = statusCfg[p.status]
                    const Ico = cfg.icon
                    const desc = ((p.valor_oferta - p.valor_pedido) / p.valor_pedido) * 100
                    return (
                        <div key={p.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-accent/15 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-sm font-semibold text-white">{p.imovel}</h3>
                                        <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1', cfg.color)}>
                                            <Ico className="h-3 w-3" />{cfg.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                                        <span>Comprador: {p.comprador}</span>
                                        <span>Proprietário: {p.proprietario}</span>
                                        <span>Corretor: {p.corretor}</span>
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.data).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Values */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] text-zinc-600 uppercase font-bold">Valor Pedido</p>
                                    <p className="text-sm text-white font-semibold mt-0.5">R$ {p.valor_pedido.toLocaleString('pt-BR')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-600 uppercase font-bold">Valor Oferta</p>
                                    <p className="text-sm text-accent font-semibold mt-0.5">R$ {p.valor_oferta.toLocaleString('pt-BR')}</p>
                                    <p className={cn('text-[10px] flex items-center gap-0.5 mt-0.5', desc < 0 ? 'text-red-400' : 'text-emerald-400')}>
                                        {desc < 0 ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}{Math.abs(desc).toFixed(1)}%
                                    </p>
                                </div>
                                {p.contraproposta && (
                                    <div>
                                        <p className="text-[10px] text-zinc-600 uppercase font-bold">Contraproposta</p>
                                        <p className="text-sm text-blue-400 font-semibold mt-0.5">R$ {p.contraproposta.toLocaleString('pt-BR')}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] text-zinc-600 uppercase font-bold">Validade</p>
                                    <p className="text-sm text-zinc-400 mt-0.5">{new Date(p.validade).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
