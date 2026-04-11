import { notFound } from 'next/navigation'
import { getBlogPostById } from '@/lib/supabase/queries/blog'
import { BlogEditorClient } from '../_components/BlogEditorClient'

export const revalidate = 0

export default async function BlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(id)

  if (!post) notFound()

  return <BlogEditorClient post={post} />
}
