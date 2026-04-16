'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useToastStore } from '@/store/toast-store'
import {
  Building2, User, Mail, Phone, MapPin, Globe, FileText,
  Save, Upload, Trash2, Plus, Edit, Shield, Percent,
  Palette, Bell, Key, ChevronRight,
} from 'lucide-react'

type SettingsTab = 'empresa' | 'corretores' | 'comissoes' | 'notificacoes'

const tabs: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: 'empresa', label: 'Dados da Empresa', icon: Building2 },
  { key: 'corretores', label: 'Corretores', icon: User },
  { key: 'comissoes', label: 'Comissões', icon: Percent },
  { key: 'notificacoes', label: 'Notificações', icon: Bell },
]

const mockCorretores = [
  { id: 'cor1', nome: 'Ana Silva', email: 'ana@home3.com', telefone: '(11) 99999-0001', creci: 'CRECI 12345-SP', status: 'ativo', foto: null },
  { id: 'cor2', nome: 'João Mendes', email: 'joao@home3.com', telefone: '(11) 99999-0002', creci: 'CRECI 54321-SP', status: 'ativo', foto: null },
]

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('empresa')
  const [saving, setSaving] = useState(false)
  const { addToast } = useToastStore()

  // Mock form state
  const [empresa, setEmpresa] = useState({
    nome: 'HOME3 Imobiliária',
    cnpj: '12.345.678/0001-00',
    email: 'contato@home3.com.br',
    telefone: '(11) 3000-0000',
    whatsapp: '(11) 99000-0000',
    endereco: 'Av. Paulista, 1000 — Bela Vista, São Paulo — SP',
    cep: '01310-100',
    site: 'www.home3.com.br',
    creci_j: 'CRECI-J 9876',
  })

  const [comissoes, setComissoes] = useState({
    locacao_admin: 10,
    venda_comissao: 6,
    primeira_locacao: 100,
    renovacao: 50,
  })

  const [notifConfig, setNotifConfig] = useState({
    aluguel_atrasado: true,
    contrato_vencendo: true,
    novo_lead: true,
    nova_proposta: true,
    manutencao_urgente: true,
    dias_antecedencia: 30,
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    addToast('Configurações salvas com sucesso!', 'success')
  }

  return (
    <div className="max-w-[1200px]">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-56 shrink-0 flex items-center lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left whitespace-nowrap lg:w-full',
                  activeTab === tab.key
                    ? 'bg-accent/10 text-accent'
                    : 'text-zinc-500 hover:text-white hover:bg-white/[0.03]'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* ─── EMPRESA ─── */}
          {activeTab === 'empresa' && (
            <>
              <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6 space-y-6">
                <h3 className="text-sm font-semibold text-white">Informações da Imobiliária</h3>

                {/* Logo */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden">
                    <Image src="/logomob.png" alt="Logo" width={60} height={60} className="object-contain" />
                  </div>
                  <div>
                    <button className="flex items-center gap-2 bg-white/5 text-zinc-300 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors border border-white/5">
                      <Upload className="h-4 w-4" />Alterar Logo
                    </button>
                    <p className="text-[10px] text-zinc-600 mt-1">PNG ou SVG, recomendado 200×200px</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Razão Social" value={empresa.nome} onChange={v => setEmpresa({ ...empresa, nome: v })} />
                  <Field label="CNPJ" value={empresa.cnpj} onChange={v => setEmpresa({ ...empresa, cnpj: v })} />
                  <Field label="E-mail" value={empresa.email} onChange={v => setEmpresa({ ...empresa, email: v })} icon={Mail} />
                  <Field label="Telefone" value={empresa.telefone} onChange={v => setEmpresa({ ...empresa, telefone: v })} icon={Phone} />
                  <Field label="WhatsApp" value={empresa.whatsapp} onChange={v => setEmpresa({ ...empresa, whatsapp: v })} icon={Phone} />
                  <Field label="CRECI Jurídico" value={empresa.creci_j} onChange={v => setEmpresa({ ...empresa, creci_j: v })} icon={Shield} />
                  <Field label="Site" value={empresa.site} onChange={v => setEmpresa({ ...empresa, site: v })} icon={Globe} className="sm:col-span-2" />
                  <Field label="Endereço" value={empresa.endereco} onChange={v => setEmpresa({ ...empresa, endereco: v })} icon={MapPin} className="sm:col-span-2" />
                  <Field label="CEP" value={empresa.cep} onChange={v => setEmpresa({ ...empresa, cep: v })} />
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50">
                  <Save className="h-4 w-4" />{saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </>
          )}

          {/* ─── CORRETORES ─── */}
          {activeTab === 'corretores' && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{mockCorretores.length} corretores cadastrados</p>
                <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
                  <Plus className="h-4 w-4" />Novo Corretor
                </button>
              </div>

              <div className="space-y-3">
                {mockCorretores.map(c => (
                  <div key={c.id} className="bg-zinc-800/30 rounded-2xl border border-white/5 p-5 hover:border-accent/15 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-lg">
                          {c.nome.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">{c.nome}</h3>
                          <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1">
                            <span>{c.email}</span>
                            <span>{c.telefone}</span>
                            <span className="text-accent font-medium">{c.creci}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-400 mr-2">Ativo</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"><Edit className="h-4 w-4" /></button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─── COMISSÕES ─── */}
          {activeTab === 'comissoes' && (
            <>
              <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6 space-y-6">
                <h3 className="text-sm font-semibold text-white">Taxas de Administração — Locação</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PercentField label="Taxa de Administração" value={comissoes.locacao_admin} onChange={v => setComissoes({ ...comissoes, locacao_admin: v })} desc="Percentual sobre aluguel mensal" />
                  <PercentField label="Primeira Locação" value={comissoes.primeira_locacao} onChange={v => setComissoes({ ...comissoes, primeira_locacao: v })} desc="% do primeiro aluguel" />
                  <PercentField label="Renovação de Contrato" value={comissoes.renovacao} onChange={v => setComissoes({ ...comissoes, renovacao: v })} desc="% do primeiro aluguel na renovação" />
                </div>
              </div>
              <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6 space-y-6">
                <h3 className="text-sm font-semibold text-white">Comissão — Venda</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PercentField label="Comissão Padrão" value={comissoes.venda_comissao} onChange={v => setComissoes({ ...comissoes, venda_comissao: v })} desc="Percentual sobre valor de venda" />
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50">
                  <Save className="h-4 w-4" />{saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </>
          )}

          {/* ─── NOTIFICAÇÕES ─── */}
          {activeTab === 'notificacoes' && (
            <>
              <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6 space-y-5">
                <h3 className="text-sm font-semibold text-white">Alertas do Sistema</h3>
                <ToggleRow label="Aluguel em atraso" desc="Notificar quando um aluguel estiver vencido" checked={notifConfig.aluguel_atrasado} onChange={v => setNotifConfig({ ...notifConfig, aluguel_atrasado: v })} />
                <ToggleRow label="Contrato próximo do vencimento" desc={`Notificar ${notifConfig.dias_antecedencia} dias antes do término`} checked={notifConfig.contrato_vencendo} onChange={v => setNotifConfig({ ...notifConfig, contrato_vencendo: v })} />
                <ToggleRow label="Novo lead recebido" desc="Notificar quando um novo lead entrar no CRM" checked={notifConfig.novo_lead} onChange={v => setNotifConfig({ ...notifConfig, novo_lead: v })} />
                <ToggleRow label="Nova proposta" desc="Notificar quando uma proposta for recebida" checked={notifConfig.nova_proposta} onChange={v => setNotifConfig({ ...notifConfig, nova_proposta: v })} />
                <ToggleRow label="Manutenção urgente" desc="Notificar solicitações de manutenção urgente" checked={notifConfig.manutencao_urgente} onChange={v => setNotifConfig({ ...notifConfig, manutencao_urgente: v })} />
              </div>
              <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Antecedência</h3>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-zinc-400">Antecipar alertas de contrato em</label>
                  <input
                    type="number"
                    value={notifConfig.dias_antecedencia}
                    onChange={e => setNotifConfig({ ...notifConfig, dias_antecedencia: Number(e.target.value) })}
                    className="w-20 bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white text-center outline-none focus:border-accent/30"
                  />
                  <span className="text-sm text-zinc-400">dias</span>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50">
                  <Save className="h-4 w-4" />{saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Reusable Field Components ─────────────────────────────
function Field({ label, value, onChange, icon: Icon, className }: { label: string; value: string; onChange: (v: string) => void; icon?: React.ElementType; className?: string }) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">{label}</label>
      <div className="flex items-center gap-2 bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-2.5 focus-within:border-accent/30 transition-colors">
        {Icon && <Icon className="h-4 w-4 text-zinc-600 shrink-0" />}
        <input value={value} onChange={e => onChange(e.target.value)} className="bg-transparent outline-none text-sm text-white w-full placeholder:text-zinc-600" />
      </div>
    </div>
  )
}

function PercentField({ label, value, onChange, desc }: { label: string; value: number; onChange: (v: number) => void; desc: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">{label}</label>
      <div className="flex items-center gap-2 bg-zinc-800/50 border border-white/5 rounded-lg px-3 py-2.5 focus-within:border-accent/30 transition-colors">
        <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} className="bg-transparent outline-none text-sm text-white w-full" />
        <span className="text-sm text-zinc-500 font-bold">%</span>
      </div>
      <p className="text-[10px] text-zinc-600">{desc}</p>
    </div>
  )
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-[11px] text-zinc-500">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn('w-11 h-6 rounded-full transition-colors relative', checked ? 'bg-accent' : 'bg-zinc-700')}
      >
        <div className={cn('w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform', checked ? 'translate-x-5.5 left-0.5' : 'left-0.5')} style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
      </button>
    </div>
  )
}
