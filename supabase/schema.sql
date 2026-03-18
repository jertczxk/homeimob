-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Tables
create table public.imoveis (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  titulo text not null,
  descricao text,
  tipo text not null check (tipo in ('residencial', 'comercial')),
  finalidade text not null check (finalidade in ('venda', 'locação')),
  preco numeric,
  area_m2 numeric,
  quartos integer default 0,
  banheiros integer default 0,
  vagas integer default 0,
  endereco text,
  bairro text,
  cidade text,
  uf varchar(2),
  cep text,
  latitude numeric,
  longitude numeric,
  destaque boolean default false,
  status text not null check (status in ('ativo', 'inativo', 'vendido', 'locado')) default 'ativo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.imovel_fotos (
  id uuid default uuid_generate_v4() primary key,
  imovel_id uuid references public.imoveis(id) on delete cascade not null,
  url text not null,
  ordem integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  email text,
  telefone text not null,
  mensagem text,
  imovel_id uuid references public.imoveis(id) on delete set null,
  origem text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  titulo text not null,
  resumo text,
  conteudo_mdx text not null,
  capa_url text,
  publicado boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.configuracoes (
  id uuid default uuid_generate_v4() primary key,
  chave text not null unique,
  valor text
);

-- 2. Row Level Security

alter table public.imoveis enable row level security;
alter table public.imovel_fotos enable row level security;
alter table public.leads enable row level security;
alter table public.posts enable row level security;
alter table public.configuracoes enable row level security;

-- Policies for public reading
create policy "Imóveis são visíveis para todos" on public.imoveis for select using (true);
create policy "Fotos de imóveis são visíveis para todos" on public.imovel_fotos for select using (true);
create policy "Posts são visíveis para todos" on public.posts for select using (true);
create policy "Configurações são visíveis para todos" on public.configuracoes for select using (true);

-- Policies for leads (Public can insert, only authenticated can read/update)
create policy "Qualquer um pode inserir leads" on public.leads for insert with check (true);
create policy "Apenas usuários autenticados podem ver leads" on public.leads for select using (auth.role() = 'authenticated');
create policy "Apenas usuários autenticados podem gerenciar leads" on public.leads for all using (auth.role() = 'authenticated');

-- Policies for admin (authenticated roles)
create policy "Admins podem inserir imóveis" on public.imoveis for insert with check (auth.role() = 'authenticated');
create policy "Admins podem atualizar imóveis" on public.imoveis for update using (auth.role() = 'authenticated');
create policy "Admins podem deletar imóveis" on public.imoveis for delete using (auth.role() = 'authenticated');

create policy "Admins podem inserir fotos" on public.imovel_fotos for insert with check (auth.role() = 'authenticated');
create policy "Admins podem atualizar fotos" on public.imovel_fotos for update using (auth.role() = 'authenticated');
create policy "Admins podem deletar fotos" on public.imovel_fotos for delete using (auth.role() = 'authenticated');

create policy "Admins podem gerenciar posts" on public.posts for all using (auth.role() = 'authenticated');
create policy "Admins podem gerenciar configuracoes" on public.configuracoes for all using (auth.role() = 'authenticated');

-- 3. Storage Bucket setup
insert into storage.buckets (id, name, public) values ('imoveis-media', 'imoveis-media', true);

create policy "Mídia pública" on storage.objects for select using ( bucket_id = 'imoveis-media' );
create policy "Admins podem gerenciar mídia" on storage.objects for insert with check ( bucket_id = 'imoveis-media' and auth.role() = 'authenticated' );
create policy "Admins podem atualizar mídia" on storage.objects for update using ( bucket_id = 'imoveis-media' and auth.role() = 'authenticated' );
create policy "Admins podem deletar mídia" on storage.objects for delete using ( bucket_id = 'imoveis-media' and auth.role() = 'authenticated' );

-- 4. Triggers (Updated At)
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_imoveis
  before update on public.imoveis
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_posts
  before update on public.posts
  for each row execute procedure public.handle_updated_at();
