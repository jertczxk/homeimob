'use client'

import { TrendingUp, ArrowLeft, Calendar, Info, LineChart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const dataCUB = [
    { month: 'Set/25', value: 2540.12 },
    { month: 'Out/25', value: 2555.20 },
    { month: 'Nov/25', value: 2570.45 },
    { month: 'Dez/25', value: 2585.80 },
    { month: 'Jan/26', value: 2610.15 },
    { month: 'Fev/26', value: 2635.40 },
    { month: 'Mar/26', value: 2654.12 },
]

const historico = [
    { index: 'CUB/SC', current: 'R$ 2.635,40', prev1: 'R$ 2.610,15', prev2: 'R$ 2.585,80', variacao: '+0,45%' },
    { index: 'IGP-M', current: '0,52%', prev1: '-0,12%', prev2: '0,44%', variacao: '+0,52%' },
    { index: 'SELIC', current: '11,25%', prev1: '11,75%', prev2: '11,75%', variacao: '-0,50 pts' },
]

function SimpleChart({ data }: { data: { month: string, value: number }[] }) {
    const max = Math.max(...data.map(d => d.value))
    const min = Math.min(...data.map(d => d.value))
    const baseline = min * 0.98 // Zoom in on the top 2% of variation
    const range = max - baseline

    const width = 800
    const height = 240
    const padding = 40
    const barWidth = 60

    return (
        <div className="w-full bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-white/5 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h4 className="font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                        <TrendingUp className="h-4 w-4 text-accent" />
                        Evolução CUB/SC (6 meses)
                    </h4>
                    <p className="text-xs text-muted-foreground">Valores baseados no Custo Unitário Básico / Santa Catarina</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-accent/40 border border-accent" />
                        Valor m²
                    </div>
                </div>
            </div>

            <div className="relative h-[240px] w-full pt-10">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                        <g key={i}>
                            <line
                                x1="0" y1={height - padding - p * (height - padding * 2)}
                                x2={width} y2={height - padding - p * (height - padding * 2)}
                                stroke="currentColor"
                                strokeOpacity="0.05"
                                strokeDasharray="4 4"
                            />
                            <text
                                x="-10"
                                y={height - padding - p * (height - padding * 2)}
                                textAnchor="end"
                                className="text-[10px] fill-zinc-400 font-bold"
                                alignmentBaseline="middle"
                            >
                                {(baseline + p * range).toFixed(0)}
                            </text>
                        </g>
                    ))}

                    {/* Bars */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * (width - padding * 2) + padding - barWidth / 2
                        const barHeight = ((d.value - baseline) / range) * (height - padding * 2)

                        return (
                            <g key={i} className="group/bar">
                                <rect
                                    x={x}
                                    y={height - padding - barHeight}
                                    width={barWidth}
                                    height={barHeight}
                                    rx="6"
                                    className="fill-accent/20 stroke-accent stroke-2 group-hover/bar:fill-accent/40 transition-all duration-300"
                                />
                                <text
                                    x={x + barWidth / 2}
                                    y={height - padding - barHeight - 12}
                                    textAnchor="middle"
                                    className="text-[11px] font-bold fill-zinc-900 dark:fill-white opacity-0 group-hover/bar:opacity-100 transition-opacity"
                                >
                                    {d.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </text>
                                <text
                                    x={x + barWidth / 2}
                                    y={height - padding + 20}
                                    textAnchor="middle"
                                    className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest fill-zinc-500"
                                >
                                    {d.month}
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>
        </div>
    )
}

export default function IndicesPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Header Section */}
            <section className="bg-primary pt-32 pb-32 md:pt-40 text-white relative overflow-hidden">
                <div className="container relative z-10 space-y-8">
                    <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors w-fit">
                        <ArrowLeft className="h-4 w-4" />
                        Voltar ao Início
                    </Link>

                    <div className="max-w-2xl space-y-4">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Índices Econômicos</h1>
                        <p className="text-white/60 text-lg leading-relaxed">
                            Acompanhe os principais indicadores que influenciam o mercado imobiliário e os reajustes de contratos.
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -mr-48 -mt-48" />
            </section>

            {/* Content Section */}
            <section className="container -mt-16 pb-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Visual Data */}
                    <div className="lg:col-span-2 space-y-8">
                        <SimpleChart data={dataCUB} />

                        {/* Historical Table */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-white/5 overflow-hidden shadow-sm">
                            <div className="px-6 py-6 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-accent" />
                                    Comparativo Mensal (2026)
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground bg-zinc-50 dark:bg-white/5">
                                        <tr>
                                            <th className="px-8 py-5 font-bold">Indicador</th>
                                            <th className="px-8 py-5 font-bold">Fev/26</th>
                                            <th className="px-8 py-5 font-bold">Jan/26</th>
                                            <th className="px-8 py-5 font-bold">Dez/25</th>
                                            <th className="px-8 py-5 font-bold">Variação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                                        {historico.map((row, i) => (
                                            <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6 font-bold text-zinc-900 dark:text-white">{row.index}</td>
                                                <td className="px-8 py-6 font-medium">{row.current}</td>
                                                <td className="px-8 py-6 text-muted-foreground">{row.prev1}</td>
                                                <td className="px-8 py-6 text-muted-foreground">{row.prev2}</td>
                                                <td className="px-8 py-6 font-bold text-accent">{row.variacao}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="space-y-8">
                        {/* Info Cards */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                            {/* Accent line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-accent" />

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground shadow-lg shadow-accent/20">
                                        <Info className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-bold text-foreground">O que é o CUB?</h4>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    O Custo Unitário Básico (CUB) é o principal indicador de custos do setor da construção civil. Ele serve como parâmetro para o reajuste de contratos de obras em andamento.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-2xl p-6 space-y-6">
                            <h4 className="font-bold border-b pb-4 border-zinc-100 dark:border-white/5">Entenda os Índices</h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase text-accent tracking-widest">IGP-M</p>
                                    <p className="text-sm text-muted-foreground">Utilizado principalmente no reajuste de contratos de locação.</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase text-accent tracking-widest">IPCA</p>
                                    <p className="text-sm text-muted-foreground">O índice oficial de inflação do Brasil, medido pelo IBGE.</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase text-accent tracking-widest">SELIC</p>
                                    <p className="text-sm text-muted-foreground">A taxa básica de juros, que influencia as taxas de financiamento imobiliário.</p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-14 shadow-lg shadow-primary/20">
                            Receber Relatório Mensal
                        </Button>
                    </div>

                </div>
            </section>
        </div>
    )
}
