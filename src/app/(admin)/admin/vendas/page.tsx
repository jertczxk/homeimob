import { getCaptacoes, getPropostas, getVisitasVendas } from '@/lib/supabase/queries/vendas'
import { cn } from '@/lib/utils'

type StageVenda = 'captacao' | 'avaliacao' | 'autorizacao' | 'visita' | 'proposta' | 'negociacao' | 'fechamento'

const stages: { key: StageVenda; label: string; color: string }[] = [
  { key: 'captacao', label: 'Captação', color: 'bg-zinc-500' },
  { key: 'avaliacao', label: 'Avaliação', color: 'bg-blue-500' },
  { key: 'autorizacao', label: 'Autorização', color: 'bg-indigo-500' },
  { key: 'visita', label: 'Visita', color: 'bg-amber-500' },
  { key: 'proposta', label: 'Proposta', color: 'bg-orange-500' },
  { key: 'negociacao', label: 'Negociação', color: 'bg-rose-500' },
  { key: 'fechamento', label: 'Fechamento', color: 'bg-emerald-500' },
]

export const revalidate = 0

export default async function PipelineVendasPage() {
  const [captacoes, propostas, visitas] = await Promise.all([
    getCaptacoes(),
    getPropostas(),
    getVisitasVendas(),
  ])

  const stageCounts: Record<StageVenda, number> = {
    captacao: captacoes.filter(c => c.status === 'prospectando').length,
    avaliacao: captacoes.filter(c => c.status === 'em_avaliacao').length,
    autorizacao: captacoes.filter(c => c.status === 'autorizado').length,
    visita: visitas.filter(v => v.status === 'agendada').length,
    proposta: propostas.filter(p => p.status === 'aguardando').length,
    negociacao: propostas.filter(p => p.status === 'contraproposta').length,
    fechamento: propostas.filter(p => p.status === 'aceita').length,
  }

  const totalPipeline = propostas.reduce((s, p) => s + p.valor_pedido, 0)
  const totalCount = Object.values(stageCounts).reduce((a, b) => a + b, 0)
  const propostas_ativas = propostas.filter(p => p.status === 'aguardando' || p.status === 'contraproposta').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">VGV no Pipeline</p>
          <p className="text-2xl font-bold text-accent mt-1">
            {totalPipeline > 0 ? `R$ ${(totalPipeline / 1e6).toFixed(1)}M` : '—'}
          </p>
        </div>
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Imóveis Captados</p>
          <p className="text-2xl font-bold text-white mt-1">{captacoes.length}</p>
        </div>
        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Propostas Ativas</p>
          <p className="text-2xl font-bold text-white mt-1">{propostas_ativas}</p>
        </div>
      </div>

      <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Funil de Vendas</h3>
        <div className="flex items-end gap-2 h-32">
          {stages.map(st => {
            const count = stageCounts[st.key]
            const pct = totalCount > 0 ? (count / totalCount) * 100 : 0
            return (
              <div key={st.key} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-white">{count}</span>
                <div className="w-full rounded-t-lg transition-all" style={{ height: `${Math.max(pct * 1.2, 8)}%` }}>
                  <div className={cn('w-full h-full rounded-t-lg opacity-60', st.color)} />
                </div>
                <span className="text-[9px] text-zinc-500 text-center leading-tight">{st.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        {captacoes.slice(0, 5).map(c => {
          const stageMap: Record<string, StageVenda> = {
            prospectando: 'captacao', em_avaliacao: 'avaliacao', autorizado: 'autorizacao', recusado: 'captacao',
          }
          const stage = stages.find(s => s.key === stageMap[c.status]) ?? stages[0]
          return (
            <div key={c.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-accent/15 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn('w-2 h-10 rounded-full', stage.color)} />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{c.tipo} — {c.endereco}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1">
                      <span>Proprietário: {c.proprietario}</span>
                      {c.corretor && <span>Corretor: {c.corretor}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">R$ {c.valor_estimado.toLocaleString('pt-BR')}</p>
                    <p className="text-[10px] text-zinc-600">{new Date(c.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className={cn('text-[10px] font-bold px-2 py-1 rounded-md text-white/80 border border-white/5', stage.color + '/20')}>
                    {stage.label}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
