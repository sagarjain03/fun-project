import { create } from 'zustand'

interface BookData {
    title: string
    author: string
    content: string
    language: 'en' | 'hi'
    _id?: string
}

export type Atmosphere = 'sunny-day' | 'sunset-glow' | 'rainy-night' | 'starry-midnight'

interface TravelerState {
    xp: number
    level: number
    inventory: BookData[]
    guestId: string | null
}

interface Store {
    activeBook: BookData | null
    setActiveBook: (book: BookData) => void
    closeBook: () => void
    atmosphere: Atmosphere
    setAtmosphere: (mode: Atmosphere) => void
    traveler: TravelerState
    setTraveler: (data: Partial<TravelerState>) => void
    collectBook: (book: BookData) => void

    // Puzzle State
    puzzleStatus: 'idle' | 'drawing' | 'solved'
    drawnLines: [number, number, number][]
    addPuzzlePoint: (point: [number, number, number]) => void
    resetPuzzle: () => void
    solvePuzzle: () => void

    // Autopilot
    targetCameraPosition: [number, number, number] | null
    targetBook: BookData | null
    setTargetCameraPosition: (pos: [number, number, number]) => void
    setTargetBook: (book: BookData) => void
    clearTargetCameraPosition: () => void

    // Audio
    isAudioEnabled: boolean
    setIsAudioEnabled: (enabled: boolean) => void
}

export const useStore = create<Store>((set) => ({
    activeBook: null,
    setActiveBook: (book) => set({ activeBook: book }),
    closeBook: () => set({ activeBook: null }),
    atmosphere: 'sunset-glow',
    setAtmosphere: (mode) => set({ atmosphere: mode }),
    traveler: { xp: 0, level: 1, inventory: [], guestId: null },
    setTraveler: (data) => set((state) => ({ traveler: { ...state.traveler, ...data } })),
    collectBook: (book) => set((state) => ({
        traveler: {
            ...state.traveler,
            inventory: [...state.traveler.inventory, book],
            xp: state.traveler.xp + 10
        }
    })),

    // Puzzle Actions
    puzzleStatus: 'idle',
    drawnLines: [],
    addPuzzlePoint: (point) => set((state) => ({ drawnLines: [...state.drawnLines, point], puzzleStatus: 'drawing' })),
    resetPuzzle: () => set({ drawnLines: [], puzzleStatus: 'idle' }),
    solvePuzzle: () => set({ puzzleStatus: 'solved' }),

    // Autopilot / Librarian
    targetCameraPosition: null, // [x, y, z]
    targetBook: null,
    setTargetCameraPosition: (pos) => set({ targetCameraPosition: pos }),
    setTargetBook: (book) => set({ targetBook: book }),
    clearTargetCameraPosition: () => set({ targetCameraPosition: null, targetBook: null }),

    // Audio
    isAudioEnabled: false,
    setIsAudioEnabled: (enabled) => set({ isAudioEnabled: enabled })
}))
