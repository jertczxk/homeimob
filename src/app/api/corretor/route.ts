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
      // No tool calls — stream the final text response as SSE
      const finalContent = message.content ?? ''

      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder()
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
      if (toolCall.type !== 'function') continue
      const args = JSON.parse(toolCall.function.arguments) as Record<string, unknown>
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
