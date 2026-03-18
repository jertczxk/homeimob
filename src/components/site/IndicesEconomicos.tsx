import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const indices = [
    { label: 'CUB/SC', value: 'R$ 2.654,12', change: '+0,45%' },
    { label: 'IGP-M', value: '0,52%', change: '(Fev)' },
    { label: 'SELIC', value: '11,25%', change: 'a.a.' },
    { label: 'IPCA', value: '0,83%', change: '+4,51% (12m)' }
]

export function IndicesEconomicos() {
    return (
        <div className="bg-transparent py-3 border-y border-white/5">
            <div className="container overflow-hidden">
                <div className="flex items-center justify-between gap-8 md:gap-16 text-xs font-sans whitespace-nowrap">
                    <div className="flex items-center space-x-8 md:space-x-12 overflow-x-auto no-scrollbar">
                        <span className="font-bold text-white/50 uppercase tracking-widest hidden lg:inline">Índices:</span>
                        {indices.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <span className="text-white/60 font-medium">{item.label}:</span>
                                <span className="font-bold text-white/90">{item.value}</span>
                                <span className="text-[10px] text-accent font-bold">{item.change}</span>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/indices-economicos"
                        className="flex items-center gap-1.5 text-white/40 hover:text-accent transition-colors shrink-0 font-medium"
                    >
                        Ver detalhes
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
