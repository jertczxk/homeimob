import { getPropostas } from '@/lib/supabase/queries/vendas'
import { PropostasClient } from '../_components/PropostasClient'

export const revalidate = 0

export default async function PropostasPage() {
  const propostas = await getPropostas()
  return <PropostasClient propostas={propostas} />
}
