import { createClient } from '@/lib/supabase/server'
import { BlogPost } from '@/types'

export async function getBlogPosts(status?: string): Promise<BlogPost[]> {
  const supabase = await createClient()
  let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as BlogPost[]
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publicado')
    .single()
  if (error) return null
  return data as BlogPost
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts').select('*').eq('id', id).single()
  if (error) return null
  return data as BlogPost
}
