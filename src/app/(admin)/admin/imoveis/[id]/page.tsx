import { notFound } from 'next/navigation'
import { getImovelById } from '@/lib/supabase/queries/imoveis'
import { ImovelDetailClient } from '../_components/ImovelDetailClient'

export const revalidate = 0

export default async function ImovelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const imovel = await getImovelById(id)

  if (!imovel) notFound()

  return <ImovelDetailClient imovel={imovel} />
}
