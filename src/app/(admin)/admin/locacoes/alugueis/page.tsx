import { getPagamentos } from '@/lib/supabase/queries/locacoes'
import { AlugueisClient } from '../_components/AlugueisClient'

export const revalidate = 0

export default async function AlugueisPage() {
  const pagamentos = await getPagamentos()
  return <AlugueisClient pagamentos={pagamentos} />
}
