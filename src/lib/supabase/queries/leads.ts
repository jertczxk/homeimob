import { createClient } from '@/lib/supabase/server'
import { Lead, LeadInteraction } from '@/types'

// DB uses snake_case, Lead type uses camelCase for some fields
function mapLead(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    nome: row.nome as string,
    email: row.email as string | null,
    telefone: row.telefone as string,
    interesse: row.interesse as Lead['interesse'],
    tipoInteresse: row.tipo_interesse as Lead['tipoInteresse'],
    valorMin: row.valor_min as number | null,
    valorMax: row.valor_max as number | null,
    bairroInteresse: row.bairro_interesse as string | null,
    stage: row.stage as Lead['stage'],
    prioridade: row.prioridade as Lead['prioridade'],
    origem: row.origem as Lead['origem'],
    corretor: row.corretor as string | null,
    notas: row.notas as string | null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}

export async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapLead)
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads').select('*').eq('id', id).single()
  if (error) return null
  return mapLead(data)
}

export async function getLeadInteractions(leadId: string): Promise<LeadInteraction[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lead_interactions')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as LeadInteraction[]
}

export async function getAllLeadInteractions(): Promise<LeadInteraction[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lead_interactions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as LeadInteraction[]
}
