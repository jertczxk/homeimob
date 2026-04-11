import { getClientes } from '@/lib/supabase/queries/clientes'
import { ClientesAdminClient } from './_components/ClientesAdminClient'

export const revalidate = 0

export default async function ClientesPage() {
  const clientes = await getClientes()
  return <ClientesAdminClient clientes={clientes} />
}
