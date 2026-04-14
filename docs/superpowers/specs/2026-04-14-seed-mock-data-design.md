# Seed — Dados Mock Realistas (todas as tabelas)

**Data:** 2026-04-14
**Status:** Aprovado
**Abordagem:** SQL autocontido com UUIDs fixos, executado via Supabase MCP (`execute_sql`)

---

## Contexto

As 13 tabelas do projeto já existem no Supabase. O objetivo é popular todas elas com dados mock realistas e coerentes entre si, de modo que o painel admin, o dashboard, o CRM e as páginas de locações/vendas exibam informações significativas.

---

## Abordagem

- **Um único bloco SQL** executado em ordem de dependência
- **UUIDs fixos hardcoded** para garantir integridade referencial entre tabelas
- **`INSERT ... ON CONFLICT DO NOTHING`** em `imoveis` para não duplicar os 30 registros caso já existam
- Demais tabelas assumidas vazias (sem ON CONFLICT)
- Datas espalhadas nos últimos 6 meses: outubro/2025 → abril/2026

---

## Volumes por tabela

| Tabela | Registros | Observação |
|---|---|---|
| `clientes` | 15 | 8 proprietários, 5 inquilinos/compradores, 2 PJ |
| `imoveis` | 30 | Script existente — ON CONFLICT DO NOTHING |
| `leads` | 12 | 2 por estágio do kanban (6 estágios) |
| `lead_interactions` | 24 | 2 por lead em média |
| `contratos` | 5 | Todos `ativo`, vinculam imóveis de locação |
| `pagamentos` | 25 | 1 por mês desde o início de cada contrato até abr/2026 |
| `repasses` | 19 | Apenas meses com pagamento `pago` (excluindo atrasado e pendente) |
| `vistorias` | 8 | 5 entrada + 3 periódicas |
| `manutencoes` | 8 | Mix aberta/em_andamento/concluida |
| `propostas` | 4 | aguardando / contraproposta / aceita / recusada |
| `visitas_vendas` | 6 | 3 realizadas, 2 agendadas, 1 cancelada |
| `captacoes` | 8 | Distribuídas nos 4 status |
| `blog_posts` | 3 | 2 publicados, 1 rascunho |

---

## Clientes (15)

### Pessoas Físicas (13)
Nomes com sobrenomes catarinenses (Schaefer, Wachholz, Meurer, Zimmermann, Becker, etc.)

| ID (sufixo) | Nome | Papel principal |
|---|---|---|
| cli-01 | Rodrigo Schaefer | proprietário |
| cli-02 | Fernanda Wachholz | proprietária |
| cli-03 | Carlos Meurer | proprietário |
| cli-04 | Beatriz Zimmermann | proprietária |
| cli-05 | André Becker | proprietário |
| cli-06 | Patrícia Lange | inquilina |
| cli-07 | Lucas Reinhardt | inquilino |
| cli-08 | Mariana Furtado | inquilina |
| cli-09 | Gabriel Oliveira | inquilino |
| cli-10 | Camila Ramos | inquilina / compradora |
| cli-11 | Felipe Teixeira | comprador |
| cli-12 | Juliana Soares | compradora |
| cli-13 | Henrique Borges | vendedor / proprietário |

### Pessoas Jurídicas (2)
| ID (sufixo) | Razão Social | Papel |
|---|---|---|
| cli-14 | Construtora Litoral SC Ltda | proprietária (imóvel comercial) |
| cli-15 | Farmácias Rede Sul Ltda | inquilina (imóvel comercial) |

---

## Leads (12)

Distribuídos pelos 6 estágios do CRM kanban:

| Stage | Qtd | Perfis |
|---|---|---|
| `lead` | 2 | Entrada pelo site, sem contato ainda |
| `atendimento` | 2 | Em conversa com corretor |
| `visita` | 2 | Visita agendada ou realizada |
| `proposta` | 2 | Proposta em elaboração |
| `negociacao` | 2 | Negociando termos finais |
| `fechamento` | 2 | Fechamento iminente |

Origens variadas: `site`, `whatsapp`, `portais`, `indicacao`, `telefone`.
Prioridades: alta nos estágios avançados, baixa nos iniciais.

---

## Contratos (5)

Vinculam imóveis de `finalidade = 'locação'` com clientes proprietários e inquilinos:

| Contrato | Imóvel (slug) | Proprietário | Inquilino | Aluguel | Início |
|---|---|---|---|---|---|
| ctr-01 | apartamento-trindade-florianopolis | cli-01 | cli-06 | R$ 3.200 | 2025-11-01 |
| ctr-02 | studio-itacorubi-florianopolis | cli-02 | cli-07 | R$ 2.100 | 2025-10-01 |
| ctr-03 | casa-ingleses-florianopolis | cli-03 | cli-08 | R$ 4.800 | 2025-12-01 |
| ctr-04 | apartamento-centro-joinville-locacao | cli-04 | cli-09 | R$ 2.400 | 2026-01-01 |
| ctr-05 | apartamento-cordeiros-itajai-locacao | cli-05 | cli-10 | R$ 2.000 | 2026-02-01 |

Taxa de administração: 8% para todos.

---

## Pagamentos (30)

Um pagamento por mês desde a `data_inicio` do contrato até abril/2026 (inclusive).

**Contagens por contrato:**
- ctr-01 (nov/2025): nov–abr = 6 pagamentos
- ctr-02 (out/2025): out–abr = 7 pagamentos
- ctr-03 (dez/2025): dez–abr = 5 pagamentos
- ctr-04 (jan/2026): jan–abr = 4 pagamentos
- ctr-05 (fev/2026): fev–abr = 3 pagamentos
- **Total: 25 pagamentos**

**Regra de status:**
- Meses anteriores a abr/2026: `pago` (com `data_pagamento` preenchida)
- Abril/2026 (mês atual): `pendente`
- ctr-03 tem o mês 03/2026 como `atrasado` (sem `data_pagamento`) — para popular o KPI "aluguéis a vencer" do dashboard

---

## Repasses (25)

Gerados apenas para pagamentos com status `pago` (~19 registros: 25 total - 5 pendentes - 1 atrasado). Calculados como:
- `valor_bruto` = valor do aluguel
- `taxa_administracao` = 8%
- `valor_liquido` = valor_bruto × 0.92
- `data_repasse` = 5 dias após `data_pagamento`
- `status` = `realizado`

---

## Vistorias (8)

| Tipo | Qtd | Vinculada a |
|---|---|---|
| `entrada` | 5 | Um por contrato, na data de início |
| `periodica` | 3 | ctr-01, ctr-02, ctr-03 — ~6 meses após entrada |

---

## Manutenções (8)

Vinculadas a imóveis de locação, cobrindo problemas comuns:

| Status | Qtd | Exemplos |
|---|---|---|
| `aberta` | 2 | Infiltração no teto, torneira com vazamento |
| `em_andamento` | 3 | Pintura interna, reparo elétrico, troca de fechadura |
| `concluida` | 3 | Revisão hidráulica, instalação de ar-condicionado, troca de piso |

---

## Propostas (4)

Vinculam imóveis de `finalidade = 'venda'` com compradores e proprietários:

| Status | Imóvel | Valor pedido | Valor oferta |
|---|---|---|---|
| `aguardando` | casa-america-joinville | R$ 750.000 | R$ 720.000 |
| `contraproposta` | apartamento-lagoa-conceicao | R$ 1.200.000 | R$ 1.100.000 |
| `aceita` | apartamento-nacoes-balneario-camboriu | R$ 950.000 | R$ 930.000 |
| `recusada` | apartamento-corrego-grande-florianopolis | R$ 780.000 | R$ 700.000 |

---

## Visitas de Vendas (6)

| Status | Qtd | Imóveis |
|---|---|---|
| `realizada` | 3 | Florianópolis e BC — leads nos estágios visita/proposta |
| `agendada` | 2 | Joinville e Blumenau — leads em atendimento |
| `cancelada` | 1 | Itajaí — lead cancelou |

---

## Captações (8)

Imóveis em prospecção para ampliar o portfólio:

| Status | Qtd |
|---|---|
| `prospectando` | 2 |
| `em_avaliacao` | 3 |
| `autorizado` | 2 |
| `recusado` | 1 |

Endereços em Florianópolis, BC e Joinville. Corretores: "Ana Lima" e "Marco Vieira".

---

## Blog Posts (3)

| Status | Título |
|---|---|
| `publicado` | Como Escolher o Bairro Ideal para Morar em Florianópolis |
| `publicado` | Financiamento Imobiliário: Tudo que Você Precisa Saber |
| `rascunho` | Mercado Imobiliário em Santa Catarina: Perspectivas para 2026 |

Conteúdo em markdown simples, 3-4 parágrafos cada. Tags relevantes ao mercado imobiliário de SC.

---

## Dashboard — resultado esperado

Com os dados acima, o dashboard exibirá:
- **Imóveis ativos:** 30
- **Aluguéis a vencer:** 1 (o pagamento atrasado do ctr-03)
- **Leads no mês:** leads criados em abril/2026
- **Receita mensal:** gráfico com 6 barras, crescendo de nov/2025 a mar/2026, queda em abr/2026 (mês corrente, pagamentos ainda pendentes)

---

## Implementação

1. Executar bloco SQL único via `mcp__supabase__execute_sql` (project_id: `oqmaymqoifyfhrrcyyim`)
2. Verificar contagens em cada tabela
3. Confirmar dashboard KPIs no browser

---

## Fora do escopo

- `imovel_fotos` — imóveis usam placeholder padrão do site
- `configuracoes` — não precisa de seed
- Dados de autenticação / usuários admin
