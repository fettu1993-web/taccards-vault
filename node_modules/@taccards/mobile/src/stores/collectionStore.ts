import { create } from 'zustand'
import { api } from '../lib/api'

export interface UserCard {
  id: string
  cardId: string
  condition: string
  gradeCompany?: string
  gradeValue?: string
  certNumber?: string
  purchasePrice?: number
  purchaseDate?: string
  purchasePlatform?: string
  status: 'in_collection' | 'for_sale' | 'sold' | 'wishlist'
  notes?: string
  card: {
    id: string
    name: string
    playerName?: string
    sport: string
    setName: string
    year: number
    parallel?: string
    isRookie: boolean
    isAutograph: boolean
    imageUrl?: string
    priceHistory: Array<{ price: number; saleDate: string }>
  }
}

export interface CollectionSummary {
  totalCards: number
  totalValue: string
  totalCost: string
  roi: string
}

interface CollectionState {
  cards: UserCard[]
  summary: CollectionSummary | null
  loading: boolean
  fetchCollection: (filters?: { status?: string; sport?: string }) => Promise<void>
  addCard: (data: {
    cardId: string
    condition?: string
    gradeCompany?: string
    gradeValue?: string
    certNumber?: string
    purchasePrice?: number
    purchaseDate?: string
    purchasePlatform?: string
    status?: string
    notes?: string
  }) => Promise<void>
  removeCard: (id: string) => Promise<void>
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  cards: [],
  summary: null,
  loading: false,

  fetchCollection: async (filters = {}) => {
    set({ loading: true })
    try {
      const res = await api.get('/collection', { params: filters })
      set({ cards: res.data.data, summary: res.data.summary, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  addCard: async (data) => {
    const res = await api.post('/collection', data)
    set((state) => ({ cards: [res.data, ...state.cards] }))
  },

  removeCard: async (id) => {
    await api.delete(`/collection/${id}`)
    set((state) => ({ cards: state.cards.filter((c) => c.id !== id) }))
  },
}))
