import { getVisitasVendas } from '@/lib/supabase/queries/vendas'
import { VisitasVendasClient } from '../_components/VisitasVendasClient'

export const revalidate = 0

export default async function VisitasVendasPage() {
  const visitas = await getVisitasVendas()
  return <VisitasVendasClient visitas={visitas} />
}
