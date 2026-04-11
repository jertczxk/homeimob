'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCliente(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('clientes').insert({
    nome: formData.get('nome'),
    tipo_pessoa: formData.get('tipo_pessoa'),
    cpf_cnpj: formData.get('cpf_cnpj') || null,
    email: formData.get('email') || null,
    telefone: formData.get('telefone'),
    endereco: formData.get('endereco') || null,
    papeis: (formData.getAll('papeis') as string[]),
    notas: formData.get('notas') || null,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/clientes')
}

export async function updateCliente(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('clientes').update({
    nome: formData.get('nome'),
    tipo_pessoa: formData.get('tipo_pessoa'),
    cpf_cnpj: formData.get('cpf_cnpj') || null,
    email: formData.get('email') || null,
    telefone: formData.get('telefone'),
    endereco: formData.get('endereco') || null,
    papeis: (formData.getAll('papeis') as string[]),
    notas: formData.get('notas') || null,
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/clientes')
}
