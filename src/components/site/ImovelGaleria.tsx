'use client'

import { useState } from 'react'
import Image from 'next/image'
import LightGallery from 'lightgallery/react'

// import styles
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'

import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'

import { ImovelFoto } from '@/types'

interface ImovelGaleriaProps {
  fotos: ImovelFoto[]
  titulo: string
}

export function ImovelGaleria({ fotos, titulo }: ImovelGaleriaProps) {
  if (!fotos || fotos.length === 0) {
    return (
      <div className="w-full aspect-video bg-muted rounded-xl flex items-center justify-center border-dashed border-2">
        <span className="text-muted-foreground">Nenhuma foto disponível</span>
      </div>
    )
  }

  const thumbUrl = fotos[0]?.url

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] md:h-[500px]">
        {/* Foto Principal */}
        <div className="relative rounded-xl overflow-hidden cursor-pointer w-full h-full">
          <LightGallery
            speed={500}
            plugins={[lgThumbnail, lgZoom]}
            elementClassNames="w-full h-full block"
          >
            {fotos.map((foto, index) => (
              <a
                key={foto.id}
                href={foto.url}
                className={`block w-full h-full ${index !== 0 ? 'hidden' : ''}`}
              >
                <Image
                  src={foto.url}
                  alt={`${titulo} - Foto ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </a>
            ))}
          </LightGallery>
        </div>

        {/* Mais Fotos Grid (Oculto no mobile) */}
        <div className="hidden md:grid grid-cols-2 gap-4">
          {fotos.slice(1, 5).map((foto, index) => (
            <div key={foto.id} className="relative rounded-xl overflow-hidden group">
              <Image
                src={foto.url}
                alt={`${titulo} - Miniatura ${index + 2}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
              {/* Click no grid também deve abrir galeria? Faremos uma overlay simples aqui só para demo */}
              {index === 3 && fotos.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                  <span className="text-white font-semibold text-lg">+{fotos.length - 5}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
