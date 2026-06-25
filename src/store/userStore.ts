import { create } from 'zustand'
import { User, Company } from '@/types'

interface UserStoreState {
  user: User | null
  companies: Company[]
  currentCompany: Company | null
  setUser: (user: User | null) => void
  setCompanies: (companies: Company[]) => void
  setCurrentCompany: (company: Company) => void
  logout: () => void
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  companies: [],
  currentCompany: null,
  setUser: (user) => set({ user }),
  setCompanies: (companies) => set({ companies }),
  setCurrentCompany: (company) => set({ currentCompany: company }),
  logout: () => set({ user: null, currentCompany: null, companies: [] }),
}))
