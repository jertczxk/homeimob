'use client'

import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { Cliente, PapelCliente } from '@/types'
import Link from 'next/link'
import {
  Plus, Search, Building2, User, Phone, Mail,
  MoreHorizontal, Eye, Edit,
} from 'lucide-react'
import { createCliente } from '../actions'

const papelConfig: Record<PapelCliente, { label: string; color: string }> = {
  proprietario: { label: 'Proprietário', color: 'bg-blue-500/15 text-blue-400' },
  inquilino: { label: 'Inquilino', color: 'bg-purple-500/15 text-purple-400' },
  comprador: { label: 'Comprador', color: 'bg-emerald-500/15 text-emerald-400' },
  vendedor: { label: 'Vendedor', color: 'bg-amber-500/15 text-amber-400' },
}

const inputClass = "w-full bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-accent/30 transition-colors"
const selectClass = "w-full bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-accent/30 transition-colors cursor-pointer"

export function ClientesAdminClient({ clientes }: { clientes: Cliente[] }) {
  const [search, setSearch] = useState('')
  const [filterPapel, setFilterPapel] = useState<PapelCliente | 'todos'>('todos')
  const [showModal, setShowModal] = useState(false)
  const [isPending, startTransition] = useTransition()

  const filtered = clientes.filter((c) => {
    const matchSearch = c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.telefone.includes(search)
    const matchPapel = filterPapel === 'todos' || c.papeis.includes(filterPapel)
    return matchSearch && matchPapel
  })

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await createCliente(formData)
      setShowModal(false)
    })
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">{filtered.length} clientes cadastrados</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 focus-within:border-accent/30 transition-colors flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full"
          />
        </div>
        <select
          value={filterPapel}
          onChange={(e) => setFilterPapel(e.target.value as PapelCliente | 'todos')}
          className="bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 text-sm text-zinc-300 outline-none cursor-pointer hover:border-white/10 transition-colors"
        >
          <option value="todos">Todos papéis</option>
          <option value="proprietario">Proprietário</option>
          <option value="inquilino">Inquilino</option>
          <option value="comprador">Comprador</option>
          <option value="vendedor">Vendedor</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cliente) => (
          <div key={cliente.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-accent/15 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', cliente.tipo_pessoa === 'PJ' ? 'bg-blue-500/10' : 'bg-accent/10')}>
                  {cliente.tipo_pessoa === 'PJ'
                    ? <Building2 className="h-5 w-5 text-blue-400" />
                    : <User className="h-5 w-5 text-accent" />
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{cliente.nome}</p>
                  <p className="text-[10px] text-zinc-500 uppercase">{cliente.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}</p>
                </div>
              </div>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Phone className="h-3.5 w-3.5 text-zinc-600" />
                {cliente.telefone}
              </div>
              {cliente.email && (
                <div className="flex items-center gap-2 text-sm text-zinc-400 truncate">
                  <Mail className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                  {cliente.email}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {cliente.papeis.map((papel) => (
                <span key={papel} className={cn('text-[10px] font-bold px-2 py-0.5 rounded', papelConfig[papel].color)}>
                  {papelConfig[papel].label}
                </span>
              ))}
            </div>

            {cliente.notas && (
              <p className="text-xs text-zinc-500 italic mb-3 line-clamp-2">{cliente.notas}</p>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[10px] text-zinc-600">
                Desde {new Date(cliente.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
              </span>
              <div className="flex items-center gap-1">
                <Link href={`/admin/clientes/${cliente.id}`} className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                  <Eye className="h-3.5 w-3.5" />
                </Link>
                <Link href={`/admin/clientes/${cliente.id}`} className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                  <Edit className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleCreate} className="bg-zinc-900 rounded-2xl border border-white/5 w-full max-w-lg p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Novo Cliente</h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors text-xl">×</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Nome completo</label>
                  <input name="nome" required className={inputClass} placeholder="Nome do cliente" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Tipo</label>
                  <select name="tipo_pessoa" className={selectClass} defaultValue="PF">
                    <option value="PF">Pessoa Física</option>
                    <option value="PJ">Pessoa Jurídica</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">CPF/CNPJ</label>
                  <input name="cpf_cnpj" className={inputClass} placeholder="000.000.000-00" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Telefone</label>
                  <input name="telefone" required className={inputClass} placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">E-mail</label>
                  <input name="email" type="email" className={inputClass} placeholder="email@exemplo.com" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Endereço</label>
                  <input name="endereco" className={inputClass} placeholder="Rua, número — bairro, cidade" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Notas</label>
                  <textarea name="notas" className={cn(inputClass, 'min-h-[80px] resize-y')} placeholder="Observações sobre o cliente..." />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white/5 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors border border-white/5">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending} className="flex-1 bg-accent text-accent-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50">
                  {isPending ? 'Salvando...' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
