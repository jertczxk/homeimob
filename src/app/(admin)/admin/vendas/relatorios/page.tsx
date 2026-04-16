import { getVendasRelatorio } from '@/lib/supabase/queries/vendas'
import { RelatoriosClient } from './_components/RelatoriosClient'

export const revalidate = 0

export default async function RelatoriosPage() {
    const data = await getVendasRelatorio()

    return <RelatoriosClient data={data} />
}
