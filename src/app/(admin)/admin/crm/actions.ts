'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Lead, LeadStage, LeadInteraction } from '@/types'

export async function moveLeadToStage(leadId: string, stage: LeadStage) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('leads')
    .update({ stage, updated_at: new Date().toISOString() })
    .eq('id', leadId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/crm')
  revalidatePath('/admin/leads')
}

export async function createLead(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').insert({
    nome: formData.get('nome'),
    email: formData.get('email') || null,
    telefone: formData.get('telefone'),
    interesse: formData.get('interesse'),
    tipo_interesse: formData.get('tipo_interesse') || null,
    valor_min: formData.get('valor_min') ? Number(formData.get('valor_min')) : null,
    valor_max: formData.get('valor_max') ? Number(formData.get('valor_max')) : null,
    bairro_interesse: formData.get('bairro_interesse') || null,
    stage: 'lead',
    prioridade: formData.get('prioridade') ?? 'media',
    origem: formData.get('origem') ?? 'site',
    corretor: formData.get('corretor') || null,
    notas: formData.get('notas') || null,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/crm')
  revalidatePath('/admin/leads')
}

export async function updateLead(leadId: string, data: Partial<Lead>) {
  const supabase = await createClient()
  // Map camelCase back to snake_case for DB
  const dbData: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.nome !== undefined) dbData.nome = data.nome
  if (data.email !== undefined) dbData.email = data.email
  if (data.telefone !== undefined) dbData.telefone = data.telefone
  if (data.tipoInteresse !== undefined) dbData.tipo_interesse = data.tipoInteresse
  if (data.valorMin !== undefined) dbData.valor_min = data.valorMin
  if (data.valorMax !== undefined) dbData.valor_max = data.valorMax
  if (data.bairroInteresse !== undefined) dbData.bairro_interesse = data.bairroInteresse
  if (data.prioridade !== undefined) dbData.prioridade = data.prioridade
  if (data.corretor !== undefined) dbData.corretor = data.corretor
  if (data.notas !== undefined) dbData.notas = data.notas

  const { error } = await supabase.from('leads').update(dbData).eq('id', leadId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/crm')
}

export async function addInteraction(leadId: string, tipo: LeadInteraction['tipo'], descricao: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('lead_interactions').insert({
    lead_id: leadId, tipo, descricao,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/crm')
}
