'use client'

import { useState, useRef, useEffect } from 'react'
import { SendHorizontal, Bot, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const suggestions = [
  'Opções para investimentos em Florianópolis',
  'Lançamentos em Balneário Camboriú',
  'Apartamentos com 3 quartos até R$ 2M',
  'Quero simular um financiamento',
]

export function CorretorVirtual() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

      if (!response.body) throw new Error('No response body')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n').filter(line => line.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (typeof parsed === 'string') {
              assistantContent += parsed
            } else if (parsed?.error) {
              assistantContent = `Desculpe, ocorreu um erro: ${parsed.error}`
            }
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: assistantContent }
              return updated
            })
          } catch {
            // ignore parse errors on partial chunks
          }
        }
      }
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
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/60 opacity-60">
                  Resposta em Streaming
                </span>
              </div>

              {/* Chat Area */}
              <div className="p-6 md:p-8 min-h-[350px] max-h-[500px] overflow-y-auto flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-8 text-center py-8">
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
                          className="px-5 py-2.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-accent/40 text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-accent transition-all duration-300 shadow-sm"
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex gap-3',
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                            <Bot className="h-4 w-4 text-accent" />
                          </div>
                        )}
                        <div
                          className={cn(
                            'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                            msg.role === 'user'
                              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-br-sm'
                              : 'bg-zinc-100 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 rounded-bl-sm border border-zinc-200 dark:border-white/10'
                          )}
                        >
                          {msg.content || (
                            <span className="flex items-center gap-2 text-zinc-400">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Pensando...
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
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
                    onClick={() => sendMessage(input)}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendHorizontal className="h-4 w-4" />
                    )}
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
