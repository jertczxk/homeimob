import { getManutencoes } from '@/lib/supabase/queries/locacoes'
import { ManutencoesClient } from '../_components/ManutencoesClient'

export const revalidate = 0

export default async function ManutencoesPage() {
  const manutencoes = await getManutencoes()
  return <ManutencoesClient manutencoes={manutencoes} />
}
