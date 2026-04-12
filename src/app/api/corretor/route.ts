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

const MODEL = 'openai/gpt-4o-mini'

const SYSTEM_PROMPT = `Você é o Corretor Virtual da HOME Imob, uma imobiliária premium em Santa Catarina.
Seja cordial, profissional e objetivo. Responda sempre em português.
REGRAS DE FORMATAÇÃO: Nunca use markdown — sem asteriscos, hashtags, underlines, bullets (*), hífens como lista, ou qualquer símbolo especial. Use apenas texto corrido, separando ideias com ponto e vírgula ou vírgulas. Sem quebras de linha duplas (\n\n).
REGRAS DE BUSCA: Sempre que o usuário mencionar imóveis, quartos, preço, cidade, investimentos, lançamentos ou aluguel, chame imediatamente buscar_imoveis com os filtros disponíveis — sem pedir mais informações primeiro. Se a cidade não for especificada, busque sem filtro de cidade (abrange toda Santa Catarina). Só peça mais detalhes APÓS mostrar os resultados se o usuário quiser refinar a busca.
Quando apresentar imóveis, mencione brevemente os destaques em texto corrido — os cards visuais já serão exibidos automaticamente.
Use as ferramentas disponíveis para responder dúvidas sobre a imobiliária e registrar simulações de financiamento.
Nunca invente informações — use apenas o que as ferramentas retornam.`

// Split text into sentences for natural streaming cadence
function splitBySentences(text: string): string[] {
  const parts = text.split(/(?<=[.!?])\s+/)
  return parts.filter(p => p.trim().length > 0)
}

// SSE event helpers
function sseChunk(encoder: TextEncoder, payload: unknown): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
}

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

async function executeTool(rawName: string, args: Record<string, unknown>): Promise<string> {
  // Gemini sometimes prefixes tool names with "default_api." — strip it
  const name = rawName.replace(/^default_api\./, '')
  if (name === 'buscar_imoveis') {
    const result = await executeBuscarImoveis(args as unknown as Parameters<typeof executeBuscarImoveis>[0])
    return JSON.stringify(result)
  }
  if (name === 'buscar_conhecimento') {
    const result = executeBuscarConhecimento(args as unknown as Parameters<typeof executeBuscarConhecimento>[0])
    return JSON.stringify(result)
  }
  if (name === 'registrar_simulacao') {
    const result = await executeRegistrarSimulacao(args as unknown as Parameters<typeof executeRegistrarSimulacao>[0])
    return JSON.stringify(result)
  }
  return JSON.stringify({ erro: `Ferramenta desconhecida: ${name}` })
}

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
}

async function runAgent(
  conversationMessages: OpenAI.Chat.ChatCompletionMessageParam[],
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController<Uint8Array>,
) {
  let iterations = 0
  console.log('[corretor] runAgent started, messages:', conversationMessages.length)

  while (iterations < 5) {
    iterations++
    console.log(`[corretor] iteration ${iterations} — calling LLM`)

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: conversationMessages,
      tools,
      tool_choice: 'auto',
      stream: false,
    })

    const message = response.choices[0].message
    console.log(`[corretor] iteration ${iterations} — finish_reason:`, response.choices[0].finish_reason, '| tool_calls:', message.tool_calls?.length ?? 0, '| content length:', message.content?.length ?? 0)

    if (!message.tool_calls || message.tool_calls.length === 0) {
      const finalContent = message.content ?? ''
      const sentences = splitBySentences(finalContent)
      console.log(`[corretor] final response — sentences:`, sentences.length, '| content:', finalContent.slice(0, 100))

      if (sentences.length === 0) {
        // Model returned empty — retry silently (gemini-flash-lite is occasionally unreliable)
        if (iterations < 3) {
          console.log(`[corretor] empty response on iteration ${iterations} — retrying`)
          continue
        }
        controller.enqueue(sseChunk(encoder, { type: 'text', chunk: 'Posso ajudá-lo a encontrar o imóvel ideal ou responder suas dúvidas. Como posso auxiliá-lo?' }))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
        return
      }

      for (let i = 0; i < sentences.length; i++) {
        const chunk = sentences[i] + (i < sentences.length - 1 ? ' ' : '')
        controller.enqueue(sseChunk(encoder, { type: 'text', chunk }))
        if (i < sentences.length - 1) {
          await new Promise<void>(resolve => setTimeout(resolve, 40))
        }
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
      return
    }

    // Execute tool calls
    conversationMessages.push(message)

    for (const toolCall of message.tool_calls) {
      if (toolCall.type !== 'function') continue
      const args = JSON.parse(toolCall.function.arguments) as Record<string, unknown>
      console.log(`[corretor] executing tool: ${toolCall.function.name}`, args)
      const result = await executeTool(toolCall.function.name, args)
      console.log(`[corretor] tool result length: ${result.length} chars | preview:`, result.slice(0, 120))

      // Send imoveis immediately when found — don't wait for the final text response
      if (toolCall.function.name === 'buscar_imoveis') {
        try {
          const parsed = JSON.parse(result) as { imoveis?: Record<string, unknown>[] }
          console.log(`[corretor] buscar_imoveis found:`, parsed.imoveis?.length ?? 0, 'properties')
          if (parsed.imoveis && parsed.imoveis.length > 0) {
            controller.enqueue(sseChunk(encoder, { type: 'imoveis', data: parsed.imoveis }))
            console.log('[corretor] imoveis event sent to client')
          }
        } catch (e) {
          console.error('[corretor] failed to parse buscar_imoveis result:', e)
        }
      }

      conversationMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result,
      })
    }
  }

  // Loop limit fallback
  console.log('[corretor] hit iteration limit — sending fallback')
  controller.enqueue(sseChunk(encoder, { type: 'text', chunk: 'Desculpe, não consegui processar sua solicitação. Tente novamente.' }))
  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
  controller.close()
}

export async function POST(request: Request) {
  const sseError = (msg: string) =>
    new Response(
      `data: ${JSON.stringify({ type: 'error', message: msg })}\n\ndata: [DONE]\n\n`,
      { headers: SSE_HEADERS }
    )

  let messages: OpenAI.Chat.ChatCompletionMessageParam[]
  try {
    const body = await request.json() as { messages?: unknown }
    if (!Array.isArray(body.messages)) return sseError('Mensagens inválidas.')
    messages = body.messages as OpenAI.Chat.ChatCompletionMessageParam[]
  } catch {
    return sseError('Requisição inválida.')
  }

  const conversationMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ]

  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Start the agent in background — Response is returned immediately,
      // events are written to controller as they happen (imoveis before text).
      void runAgent(conversationMessages, encoder, controller).catch(err => {
        const msg = err instanceof Error ? err.message : 'Erro interno.'
        controller.enqueue(sseChunk(encoder, { type: 'error', message: msg }))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      })
    },
  })

  return new Response(stream, { headers: SSE_HEADERS })
}
