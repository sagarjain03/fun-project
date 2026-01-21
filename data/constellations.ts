export interface Constellation {
    id: string
    name: string
    nodes: [number, number, number][]
    rewardBook: {
        title: string
        author: string
        content: string
        language: 'en' | 'hi'
    }
}

export const HIDDEN_CONSTELLATIONS: Constellation[] = [
    {
        id: 'triad-of-truth',
        name: 'The Triad of Truth',
        nodes: [
            [10, 15, -5],
            [15, 20, -5], // Peak
            [20, 15, -5]
        ],
        rewardBook: {
            title: "The Starry Truth",
            author: "Cosmic Whisperer",
            content: "In the silence of the night,\nLines connect the points of light.\nWhat was hidden is now clearly seen,\nA bridge across the void between.",
            language: 'en'
        }
    }
]
