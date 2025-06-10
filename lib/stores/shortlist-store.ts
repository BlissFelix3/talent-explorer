import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Candidate {
  id: string
  name: string
  headline: string
  avatar: string
  skills: string[]
  strengths: string[]
  compensation: {
    min: number
    max: number
    currency: string
  }
  location: string
  experience: string
  note?: string
  username?: string
  publicId?: string
  bio?: string
  completion?: number
  verified?: boolean
  links?: Array<{
    id: string
    name: string
    address: string
  }>
  languages?: Array<{
    language: string
    fluency: string
  }>
  torreData?: any // Store original Torre data for detailed views
}

interface ShortlistState {
  candidates: Candidate[]
  selectedForComparison: string[]
  addCandidate: (candidate: Candidate) => void
  removeCandidate: (id: string) => void
  updateNote: (id: string, note: string) => void
  toggleComparison: (id: string) => void
  clearComparison: () => void
}

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      candidates: [],
      selectedForComparison: [],
      addCandidate: (candidate) =>
        set((state) => ({
          candidates: state.candidates.find((c) => c.id === candidate.id)
            ? state.candidates
            : [...state.candidates, candidate],
        })),
      removeCandidate: (id) =>
        set((state) => ({
          candidates: state.candidates.filter((c) => c.id !== id),
          selectedForComparison: state.selectedForComparison.filter((cId) => cId !== id),
        })),
      updateNote: (id, note) =>
        set((state) => ({
          candidates: state.candidates.map((c) => (c.id === id ? { ...c, note } : c)),
        })),
      toggleComparison: (id) =>
        set((state) => ({
          selectedForComparison: state.selectedForComparison.includes(id)
            ? state.selectedForComparison.filter((cId) => cId !== id)
            : state.selectedForComparison.length < 3
              ? [...state.selectedForComparison, id]
              : state.selectedForComparison,
        })),
      clearComparison: () => set({ selectedForComparison: [] }),
    }),
    {
      name: "shortlist-storage",
    },
  ),
)
