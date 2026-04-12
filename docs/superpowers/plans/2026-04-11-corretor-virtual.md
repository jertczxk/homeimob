# Corretor Virtual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a hybrid AI agent (Gemini 2.5 Flash via OpenRouter) in the home page that searches properties, answers questions from a knowledge base, and captures financing leads — with real-time SSE streaming.

**Architecture:** Next.js API route at `POST /api/corretor` runs an agent loop (tool calls → execute → repeat) then streams the final response via SSE. The existing `CorretorVirtual.tsx` component is wired to this endpoint and renders a live chat UI.

**Tech Stack:** `openai` npm SDK (OpenAI-compatible), OpenRouter API, Supabase JS, Next.js App Router API Routes, SSE via `ReadableStream`, TypeScript.

---

## File Map

| File | Action |
|---|---|
| `src/data/conhecimento.md` | Create — knowledge base |
| `src/lib/corretor/tools.ts` | Create — tool execution functions |
| `src/app/api/corretor/route.ts` | Create — agent loop + SSE |
| `src/components/site/CorretorVirtual.tsx` | Modify — live chat UI |

---

### Task 1: Install dependency + knowledge base

**Files:**
- Modify: `package.json` (via npm install)
- Create: `src/data/conhecimento.md`

- [ ] **Step 1: Install openai SDK**

```bash
cd "C:/Users/João Gabriel/Documents/GitHub/homeimob"
npm install openai
```

Expected: `added 1 package` (or similar), no errors.

- [ ] **Step 2: Create knowledge base file**

Create `src/data/conhecimento.md` with this content:

```markdown
# HOME Imob — Base de Conhecimento

## Sobre a Imobiliária

A HOME Imob é uma imobiliária premium especializada no mercado imobiliário de Santa Catarina, com foco em Florianópolis, Balneário Camboriú, Itapema e região.

**Missão:** Conectar pessoas aos imóveis ideais com transparência, agilidade e expertise de mercado.

**Diferenciais:**
- Equipe especializada em imóveis de alto padrão
- Atendimento personalizado do primeiro contato ao pós-venda
- Assessoria jurídica e financeira integrada
- Plataforma digital com visualização completa dos imóveis

## Serviços

### Compra e Venda
- Avaliação gratuita do imóvel
- Home staging para valorização
- Marketing digital especializado
- Assessoria em todo o processo legal e documental

### Locação
- Análise de crédito rápida (em até 24h)
- Contrato digital com assinatura eletrônica
- Gestão de contratos e cobranças
- Vistorias de entrada e saída

### Captação
- Parceria com proprietários que desejam vender ou locar
- Avaliação de mercado sem custo
- Divulgação em portais e redes sociais

## Regiões de Atuação

### Florianópolis
- Centro, Agronômica, Trindade: imóveis residenciais e comerciais, boa infraestrutura
- Jurerê Internacional: alto padrão, casas de luxo, condomínios fechados
- Campeche, Lagoa da Conceição: perfil jovem, próximo a praias, valorização constante
- Ingleses, Canasvieiras: temporada, praia, imóveis para investimento

### Balneário Camboriú
- Uma das cidades com maior valorização imobiliária do Brasil
- Apartamentos de alto padrão e luxo
- BC é referência nacional em lançamentos de alto padrão

### Itapema
- Cidade em forte crescimento imobiliário
- Meia Praia: destaque para apartamentos frente ao mar
- Boa relação custo-benefício comparado a BC

### São José e Palhoça
- Opções mais acessíveis próximas a Florianópolis
- Ideal para famílias buscando mais espaço com menor preço

## Financiamento Imobiliário

### Principais Modalidades
- **SBPE (Sistema Brasileiro de Poupança e Empréstimo):** Recursos da poupança, taxas a partir de 10,5% a.a. + TR
- **FGTS:** Para quem tem saldo, pode ser usado como entrada ou amortização
- **Poupança Casa Verde e Amarela:** Para imóveis até R$ 500 mil, taxas subsidiadas

### Como Funciona
1. Simulação: cliente informa valor, entrada e prazo
2. Análise de crédito pelo banco (renda mínima: ~3x o valor da parcela)
3. Avaliação do imóvel pelo banco
4. Assinatura do contrato e registro em cartório

### Entrada e Prazo
- Entrada mínima usual: 20% do valor do imóvel
- Prazo máximo: 35 anos (420 meses)
- Quanto maior a entrada, menor a taxa de juros

### Custos Adicionais na Compra
- ITBI (Imposto de Transmissão): 2% do valor venal (varia por município)
- Escritura e registro: ~1,5% a 2%
- Avaliação bancária: R$ 3.000 a R$ 5.000

## Perguntas Frequentes

**Quanto tempo leva para comprar um imóvel?**
Em média 60 a 90 dias, incluindo análise de crédito, avaliação e registro. Com documentação em ordem pode ser mais rápido.

**Posso usar o FGTS na compra?**
Sim, se for seu primeiro imóvel residencial, o imóvel for seu único no Brasil, e você tiver pelo menos 3 anos de trabalho sob regime CLT (consecutivos ou não).

**Qual a documentação necessária?**
RG, CPF, comprovante de renda (últimos 3 meses), comprovante de residência, certidão de estado civil, e extrato do FGTS se for utilizar.

**Vocês cobram do comprador?**
Não. Nossa comissão é paga pelo vendedor. O comprador não paga honorários à imobiliária.

**Como funciona a locação?**
O inquilino paga o aluguel + taxa de administração (10% do aluguel). Exigimos garantia: fiador, seguro fiança ou depósito de 3 meses.

**Qual a taxa de administração de locação?**
10% sobre o valor do aluguel mensal.

## Contato

- **Site:** www.homeimob.com.br
- **WhatsApp:** (48) 9 9999-9999
- **Horário:** Segunda a sexta das 9h às 18h, sábados das 9h às 13h
```

- [ ] **Step 3: Commit**

```bash
git add src/data/conhecimento.md package.json package-lock.json
git commit -m "feat: add openai SDK and corretor virtual knowledge base"
```

---

### Task 2: Tool execution functions

**Files:**
- Create: `src/lib/corretor/tools.ts`

This file exports three async functions that are called by the agent loop when the model requests a tool.

- [ ] **Step 1: Create `src/lib/corretor/tools.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// ── Tool: buscar_imoveis ────────────────────────────────────────────────────

export interface BuscarImoveisParams {
  tipo?: string
  finalidade?: string
  preco_max?: number
  preco_min?: number
  quartos?: number
  cidade?: string
}

export async function executeBuscarImoveis(params: BuscarImoveisParams) {
  const supabase = await createClient()

  let query = supabase
    .from('imoveis')
    .select('id, slug, titulo, tipo, finalidade, preco, quartos, banheiros, vagas, area_m2, bairro, cidade, imovel_fotos(url, ordem)')
    .eq('status', 'ativo')
    .order('destaque', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)

  if (params.finalidade) query = query.eq('finalidade', params.finalidade)
  if (params.tipo) query = query.eq('tipo', params.tipo)
  if (params.preco_max) query = query.lte('preco', params.preco_max)
  if (params.preco_min) query = query.gte('preco', params.preco_min)
  if (params.quartos) query = query.gte('quartos', params.quartos)
  if (params.cidade) {
    query = query.or(`cidade.ilike.%${params.cidade}%,bairro.ilike.%${params.cidade}%`)
  }

  const { data, error } = await query
  if (error) return { erro: error.message }
  if (!data || data.length === 0) return { resultado: 'Nenhum imóvel encontrado com esses critérios.' }

  const imoveis = (data as any[]).map((im) => {
    const fotos = (im.imovel_fotos ?? []) as { url: string; ordem: number }[]
    fotos.sort((a, b) => a.ordem - b.ordem)
    return {
      titulo: im.titulo,
      tipo: im.tipo,
      finalidade: im.finalidade,
      preco: im.preco ? `R$ ${Number(im.preco).toLocaleString('pt-BR')}` : 'Consultar',
      quartos: im.quartos,
      banheiros: im.banheiros,
      vagas: im.vagas,
      area_m2: im.area_m2,
      bairro: im.bairro,
      cidade: im.cidade,
      link: `/imoveis/${im.slug}`,
      foto: fotos[0]?.url ?? null,
    }
  })

  return { imoveis }
}

// ── Tool: buscar_conhecimento ───────────────────────────────────────────────

export interface BuscarConhecimentoParams {
  query: string
}

export function executeBuscarConhecimento(_params: BuscarConhecimentoParams): object {
  const filePath = join(process.cwd(), 'src', 'data', 'conhecimento.md')
  const content = readFileSync(filePath, 'utf-8')
  return { conteudo: content }
}

// ── Tool: registrar_simulacao ───────────────────────────────────────────────

export interface RegistrarSimulacaoParams {
  nome: string
  telefone: string
  valor_imovel: number
  valor_entrada: number
  prazo_anos: number
}

export async function executeRegistrarSimulacao(params: RegistrarSimulacaoParams) {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const notas = [
    `Simulação de financiamento via Corretor Virtual`,
    `Valor do imóvel: R$ ${Number(params.valor_imovel).toLocaleString('pt-BR')}`,
    `Valor de entrada: R$ ${Number(params.valor_entrada).toLocaleString('pt-BR')}`,
    `Prazo: ${params.prazo_anos} anos`,
  ].join('\n')

  const { error } = await supabase.from('leads').insert({
    nome: params.nome,
    telefone: params.telefone,
    email: null,
    interesse: 'venda',
    tipo_interesse: null,
    valor_min: null,
    valor_max: params.valor_imovel,
    bairro_interesse: null,
    stage: 'lead',
    prioridade: 'media',
    origem: 'site',
    corretor: null,
    notas,
  })

  if (error) return { erro: error.message }
  return { sucesso: true, mensagem: 'Simulação registrada com sucesso!' }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/corretor/tools.ts
git commit -m "feat: corretor virtual tool execution functions"
```

---

### Task 3: API Route — agent loop + SSE streaming

**Files:**
- Create: `src/app/api/corretor/route.ts`

The route receives `{ messages }`, runs the agent loop (non-streaming while tools are being called), then streams the final text response as SSE.

**SSE format used:** Each chunk is sent as `data: <text>\n\n`. End of stream: `data: [DONE]\n\n`.

- [ ] **Step 1: Create `src/app/api/corretor/route.ts`**

```typescript
import OpenAI from 'openai'
import { executeBuscarImoveis, executeBuscarConhecimento, executeRegistrarSimulacao } from '@/lib/corretor/tools'

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    'X-Title': 'HOME Imob Corretor Virtual',
  },
})

const MODEL = 'google/gemini-2.5-flash-lite-preview'

const SYSTEM_PROMPT = `Você é o Corretor Virtual da HOME Imob, uma imobiliária premium em Santa Catarina.
Seja cordial, profissional e objetivo. Responda sempre em português.
Use as ferramentas disponíveis para buscar imóveis, responder dúvidas sobre a imobiliária e registrar simulações de financiamento.
Quando apresentar imóveis, inclua detalhes relevantes e o link /imoveis/[slug] para cada um.
Nunca invente informações — use apenas o que as ferramentas retornam.`

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'buscar_imoveis',
      description: 'Busca imóveis disponíveis no banco de dados com filtros opcionais.',
      parameters: {
        type: 'object',
        properties: {
          tipo: { type: 'string', enum: ['residencial', 'comercial'], description: 'Tipo do imóvel' },
          finalidade: { type: 'string', enum: ['venda', 'locação'], description: 'Venda ou locação' },
          preco_max: { type: 'number', description: 'Preço máximo em reais' },
          preco_min: { type: 'number', description: 'Preço mínimo em reais' },
          quartos: { type: 'number', description: 'Número mínimo de quartos' },
          cidade: { type: 'string', description: 'Cidade ou bairro de interesse' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'buscar_conhecimento',
      description: 'Busca informações sobre a imobiliária, serviços, regiões, financiamento e FAQ.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Pergunta ou tópico a pesquisar' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'registrar_simulacao',
      description: 'Registra uma simulação de financiamento imobiliário. Coletar nome, telefone, valor do imóvel, entrada desejada e prazo em anos antes de chamar.',
      parameters: {
        type: 'object',
        properties: {
          nome: { type: 'string', description: 'Nome completo do interessado' },
          telefone: { type: 'string', description: 'Telefone ou WhatsApp' },
          valor_imovel: { type: 'number', description: 'Valor do imóvel em reais' },
          valor_entrada: { type: 'number', description: 'Valor da entrada em reais' },
          prazo_anos: { type: 'number', description: 'Prazo do financiamento em anos (máximo 35)' },
        },
        required: ['nome', 'telefone', 'valor_imovel', 'valor_entrada', 'prazo_anos'],
      },
    },
  },
]

async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === 'buscar_imoveis') {
    const result = await executeBuscarImoveis(args as any)
    return JSON.stringify(result)
  }
  if (name === 'buscar_conhecimento') {
    const result = executeBuscarConhecimento(args as any)
    return JSON.stringify(result)
  }
  if (name === 'registrar_simulacao') {
    const result = await executeRegistrarSimulacao(args as any)
    return JSON.stringify(result)
  }
  return JSON.stringify({ erro: `Ferramenta desconhecida: ${name}` })
}

export async function POST(request: Request) {
  const { messages } = await request.json() as { messages: OpenAI.Chat.ChatCompletionMessageParam[] }

  const conversationMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ]

  // Agent loop: run until no more tool calls (max 5 iterations to prevent infinite loops)
  let iterations = 0
  while (iterations < 5) {
    iterations++
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: conversationMessages,
      tools,
      tool_choice: 'auto',
      stream: false,
    })

    const message = response.choices[0].message

    if (!message.tool_calls || message.tool_calls.length === 0) {
      // No tool calls — stream the final text response
      const finalContent = message.content ?? ''

      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder()
          // Send content in chunks simulating streaming (split by words)
          const words = finalContent.split(' ')
          let i = 0

          function pushNext() {
            if (i >= words.length) {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
              return
            }
            const chunk = (i === 0 ? '' : ' ') + words[i]
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
            i++
            setTimeout(pushNext, 12)
          }

          pushNext()
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Has tool calls — execute them and add results
    conversationMessages.push(message)

    for (const toolCall of message.tool_calls) {
      const args = JSON.parse(toolCall.function.arguments)
      const result = await executeTool(toolCall.function.name, args)
      conversationMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result,
      })
    }
  }

  // Fallback if loop limit hit
  return Response.json({ error: 'Agent loop limit reached' }, { status: 500 })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/corretor/route.ts
git commit -m "feat: corretor virtual API route with agent loop and SSE streaming"
```

---

### Task 4: Wire up CorretorVirtual.tsx

**Files:**
- Modify: `src/components/site/CorretorVirtual.tsx`

Replace the static mockup with a live chat interface that calls `/api/corretor` and renders streaming responses.

- [ ] **Step 1: Replace `src/components/site/CorretorVirtual.tsx`**

```typescript
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
            const chunk = JSON.parse(data) as string
            assistantContent += chunk
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
    } catch (err) {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/site/CorretorVirtual.tsx
git commit -m "feat: corretor virtual live chat UI with SSE streaming"
```

---

### Task 5: Environment variable + final verification

**Files:**
- Modify: `.env.local` (user adds the key manually)
- Verify: build passes, component renders

- [ ] **Step 1: Add env var placeholder**

Open `.env.local` and add:
```
OPENROUTER_API_KEY=sk-or-your-key-here
```

The user will replace `sk-or-your-key-here` with their actual key from `openrouter.ai/keys`.

- [ ] **Step 2: Run build to check for TypeScript errors**

```bash
cd "C:/Users/João Gabriel/Documents/GitHub/homeimob"
npx next build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully` with no type errors.

If `openai` types cause issues, run:
```bash
npm install --save-dev @types/node
```

- [ ] **Step 3: Run dev server and smoke test**

```bash
npm run dev
```

Visit `http://localhost:3000`. The Corretor Virtual section should:
1. Show the welcome screen with suggestion pills
2. On clicking a suggestion → send the message → show "Pensando..." → stream the response
3. After "Quero simular um financiamento" → agent collects nome/telefone/etc → inserts lead in Supabase

- [ ] **Step 4: Commit final state**

```bash
git add -A
git commit -m "feat: corretor virtual complete — hybrid AI agent with streaming"
```
