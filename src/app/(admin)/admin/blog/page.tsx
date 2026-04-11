import { getBlogPosts } from '@/lib/supabase/queries/blog'
import { BlogAdminClient } from './_components/BlogAdminClient'

export const revalidate = 0

export default async function BlogListPage() {
  const posts = await getBlogPosts() // all statuses for admin
  return <BlogAdminClient posts={posts} />
}
