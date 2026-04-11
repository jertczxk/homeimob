'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePagamentoStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('pagamentos').update({
    status,
    data_pagamento: status === 'pago' ? new Date().toISOString().split('T')[0] : null,
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/locacoes/alugueis')
}

export async function createContrato(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('contratos').insert({
    imovel_id: formData.get('imovel_id'),
    proprietario_id: formData.get('proprietario_id'),
    inquilino_id: formData.get('inquilino_id'),
    valor_aluguel: Number(formData.get('valor_aluguel')),
    data_inicio: formData.get('data_inicio'),
    data_fim: formData.get('data_fim'),
    dia_vencimento: Number(formData.get('dia_vencimento')),
    taxa_administracao: Number(formData.get('taxa_administracao') ?? 10),
    status: 'ativo',
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/locacoes/contratos')
}

export async function updateContratoStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('contratos')
    .update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/locacoes/contratos')
}

export async function createManutencao(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('manutencoes').insert({
    imovel_id: formData.get('imovel_id'),
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || null,
    status: 'aberta',
    custo: formData.get('custo') ? Number(formData.get('custo')) : null,
    data_abertura: new Date().toISOString().split('T')[0],
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/locacoes/manutencoes')
}
