"use client"

import Image from 'next/image'
import Link from 'next/link'
import { BedDouble, Bath, Car, Maximize, MapPin, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ImovelComFotos } from '@/types'
import { PropertyPlaceholder } from '@/components/ui/PropertyPlaceholder'

interface ImovelCardProps {
  imovel: ImovelComFotos
}

export function ImovelCard({ imovel }: ImovelCardProps) {
  const thumbnail = imovel.imovel_fotos?.[0]?.url || '/placeholder-imovel.png'

  const formatPrice = (price: number | null) => {
    if (!price) return 'Sob Consulta'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link
      href={`/imoveis/${imovel.slug}`}
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ease-out"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {imovel.destaque && (
            <Badge className="bg-accent text-accent-foreground border-none font-medium shadow-md">
              Destaque
            </Badge>
          )}
          <Badge className="bg-black/50 backdrop-blur-sm text-white border-none font-medium capitalize shadow-sm">
            {imovel.finalidade}
          </Badge>
        </div>

        {/* Arrow icon on hover */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <div className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Status overlay */}
        {imovel.status !== 'ativo' && (
          <div className="absolute inset-0 bg-background/60 z-10 flex items-center justify-center backdrop-blur-sm">
            <Badge variant="destructive" className="font-serif text-lg px-6 py-2 uppercase tracking-widest shadow-lg">
              {imovel.status}
            </Badge>
          </div>
        )}

        {thumbnail !== '/placeholder-imovel.png' ? (
          <Image
            src={thumbnail}
            alt={imovel.titulo}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <PropertyPlaceholder />
        )}

        {/* Gradient: always present, darkens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-400" />

        {/* Price floated over image on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white font-bold text-xl drop-shadow-lg">
            {formatPrice(imovel.preco)}
            {imovel.finalidade === 'locação' && <span className="text-sm font-normal opacity-80 ml-1">/mês</span>}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs text-muted-foreground capitalize flex items-center gap-1 mb-2">
          <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
          {imovel.bairro}{imovel.bairro && imovel.cidade ? ', ' : ''}{imovel.cidade}
        </p>

        <h3 className="font-serif font-bold text-lg leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200 flex-grow">
          {imovel.titulo}
        </h3>

        {/* Price (only visible when not hovering image) */}
        <p className="mt-3 text-xl font-bold text-primary dark:text-white flex items-center gap-2 group-hover:opacity-0 transition-opacity duration-200">
          {formatPrice(imovel.preco)}
          {imovel.finalidade === 'locação' && (
            <span className="text-sm text-muted-foreground font-normal">/mês</span>
          )}
        </p>
      </div>

      {/* Footer specs */}
      <div className="px-5 pb-4 pt-0">
        <div className="grid grid-cols-4 gap-0 border-t border-zinc-100 dark:border-white/10 pt-3">
          {[
            { icon: Maximize, val: `${imovel.area_m2} m²` },
            { icon: BedDouble, val: `${imovel.quartos} qts` },
            { icon: Bath, val: `${imovel.banheiros} ban` },
            { icon: Car, val: `${imovel.vagas} vag` },
          ].map(({ icon: Icon, val }, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-1 py-1 text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary/50 dark:text-zinc-400" />
              <span className="text-[11px] font-medium">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}
