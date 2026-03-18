export type TipoImovel = 'residencial' | 'comercial'
export type FinalidadeImovel = 'venda' | 'locação'
export type StatusImovel = 'ativo' | 'inativo' | 'vendido' | 'locado'

export interface Imovel {
    id: string
    slug: string
    titulo: string
    descricao: string | null
    tipo: TipoImovel
    finalidade: FinalidadeImovel
    preco: number | null
    area_m2: number | null
    quartos: number
    banheiros: number
    vagas: number
    endereco: string | null
    bairro: string | null
    cidade: string | null
    uf: string | null
    cep: string | null
    latitude: number | null
    longitude: number | null
    destaque: boolean
    status: StatusImovel
    created_at: string
    updated_at: string
}

export interface ImovelFoto {
    id: string
    imovel_id: string
    url: string
    ordem: number
    created_at: string
}

export interface ImovelComFotos extends Imovel {
    imovel_fotos: ImovelFoto[]
}

// ─── CRM Types ───────────────────────────────────────────

export type LeadStage = 'lead' | 'atendimento' | 'visita' | 'proposta' | 'negociacao' | 'fechamento'
export type LeadPriority = 'alta' | 'media' | 'baixa'
export type LeadOrigin = 'site' | 'indicacao' | 'portais' | 'telefone' | 'whatsapp' | 'presencial'

export interface Lead {
    id: string
    nome: string
    email: string | null
    telefone: string
    interesse: FinalidadeImovel
    tipoInteresse: TipoImovel | null
    valorMin: number | null
    valorMax: number | null
    bairroInteresse: string | null
    stage: LeadStage
    prioridade: LeadPriority
    origem: LeadOrigin
    corretor: string | null
    notas: string | null
    created_at: string
    updated_at: string
}

export interface LeadInteraction {
    id: string
    lead_id: string
    tipo: 'ligacao' | 'whatsapp' | 'email' | 'visita' | 'proposta' | 'nota'
    descricao: string
    created_at: string
}

// ─── Cliente Types ───────────────────────────────────────

export type TipoPessoa = 'PF' | 'PJ'
export type PapelCliente = 'proprietario' | 'inquilino' | 'comprador' | 'vendedor'

export interface Cliente {
    id: string
    nome: string
    tipo_pessoa: TipoPessoa
    cpf_cnpj: string | null
    email: string | null
    telefone: string
    endereco: string | null
    papeis: PapelCliente[]
    notas: string | null
    created_at: string
    updated_at: string
}

// ─── Contrato Types ──────────────────────────────────────

export type StatusContrato = 'ativo' | 'encerrado' | 'rescindido' | 'vencido'

export interface Contrato {
    id: string
    imovel_id: string
    proprietario_id: string
    inquilino_id: string
    valor_aluguel: number
    data_inicio: string
    data_fim: string
    dia_vencimento: number
    taxa_administracao: number // percentual
    status: StatusContrato
    created_at: string
    updated_at: string
}

// ─── Pagamento Types ─────────────────────────────────────

export type StatusPagamento = 'pendente' | 'pago' | 'atrasado' | 'cancelado'

export interface Pagamento {
    id: string
    contrato_id: string
    referencia: string // ex: "03/2024"
    valor: number
    data_vencimento: string
    data_pagamento: string | null
    status: StatusPagamento
    created_at: string
}

// ─── Blog Types ──────────────────────────────────────────

export type StatusPost = 'rascunho' | 'publicado' | 'agendado'

export interface BlogPost {
    id: string
    titulo: string
    slug: string
    resumo: string | null
    conteudo: string
    cover_url: string | null
    status: StatusPost
    autor: string
    tags: string[]
    published_at: string | null
    created_at: string
    updated_at: string
}

// ─── Dashboard Types ─────────────────────────────────────

export interface DashboardKPI {
    label: string
    value: string | number
    change: number // percentual de variação
    icon: string
}

export interface Atividade {
    id: string
    tipo: 'lead' | 'contrato' | 'pagamento' | 'visita' | 'imovel'
    descricao: string
    created_at: string
}
