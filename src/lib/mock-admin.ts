import { Lead, LeadInteraction, Atividade, BlogPost } from '@/types'

// ─── CRM Mock Data ───────────────────────────────────────

export const mockLeads: Lead[] = [
    {
        id: 'l1', nome: 'Carlos Alberto', email: 'carlos@email.com', telefone: '(11) 99888-7766',
        interesse: 'venda', tipoInteresse: 'residencial', valorMin: 500000, valorMax: 1000000,
        bairroInteresse: 'Jardins', stage: 'lead', prioridade: 'alta', origem: 'site',
        corretor: 'Ana', notas: 'Procura casa com piscina', created_at: '2024-03-10T10:00:00Z', updated_at: '2024-03-10T10:00:00Z',
    },
    {
        id: 'l2', nome: 'Maria Fernanda', email: 'maria@email.com', telefone: '(11) 98877-6655',
        interesse: 'locação', tipoInteresse: 'residencial', valorMin: 3000, valorMax: 6000,
        bairroInteresse: 'Bela Vista', stage: 'atendimento', prioridade: 'media', origem: 'indicacao',
        corretor: 'João', notas: null, created_at: '2024-03-08T14:00:00Z', updated_at: '2024-03-12T09:00:00Z',
    },
    {
        id: 'l3', nome: 'Roberto Silva', email: 'roberto@empresa.com', telefone: '(11) 97766-5544',
        interesse: 'locação', tipoInteresse: 'comercial', valorMin: 10000, valorMax: 30000,
        bairroInteresse: 'Itaim Bibi', stage: 'visita', prioridade: 'alta', origem: 'portais',
        corretor: 'Ana', notas: 'Precisa de laje corporativa com 10+ vagas', created_at: '2024-03-05T08:00:00Z', updated_at: '2024-03-14T16:00:00Z',
    },
    {
        id: 'l4', nome: 'Luciana Costa', email: 'luciana@email.com', telefone: '(11) 96655-4433',
        interesse: 'venda', tipoInteresse: 'residencial', valorMin: 2000000, valorMax: 5000000,
        bairroInteresse: 'Leblon', stage: 'proposta', prioridade: 'alta', origem: 'whatsapp',
        corretor: 'João', notas: 'Cobertura com vista mar', created_at: '2024-02-28T11:00:00Z', updated_at: '2024-03-15T10:00:00Z',
    },
    {
        id: 'l5', nome: 'André Mendes', email: 'andre@email.com', telefone: '(11) 95544-3322',
        interesse: 'venda', tipoInteresse: 'residencial', valorMin: 800000, valorMax: 1500000,
        bairroInteresse: 'Paulista', stage: 'negociacao', prioridade: 'media', origem: 'telefone',
        corretor: 'Ana', notas: 'Apartamento 3 quartos', created_at: '2024-02-20T09:00:00Z', updated_at: '2024-03-16T14:00:00Z',
    },
    {
        id: 'l6', nome: 'Patricia Gomes', email: 'patricia@email.com', telefone: '(11) 94433-2211',
        interesse: 'locação', tipoInteresse: 'residencial', valorMin: 2000, valorMax: 4000,
        bairroInteresse: 'Centro', stage: 'lead', prioridade: 'baixa', origem: 'site',
        corretor: null, notas: null, created_at: '2024-03-15T16:00:00Z', updated_at: '2024-03-15T16:00:00Z',
    },
    {
        id: 'l7', nome: 'Fernando Alves', email: 'fernando@corp.com', telefone: '(11) 93322-1100',
        interesse: 'venda', tipoInteresse: 'comercial', valorMin: 5000000, valorMax: 15000000,
        bairroInteresse: 'Faria Lima', stage: 'atendimento', prioridade: 'alta', origem: 'presencial',
        corretor: 'Ana', notas: 'Investidor, busca imóvel comercial alto padrão', created_at: '2024-03-12T10:00:00Z', updated_at: '2024-03-14T15:00:00Z',
    },
    {
        id: 'l8', nome: 'Juliana Ramos', email: 'juliana@email.com', telefone: '(11) 92211-0099',
        interesse: 'locação', tipoInteresse: 'residencial', valorMin: 4000, valorMax: 8000,
        bairroInteresse: 'Moema', stage: 'fechamento', prioridade: 'alta', origem: 'indicacao',
        corretor: 'João', notas: 'Contrato assinado! Mudança prevista para abril.', created_at: '2024-01-15T08:00:00Z', updated_at: '2024-03-16T18:00:00Z',
    },
]

export const mockInteractions: LeadInteraction[] = [
    { id: 'i1', lead_id: 'l1', tipo: 'nota', descricao: 'Lead recebido pelo formulário do site.', created_at: '2024-03-10T10:00:00Z' },
    { id: 'i2', lead_id: 'l2', tipo: 'ligacao', descricao: 'Liguei para apresentar opções de locação na Bela Vista.', created_at: '2024-03-09T10:00:00Z' },
    { id: 'i3', lead_id: 'l2', tipo: 'whatsapp', descricao: 'Enviei fotos do apartamento da Alameda Santos.', created_at: '2024-03-12T09:00:00Z' },
    { id: 'i4', lead_id: 'l3', tipo: 'visita', descricao: 'Visitamos a laje corporativa no edifício Platinum.', created_at: '2024-03-14T16:00:00Z' },
    { id: 'i5', lead_id: 'l4', tipo: 'proposta', descricao: 'Proposta enviada: R$ 8.500.000 na cobertura do Leblon.', created_at: '2024-03-15T10:00:00Z' },
    { id: 'i6', lead_id: 'l5', tipo: 'ligacao', descricao: 'Negociando valor e condições de pagamento.', created_at: '2024-03-16T14:00:00Z' },
]

// ─── Dashboard Mock Data ─────────────────────────────────

export const mockAtividades: Atividade[] = [
    { id: 'a1', tipo: 'lead', descricao: 'Novo lead: Carlos Alberto (venda)', created_at: '2024-03-17T10:30:00Z' },
    { id: 'a2', tipo: 'visita', descricao: 'Visita agendada: Roberto Silva — Laje Platinum', created_at: '2024-03-17T09:15:00Z' },
    { id: 'a3', tipo: 'pagamento', descricao: 'Aluguel recebido: Apt Paulista — R$ 6.500', created_at: '2024-03-17T08:00:00Z' },
    { id: 'a4', tipo: 'contrato', descricao: 'Contrato assinado: Juliana Ramos — Moema', created_at: '2024-03-16T18:00:00Z' },
    { id: 'a5', tipo: 'imovel', descricao: 'Novo imóvel cadastrado: Casa Jardins', created_at: '2024-03-16T15:00:00Z' },
    { id: 'a6', tipo: 'lead', descricao: 'Lead movido para Proposta: Luciana Costa', created_at: '2024-03-15T10:00:00Z' },
]

// ─── Blog Mock Data ──────────────────────────────────────

export const mockBlogPosts: BlogPost[] = [
    {
        id: 'b1', titulo: 'Como escolher o bairro ideal para morar', slug: 'como-escolher-bairro-ideal',
        resumo: 'Dicas práticas para avaliar infraestrutura, segurança e qualidade de vida.',
        conteudo: '# Como escolher o bairro ideal\n\nEscolher onde morar é uma das decisões mais importantes...',
        cover_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', status: 'publicado',
        autor: 'Ana', tags: ['dicas', 'moradia'], published_at: '2024-03-10T08:00:00Z',
        created_at: '2024-03-08T10:00:00Z', updated_at: '2024-03-10T08:00:00Z',
    },
    {
        id: 'b2', titulo: '5 erros ao comprar seu primeiro imóvel', slug: '5-erros-comprar-imovel',
        resumo: 'Evite as armadilhas mais comuns na hora de investir em um imóvel.',
        conteudo: '# 5 Erros comuns\n\n1. Não avaliar a documentação...',
        cover_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', status: 'rascunho',
        autor: 'João', tags: ['compra', 'investimento'], published_at: null,
        created_at: '2024-03-14T14:00:00Z', updated_at: '2024-03-14T14:00:00Z',
    },
]

// ─── Charts Mock Data ────────────────────────────────────

export const mockReceitaMensal = [
    { mes: 'Out', valor: 45000 },
    { mes: 'Nov', valor: 52000 },
    { mes: 'Dez', valor: 48000 },
    { mes: 'Jan', valor: 61000 },
    { mes: 'Fev', valor: 58000 },
    { mes: 'Mar', valor: 72000 },
]
