import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Book from '@/models/Book'

const sampleBooks = [
    {
        title: "The Road Not Taken",
        author: "Robert Frost",
        language: "en",
        content: "Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;",
        tags: ["choice", "regret", "path", "life", "confusion"],
        coordinates: { x: -10, y: 5, z: -5 }
    },
    {
        title: "Agneepath",
        author: "Harivansh Rai Bachchan",
        language: "hi",
        content: "Vriksh hon bhale khade,\nHon ghane, hon bade,\nEk patra chhanh bhi\nMaang mat, maang mat, maang mat,\nAgneepath! Agneepath! Agneepath!",
        tags: ["struggle", "determination", "fire", "persistence", "motivation"],
        coordinates: { x: 10, y: 0, z: -10 }
    },
    {
        title: "Daffodils",
        author: "William Wordsworth",
        language: "en",
        content: "I wandered lonely as a cloud\nThat floats on high o'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;",
        tags: ["nature", "lonely", "joy", "peace", "flowers"],
        coordinates: { x: 0, y: 15, z: 5 }
    },
    {
        title: "Rashmirathi",
        author: "Ramdhari Singh Dinkar",
        language: "hi",
        content: "Kshama shobhti us bhujang ko\njiske paas garal ho\nusko kya jo dantheen\nvishrahit, vineet, saral ho.",
        tags: ["power", "forgiveness", "strength", "justice", "war"],
        coordinates: { x: 5, y: -5, z: 0 }
    },
    {
        title: "Stopping by Woods on a Snowy Evening",
        author: "Robert Frost",
        language: "en",
        content: "The woods are lovely, dark and deep,\nBut I have promises to keep,\nAnd miles to go before I sleep,\nAnd miles to go before I sleep.",
        tags: ["duty", "rest", "nature", "snow", "obligations", "tired"],
        coordinates: { x: -15, y: 10, z: -15 }
    },
    {
        title: "Madhushala",
        author: "Harivansh Rai Bachchan",
        language: "hi",
        content: "Madiraalaya jaane ko ghar se\nchalta hai peene waala,\n'kis path se jaaun?' asmanjas\nmein hai wo bhola-bhaala,\nalag-alag path batlaate sab\npar main ye batlaata hoon -\n'raah pakad tu ek chala chal,\npaa jaayega Madhushala.'",
        tags: ["life", "philosophy", "journey", "confusion", "guidance"],
        coordinates: { x: 12, y: 8, z: 12 }
    },
    {
        title: "Ozymandias",
        author: "Percy Bysshe Shelley",
        language: "en",
        content: "I met a traveller from an antique land,\nWho said—“Two vast and trunkless legs of stone\nStand in the desert. . . . Near them, on the sand,\nHalf sunk a shattered visage lies...",
        tags: ["pride", "time", "decay", "legacy", "power", "ruin"],
        coordinates: { x: -8, y: -8, z: 8 }
    },
    {
        title: "Pushp Ki Abhilasha",
        author: "Makhanlal Chaturvedi",
        language: "hi",
        content: "Chah nahi main surbala ke\ngehno mein gootha jaaun,\nchah nahi, premi-mala mein\nbindh pyari ko lalchaun...",
        tags: ["sacrifice", "patriotism", "desire", "flower", "dedication"],
        coordinates: { x: 8, y: 2, z: -8 }
    }
]

export async function GET() {
    try {
        await dbConnect()
        const count = await Book.countDocuments()

        if (count === 0) {
            await Book.create(sampleBooks)
            return NextResponse.json({ message: 'Database seeded successfully', books: sampleBooks })
        } else {
            return NextResponse.json({ message: 'Database already has data', count })
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
    }
}
