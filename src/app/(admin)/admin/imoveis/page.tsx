import { getImoveisAdmin } from '@/lib/supabase/queries/imoveis'
import { ImoveisAdminClient } from './_components/ImoveisAdminClient'

export const revalidate = 0

export default async function ImoveisAdminPage() {
  const imoveis = await getImoveisAdmin()
  return <ImoveisAdminClient imoveis={imoveis} />
}
