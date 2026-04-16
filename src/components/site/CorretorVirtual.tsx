'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SendHorizontal, Bot, BedDouble, Ruler, MapPin, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PropertyPlaceholder } from '@/components/ui/PropertyPlaceholder'

type ImovelCard = {
  titulo: string
  tipo: string
  finalidade: string
  preco: string
  quartos: number
  banheiros: number
  vagas: number
  area_m2: number | null
  bairro: string | null
  cidade: string | null
  link: string
  foto: string | null
}

type ImoveisParams = {
  cidade?: string
  finalidade?: string
  tipo?: string
  quartos?: number
  preco_max?: number
  preco_min?: number
}

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  imoveis?: ImovelCard[]
  imoveisParams?: ImoveisParams
}

const suggestions = [
  'Opções para investimentos em Florianópolis',
  'Lançamentos em Balneário Camboriú',
  'Apartamentos com 3 quartos até R$ 2M',
  'Quero simular um financiamento',
]

function buildImoveisUrl(params: ImoveisParams): string {
  const sp = new URLSearchParams()
  if (params.cidade) sp.set('bairro', params.cidade)
  if (params.finalidade) sp.set('finalidade', params.finalidade)
  if (params.tipo) sp.set('tipo', params.tipo)
  if (params.quartos) sp.set('quartos', String(params.quartos))
  if (params.preco_max) sp.set('precoMax', String(params.preco_max))
  if (params.preco_min) sp.set('precoMin', String(params.preco_min))
  const qs = sp.toString()
  return qs ? `/imoveis?${qs}` : '/imoveis'
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1 px-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}

function PropertyCard({ imovel }: { imovel: ImovelCard }) {
  return (
    <Link
      href={imovel.link}
      target="_blank"
      className="shrink-0 w-52 bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group/card snap-start"
    >
      {/* Photo */}
      <div className="relative h-32 bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
        {imovel.foto ? (
          <Image
            src={imovel.foto}
            alt={imovel.titulo}
            fill
            className="object-cover group-hover/card:scale-105 transition-transform duration-500"
          />
        ) : (
          <PropertyPlaceholder />
        )}
        <span className="absolute top-2 left-2 text-[9px] font-bold bg-black/55 text-white px-2 py-0.5 rounded-full backdrop-blur-sm capitalize">
          {imovel.finalidade}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p className="text-xs font-bold text-accent leading-tight">{imovel.preco}</p>
        <p className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-100 leading-snug line-clamp-2">
          {imovel.titulo}
        </p>
        <div className="flex items-center gap-2.5 text-[10px] text-zinc-500">
          {imovel.quartos > 0 && (
            <span className="flex items-center gap-0.5">
              <BedDouble className="h-3 w-3" />{imovel.quartos}q
            </span>
          )}
          {imovel.area_m2 && (
            <span className="flex items-center gap-0.5">
              <Ruler className="h-3 w-3" />{imovel.area_m2}m²
            </span>
          )}
        </div>
        {(imovel.bairro || imovel.cidade) && (
          <p className="text-[10px] text-zinc-400 flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            {[imovel.bairro, imovel.cidade].filter(Boolean).join(', ')}
          </p>
        )}
      </div>
    </Link>
  )
}

function PropertyCarousel({ imoveis, params }: { imoveis: ImovelCard[]; params?: ImoveisParams }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' })
  }

  const imoveisUrl = params ? buildImoveisUrl(params) : '/imoveis'

  return (
    <div className="w-full space-y-2">
      {/* Carousel */}
      <div className="relative">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-7 h-7 flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-full shadow-md hover:border-accent/40 transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
          </button>
        )}

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          {imoveis.map((im, idx) => (
            <PropertyCard key={idx} imovel={im} />
          ))}
        </div>

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-full shadow-md hover:border-accent/40 transition-all"
          >
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
          </button>
        )}
      </div>

      {/* Ver imóveis semelhantes */}
      <Link
        href={imoveisUrl}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent hover:text-accent/80 transition-colors group/link"
      >
        Ver todos os imóveis semelhantes
        <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  )
}

export function CorretorVirtual() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll the chat container — NOT the page
  useEffect(() => {
    const el = chatContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  
  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return
    const userMessage: ChatMessage = { role: 'user', content: text.trim() }
    const nextMessages = [...messages, userMessage]
    setMessages([...nextMessages, { role: 'assistant', content: '' }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/corretor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      if (!response.ok) throw new Error(`Erro ${response.status}`)
      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      let imoveisData: ImovelCard[] | undefined
      let imoveisParams: ImoveisParams | undefined

      let buffer = ''
      let done = false
      while (!done) {
        const result = await reader.read()
        done = result.done
        if (result.value) buffer += decoder.decode(result.value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        let stop = false
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') { stop = true; break }
          try {
            const parsed = JSON.parse(data) as {
              type?: string
              chunk?: string
              data?: ImovelCard[]
              params?: ImoveisParams
              message?: string
              error?: string
            }
            if (parsed.type === 'text' && parsed.chunk) {
              assistantContent += parsed.chunk
            } else if (parsed.type === 'imoveis' && parsed.data) {
              imoveisData = parsed.data
              imoveisParams = parsed.params
            } else if (parsed.type === 'error' || parsed.error) {
              assistantContent = parsed.message ?? parsed.error ?? 'Ocorreu um erro.'
            }
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                role: 'assistant',
                content: assistantContent,
                imoveis: imoveisData,
                imoveisParams,
              }
              return updated
            })
          } catch {
            // ignore parse errors on partial chunks
          }
        }
        if (stop) break
      }

      // Ensure the assistant message always has content (never stuck on typing dots)
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === 'assistant' && !last.content) {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...last,
            content: last.imoveis?.length ? 'Aqui estão algumas opções que encontrei para você:' : 'Desculpe, não consegui processar sua solicitação. Tente novamente.',
          }
          return updated
        }
        return prev
      })
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <section className="py-24 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950/20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-white/10 to-transparent" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
              Corretor Virtual
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Respostas imediatas sobre dúvidas, sugestões personalizadas de imóveis com base no seu perfil.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-b from-accent/10 to-transparent blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700" />

            <div className="relative bg-white dark:bg-zinc-900/50 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
              {/* Header */}
              <div className="bg-zinc-900 dark:bg-zinc-800/80 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="absolute inset-0 bg-emerald-500/40 rounded-full animate-ping" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/80">
                    Assistente Ativo
                  </span>
                </div>
              </div>

              {/* Chat Area — scroll is contained here, NOT the page */}
              <div
                ref={chatContainerRef}
                className="p-6 md:p-8 min-h-[350px] max-h-[520px] overflow-y-auto flex flex-col gap-4 scroll-smooth"
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-center py-8">
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                        <Bot className="h-8 w-8 text-accent shrink-0" />
                      </div>
                      <p className="text-2xl font-serif italic text-zinc-700 dark:text-zinc-300">
                        Olá! Como posso ajudar você hoje?
                      </p>
                      <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto font-medium">
                        Descreva o imóvel dos seus sonhos, o tamanho da sua família, ou faça uma pergunta sobre nossos serviços.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {suggestions.map((text, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(text)}
                          disabled={isLoading}
                          className="px-5 py-2.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-accent/40 text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-accent transition-all duration-300 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                          <Bot className="h-4 w-4 text-accent" />
                        </div>
                      )}

                      <div className={cn('flex flex-col gap-3', msg.role === 'user' ? 'items-end max-w-[80%]' : 'items-start w-full max-w-[85%]')}>
                        {/* Bubble */}
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                            msg.role === 'user'
                              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-br-sm'
                              : 'bg-zinc-100 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 rounded-bl-sm border border-zinc-200 dark:border-white/10 whitespace-pre-line'
                          )}
                        >
                          {msg.content || <TypingDots />}
                        </div>

                        {/* Property carousel */}
                        {msg.imoveis && msg.imoveis.length > 0 && (
                          <div className="w-full">
                            <PropertyCarousel imoveis={msg.imoveis} params={msg.imoveisParams} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="bg-zinc-50/50 dark:bg-black/20 p-6 border-t border-zinc-200 dark:border-white/5">
                <div className="relative max-w-3xl mx-auto group/input">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ex: Tenho 3 filhos e quero um apartamento no centro de Florianópolis"
                    disabled={isLoading}
                    className="w-full h-14 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-2xl pl-6 pr-16 text-sm font-medium focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none disabled:opacity-60"
                  />
                  <button
                    aria-label={isLoading ? 'Enviando...' : 'Enviar mensagem'}
                    onClick={() => sendMessage(input)}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />
    </section>
  )
}
