'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { mockBlogPosts } from '@/lib/mock-admin'
import {
  ArrowLeft, Save, Eye, Upload, X, Image as ImageIcon, Globe, Clock,
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered,
  Link as LinkIcon, Quote, Code, Minus, Trash2,
} from 'lucide-react'

type EditorTab = 'editor' | 'preview'

const toolbarActions = [
  { icon: Bold, label: 'Negrito', prefix: '**', suffix: '**' },
  { icon: Italic, label: 'Itálico', prefix: '_', suffix: '_' },
  { icon: Heading1, label: 'Título 1', prefix: '# ', suffix: '' },
  { icon: Heading2, label: 'Título 2', prefix: '## ', suffix: '' },
  { icon: Heading3, label: 'Título 3', prefix: '### ', suffix: '' },
  { icon: List, label: 'Lista', prefix: '- ', suffix: '' },
  { icon: ListOrdered, label: 'Lista Ord.', prefix: '1. ', suffix: '' },
  { icon: Quote, label: 'Citação', prefix: '> ', suffix: '' },
  { icon: Code, label: 'Código', prefix: '`', suffix: '`' },
  { icon: LinkIcon, label: 'Link', prefix: '[', suffix: '](url)' },
  { icon: ImageIcon, label: 'Imagem', prefix: '![alt](', suffix: ')' },
  { icon: Minus, label: 'Divisor', prefix: '\n---\n', suffix: '' },
]

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/_(.+?)_/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-white/5 text-accent px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-4 max-w-full" />')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent underline">$1</a>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-accent/50 pl-4 text-zinc-400 italic my-3">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="border-white/5 my-6" />')
    .replace(/^- (.+)$/gm, '<li class="text-zinc-300 ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="text-zinc-300 ml-4 list-decimal">$1</li>')
    .replace(/^(?!<)([\w\u00C0-\u024F].+)$/gm, '<p class="text-zinc-400 leading-relaxed mb-3">$1</p>')
}

export default function BlogEditPage() {
  const params = useParams()
  const post = mockBlogPosts.find(p => p.id === params.id)

  const [tab, setTab] = useState<EditorTab>('editor')
  const [titulo, setTitulo] = useState(post?.titulo || '')
  const [resumo, setResumo] = useState(post?.resumo || '')
  const [conteudo, setConteudo] = useState(post?.conteudo || '')
  const [coverUrl, setCoverUrl] = useState(post?.cover_url || '')
  const [tags, setTags] = useState(post?.tags.join(', ') || '')
  const [postStatus, setPostStatus] = useState(post?.status || 'rascunho')
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const applyFormat = useCallback((prefix: string, suffix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = conteudo.substring(start, end)
    const before = conteudo.substring(0, start)
    const after = conteudo.substring(end)
    setConteudo(before + prefix + (selected || 'texto') + suffix + after)
  }, [conteudo])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    alert('Post atualizado! (mock)')
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <p className="text-sm">Post não encontrado</p>
        <Link href="/admin/blog" className="text-accent text-sm mt-2 hover:underline">Voltar</Link>
      </div>
    )
  }

  const wordCount = conteudo.trim().split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-lg font-bold text-white">Editar Post</h2>
            <p className="text-xs text-zinc-500">{wordCount} palavras · ~{readingTime} min de leitura</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-2 rounded-lg text-sm hover:bg-red-500/20 transition-colors border border-red-500/10">
            <Trash2 className="h-4 w-4" />
          </button>
          <select
            value={postStatus}
            onChange={(e) => setPostStatus(e.target.value as 'rascunho' | 'publicado')}
            className="bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none cursor-pointer"
          >
            <option value="rascunho">Rascunho</option>
            <option value="publicado">Publicado</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Meta fields */}
      <div className="grid grid-cols-1 gap-4">
        <input value={titulo} onChange={e => setTitulo(e.target.value)} className="bg-transparent text-2xl font-bold text-white placeholder:text-zinc-700 outline-none border-b border-white/5 pb-3 focus:border-accent/30 transition-colors" placeholder="Título do post..." />
        <input value={resumo} onChange={e => setResumo(e.target.value)} className="bg-transparent text-sm text-zinc-400 placeholder:text-zinc-700 outline-none" placeholder="Resumo curto do post..." />
      </div>

      {/* Cover + Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Imagem de Capa</label>
          {coverUrl ? (
            <div className="relative rounded-xl overflow-hidden aspect-video">
              <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
              <button onClick={() => setCoverUrl('')} className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCoverUrl('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop')}
              className="w-full aspect-video rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-accent/30 hover:text-accent transition-colors"
            >
              <Upload className="h-6 w-6" /><span className="text-xs font-medium">Adicionar capa</span>
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Tags</label>
          <input value={tags} onChange={e => setTags(e.target.value)} className="w-full bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-accent/30 transition-colors" placeholder="dicas, moradia" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-800/30 rounded-xl p-1 border border-white/5 w-fit">
        <button onClick={() => setTab('editor')} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2', tab === 'editor' ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}>
          <Code className="h-4 w-4" /> Editor
        </button>
        <button onClick={() => setTab('preview')} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2', tab === 'preview' ? 'bg-accent/15 text-accent' : 'text-zinc-500 hover:text-white')}>
          <Eye className="h-4 w-4" /> Preview
        </button>
      </div>

      {/* Toolbar */}
      {tab === 'editor' && (
        <div className="flex flex-wrap items-center gap-1 bg-zinc-800/30 rounded-xl p-2 border border-white/5">
          {toolbarActions.map((action, i) => (
            <span key={i} className="contents">
              {(i === 5 || i === 8 || i === 10) && <div className="w-px h-5 bg-white/5 mx-1" />}
              <button onClick={() => applyFormat(action.prefix, action.suffix)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors" title={action.label}>
                <action.icon className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      {tab === 'editor' ? (
        <textarea ref={textareaRef} value={conteudo} onChange={e => setConteudo(e.target.value)} className="w-full min-h-[500px] bg-zinc-800/20 border border-white/5 rounded-2xl p-6 text-sm text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-accent/20 transition-colors resize-y font-mono leading-relaxed" placeholder="Escreva em Markdown..." />
      ) : (
        <div className="bg-zinc-800/20 border border-white/5 rounded-2xl p-8 min-h-[500px]">
          {coverUrl && <div className="rounded-xl overflow-hidden mb-6 aspect-[21/9]"><img src={coverUrl} alt="cover" className="w-full h-full object-cover" /></div>}
          {titulo && <h1 className="text-3xl font-bold text-white mb-2">{titulo}</h1>}
          {resumo && <p className="text-sm text-zinc-500 mb-6">{resumo}</p>}
          {conteudo ? (
            <div className="prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: markdownToHtml(conteudo) }} />
          ) : (
            <p className="text-zinc-600 text-sm italic">Nenhum conteúdo.</p>
          )}
        </div>
      )}
    </div>
  )
}
