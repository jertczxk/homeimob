'use client'

import Link from 'next/link'
import {
  Building2, Users, TrendingUp, HandCoins, ArrowUpRight, ArrowDownRight,
  Kanban, Plus, Eye, FileText, CreditCard, Calendar,
} from 'lucide-react'
import { mockAtividades, mockReceitaMensal, mockLeads } from '@/lib/mock-admin'
import { LeadStage } from '@/types'

const stageLabels: Record<LeadStage, string> = {
  lead: 'Lead',
  atendimento: 'Atendimento',
  visita: 'Visita',
  proposta: 'Proposta',
  negociacao: 'Negociação',
  fechamento: 'Fechamento',
}

const stageColors: Record<LeadStage, string> = {
  lead: 'bg-blue-500/20 text-blue-400',
  atendimento: 'bg-purple-500/20 text-purple-400',
  visita: 'bg-amber-500/20 text-amber-400',
  proposta: 'bg-cyan-500/20 text-cyan-400',
  negociacao: 'bg-orange-500/20 text-orange-400',
  fechamento: 'bg-emerald-500/20 text-emerald-400',
}

const atividadeIcons: Record<string, React.ElementType> = {
  lead: Users,
  visita: Eye,
  pagamento: CreditCard,
  contrato: FileText,
  imovel: Building2,
}

function KPICard({ label, value, change, icon: Icon }: {
  label: string; value: string; change: number; icon: React.ElementType
}) {
  const positive = change >= 0
  return (
    <div className="bg-zinc-800/50 rounded-2xl border border-white/5 p-5 hover:border-accent/20 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
    </div>
  )
}

function MiniChart({ data }: { data: { mes: string; valor: number }[] }) {
  const max = Math.max(...data.map(d => d.valor))
  return (
    <div className="bg-zinc-800/50 rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-white">Receita Mensal</p>
          <p className="text-xs text-zinc-500 mt-0.5">Últimos 6 meses</p>
        </div>
        <p className="text-lg font-bold text-accent">
          R$ {(data[data.length - 1].valor / 1000).toFixed(0)}k
        </p>
      </div>
      <div className="flex items-end gap-2 h-32">
        {data.map((item, i) => {
          const height = (item.valor / max) * 100
          const isLast = i === data.length - 1
          return (
            <div key={item.mes} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative group">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${isLast ? 'bg-accent' : 'bg-white/10 group-hover:bg-white/20'}`}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  R$ {(item.valor / 1000).toFixed(0)}k
                </div>
              </div>
              <span className="text-[10px] text-zinc-500">{item.mes}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MiniPipeline() {
  const stages: LeadStage[] = ['lead', 'atendimento', 'visita', 'proposta', 'negociacao', 'fechamento']
  const counts = stages.map(s => ({
    stage: s,
    count: mockLeads.filter(l => l.stage === s).length,
  }))

  return (
    <div className="bg-zinc-800/50 rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-white">Pipeline CRM</p>
          <p className="text-xs text-zinc-500 mt-0.5">{mockLeads.length} leads ativos</p>
        </div>
        <Link href="/admin/crm" className="text-xs text-accent hover:text-accent/80 flex items-center gap-1 transition-colors">
          Ver tudo <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-2.5">
        {counts.map(({ stage, count }) => (
          <div key={stage} className="flex items-center gap-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${stageColors[stage]}`}>
              {stageLabels[stage]}
            </span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-accent/60 transition-all duration-700"
                style={{ width: `${(count / mockLeads.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-zinc-400 w-5 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentActivity() {
  return (
    <div className="bg-zinc-800/50 rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-white">Atividades Recentes</p>
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Hoje</span>
      </div>
      <div className="space-y-4">
        {mockAtividades.slice(0, 5).map((atividade) => {
          const Icon = atividadeIcons[atividade.tipo] || Calendar
          return (
            <div key={atividade.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                <Icon className="h-4 w-4 text-zinc-500 group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300 truncate">{atividade.descricao}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">
                  {new Date(atividade.created_at).toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Bom dia, João! 👋</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Aqui está o resumo do seu dia.</p>
        </div>
        <Link
          href="/admin/crm"
          className="hidden md:flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Lead
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Building2} label="Imóveis Ativos" value="127" change={12} />
        <KPICard icon={HandCoins} label="Aluguéis a Vencer" value="8" change={-5} />
        <KPICard icon={Users} label="Leads Novos (mês)" value="34" change={22} />
        <KPICard icon={TrendingUp} label="Taxa de Conversão" value="18%" change={3} />
      </div>

      {/* Charts + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MiniChart data={mockReceitaMensal} />
        <MiniPipeline />
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivity />
        <div className="bg-zinc-800/50 rounded-2xl border border-white/5 p-5">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-white">Próximos Compromissos</p>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Esta semana</span>
          </div>
          <div className="space-y-3">
            {[
              { time: '14:00', desc: 'Visita — Apt Jardins com Carlos', date: 'Hoje' },
              { time: '10:30', desc: 'Reunião — Proposta Leblon', date: 'Amanhã' },
              { time: '16:00', desc: 'Vistoria — Casa Moema', date: 'Qua, 19' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/[0.02] rounded-xl px-4 py-3 border border-white/5">
                <div className="text-center shrink-0">
                  <p className="text-xs text-zinc-500">{item.date}</p>
                  <p className="text-sm font-bold text-accent">{item.time}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <p className="text-sm text-zinc-300 truncate">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
