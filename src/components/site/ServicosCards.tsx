"use client"

import { Briefcase, Handshake, Calculator, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface Servico {
    title: string
    description: string
    icon: ReactNode
    cta: string
    href: string
}

const servicos: Servico[] = [
    {
        title: 'Anuncie seu Imóvel',
        description: 'Quer vender ou alugar? A gente cuida da divulgação e te ajuda a fechar o negócio.',
        icon: <Briefcase className="h-7 w-7" />,
        cta: 'Falar com a Gente',
        href: '/contato?assunto=anuncio',
    },
    {
        title: 'Alugue sem Fiador',
        description: 'Sem fiador, sem papelada. Processo digital, rápido e descomplicado.',
        icon: <Handshake className="h-7 w-7" />,
        cta: 'Ver Imóveis para Alugar',
        href: '/imoveis?finalidade=locação',
    },
    {
        title: 'Simule seu Financiamento',
        description: 'Veja quanto cabe no seu bolso antes de decidir. Simulação gratuita e sem compromisso.',
        icon: <Calculator className="h-7 w-7" />,
        cta: 'Simular Agora',
        href: '/contato?assunto=financiamento',
    },
]

export function ServicosCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicos.map((servico, index) => (
                <Link
                    key={index}
                    href={servico.href}
                    className="group relative flex flex-col p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
                >
                    {/* Subtle primary tint on hover */}
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300" />

                    {/* Top accent line slides in */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />

                    {/* Icon with primary background */}
                    <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all duration-300">
                        {servico.icon}
                    </div>

                    {/* Text */}
                    <h3 className="text-xl font-bold tracking-tight mb-3 text-foreground">
                        {servico.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                        {servico.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 mt-6 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-200">
                        {servico.cta}
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                </Link>
            ))}
        </div>
    )
}
