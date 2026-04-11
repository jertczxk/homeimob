'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ImovelFoto } from '@/types'
import { addFotoImovel, deleteFotoImovel } from '@/app/(admin)/admin/imoveis/actions'

interface UploadFotosProps {
  imovelId: string
  fotos: ImovelFoto[]
}

export function UploadFotos({ imovelId, fotos }: UploadFotosProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    const supabase = createClient()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.split('.').pop()
      const path = `${imovelId}/${Date.now()}_${i}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('imoveis')
        .upload(path, file, { upsert: false })

      if (uploadError) {
        console.error('Upload error:', uploadError.message)
        continue
      }

      const { data } = supabase.storage.from('imoveis').getPublicUrl(path)
      const ordem = fotos.length + i

      await new Promise<void>((resolve) => {
        startTransition(async () => {
          await addFotoImovel(imovelId, data.publicUrl, ordem)
          resolve()
        })
      })
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleDelete(foto: ImovelFoto) {
    if (!confirm('Remover esta foto?')) return
    startTransition(() => deleteFotoImovel(foto.id, imovelId))
  }

  const busy = uploading || isPending

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {fotos.map((foto, i) => (
          <div key={foto.id} className="aspect-square rounded-xl overflow-hidden relative group border border-white/5">
            <Image src={foto.url} alt={`Foto ${i + 1}`} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
            <button
              onClick={() => handleDelete(foto)}
              disabled={busy}
              className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80 disabled:opacity-40"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <span className="absolute bottom-2 left-2 text-[10px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">#{i + 1}</span>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-accent/30 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
          <span className="text-xs font-medium">{busy ? 'Enviando...' : 'Adicionar'}</span>
        </button>
      </div>

      <p className="text-[10px] text-zinc-600">
        {fotos.length === 0 ? 'Nenhuma foto cadastrada.' : `${fotos.length} foto${fotos.length !== 1 ? 's' : ''}. Primeira foto será a capa.`}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}
