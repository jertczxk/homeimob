import { getVistorias } from '@/lib/supabase/queries/locacoes'
import { VistoriasClient } from '../_components/VistoriasClient'

export const revalidate = 0

export default async function VistoriasPage() {
  const vistorias = await getVistorias()
  return <VistoriasClient vistorias={vistorias} />
}
