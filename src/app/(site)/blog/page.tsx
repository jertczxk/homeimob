import { getBlogPosts } from '@/lib/supabase/queries/blog'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Tag } from 'lucide-react'

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getBlogPosts('publicado')

  return (
    <div className="bg-background min-h-screen">
      <div className="container pt-32 pb-20">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-serif font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground text-lg">Dicas, tendências e novidades do mercado imobiliário.</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Nenhum artigo publicado no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {post.cover_url && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={post.cover_url}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                      {post.titulo}
                    </h2>
                    {post.resumo && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.resumo}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />{post.autor}
                      </span>
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.published_at).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
