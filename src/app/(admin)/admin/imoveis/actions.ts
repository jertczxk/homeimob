'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createImovel(formData: FormData) {
  const supabase = await createClient()

  const slug = (formData.get('titulo') as string)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .concat('-' + Date.now())

  const { data, error } = await supabase.from('imoveis').insert({
    slug,
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || null,
    tipo: formData.get('tipo'),
    finalidade: formData.get('finalidade'),
    preco: formData.get('preco') ? Number(formData.get('preco')) : null,
    area_m2: formData.get('area_m2') ? Number(formData.get('area_m2')) : null,
    quartos: Number(formData.get('quartos') ?? 0),
    banheiros: Number(formData.get('banheiros') ?? 0),
    vagas: Number(formData.get('vagas') ?? 0),
    endereco: formData.get('endereco') || null,
    bairro: formData.get('bairro') || null,
    cidade: formData.get('cidade') || null,
    uf: formData.get('uf') || null,
    cep: formData.get('cep') || null,
    destaque: formData.get('destaque') === 'true',
    status: formData.get('status') ?? 'ativo',
    updated_at: new Date().toISOString(),
  }).select().single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin/imoveis')
  revalidatePath('/imoveis')
  redirect(`/admin/imoveis/${data.id}`)
}

export async function updateImovel(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('imoveis').update({
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || null,
    tipo: formData.get('tipo'),
    finalidade: formData.get('finalidade'),
    preco: formData.get('preco') ? Number(formData.get('preco')) : null,
    area_m2: formData.get('area_m2') ? Number(formData.get('area_m2')) : null,
    quartos: Number(formData.get('quartos') ?? 0),
    banheiros: Number(formData.get('banheiros') ?? 0),
    vagas: Number(formData.get('vagas') ?? 0),
    endereco: formData.get('endereco') || null,
    bairro: formData.get('bairro') || null,
    cidade: formData.get('cidade') || null,
    uf: formData.get('uf') || null,
    cep: formData.get('cep') || null,
    destaque: formData.get('destaque') === 'true',
    status: formData.get('status'),
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/imoveis')
  revalidatePath(`/admin/imoveis/${id}`)
  revalidatePath('/imoveis')
}

export async function deleteImovel(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('imoveis').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/imoveis')
  revalidatePath('/imoveis')
  redirect('/admin/imoveis')
}

export async function addFotoImovel(imovelId: string, url: string, ordem: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('imovel_fotos').insert({ imovel_id: imovelId, url, ordem })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/imoveis/${imovelId}`)
  revalidatePath(`/imoveis`)
}

export async function deleteFotoImovel(fotoId: string, imovelId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('imovel_fotos').delete().eq('id', fotoId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/imoveis/${imovelId}`)
  revalidatePath(`/imoveis`)
}
