'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, X, GripVertical, MapPin, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TipoImovel, FinalidadeImovel, StatusImovel } from '@/types'

interface ImovelFormData {
  titulo: string
  descricao: string
  tipo: TipoImovel
  finalidade: FinalidadeImovel
  preco: string
  area_m2: string
  quartos: string
  banheiros: string
  vagas: string
  endereco: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  status: StatusImovel
  destaque: boolean
}

const initialForm: ImovelFormData = {
  titulo: '', descricao: '', tipo: 'residencial', finalidade: 'venda',
  preco: '', area_m2: '', quartos: '', banheiros: '', vagas: '',
  endereco: '', bairro: '', cidade: '', uf: '', cep: '',
  status: 'ativo', destaque: false,
}

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
  const [form, setForm] = useState<ImovelFormData>(initialForm)
  const [photos, setPhotos] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const update = (field: keyof ImovelFormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simular save
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    alert('Imóvel salvo com sucesso! (mock)')
  }

  return (
    <div className="max-w-4xl space-y-6">
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
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {/* Dados Básicos */}
      <section className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white">Dados do Imóvel</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Título" span={2}>
            <input className={inputClass} placeholder="Ex: Casa com piscina nos Jardins" value={form.titulo} onChange={e => update('titulo', e.target.value)} />
          </FormField>
          <FormField label="Descrição" span={2}>
            <textarea className={cn(inputClass, 'min-h-[100px] resize-y')} placeholder="Descreva o imóvel..." value={form.descricao} onChange={e => update('descricao', e.target.value)} />
          </FormField>
          <FormField label="Tipo">
            <select className={selectClass} value={form.tipo} onChange={e => update('tipo', e.target.value)}>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
            </select>
          </FormField>
          <FormField label="Finalidade">
            <select className={selectClass} value={form.finalidade} onChange={e => update('finalidade', e.target.value)}>
              <option value="venda">Venda</option>
              <option value="locação">Locação</option>
            </select>
          </FormField>
          <FormField label="Preço (R$)">
            <input type="number" className={inputClass} placeholder="0,00" value={form.preco} onChange={e => update('preco', e.target.value)} />
          </FormField>
          <FormField label="Área (m²)">
            <input type="number" className={inputClass} placeholder="0" value={form.area_m2} onChange={e => update('area_m2', e.target.value)} />
          </FormField>
          <FormField label="Quartos">
            <input type="number" className={inputClass} placeholder="0" value={form.quartos} onChange={e => update('quartos', e.target.value)} />
          </FormField>
          <FormField label="Banheiros">
            <input type="number" className={inputClass} placeholder="0" value={form.banheiros} onChange={e => update('banheiros', e.target.value)} />
          </FormField>
          <FormField label="Vagas">
            <input type="number" className={inputClass} placeholder="0" value={form.vagas} onChange={e => update('vagas', e.target.value)} />
          </FormField>
          <FormField label="Status">
            <select className={selectClass} value={form.status} onChange={e => update('status', e.target.value)}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="vendido">Vendido</option>
              <option value="locado">Locado</option>
            </select>
          </FormField>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" checked={form.destaque} onChange={e => update('destaque', e.target.checked)} className="w-4 h-4 rounded border-white/10 bg-zinc-800 accent-accent" />
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
            onClick={() => {
              // Mock: adicionar uma foto de exemplo
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
            <input className={inputClass} placeholder="Rua, número" value={form.endereco} onChange={e => update('endereco', e.target.value)} />
          </FormField>
          <FormField label="Bairro">
            <input className={inputClass} placeholder="Bairro" value={form.bairro} onChange={e => update('bairro', e.target.value)} />
          </FormField>
          <FormField label="Cidade">
            <input className={inputClass} placeholder="Cidade" value={form.cidade} onChange={e => update('cidade', e.target.value)} />
          </FormField>
          <FormField label="UF">
            <input className={inputClass} placeholder="SP" maxLength={2} value={form.uf} onChange={e => update('uf', e.target.value)} />
          </FormField>
          <FormField label="CEP">
            <input className={inputClass} placeholder="00000-000" value={form.cep} onChange={e => update('cep', e.target.value)} />
          </FormField>
        </div>
        {/* Map Placeholder */}
        <div className="w-full h-48 bg-zinc-800/50 rounded-xl border border-white/5 flex items-center justify-center">
          <div className="text-center text-zinc-600">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Mapa interativo (Google Maps)</p>
            <p className="text-[10px]">Integração disponível na Fase 5</p>
          </div>
        </div>
      </section>
    </div>
  )
}
