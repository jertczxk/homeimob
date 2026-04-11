'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePropostaStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('propostas')
    .update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vendas/propostas')
}

export async function createCaptacao(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('captacoes').insert({
    endereco: formData.get('endereco'),
    proprietario: formData.get('proprietario'),
    telefone: formData.get('telefone'),
    tipo: formData.get('tipo'),
    valor_estimado: Number(formData.get('valor_estimado')),
    status: 'prospectando',
    corretor: formData.get('corretor') || null,
    data: new Date().toISOString().split('T')[0],
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vendas/captacao')
}

export async function updateCaptacaoStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('captacoes').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vendas/captacao')
}
