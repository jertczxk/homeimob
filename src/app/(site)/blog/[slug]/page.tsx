import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { getBlogPostBySlug } from '@/lib/supabase/queries/blog'

export const revalidate = 60

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  return (
    <div className="bg-background min-h-screen">
      <div className="container pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link href="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Blog
          </Link>

          {/* Cover */}
          {post.cover_url && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <img src={post.cover_url} alt={post.titulo} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4">{post.titulo}</h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <span className="flex items-center gap-2"><User className="h-4 w-4" />{post.autor}</span>
            {post.published_at && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">{post.conteudo}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
