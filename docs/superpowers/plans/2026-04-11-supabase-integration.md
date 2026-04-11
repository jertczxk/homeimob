# HOME Imob — Supabase Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans`. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **IMPORTANT:** Before writing any React/Next.js component code, invoke the `vercel-react-best-practices` skill.

**Goal:** Replace all mock data with a real Supabase database, implementing full CRUD across all modules using Server Components + Server Actions.

**Architecture:** Server Components call typed query functions in `src/lib/supabase/queries/`. Mutations use Server Actions colocated with each route. Client components handle UI interactions only (filters via URL searchParams, forms via useActionState).

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase (PostgreSQL + Storage), `@supabase/ssr`, Zustand (UI state only), Zod, react-hook-form.

---

## File Map

**New:**
- `src/lib/supabase/queries/imoveis.ts`
- `src/lib/supabase/queries/blog.ts`
- `src/lib/supabase/queries/leads.ts`
- `src/lib/supabase/queries/clientes.ts`
- `src/lib/supabase/queries/locacoes.ts`
- `src/lib/supabase/queries/vendas.ts`
- `src/lib/supabase/queries/dashboard.ts`
- `src/app/(admin)/admin/imoveis/actions.ts`
- `src/app/(admin)/admin/crm/actions.ts`
- `src/app/(admin)/admin/clientes/actions.ts`
- `src/app/(admin)/admin/blog/actions.ts`
- `src/app/(admin)/admin/locacoes/actions.ts`
- `src/app/(admin)/admin/vendas/actions.ts`
- `.env.example`

**Modified (key files):**
- `src/types/index.ts` — add extended join types
- `src/store/admin-store.ts` — strip data, keep UI state only
- `src/app/(site)/page.tsx` — remove `'use client'`, fetch destaques server-side
- `src/app/(site)/imoveis/page.tsx`, `[slug]/page.tsx`
- `src/app/(site)/blog/page.tsx`, `[slug]/page.tsx`
- `src/app/(admin)/admin/page.tsx` (dashboard)
- `src/app/(admin)/admin/imoveis/page.tsx`, `[id]/page.tsx`, `novo/page.tsx`
- `src/app/(admin)/admin/crm/page.tsx`
- `src/app/(admin)/admin/clientes/page.tsx`
- `src/app/(admin)/admin/blog/page.tsx`, `[id]/page.tsx`, `novo/page.tsx`
- All locações pages, all vendas pages
- `src/components/admin/UploadFotos.tsx`

**Deleted:**
- `src/lib/mock.ts`
- `src/lib/mock-admin.ts`

---

## Task 1: SQL Migration — Create All Tables

**Files:** Supabase MCP only (no local files)

- [ ] **Step 1: Apply migration via MCP**

Run `mcp__supabase__apply_migration` with project_id `oqmaymqoifyfhrrcyyim`, name `init_schema`, and this SQL:

```sql
-- Extensions
create extension if not exists "uuid-ossp";

-- ── IMOVEIS ──────────────────────────────────────────────────
create table public.imoveis (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  titulo      text not null,
  descricao   text,
  tipo        text not null check (tipo in ('residencial','comercial')),
  finalidade  text not null check (finalidade in ('venda','locação')),
  preco       numeric,
  area_m2     numeric,
  quartos     int not null default 0,
  banheiros   int not null default 0,
  vagas       int not null default 0,
  endereco    text,
  bairro      text,
  cidade      text,
  uf          text,
  cep         text,
  latitude    float,
  longitude   float,
  destaque    boolean not null default false,
  status      text not null default 'ativo'
              check (status in ('ativo','inativo','vendido','locado')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.imovel_fotos (
  id         uuid primary key default uuid_generate_v4(),
  imovel_id  uuid not null references public.imoveis(id) on delete cascade,
  url        text not null,
  ordem      int not null default 0,
  created_at timestamptz not null default now()
);

-- ── LEADS ────────────────────────────────────────────────────
create table public.leads (
  id               uuid primary key default uuid_generate_v4(),
  nome             text not null,
  email            text,
  telefone         text not null,
  interesse        text not null check (interesse in ('venda','locação')),
  tipo_interesse   text check (tipo_interesse in ('residencial','comercial')),
  valor_min        numeric,
  valor_max        numeric,
  bairro_interesse text,
  stage            text not null default 'lead'
                   check (stage in ('lead','atendimento','visita','proposta','negociacao','fechamento')),
  prioridade       text not null default 'media'
                   check (prioridade in ('alta','media','baixa')),
  origem           text not null
                   check (origem in ('site','indicacao','portais','telefone','whatsapp','presencial')),
  corretor         text,
  notas            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.lead_interactions (
  id         uuid primary key default uuid_generate_v4(),
  lead_id    uuid not null references public.leads(id) on delete cascade,
  tipo       text not null check (tipo in ('ligacao','whatsapp','email','visita','proposta','nota')),
  descricao  text not null,
  created_at timestamptz not null default now()
);

-- ── CLIENTES ─────────────────────────────────────────────────
create table public.clientes (
  id          uuid primary key default uuid_generate_v4(),
  nome        text not null,
  tipo_pessoa text not null check (tipo_pessoa in ('PF','PJ')),
  cpf_cnpj    text,
  email       text,
  telefone    text not null,
  endereco    text,
  papeis      text[] not null default '{}',
  notas       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── BLOG ─────────────────────────────────────────────────────
create table public.blog_posts (
  id           uuid primary key default uuid_generate_v4(),
  titulo       text not null,
  slug         text unique not null,
  resumo       text,
  conteudo     text not null default '',
  cover_url    text,
  status       text not null default 'rascunho'
               check (status in ('rascunho','publicado','agendado')),
  autor        text not null,
  tags         text[] not null default '{}',
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── LOCAÇÕES ─────────────────────────────────────────────────
create table public.contratos (
  id                  uuid primary key default uuid_generate_v4(),
  imovel_id           uuid not null references public.imoveis(id),
  proprietario_id     uuid not null references public.clientes(id),
  inquilino_id        uuid not null references public.clientes(id),
  valor_aluguel       numeric not null,
  data_inicio         date not null,
  data_fim            date not null,
  dia_vencimento      int not null,
  taxa_administracao  numeric not null default 10,
  status              text not null default 'ativo'
                      check (status in ('ativo','encerrado','rescindido','vencido')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.pagamentos (
  id              uuid primary key default uuid_generate_v4(),
  contrato_id     uuid not null references public.contratos(id) on delete cascade,
  referencia      text not null,
  valor           numeric not null,
  data_vencimento date not null,
  data_pagamento  date,
  status          text not null default 'pendente'
                  check (status in ('pendente','pago','atrasado','cancelado')),
  created_at      timestamptz not null default now()
);

create table public.repasses (
  id                  uuid primary key default uuid_generate_v4(),
  contrato_id         uuid not null references public.contratos(id) on delete cascade,
  mes_referencia      text not null,
  valor_bruto         numeric not null,
  taxa_administracao  numeric not null,
  valor_liquido       numeric not null,
  data_repasse        date,
  status              text not null default 'pendente'
                      check (status in ('pendente','realizado','cancelado')),
  created_at          timestamptz not null default now()
);

create table public.manutencoes (
  id             uuid primary key default uuid_generate_v4(),
  imovel_id      uuid not null references public.imoveis(id),
  titulo         text not null,
  descricao      text,
  status         text not null default 'aberta'
                 check (status in ('aberta','em_andamento','concluida','cancelada')),
  custo          numeric,
  data_abertura  date not null default current_date,
  data_conclusao date,
  created_at     timestamptz not null default now()
);

create table public.vistorias (
  id          uuid primary key default uuid_generate_v4(),
  contrato_id uuid not null references public.contratos(id) on delete cascade,
  tipo        text not null check (tipo in ('entrada','saida','periodica')),
  data        date not null,
  laudo       text,
  created_at  timestamptz not null default now()
);

-- ── VENDAS ───────────────────────────────────────────────────
create table public.propostas (
  id                uuid primary key default uuid_generate_v4(),
  imovel_id         uuid references public.imoveis(id),
  comprador_id      uuid references public.clientes(id),
  proprietario_id   uuid references public.clientes(id),
  imovel_descricao  text,
  comprador_nome    text,
  proprietario_nome text,
  valor_pedido      numeric not null,
  valor_oferta      numeric not null,
  contraproposta    numeric,
  data              date not null default current_date,
  validade          date not null,
  status            text not null default 'aguardando'
                    check (status in ('aguardando','contraproposta','aceita','recusada','expirada')),
  corretor          text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.visitas_vendas (
  id         uuid primary key default uuid_generate_v4(),
  lead_id    uuid references public.leads(id),
  imovel_id  uuid references public.imoveis(id),
  data       timestamptz not null,
  status     text not null default 'agendada'
             check (status in ('agendada','realizada','cancelada')),
  corretor   text,
  notas      text,
  created_at timestamptz not null default now()
);

create table public.captacoes (
  id              uuid primary key default uuid_generate_v4(),
  endereco        text not null,
  proprietario    text not null,
  telefone        text not null,
  tipo            text not null,
  valor_estimado  numeric not null,
  status          text not null default 'prospectando'
                  check (status in ('prospectando','em_avaliacao','autorizado','recusado')),
  corretor        text,
  data            date not null default current_date,
  created_at      timestamptz not null default now()
);

-- ── RLS (permissive — no auth) ────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'imoveis','imovel_fotos','leads','lead_interactions',
    'clientes','blog_posts','contratos','pagamentos',
    'repasses','manutencoes','vistorias','propostas',
    'visitas_vendas','captacoes'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "allow_all_%I" on public.%I for all using (true) with check (true)', t, t
    );
  end loop;
end $$;

-- ── INDEXES ───────────────────────────────────────────────────
create index on public.imoveis(slug);
create index on public.imoveis(status);
create index on public.imoveis(destaque);
create index on public.imovel_fotos(imovel_id);
create index on public.leads(stage);
create index on public.lead_interactions(lead_id);
create index on public.blog_posts(slug);
create index on public.blog_posts(status);
create index on public.contratos(imovel_id);
create index on public.pagamentos(contrato_id);
create index on public.repasses(contrato_id);
```

- [ ] **Step 2: Verify tables exist**

Run `mcp__supabase__list_tables` with project_id `oqmaymqoifyfhrrcyyim`. Expected: 14 tables listed.

- [ ] **Step 3: Commit note**

```bash
git commit --allow-empty -m "feat: apply Supabase schema migration (14 tables)"
```

---

## Task 2: Seed Data

**Files:** Supabase MCP only

- [ ] **Step 1: Seed imoveis + fotos**

Run `mcp__supabase__execute_sql` with project_id `oqmaymqoifyfhrrcyyim`:

```sql
insert into public.imoveis (id,slug,titulo,descricao,tipo,finalidade,preco,area_m2,quartos,banheiros,vagas,endereco,bairro,cidade,uf,cep,latitude,longitude,destaque,status) values
('a0000001-0000-0000-0000-000000000001','casa-espetacular-jardins','Casa Espetacular com Piscina','Uma belíssima casa localizada no coração dos Jardins. Conta com área de lazer completa, piscina aquecida, churrasqueira e amplo jardim.','residencial','venda',3500000,450,4,5,4,'Rua das Flores, 123','Jardins','São Paulo','SP','01422-000',-23.56168,-46.65598,true,'ativo'),
('a0000001-0000-0000-0000-000000000002','apartamento-moderno-paulista','Apartamento Moderno e Mobiliado','Apartamento recém-reformado, com móveis planejados de alto padrão. Localização privilegiada, a duas quadras da Av. Paulista.','residencial','locação',6500,85,2,2,1,'Alameda Santos, 1000','Bela Vista','São Paulo','SP','01418-100',-23.56388,-46.65348,true,'ativo'),
('a0000001-0000-0000-0000-000000000003','sala-comercial-faria-lima','Laje Corporativa Alto Padrão','Excelente vão livre em um dos prédios mais cobiçados da Faria Lima. Certificação LEED, piso elevado, ar condicionado central.','comercial','locação',25000,300,0,4,10,'Av. Brigadeiro Faria Lima, 3000','Itaim Bibi','São Paulo','SP','01451-001',-23.58668,-46.68218,true,'ativo'),
('a0000001-0000-0000-0000-000000000004','cobertura-duplex-leblon','Cobertura Duplex com Vista Mar','Incrível cobertura reformada com vista panorâmica pro mar. Terraço espaçoso com piscina privativa, deck de madeira e espaço gourmet.','residencial','venda',8900000,280,3,4,3,'Av. Delfim Moreira','Leblon','Rio de Janeiro','RJ','22441-000',-22.98668,-43.22018,false,'ativo'),
('a0000001-0000-0000-0000-000000000005','casa-alto-padrao-alphaville','Casa Alto Padrão em Condomínio','Espetacular residência em condomínio fechado de alto padrão. Arquitetura contemporânea, acabamentos nobres e total segurança.','residencial','venda',4200000,520,5,6,6,'Alameda Grajaú, 350','Alphaville','Barueri','SP','06454-050',-23.51000,-46.85000,true,'ativo'),
('a0000001-0000-0000-0000-000000000006','apartamento-compacto-vila-madalena','Studio Moderno — Vila Madalena','Studio totalmente reformado no coração da Vila Madalena. Próximo a bares, restaurantes e metrô. Ideal para jovens profissionais.','residencial','locação',3200,42,1,1,1,'Rua Harmonia, 400','Vila Madalena','São Paulo','SP','05435-000',-23.55800,-46.68900,false,'ativo'),
('a0000001-0000-0000-0000-000000000007','sala-comercial-berrini','Conjunto Comercial — Berrini','Conjunto de alto padrão no eixo Berrini. Fachada envidraçada, piso elevado e vista privilegiada. Prédio AAA.','comercial','locação',18000,180,0,3,6,'Av. das Nações Unidas, 14000','Brooklin','São Paulo','SP','04794-000',-23.61200,-46.69500,false,'ativo'),
('a0000001-0000-0000-0000-000000000008','apartamento-garden-moema','Apartamento Garden — Moema','Raridade no bairro: apartamento garden com jardim privativo de 120m². Reformado, 3 quartos sendo 1 suíte master.','residencial','venda',1850000,140,3,3,2,'Alameda dos Anapurus, 800','Moema','São Paulo','SP','04087-001',-23.60500,-46.66700,true,'ativo');

insert into public.imovel_fotos (imovel_id,url,ordem) values
('a0000001-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600',0),
('a0000001-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',1),
('a0000001-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1600607687931-cecebd808cbd?auto=format&fit=crop&q=80&w=1600',2),
('a0000001-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1600',0),
('a0000001-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1502672260266-1c1c24240f38?auto=format&fit=crop&q=80&w=1600',1),
('a0000001-0000-0000-0000-000000000003','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600',0),
('a0000001-0000-0000-0000-000000000004','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600',0),
('a0000001-0000-0000-0000-000000000005','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1600',0),
('a0000001-0000-0000-0000-000000000005','https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1600',1),
('a0000001-0000-0000-0000-000000000006','https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1600',0),
('a0000001-0000-0000-0000-000000000007','https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&q=80&w=1600',0),
('a0000001-0000-0000-0000-000000000008','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1600',0);
```

- [ ] **Step 2: Seed clientes**

```sql
insert into public.clientes (id,nome,tipo_pessoa,cpf_cnpj,email,telefone,endereco,papeis,notas) values
('b0000002-0000-0000-0000-000000000001','Carlos Alberto Santos','PF','123.456.789-00','carlos@email.com','(11) 99888-7766','Rua das Flores, 123 — Jardins, SP',array['comprador'],'Procura casa com piscina'),
('b0000002-0000-0000-0000-000000000002','Maria Fernanda Lima','PF','987.654.321-00','maria@email.com','(11) 98877-6655','Av. Paulista, 1000 — Bela Vista, SP',array['inquilino'],null),
('b0000002-0000-0000-0000-000000000003','Investimentos Globo Ltda','PJ','12.345.678/0001-00','contato@globo.com','(11) 3000-0000','Av. Faria Lima, 3000 — Itaim Bibi, SP',array['proprietario','vendedor'],'Empresa de investimentos imobiliários'),
('b0000002-0000-0000-0000-000000000004','Roberto Silva Oliveira','PF','456.789.012-33','roberto@empresa.com','(11) 97766-5544','Rua Augusta, 500 — Consolação, SP',array['proprietario'],'Possui 3 imóveis conosco'),
('b0000002-0000-0000-0000-000000000005','Luciana Costa Pereira','PF','789.012.345-66','luciana@email.com','(11) 96655-4433','Av. Delfim Moreira — Leblon, RJ',array['comprador'],'Busca cobertura no Leblon');
```

- [ ] **Step 3: Seed leads + interactions**

```sql
insert into public.leads (id,nome,email,telefone,interesse,tipo_interesse,valor_min,valor_max,bairro_interesse,stage,prioridade,origem,corretor,notas,created_at,updated_at) values
('c0000003-0000-0000-0000-000000000001','Carlos Alberto','carlos@email.com','(11) 99888-7766','venda','residencial',500000,1000000,'Jardins','lead','alta','site','Ana','Procura casa com piscina','2024-03-10T10:00:00Z','2024-03-10T10:00:00Z'),
('c0000003-0000-0000-0000-000000000002','Maria Fernanda','maria@email.com','(11) 98877-6655','locação','residencial',3000,6000,'Bela Vista','atendimento','media','indicacao','João',null,'2024-03-08T14:00:00Z','2024-03-12T09:00:00Z'),
('c0000003-0000-0000-0000-000000000003','Roberto Silva','roberto@empresa.com','(11) 97766-5544','locação','comercial',10000,30000,'Itaim Bibi','visita','alta','portais','Ana','Precisa de laje corporativa com 10+ vagas','2024-03-05T08:00:00Z','2024-03-14T16:00:00Z'),
('c0000003-0000-0000-0000-000000000004','Luciana Costa','luciana@email.com','(11) 96655-4433','venda','residencial',2000000,5000000,'Leblon','proposta','alta','whatsapp','João','Cobertura com vista mar','2024-02-28T11:00:00Z','2024-03-15T10:00:00Z'),
('c0000003-0000-0000-0000-000000000005','André Mendes','andre@email.com','(11) 95544-3322','venda','residencial',800000,1500000,'Paulista','negociacao','media','telefone','Ana','Apartamento 3 quartos','2024-02-20T09:00:00Z','2024-03-16T14:00:00Z'),
('c0000003-0000-0000-0000-000000000006','Patricia Gomes','patricia@email.com','(11) 94433-2211','locação','residencial',2000,4000,'Centro','lead','baixa','site',null,null,'2024-03-15T16:00:00Z','2024-03-15T16:00:00Z'),
('c0000003-0000-0000-0000-000000000007','Fernando Alves','fernando@corp.com','(11) 93322-1100','venda','comercial',5000000,15000000,'Faria Lima','atendimento','alta','presencial','Ana','Investidor, busca imóvel comercial alto padrão','2024-03-12T10:00:00Z','2024-03-14T15:00:00Z'),
('c0000003-0000-0000-0000-000000000008','Juliana Ramos','juliana@email.com','(11) 92211-0099','locação','residencial',4000,8000,'Moema','fechamento','alta','indicacao','João','Contrato assinado! Mudança prevista para abril.','2024-01-15T08:00:00Z','2024-03-16T18:00:00Z');

insert into public.lead_interactions (lead_id,tipo,descricao,created_at) values
('c0000003-0000-0000-0000-000000000001','nota','Lead recebido pelo formulário do site.','2024-03-10T10:00:00Z'),
('c0000003-0000-0000-0000-000000000002','ligacao','Liguei para apresentar opções de locação na Bela Vista.','2024-03-09T10:00:00Z'),
('c0000003-0000-0000-0000-000000000002','whatsapp','Enviei fotos do apartamento da Alameda Santos.','2024-03-12T09:00:00Z'),
('c0000003-0000-0000-0000-000000000003','visita','Visitamos a laje corporativa no edifício Platinum.','2024-03-14T16:00:00Z'),
('c0000003-0000-0000-0000-000000000004','proposta','Proposta enviada: R$ 8.500.000 na cobertura do Leblon.','2024-03-15T10:00:00Z'),
('c0000003-0000-0000-0000-000000000005','ligacao','Negociando valor e condições de pagamento.','2024-03-16T14:00:00Z');
```

- [ ] **Step 4: Seed blog posts**

```sql
insert into public.blog_posts (id,titulo,slug,resumo,conteudo,cover_url,status,autor,tags,published_at) values
('d0000004-0000-0000-0000-000000000001','Como escolher o bairro ideal para morar','como-escolher-bairro-ideal','Dicas práticas para avaliar infraestrutura, segurança e qualidade de vida.','# Como escolher o bairro ideal\n\nEscolher onde morar é uma das decisões mais importantes da sua vida. Considere fatores como infraestrutura, segurança, mobilidade e qualidade de vida.\n\n## Infraestrutura\n\nVerifique a presença de escolas, hospitais, supermercados e farmácias nas proximidades.\n\n## Mobilidade\n\nAvalie o acesso ao transporte público e o tempo de deslocamento para o trabalho.\n\n## Segurança\n\nPesquise os índices de criminalidade da região e converse com moradores locais.','https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800','publicado','Ana',array['dicas','moradia'],'2024-03-10T08:00:00Z'),
('d0000004-0000-0000-0000-000000000002','5 erros ao comprar seu primeiro imóvel','5-erros-comprar-imovel','Evite as armadilhas mais comuns na hora de investir em um imóvel.','# 5 Erros Comuns ao Comprar seu Primeiro Imóvel\n\nComprar o primeiro imóvel é um momento especial, mas cheio de armadilhas.\n\n## 1. Não verificar a documentação\n\nSempre solicite a matrícula atualizada do imóvel e verifique se há pendências.\n\n## 2. Ignorar os custos extras\n\nAlém do valor do imóvel, há ITBI, escritura, cartório e reformas.\n\n## 3. Não fazer vistoria técnica\n\nContrate um engenheiro para avaliar a estrutura antes de fechar negócio.','https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800','rascunho','João',array['compra','investimento'],null);
```

- [ ] **Step 5: Seed contratos + locações data**

```sql
insert into public.contratos (id,imovel_id,proprietario_id,inquilino_id,valor_aluguel,data_inicio,data_fim,dia_vencimento,taxa_administracao,status) values
('e0000005-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000002','b0000002-0000-0000-0000-000000000004','b0000002-0000-0000-0000-000000000002',6500,'2024-01-15','2025-01-14',10,10,'ativo'),
('e0000005-0000-0000-0000-000000000002','a0000001-0000-0000-0000-000000000003','b0000002-0000-0000-0000-000000000003','b0000002-0000-0000-0000-000000000001',25000,'2023-06-01','2024-05-31',5,8,'vencido'),
('e0000005-0000-0000-0000-000000000003','a0000001-0000-0000-0000-000000000002','b0000002-0000-0000-0000-000000000004','b0000002-0000-0000-0000-000000000005',4200,'2023-01-01','2023-12-31',15,10,'encerrado');

insert into public.pagamentos (contrato_id,referencia,valor,data_vencimento,data_pagamento,status) values
('e0000005-0000-0000-0000-000000000001','01/2024',6500,'2024-01-10','2024-01-09','pago'),
('e0000005-0000-0000-0000-000000000001','02/2024',6500,'2024-02-10','2024-02-10','pago'),
('e0000005-0000-0000-0000-000000000001','03/2024',6500,'2024-03-10','2024-03-08','pago'),
('e0000005-0000-0000-0000-000000000001','04/2024',6500,'2024-04-10',null,'pendente'),
('e0000005-0000-0000-0000-000000000002','02/2024',25000,'2024-02-05','2024-02-04','pago'),
('e0000005-0000-0000-0000-000000000002','03/2024',25000,'2024-03-05',null,'atrasado');

insert into public.repasses (contrato_id,mes_referencia,valor_bruto,taxa_administracao,valor_liquido,data_repasse,status) values
('e0000005-0000-0000-0000-000000000001','01/2024',6500,650,5850,'2024-01-12','realizado'),
('e0000005-0000-0000-0000-000000000001','02/2024',6500,650,5850,'2024-02-12','realizado'),
('e0000005-0000-0000-0000-000000000001','03/2024',6500,650,5850,'2024-03-12','realizado'),
('e0000005-0000-0000-0000-000000000001','04/2024',6500,650,5850,null,'pendente');

insert into public.vistorias (contrato_id,tipo,data,laudo) values
('e0000005-0000-0000-0000-000000000001','entrada','2024-01-13','Imóvel em ótimo estado. Paredes sem infiltrações. Elétrica e hidráulica funcionando normalmente.'),
('e0000005-0000-0000-0000-000000000003','entrada','2023-01-02','Imóvel entregue limpo e em boas condições.'),
('e0000005-0000-0000-0000-000000000003','saida','2024-01-03','Pequenos riscos na parede do quarto. Acordado desconto de R$ 200 na devolução do depósito.');

insert into public.manutencoes (imovel_id,titulo,descricao,status,custo,data_abertura,data_conclusao) values
('a0000001-0000-0000-0000-000000000002','Vazamento na torneira da cozinha','Torneira da cozinha com vazamento constante. Inquilina solicitou troca.','concluida',280,'2024-02-20','2024-02-22'),
('a0000001-0000-0000-0000-000000000003','Ar condicionado sala principal','Split da sala principal com problema no compressor. Necessita troca.','em_andamento',3200,'2024-03-10',null),
('a0000001-0000-0000-0000-000000000001','Pintura área externa','Pintura da fachada e muros com necessidade de renovação.','aberta',8500,'2024-03-15',null),
('a0000001-0000-0000-0000-000000000005','Revisão hidráulica','Revisão preventiva completa da hidráulica.','concluida',1200,'2024-01-10','2024-01-12');
```

- [ ] **Step 6: Seed vendas data**

```sql
insert into public.propostas (imovel_id,comprador_id,proprietario_id,imovel_descricao,comprador_nome,proprietario_nome,valor_pedido,valor_oferta,contraproposta,data,validade,status,corretor) values
('a0000001-0000-0000-0000-000000000001','b0000002-0000-0000-0000-000000000001','b0000002-0000-0000-0000-000000000004','Casa Espetacular — Jardins','Carlos Alberto','Roberto Silva',3500000,3200000,3350000,'2024-03-15','2024-03-22','contraproposta','Ana'),
('a0000001-0000-0000-0000-000000000004','b0000002-0000-0000-0000-000000000005','b0000002-0000-0000-0000-000000000003','Cobertura Duplex — Leblon','Luciana Costa','Investimentos Globo',8900000,8200000,null,'2024-03-16','2024-03-23','aguardando','João'),
('a0000001-0000-0000-0000-000000000008','b0000002-0000-0000-0000-000000000002','b0000002-0000-0000-0000-000000000004','Apt. Garden — Moema','Maria Fernanda','Roberto Silva',1850000,1750000,null,'2024-03-01','2024-03-08','aceita','Ana'),
('a0000001-0000-0000-0000-000000000007','b0000002-0000-0000-0000-000000000001','b0000002-0000-0000-0000-000000000003','Sala Comercial — Faria Lima','Carlos Alberto','Inv. Globo',2800000,2200000,null,'2024-02-25','2024-03-04','recusada','João');

insert into public.visitas_vendas (lead_id,imovel_id,data,status,corretor,notas) values
('c0000003-0000-0000-0000-000000000003','a0000001-0000-0000-0000-000000000003','2024-03-14T16:00:00Z','realizada','Ana','Cliente gostou muito do imóvel.'),
('c0000003-0000-0000-0000-000000000004','a0000001-0000-0000-0000-000000000004','2024-03-17T14:00:00Z','agendada','João',null),
('c0000003-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000001','2024-03-18T10:00:00Z','agendada','Ana',null),
('c0000003-0000-0000-0000-000000000005','a0000001-0000-0000-0000-000000000008','2024-03-10T11:00:00Z','realizada','Ana','Interesse confirmado. Aguarda resposta do cônjuge.');

insert into public.captacoes (endereco,proprietario,telefone,tipo,valor_estimado,status,corretor,data) values
('Rua Oscar Freire, 1200 — Jardins','Pedro Mendes','(11) 99111-2233','Casa',4500000,'em_avaliacao','Ana','2024-03-14'),
('Av. Atlântica, 800 — Copacabana','Márcia Souza','(21) 98877-6655','Apartamento',6200000,'prospectando','João','2024-03-12'),
('Al. Santos, 500 — Paraíso','Roberto Silva','(11) 97766-5544','Sala Comercial',2800000,'autorizado','Ana','2024-03-08'),
('Rua Artur de Azevedo, 300 — Pinheiros','Carla Monteiro','(11) 96655-4433','Apartamento',1100000,'recusado','João','2024-03-05');
```

- [ ] **Step 7: Commit note**

```bash
git commit --allow-empty -m "feat: seed all Supabase tables with portfolio data"
```

---

## Task 3: Supabase Storage Bucket

**Files:** Supabase MCP only

- [ ] **Step 1: Create bucket via SQL**

Run `mcp__supabase__execute_sql`:

```sql
insert into storage.buckets (id, name, public)
values ('imovel-fotos', 'imovel-fotos', true)
on conflict (id) do nothing;

create policy "Public read imovel-fotos"
  on storage.objects for select
  using (bucket_id = 'imovel-fotos');

create policy "Allow upload imovel-fotos"
  on storage.objects for insert
  with check (bucket_id = 'imovel-fotos');

create policy "Allow delete imovel-fotos"
  on storage.objects for delete
  using (bucket_id = 'imovel-fotos');
```

- [ ] **Step 2: Commit**

```bash
git commit --allow-empty -m "feat: create imovel-fotos Storage bucket"
```

---

## Task 4: Add Extended Types

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add join types at end of file**

```typescript
// ─── Extended (join) types ────────────────────────────────
export interface ContratoComDetalhes extends Contrato {
  imovel: { titulo: string } | null
  proprietario: { nome: string } | null
  inquilino: { nome: string } | null
}

export interface PagamentoComDetalhes extends Pagamento {
  contrato: {
    valor_aluguel: number
    imovel: { titulo: string } | null
    inquilino: { nome: string } | null
  } | null
}

export interface RepasseComDetalhes extends Repasse {
  contrato: {
    imovel: { titulo: string } | null
    inquilino: { nome: string } | null
  } | null
}

export interface VistoriaComDetalhes extends Vistoria {
  contrato: {
    imovel: { titulo: string } | null
    inquilino: { nome: string } | null
  } | null
}

export interface ManutencaoComDetalhes extends Manutencao {
  imovel: { titulo: string } | null
}

export interface PropostaComDetalhes extends Proposta {
  imovel: { titulo: string; slug: string } | null
  comprador: { nome: string } | null
  proprietario: { nome: string } | null
}

// ─── New entity types (not in original types) ────────────────

export interface Repasse {
  id: string
  contrato_id: string
  mes_referencia: string
  valor_bruto: number
  taxa_administracao: number
  valor_liquido: number
  data_repasse: string | null
  status: 'pendente' | 'realizado' | 'cancelado'
  created_at: string
}

export interface Manutencao {
  id: string
  imovel_id: string
  titulo: string
  descricao: string | null
  status: 'aberta' | 'em_andamento' | 'concluida' | 'cancelada'
  custo: number | null
  data_abertura: string
  data_conclusao: string | null
  created_at: string
}

export interface Vistoria {
  id: string
  contrato_id: string
  tipo: 'entrada' | 'saida' | 'periodica'
  data: string
  laudo: string | null
  created_at: string
}

export interface Proposta {
  id: string
  imovel_id: string | null
  comprador_id: string | null
  proprietario_id: string | null
  imovel_descricao: string | null
  comprador_nome: string | null
  proprietario_nome: string | null
  valor_pedido: number
  valor_oferta: number
  contraproposta: number | null
  data: string
  validade: string
  status: 'aguardando' | 'contraproposta' | 'aceita' | 'recusada' | 'expirada'
  corretor: string | null
  created_at: string
  updated_at: string
}

export interface VisitaVenda {
  id: string
  lead_id: string | null
  imovel_id: string | null
  data: string
  status: 'agendada' | 'realizada' | 'cancelada'
  corretor: string | null
  notas: string | null
  created_at: string
}

export interface Captacao {
  id: string
  endereco: string
  proprietario: string
  telefone: string
  tipo: string
  valor_estimado: number
  status: 'prospectando' | 'em_avaliacao' | 'autorizado' | 'recusado'
  corretor: string | null
  data: string
  created_at: string
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to the new types.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add extended join types and new entity types"
```

---

## Task 5: Query Layer — Imoveis

**Files:**
- Create: `src/lib/supabase/queries/imoveis.ts`

- [ ] **Step 1: Create file**

```typescript
import { createClient } from '@/lib/supabase/server'
import { ImovelComFotos } from '@/types'

export interface ImovelFilters {
  finalidade?: string
  tipo?: string
  bairro?: string
  precoMin?: number
  precoMax?: number
  quartos?: number
  vagas?: number
  order?: string
  status?: string
}

export async function getImoveis(filters: ImovelFilters = {}): Promise<ImovelComFotos[]> {
  const supabase = await createClient()

  let query = supabase
    .from('imoveis')
    .select('*, imovel_fotos(*)')

  if (filters.status) {
    query = query.eq('status', filters.status)
  } else {
    query = query.eq('status', 'ativo')
  }
  if (filters.finalidade) query = query.eq('finalidade', filters.finalidade)
  if (filters.tipo) query = query.eq('tipo', filters.tipo)
  if (filters.bairro) {
    query = query.or(
      `bairro.ilike.%${filters.bairro}%,cidade.ilike.%${filters.bairro}%`
    )
  }
  if (filters.precoMin) query = query.gte('preco', filters.precoMin)
  if (filters.precoMax) query = query.lte('preco', filters.precoMax)
  if (filters.quartos) query = query.gte('quartos', filters.quartos)
  if (filters.vagas) query = query.gte('vagas', filters.vagas)

  if (filters.order === 'price_desc') {
    query = query.order('preco', { ascending: false })
  } else if (filters.order === 'price_asc') {
    query = query.order('preco', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as ImovelComFotos[]
}

export async function getImoveisAdmin(filters: ImovelFilters = {}): Promise<ImovelComFotos[]> {
  const supabase = await createClient()
  let query = supabase.from('imoveis').select('*, imovel_fotos(*)')

  if (filters.status && filters.status !== 'todos') query = query.eq('status', filters.status)
  if (filters.tipo && filters.tipo !== 'todos') query = query.eq('tipo', filters.tipo)
  if (filters.bairro) {
    query = query.or(
      `titulo.ilike.%${filters.bairro}%,bairro.ilike.%${filters.bairro}%,cidade.ilike.%${filters.bairro}%`
    )
  }

  query = query.order('created_at', { ascending: false })
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as ImovelComFotos[]
}

export async function getImoveisDestaque(): Promise<ImovelComFotos[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('imoveis')
    .select('*, imovel_fotos(*)')
    .eq('destaque', true)
    .eq('status', 'ativo')
    .order('created_at', { ascending: false })
    .limit(6)
  if (error) throw new Error(error.message)
  return (data ?? []) as ImovelComFotos[]
}

export async function getImovelBySlug(slug: string): Promise<ImovelComFotos | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('imoveis')
    .select('*, imovel_fotos(*)')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data as ImovelComFotos
}

export async function getImovelById(id: string): Promise<ImovelComFotos | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('imoveis')
    .select('*, imovel_fotos(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return data as ImovelComFotos
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/queries/imoveis.ts
git commit -m "feat: add imoveis query layer"
```

---

## Task 6: Query Layer — Blog

**Files:**
- Create: `src/lib/supabase/queries/blog.ts`

- [ ] **Step 1: Create file**

```typescript
import { createClient } from '@/lib/supabase/server'
import { BlogPost } from '@/types'

export async function getBlogPosts(status?: string): Promise<BlogPost[]> {
  const supabase = await createClient()
  let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as BlogPost[]
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publicado')
    .single()
  if (error) return null
  return data as BlogPost
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts').select('*').eq('id', id).single()
  if (error) return null
  return data as BlogPost
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase/queries/blog.ts
git commit -m "feat: add blog query layer"
```

---

## Task 7: Query Layer — Leads + Clientes

**Files:**
- Create: `src/lib/supabase/queries/leads.ts`
- Create: `src/lib/supabase/queries/clientes.ts`

- [ ] **Step 1: Create leads.ts**

```typescript
import { createClient } from '@/lib/supabase/server'
import { Lead, LeadInteraction } from '@/types'

// DB uses snake_case, Lead type uses camelCase for some fields
function mapLead(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    nome: row.nome as string,
    email: row.email as string | null,
    telefone: row.telefone as string,
    interesse: row.interesse as Lead['interesse'],
    tipoInteresse: row.tipo_interesse as Lead['tipoInteresse'],
    valorMin: row.valor_min as number | null,
    valorMax: row.valor_max as number | null,
    bairroInteresse: row.bairro_interesse as string | null,
    stage: row.stage as Lead['stage'],
    prioridade: row.prioridade as Lead['prioridade'],
    origem: row.origem as Lead['origem'],
    corretor: row.corretor as string | null,
    notas: row.notas as string | null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}

export async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapLead)
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads').select('*').eq('id', id).single()
  if (error) return null
  return mapLead(data)
}

export async function getLeadInteractions(leadId: string): Promise<LeadInteraction[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lead_interactions')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as LeadInteraction[]
}
```

- [ ] **Step 2: Create clientes.ts**

```typescript
import { createClient } from '@/lib/supabase/server'
import { Cliente } from '@/types'

export async function getClientes(): Promise<Cliente[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clientes').select('*').order('nome')
  if (error) throw new Error(error.message)
  return (data ?? []) as Cliente[]
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clientes').select('*').eq('id', id).single()
  if (error) return null
  return data as Cliente
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/queries/leads.ts src/lib/supabase/queries/clientes.ts
git commit -m "feat: add leads and clientes query layers"
```

---

## Task 8: Query Layer — Locações

**Files:**
- Create: `src/lib/supabase/queries/locacoes.ts`

- [ ] **Step 1: Create file**

```typescript
import { createClient } from '@/lib/supabase/server'
import {
  ContratoComDetalhes, PagamentoComDetalhes,
  RepasseComDetalhes, VistoriaComDetalhes, ManutencaoComDetalhes,
} from '@/types'

export async function getContratos(): Promise<ContratoComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contratos')
    .select(`
      *,
      imovel:imoveis(titulo),
      proprietario:clientes!proprietario_id(nome),
      inquilino:clientes!inquilino_id(nome)
    `)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as ContratoComDetalhes[]
}

export async function getContratoById(id: string): Promise<ContratoComDetalhes | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contratos')
    .select(`
      *,
      imovel:imoveis(titulo),
      proprietario:clientes!proprietario_id(nome),
      inquilino:clientes!inquilino_id(nome)
    `)
    .eq('id', id)
    .single()
  if (error) return null
  return data as ContratoComDetalhes
}

export async function getPagamentos(): Promise<PagamentoComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pagamentos')
    .select(`
      *,
      contrato:contratos(
        valor_aluguel,
        imovel:imoveis(titulo),
        inquilino:clientes!inquilino_id(nome)
      )
    `)
    .order('data_vencimento', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as PagamentoComDetalhes[]
}

export async function getRepasses(): Promise<RepasseComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('repasses')
    .select(`
      *,
      contrato:contratos(
        imovel:imoveis(titulo),
        inquilino:clientes!inquilino_id(nome)
      )
    `)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as RepasseComDetalhes[]
}

export async function getVistorias(): Promise<VistoriaComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vistorias')
    .select(`
      *,
      contrato:contratos(
        imovel:imoveis(titulo),
        inquilino:clientes!inquilino_id(nome)
      )
    `)
    .order('data', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as VistoriaComDetalhes[]
}

export async function getManutencoes(): Promise<ManutencaoComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('manutencoes')
    .select('*, imovel:imoveis(titulo)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as ManutencaoComDetalhes[]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase/queries/locacoes.ts
git commit -m "feat: add locações query layer"
```

---

## Task 9: Query Layer — Vendas + Dashboard

**Files:**
- Create: `src/lib/supabase/queries/vendas.ts`
- Create: `src/lib/supabase/queries/dashboard.ts`

- [ ] **Step 1: Create vendas.ts**

```typescript
import { createClient } from '@/lib/supabase/server'
import { PropostaComDetalhes, VisitaVenda, Captacao } from '@/types'

export async function getPropostas(): Promise<PropostaComDetalhes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('propostas')
    .select(`
      *,
      imovel:imoveis(titulo, slug),
      comprador:clientes!comprador_id(nome),
      proprietario:clientes!proprietario_id(nome)
    `)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as PropostaComDetalhes[]
}

export async function getVisitasVendas(): Promise<VisitaVenda[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('visitas_vendas')
    .select('*')
    .order('data', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as VisitaVenda[]
}

export async function getCaptacoes(): Promise<Captacao[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('captacoes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Captacao[]
}
```

- [ ] **Step 2: Create dashboard.ts**

```typescript
import { createClient } from '@/lib/supabase/server'
import { Atividade } from '@/types'

export interface DashboardStats {
  imoveisAtivos: number
  alugueisAVencer: number
  leadsNoMes: number
  receitaMensal: { mes: string; valor: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  const [imoveisRes, pagamentosRes, leadsRes, receitaRes] = await Promise.all([
    supabase.from('imoveis').select('id', { count: 'exact', head: true }).eq('status', 'ativo'),
    supabase.from('pagamentos').select('id', { count: 'exact', head: true })
      .eq('status', 'pendente'),
    supabase.from('leads').select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from('pagamentos').select('valor,created_at').eq('status', 'pago'),
  ])

  // Build last-6-months revenue
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return { mes: d.toLocaleString('pt-BR', { month: 'short' }), month: d.getMonth(), year: d.getFullYear(), valor: 0 }
  })

  for (const p of receitaRes.data ?? []) {
    const d = new Date(p.created_at)
    const bucket = months.find(m => m.month === d.getMonth() && m.year === d.getFullYear())
    if (bucket) bucket.valor += p.valor
  }

  return {
    imoveisAtivos: imoveisRes.count ?? 0,
    alugueisAVencer: pagamentosRes.count ?? 0,
    leadsNoMes: leadsRes.count ?? 0,
    receitaMensal: months.map(({ mes, valor }) => ({ mes, valor })),
  }
}

export async function getAtividades(): Promise<Atividade[]> {
  const supabase = await createClient()

  const [leadsRes, contratosRes, pagamentosRes, imoveisRes] = await Promise.all([
    supabase.from('leads').select('id,nome,created_at').order('created_at', { ascending: false }).limit(3),
    supabase.from('contratos').select('id,status,created_at').order('created_at', { ascending: false }).limit(2),
    supabase.from('pagamentos').select('id,valor,status,created_at').eq('status', 'pago').order('data_pagamento', { ascending: false }).limit(2),
    supabase.from('imoveis').select('id,titulo,created_at').order('created_at', { ascending: false }).limit(2),
  ])

  const atividades: Atividade[] = [
    ...(leadsRes.data ?? []).map(l => ({
      id: l.id, tipo: 'lead' as const,
      descricao: `Novo lead: ${l.nome}`,
      created_at: l.created_at,
    })),
    ...(contratosRes.data ?? []).map(c => ({
      id: c.id, tipo: 'contrato' as const,
      descricao: `Contrato ${c.status}`,
      created_at: c.created_at,
    })),
    ...(pagamentosRes.data ?? []).map(p => ({
      id: p.id, tipo: 'pagamento' as const,
      descricao: `Aluguel recebido — R$ ${p.valor.toLocaleString('pt-BR')}`,
      created_at: p.created_at,
    })),
    ...(imoveisRes.data ?? []).map(i => ({
      id: i.id, tipo: 'imovel' as const,
      descricao: `Novo imóvel: ${i.titulo}`,
      created_at: i.created_at,
    })),
  ]

  return atividades.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 6)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/queries/vendas.ts src/lib/supabase/queries/dashboard.ts
git commit -m "feat: add vendas and dashboard query layers"
```

---

## Task 10: Server Actions — Imoveis

**Files:**
- Create: `src/app/(admin)/admin/imoveis/actions.ts`

- [ ] **Step 1: Create file**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createImovel(formData: FormData) {
  const supabase = await createClient()

  const slug = (formData.get('titulo') as string)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .concat('-' + Date.now())

  const { data, error } = await supabase.from('imoveis').insert({
    slug,
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || null,
    tipo: formData.get('tipo'),
    finalidade: formData.get('finalidade'),
    preco: formData.get('preco') ? Number(formData.get('preco')) : null,
    area_m2: formData.get('area_m2') ? Number(formData.get('area_m2')) : null,
    quartos: Number(formData.get('quartos') ?? 0),
    banheiros: Number(formData.get('banheiros') ?? 0),
    vagas: Number(formData.get('vagas') ?? 0),
    endereco: formData.get('endereco') || null,
    bairro: formData.get('bairro') || null,
    cidade: formData.get('cidade') || null,
    uf: formData.get('uf') || null,
    cep: formData.get('cep') || null,
    destaque: formData.get('destaque') === 'true',
    status: formData.get('status') ?? 'ativo',
    updated_at: new Date().toISOString(),
  }).select().single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin/imoveis')
  revalidatePath('/imoveis')
  redirect(`/admin/imoveis/${data.id}`)
}

export async function updateImovel(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('imoveis').update({
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || null,
    tipo: formData.get('tipo'),
    finalidade: formData.get('finalidade'),
    preco: formData.get('preco') ? Number(formData.get('preco')) : null,
    area_m2: formData.get('area_m2') ? Number(formData.get('area_m2')) : null,
    quartos: Number(formData.get('quartos') ?? 0),
    banheiros: Number(formData.get('banheiros') ?? 0),
    vagas: Number(formData.get('vagas') ?? 0),
    endereco: formData.get('endereco') || null,
    bairro: formData.get('bairro') || null,
    cidade: formData.get('cidade') || null,
    uf: formData.get('uf') || null,
    cep: formData.get('cep') || null,
    destaque: formData.get('destaque') === 'true',
    status: formData.get('status'),
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/imoveis')
  revalidatePath(`/admin/imoveis/${id}`)
  revalidatePath('/imoveis')
}

export async function deleteImovel(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('imoveis').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/imoveis')
  revalidatePath('/imoveis')
  redirect('/admin/imoveis')
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(admin\)/admin/imoveis/actions.ts
git commit -m "feat: add imoveis server actions"
```

---

## Task 11: Server Actions — CRM (Leads)

**Files:**
- Create: `src/app/(admin)/admin/crm/actions.ts`

- [ ] **Step 1: Create file**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Lead, LeadStage, LeadInteraction } from '@/types'

export async function moveLeadToStage(leadId: string, stage: LeadStage) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('leads')
    .update({ stage, updated_at: new Date().toISOString() })
    .eq('id', leadId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/crm')
  revalidatePath('/admin/leads')
}

export async function createLead(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').insert({
    nome: formData.get('nome'),
    email: formData.get('email') || null,
    telefone: formData.get('telefone'),
    interesse: formData.get('interesse'),
    tipo_interesse: formData.get('tipo_interesse') || null,
    valor_min: formData.get('valor_min') ? Number(formData.get('valor_min')) : null,
    valor_max: formData.get('valor_max') ? Number(formData.get('valor_max')) : null,
    bairro_interesse: formData.get('bairro_interesse') || null,
    stage: 'lead',
    prioridade: formData.get('prioridade') ?? 'media',
    origem: formData.get('origem') ?? 'site',
    corretor: formData.get('corretor') || null,
    notas: formData.get('notas') || null,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/crm')
  revalidatePath('/admin/leads')
}

export async function updateLead(leadId: string, data: Partial<Lead>) {
  const supabase = await createClient()
  // Map camelCase back to snake_case for DB
  const dbData: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.nome !== undefined) dbData.nome = data.nome
  if (data.email !== undefined) dbData.email = data.email
  if (data.telefone !== undefined) dbData.telefone = data.telefone
  if (data.tipoInteresse !== undefined) dbData.tipo_interesse = data.tipoInteresse
  if (data.valorMin !== undefined) dbData.valor_min = data.valorMin
  if (data.valorMax !== undefined) dbData.valor_max = data.valorMax
  if (data.bairroInteresse !== undefined) dbData.bairro_interesse = data.bairroInteresse
  if (data.prioridade !== undefined) dbData.prioridade = data.prioridade
  if (data.corretor !== undefined) dbData.corretor = data.corretor
  if (data.notas !== undefined) dbData.notas = data.notas

  const { error } = await supabase.from('leads').update(dbData).eq('id', leadId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/crm')
}

export async function addInteraction(leadId: string, tipo: LeadInteraction['tipo'], descricao: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('lead_interactions').insert({
    lead_id: leadId, tipo, descricao,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/crm')
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(admin\)/admin/crm/actions.ts
git commit -m "feat: add CRM server actions"
```

---

## Task 12: Server Actions — Clientes + Blog + Locações + Vendas

**Files:**
- Create: `src/app/(admin)/admin/clientes/actions.ts`
- Create: `src/app/(admin)/admin/blog/actions.ts`
- Create: `src/app/(admin)/admin/locacoes/actions.ts`
- Create: `src/app/(admin)/admin/vendas/actions.ts`

- [ ] **Step 1: Create clientes/actions.ts**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCliente(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('clientes').insert({
    nome: formData.get('nome'),
    tipo_pessoa: formData.get('tipo_pessoa'),
    cpf_cnpj: formData.get('cpf_cnpj') || null,
    email: formData.get('email') || null,
    telefone: formData.get('telefone'),
    endereco: formData.get('endereco') || null,
    papeis: (formData.getAll('papeis') as string[]),
    notas: formData.get('notas') || null,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/clientes')
}

export async function updateCliente(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('clientes').update({
    nome: formData.get('nome'),
    tipo_pessoa: formData.get('tipo_pessoa'),
    cpf_cnpj: formData.get('cpf_cnpj') || null,
    email: formData.get('email') || null,
    telefone: formData.get('telefone'),
    endereco: formData.get('endereco') || null,
    papeis: (formData.getAll('papeis') as string[]),
    notas: formData.get('notas') || null,
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/clientes')
}
```

- [ ] **Step 2: Create blog/actions.ts**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient()
  const titulo = formData.get('titulo') as string
  const slug = titulo
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .concat('-' + Date.now())

  const status = formData.get('status') as string
  const { data, error } = await supabase.from('blog_posts').insert({
    titulo,
    slug,
    resumo: formData.get('resumo') || null,
    conteudo: formData.get('conteudo') ?? '',
    cover_url: formData.get('cover_url') || null,
    status,
    autor: formData.get('autor') ?? 'Admin',
    tags: (formData.get('tags') as string ?? '').split(',').map(t => t.trim()).filter(Boolean),
    published_at: status === 'publicado' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).select().single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect(`/admin/blog/${data.id}`)
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = await createClient()
  const status = formData.get('status') as string
  const { error } = await supabase.from('blog_posts').update({
    titulo: formData.get('titulo'),
    resumo: formData.get('resumo') || null,
    conteudo: formData.get('conteudo'),
    cover_url: formData.get('cover_url') || null,
    status,
    autor: formData.get('autor'),
    tags: (formData.get('tags') as string ?? '').split(',').map(t => t.trim()).filter(Boolean),
    published_at: status === 'publicado' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect('/admin/blog')
}
```

- [ ] **Step 3: Create locacoes/actions.ts**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePagamentoStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('pagamentos').update({
    status,
    data_pagamento: status === 'pago' ? new Date().toISOString().split('T')[0] : null,
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/locacoes/alugueis')
}

export async function createContrato(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('contratos').insert({
    imovel_id: formData.get('imovel_id'),
    proprietario_id: formData.get('proprietario_id'),
    inquilino_id: formData.get('inquilino_id'),
    valor_aluguel: Number(formData.get('valor_aluguel')),
    data_inicio: formData.get('data_inicio'),
    data_fim: formData.get('data_fim'),
    dia_vencimento: Number(formData.get('dia_vencimento')),
    taxa_administracao: Number(formData.get('taxa_administracao') ?? 10),
    status: 'ativo',
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/locacoes/contratos')
}

export async function updateContratoStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('contratos')
    .update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/locacoes/contratos')
}

export async function createManutencao(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('manutencoes').insert({
    imovel_id: formData.get('imovel_id'),
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || null,
    status: 'aberta',
    custo: formData.get('custo') ? Number(formData.get('custo')) : null,
    data_abertura: new Date().toISOString().split('T')[0],
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/locacoes/manutencoes')
}
```

- [ ] **Step 4: Create vendas/actions.ts**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePropostaStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('propostas')
    .update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vendas/propostas')
}

export async function createCaptacao(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('captacoes').insert({
    endereco: formData.get('endereco'),
    proprietario: formData.get('proprietario'),
    telefone: formData.get('telefone'),
    tipo: formData.get('tipo'),
    valor_estimado: Number(formData.get('valor_estimado')),
    status: 'prospectando',
    corretor: formData.get('corretor') || null,
    data: new Date().toISOString().split('T')[0],
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vendas/captacao')
}

export async function updateCaptacaoStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('captacoes').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/vendas/captacao')
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\(admin\)/admin/clientes/actions.ts src/app/\(admin\)/admin/blog/actions.ts src/app/\(admin\)/admin/locacoes/actions.ts src/app/\(admin\)/admin/vendas/actions.ts
git commit -m "feat: add server actions for clientes, blog, locações, vendas"
```

---

## Task 13: Migrate Site Pages

**Files:**
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/app/(site)/imoveis/page.tsx`
- Modify: `src/app/(site)/imoveis/[slug]/page.tsx`
- Modify: `src/app/(site)/blog/page.tsx`
- Modify: `src/app/(site)/blog/[slug]/page.tsx`

- [ ] **Step 1: Migrate homepage**

Replace the entire `src/app/(site)/page.tsx`. Remove `'use client'`, `useState`, `useEffect`. Add `import { getImoveisDestaque } from '@/lib/supabase/queries/imoveis'`. Change the component to `async`:

```typescript
// src/app/(site)/page.tsx
import { IndicesEconomicos } from '@/components/site/IndicesEconomicos'
import { ServicosCards } from '@/components/site/ServicosCards'
import { ImovelCard } from '@/components/site/ImovelCard'
import { FiltrosBusca } from '@/components/site/FiltrosBusca'
import { CorretorVirtual } from '@/components/site/CorretorVirtual'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Building, Home as HomeIcon, Key, TrendingUp, Users, Building2, Award, Calendar } from 'lucide-react'
import { Counter } from '@/components/site/Counter'
import { getImoveisDestaque } from '@/lib/supabase/queries/imoveis'

export const revalidate = 60

export default async function HomePage() {
  const destaques = await getImoveisDestaque()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section — keep identical to original */}
      <section className="relative w-full min-h-screen lg:h-screen lg:min-h-[850px] flex flex-col bg-zinc-950 overflow-visible lg:overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-110 animate-slow-zoom"
          style={{ backgroundImage: "url('/background.png')", opacity: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

        <div className="container relative z-10 flex-1 flex flex-col justify-center pt-32 lg:pt-44">
          <div className="max-w-4xl space-y-16 animate-in fade-in slide-in-from-left-6 duration-1000">
            <div className="space-y-6 text-left">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.2] sm:leading-[1.1] drop-shadow-2xl">
                Encontre o lugar <br />
                <span className="text-white">certo </span>
                <span className="text-accent italic font-serif">para você.</span>
              </h1>
              <p className="font-sans text-base sm:text-lg md:text-xl text-zinc-300 max-w-xl font-light tracking-wide leading-relaxed">
                Casas, apartamentos e imóveis comerciais para comprar ou alugar. Simples assim.
              </p>
            </div>
            <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 relative z-20 pb-12 lg:pb-20">
              <div className="bg-white/5 backdrop-blur-3xl p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-white/10 shadow-3xl relative group">
                <FiltrosBusca />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-zinc-950 lg:bg-white/5 backdrop-blur-2xl border-t border-white/5 py-16 lg:py-14 relative z-10 mt-auto">
          <div className="container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Calendar, end: 25, suffix: '+', label: 'Anos de Mercado' },
                { icon: Building2, end: 1500, suffix: '+', label: 'Imóveis Sob Gestão' },
                { icon: Users, end: 10, suffix: 'k+', label: 'Clientes Felizes' },
                { icon: Award, label: 'ISO 9001', subLabel: 'Excelência Certificada' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left group transition-all duration-300">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-500 rotate-3 group-hover:rotate-0 border border-white/5">
                    <stat.icon className="h-6 w-6 text-accent group-hover:text-inherit" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-2xl font-bold text-white tracking-tight">
                      {'end' in stat ? (
                        <Counter end={stat.end as number} suffix={stat.suffix as string} />
                      ) : stat.label}
                    </p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-[0.15em] font-black">
                      {'end' in stat ? stat.label : (stat as { subLabel: string }).subLabel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CorretorVirtual />

      <section className="py-24 bg-background relative z-20">
        <div className="container"><ServicosCards /></div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-serif font-bold tracking-tight">O que você está buscando?</h2>
            <p className="text-muted-foreground text-lg">Escolha como quer buscar e veja os imóveis disponíveis.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { href: '/imoveis?finalidade=venda', Icon: Key, label: 'Comprar', sub: 'Imóveis prontos e na planta' },
              { href: '/imoveis?finalidade=locação', Icon: HomeIcon, label: 'Alugar', sub: 'Residencial e Comercial' },
              { href: '/imoveis?tipo=comercial', Icon: Building, label: 'Comercial', sub: 'Salas, lojas e galpões' },
              { href: '/imoveis?order=price_desc', Icon: TrendingUp, label: 'Alto Padrão', sub: 'Maiores e mais completos' },
            ].map(({ href, Icon, label, sub }) => (
              <Link key={label} href={href} className="group">
                <div className="relative flex flex-col items-center bg-background p-8 rounded-2xl border border-zinc-100 dark:border-white/5 shadow-sm text-center space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition-all duration-300 ease-out overflow-hidden">
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <Icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-xl">{label}</h3>
                  <p className="text-sm text-muted-foreground">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/10">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif font-bold tracking-tight">Imóveis em Destaque</h2>
              <p className="text-muted-foreground text-lg">Veja os imóveis mais procurados agora.</p>
            </div>
            <Button variant="outline" className="hidden sm:flex rounded-full border-primary text-primary hover:bg-primary hover:text-white" asChild>
              <Link href="/imoveis">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          {destaques.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destaques.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
              <p className="text-muted-foreground">Nenhum imóvel em destaque no momento.</p>
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/imoveis">Ver todos os imóveis</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Migrate imoveis listing page**

In `src/app/(site)/imoveis/page.tsx`, replace `import { mockImoveis } from '@/lib/mock'` and `let imoveisFiltrados = mockImoveis.filter(...)` with:

```typescript
import { getImoveis } from '@/lib/supabase/queries/imoveis'

// Inside the async component, replace the mock filtering block:
const imoveisFiltrados = await getImoveis({
  finalidade: finalidade || undefined,
  tipo: tipo || undefined,
  bairro: bairro || undefined,
  precoMin,
  precoMax,
  quartos,
  vagas,
  order: order || undefined,
})
```

Remove all the manual filter/sort logic that followed (it was done in JS, now done in SQL).

- [ ] **Step 3: Migrate imovel detail page**

In `src/app/(site)/imoveis/[slug]/page.tsx`, replace the `getImovel` function:

```typescript
import { getImovelBySlug } from '@/lib/supabase/queries/imoveis'
// Remove: import { mockImoveis } from '@/lib/mock'

// Replace getImovel function with:
const imovel = await getImovelBySlug(resolvedParams.slug)
```

- [ ] **Step 4: Migrate blog pages**

In `src/app/(site)/blog/page.tsx` (read the file first, then replace mock import):
```typescript
import { getBlogPosts } from '@/lib/supabase/queries/blog'
// Replace mock usage with:
const posts = await getBlogPosts('publicado')
```

In `src/app/(site)/blog/[slug]/page.tsx`:
```typescript
import { getBlogPostBySlug } from '@/lib/supabase/queries/blog'
// Replace mock usage with:
const post = await getBlogPostBySlug(params.slug)
```

- [ ] **Step 5: Run dev and verify site pages**

```bash
npm run dev
```

Open http://localhost:3000, http://localhost:3000/imoveis, and check that imoveis from Supabase appear.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(site\)/
git commit -m "feat: migrate site pages to Supabase data"
```

---

## Task 14: Migrate Admin Imoveis Pages

**Files:**
- Modify: `src/app/(admin)/admin/imoveis/page.tsx`
- Modify: `src/app/(admin)/admin/imoveis/[id]/page.tsx`
- Modify: `src/app/(admin)/admin/imoveis/novo/page.tsx`

- [ ] **Step 1: Read the [id] and novo pages first**

Read `src/app/(admin)/admin/imoveis/[id]/page.tsx` and `src/app/(admin)/admin/imoveis/novo/page.tsx` to understand current structure before modifying.

- [ ] **Step 2: Migrate list page**

`src/app/(admin)/admin/imoveis/page.tsx` is currently `'use client'` with `useState` filters. Convert to server component with URL-based filters. Replace the top of the file:

```typescript
// Remove 'use client' directive and useState
import { getImoveisAdmin } from '@/lib/supabase/queries/imoveis'
import { ImovelComFotos, StatusImovel, TipoImovel } from '@/types'
// Keep all icon imports and statusConfig/formatPrice helpers

export default async function ImoveisAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tipo?: string; q?: string; view?: string }>
}) {
  const params = await searchParams
  const filtered = await getImoveisAdmin({
    status: params.status,
    tipo: params.tipo,
    bairro: params.q,
  })
  // Pass filtered to a client component for search/filter UI
  return <ImoveisAdminClient imoveis={filtered} />
}
```

Create `src/app/(admin)/admin/imoveis/_components/ImoveisAdminClient.tsx` as `'use client'` that receives `imoveis: ImovelComFotos[]` and manages the search/filter UI locally with `useState` (client-side filter on already-fetched data, since record count is small for portfolio).

- [ ] **Step 3: Wire delete action in the list**

In `ImoveisAdminClient.tsx`, import `deleteImovel` from `../actions` and call it on the trash button:

```typescript
import { deleteImovel } from '../actions'
// On trash button:
<button onClick={() => deleteImovel(imovel.id)}>
```

- [ ] **Step 4: Migrate [id] edit page**

Replace mock data in the edit page with `getImovelById(id)`. Wire form submit to `updateImovel(id, formData)`.

- [ ] **Step 5: Migrate novo page**

Wire form submit to `createImovel(formData)` from actions. Read the current page to understand the `ImovelForm` component usage.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(admin\)/admin/imoveis/
git commit -m "feat: migrate admin imoveis pages to Supabase"
```

---

## Task 15: Migrate Admin CRM + Simplify Store

**Files:**
- Modify: `src/app/(admin)/admin/crm/page.tsx`
- Modify: `src/store/admin-store.ts`
- Modify: `src/components/admin/crm/KanbanBoard.tsx`

- [ ] **Step 1: Read CRM page and KanbanBoard**

Read `src/app/(admin)/admin/crm/page.tsx` and `src/components/admin/crm/KanbanBoard.tsx` to understand current structure.

- [ ] **Step 2: Simplify admin-store.ts**

Replace the entire `src/store/admin-store.ts` with UI-only state:

```typescript
import { create } from 'zustand'

interface AdminState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  selectedLeadId: string | null
  detailPanelOpen: boolean
  selectLead: (id: string | null) => void
  closeDetailPanel: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  sidebarOpen: true,
  selectedLeadId: null,
  detailPanelOpen: false,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  selectLead: (id) => set({ selectedLeadId: id, detailPanelOpen: id !== null }),
  closeDetailPanel: () => set({ detailPanelOpen: false, selectedLeadId: null }),
}))
```

- [ ] **Step 3: Migrate CRM page to server component**

Convert the CRM page to a server component that fetches leads:

```typescript
import { getLeads, getLeadInteractions } from '@/lib/supabase/queries/leads'
import { KanbanBoard } from '@/components/admin/crm/KanbanBoard'

export default async function CRMPage() {
  const leads = await getLeads()
  return <KanbanBoard initialLeads={leads} />
}
```

- [ ] **Step 4: Update KanbanBoard to accept initialLeads prop**

`KanbanBoard` should be `'use client'`. Change it to accept `initialLeads: Lead[]` instead of reading from the store. Use `moveLeadToStage` server action on drag:

```typescript
'use client'
import { moveLeadToStage } from '@/app/(admin)/admin/crm/actions'
import { useTransition } from 'react'

export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [isPending, startTransition] = useTransition()

  const handleMove = (leadId: string, stage: LeadStage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l)) // optimistic
    startTransition(() => moveLeadToStage(leadId, stage))
  }
  // rest of Kanban UI unchanged, use handleMove on drag
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\(admin\)/admin/crm/ src/store/admin-store.ts src/components/admin/crm/
git commit -m "feat: migrate CRM to Supabase, simplify admin-store"
```

---

## Task 16: Migrate Admin Clientes + Blog

**Files:**
- Modify: `src/app/(admin)/admin/clientes/page.tsx`
- Modify: `src/app/(admin)/admin/blog/page.tsx`
- Modify: `src/app/(admin)/admin/blog/novo/page.tsx`
- Modify: `src/app/(admin)/admin/blog/[id]/page.tsx`

- [ ] **Step 1: Migrate clientes page**

`src/app/(admin)/admin/clientes/page.tsx` is `'use client'` with inline `mockClientes`. Convert to server+client split:

```typescript
// page.tsx (server)
import { getClientes } from '@/lib/supabase/queries/clientes'
import { ClientesClient } from './_components/ClientesClient'

export default async function ClientesPage() {
  const clientes = await getClientes()
  return <ClientesClient clientes={clientes} />
}
```

Create `src/app/(admin)/admin/clientes/_components/ClientesClient.tsx` as `'use client'` — move all the existing UI code from `clientes/page.tsx` into it, replacing `mockClientes` with the `clientes` prop. Wire the "Salvar Cliente" button to call `createCliente(formData)` from actions.

- [ ] **Step 2: Migrate blog list page**

Read `src/app/(admin)/admin/blog/page.tsx`, then:
- Convert to server component
- Replace mock with `await getBlogPosts()`
- Pass data to a client list component for UI interactions

- [ ] **Step 3: Migrate blog novo/edit pages**

In `novo/page.tsx`, wire form submit to `createBlogPost(formData)`.
In `[id]/page.tsx`, fetch post with `getBlogPostById(id)` and wire form to `updateBlogPost(id, formData)`.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(admin\)/admin/clientes/ src/app/\(admin\)/admin/blog/
git commit -m "feat: migrate admin clientes and blog pages to Supabase"
```

---

## Task 17: Migrate Admin Locações Pages

**Files:**
- Modify: `src/app/(admin)/admin/locacoes/contratos/page.tsx`
- Modify: `src/app/(admin)/admin/locacoes/alugueis/page.tsx`
- Modify: `src/app/(admin)/admin/locacoes/repasses/page.tsx`
- Modify: `src/app/(admin)/admin/locacoes/manutencoes/page.tsx`
- Modify: `src/app/(admin)/admin/locacoes/vistorias/page.tsx`

For each page, apply the same pattern: server component fetches data, client component handles UI. The query functions and the inline `interface` + `mock*` arrays at the top of each file get replaced.

- [ ] **Step 1: Migrate contratos page**

Replace the inline `mockContratos` and `ContratoMock` interface. The page becomes a server component:

```typescript
import { getContratos } from '@/lib/supabase/queries/locacoes'
import { ContratosClient } from './_components/ContratosClient'

export default async function ContratosPage() {
  const contratos = await getContratos()
  return <ContratosClient contratos={contratos} />
}
```

Create `ContratosClient.tsx` as `'use client'` with all existing UI. Access joined data as `contrato.imovel?.titulo`, `contrato.proprietario?.nome`, `contrato.inquilino?.nome`. Wire status update button to `updateContratoStatus(id, status)` from `../../actions`.

- [ ] **Step 2: Migrate alugueis page**

Replace `mockAlugueis` with `await getPagamentos()`. Access joined data as `pagamento.contrato?.imovel?.titulo` and `pagamento.contrato?.inquilino?.nome`. Wire status update to `updatePagamentoStatus(id, status)`.

- [ ] **Step 3: Migrate repasses page**

Read `src/app/(admin)/admin/locacoes/repasses/page.tsx` then replace its inline mock with `await getRepasses()`. Display `repasse.contrato?.imovel?.titulo`.

- [ ] **Step 4: Migrate manutencoes page**

Read `src/app/(admin)/admin/locacoes/manutencoes/page.tsx` then replace inline mock with `await getManutencoes()`. Wire "Nova Manutenção" button to `createManutencao(formData)`.

- [ ] **Step 5: Migrate vistorias page**

Read `src/app/(admin)/admin/locacoes/vistorias/page.tsx` then replace inline mock with `await getVistorias()`.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(admin\)/admin/locacoes/
git commit -m "feat: migrate all locações pages to Supabase"
```

---

## Task 18: Migrate Admin Vendas Pages

**Files:**
- Modify: `src/app/(admin)/admin/vendas/captacao/page.tsx`
- Modify: `src/app/(admin)/admin/vendas/propostas/page.tsx`
- Modify: `src/app/(admin)/admin/vendas/visitas/page.tsx`
- Modify: `src/app/(admin)/admin/vendas/page.tsx`
- Modify: `src/app/(admin)/admin/vendas/relatorios/page.tsx`

- [ ] **Step 1: Migrate captacao page**

Replace `mockCaptacoes` + inline `CaptacaoMock` with `await getCaptacoes()`. Same server+client pattern. Wire "Nova Captação" to `createCaptacao(formData)`. Wire status badge buttons to `updateCaptacaoStatus(id, status)`.

- [ ] **Step 2: Migrate propostas page**

Replace `mockPropostas` + inline `PropostaMock` with `await getPropostas()`. Access joined data via `proposta.imovel?.titulo`, `proposta.comprador?.nome`, `proposta.proprietario?.nome`. Wire status filter tabs and status update to `updatePropostaStatus(id, status)`.

- [ ] **Step 3: Migrate visitas page**

Read `src/app/(admin)/admin/vendas/visitas/page.tsx`, then replace inline mock with `await getVisitasVendas()`.

- [ ] **Step 4: Migrate vendas overview + relatorios pages**

Read both files. Replace any inline mock data with query calls. Relatorios page should aggregate from propostas (count by status, total valores) using data from `getPropostas()` and `getCaptacoes()`.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(admin\)/admin/vendas/
git commit -m "feat: migrate all vendas pages to Supabase"
```

---

## Task 19: Migrate Dashboard + Admin Leads Page

**Files:**
- Modify: `src/app/(admin)/admin/page.tsx`
- Modify: `src/app/(admin)/admin/leads/page.tsx`

- [ ] **Step 1: Migrate dashboard**

In `src/app/(admin)/admin/page.tsx`, replace all mock imports:

```typescript
import { getDashboardStats, getAtividades } from '@/lib/supabase/queries/dashboard'
import { getLeads } from '@/lib/supabase/queries/leads'
// Remove: import { mockAtividades, mockReceitaMensal, mockLeads } from '@/lib/mock-admin'

export default async function AdminDashboard() {
  const [stats, atividades, leads] = await Promise.all([
    getDashboardStats(),
    getAtividades(),
    getLeads(),
  ])
  // Pass as props to the client components, or render inline
```

Update `KPICard` values to use real stats:
```typescript
<KPICard icon={Building2} label="Imóveis Ativos" value={String(stats.imoveisAtivos)} change={12} />
<KPICard icon={HandCoins} label="Aluguéis a Vencer" value={String(stats.alugueisAVencer)} change={-5} />
<KPICard icon={Users} label="Leads Novos (mês)" value={String(stats.leadsNoMes)} change={22} />
```

Replace `mockReceitaMensal` with `stats.receitaMensal`. Replace `mockAtividades` with `atividades`. Replace `mockLeads` with `leads`.

- [ ] **Step 2: Migrate leads page**

Read `src/app/(admin)/admin/leads/page.tsx`, then replace its mock import with `await getLeads()`.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(admin\)/admin/page.tsx src/app/\(admin\)/admin/leads/
git commit -m "feat: migrate dashboard and leads page to Supabase"
```

---

## Task 20: Connect UploadFotos to Storage

**Files:**
- Modify: `src/components/admin/UploadFotos.tsx`

- [ ] **Step 1: Read current UploadFotos.tsx**

Read the file to understand its current interface and state.

- [ ] **Step 2: Replace with Supabase Storage upload**

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface UploadFotosProps {
  imovelId: string
  onUpload?: (url: string) => void
}

export function UploadFotos({ imovelId, onUpload }: UploadFotosProps) {
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setUploading(true)
    const supabase = createClient()

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${imovelId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('imovel-fotos')
        .upload(path, file, { upsert: true })

      if (uploadError) { console.error(uploadError); continue }

      const { data: { publicUrl } } = supabase.storage
        .from('imovel-fotos')
        .getPublicUrl(path)

      // Save URL to imovel_fotos table
      await supabase.from('imovel_fotos').insert({
        imovel_id: imovelId,
        url: publicUrl,
        ordem: previews.length,
      })

      setPreviews(prev => [...prev, publicUrl])
      onUpload?.(publicUrl)
    }

    setUploading(false)
  }, [imovelId, previews.length, onUpload])

  return (
    <div className="space-y-4">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-accent/40 transition-colors bg-zinc-800/30">
        {uploading ? (
          <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
        ) : (
          <>
            <Upload className="h-8 w-8 text-zinc-500 mb-2" />
            <span className="text-sm text-zinc-500">Clique para fazer upload de fotos</span>
          </>
        )}
        <input type="file" className="hidden" multiple accept="image/*" onChange={handleUpload} disabled={uploading} />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previews.map((url, i) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
              <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/UploadFotos.tsx
git commit -m "feat: connect UploadFotos to Supabase Storage"
```

---

## Task 21: Cleanup — Remove Mocks + Final Verification

**Files:**
- Delete: `src/lib/mock.ts`
- Delete: `src/lib/mock-admin.ts`
- Create: `.env.example`

- [ ] **Step 1: Verify no remaining mock imports**

```bash
grep -r "from '@/lib/mock" src/
```

Expected: no results.

- [ ] **Step 2: Delete mock files**

```bash
rm src/lib/mock.ts src/lib/mock-admin.ts
```

- [ ] **Step 3: Create .env.example**

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 4: TypeScript + build check**

```bash
npx tsc --noEmit
npm run build
```

Expected: build succeeds with no TypeScript errors.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Supabase integration — remove mocks, all data from DB"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ 14 tables created (Tasks 1-2)
- ✅ Seed data from all mocks (Task 2)
- ✅ Storage bucket (Task 3)
- ✅ Query layer for all 7 domains (Tasks 5-9)
- ✅ Server Actions for all modules (Tasks 10-12)
- ✅ Site pages migrated (Task 13)
- ✅ All admin pages migrated (Tasks 14-19)
- ✅ Dashboard with real data (Task 19)
- ✅ UploadFotos connected (Task 20)
- ✅ Mocks deleted, .env.example recreated (Task 21)
- ✅ No authentication (middleware untouched)
- ✅ admin-store simplified to UI state only (Task 15)

**Type consistency:** `mapLead()` in Task 7 maps DB snake_case → TypeScript camelCase for `tipoInteresse`, `valorMin`, `valorMax`, `bairroInteresse`. `updateLead()` in Task 11 reverses this mapping. Consistent throughout.

**Lead camelCase fields** — only `tipoInteresse`, `valorMin`, `valorMax`, `bairroInteresse` differ from DB. All other types match DB column names directly.
