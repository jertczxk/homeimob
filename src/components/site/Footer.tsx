'use client'

import { Mail, ArrowRight, Instagram, Facebook, Linkedin, Youtube, MapPin, Phone, Building2 } from 'lucide-react'
import Link from 'next/link'
import { IndicesEconomicos } from './IndicesEconomicos'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="bg-primary text-white overflow-hidden relative">
      {/* Economic Indices Bar */}
      <div className="bg-zinc-950/20 border-b border-white/5 backdrop-blur-sm">
        <IndicesEconomicos />
      </div>

      <div className="container px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand & About */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="group w-fit block">
              <img
                src="/logoimob.svg"
                alt="Imobiliária Concept"
                className="h-12 w-auto transition-opacity hover:opacity-80"
              />
            </Link>

            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Ajudamos pessoas a encontrar o imóvel certo, com honestidade e sem enrolação.
            </p>

            <div className="flex items-center gap-4">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Youtube, href: '#' },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Navegação</h3>
            <ul className="space-y-4">
              {[
                { label: 'Todos os Imóveis', href: '/imoveis' },
                { label: 'Lançamentos', href: '/imoveis?status=lancamento' },
                { label: 'Venda', href: '/imoveis?finalidade=venda' },
                { label: 'Locação', href: '/imoveis?finalidade=locação' },
                { label: 'Quem Somos', href: '/quem-somos' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-accent mr-0 group-hover:mr-2 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-white/60">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm leading-relaxed">
                  Rua das Américas, 1200 - Centro<br />
                  Balneário Camboriú, SC
                </span>
              </li>
              <li className="flex items-center gap-4 text-white/60">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm">+55 (47) 3333-3333</span>
              </li>
              <li className="flex items-center gap-4 text-white/60">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm">contato@imobiliaria.com.br</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Newsletter</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Fique por dentro dos novos imóveis e das melhores oportunidades.
            </p>
            <div className="space-y-3">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all pl-11"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-accent transition-colors" />
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl h-11">
                Inscrever-se
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Imobiliária Concept. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacidade" className="text-white/40 hover:text-white text-xs transition-colors">Privacidade</Link>
            <Link href="/termos" className="text-white/40 hover:text-white text-xs transition-colors">Termos de Uso</Link>
            <Link href="/cookies" className="text-white/40 hover:text-white text-xs transition-colors">Cookies</Link>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-48 -mb-48 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/50 rounded-full blur-[100px] -ml-24 -mt-24 pointer-events-none" />
    </footer>
  )
}
