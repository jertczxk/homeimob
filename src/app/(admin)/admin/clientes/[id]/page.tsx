'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Cliente, PapelCliente } from '@/types'
import {
    ArrowLeft, User, Building2, Mail, Phone, MapPin, FileText, Calendar,
    Edit, DollarSign, Home, Wrench, Clock, CheckCircle, AlertTriangle,
} from 'lucide-react'

const papelConfig: Record<PapelCliente, { label: string; color: string }> = {
    proprietario: { label: 'Proprietário', color: 'bg-blue-500/15 text-blue-400' },
    inquilino: { label: 'Inquilino', color: 'bg-purple-500/15 text-purple-400' },
    comprador: { label: 'Comprador', color: 'bg-emerald-500/15 text-emerald-400' },
    vendedor: { label: 'Vendedor', color: 'bg-amber-500/15 text-amber-400' },
}

// Extended mock data for detail
const mockClientes: (Cliente & { contratos: any[]; pagamentos: any[]; interacoes: any[] })[] = [
    {
        id: 'c1', nome: 'Carlos Alberto Santos', tipo_pessoa: 'PF', cpf_cnpj: '123.456.789-00',
        email: 'carlos@email.com', telefone: '(11) 99888-7766', endereco: 'Rua das Flores, 123 — Jardins, SP',
        papeis: ['comprador'], notas: 'Procura casa com piscina na região dos Jardins. Budget entre R$ 2M e R$ 4M.',
        created_at: '2024-03-10T10:00:00Z', updated_at: '2024-03-10T10:00:00Z',
        contratos: [],
        pagamentos: [],
        interacoes: [
            { id: 'i1', tipo: 'visita', descricao: 'Visita ao imóvel Casa Espetacular — Jardins', data: '2024-03-15' },
            { id: 'i2', tipo: 'proposta', descricao: 'Proposta de R$ 3.200.000 para Casa Espetacular — Jardins', data: '2024-03-15' },
            { id: 'i3', tipo: 'ligacao', descricao: 'Ligação de follow-up — Interessado em agendar 2ª visita', data: '2024-03-12' },
            { id: 'i4', tipo: 'whatsapp', descricao: 'Primeiro contato via site — Buscando casa com piscina', data: '2024-03-10' },
        ],
    },
    {
        id: 'c2', nome: 'Maria Fernanda Lima', tipo_pessoa: 'PF', cpf_cnpj: '987.654.321-00',
        email: 'maria@email.com', telefone: '(11) 98877-6655', endereco: 'Av. Paulista, 1000 — Bela Vista, SP',
        papeis: ['inquilino'], notas: null,
        created_at: '2024-03-08T14:00:00Z', updated_at: '2024-03-12T09:00:00Z',
        contratos: [
            { id: 'ct1', imovel: 'Apt. Moderno — Bela Vista', valor: 6500, status: 'ativo', inicio: '2024-01-15', fim: '2025-01-14' },
        ],
        pagamentos: [
            { ref: '03/2024', valor: 6500, status: 'pago', data: '2024-03-08' },
            { ref: '02/2024', valor: 6500, status: 'pago', data: '2024-02-10' },
            { ref: '01/2024', valor: 6500, status: 'pago', data: '2024-01-09' },
        ],
        interacoes: [
            { id: 'i5', tipo: 'nota', descricao: 'Solicitou reparo na torneira da cozinha', data: '2024-03-12' },
            { id: 'i6', tipo: 'email', descricao: 'Boleto de aluguel 03/2024 enviado', data: '2024-03-01' },
        ],
    },
    {
        id: 'c3', nome: 'Investimentos Globo Ltda', tipo_pessoa: 'PJ', cpf_cnpj: '12.345.678/0001-00',
        email: 'contato@globo.com', telefone: '(11) 3000-0000', endereco: 'Av. Faria Lima, 3000 — Itaim Bibi, SP',
        papeis: ['proprietario', 'vendedor'], notas: 'Empresa de investimentos imobiliários. Possui 2 imóveis conosco.',
        created_at: '2024-02-15T10:00:00Z', updated_at: '2024-03-14T16:00:00Z',
        contratos: [
            { id: 'ct2', imovel: 'Laje Corp. — Itaim Bibi', valor: 25000, status: 'vencido', inicio: '2023-06-01', fim: '2024-05-31' },
        ],
        pagamentos: [
            { ref: '03/2024', valor: 25000, status: 'atrasado', data: null },
            { ref: '02/2024', valor: 25000, status: 'pago', data: '2024-02-04' },
        ],
        interacoes: [
            { id: 'i7', tipo: 'email', descricao: 'Aviso de inadimplência — aluguel 03/2024', data: '2024-03-10' },
            { id: 'i8', tipo: 'visita', descricao: 'Vistoria periódica — Laje Corp.', data: '2024-03-05' },
        ],
    },
    {
        id: 'c4', nome: 'Roberto Silva Oliveira', tipo_pessoa: 'PF', cpf_cnpj: '456.789.012-33',
        email: 'roberto@empresa.com', telefone: '(11) 97766-5544', endereco: 'Rua Augusta, 500 — Consolação, SP',
        papeis: ['proprietario'], notas: 'Possui 3 imóveis conosco.',
        created_at: '2024-01-20T08:00:00Z', updated_at: '2024-03-05T11:00:00Z',
        contratos: [
            { id: 'ct1', imovel: 'Apt. Moderno — Bela Vista', valor: 6500, status: 'ativo', inicio: '2024-01-15', fim: '2025-01-14' },
        ],
        pagamentos: [],
        interacoes: [
            { id: 'i9', tipo: 'ligacao', descricao: 'Informado sobre repasse 03/2024', data: '2024-03-12' },
        ],
    },
    {
        id: 'c5', nome: 'Luciana Costa Pereira', tipo_pessoa: 'PF', cpf_cnpj: '789.012.345-66',
        email: 'luciana@email.com', telefone: '(11) 96655-4433', endereco: 'Av. Delfim Moreira — Leblon, RJ',
        papeis: ['comprador'], notas: 'Busca cobertura no Leblon. Budget até R$ 10M.',
        created_at: '2024-02-28T11:00:00Z', updated_at: '2024-03-15T10:00:00Z',
        contratos: [],
        pagamentos: [],
        interacoes: [
            { id: 'i10', tipo: 'visita', descricao: 'Visitou Cobertura Duplex — Leblon', data: '2024-03-14' },
            { id: 'i11', tipo: 'whatsapp', descricao: 'Contato inicial — Interesse em cobertura no Leblon', data: '2024-02-28' },
        ],
    },
]

const interacaoConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    visita: { label: 'Visita', color: 'bg-blue-500', icon: Home },
    proposta: { label: 'Proposta', color: 'bg-emerald-500', icon: DollarSign },
    ligacao: { label: 'Ligação', color: 'bg-purple-500', icon: Phone },
    whatsapp: { label: 'WhatsApp', color: 'bg-green-500', icon: Phone },
    email: { label: 'E-mail', color: 'bg-amber-500', icon: Mail },
    nota: { label: 'Nota', color: 'bg-zinc-500', icon: FileText },
}

export default function ClienteDetailPage() {
    const params = useParams()
    const cliente = mockClientes.find(c => c.id === params.id)

    if (!cliente) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-zinc-500">Cliente não encontrado</p>
            </div>
        )
    }

    return (
        <div className="max-w-[1200px] space-y-6">
            {/* Back */}
            <Link href="/admin/clientes" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm w-fit">
                <ArrowLeft className="h-4 w-4" />Voltar para Clientes
            </Link>

            {/* Profile Header */}
            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                        <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold', cliente.tipo_pessoa === 'PJ' ? 'bg-blue-500/10 text-blue-400' : 'bg-accent/10 text-accent')}>
                            {cliente.nome.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{cliente.nome}</h1>
                            <p className="text-xs text-zinc-500 mt-0.5">{cliente.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'} · {cliente.cpf_cnpj}</p>
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

                {/* Contact info */}
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
                {/* Left: Contracts + Payments */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contratos */}
                    {cliente.contratos.length > 0 && (
                        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6">
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-accent" />Contratos
                            </h3>
                            <div className="space-y-3">
                                {cliente.contratos.map((ct: any) => (
                                    <div key={ct.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.03]">
                                        <div>
                                            <p className="text-sm font-semibold text-white">{ct.imovel}</p>
                                            <p className="text-[11px] text-zinc-500 mt-0.5">
                                                {new Date(ct.inicio).toLocaleDateString('pt-BR')} — {new Date(ct.fim).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-bold text-white">R$ {ct.valor.toLocaleString('pt-BR')}<span className="text-zinc-600 text-[10px]">/mês</span></p>
                                            <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md', ct.status === 'ativo' ? 'bg-emerald-500/15 text-emerald-400' : ct.status === 'vencido' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-500/15 text-zinc-400')}>
                                                {ct.status.charAt(0).toUpperCase() + ct.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pagamentos recentes */}
                    {cliente.pagamentos.length > 0 && (
                        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6">
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-accent" />Pagamentos Recentes
                            </h3>
                            <div className="space-y-2">
                                {cliente.pagamentos.map((pg: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-zinc-500 font-mono w-16">{pg.ref}</span>
                                            <span className="text-sm text-white font-semibold">R$ {pg.valor.toLocaleString('pt-BR')}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {pg.data && <span className="text-[11px] text-zinc-600">{new Date(pg.data).toLocaleDateString('pt-BR')}</span>}
                                            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1',
                                                pg.status === 'pago' ? 'bg-emerald-500/15 text-emerald-400' :
                                                    pg.status === 'atrasado' ? 'bg-red-500/15 text-red-400' :
                                                        'bg-amber-500/15 text-amber-400'
                                            )}>
                                                {pg.status === 'pago' ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                                                {pg.status.charAt(0).toUpperCase() + pg.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {cliente.contratos.length === 0 && cliente.pagamentos.length === 0 && (
                        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-8 text-center">
                            <p className="text-zinc-500 text-sm">Nenhum contrato ou pagamento registrado</p>
                        </div>
                    )}
                </div>

                {/* Right: Timeline */}
                <div className="space-y-6">
                    <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-accent" />Timeline
                        </h3>
                        <div className="space-y-4">
                            {cliente.interacoes.map((int: any, i: number) => {
                                const cfg = interacaoConfig[int.tipo] || interacaoConfig.nota
                                const Ico = cfg.icon
                                return (
                                    <div key={int.id} className="flex gap-3">
                                        <div className="flex flex-col items-center pt-0.5">
                                            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', cfg.color + '/15')}>
                                                <Ico className="h-3.5 w-3.5 text-white/70" />
                                            </div>
                                            {i < cliente.interacoes.length - 1 && <div className="w-px flex-1 bg-white/5 mt-1" />}
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-sm text-white">{int.descricao}</p>
                                            <p className="text-[10px] text-zinc-600 mt-1">{new Date(int.data).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quick info */}
                    <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Cliente desde</span>
                            <span className="text-white font-medium">{new Date(cliente.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Última atualização</span>
                            <span className="text-white font-medium">{new Date(cliente.updated_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Interações</span>
                            <span className="text-white font-medium">{cliente.interacoes.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
