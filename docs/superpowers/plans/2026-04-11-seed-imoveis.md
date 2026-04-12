# Seed — Base de Imóveis (30 registros) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inserir 30 imóveis realistas no Supabase cobrindo 5 cidades de SC, com distribuição 18 venda / 12 locação e 24 residencial / 6 comercial.

**Architecture:** SQL puro via Supabase MCP (`execute_sql`). Nenhuma alteração no código do projeto. Sem fotos — imóveis usarão placeholder padrão do site.

**Tech Stack:** Supabase MCP (`mcp__supabase__execute_sql`), PostgreSQL

---

### Task 1: Identificar o projeto Supabase

**Files:** nenhum

- [ ] **Step 1: Listar projetos Supabase disponíveis**

Use `mcp__supabase__list_projects` e anote o `id` do projeto `homeimob`.

- [ ] **Step 2: Confirmar URL do projeto**

Use `mcp__supabase__get_project_url` com o `id` encontrado e confirme que é o projeto correto.

---

### Task 2: Inserir os 30 imóveis via SQL

**Files:** nenhum (execução direta no banco)

- [ ] **Step 1: Executar o INSERT de todos os 30 imóveis**

Use `mcp__supabase__execute_sql` com o seguinte SQL:

```sql
INSERT INTO public.imoveis
  (slug, titulo, descricao, tipo, finalidade, preco, area_m2, quartos, banheiros, vagas,
   endereco, bairro, cidade, uf, cep, destaque, status, updated_at)
VALUES

-- 1. Florianópolis — Casa Jurerê Internacional (DESTAQUE)
(
  'casa-jurere-internacional-florianopolis',
  'Casa de Alto Padrão em Jurerê Internacional',
  'Residência de luxo em condomínio fechado com piscina privativa, área gourmet completa e acabamento premium. A 200m da praia, cercada por jardins paisagísticos.',
  'residencial', 'venda', 3800000, 380, 4, 4, 3,
  'Rua das Nações, 245', 'Jurerê Internacional', 'Florianópolis', 'SC', '88053-100',
  true, 'ativo', now()
),

-- 2. Florianópolis — Apartamento Lagoa da Conceição (DESTAQUE)
(
  'apartamento-lagoa-conceicao-florianopolis',
  'Apartamento com Vista para a Lagoa da Conceição',
  'Unidade moderna com sacada panorâmica, cozinha americana integrada e varanda com vista privilegiada para a Lagoa. Condomínio com academia e salão de festas.',
  'residencial', 'venda', 1200000, 110, 3, 2, 2,
  'Rua Laurindo Januário da Silveira, 1540', 'Lagoa da Conceição', 'Florianópolis', 'SC', '88062-300',
  true, 'ativo', now()
),

-- 3. Florianópolis — Cobertura Centro (DESTAQUE)
(
  'cobertura-centro-florianopolis',
  'Cobertura Duplex no Centro de Florianópolis',
  'Cobertura com terraço privativo, churrasqueira, 2 suítes e living amplo com pé direito duplo. Vista para o mar e acesso a todos os serviços do centro.',
  'residencial', 'venda', 2100000, 220, 4, 3, 3,
  'Rua Felipe Schmidt, 780', 'Centro', 'Florianópolis', 'SC', '88010-000',
  true, 'ativo', now()
),

-- 4. Florianópolis — Apartamento Trindade (locação)
(
  'apartamento-trindade-florianopolis',
  'Apartamento para Alugar na Trindade',
  'Apartamento bem localizado próximo à UFSC, com layout inteligente, varanda e vaga coberta. Ideal para profissionais e estudantes.',
  'residencial', 'locação', 3200, 65, 2, 1, 1,
  'Rua Deputado Antônio Edu Vieira, 390', 'Trindade', 'Florianópolis', 'SC', '88036-000',
  false, 'ativo', now()
),

-- 5. Florianópolis — Studio Itacorubi (locação)
(
  'studio-itacorubi-florianopolis',
  'Studio Moderno no Itacorubi',
  'Studio compacto e funcional, com cozinha americana, banheiro moderno e vaga de garagem. Próximo ao Parque do Córrego Grande e centros empresariais.',
  'residencial', 'locação', 2100, 38, 1, 1, 1,
  'Rua Lauro Linhares, 900', 'Itacorubi', 'Florianópolis', 'SC', '88034-001',
  false, 'ativo', now()
),

-- 6. Florianópolis — Casa Ingleses (locação)
(
  'casa-ingleses-florianopolis',
  'Casa a 500m da Praia dos Ingleses',
  'Casa espaçosa com quintal, área de lazer e garagem para 2 carros. A 5 minutos da praia, em rua tranquila e bem arborizada.',
  'residencial', 'locação', 4800, 150, 3, 2, 2,
  'Rua das Gaivotas, 110', 'Ingleses', 'Florianópolis', 'SC', '88058-600',
  false, 'ativo', now()
),

-- 7. Florianópolis — Sala comercial Centro (venda)
(
  'sala-comercial-centro-florianopolis',
  'Sala Comercial no Centro de Florianópolis',
  'Sala com 80m² em andar alto, vista mar, recepção, 2 ambientes e copa. Excelente localização para escritórios e consultórios.',
  'comercial', 'venda', 650000, 80, 0, 1, 1,
  'Av. Hercílio Luz, 502', 'Centro', 'Florianópolis', 'SC', '88020-000',
  false, 'ativo', now()
),

-- 8. Florianópolis — Loja Estreito (locação)
(
  'loja-estreito-florianopolis',
  'Loja Comercial no Estreito',
  'Ponto comercial em avenida de alto fluxo, frente de vidro, depósito nos fundos e banheiro. Aceita diversos ramos de atividade.',
  'comercial', 'locação', 4500, 95, 0, 1, 1,
  'Av. Mauro Ramos, 1200', 'Estreito', 'Florianópolis', 'SC', '88070-000',
  false, 'ativo', now()
),

-- 9. Florianópolis — Apartamento Córrego Grande (venda)
(
  'apartamento-corrego-grande-florianopolis',
  'Apartamento 3 Dormitórios no Córrego Grande',
  'Apartamento em andar intermediário com sacada, suite e dois dormitórios. Condomínio com portaria 24h, playground e piscina.',
  'residencial', 'venda', 780000, 90, 3, 2, 2,
  'Rua Waldemar Vieira, 200', 'Córrego Grande', 'Florianópolis', 'SC', '88037-000',
  false, 'ativo', now()
),

-- 10. Balneário Camboriú — Apartamento frente mar Centro (DESTAQUE)
(
  'apartamento-frente-mar-balneario-camboriu',
  'Apartamento Frente Mar em Balneário Camboriú',
  'Alto padrão na Avenida Atlântica com vista direta para o mar, amplo living integrado, 2 suítes e varandão. Condomínio com spa, piscina aquecida e segurança 24h.',
  'residencial', 'venda', 3200000, 190, 4, 3, 3,
  'Av. Atlântica, 1800', 'Centro', 'Balneário Camboriú', 'SC', '88330-320',
  true, 'ativo', now()
),

-- 11. Balneário Camboriú — Cobertura Pioneiros (DESTAQUE)
(
  'cobertura-pioneiros-balneario-camboriu',
  'Cobertura de Luxo no Bairro Pioneiros',
  'Cobertura com piscina privativa, churrasqueira, 3 suítes e living com pé direito duplo. Vista 360° para o mar e a Serra. Uma das coberturas mais exclusivas de BC.',
  'residencial', 'venda', 2400000, 210, 3, 3, 2,
  'Rua 3100, 400', 'Pioneiros', 'Balneário Camboriú', 'SC', '88337-000',
  true, 'ativo', now()
),

-- 12. Balneário Camboriú — Apartamento Nações (venda)
(
  'apartamento-nacoes-balneario-camboriu',
  'Apartamento 2 Suítes no Bairro Nações',
  'Apartamento em prédio novo, com varanda gourmet, 2 suítes e vaga dupla. Próximo ao comércio e a 10 minutos da praia central.',
  'residencial', 'venda', 950000, 85, 2, 2, 2,
  'Rua 2400, 155', 'Nações', 'Balneário Camboriú', 'SC', '88338-000',
  false, 'ativo', now()
),

-- 13. Balneário Camboriú — Casa em Condomínio Barra Sul (DESTAQUE)
(
  'casa-condominio-barra-sul-balneario-camboriu',
  'Casa em Condomínio Fechado na Barra Sul',
  'Casa ampla em condomínio de alto padrão com segurança 24h, piscina, área gourmet e jardim privativo. A 300m do canal de Barra Sul.',
  'residencial', 'venda', 1800000, 280, 4, 3, 3,
  'Av. do Estado, 3500', 'Barra Sul', 'Balneário Camboriú', 'SC', '88339-000',
  true, 'ativo', now()
),

-- 14. Balneário Camboriú — Apartamento Centro (locação)
(
  'apartamento-centro-balneario-camboriu-locacao',
  'Apartamento para Alugar no Centro de Balneário Camboriú',
  'Apartamento mobiliado a 3 quadras da praia, com varanda, 2 dormitórios e vaga. Aceita contrato anual ou temporada.',
  'residencial', 'locação', 5500, 80, 2, 2, 2,
  'Rua 1000, 320', 'Centro', 'Balneário Camboriú', 'SC', '88330-000',
  false, 'ativo', now()
),

-- 15. Balneário Camboriú — Studio Centro (locação)
(
  'studio-centro-balneario-camboriu',
  'Studio Moderno a 2 Quadras da Praia Central',
  'Studio compacto e bem acabado, com cozinha integrada e varanda. Ideal para moradia ou investimento em temporada.',
  'residencial', 'locação', 3200, 42, 1, 1, 1,
  'Rua 800, 90', 'Centro', 'Balneário Camboriú', 'SC', '88330-010',
  false, 'ativo', now()
),

-- 16. Balneário Camboriú — Sala comercial Centro (venda)
(
  'sala-comercial-centro-balneario-camboriu',
  'Sala Comercial no Centro de Balneário Camboriú',
  'Sala em edifício comercial moderno, 65m², 2 vagas, em área de alto tráfego. Ideal para consultórios, escritórios e serviços.',
  'comercial', 'venda', 480000, 65, 0, 1, 2,
  'Av. Central, 450', 'Centro', 'Balneário Camboriú', 'SC', '88330-100',
  false, 'ativo', now()
),

-- 17. Joinville — Casa no América (venda)
(
  'casa-america-joinville',
  'Casa Espaçosa no Bairro América — Joinville',
  'Casa em lote de 400m² com piscina, área gourmet, 4 dormitórios sendo 1 suíte. Bairro nobre de Joinville, próximo a escolas e shoppings.',
  'residencial', 'venda', 750000, 200, 4, 3, 3,
  'Rua Joaquim Nabuco, 620', 'América', 'Joinville', 'SC', '89204-020',
  false, 'ativo', now()
),

-- 18. Joinville — Apartamento Anita Garibaldi (venda)
(
  'apartamento-anita-garibaldi-joinville',
  'Apartamento 3 Dormitórios no Anita Garibaldi',
  'Apartamento em prédio consolidado, com sala de estar e jantar, suite, 2 dormitórios e garagem coberta. Ótima localização central.',
  'residencial', 'venda', 420000, 80, 3, 2, 2,
  'Rua Anita Garibaldi, 1100', 'Anita Garibaldi', 'Joinville', 'SC', '89202-000',
  false, 'ativo', now()
),

-- 19. Joinville — Casa em condomínio Glória (venda)
(
  'casa-condominio-gloria-joinville',
  'Casa em Condomínio no Glória — Joinville',
  'Casa térrea em condomínio fechado com portaria, playground e área de lazer. 3 dormitórios, suite, quintal com churrasqueira.',
  'residencial', 'venda', 580000, 160, 3, 2, 2,
  'Rua Floresta, 900', 'Glória', 'Joinville', 'SC', '89216-000',
  false, 'ativo', now()
),

-- 20. Joinville — Apartamento Centro (locação)
(
  'apartamento-centro-joinville-locacao',
  'Apartamento para Alugar no Centro de Joinville',
  'Apartamento com 2 dormitórios, living integrado e vaga coberta. No coração de Joinville, a passos do comércio e transporte.',
  'residencial', 'locação', 2400, 65, 2, 1, 1,
  'Rua do Príncipe, 500', 'Centro', 'Joinville', 'SC', '89201-000',
  false, 'ativo', now()
),

-- 21. Joinville — Galpão industrial Bucarein (venda)
(
  'galpao-industrial-bucarein-joinville',
  'Galpão Industrial no Bucarein — Joinville',
  'Galpão com pé direito de 8m, piso industrial reforçado, escritório integrado, refeitório e pátio para manobra de carretas. Ideal para logística e manufatura.',
  'comercial', 'venda', 1200000, 600, 0, 2, 10,
  'Rua Otto Boehm, 1500', 'Bucarein', 'Joinville', 'SC', '89206-000',
  false, 'ativo', now()
),

-- 22. Joinville — Loja Centro (locação)
(
  'loja-centro-joinville-locacao',
  'Loja Comercial no Centro de Joinville',
  'Ponto comercial de esquina com 120m², vitrine dupla, mezanino e banheiro. Excelente visibilidade e fluxo de pedestres.',
  'comercial', 'locação', 5800, 120, 0, 1, 2,
  'Rua Jerônimo Coelho, 200', 'Centro', 'Joinville', 'SC', '89201-010',
  false, 'ativo', now()
),

-- 23. Blumenau — Apartamento Centro (venda)
(
  'apartamento-centro-blumenau-venda',
  'Apartamento 3 Dormitórios no Centro de Blumenau',
  'Apartamento bem conservado com sala ampla, cozinha planejada, 3 dormitórios e vaga coberta. Próximo ao Parque Vila Germânica e centros comerciais.',
  'residencial', 'venda', 380000, 85, 3, 2, 2,
  'Rua XV de Novembro, 850', 'Centro', 'Blumenau', 'SC', '89010-000',
  false, 'ativo', now()
),

-- 24. Blumenau — Casa Ponta Aguda (venda)
(
  'casa-ponta-aguda-blumenau',
  'Casa com Piscina no Ponta Aguda — Blumenau',
  'Casa em 2 pavimentos com piscina, área gourmet, 4 dormitórios sendo 2 suítes. Bairro valorizado com vistas para o vale e fácil acesso à BR-470.',
  'residencial', 'venda', 620000, 180, 4, 3, 3,
  'Rua Dr. Amadeu da Luz, 430', 'Ponta Aguda', 'Blumenau', 'SC', '89051-000',
  false, 'ativo', now()
),

-- 25. Blumenau — Apartamento Victor Konder (locação)
(
  'apartamento-victor-konder-blumenau-locacao',
  'Apartamento para Alugar no Victor Konder',
  'Apartamento luminoso com 2 dormitórios, varanda, vaga coberta e condomínio com academia. Bairro tranquilo e bem servido de transporte.',
  'residencial', 'locação', 2200, 68, 2, 1, 1,
  'Rua Victor Konder, 780', 'Victor Konder', 'Blumenau', 'SC', '89012-000',
  false, 'ativo', now()
),

-- 26. Blumenau — Casa Garcia (locação)
(
  'casa-garcia-blumenau-locacao',
  'Casa para Alugar no Bairro Garcia — Blumenau',
  'Casa com 3 dormitórios, sala espaçosa, quintal gramado e garagem para 2 carros. Bairro residencial tranquilo, próximo a escolas e supermercados.',
  'residencial', 'locação', 3500, 140, 3, 2, 2,
  'Rua Humberto de Campos, 340', 'Garcia', 'Blumenau', 'SC', '89030-000',
  false, 'ativo', now()
),

-- 27. Blumenau — Sala comercial Centro (locação)
(
  'sala-comercial-centro-blumenau-locacao',
  'Sala Comercial para Alugar no Centro de Blumenau',
  'Sala climatizada em edifício corporativo, 55m², recepção compartilhada e 2 vagas. Ideal para escritórios, consultorias e prestadores de serviço.',
  'comercial', 'locação', 3200, 55, 0, 1, 2,
  'Rua 7 de Setembro, 510', 'Centro', 'Blumenau', 'SC', '89010-200',
  false, 'ativo', now()
),

-- 28. Itajaí — Apartamento Centro (venda)
(
  'apartamento-centro-itajai-venda',
  'Apartamento 2 Dormitórios no Centro de Itajaí',
  'Apartamento com sala, cozinha, 2 dormitórios e garagem. Localização central, próximo a bancos, comércio e ponto de ônibus para Balneário Camboriú.',
  'residencial', 'venda', 390000, 70, 2, 1, 1,
  'Rua Hercílio Luz, 320', 'Centro', 'Itajaí', 'SC', '88301-000',
  false, 'ativo', now()
),

-- 29. Itajaí — Casa no Fazenda (venda)
(
  'casa-fazenda-itajai-venda',
  'Casa com Quintal no Bairro Fazenda — Itajaí',
  'Casa térrea com 3 dormitórios, sala, quintal com churrasqueira e garagem coberta. Bairro familiar com boa infraestrutura e próximo ao Porto de Itajaí.',
  'residencial', 'venda', 520000, 150, 3, 2, 2,
  'Rua Cel. Marcos Konder, 780', 'Fazenda', 'Itajaí', 'SC', '88303-000',
  false, 'ativo', now()
),

-- 30. Itajaí — Apartamento Cordeiros (locação)
(
  'apartamento-cordeiros-itajai-locacao',
  'Apartamento para Alugar nos Cordeiros — Itajaí',
  'Apartamento com 2 dormitórios, living espaçoso, área de serviço e garagem coberta. Bairro em crescimento com fácil acesso à BR-101.',
  'residencial', 'locação', 2000, 60, 2, 1, 1,
  'Rua Joinville, 1100', 'Cordeiros', 'Itajaí', 'SC', '88307-000',
  false, 'ativo', now()
);
```

- [ ] **Step 2: Verificar resultado esperado**

Resultado esperado: `INSERT 0 30` (sem erros).

---

### Task 3: Verificar os dados inseridos

**Files:** nenhum

- [ ] **Step 1: Contar total de imóveis**

Use `mcp__supabase__execute_sql`:

```sql
SELECT count(*) AS total FROM public.imoveis;
```

Esperado: `total = 30`

- [ ] **Step 2: Verificar distribuição por finalidade**

```sql
SELECT finalidade, count(*) FROM public.imoveis GROUP BY finalidade;
```

Esperado: `venda = 18`, `locação = 12`

- [ ] **Step 3: Verificar distribuição por tipo**

```sql
SELECT tipo, count(*) FROM public.imoveis GROUP BY tipo;
```

Esperado: `residencial = 24`, `comercial = 6`

- [ ] **Step 4: Verificar destaques**

```sql
SELECT titulo, cidade FROM public.imoveis WHERE destaque = true;
```

Esperado: 6 registros (3 de Florianópolis, 3 de Balneário Camboriú)

- [ ] **Step 5: Verificar distribuição por cidade**

```sql
SELECT cidade, count(*) FROM public.imoveis GROUP BY cidade ORDER BY count DESC;
```

Esperado:
- Florianópolis: 9
- Balneário Camboriú: 7
- Joinville: 6
- Blumenau: 5
- Itajaí: 3

- [ ] **Step 6: Commit de registro**

```bash
git commit --allow-empty -m "data: seed 30 imoveis SC via supabase sql"
```
