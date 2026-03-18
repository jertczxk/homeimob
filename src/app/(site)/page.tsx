"use client"

import { IndicesEconomicos } from '@/components/site/IndicesEconomicos'
import { ServicosCards } from '@/components/site/ServicosCards'
import { ImovelCard } from '@/components/site/ImovelCard'
import { FiltrosBusca } from '@/components/site/FiltrosBusca'
import { CorretorVirtual } from '@/components/site/CorretorVirtual'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Building, Home as HomeIcon, Key, TrendingUp, Users, Building2, Award, Calendar } from 'lucide-react'
import { mockImoveis } from '@/lib/mock'
import { Counter } from '@/components/site/Counter'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [destaques, setDestaques] = useState<any[]>([])

  useEffect(() => {
    setDestaques(mockImoveis.filter(i => i.destaque && i.status === 'ativo').slice(0, 6))
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen lg:h-screen lg:min-h-[850px] flex flex-col bg-zinc-950 overflow-visible lg:overflow-hidden">
        {/* Background Image with optimized overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-110 animate-slow-zoom"
          style={{
            backgroundImage: "url('/background.png')",
            opacity: 0.6
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

        <div className="container relative z-10 flex-1 flex flex-col justify-center pt-32 lg:pt-44">
          <div className="max-w-4xl space-y-16 animate-in fade-in slide-in-from-left-6 duration-1000">

            {/* Headlines */}
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

            {/* Integrated Search Bar below headlines */}
            <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 relative z-20 pb-12 lg:pb-20">
              <div className="bg-white/5 backdrop-blur-3xl p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-white/10 shadow-3xl relative group">
                {/* Removed overflow-hidden to allow dropdowns to show and removed blocking absolute overlay */}
                <FiltrosBusca />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hero: Stats Bar */}
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
                      ) : (
                        stat.label
                      )}
                    </p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-[0.15em] font-black">
                      {'end' in stat ? stat.label : (stat as any).subLabel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CorretorVirtual />

      {/* Seção de Serviços/Banners */}
      <section className="py-24 bg-background relative z-20">
        <div className="container">
          <ServicosCards />
        </div>
      </section>

      {/* Categorias */}
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
                  {/* Subtle primary tint on hover */}
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />
                  {/* Bottom primary accent line */}
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

      {/* Destaques */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/10">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif font-bold tracking-tight">Imóveis em Destaque</h2>
              <p className="text-muted-foreground text-lg">Veja os imóveis mais procurados agora.</p>
            </div>
            <Button variant="outline" className="hidden sm:flex rounded-full border-primary text-primary hover:bg-primary hover:text-white" asChild>
              <Link href="/imoveis">
                Ver todos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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
              <Link href="/imoveis">
                Ver todos os imóveis
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
