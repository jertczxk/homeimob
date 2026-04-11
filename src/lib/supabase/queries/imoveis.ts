import { createClient } from '@/lib/supabase/server'
import { ImovelComFotos } from '@/types'

export interface ImovelFilters {
  finalidade?: string
  tipo?: string
  bairro?: string
  precoMin?: number
  precoMax?: number
  quartos?: number
  vagas?: number
  order?: string
  status?: string
}

export async function getImoveis(filters: ImovelFilters = {}): Promise<ImovelComFotos[]> {
  const supabase = await createClient()

  let query = supabase
    .from('imoveis')
    .select('*, imovel_fotos(*)')

  if (filters.status) {
    query = query.eq('status', filters.status)
  } else {
    query = query.eq('status', 'ativo')
  }
  if (filters.finalidade) query = query.eq('finalidade', filters.finalidade)
  if (filters.tipo) query = query.eq('tipo', filters.tipo)
  if (filters.bairro) {
    query = query.or(
      `bairro.ilike.%${filters.bairro}%,cidade.ilike.%${filters.bairro}%`
    )
  }
  if (filters.precoMin) query = query.gte('preco', filters.precoMin)
  if (filters.precoMax) query = query.lte('preco', filters.precoMax)
  if (filters.quartos) query = query.gte('quartos', filters.quartos)
  if (filters.vagas) query = query.gte('vagas', filters.vagas)

  if (filters.order === 'price_desc') {
    query = query.order('preco', { ascending: false })
  } else if (filters.order === 'price_asc') {
    query = query.order('preco', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as ImovelComFotos[]
}

export async function getImoveisAdmin(filters: ImovelFilters = {}): Promise<ImovelComFotos[]> {
  const supabase = await createClient()
  let query = supabase.from('imoveis').select('*, imovel_fotos(*)')

  if (filters.status && filters.status !== 'todos') query = query.eq('status', filters.status)
  if (filters.tipo && filters.tipo !== 'todos') query = query.eq('tipo', filters.tipo)
  if (filters.bairro) {
    query = query.or(
      `titulo.ilike.%${filters.bairro}%,bairro.ilike.%${filters.bairro}%,cidade.ilike.%${filters.bairro}%`
    )
  }

  query = query.order('created_at', { ascending: false })
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as ImovelComFotos[]
}

export async function getImoveisDestaque(): Promise<ImovelComFotos[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('imoveis')
    .select('*, imovel_fotos(*)')
    .eq('destaque', true)
    .eq('status', 'ativo')
    .order('created_at', { ascending: false })
    .limit(6)
  if (error) throw new Error(error.message)
  return (data ?? []) as ImovelComFotos[]
}

export async function getImovelBySlug(slug: string): Promise<ImovelComFotos | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('imoveis')
    .select('*, imovel_fotos(*)')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data as ImovelComFotos
}

export async function getImovelById(id: string): Promise<ImovelComFotos | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('imoveis')
    .select('*, imovel_fotos(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return data as ImovelComFotos
}
