import { getDashboardStats, getAtividades } from '@/lib/supabase/queries/dashboard'
import { getLeads } from '@/lib/supabase/queries/leads'
import { DashboardClient } from './_components/DashboardClient'

export const revalidate = 0

export default async function AdminDashboard() {
  const [stats, atividades, leads] = await Promise.all([
    getDashboardStats(),
    getAtividades(),
    getLeads(),
  ])

  return <DashboardClient stats={stats} atividades={atividades} leads={leads} />
}
