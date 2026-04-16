'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, DollarSign, Building2, Calendar, ArrowUp, ArrowDown, Download, Users } from 'lucide-react'
import { VendasRelatorio } from '@/lib/supabase/queries/vendas'

interface RelatoriosClientProps {
    data: VendasRelatorio
}

export function RelatoriosClient({ data }: RelatoriosClientProps) {
    const { kpis, vendasMensal, corretores, origens } = data
    const maxValor = Math.max(...vendasMensal.map(v => v.valor), 1)

    const kpiDisplay = [
        { label: 'VGV Vendido', value: `R$ ${(kpis.vgvTotal / 1e6).toFixed(2)}M`, change: 0, icon: DollarSign },
        { label: 'Imóveis Vendidos', value: String(kpis.imoveisVendidos), change: 0, icon: Building2 },
        { label: 'Ticket Médio', value: `R$ ${(kpis.ticketMedio / 1e6).toFixed(2)}M`, change: 0, icon: TrendingUp },
        { label: 'Total de Leads', value: String(kpis.leadsTotal), change: 0, icon: Users },
    ]

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
                {kpiDisplay.map(kpi => {
                    const Ico = kpi.icon
                    return (
                        <div key={kpi.label} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                                    <Ico className="h-5 w-5 text-accent" />
                                </div>
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
                    <div className="flex items-end gap-3 h-48 px-1">
                        {vendasMensal.map(v => {
                            const pct = (v.valor / maxValor) * 100
                            return (
                                <div key={v.mes} className="flex-1 flex flex-col items-center h-full">
                                    <div className="w-full flex-1 relative group flex flex-col justify-end">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                            R$ {(v.valor / 1e3).toFixed(0)}k
                                        </div>
                                        <div className="w-full bg-white/5 rounded-t-lg transition-all duration-500 hover:bg-white/10 relative h-full flex flex-col justify-end overflow-hidden">
                                            <div className="w-full bg-accent/40 rounded-t-lg transition-all duration-500" style={{ height: `${Math.max(pct, 2)}%` }} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-zinc-500 mt-2">{v.mes}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Origens de Lead */}
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6">
                    <h3 className="text-sm font-semibold text-white mb-6">Origem dos Compradores</h3>
                    <div className="space-y-4">
                        {origens.length > 0 ? origens.map(o => (
                            <div key={o.label}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-zinc-400">{o.label}</span>
                                    <span className="text-white font-semibold">{o.pct}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className={cn('h-full rounded-full transition-all', o.color)} style={{ width: `${o.pct}%` }} />
                                </div>
                            </div>
                        )) : (
                            <p className="text-xs text-zinc-600 text-center py-8">Nenhum dado de origem disponível.</p>
                        )}
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
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Comissão (Est.)</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Taxa Conversão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {corretores.length > 0 ? corretores.map(c => (
                                <tr key={c.nome} className="border-b border-white/[0.03]">
                                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">{c.nome.charAt(0)}</div>
                                        {c.nome}
                                    </td>
                                    <td className="px-4 py-3 text-white font-semibold">{c.vendas}</td>
                                    <td className="px-4 py-3 text-accent font-semibold">R$ {(c.vgv / 1e3).toFixed(0)}k</td>
                                    <td className="px-4 py-3 text-emerald-400 font-semibold">R$ {(c.comissao / 1e3).toFixed(1)}k</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-20 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent rounded-full" style={{ width: `${c.taxa_conversao}%` }} />
                                            </div>
                                            <span className="text-xs text-zinc-400">{c.taxa_conversao}%</span>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-zinc-600">Nenhum dado de corretor disponível.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
