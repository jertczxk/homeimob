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

// ─── Repasse Types ───────────────────────────────────────

export interface Repasse {
    id: string
    contrato_id: string
    mes_referencia: string
    valor_bruto: number
    taxa_administracao: number
    valor_liquido: number
    data_repasse: string | null
    status: 'pendente' | 'realizado' | 'cancelado'
    created_at: string
}

// ─── Manutencao Types ────────────────────────────────────

export interface Manutencao {
    id: string
    imovel_id: string
    titulo: string
    descricao: string | null
    status: 'aberta' | 'em_andamento' | 'concluida' | 'cancelada'
    custo: number | null
    data_abertura: string
    data_conclusao: string | null
    created_at: string
}

// ─── Vistoria Types ──────────────────────────────────────

export interface Vistoria {
    id: string
    contrato_id: string
    tipo: 'entrada' | 'saida' | 'periodica'
    data: string
    laudo: string | null
    created_at: string
}

// ─── Proposta Types ──────────────────────────────────────

export interface Proposta {
    id: string
    imovel_id: string | null
    comprador_id: string | null
    proprietario_id: string | null
    imovel_descricao: string | null
    comprador_nome: string | null
    proprietario_nome: string | null
    valor_pedido: number
    valor_oferta: number
    contraproposta: number | null
    data: string
    validade: string
    status: 'aguardando' | 'contraproposta' | 'aceita' | 'recusada' | 'expirada'
    corretor: string | null
    created_at: string
    updated_at: string
}

// ─── VisitaVenda Types ───────────────────────────────────

export interface VisitaVenda {
    id: string
    lead_id: string | null
    imovel_id: string | null
    data: string
    status: 'agendada' | 'realizada' | 'cancelada'
    corretor: string | null
    notas: string | null
    created_at: string
}

// ─── Captacao Types ──────────────────────────────────────

export interface Captacao {
    id: string
    endereco: string
    proprietario: string
    telefone: string
    tipo: string
    valor_estimado: number
    status: 'prospectando' | 'em_avaliacao' | 'autorizado' | 'recusado'
    corretor: string | null
    data: string
    created_at: string
}

// ─── Extended (join) types ────────────────────────────────

export interface ContratoComDetalhes extends Contrato {
    imovel: { titulo: string } | null
    proprietario: { nome: string } | null
    inquilino: { nome: string } | null
}

export interface PagamentoComDetalhes extends Pagamento {
    contrato: {
        valor_aluguel: number
        imovel: { titulo: string } | null
        inquilino: { nome: string } | null
    } | null
}

export interface RepasseComDetalhes extends Repasse {
    contrato: {
        imovel: { titulo: string } | null
        inquilino: { nome: string } | null
    } | null
}

export interface VistoriaComDetalhes extends Vistoria {
    contrato: {
        imovel: { titulo: string } | null
        inquilino: { nome: string } | null
    } | null
}

export interface ManutencaoComDetalhes extends Manutencao {
    imovel: { titulo: string } | null
}

export interface PropostaComDetalhes extends Proposta {
    imovel: { titulo: string; slug: string } | null
    comprador: { nome: string } | null
    proprietario: { nome: string } | null
}

export interface VisitaVendaComDetalhes extends VisitaVenda {
    lead: { nome: string } | null
    imovel: { titulo: string; slug: string } | null
}
