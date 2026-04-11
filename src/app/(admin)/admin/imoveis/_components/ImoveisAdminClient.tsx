'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { ImovelComFotos, StatusImovel, TipoImovel, FinalidadeImovel } from '@/types'
import { cn } from '@/lib/utils'
import {
  Plus, Search, Eye, Edit, Trash2,
  MapPin, BedDouble, Bath, CarFront, Ruler,
} from 'lucide-react'
import { deleteImovel } from '../actions'

const statusConfig: Record<StatusImovel, { label: string; color: string }> = {
  ativo: { label: 'Ativo', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  inativo: { label: 'Inativo', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
  vendido: { label: 'Vendido', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  locado: { label: 'Locado', color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
}

function formatPrice(value: number | null, finalidade: FinalidadeImovel) {
  if (!value) return '—'
  return `R$ ${value.toLocaleString('pt-BR')}${finalidade === 'locação' ? '/mês' : ''}`
}

export function ImoveisAdminClient({ imoveis }: { imoveis: ImovelComFotos[] }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<StatusImovel | 'todos'>('todos')
  const [filterTipo, setFilterTipo] = useState<TipoImovel | 'todos'>('todos')
  const [view, setView] = useState<'table' | 'grid'>('table')
  const [isPending, startTransition] = useTransition()

  const filtered = imoveis.filter((imovel) => {
    const matchSearch = imovel.titulo.toLowerCase().includes(search.toLowerCase()) ||
      imovel.bairro?.toLowerCase().includes(search.toLowerCase()) ||
      imovel.cidade?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || imovel.status === filterStatus
    const matchTipo = filterTipo === 'todos' || imovel.tipo === filterTipo
    return matchSearch && matchStatus && matchTipo
  })

  function handleDelete(id: string) {
    if (!confirm('Deseja excluir este imóvel?')) return
    startTransition(() => deleteImovel(id))
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">{filtered.length} imóveis cadastrados</p>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Imóvel
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 focus-within:border-accent/30 transition-colors flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por título, bairro ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as StatusImovel | 'todos')}
          className="bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 text-sm text-zinc-300 outline-none cursor-pointer hover:border-white/10 transition-colors"
        >
          <option value="todos">Todos status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="vendido">Vendido</option>
          <option value="locado">Locado</option>
        </select>

        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value as TipoImovel | 'todos')}
          className="bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 text-sm text-zinc-300 outline-none cursor-pointer hover:border-white/10 transition-colors"
        >
          <option value="todos">Todos tipos</option>
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
        </select>

        {/* View Toggle */}
        <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/5 overflow-hidden ml-auto">
          <button
            onClick={() => setView('table')}
            className={cn('px-3 py-2 text-xs font-medium transition-colors', view === 'table' ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}
          >
            Tabela
          </button>
          <button
            onClick={() => setView('grid')}
            className={cn('px-3 py-2 text-xs font-medium transition-colors', view === 'grid' ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Table View */}
      {view === 'table' ? (
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Imóvel</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Localização</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Tipo</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Preço</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Status</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Detalhes</th>
                  <th className="text-right text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((imovel) => (
                  <tr key={imovel.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-700 shrink-0">
                          {imovel.imovel_fotos[0] && (
                            <Image
                              src={imovel.imovel_fotos[0].url}
                              alt={imovel.titulo}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate max-w-[200px]">{imovel.titulo}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{imovel.finalidade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <MapPin className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="truncate max-w-[150px]">{imovel.bairro}, {imovel.cidade}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs capitalize text-zinc-400">{imovel.tipo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-white">{formatPrice(imovel.preco, imovel.finalidade)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md border', statusConfig[imovel.status].color)}>
                        {statusConfig[imovel.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        {imovel.area_m2 && <span className="flex items-center gap-1"><Ruler className="h-3 w-3" />{imovel.area_m2}m²</span>}
                        <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{imovel.quartos}</span>
                        <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{imovel.banheiros}</span>
                        <span className="flex items-center gap-1"><CarFront className="h-3 w-3" />{imovel.vagas}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/imoveis/${imovel.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link href={`/admin/imoveis/${imovel.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(imovel.id)}
                          disabled={isPending}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-zinc-500 text-sm">
              Nenhum imóvel encontrado.
            </div>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((imovel) => (
            <Link
              key={imovel.id}
              href={`/admin/imoveis/${imovel.id}`}
              className="bg-zinc-800/50 rounded-2xl border border-white/5 overflow-hidden hover:border-accent/20 transition-all group"
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                {imovel.imovel_fotos[0] ? (
                  <Image
                    src={imovel.imovel_fotos[0].url}
                    alt={imovel.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                    <span className="text-zinc-500 text-xs">Sem foto</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md border backdrop-blur-sm', statusConfig[imovel.status].color)}>
                    {statusConfig[imovel.status].label}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-sm font-semibold text-white truncate">{imovel.titulo}</p>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="h-3 w-3" />
                  {imovel.bairro}, {imovel.cidade}
                </div>
                <p className="text-base font-bold text-accent">{formatPrice(imovel.preco, imovel.finalidade)}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5 text-[11px] text-zinc-500">
                  {imovel.area_m2 && <span>{imovel.area_m2}m²</span>}
                  <span>{imovel.quartos} qts</span>
                  <span>{imovel.banheiros} ban</span>
                  <span>{imovel.vagas} vag</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
