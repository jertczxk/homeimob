import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PapelCliente } from '@/types'
import { getClienteById } from '@/lib/supabase/queries/clientes'
import {
  ArrowLeft, User, Building2, Mail, Phone, MapPin, Edit,
} from 'lucide-react'

const papelConfig: Record<PapelCliente, { label: string; color: string }> = {
  proprietario: { label: 'Proprietário', color: 'bg-blue-500/15 text-blue-400' },
  inquilino: { label: 'Inquilino', color: 'bg-purple-500/15 text-purple-400' },
  comprador: { label: 'Comprador', color: 'bg-emerald-500/15 text-emerald-400' },
  vendedor: { label: 'Vendedor', color: 'bg-amber-500/15 text-amber-400' },
}

export const revalidate = 0

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cliente = await getClienteById(id)

  if (!cliente) notFound()

  return (
    <div className="max-w-[1200px] space-y-6">
      <Link href="/admin/clientes" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm w-fit">
        <ArrowLeft className="h-4 w-4" />Voltar para Clientes
      </Link>

      <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold', cliente.tipo_pessoa === 'PJ' ? 'bg-blue-500/10 text-blue-400' : 'bg-accent/10 text-accent')}>
              {cliente.nome.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{cliente.nome}</h1>
              <p className="text-xs text-zinc-500 mt-0.5">{cliente.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}{cliente.cpf_cnpj && ` · ${cliente.cpf_cnpj}`}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {cliente.papeis.map(p => (
                  <span key={p} className={cn('text-[10px] font-bold px-2 py-0.5 rounded', papelConfig[p].color)}>{papelConfig[p].label}</span>
                ))}
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white/5 text-zinc-300 px-4 py-2 rounded-xl text-sm hover:bg-white/10 transition-colors border border-white/5">
            <Edit className="h-4 w-4" />Editar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <Phone className="h-4 w-4 text-zinc-600" />{cliente.telefone}
          </div>
          {cliente.email && (
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Mail className="h-4 w-4 text-zinc-600" />{cliente.email}
            </div>
          )}
          {cliente.endereco && (
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <MapPin className="h-4 w-4 text-zinc-600" />{cliente.endereco}
            </div>
          )}
        </div>
        {cliente.notas && (
          <p className="text-sm text-zinc-500 mt-4 bg-white/[0.02] rounded-lg px-4 py-3 italic">{cliente.notas}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-8 text-center">
            <p className="text-zinc-500 text-sm">Contratos e pagamentos disponíveis na tela de Locações</p>
          </div>
        </div>

        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Cliente desde</span>
            <span className="text-white font-medium">{new Date(cliente.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Última atualização</span>
            <span className="text-white font-medium">{new Date(cliente.updated_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
