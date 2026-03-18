'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Search, Menu, X, Phone, ArrowUpRight, ChevronDown, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function LanguageSelector({ isMobile }: { isMobile?: boolean }) {
  const [lang, setLang] = useState('PT')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white",
          isMobile && "w-full justify-between h-14 rounded-2xl px-6 bg-white/5 border-white/10"
        )}
      >
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest">{lang}</span>
        </div>
        <ChevronDown className={cn("h-3 w-3 transition-transform opacity-50", open && "rotate-180")} />
      </button>

      {open && (
        <div className={cn(
          "absolute top-full right-0 mt-2 w-40 bg-[#121214] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[100] p-1.5 animate-in fade-in zoom-in-95",
          isMobile && "bottom-full top-auto mb-2 right-0 left-0 w-full"
        )}>
          {[
            { id: 'PT', label: 'Português', sub: 'Brasil' },
            { id: 'EN', label: 'English', sub: 'US' }
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setLang(l.id)
                setOpen(false)
              }}
              className={cn(
                "w-full px-4 py-3 rounded-xl text-left transition-all flex items-center justify-between group",
                lang === l.id ? "bg-accent/10 text-accent" : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold">{l.label}</span>
                <span className="text-[9px] uppercase tracking-tighter opacity-50">{l.sub}</span>
              </div>
              {lang === l.id && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const menuLinks = [
    { label: 'Destaques', href: '/imoveis?status=exclusivo' },
    { label: 'Lançamentos', href: '/imoveis?status=lancamento' },
    { label: 'Comprar', href: '/imoveis?finalidade=venda' },
    { label: 'Alugar', href: '/imoveis?finalidade=locação' },
    { label: 'Blog', href: '/blog' },
  ]

  const isSolid = scrolled || !isHome || isMenuOpen

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b",
          isSolid
            ? "bg-zinc-950/90 backdrop-blur-xl border-white/5 py-4 shadow-2xl"
            : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="container flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center group relative z-[60]">
            <img
              src="/logoimob.svg"
              alt="Imobiliária Concept"
              className={cn(
                "transition-all duration-300 group-hover:scale-105",
                isSolid ? "h-8 md:h-9" : "h-10 md:h-12"
              )}
            />
          </Link>

          {/* NAVIGATION PILL (Desktop) */}
          <nav className={cn(
            "hidden lg:flex items-center space-x-1 px-4 py-1.5 rounded-full border transition-all duration-500",
            isSolid
              ? "bg-white/5 border-white/5"
              : "bg-white/10 border-white/10 backdrop-blur-xl shadow-lg"
          )}>
            {menuLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 relative z-[60]">
            <LanguageSelector />

            <div className="hidden md:flex items-center gap-2 xl:gap-3 pl-2 group cursor-pointer text-white">
              <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                <Phone className="h-4 w-4" />
              </div>
              <span className="text-xs xl:text-sm font-bold tracking-tight">+55 (47) 99999-9999</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:bg-white/10 rounded-full h-10 w-10 border border-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU SYSTEM - SEPARATE STACKING CONTEXT */}
      <aside
        className={cn(
          "fixed inset-0 z-[999] lg:hidden transition-all duration-300",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop (Darkened Blur Overlay) */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Panel (Solid Off-canvas Drawer) */}
        <nav
          className={cn(
            "absolute top-0 right-0 w-[280px] sm:w-[320px] h-full bg-[#0a0a0b] border-l border-white/10 shadow-3xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col pt-32 px-8 pb-10 transform",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Internal Close Button */}
          <div className="absolute top-6 right-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:bg-white/10 rounded-full h-10 w-10 border border-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Section Header */}
          <div className="mb-8 pl-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-zinc-500">
              Menu Principal
            </span>
          </div>

          {/* Navigation Items (Left Aligned) */}
          <div className="flex flex-col space-y-6 flex-1 items-start">
            {menuLinks.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  transitionDelay: isMenuOpen ? `${100 + i * 50}ms` : '0ms'
                }}
                className={cn(
                  "text-2xl font-serif font-bold text-white hover:text-accent transition-all duration-300 transform text-left w-full",
                  isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Footer Info & CTA */}
          <div className="mt-auto space-y-8">
            <div className="w-10 h-px bg-accent/40" />

            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600">Contato</p>
              <a href="tel:+5547999999999" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-accent transition-all">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">+55 (47) 99999-9999</span>
                  <span className="text-[10px] text-zinc-500 font-medium">WhatsApp Online</span>
                </div>
              </a>
            </div>

            <div className="pt-4">
              <LanguageSelector isMobile />
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
