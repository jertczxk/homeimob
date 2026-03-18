'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ChevronDown, Check, X, Filter } from 'lucide-react'
import { useFiltrosStore } from '@/store/filtros'
import { Button } from '@/components/ui/button'

const finalidadeOptions = [
    { value: '', label: 'Todas' },
    { value: 'venda', label: 'Comprar' },
    { value: 'locação', label: 'Alugar' },
]

const tipoOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'residencial', label: 'Residencial' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'terreno', label: 'Terreno' },
]

const quartosOptions = [
    { value: '', label: 'Qualquer' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
]

export function FiltrosSidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const setFiltros = useFiltrosStore((state) => state.setFiltros)
    const resetFiltrosStore = useFiltrosStore((state) => state.resetFiltros)

    const [localFiltros, setLocalFiltros] = useState({
        finalidade: searchParams.get('finalidade') || '',
        tipo: searchParams.get('tipo') || '',
        bairro: searchParams.get('bairro') || '',
        precoMin: searchParams.get('precoMin') || '',
        precoMax: searchParams.get('precoMax') || '',
        quartos: searchParams.get('quartos') || '',
        vagas: searchParams.get('vagas') || '',
    })

    useEffect(() => {
        setLocalFiltros({
            finalidade: searchParams.get('finalidade') || '',
            tipo: searchParams.get('tipo') || '',
            bairro: searchParams.get('bairro') || '',
            precoMin: searchParams.get('precoMin') || '',
            precoMax: searchParams.get('precoMax') || '',
            quartos: searchParams.get('quartos') || '',
            vagas: searchParams.get('vagas') || '',
        })
    }, [searchParams])

    const handleApply = () => {
        const params = new URLSearchParams()
        Object.entries(localFiltros).forEach(([key, value]) => {
            if (value) params.set(key, value)
        })

        // Update store
        setFiltros({
            finalidade: localFiltros.finalidade,
            tipo: localFiltros.tipo,
            bairro: localFiltros.bairro,
            precoMin: localFiltros.precoMin ? Number(localFiltros.precoMin) : undefined,
            precoMax: localFiltros.precoMax ? Number(localFiltros.precoMax) : undefined,
            quartos: localFiltros.quartos ? Number(localFiltros.quartos) : undefined,
            vagas: localFiltros.vagas ? Number(localFiltros.vagas) : undefined,
        })

        router.push(`/imoveis?${params.toString()}`)
    }

    const handleReset = () => {
        setLocalFiltros({
            finalidade: '',
            tipo: '',
            bairro: '',
            precoMin: '',
            precoMax: '',
            quartos: '',
            vagas: '',
        })
        resetFiltrosStore()
        router.push('/imoveis')
    }

    const inputClass = "w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 focus:border-white/30 rounded-lg h-11 px-4 text-sm text-white placeholder:text-white/40 outline-none transition-all"
    const labelClass = "text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 block"

    return (
        <aside className="w-full lg:w-80 flex-shrink-0 bg-primary dark:bg-zinc-950 rounded-2xl p-6 lg:sticky lg:top-24 h-fit shadow-2xl border border-white/5">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-accent" />
                    <h2 className="text-xl font-bold text-white">Filtros</h2>
                </div>
                <button
                    onClick={handleReset}
                    className="text-xs text-white/40 hover:text-white transition-colors"
                >
                    Limpar tudo
                </button>
            </div>

            <div className="space-y-6">
                {/* Bairro/Busca */}
                <div>
                    <label className={labelClass}>Localização</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Bairro ou cidade..."
                            className={`${inputClass} pl-10`}
                            value={localFiltros.bairro}
                            onChange={(e) => setLocalFiltros({ ...localFiltros, bairro: e.target.value })}
                        />
                    </div>
                </div>

                {/* Finalidade */}
                <div>
                    <label className={labelClass}>Finalidade</label>
                    <select
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={localFiltros.finalidade}
                        onChange={(e) => setLocalFiltros({ ...localFiltros, finalidade: e.target.value })}
                    >
                        {finalidadeOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Tipo */}
                <div>
                    <label className={labelClass}>Tipo de Imóvel</label>
                    <select
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={localFiltros.tipo}
                        onChange={(e) => setLocalFiltros({ ...localFiltros, tipo: e.target.value })}
                    >
                        {tipoOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Preço */}
                <div>
                    <label className={labelClass}>Preço</label>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Min"
                            className={inputClass}
                            value={localFiltros.precoMin}
                            onChange={(e) => setLocalFiltros({ ...localFiltros, precoMin: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Max"
                            className={inputClass}
                            value={localFiltros.precoMax}
                            onChange={(e) => setLocalFiltros({ ...localFiltros, precoMax: e.target.value })}
                        />
                    </div>
                </div>

                {/* Quartos e Vagas */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Quartos</label>
                        <select
                            className={`${inputClass} appearance-none cursor-pointer`}
                            value={localFiltros.quartos}
                            onChange={(e) => setLocalFiltros({ ...localFiltros, quartos: e.target.value })}
                        >
                            {quartosOptions.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Vagas</label>
                        <select
                            className={`${inputClass} appearance-none cursor-pointer`}
                            value={localFiltros.vagas}
                            onChange={(e) => setLocalFiltros({ ...localFiltros, vagas: e.target.value })}
                        >
                            {quartosOptions.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    onClick={handleApply}
                    className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl mt-4 shadow-lg shadow-accent/10 transition-all active:scale-[0.98]"
                >
                    Filtrar agora
                </Button>
            </div>
        </aside>
    )
}
