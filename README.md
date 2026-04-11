# HOME Imob

Sistema de gestão imobiliária completo — site público + painel administrativo, construído com Next.js 16 App Router e Supabase.

---

## Visão Geral

HOME Imob é uma plataforma para imobiliárias e corretores gerenciarem imóveis, clientes, locações, vendas, CRM e blog. O site público exibe os imóveis disponíveis, e o painel `/admin` oferece gestão completa de todas as entidades.

**Sem autenticação por design** — o painel admin é de uso interno (rede local ou VPN). A proteção de acesso pode ser adicionada futuramente via Supabase Auth ou middleware.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Banco de dados | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Estilos | Tailwind CSS 3 |
| Estado UI | Zustand 5 |
| Formulários | React Hook Form + Zod |
| Ícones | Lucide React |
| Deploy | Vercel (recomendado) |

---

## Funcionalidades

### Site Público (`/`)
- Listagem de imóveis com filtros (tipo, finalidade, preço, quartos)
- Página de detalhe do imóvel com galeria de fotos
- Blog com posts em Markdown
- Páginas institucionais (Quem Somos, Contato, Índices Econômicos)
- Botão de contato via WhatsApp

### Painel Admin (`/admin`)
- **Dashboard** — KPIs em tempo real, funil CRM, receita mensal, atividades recentes
- **Imóveis** — CRUD completo com upload de fotos para Supabase Storage
- **CRM** — Kanban board com drag-and-drop, histórico de interações por lead
- **Clientes** — Cadastro de proprietários, inquilinos, compradores e vendedores
- **Locações**
  - Contratos de locação
  - Aluguéis (pagamentos mensais)
  - Repasses para proprietários
  - Manutenções
  - Vistorias
- **Vendas**
  - Pipeline de vendas (funil visual)
  - Captações de imóveis
  - Visitas
  - Propostas e contrapropostas
- **Blog** — Editor Markdown com preview ao vivo, tags, imagem de capa, status rascunho/publicado

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── (admin)/admin/          # Painel administrativo
│   │   ├── _components/        # DashboardClient
│   │   ├── imoveis/            # CRUD imóveis + upload de fotos
│   │   ├── crm/                # KanbanBoard com drag-and-drop
│   │   ├── clientes/           # Gestão de clientes
│   │   ├── locacoes/           # contratos, alugueis, repasses, manutencoes, vistorias
│   │   ├── vendas/             # captacao, visitas, propostas, pipeline
│   │   └── blog/               # Editor markdown
│   ├── (site)/                 # Site público
│   │   ├── page.tsx            # Home
│   │   ├── imoveis/            # Listagem e detalhe
│   │   └── blog/               # Blog
│   └── api/                    # Rotas de API (leads, revalidate)
├── components/
│   ├── admin/                  # Componentes do painel
│   │   ├── crm/KanbanBoard.tsx
│   │   └── UploadFotos.tsx
│   └── site/                   # Componentes do site público
├── lib/
│   ├── supabase/
│   │   ├── server.ts           # Cliente server-side (@supabase/ssr)
│   │   ├── client.ts           # Cliente browser-side
│   │   └── queries/            # Funções de leitura por módulo
│   └── utils.ts
├── store/
│   └── admin-store.ts          # Zustand — apenas estado de UI
└── types/
    └── index.ts                # Todos os tipos TypeScript
```

---

## Banco de Dados

O schema completo está em `supabase/schema.sql`. Principais tabelas:

| Tabela | Descrição |
|---|---|
| `imoveis` | Imóveis com dados completos |
| `imovel_fotos` | Fotos associadas aos imóveis |
| `leads` | Leads do CRM |
| `lead_interactions` | Histórico de interações por lead |
| `clientes` | Clientes (proprietários, inquilinos, compradores) |
| `contratos` | Contratos de locação |
| `pagamentos` | Aluguéis mensais |
| `repasses` | Repasses para proprietários |
| `manutencoes` | Manutenções em imóveis |
| `vistorias` | Vistorias de entrada/saída/periódica |
| `captacoes` | Captações de imóveis para venda |
| `visitas_vendas` | Visitas de potenciais compradores |
| `propostas` | Propostas e contrapropostas de compra |
| `blog_posts` | Posts do blog |

---

## Configuração

### 1. Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (use `.env.example` como base):

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

NEXT_PUBLIC_WHATSAPP_NUMBER=5548999999999
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br
NEXT_PUBLIC_GOOGLE_MAPS_KEY=        # opcional
```

As chaves do Supabase estão em: **Supabase Dashboard → Settings → API**

### 2. Banco de dados

Execute o schema no SQL Editor do Supabase:

```
supabase/schema.sql
```

### 3. Storage

No Supabase Dashboard, crie um bucket público chamado **`imoveis`**:

> Storage → New bucket → Nome: `imoveis` → Public: ✅

### 4. Instalar e rodar localmente

```bash
npm install
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Painel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deploy (Vercel)

1. Faça push do código para o GitHub
2. Importe o repositório em [vercel.com](https://vercel.com)
3. Configure as variáveis de ambiente no painel da Vercel:

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Seu número com DDI (ex: `5548999999999`) |
| `NEXT_PUBLIC_SITE_URL` | URL final da Vercel (ex: `https://homeimob.vercel.app`) |

4. Deploy automático a cada push para `main`

---

## Arquitetura de dados

```
page.tsx (Server Component)
    │
    ├── lib/supabase/queries/[modulo].ts  ←  Supabase query
    │
    └── [Modulo]Client.tsx  ('use client') ←  UI interativa
            │
            └── actions.ts  ('use server') ←  mutations + revalidatePath
```

- **Leituras**: Server Components chamam as queries diretamente (sem `useEffect`, sem API routes)
- **Escritas**: Server Actions com `revalidatePath` para invalidar cache após mutations
- **Estado**: Zustand usado apenas para UI (sidebar aberta/fechada, painel de detalhe do CRM)
- **Upload de fotos**: Cliente browser faz upload direto para Supabase Storage; Server Action insere a URL na tabela `imovel_fotos`

---

## Scripts

```bash
npm run dev      # servidor de desenvolvimento (http://localhost:3000)
npm run build    # build de produção
npm run start    # servidor de produção (após build)
npm run lint     # verificação ESLint
```

Verificação TypeScript manual:

```bash
npx tsc --noEmit
```
