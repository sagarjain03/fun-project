import { create } from 'zustand'

interface BookData {
    title: string
    author: string
    content: string
    language: 'en' | 'hi'
}

interface Store {
    activeBook: BookData | null
    setActiveBook: (book: BookData) => void
    closeBook: () => void
}

export const useStore = create<Store>((set) => ({
    activeBook: null,
    setActiveBook: (book) => set({ activeBook: book }),
    closeBook: () => set({ activeBook: null }),
}))
