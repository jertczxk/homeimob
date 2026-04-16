import { createClient } from '@/lib/supabase/server'
import { Atividade } from '@/types'

export interface DashboardStats {
  imoveisAtivos: number
  alugueisAVencer: number
  leadsNoMes: number
  receitaMensal: { mes: string; valor: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  // Use a stable reference for "now"
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [imoveisRes, pagamentosRes, leadsRes, receitaRes] = await Promise.all([
    supabase.from('imoveis').select('id', { count: 'exact', head: true }).eq('status', 'ativo'),
    supabase.from('pagamentos').select('id', { count: 'exact', head: true })
      .eq('status', 'pendente'),
    supabase.from('leads').select('id', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString()),
    // Fetch paid payments from the last 6 months
    supabase.from('pagamentos')
      .select('valor, data_pagamento')
      .eq('status', 'pago')
      .gte('data_pagamento', new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()),
  ])

  // Build last-6-months revenue buckets (using 1st of each month to avoid month-end issues)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      mes: d.toLocaleString('pt-BR', { month: 'short' }),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      valor: 0
    }
  })

  for (const p of receitaRes.data ?? []) {
    if (!p.data_pagamento) continue
    const d = new Date(p.data_pagamento)
    const bucket = months.find(m => m.monthIndex === d.getMonth() && m.year === d.getFullYear())
    if (bucket) bucket.valor += p.valor
  }

  return {
    imoveisAtivos: imoveisRes.count ?? 0,
    alugueisAVencer: pagamentosRes.count ?? 0,
    leadsNoMes: leadsRes.count ?? 0,
    receitaMensal: months.map(({ mes, valor }) => ({ mes, valor })),
  }
}

export async function getAtividades(): Promise<Atividade[]> {
  const supabase = await createClient()

  const [leadsRes, contratosRes, pagamentosRes, imoveisRes] = await Promise.all([
    supabase.from('leads').select('id,nome,created_at').order('created_at', { ascending: false }).limit(3),
    supabase.from('contratos').select('id,status,created_at').order('created_at', { ascending: false }).limit(2),
    supabase.from('pagamentos').select('id,valor,status,created_at').eq('status', 'pago').order('data_pagamento', { ascending: false }).limit(2),
    supabase.from('imoveis').select('id,titulo,created_at').order('created_at', { ascending: false }).limit(2),
  ])

  const atividades: Atividade[] = [
    ...(leadsRes.data ?? []).map(l => ({
      id: l.id, tipo: 'lead' as const,
      descricao: `Novo lead: ${l.nome}`,
      created_at: l.created_at,
    })),
    ...(contratosRes.data ?? []).map(c => ({
      id: c.id, tipo: 'contrato' as const,
      descricao: `Contrato ${c.status}`,
      created_at: c.created_at,
    })),
    ...(pagamentosRes.data ?? []).map(p => ({
      id: p.id, tipo: 'pagamento' as const,
      descricao: `Aluguel recebido — R$ ${p.valor.toLocaleString('pt-BR')}`,
      created_at: p.created_at,
    })),
    ...(imoveisRes.data ?? []).map(i => ({
      id: i.id, tipo: 'imovel' as const,
      descricao: `Novo imóvel: ${i.titulo}`,
      created_at: i.created_at,
    })),
  ]

  return atividades.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 6)
}
