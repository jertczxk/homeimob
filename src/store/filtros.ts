import { create } from 'zustand'
import { FinalidadeImovel, TipoImovel } from '@/types'

export interface FiltrosState {
    filtros: {
        finalidade?: string;
        tipo?: string;
        bairro?: string;
        precoMin?: number;
        precoMax?: number;
        quartos?: number;
        vagas?: number;
        cidade?: string;
        condominio?: string;
    }
    setFiltros: (filtros: Partial<FiltrosState['filtros']>) => void
    resetFiltros: () => void
}

export const useFiltrosStore = create<FiltrosState>((set) => ({
    filtros: {},
    setFiltros: (novosFiltros) =>
        set((state) => ({
            filtros: { ...state.filtros, ...novosFiltros }
        })),
    resetFiltros: () => set({ filtros: {} }),
}))
