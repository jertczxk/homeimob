"use client"

import Image from "next/image"
import { Home } from "lucide-react"

export function PropertyPlaceholder() {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#051124] overflow-hidden">
            {/* Background Architectural Influence */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none flex items-center justify-center scale-150 rotate-12">
                <div className="w-full h-full border border-zinc-200/50" />
                <div className="absolute top-0 left-0 w-full h-px bg-zinc-200/50" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-200/50" />
                <div className="absolute left-1/4 h-full w-px bg-zinc-200/50" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-4">
                {/* Brand Logo (Gold Filtered) */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="relative w-40 h-16 grayscale invert brightness-[0.7] sepia-[1] hue-rotate-[5deg] saturate-[1.5]">
                        <Image
                            src="/logoimob.svg"
                            alt="HOME Imob"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent mt-4" />
                </div>

                {/* Premium Typography */}
                <div className="space-y-1">
                    <p className="text-[10px] tracking-[0.3em] font-medium text-[#C5A059]/80 uppercase">
                        Esse Imóvel
                    </p>
                    <h4 className="text-xl md:text-2xl font-serif text-[#C5A059] leading-tight uppercase tracking-widest px-2">
                        Não Possui
                    </h4>
                    <p className="text-[14px] tracking-[0.4em] font-medium text-[#C5A059]/90 uppercase mt-1">
                        Fotos
                    </p>
                </div>

                {/* Small detail separator */}
                <div className="mt-8 flex items-center gap-3">
                    <div className="w-8 h-[0.5px] bg-[#C5A059]/30" />
                    <Home className="h-3 w-3 text-[#C5A059]/60" />
                    <div className="w-8 h-[0.5px] bg-[#C5A059]/30" />
                </div>
            </div>

            {/* Frame effect */}
            <div className="absolute inset-4 border border-[#C5A059]/20 pointer-events-none" />
        </div>
    )
}
