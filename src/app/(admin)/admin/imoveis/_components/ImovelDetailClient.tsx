'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Edit, ExternalLink, MapPin, BedDouble, Bath, CarFront, Ruler,
  Calendar, Camera, Trash2,
} from 'lucide-react'
import { ImovelComFotos, StatusImovel, FinalidadeImovel } from '@/types'
import { deleteImovel } from '../actions'
import { UploadFotos } from '@/components/admin/UploadFotos'

const statusConfig: Record<StatusImovel, { label: string; color: string }> = {
  ativo: { label: 'Ativo', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  inativo: { label: 'Inativo', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
  vendido: { label: 'Vendido', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  locado: { label: 'Locado', color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
}

function formatPrice(v: number | null, f: FinalidadeImovel) {
  return v ? `R$ ${v.toLocaleString('pt-BR')}${f === 'locação' ? '/mês' : ''}` : '—'
}

export function ImovelDetailClient({ imovel }: { imovel: ImovelComFotos }) {
  const [activeTab, setActiveTab] = useState<'detalhes' | 'fotos' | 'historico'>('detalhes')
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Deseja excluir este imóvel? Esta ação não pode ser desfeita.')) return
    startTransition(() => deleteImovel(imovel.id))
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/imoveis" className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-lg font-bold text-white">{imovel.titulo}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', statusConfig[imovel.status].color)}>
                {statusConfig[imovel.status].label}
              </span>
              <span className="text-xs text-zinc-500 capitalize">{imovel.tipo} · {imovel.finalidade}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/imoveis/${imovel.slug}`}
            target="_blank"
            className="flex items-center gap-2 bg-white/5 text-zinc-300 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors border border-white/5"
          >
            <ExternalLink className="h-4 w-4" />
            Ver no site
          </Link>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-2 rounded-lg text-sm hover:bg-red-500/20 transition-colors disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>
          <Link
            href={`/admin/imoveis/${imovel.id}/editar`}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
        </div>
      </div>

      {/* Cover image */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden h-64">
        {imovel.imovel_fotos.slice(0, 3).map((foto, i) => (
          <div key={foto.id} className={cn('relative overflow-hidden', i === 0 && 'col-span-2')}>
            <Image
              src={foto.url}
              alt={`Foto ${i + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            {i === 0 && (
              <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                <Camera className="h-3 w-3 inline mr-1" />{imovel.imovel_fotos.length} fotos
              </span>
            )}
          </div>
        ))}
        {imovel.imovel_fotos.length === 0 && (
          <div className="col-span-3 bg-zinc-800/50 flex items-center justify-center rounded-2xl">
            <span className="text-zinc-500 text-sm">Sem fotos cadastradas</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-800/30 rounded-xl p-1 border border-white/5 w-fit">
        {(['detalhes', 'fotos', 'historico'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              activeTab === tab ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white'
            )}
          >
            {tab === 'historico' ? 'Histórico' : tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'detalhes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Descrição</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{imovel.descricao || 'Sem descrição.'}</p>
            </div>
            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Características</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Ruler, label: 'Área', value: imovel.area_m2 ? `${imovel.area_m2} m²` : '—' },
                  { icon: BedDouble, label: 'Quartos', value: String(imovel.quartos) },
                  { icon: Bath, label: 'Banheiros', value: String(imovel.banheiros) },
                  { icon: CarFront, label: 'Vagas', value: String(imovel.vagas) },
                ].map((item, i) => (
                  <div key={i} className="bg-white/[0.02] rounded-xl p-3 border border-white/5 text-center">
                    <item.icon className="h-5 w-5 text-accent mx-auto mb-2" />
                    <p className="text-lg font-bold text-white">{item.value}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Preço</h3>
              <p className="text-2xl font-bold text-accent">{formatPrice(imovel.preco, imovel.finalidade)}</p>
            </div>
            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> Localização
              </h3>
              <div className="space-y-1.5 text-sm text-zinc-400">
                <p>{imovel.endereco}</p>
                <p>{imovel.bairro}, {imovel.cidade} — {imovel.uf}</p>
                <p className="text-zinc-600">CEP: {imovel.cep}</p>
              </div>
            </div>
            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Informações</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Cadastrado em</span>
                  <span className="text-zinc-300">{new Date(imovel.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Atualizado em</span>
                  <span className="text-zinc-300">{new Date(imovel.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Destaque</span>
                  <span className={imovel.destaque ? 'text-accent' : 'text-zinc-500'}>{imovel.destaque ? 'Sim' : 'Não'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fotos' && (
        <UploadFotos imovelId={imovel.id} fotos={imovel.imovel_fotos} />
      )}

      {activeTab === 'historico' && (
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 text-center text-zinc-500 py-12">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Histórico de atividades em breve.</p>
        </div>
      )}
    </div>
  )
}
