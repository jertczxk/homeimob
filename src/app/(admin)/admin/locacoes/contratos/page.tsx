'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { StatusContrato, Contrato } from '@/types'
import {
    Plus, Search, FileText, Calendar, DollarSign, User, Building2,
    Eye, Edit, MoreHorizontal, AlertTriangle, CheckCircle, XCircle, Clock,
} from 'lucide-react'

const statusConfig: Record<StatusContrato, { label: string; color: string; icon: React.ElementType }> = {
    ativo: { label: 'Ativo', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
    encerrado: { label: 'Encerrado', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20', icon: XCircle },
    rescindido: { label: 'Rescindido', color: 'bg-red-500/15 text-red-400 border-red-500/20', icon: AlertTriangle },
    vencido: { label: 'Vencido', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: Clock },
}

interface ContratoMock extends Contrato {
    imovel_titulo: string
    proprietario_nome: string
    inquilino_nome: string
}

const mockContratos: ContratoMock[] = [
    {
        id: 'ct1', imovel_id: '2', proprietario_id: 'c4', inquilino_id: 'c2',
        valor_aluguel: 6500, data_inicio: '2024-01-15', data_fim: '2025-01-14',
        dia_vencimento: 10, taxa_administracao: 10, status: 'ativo',
        created_at: '2024-01-10T10:00:00Z', updated_at: '2024-03-10T10:00:00Z',
        imovel_titulo: 'Apartamento Moderno e Mobiliado', proprietario_nome: 'Roberto Silva Oliveira', inquilino_nome: 'Maria Fernanda Lima',
    },
    {
        id: 'ct2', imovel_id: '3', proprietario_id: 'c3', inquilino_id: 'c1',
        valor_aluguel: 25000, data_inicio: '2023-06-01', data_fim: '2024-05-31',
        dia_vencimento: 5, taxa_administracao: 8, status: 'vencido',
        created_at: '2023-05-20T10:00:00Z', updated_at: '2024-06-01T10:00:00Z',
        imovel_titulo: 'Laje Corporativa Alto Padrão', proprietario_nome: 'Investimentos Globo Ltda', inquilino_nome: 'Carlos Alberto Santos',
    },
    {
        id: 'ct3', imovel_id: '2', proprietario_id: 'c4', inquilino_id: 'c5',
        valor_aluguel: 4200, data_inicio: '2023-01-01', data_fim: '2023-12-31',
        dia_vencimento: 15, taxa_administracao: 10, status: 'encerrado',
        created_at: '2022-12-15T10:00:00Z', updated_at: '2024-01-05T10:00:00Z',
        imovel_titulo: 'Apartamento Moderno e Mobiliado', proprietario_nome: 'Roberto Silva Oliveira', inquilino_nome: 'Luciana Costa Pereira',
    },
]

export default function ContratosPage() {
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<StatusContrato | 'todos'>('todos')

    const filtered = mockContratos.filter(c => {
        const matchSearch = c.imovel_titulo.toLowerCase().includes(search.toLowerCase()) ||
            c.proprietario_nome.toLowerCase().includes(search.toLowerCase()) ||
            c.inquilino_nome.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === 'todos' || c.status === filterStatus
        return matchSearch && matchStatus
    })

    const ativos = mockContratos.filter(c => c.status === 'ativo').length
    const receitaMensal = mockContratos.filter(c => c.status === 'ativo').reduce((acc, c) => acc + c.valor_aluguel, 0)

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* KPI Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Contratos Ativos</p>
                    <p className="text-2xl font-bold text-white mt-1">{ativos}</p>
                </div>
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Receita Mensal</p>
                    <p className="text-2xl font-bold text-accent mt-1">R$ {receitaMensal.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Comissão Média</p>
                    <p className="text-2xl font-bold text-white mt-1">9.3%</p>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-zinc-500">{filtered.length} contratos</p>
                <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
                    <Plus className="h-4 w-4" />Novo Contrato
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 focus-within:border-accent/30 transition-colors flex-1 min-w-[200px] max-w-md">
                    <Search className="h-4 w-4 text-zinc-500" />
                    <input type="text" placeholder="Buscar por imóvel, proprietário ou inquilino..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as StatusContrato | 'todos')} className="bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 text-sm text-zinc-300 outline-none cursor-pointer">
                    <option value="todos">Todos status</option>
                    <option value="ativo">Ativo</option>
                    <option value="encerrado">Encerrado</option>
                    <option value="rescindido">Rescindido</option>
                    <option value="vencido">Vencido</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-zinc-800/30 rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Imóvel</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Proprietário</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Inquilino</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Aluguel</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Vigência</th>
                                <th className="text-left text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Status</th>
                                <th className="text-right text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-4 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => {
                                const cfg = statusConfig[c.status]
                                const StatusIcon = cfg.icon
                                return (
                                    <tr key={c.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-zinc-600" />
                                                <span className="text-sm text-white font-medium truncate max-w-[180px]">{c.imovel_titulo}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-zinc-400">{c.proprietario_nome}</td>
                                        <td className="px-4 py-3 text-sm text-zinc-400">{c.inquilino_nome}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-semibold text-white">R$ {c.valor_aluguel.toLocaleString('pt-BR')}</span>
                                            <span className="text-[10px] text-zinc-600 ml-1">({c.taxa_administracao}%)</span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-zinc-500">
                                            {new Date(c.data_inicio).toLocaleDateString('pt-BR')} — {new Date(c.data_fim).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1 w-fit', cfg.color)}>
                                                <StatusIcon className="h-3 w-3" />{cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"><Eye className="h-4 w-4" /></button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"><Edit className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
