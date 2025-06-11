import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Candidate {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  skills: string[];
  strengths: string[];
  compensation: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  experience: string;
  note?: string;
}

export interface TalentedUser {
  ggId: string;
  ardaId: number;
  name: string;
  professionalHeadline: string;
  picture?: string;
  pictureThumbnail?: string;
  location?: {
    name: string;
    country: string;
    countryCode: string;
  };
  verified: boolean;
  weight: number;
  pageRank: number;
  username?: string;
  publicId?: string;
  completion: number;
  totalStrength: number;
  isSearchable: boolean;
}

interface ShortlistState {
  candidates: Candidate[];
  talentedUsers: TalentedUser[];
  selectedForComparison: string[];
  addCandidate: (candidate: Candidate) => void;
  removeCandidate: (id: string) => void;
  addTalentedUser: (user: TalentedUser) => void;
  removeTalentedUser: (ggId: string) => void;
  updateNote: (id: string, note: string) => void;
  toggleComparison: (id: string) => void;
  clearComparison: () => void;
}

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      candidates: [],
      talentedUsers: [],
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
          selectedForComparison: state.selectedForComparison.filter(
            (cId) => cId !== id
          ),
        })),
      addTalentedUser: (user) =>
        set((state) => ({
          talentedUsers: state.talentedUsers.find((u) => u.ggId === user.ggId)
            ? state.talentedUsers
            : [...state.talentedUsers, user],
        })),
      removeTalentedUser: (ggId) =>
        set((state) => ({
          talentedUsers: state.talentedUsers.filter((u) => u.ggId !== ggId),
        })),
      updateNote: (id, note) =>
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c.id === id ? { ...c, note } : c
          ),
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
    }
  )
);
