import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ImovelGaleria } from '@/components/site/ImovelGaleria'
import { FormContato } from '@/components/site/FormContato'
import { Badge } from '@/components/ui/badge'
import { BedDouble, Bath, Car, Maximize, MapPin } from 'lucide-react'
import { getImovelBySlug } from '@/lib/supabase/queries/imoveis'

export const revalidate = 60

export default async function ImovelDetalhePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const imovel = await getImovelBySlug(resolvedParams.slug)

  if (!imovel) notFound()

  const formatPrice = (price: number | null) => {
    if (!price) return 'Sob Consulta'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Número do WhatsApp vindo do env, ex: "5511999999999"
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const whatsappMessage = encodeURIComponent(`Olá, tenho interesse no imóvel: ${imovel.titulo} (${process.env.NEXT_PUBLIC_SITE_URL}/imoveis/${imovel.slug})`)
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="container pt-32 pb-8 md:pt-40 md:pb-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-muted-foreground gap-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/imoveis" className="hover:text-primary">Imóveis</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{imovel.titulo}</span>
      </nav>

      {/* Título e Preço Mobile/Desktop */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex gap-2 mb-2">
            <Badge className="bg-primary">{imovel.finalidade}</Badge>
            <Badge variant="outline" className="capitalize">{imovel.tipo}</Badge>
            {imovel.status !== 'ativo' && (
              <Badge variant="destructive" className="uppercase">{imovel.status}</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{imovel.titulo}</h1>
          <p className="text-lg text-muted-foreground flex items-center gap-1">
            <MapPin className="h-5 w-5" />
            {imovel.endereco ? `${imovel.endereco}, ` : ''}{imovel.bairro} - {imovel.cidade}/{imovel.uf}
          </p>
        </div>

        <div className="bg-muted/30 p-6 rounded-2xl border text-center md:text-right min-w-[250px]">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {imovel.finalidade === 'venda' ? 'Valor de Venda' : 'Valor de Locação'}
          </p>
          <p className="text-4xl font-bold text-primary">
            {formatPrice(imovel.preco)}
            {imovel.finalidade === 'locação' && <span className="text-lg font-normal text-muted-foreground">/mês</span>}
          </p>
        </div>
      </div>

      {/* Galeria */}
      <ImovelGaleria fotos={imovel.imovel_fotos} titulo={imovel.titulo} />

      {/* Grid Principal (Conteúdo + Sidebar de Contato) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

        {/* Coluna Esquerda: Detalhes, Descrição */}
        <div className="lg:col-span-2 space-y-10">

          {/* Features Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-2">
              <Maximize className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-bold text-lg">{imovel.area_m2 || '--'} m²</p>
                <p className="text-sm text-muted-foreground">Área Total</p>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-2">
              <BedDouble className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-bold text-lg">{imovel.quartos}</p>
                <p className="text-sm text-muted-foreground">Quartos</p>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-2">
              <Bath className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-bold text-lg">{imovel.banheiros}</p>
                <p className="text-sm text-muted-foreground">Banheiros</p>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-2">
              <Car className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-bold text-lg">{imovel.vagas}</p>
                <p className="text-sm text-muted-foreground">Vagas</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Descrição do Imóvel</h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {/* Simulando texto rico, na vida real isso poderia vir de um rich text editor ou usar white-space: pre-wrap */}
              <p className="whitespace-pre-wrap leading-relaxed">
                {imovel.descricao || 'Sem descrição cadastrada para este imóvel.'}
              </p>
            </div>
          </div>

        </div>

        {/* Coluna Direita: Sticky Sidebar com forms */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-card p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold mb-4">Quer saber mais?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Deixe seu contato e a gente te responde rápido. Ou fale direto pelo WhatsApp.
            </p>

            <FormContato imovelId={imovel.id} />

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t"></div>
              <span className="px-4 text-xs text-muted-foreground uppercase">ou</span>
              <div className="flex-1 border-t"></div>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-3 font-semibold transition-colors"
            >
              Falar Via WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
