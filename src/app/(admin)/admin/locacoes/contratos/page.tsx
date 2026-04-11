import { getContratos } from '@/lib/supabase/queries/locacoes'
import { ContratosClient } from '../_components/ContratosClient'

export const revalidate = 0

export default async function ContratosPage() {
  const contratos = await getContratos()
  return <ContratosClient contratos={contratos} />
}
