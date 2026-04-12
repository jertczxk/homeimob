import { createClient as createDirectClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// ── Tool: buscar_imoveis ────────────────────────────────────────────────────

export interface BuscarImoveisParams {
  tipo?: string
  finalidade?: string
  preco_max?: number
  preco_min?: number
  quartos?: number
  cidade?: string
}

interface ImovelQueryRow {
  slug: string
  titulo: string
  tipo: string
  finalidade: string
  preco: number | null
  quartos: number
  banheiros: number
  vagas: number
  area_m2: number | null
  bairro: string | null
  cidade: string | null
  imovel_fotos: { url: string; ordem: number }[]
}

export async function executeBuscarImoveis(params: BuscarImoveisParams) {
  const supabase = createDirectClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  let query = supabase
    .from('imoveis')
    .select('id, slug, titulo, tipo, finalidade, preco, quartos, banheiros, vagas, area_m2, bairro, cidade, imovel_fotos(url, ordem)')
    .eq('status', 'ativo')
    .order('destaque', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)

  if (params.finalidade) query = query.eq('finalidade', params.finalidade)
  if (params.tipo) query = query.eq('tipo', params.tipo)
  if (params.preco_max) query = query.lte('preco', params.preco_max)
  if (params.preco_min) query = query.gte('preco', params.preco_min)
  if (params.quartos) query = query.gte('quartos', params.quartos)
  if (params.cidade) {
    query = query.or(`cidade.ilike.%${params.cidade}%,bairro.ilike.%${params.cidade}%`)
  }

  const { data, error } = await query
  if (error) return { erro: error.message }
  if (!data || data.length === 0) return { resultado: 'Nenhum imóvel encontrado com esses critérios.' }

  const imoveis = (data as ImovelQueryRow[]).map((im: ImovelQueryRow) => {
    const fotos = (im.imovel_fotos ?? []) as { url: string; ordem: number }[]
    fotos.sort((a, b) => a.ordem - b.ordem)
    return {
      titulo: im.titulo,
      tipo: im.tipo,
      finalidade: im.finalidade,
      preco: im.preco ? `R$ ${Number(im.preco).toLocaleString('pt-BR')}` : 'Consultar',
      quartos: im.quartos,
      banheiros: im.banheiros,
      vagas: im.vagas,
      area_m2: im.area_m2,
      bairro: im.bairro,
      cidade: im.cidade,
      link: `/imoveis/${im.slug}`,
      foto: fotos[0]?.url ?? null,
    }
  })

  return { imoveis }
}

// ── Tool: buscar_conhecimento ───────────────────────────────────────────────

export interface BuscarConhecimentoParams {
  query: string
}

export function executeBuscarConhecimento(_params: BuscarConhecimentoParams): object {
  try {
    const filePath = join(process.cwd(), 'src', 'data', 'conhecimento.md')
    const content = readFileSync(filePath, 'utf-8')
    return { conteudo: content }
  } catch {
    return { erro: 'Base de conhecimento não disponível.' }
  }
}

// ── Tool: registrar_simulacao ───────────────────────────────────────────────

export interface RegistrarSimulacaoParams {
  nome: string
  telefone: string
  valor_imovel: number
  valor_entrada: number
  prazo_anos: number
}

export async function executeRegistrarSimulacao(params: RegistrarSimulacaoParams) {
  const supabase = createDirectClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const notas = [
    `Simulação de financiamento via Corretor Virtual`,
    `Valor do imóvel: R$ ${Number(params.valor_imovel).toLocaleString('pt-BR')}`,
    `Valor de entrada: R$ ${Number(params.valor_entrada).toLocaleString('pt-BR')}`,
    `Prazo: ${params.prazo_anos} anos`,
  ].join('\n')

  const { error } = await supabase.from('leads').insert({
    nome: params.nome,
    telefone: params.telefone,
    email: null,
    interesse: 'venda',
    tipo_interesse: null,
    valor_min: null,
    valor_max: params.valor_imovel,
    bairro_interesse: null,
    stage: 'lead',
    prioridade: 'media',
    origem: 'site',
    corretor: null,
    notas,
  })

  if (error) return { erro: error.message }
  return { sucesso: true, mensagem: 'Simulação registrada com sucesso!' }
}
