import { create } from 'zustand'
import { Lead, LeadStage, LeadInteraction } from '@/types'
import { mockLeads, mockInteractions } from '@/lib/mock-admin'

interface AdminState {
    // CRM
    leads: Lead[]
    interactions: LeadInteraction[]
    selectedLeadId: string | null
    detailPanelOpen: boolean

    // Actions
    moveLeadToStage: (leadId: string, stage: LeadStage) => void
    selectLead: (leadId: string | null) => void
    openDetailPanel: () => void
    closeDetailPanel: () => void
    addInteraction: (interaction: LeadInteraction) => void
    updateLead: (leadId: string, data: Partial<Lead>) => void
    addLead: (lead: Lead) => void

    // Sidebar
    sidebarOpen: boolean
    toggleSidebar: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
    leads: mockLeads,
    interactions: mockInteractions,
    selectedLeadId: null,
    detailPanelOpen: false,
    sidebarOpen: true,

    moveLeadToStage: (leadId, stage) =>
        set((state) => ({
            leads: state.leads.map((l) =>
                l.id === leadId ? { ...l, stage, updated_at: new Date().toISOString() } : l
            ),
        })),

    selectLead: (leadId) =>
        set({ selectedLeadId: leadId, detailPanelOpen: leadId !== null }),

    openDetailPanel: () => set({ detailPanelOpen: true }),
    closeDetailPanel: () => set({ detailPanelOpen: false, selectedLeadId: null }),

    addInteraction: (interaction) =>
        set((state) => ({
            interactions: [interaction, ...state.interactions],
        })),

    updateLead: (leadId, data) =>
        set((state) => ({
            leads: state.leads.map((l) =>
                l.id === leadId ? { ...l, ...data, updated_at: new Date().toISOString() } : l
            ),
        })),

    addLead: (lead) =>
        set((state) => ({
            leads: [lead, ...state.leads],
        })),

    toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
