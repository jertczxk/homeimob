import { ImovelCard } from '@/components/site/ImovelCard'
import { FiltrosSidebar } from '@/components/site/FiltrosSidebar'
import { getImoveis } from '@/lib/supabase/queries/imoveis'
import { Suspense } from 'react'
import { Filter, Search } from 'lucide-react'

export const revalidate = 60

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const finalidade = params.finalidade as string
  const tipo = params.tipo as string
  const bairro = params.bairro as string
  const precoMin = params.precoMin ? Number(params.precoMin) : undefined
  const precoMax = params.precoMax ? Number(params.precoMax) : undefined
  const quartos = params.quartos ? Number(params.quartos) : undefined
  const vagas = params.vagas ? Number(params.vagas) : undefined
  const order = params.order as string

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

  return (
    <div className="bg-background min-h-screen">
      <div className="container pt-32 pb-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar */}
          <Suspense fallback={<div className="w-80 h-[600px] bg-muted animate-pulse rounded-2xl" />}>
            <FiltrosSidebar />
          </Suspense>

          {/* Content */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-zinc-100 dark:border-white/5">
              <div className="space-y-1">
                <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Imóveis</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {imoveisFiltrados.length} resultados encontrados
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Ordenar por:</span>
                <select
                  className="bg-transparent text-sm font-semibold border-none focus:ring-0 cursor-pointer text-foreground"
                  defaultValue={order}
                // Simplified order handling via page change
                >
                  <option value="">Mais Recentes</option>
                  <option value="price_asc">Menor Preço</option>
                  <option value="price_desc">Maior Preço</option>
                </select>
              </div>
            </div>

            <div className="min-h-[600px]">
              {imoveisFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {imoveisFiltrados.map((imovel) => (
                    <ImovelCard key={imovel.id} imovel={imovel} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <Search className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Nenhum imóvel encontrado</h3>
                    <p className="text-muted-foreground max-w-xs">
                      Não encontramos imóveis com esses filtros. Tente ajustar sua busca para ver mais resultados.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
