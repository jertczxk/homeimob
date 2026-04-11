import { create } from 'zustand'

interface AdminState {
  // CRM detail panel
  selectedLeadId: string | null
  detailPanelOpen: boolean
  selectLead: (leadId: string | null) => void
  closeDetailPanel: () => void

  // Sidebar
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedLeadId: null,
  detailPanelOpen: false,
  sidebarOpen: true,

  selectLead: (leadId) =>
    set({ selectedLeadId: leadId, detailPanelOpen: leadId !== null }),

  closeDetailPanel: () =>
    set({ detailPanelOpen: false, selectedLeadId: null }),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
