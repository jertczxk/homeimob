# Seed — Base de Imóveis (30 registros)

**Data:** 2026-04-11
**Abordagem:** SQL via Supabase MCP (`execute_sql`)

---

## Escopo

Inserir 30 imóveis fictícios mas realistas no banco Supabase, cobrindo o portfólio da imobiliária em Santa Catarina. Sem fotos por enquanto (placeholder via `/placeholder-house.webp`).

---

## Distribuição

### Por finalidade
| Finalidade | Qtd |
|---|---|
| Venda | 18 |
| Locação | 12 |

### Por tipo
| Tipo | Qtd |
|---|---|
| Residencial | 24 |
| Comercial | 6 |

### Cruzamento tipo × finalidade
| | Venda | Locação | Total |
|---|---|---|---|
| Residencial | 14 | 10 | 24 |
| Comercial | 4 | 2 | 6 |

### Por cidade
| Cidade | Qtd | Bairros principais |
|---|---|---|
| Florianópolis | 9 | Jurerê Internacional, Lagoa da Conceição, Trindade, Itacorubi, Centro |
| Balneário Camboriú | 7 | Centro, Pioneiros, Nações, Barra Sul |
| Joinville | 6 | América, Anita Garibaldi, Glória, Centro |
| Blumenau | 5 | Centro, Ponta Aguda, Victor Konder, Velha |
| Itajaí | 3 | Centro, Fazenda, Cordeiros |

### Subtipos residenciais (24)
- Apartamentos: 10
- Casas / casas em condomínio: 8
- Coberturas / duplex: 4
- Studios / flats: 2

### Subtipos comerciais (6)
- Salas comerciais: 3
- Lojas: 2
- Galpão: 1

---

## Faixas de preço

| Segmento | Faixa |
|---|---|
| Florianópolis venda | R$ 650k – R$ 4,2M |
| Balneário Camboriú venda | R$ 780k – R$ 3,8M |
| Joinville / Blumenau venda | R$ 280k – R$ 850k |
| Itajaí venda | R$ 350k – R$ 750k |
| Aluguéis residencial | R$ 1.800 – R$ 9.500/mês |
| Comercial venda | R$ 320k – R$ 1,4M |
| Comercial locação | R$ 2.800 – R$ 8.500/mês |

---

## Destaques

6 imóveis com `destaque = true` — os mais premium, distribuídos em Florianópolis (3) e Balneário Camboriú (3). Estes aparecem na seção "Imóveis em Destaque" da home.

---

## Campos por registro

Todos os campos obrigatórios e opcionais preenchidos:
- `slug` — gerado a partir do título (kebab-case único)
- `titulo`, `descricao`, `tipo`, `finalidade`
- `preco`, `area_m2`, `quartos`, `banheiros`, `vagas`
- `endereco`, `bairro`, `cidade`, `uf` = 'SC', `cep`
- `destaque`, `status` = 'ativo'

Sem registros em `imovel_fotos` (fotos serão adicionadas posteriormente via admin).

---

## Implementação

1. Gerar script SQL com 30 `INSERT INTO public.imoveis (...)` statements
2. Executar via `mcp__supabase__execute_sql` no projeto correto
3. Verificar contagem: `SELECT count(*) FROM imoveis`
