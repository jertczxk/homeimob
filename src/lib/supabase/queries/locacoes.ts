import { createClient } from '@/lib/supabase/server'
import {
  ContratoComDetalhes, PagamentoComDetalhes,
  RepasseComDetalhes, VistoriaComDetalhes, ManutencaoComDetalhes,
} from '@/types'

export async function getContratos(): Promise<ContratoComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contratos')
    .select(`
      *,
      imovel:imoveis(titulo),
      proprietario:clientes!proprietario_id(nome),
      inquilino:clientes!inquilino_id(nome)
    `)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as ContratoComDetalhes[]
}

export async function getContratoById(id: string): Promise<ContratoComDetalhes | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contratos')
    .select(`
      *,
      imovel:imoveis(titulo),
      proprietario:clientes!proprietario_id(nome),
      inquilino:clientes!inquilino_id(nome)
    `)
    .eq('id', id)
    .single()
  if (error) return null
  return data as ContratoComDetalhes
}

export async function getPagamentos(): Promise<PagamentoComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pagamentos')
    .select(`
      *,
      contrato:contratos(
        valor_aluguel,
        imovel:imoveis(titulo),
        inquilino:clientes!inquilino_id(nome)
      )
    `)
    .order('data_vencimento', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as PagamentoComDetalhes[]
}

export async function getRepasses(): Promise<RepasseComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('repasses')
    .select(`
      *,
      contrato:contratos(
        imovel:imoveis(titulo),
        inquilino:clientes!inquilino_id(nome)
      )
    `)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as RepasseComDetalhes[]
}

export async function getVistorias(): Promise<VistoriaComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vistorias')
    .select(`
      *,
      contrato:contratos(
        imovel:imoveis(titulo),
        inquilino:clientes!inquilino_id(nome)
      )
    `)
    .order('data', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as VistoriaComDetalhes[]
}

export async function getManutencoes(): Promise<ManutencaoComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('manutencoes')
    .select('*, imovel:imoveis(titulo)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as ManutencaoComDetalhes[]
}
