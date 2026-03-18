'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, Check } from 'lucide-react'
import { useFiltrosStore } from '@/store/filtros'

interface Option {
  value: string
  label: string
}

interface GlassSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder: string
  label?: string
}

function GlassSelect({ value, onChange, options, placeholder, label }: GlassSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative w-full flex flex-col gap-2">
      {label && <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] pl-1">{label}</span>}
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-between w-full h-20 lg:h-14 px-8 lg:px-6 gap-4 rounded-2xl border transition-all duration-200 text-xl lg:text-sm font-bold lg:font-medium text-white
          bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40
          ${open ? 'bg-white/25 border-white/60' : ''}`}
      >
        <span className={selected?.value ? 'text-white' : 'text-white/55'}>
          {selected?.value ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-6 w-6 text-white/60 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute z-50 top-[calc(100%+8px)] left-0 min-w-full w-max
          bg-zinc-950/90 backdrop-blur-2xl border border-white/15
          rounded-2xl shadow-2xl shadow-black/60 overflow-hidden
          animate-in fade-in-0 zoom-in-95 duration-150">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`flex items-center justify-between w-full px-6 py-4 text-sm font-medium text-left transition-colors duration-150
                ${option.value === value ? 'text-white bg-white/20' : 'text-white/80 hover:text-white hover:bg-white/15'}`}
            >
              {option.label}
              {option.value === value && <Check className="h-3.5 w-3.5 ml-4 text-accent shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface GlassInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label?: string
  icon?: React.ReactNode
}

function GlassInput({ value, onChange, placeholder, label, icon }: GlassInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] pl-1">{label}</span>}
      <div className="flex items-center bg-white/10 hover:bg-white/20 focus-within:bg-white/30 border border-white/20 hover:border-white/40 focus-within:border-white/60 rounded-2xl transition-all duration-200 h-20 lg:h-14 px-8 lg:px-6 gap-4 overflow-hidden shrink-0">
        {icon && <div className="text-white/40 shrink-0">{icon}</div>}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-full bg-transparent text-white text-xl lg:text-sm font-bold lg:font-medium placeholder:text-white/40 outline-none w-full min-w-0"
        />
      </div>
    </div>
  )
}

const finalidadeOptions: Option[] = [
  { value: '', label: 'Todas' },
  { value: 'venda', label: 'Comprar' },
  { value: 'locação', label: 'Alugar' },
]

const tipoOptions: Option[] = [
  { value: '', label: 'Todos' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'terreno', label: 'Terreno' },
]

const cidadeOptions: Option[] = [
  { value: '', label: 'Todas' },
  { value: 'balneario-camboriu', label: 'Balneário Camboriú' },
  { value: 'itajai', label: 'Itajaí' },
  { value: 'itapema', label: 'Itapema' },
]

const condominioOptions: Option[] = [
  { value: '', label: 'Todos' },
  { value: 'yachthouse', label: 'Yachthouse' },
  { value: 'one-tower', label: 'One Tower' },
  { value: 'vitra', label: 'Vitra' },
]

export function FiltrosBusca() {
  const router = useRouter()
  const setFiltros = useFiltrosStore((state) => state.setFiltros)
  const filtros = useFiltrosStore((state) => state.filtros)

  const [localFiltros, setLocalFiltros] = useState({
    finalidade: (filtros.finalidade || '') as string,
    tipo: (filtros.tipo || '') as string,
    bairro: (filtros.bairro || '') as string,
    precoMin: (filtros.precoMin?.toString() || '') as string,
    precoMax: (filtros.precoMax?.toString() || '') as string,
    cidade: (filtros.cidade || '') as string,
    condominio: (filtros.condominio || '') as string,
  })

  const handleSearch = () => {
    setFiltros({
      ...localFiltros,
      precoMin: localFiltros.precoMin ? Number(localFiltros.precoMin.replace(/\D/g, '')) : undefined,
      precoMax: localFiltros.precoMax ? Number(localFiltros.precoMax.replace(/\D/g, '')) : undefined,
    })
    const params = new URLSearchParams()
    if (localFiltros.finalidade) params.set('finalidade', localFiltros.finalidade)
    if (localFiltros.tipo) params.set('tipo', localFiltros.tipo)
    if (localFiltros.bairro) params.set('bairro', localFiltros.bairro)
    if (localFiltros.precoMin) params.set('precoMin', localFiltros.precoMin)
    if (localFiltros.precoMax) params.set('precoMax', localFiltros.precoMax)
    if (localFiltros.cidade) params.set('cidade', localFiltros.cidade)
    if (localFiltros.condominio) params.set('condominio', localFiltros.condominio)
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Row 1: Negócio, Tipo, Valor Min, Valor Max */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <GlassSelect
          label="Negócio"
          value={localFiltros.finalidade}
          onChange={(v) => setLocalFiltros({ ...localFiltros, finalidade: v })}
          options={finalidadeOptions}
          placeholder="Selecione"
        />

        <GlassSelect
          label="Tipo do Imóvel"
          value={localFiltros.tipo}
          onChange={(v) => setLocalFiltros({ ...localFiltros, tipo: v })}
          options={tipoOptions}
          placeholder="Selecione"
        />

        <GlassInput
          label="Valor mínimo"
          placeholder="R$ 0,00"
          value={localFiltros.precoMin}
          onChange={(v) => setLocalFiltros({ ...localFiltros, precoMin: v })}
        />

        <GlassInput
          label="Valor máximo"
          placeholder="R$ 0,00"
          value={localFiltros.precoMax}
          onChange={(v) => setLocalFiltros({ ...localFiltros, precoMax: v })}
        />
      </div>

      {/* Row 2: Cidade, Bairros, Condomínios + Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-end">
        <GlassSelect
          label="Cidade"
          value={localFiltros.cidade}
          onChange={(v) => setLocalFiltros({ ...localFiltros, cidade: v })}
          options={cidadeOptions}
          placeholder="Selecione"
        />

        <GlassInput
          label="Bairros"
          placeholder="Pesquisar bairro..."
          icon={<Search className="h-5 w-5 lg:h-4 lg:w-4" />}
          value={localFiltros.bairro}
          onChange={(v) => setLocalFiltros({ ...localFiltros, bairro: v })}
        />

        <GlassSelect
          label="Condomínios"
          value={localFiltros.condominio}
          onChange={(v) => setLocalFiltros({ ...localFiltros, condominio: v })}
          options={condominioOptions}
          placeholder="Selecione"
        />

        {/* Botão Buscar */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-3 h-20 lg:h-14 w-full bg-accent hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent/40 active:scale-[0.98] text-accent-foreground font-black lg:font-bold text-xl lg:text-sm rounded-2xl shadow-lg transition-all duration-300"
        >
          <Search className="h-6 w-6 lg:h-5 lg:w-5" />
          Pesquisar
        </button>
      </div>
    </div>
  )
}
