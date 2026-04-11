'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient()
  const titulo = formData.get('titulo') as string
  const slug = titulo
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .concat('-' + Date.now())

  const status = formData.get('status') as string
  const { data, error } = await supabase.from('blog_posts').insert({
    titulo,
    slug,
    resumo: formData.get('resumo') || null,
    conteudo: formData.get('conteudo') ?? '',
    cover_url: formData.get('cover_url') || null,
    status,
    autor: formData.get('autor') ?? 'Admin',
    tags: (formData.get('tags') as string ?? '').split(',').map(t => t.trim()).filter(Boolean),
    published_at: status === 'publicado' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).select().single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect(`/admin/blog/${data.id}`)
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = await createClient()
  const status = formData.get('status') as string
  const { error } = await supabase.from('blog_posts').update({
    titulo: formData.get('titulo'),
    resumo: formData.get('resumo') || null,
    conteudo: formData.get('conteudo'),
    cover_url: formData.get('cover_url') || null,
    status,
    autor: formData.get('autor'),
    tags: (formData.get('tags') as string ?? '').split(',').map(t => t.trim()).filter(Boolean),
    published_at: status === 'publicado' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect('/admin/blog')
}
