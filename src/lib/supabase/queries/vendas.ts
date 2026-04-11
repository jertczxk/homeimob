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
