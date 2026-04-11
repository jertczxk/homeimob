'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, X, GripVertical, MapPin, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TipoImovel, FinalidadeImovel, StatusImovel } from '@/types'
import { createImovel } from '../actions'

function FormField({ label, children, span }: { label: string; children: React.ReactNode; span?: number }) {
  return (
    <div className={cn('space-y-1.5', span === 2 && 'sm:col-span-2')}>
      <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">{label}</label>
      {children}
    </div>
  )
}

const inputClass = "w-full bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-accent/30 transition-colors"
const selectClass = "w-full bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-accent/30 transition-colors cursor-pointer"

export default function NovoImovelPage() {
  const [photos, setPhotos] = useState<string[]>([])
  const [destaque, setDestaque] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('destaque', String(destaque))
    startTransition(() => createImovel(formData))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/imoveis" className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-lg font-bold text-white">Novo Imóvel</h2>
            <p className="text-xs text-zinc-500">Preencha os dados para cadastrar</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {/* Dados Básicos */}
      <section className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white">Dados do Imóvel</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Título" span={2}>
            <input name="titulo" required className={inputClass} placeholder="Ex: Casa com piscina nos Jardins" />
          </FormField>
          <FormField label="Descrição" span={2}>
            <textarea name="descricao" className={cn(inputClass, 'min-h-[100px] resize-y')} placeholder="Descreva o imóvel..." />
          </FormField>
          <FormField label="Tipo">
            <select name="tipo" className={selectClass} defaultValue="residencial">
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
            </select>
          </FormField>
          <FormField label="Finalidade">
            <select name="finalidade" className={selectClass} defaultValue="venda">
              <option value="venda">Venda</option>
              <option value="locação">Locação</option>
            </select>
          </FormField>
          <FormField label="Preço (R$)">
            <input name="preco" type="number" className={inputClass} placeholder="0,00" />
          </FormField>
          <FormField label="Área (m²)">
            <input name="area_m2" type="number" className={inputClass} placeholder="0" />
          </FormField>
          <FormField label="Quartos">
            <input name="quartos" type="number" className={inputClass} placeholder="0" defaultValue="0" />
          </FormField>
          <FormField label="Banheiros">
            <input name="banheiros" type="number" className={inputClass} placeholder="0" defaultValue="0" />
          </FormField>
          <FormField label="Vagas">
            <input name="vagas" type="number" className={inputClass} placeholder="0" defaultValue="0" />
          </FormField>
          <FormField label="Status">
            <select name="status" className={selectClass} defaultValue="ativo">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="vendido">Vendido</option>
              <option value="locado">Locado</option>
            </select>
          </FormField>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={destaque}
            onChange={e => setDestaque(e.target.checked)}
            className="w-4 h-4 rounded border-white/10 bg-zinc-800 accent-accent"
          />
          <span className="text-sm text-zinc-300">Marcar como destaque</span>
        </label>
      </section>

      {/* Fotos */}
      <section className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white">Fotos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((url, i) => (
            <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-white/5 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute top-2 left-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical className="h-3 w-3 text-white" />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setPhotos([...photos, `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop&q=80&sig=${Date.now()}`])
            }}
            className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-accent/30 hover:text-accent transition-colors"
          >
            <Upload className="h-6 w-6" />
            <span className="text-xs font-medium">Adicionar</span>
          </button>
        </div>
        <p className="text-[10px] text-zinc-600">Arraste para reordenar. Primeira foto será a capa.</p>
      </section>

      {/* Localização */}
      <section className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" />
          Localização
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Endereço" span={2}>
            <input name="endereco" className={inputClass} placeholder="Rua, número" />
          </FormField>
          <FormField label="Bairro">
            <input name="bairro" className={inputClass} placeholder="Bairro" />
          </FormField>
          <FormField label="Cidade">
            <input name="cidade" className={inputClass} placeholder="Cidade" />
          </FormField>
          <FormField label="UF">
            <input name="uf" className={inputClass} placeholder="SP" maxLength={2} />
          </FormField>
          <FormField label="CEP">
            <input name="cep" className={inputClass} placeholder="00000-000" />
          </FormField>
        </div>
        <div className="w-full h-48 bg-zinc-800/50 rounded-xl border border-white/5 flex items-center justify-center">
          <div className="text-center text-zinc-600">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Mapa interativo (Google Maps)</p>
            <p className="text-[10px]">Integração disponível na Fase 5</p>
          </div>
        </div>
      </section>
    </form>
  )
}
