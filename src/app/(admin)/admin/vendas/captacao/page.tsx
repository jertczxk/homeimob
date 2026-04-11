import { getCaptacoes } from '@/lib/supabase/queries/vendas'
import { CaptacaoClient } from '../_components/CaptacaoClient'

export const revalidate = 0

export default async function CaptacaoPage() {
  const captacoes = await getCaptacoes()
  return <CaptacaoClient captacoes={captacoes} />
}
