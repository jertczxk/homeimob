# Supabase Integration Design — HOME Imob

**Date:** 2026-04-11
**Status:** Approved
**Project:** Portfolio imobiliária — sem usuários reais, sem autenticação

---

## Context

HOME Imob is a Next.js 16 App Router project with a public real estate site and a full admin panel. All data is currently mocked (`src/lib/mock.ts`, `src/lib/mock-admin.ts`, and inline mocks in several pages). A Supabase project (`HOME Imob`, id: `oqmaymqoifyfhrrcyyim`, region: us-west-2) exists but has no tables. The `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` is already configured.

**Constraints:**
- No authentication (admin panel is open, middleware stays as `NextResponse.next()`)
- No real users or properties — seed data based on existing mocks + generated realistic data
- Must preserve all existing UI and TypeScript types

---

## Architecture

**Pattern: Server Components + Server Actions (Next.js App Router)**

- Data reads: Server Components call query functions directly — no API routes, no `useEffect`
- Data writes: Server Actions in `actions.ts` files colocated with each admin route
- Client state: Zustand simplified to UI-only (sidebar open/close, detail panel open/close)
- URL-based filters: List pages use `searchParams` instead of `useState` for filter state

---

## Database Schema (13 tables)

### Core — Public Site

**`imoveis`** — mirrors `Imovel` type
`id uuid PK | slug text UNIQUE | titulo text | descricao text | tipo text | finalidade text | preco numeric | area_m2 numeric | quartos int | banheiros int | vagas int | endereco text | bairro text | cidade text | uf text | cep text | latitude float | longitude float | destaque bool | status text | created_at timestamptz | updated_at timestamptz`

**`imovel_fotos`** — mirrors `ImovelFoto` type
`id uuid PK | imovel_id uuid FK→imoveis | url text | ordem int | created_at timestamptz`

**`blog_posts`** — mirrors `BlogPost` type
`id uuid PK | titulo text | slug text UNIQUE | resumo text | conteudo text | cover_url text | status text | autor text | tags text[] | published_at timestamptz | created_at timestamptz | updated_at timestamptz`

### CRM

**`leads`** — mirrors `Lead` type (camelCase→snake_case)
`id uuid PK | nome text | email text | telefone text | interesse text | tipo_interesse text | valor_min numeric | valor_max numeric | bairro_interesse text | stage text | prioridade text | origem text | corretor text | notas text | created_at timestamptz | updated_at timestamptz`

**`lead_interactions`** — mirrors `LeadInteraction` type
`id uuid PK | lead_id uuid FK→leads | tipo text | descricao text | created_at timestamptz`

### Clientes

**`clientes`** — mirrors `Cliente` type
`id uuid PK | nome text | tipo_pessoa text | cpf_cnpj text | email text | telefone text | endereco text | papeis text[] | notas text | created_at timestamptz | updated_at timestamptz`

### Locações

**`contratos`** — mirrors `Contrato` type
`id uuid PK | imovel_id uuid FK→imoveis | proprietario_id uuid FK→clientes | inquilino_id uuid FK→clientes | valor_aluguel numeric | data_inicio date | data_fim date | dia_vencimento int | taxa_administracao numeric | status text | created_at timestamptz | updated_at timestamptz`

**`pagamentos`** — mirrors `Pagamento` type
`id uuid PK | contrato_id uuid FK→contratos | referencia text | valor numeric | data_vencimento date | data_pagamento date | status text | created_at timestamptz`

**`repasses`**
`id uuid PK | contrato_id uuid FK→contratos | mes_referencia text | valor_bruto numeric | taxa_administracao numeric | valor_liquido numeric | data_repasse date | status text | created_at timestamptz`

**`manutencoes`**
`id uuid PK | imovel_id uuid FK→imoveis | titulo text | descricao text | status text | custo numeric | data_abertura date | data_conclusao date | created_at timestamptz`

**`vistorias`**
`id uuid PK | contrato_id uuid FK→contratos | tipo text (entrada|saida|periodica) | data date | laudo text | created_at timestamptz`

### Vendas

**`propostas`**
`id uuid PK | imovel_id uuid FK→imoveis | comprador_id uuid FK→clientes | proprietario_id uuid FK→clientes | valor_pedido numeric | valor_oferta numeric | contraproposta numeric | data date | validade date | status text | corretor text | created_at timestamptz | updated_at timestamptz`

**`visitas_vendas`**
`id uuid PK | lead_id uuid FK→leads | imovel_id uuid FK→imoveis | data timestamptz | status text | corretor text | notas text | created_at timestamptz`

---

## Data Access Layer

### Query functions — `src/lib/supabase/queries/`

```
imoveis.ts      → getImoveis(filters?), getImovelBySlug(slug), getImoveisDestaque()
leads.ts        → getLeads(), getLeadById(id), getLeadInteractions(leadId)
clientes.ts     → getClientes(), getClienteById(id)
contratos.ts    → getContratos(), getContratoById(id)
pagamentos.ts   → getPagamentosByContrato(contratoId)
repasses.ts     → getRepassesByContrato(contratoId)
manutencoes.ts  → getManutencoes(), getManutencoByImovel(imovelId)
vistorias.ts    → getVistoriasByContrato(contratoId)
propostas.ts    → getPropostas()
visitas.ts      → getVisitasVendas()
blog.ts         → getBlogPosts(status?), getBlogPostBySlug(slug)
dashboard.ts    → getDashboardStats(), getAtividades()
```

Each function returns typed data and handles Supabase errors by throwing (caught by Next.js error boundaries).

### Server Actions — colocated with routes

```
src/app/(admin)/admin/imoveis/actions.ts
src/app/(admin)/admin/crm/actions.ts
src/app/(admin)/admin/clientes/actions.ts
src/app/(admin)/admin/blog/actions.ts
src/app/(admin)/admin/locacoes/actions.ts
src/app/(admin)/admin/vendas/actions.ts
```

Each actions file exports `create*`, `update*`, `delete*` functions marked `'use server'`. After mutation, calls `revalidatePath()` to refresh the server component data.

### Supabase Storage

Bucket `imovel-fotos` (public) for property photo uploads. `UploadFotos.tsx` uploads client-side via `supabase.storage.from('imovel-fotos').upload()` and saves the public URL to `imovel_fotos` table.

---

## Migration Plan

### Step 1 — SQL Migration (via Supabase MCP `apply_migration`)
Create all 13 tables with proper types, FK constraints, and indexes on slug/status/created_at columns. Enable RLS but set permissive policies (allow all) since there's no auth.

### Step 2 — Seed Data (via Supabase MCP `execute_sql`)
Insert seed data based on existing mocks:
- 8+ imóveis with photos (from `mockImoveis` + extras)
- 8 leads with interactions (from `mockLeads` + `mockInteractions`)
- 5 clientes (from inline `mockClientes`)
- 2 blog posts (from `mockBlogPosts`)
- 3 contratos + related pagamentos, repasses, vistorias
- 4 propostas (from inline `mockPropostas`)
- Visitas, manutenções extras for realistic dashboard

### Step 3 — Replace mocks, module by module (priority order)
1. Site: `/imoveis`, `/imoveis/[slug]`, `/blog`, `/blog/[slug]`
2. Admin core: `/admin/imoveis`, `/admin/crm`, `/admin/clientes`, `/admin/blog`
3. Admin locações: contratos, aluguéis, repasses, manutenções, vistorias
4. Admin vendas: captação, visitas, propostas, relatórios
5. Dashboard: KPIs and activity feed from real queries

### Step 4 — Cleanup
- Delete `src/lib/mock.ts` and `src/lib/mock-admin.ts`
- Simplify `admin-store.ts` to UI state only (remove leads/interactions)
- Recreate `.env.example` with empty placeholder keys

---

## Zustand Store — Post-migration shape

```ts
interface AdminState {
  // UI only
  sidebarOpen: boolean
  toggleSidebar: () => void
  selectedLeadId: string | null
  detailPanelOpen: boolean
  selectLead: (id: string | null) => void
  closeDetailPanel: () => void
}
```

---

## Out of Scope
- Authentication / protected routes
- Real-time subscriptions (Supabase Realtime)
- Email notifications
- Pagination (lists show all records — portfolio scale)
- Row Level Security enforcement (tables have RLS enabled but open policies)
