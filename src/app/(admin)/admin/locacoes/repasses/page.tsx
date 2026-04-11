import { getRepasses } from '@/lib/supabase/queries/locacoes'
import { RepassesClient } from '../_components/RepassesClient'

export const revalidate = 0

export default async function RepassesPage() {
  const repasses = await getRepasses()
  return <RepassesClient repasses={repasses} />
}
