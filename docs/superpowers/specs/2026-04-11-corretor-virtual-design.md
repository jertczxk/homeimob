# Corretor Virtual — Design Spec

## Overview

Hybrid AI agent embedded in the home page public site. The agent receives user messages, decides autonomously which tool(s) to call, executes them server-side, and streams the response back to the browser in real time.

**Not a stateless chatbot.** The agent maintains conversation history within the session so follow-up questions work naturally.

---

## Architecture

```
[CorretorVirtual.tsx]  ('use client')
    │
    └── POST /api/corretor  { messages: ChatMessage[] }
            │
            └── Agent Loop (server, src/app/api/corretor/route.ts)
                    │
                    ├── Call OpenRouter (Gemini 2.5 Flash Lite) — non-streaming
                    │       ↓ tool_calls?
                    ├── Execute tool(s) → append tool result messages
                    │       ↓ repeat until no tool_calls
                    └── Final call — streaming SSE → client
```

**Data flow:**
- Reads: `getImoveis()` from `src/lib/supabase/queries/imoveis.ts` (reused)
- Reads: `src/data/conhecimento.md` (static file, `fs.readFileSync`)
- Writes: `leads` table via Supabase service-role client (bypasses RLS)
- Streams: `text/event-stream` (SSE) via Next.js `Response` + `ReadableStream`

---

## AI Model

- **Provider:** OpenRouter (`https://openrouter.ai/api/v1`)
- **Model:** `google/gemini-2.5-flash-lite-preview`
- **SDK:** `openai` npm package (OpenAI-compatible, just change `baseURL`)
- **Env var:** `OPENROUTER_API_KEY` (server-only, never exposed to browser)

---

## Tools

### 1. `buscar_imoveis`
Search active properties in Supabase with optional filters.

**Parameters:**
- `tipo` — `"residencial" | "comercial"` (optional)
- `finalidade` — `"venda" | "locação"` (optional)
- `preco_max` — number (optional)
- `preco_min` — number (optional)
- `quartos` — number, minimum (optional)
- `cidade` — string (optional, also matches `bairro` via ilike)

**Returns:** Array of up to 5 properties with: `titulo`, `tipo`, `finalidade`, `preco`, `quartos`, `banheiros`, `vagas`, `area_m2`, `bairro`, `cidade`, `slug` (for linking), `foto_url` (first photo URL).

### 2. `buscar_conhecimento`
Read the markdown knowledge base to answer questions about the imobiliária, services, neighborhoods, market, FAQ.

**Parameters:**
- `query` — string, the user's question or topic

**Returns:** Full content of `src/data/conhecimento.md` (agent summarizes what's relevant).

### 3. `registrar_simulacao`
Collect lead data for a financing simulation. Stores the information and tells the user a broker will follow up.

**Parameters (all required):**
- `nome` — string
- `telefone` — string
- `valor_imovel` — number
- `valor_entrada` — number
- `prazo_anos` — number

**Returns:** Success message. Inserts row into `leads` table with:
- `nome`, `telefone`
- `email` = null
- `interesse` = `"venda"`
- `stage` = `"lead"`
- `prioridade` = `"media"`
- `origem` = `"site"`
- `notas` = formatted simulation details string

---

## UI Changes (CorretorVirtual.tsx)

Current state: static mockup with no backend connection.

**New state:**
```ts
type ChatMessage = { role: 'user' | 'assistant'; content: string }

const [messages, setMessages] = useState<ChatMessage[]>([])
const [input, setInput] = useState('')
const [isLoading, setIsLoading] = useState(false)
```

**Send flow:**
1. User types + presses Enter or send button
2. Append `{ role: 'user', content: input }` to messages
3. Append `{ role: 'assistant', content: '' }` (placeholder for streaming)
4. POST `/api/corretor` with full messages array
5. Read SSE stream, updating the last message's content chunk by chunk
6. `isLoading` shows spinner on send button

**Chat area** replaces the static "Como posso ajudar" section:
- When `messages.length === 0`: show original welcome text + suggestion pills
- When `messages.length > 0`: scrollable list of user/assistant bubbles
- Assistant bubble renders Markdown (using `prose` class or simple whitespace-pre-wrap)

**Suggestion pills**: clicking one sets the input and immediately sends.

---

## Files

| File | Action | Purpose |
|---|---|---|
| `src/data/conhecimento.md` | Create | Knowledge base: imobiliária info, FAQ, neighborhoods |
| `src/lib/corretor/tools.ts` | Create | Tool execution functions |
| `src/app/api/corretor/route.ts` | Create | Agent loop + SSE streaming |
| `src/components/site/CorretorVirtual.tsx` | Modify | Connect UI to API, render chat history |

---

## Environment Variables

Add to `.env.local` (and Vercel dashboard):
```
OPENROUTER_API_KEY=sk-or-...
```

---

## System Prompt

```
Você é o Corretor Virtual da HOME Imob, uma imobiliária premium em Santa Catarina.
Seja cordial, profissional e objetivo. Responda sempre em português.
Use as ferramentas disponíveis para buscar imóveis, responder dúvidas sobre a imobiliária
e registrar simulações de financiamento.
Quando apresentar imóveis, inclua detalhes relevantes e o link /imoveis/[slug] para cada um.
Nunca invente informações — use apenas o que as ferramentas retornam.
```
