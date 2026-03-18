'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, DollarSign, Building2, User, Calendar, ArrowRight, Eye, MoreHorizontal } from 'lucide-react'

type StageVenda = 'captacao' | 'avaliacao' | 'autorizacao' | 'divulgacao' | 'visita' | 'proposta' | 'negociacao' | 'fechamento'

const stages: { key: StageVenda; label: string; color: string }[] = [
    { key: 'captacao', label: 'Captação', color: 'bg-zinc-500' },
    { key: 'avaliacao', label: 'Avaliação', color: 'bg-blue-500' },
    { key: 'autorizacao', label: 'Autorização', color: 'bg-indigo-500' },
    { key: 'divulgacao', label: 'Divulgação', color: 'bg-violet-500' },
    { key: 'visita', label: 'Visita', color: 'bg-amber-500' },
    { key: 'proposta', label: 'Proposta', color: 'bg-orange-500' },
    { key: 'negociacao', label: 'Negociação', color: 'bg-rose-500' },
    { key: 'fechamento', label: 'Fechamento', color: 'bg-emerald-500' },
]

interface VendaMock {
    id: string
    imovel: string
    proprietario: string
    comprador: string | null
    valor: number
    stage: StageVenda
    corretor: string
    updated_at: string
}

const mockVendas: VendaMock[] = [
    { id: 'vd1', imovel: 'Casa Espetacular — Jardins', proprietario: 'Roberto Silva', comprador: 'Carlos Alberto', valor: 3500000, stage: 'negociacao', corretor: 'Ana', updated_at: '2024-03-16' },
    { id: 'vd2', imovel: 'Cobertura Duplex — Leblon', proprietario: 'Investimentos Globo', comprador: 'Luciana Costa', valor: 8900000, stage: 'proposta', corretor: 'João', updated_at: '2024-03-15' },
    { id: 'vd3', imovel: 'Terreno 500m² — Alphaville', proprietario: 'Pedro Mendes', comprador: null, valor: 1200000, stage: 'divulgacao', corretor: 'Ana', updated_at: '2024-03-14' },
    { id: 'vd4', imovel: 'Sala Comercial — Faria Lima', proprietario: 'Inv. Globo', comprador: null, valor: 2800000, stage: 'captacao', corretor: 'João', updated_at: '2024-03-12' },
    { id: 'vd5', imovel: 'Apt. 3 qts — Vila Madalena', proprietario: 'Ana Santos', comprador: null, valor: 950000, stage: 'avaliacao', corretor: 'Ana', updated_at: '2024-03-11' },
]

export default function PipelineVendasPage() {
    const totalPipeline = mockVendas.reduce((s, v) => s + v.valor, 0)

    return (
        <div className="space-y-6">
            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">VGV no Pipeline</p>
                    <p className="text-2xl font-bold text-accent mt-1">R$ {(totalPipeline / 1e6).toFixed(1)}M</p>
                </div>
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Imóveis em Captação</p>
                    <p className="text-2xl font-bold text-white mt-1">{mockVendas.length}</p>
                </div>
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Propostas Ativas</p>
                    <p className="text-2xl font-bold text-white mt-1">{mockVendas.filter(v => v.stage === 'proposta' || v.stage === 'negociacao').length}</p>
                </div>
            </div>

            {/* Pipeline funnel */}
            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Funil de Vendas</h3>
                <div className="flex items-end gap-2 h-32">
                    {stages.map(st => {
                        const count = mockVendas.filter(v => v.stage === st.key).length
                        const pct = mockVendas.length > 0 ? (count / mockVendas.length) * 100 : 0
                        return (
                            <div key={st.key} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-xs font-bold text-white">{count}</span>
                                <div className="w-full rounded-t-lg transition-all" style={{ height: `${Math.max(pct * 1.2, 8)}%` }}>
                                    <div className={cn('w-full h-full rounded-t-lg opacity-60', st.color)} />
                                </div>
                                <span className="text-[9px] text-zinc-500 text-center leading-tight">{st.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Sales List */}
            <div className="space-y-3">
                {mockVendas.map(v => {
                    const stage = stages.find(s => s.key === v.stage)!
                    return (
                        <div key={v.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-accent/15 transition-colors group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn('w-2 h-10 rounded-full', stage.color)} />
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">{v.imovel}</h3>
                                        <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1">
                                            <span>Proprietário: {v.proprietario}</span>
                                            {v.comprador && <span>Comprador: {v.comprador}</span>}
                                            <span>Corretor: {v.corretor}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white">R$ {v.valor.toLocaleString('pt-BR')}</p>
                                        <p className="text-[10px] text-zinc-600">{new Date(v.updated_at).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md text-white/80', stage.color + '/20', 'border border-white/5')}>
                                        {stage.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
