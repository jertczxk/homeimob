import { createClient } from '@/lib/supabase/server'
import { Cliente } from '@/types'

export async function getClientes(): Promise<Cliente[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clientes').select('*').order('nome')
  if (error) throw new Error(error.message)
  return (data ?? []) as Cliente[]
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clientes').select('*').eq('id', id).single()
  if (error) return null
  return data as Cliente
}
