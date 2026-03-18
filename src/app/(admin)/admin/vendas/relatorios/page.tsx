'use client'

import { cn } from '@/lib/utils'
import { BarChart3, TrendingUp, DollarSign, Building2, Users, Calendar, ArrowUp, ArrowDown, Download } from 'lucide-react'

// Mock report data
const kpis = [
    { label: 'VGV Vendido (trimestre)', value: 'R$ 4.45M', change: 18, icon: DollarSign },
    { label: 'Imóveis Vendidos', value: '3', change: 50, icon: Building2 },
    { label: 'Ticket Médio', value: 'R$ 1.48M', change: 12, icon: TrendingUp },
    { label: 'Tempo Médio de Venda', value: '63 dias', change: -15, icon: Calendar },
]

const corretores = [
    { nome: 'Ana Silva', vendas: 5, vgv: 12500000, comissao: 375000, taxa_conversao: 42 },
    { nome: 'João Mendes', vendas: 3, vgv: 8700000, comissao: 261000, taxa_conversao: 35 },
]

const vendas_mensal = [
    { mes: 'Out', valor: 1200000 },
    { mes: 'Nov', valor: 950000 },
    { mes: 'Dez', valor: 2300000 },
    { mes: 'Jan', valor: 1800000 },
    { mes: 'Fev', valor: 3500000 },
    { mes: 'Mar', valor: 4450000 },
]

const origens = [
    { label: 'Portais', pct: 35, color: 'bg-blue-500' },
    { label: 'Site próprio', pct: 25, color: 'bg-accent' },
    { label: 'Indicação', pct: 20, color: 'bg-emerald-500' },
    { label: 'WhatsApp', pct: 12, color: 'bg-green-500' },
    { label: 'Presencial', pct: 8, color: 'bg-purple-500' },
]

export default function RelatoriosPage() {
    const maxValor = Math.max(...vendas_mensal.map(v => v.valor))

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* Export */}
            <div className="flex items-center justify-end">
                <button className="flex items-center gap-2 bg-white/5 text-zinc-300 px-4 py-2 rounded-xl text-sm hover:bg-white/10 transition-colors border border-white/5">
                    <Download className="h-4 w-4" />Exportar Relatório
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map(kpi => {
                    const Ico = kpi.icon
                    return (
                        <div key={kpi.label} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                                    <Ico className="h-5 w-5 text-accent" />
                                </div>
                                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5', kpi.change > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10')}>
                                    {kpi.change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{Math.abs(kpi.change)}%
                                </span>
                            </div>
                            <p className="text-xl font-bold text-white">{kpi.value}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1 font-bold">{kpi.label}</p>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-zinc-800/30 rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-semibold text-white">Volume de Vendas (VGV)</h3>
                        <p className="text-xs text-zinc-500">Últimos 6 meses</p>
                    </div>
                    <div className="flex items-end gap-3 h-48">
                        {vendas_mensal.map(v => {
                            const pct = (v.valor / maxValor) * 100
                            return (
                                <div key={v.mes} className="flex-1 flex flex-col items-center gap-2 group">
                                    <span className="text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        R$ {(v.valor / 1e6).toFixed(1)}M
                                    </span>
                                    <div className="w-full rounded-t-lg bg-accent/15 hover:bg-accent/25 transition-colors relative" style={{ height: `${pct}%` }}>
                                        <div className="absolute inset-0 bg-accent/30 rounded-t-lg" style={{ height: `${pct}%` }} />
                                    </div>
                                    <span className="text-[10px] text-zinc-500">{v.mes}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Origens de Lead */}
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6">
                    <h3 className="text-sm font-semibold text-white mb-6">Origem dos Compradores</h3>
                    <div className="space-y-4">
                        {origens.map(o => (
                            <div key={o.label}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-zinc-400">{o.label}</span>
                                    <span className="text-white font-semibold">{o.pct}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className={cn('h-full rounded-full transition-all', o.color)} style={{ width: `${o.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Corretor Performance */}
            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Performance dos Corretores</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Corretor</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Vendas</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">VGV</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Comissão</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Taxa Conversão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {corretores.map(c => (
                                <tr key={c.nome} className="border-b border-white/[0.03]">
                                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">{c.nome.charAt(0)}</div>
                                        {c.nome}
                                    </td>
                                    <td className="px-4 py-3 text-white font-semibold">{c.vendas}</td>
                                    <td className="px-4 py-3 text-accent font-semibold">R$ {(c.vgv / 1e6).toFixed(1)}M</td>
                                    <td className="px-4 py-3 text-emerald-400 font-semibold">R$ {(c.comissao / 1e3).toFixed(0)}k</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-20 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent rounded-full" style={{ width: `${c.taxa_conversao}%` }} />
                                            </div>
                                            <span className="text-xs text-zinc-400">{c.taxa_conversao}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
