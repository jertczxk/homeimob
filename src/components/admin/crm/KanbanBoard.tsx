'use client'

import { LeadStage, Lead, LeadPriority } from '@/types'
import { useAdminStore } from '@/store/admin-store'
import { cn } from '@/lib/utils'
import { Phone, Mail, GripVertical, MoreHorizontal, Calendar, Tag } from 'lucide-react'
import { useState, DragEvent } from 'react'

// ─── Stage Config ────────────────────────────────────────

const stageConfig: Record<LeadStage, { label: string; color: string; bg: string; border: string }> = {
    lead: { label: 'Lead', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    atendimento: { label: 'Atendimento', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    visita: { label: 'Visita', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    proposta: { label: 'Proposta', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    negociacao: { label: 'Negociação', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    fechamento: { label: 'Fechamento', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
}

const priorityConfig: Record<LeadPriority, { label: string; color: string }> = {
    alta: { label: 'Alta', color: 'bg-red-500/20 text-red-400' },
    media: { label: 'Média', color: 'bg-amber-500/20 text-amber-400' },
    baixa: { label: 'Baixa', color: 'bg-zinc-500/20 text-zinc-400' },
}

// ─── Kanban Card ─────────────────────────────────────────

function KanbanCard({ lead }: { lead: Lead }) {
    const { selectLead } = useAdminStore()

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', lead.id)
        e.dataTransfer.effectAllowed = 'move'
        const el = e.currentTarget
        el.style.opacity = '0.5'
        setTimeout(() => { el.style.opacity = '1' }, 0)
    }

    const timeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        if (days === 0) return 'Hoje'
        if (days === 1) return 'Ontem'
        return `${days}d atrás`
    }

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onClick={() => selectLead(lead.id)}
            className="bg-zinc-800/80 rounded-xl border border-white/5 p-3.5 cursor-pointer hover:border-accent/20 hover:bg-zinc-800 transition-all duration-200 group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                    <GripVertical className="h-3.5 w-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />
                    <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-accent">
                            {lead.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-white truncate">{lead.nome}</p>
                </div>
                <button className="w-6 h-6 flex items-center justify-center rounded text-zinc-600 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Info */}
            <div className="space-y-1.5 ml-[38px]">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', priorityConfig[lead.prioridade].color)}>
                        {priorityConfig[lead.prioridade].label}
                    </span>
                    <span className="text-[10px] text-zinc-500 capitalize">
                        {lead.interesse}
                    </span>
                </div>

                {lead.bairroInteresse && (
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <Tag className="h-3 w-3" />
                        <span>{lead.bairroInteresse}</span>
                        {lead.valorMax && (
                            <span>· até R$ {(lead.valorMax / 1000).toFixed(0)}k</span>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {timeAgo(lead.updated_at)}
                    </span>
                    {lead.corretor && (
                        <span>· {lead.corretor}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Kanban Column ───────────────────────────────────────

function KanbanColumn({ stage, leads }: { stage: LeadStage; leads: Lead[] }) {
    const { moveLeadToStage } = useAdminStore()
    const [isDragOver, setIsDragOver] = useState(false)
    const config = stageConfig[stage]

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setIsDragOver(true)
    }

    const handleDragLeave = () => setIsDragOver(false)

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(false)
        const leadId = e.dataTransfer.getData('text/plain')
        if (leadId) {
            moveLeadToStage(leadId, stage)
        }
    }

    return (
        <div
            className={cn(
                'flex flex-col bg-zinc-900/50 rounded-2xl border transition-colors min-w-[300px] w-[300px] shrink-0 min-h-full',
                isDragOver ? `${config.border} bg-white/[0.02]` : 'border-white/5'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Column Header */}
            <div className={cn('flex items-center justify-between px-4 py-4 border-b border-white/5 sticky top-0 bg-zinc-900/80 backdrop-blur-sm rounded-t-2xl z-10')}>
                <div className="flex items-center gap-2">
                    <div className={cn('w-2.5 h-2.5 rounded-full shadow-sm', config.bg, config.color.replace('text-', 'bg-'))} />
                    <span className={cn('text-xs font-bold uppercase tracking-wider', config.color)}>{config.label}</span>
                </div>
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border border-current', config.bg, config.color)}>
                    {leads.length}
                </span>
            </div>

            {/* Cards */}
            <div className="flex-1 p-3 space-y-3 pb-6">
                {leads.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-[10px] uppercase font-bold tracking-widest text-zinc-600 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                        Arraste um card aqui
                    </div>
                ) : (
                    leads.map(lead => <KanbanCard key={lead.id} lead={lead} />)
                )}
            </div>
        </div>
    )
}

// ─── Lead Detail Panel ───────────────────────────────────

function LeadDetailPanel() {
    const { leads, interactions, selectedLeadId, closeDetailPanel, detailPanelOpen } = useAdminStore()
    const lead = leads.find(l => l.id === selectedLeadId)
    const leadInteractions = interactions.filter(i => i.lead_id === selectedLeadId)

    if (!detailPanelOpen || !lead) return null

    const interactionIcons: Record<string, React.ElementType> = {
        ligacao: Phone,
        whatsapp: Phone,
        email: Mail,
        visita: Calendar,
        proposta: Tag,
        nota: Tag,
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={closeDetailPanel}
            />
            {/* Panel */}
            <div className="fixed top-0 right-0 w-full max-w-md h-screen bg-zinc-900 border-l border-white/5 z-50 overflow-y-auto animate-in slide-in-from-right-8">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">{lead.nome}</h3>
                            <p className="text-sm text-zinc-500 mt-0.5">{lead.telefone}</p>
                            {lead.email && <p className="text-sm text-zinc-500">{lead.email}</p>}
                        </div>
                        <button
                            onClick={closeDetailPanel}
                            className="text-zinc-500 hover:text-white transition-colors text-xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Stage Badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg', stageConfig[lead.stage].bg, stageConfig[lead.stage].color)}>
                            {stageConfig[lead.stage].label}
                        </span>
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', priorityConfig[lead.prioridade].color)}>
                            {priorityConfig[lead.prioridade].label}
                        </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 bg-zinc-800/50 rounded-xl p-4 border border-white/5 mb-6">
                        <Detail label="Interesse" value={`${lead.interesse} · ${lead.tipoInteresse || '—'}`} />
                        <Detail label="Bairro" value={lead.bairroInteresse || '—'} />
                        <Detail label="Faixa de Valor" value={
                            lead.valorMin && lead.valorMax
                                ? `R$ ${(lead.valorMin / 1000).toFixed(0)}k — R$ ${(lead.valorMax / 1000).toFixed(0)}k`
                                : '—'
                        } />
                        <Detail label="Origem" value={lead.origem} />
                        <Detail label="Corretor" value={lead.corretor || 'Não atribuído'} />
                        {lead.notas && <Detail label="Notas" value={lead.notas} />}
                    </div>

                    {/* Timeline */}
                    <div>
                        <p className="text-sm font-semibold text-white mb-4">Histórico</p>
                        <div className="space-y-4">
                            {leadInteractions.length === 0 ? (
                                <p className="text-xs text-zinc-600">Nenhuma interação registrada.</p>
                            ) : (
                                leadInteractions.map((interaction) => {
                                    const Icon = interactionIcons[interaction.tipo] || Tag
                                    return (
                                        <div key={interaction.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                    <Icon className="h-3.5 w-3.5 text-zinc-500" />
                                                </div>
                                                <div className="w-px flex-1 bg-white/5 mt-1" />
                                            </div>
                                            <div className="pb-4">
                                                <p className="text-sm text-zinc-300">{interaction.descricao}</p>
                                                <p className="text-[10px] text-zinc-600 mt-1">
                                                    {new Date(interaction.created_at).toLocaleString('pt-BR', {
                                                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-2">
                        <button className="flex-1 bg-accent text-accent-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
                            Registrar Contato
                        </button>
                        <button className="flex-1 bg-white/5 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors border border-white/5">
                            Agendar Visita
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-start gap-4">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider shrink-0">{label}</span>
            <span className="text-sm text-zinc-300 text-right capitalize">{value}</span>
        </div>
    )
}

// ─── Kanban Board (main) ─────────────────────────────────

export function KanbanBoard() {
    const { leads } = useAdminStore()
    const stages: LeadStage[] = ['lead', 'atendimento', 'visita', 'proposta', 'negociacao', 'fechamento']

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0 pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="flex gap-6 h-full items-start">
                    {stages.map(stage => (
                        <KanbanColumn
                            key={stage}
                            stage={stage}
                            leads={leads.filter(l => l.stage === stage)}
                        />
                    ))}
                </div>
            </div>
            <LeadDetailPanel />
        </div>
    )
}
