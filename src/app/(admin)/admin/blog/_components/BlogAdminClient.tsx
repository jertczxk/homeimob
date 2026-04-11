'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { BlogPost, StatusPost } from '@/types'
import { Plus, Search, Eye, Edit, Trash2, Calendar, Tag, FileText, Clock, Globe } from 'lucide-react'
import { deleteBlogPost } from '../actions'

const statusConfig: Record<StatusPost, { label: string; color: string; icon: React.ElementType }> = {
  rascunho: { label: 'Rascunho', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20', icon: FileText },
  publicado: { label: 'Publicado', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: Globe },
  agendado: { label: 'Agendado', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: Clock },
}

export function BlogAdminClient({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<StatusPost | 'todos'>('todos')
  const [isPending, startTransition] = useTransition()

  const filtered = posts.filter((post) => {
    const matchSearch = post.titulo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || post.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total: posts.length,
    publicado: posts.filter(p => p.status === 'publicado').length,
    rascunho: posts.filter(p => p.status === 'rascunho').length,
  }

  function handleDelete(id: string) {
    if (!confirm('Excluir este post?')) return
    startTransition(() => deleteBlogPost(id))
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          {stats.total} posts · {stats.publicado} publicados · {stats.rascunho} rascunhos
        </p>
        <Link
          href="/admin/blog/novo"
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Post
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 border border-white/5 focus-within:border-accent/30 transition-colors flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full"
          />
        </div>
        <div className="flex items-center bg-zinc-800/50 rounded-lg border border-white/5 overflow-hidden">
          {(['todos', 'publicado', 'rascunho', 'agendado'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn('px-3 py-2 text-xs font-medium transition-colors capitalize', filterStatus === s ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Nenhum post encontrado.</p>
            <Link href="/admin/blog/novo" className="text-accent text-sm hover:underline mt-2 inline-block">
              Criar primeiro post
            </Link>
          </div>
        ) : (
          filtered.map(post => {
            const config = statusConfig[post.status]
            const StatusIcon = config.icon
            return (
              <div key={post.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-accent/15 transition-colors group">
                <div className="flex gap-5">
                  {post.cover_url && (
                    <div className="w-32 h-20 rounded-xl overflow-hidden shrink-0 hidden sm:block">
                      <Image src={post.cover_url} alt={post.titulo} width={128} height={80} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">{post.titulo}</h3>
                        {post.resumo && <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{post.resumo}</p>}
                      </div>
                      <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md border shrink-0 flex items-center gap-1', config.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-[11px] text-zinc-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                          : 'Não publicado'}
                      </span>
                      <span>por {post.autor}</span>
                      {post.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {post.tags.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link href={`/admin/blog/${post.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={isPending}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
