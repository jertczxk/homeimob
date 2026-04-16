import { createClient } from '@/lib/supabase/server'
import { PropostaComDetalhes, VisitaVendaComDetalhes, Captacao } from '@/types'

export async function getPropostas(): Promise<PropostaComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('propostas')
    .select(`
      *,
      imovel:imoveis(titulo, slug),
      comprador:clientes!comprador_id(nome),
      proprietario:clientes!proprietario_id(nome)
    `)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as PropostaComDetalhes[]
}

export async function getVisitasVendas(): Promise<VisitaVendaComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('visitas_vendas')
    .select(`
      *,
      lead:leads(nome),
      imovel:imoveis(titulo, slug)
    `)
    .order('data', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as VisitaVendaComDetalhes[]
}

export async function getCaptacoes(): Promise<Captacao[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('captacoes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Captacao[]
}

export interface VendasRelatorio {
  kpis: {
    vgvTotal: number
    imoveisVendidos: number
    ticketMedio: number
    leadsTotal: number
  }
  vendasMensal: { mes: string; valor: number }[]
  corretores: {
    nome: string
    vendas: number
    vgv: number
    comissao: number
    taxa_conversao: number
  }[]
  origens: { label: string; pct: number; color: string }[]
}

export async function getVendasRelatorio(): Promise<VendasRelatorio> {
  const supabase = await createClient()
  const now = new Date()

  const [propostasRes, leadsRes] = await Promise.all([
    supabase.from('propostas').select('*'),
    supabase.from('leads').select('origem'),
  ])

  const propostas = propostasRes.data ?? []
  const leads = leadsRes.data ?? []

  const propostasAceitas = propostas.filter(p => p.status === 'aceita')
  const vgvTotal = propostasAceitas.reduce((acc, p) => acc + (p.valor_oferta || p.valor_pedido), 0)
  const imoveisVendidos = propostasAceitas.length
  const ticketMedio = imoveisVendidos > 0 ? vgvTotal / imoveisVendidos : 0

  // Vendas mensal (last 6 months)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      mes: d.toLocaleString('pt-BR', { month: 'short' }),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      valor: 0
    }
  })

  for (const p of propostasAceitas) {
    const d = new Date(p.updated_at || p.created_at)
    const bucket = months.find(m => m.monthIndex === d.getMonth() && m.year === d.getFullYear())
    if (bucket) bucket.valor += (p.valor_oferta || p.valor_pedido)
  }

  // Corretores
  const brokerMap: Record<string, any> = {}
  for (const p of propostasAceitas) {
    const broker = p.corretor || 'Sem Corretor'
    if (!brokerMap[broker]) {
      brokerMap[broker] = { nome: broker, vendas: 0, vgv: 0, comissao: 0, leads: 0 }
    }
    brokerMap[broker].vendas += 1
    brokerMap[broker].vgv += (p.valor_oferta || p.valor_pedido)
    brokerMap[broker].comissao += (p.valor_oferta || p.valor_pedido) * 0.03 // Mock 3% comissão
  }

  const corretoresData = Object.values(brokerMap).map(c => ({
    ...c,
    taxa_conversao: Math.round((c.vendas / (leads.length || 1)) * 100), // Very rough estimate
  }))

  // Origens
  const originCounts: Record<string, number> = {}
  leads.forEach(l => {
    const o = l.origem || 'Outros'
    originCounts[o] = (originCounts[o] || 0) + 1
  })

  const totalLeads = leads.length || 1
  const origensData = Object.entries(originCounts).map(([label, count]) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    pct: Math.round((count / totalLeads) * 100),
    color: label === 'site' ? 'bg-accent' : label === 'whatsapp' ? 'bg-emerald-500' : 'bg-blue-500'
  })).sort((a, b) => b.pct - a.pct)

  return {
    kpis: {
      vgvTotal,
      imoveisVendidos,
      ticketMedio,
      leadsTotal: leads.length,
    },
    vendasMensal: months.map(({ mes, valor }) => ({ mes, valor })),
    corretores: corretoresData,
    origens: origensData,
  }
}
